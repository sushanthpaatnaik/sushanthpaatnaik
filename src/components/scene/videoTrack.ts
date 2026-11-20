// Scroll-film video track for portrait touch: one H.264 all-intra MP4,
// demuxed with mp4box and decoded ahead of the playhead by WebCodecs
// VideoDecoder into a sliding window of VideoFrames.
//
// Why it exists: the image-sequence pipeline costs a phone one HTTP request,
// one image decode and one bitmap upload per film frame, 504 times per
// traversal — and on the 2026-11-21 phone check that still read as stutter
// even with lighter frames and worker decodes. The video track replaces all
// of it with a single streaming fetch, hardware decode, and GPU-direct
// VideoFrame draws. All-intra encoding (every frame a keyframe) makes each
// frame independently decodable, so decode-ahead works in any order with no
// inter-frame dependency chain.
//
// Engagement is proven, not assumed: engaged() flips true only after the
// moov box has parsed, the decoder has configured, and real frames have come
// out. Any failure — no WebCodecs, no H.264, a parse or decode error, or the
// stream stalling with the playhead's frame missing — flips it (back) to
// false and the caller's image-sequence pipeline owns the film again. The
// two share the frame store, so the handover is seamless in both directions.

import * as MP4Box from "mp4box";

export type FrameSink = {
  put(index: number, frame: VideoFrame): void;
  has(index: number): boolean;
  close(index: number): void;
};

export type VideoTrack = {
  engaged: () => boolean;
  setPlayhead(fi: number): void;
  destroy(): void;
};

const FPS = 24;
const FRAME_US = 1e6 / FPS;
// Fed to the decoder but not yet out: keeps decodeQueueSize small so a
// playhead jump reprioritises work that has not happened yet.
const MAX_QUEUED = 10;
// Behind the playhead the runway only serves scroll-back.
const BEHIND = 8;
// Watchdog: engaged but the playhead's frame missing this long means the
// stream stalled — hand the film back to the image sequence.
const STALL_MS = 2500;

export function createVideoTrack(opts: {
  url: string;
  frameCount: number;
  radius: number;
  sink: FrameSink;
  onEngaged: () => void;
  onFailed: () => void;
}): VideoTrack | null {
  if (typeof VideoDecoder === "undefined" || typeof EncodedVideoChunk === "undefined") return null;

  let playhead = 0;
  let engagedFlag = false;
  let failed = false;
  let destroyed = false;
  let delivered = 0;
  let lastAdvance = 0;
  const queued = new Set<number>(); // fed to the decoder, not yet out
  const samples: ({ ts: number; data: Uint8Array } | null)[] = new Array(opts.frameCount).fill(null);

  let drawProbed = false;
  const decoder = new VideoDecoder({
    output: (frame) => {
      // Probe once: drawImage(VideoFrame) is not universal (older WebKit).
      // If this browser cannot draw one, the track is useless — fail over.
      if (!drawProbed) {
        drawProbed = true;
        try {
          const c = document.createElement("canvas");
          c.width = c.height = 2;
          c.getContext("2d")!.drawImage(frame, 0, 0);
        } catch {
          frame.close();
          return fail();
        }
      }
      const idx = Math.round(frame.timestamp / FRAME_US);
      queued.delete(idx);
      if (destroyed || failed || idx < 0 || idx >= opts.frameCount) {
        frame.close();
        return;
      }
      if (idx < playhead - opts.radius || idx > playhead + opts.radius || opts.sink.has(idx)) {
        frame.close();
        want();
        return;
      }
      opts.sink.put(idx, frame);
      delivered++;
      lastAdvance = performance.now();
      if (!engagedFlag && delivered >= 4) {
        engagedFlag = true;
        opts.onEngaged();
      }
      want();
    },
    error: (e) => fail("decoder:" + String(e && (e as Error).message || e)),
  });

  function fail(reason?: unknown) {
    if (failed || destroyed) return;
    console.warn("[videoTrack] falling back to the image sequence:", reason);
    failed = true;
    engagedFlag = false;
    try {
      if (decoder.state !== "closed") decoder.close();
    } catch {
      /* already closing */
    }
    opts.onFailed();
  }

  // Feed not-yet-resident frames in playhead-distance order, inside the
  // window, while the decoder has room.
  function want() {
    if (failed || destroyed || decoder.state !== "configured") return;
    const lo = Math.max(0, playhead - BEHIND);
    const hi = Math.min(opts.frameCount - 1, playhead + opts.radius);
    for (let d = 0; d <= Math.max(hi - playhead, playhead - lo); d++) {
      const cands = d === 0 ? [playhead] : [playhead + d, playhead - d];
      for (const fi of cands) {
        if (fi < lo || fi > hi) continue;
        if (queued.has(fi) || opts.sink.has(fi)) continue;
        const s = samples[fi];
        if (!s) continue;
        if (decoder.decodeQueueSize >= MAX_QUEUED) return;
        queued.add(fi);
        try {
          // All-intra: every sample is a keyframe.
          decoder.decode(new EncodedVideoChunk({ type: "key", timestamp: s.ts, data: s.data }));
        } catch (e) {
          queued.delete(fi);
          return fail("decode-call:" + String(e));
        }
      }
    }
  }

  // ── Demux ────────────────────────────────────────────────────────────────
  let file: any;
  try {
    file = (MP4Box as any).createFile();
  } catch {
    return null;
  }
  file.onError = (e: unknown) => fail("mp4box:" + String(e));
  file.onReady = async (info: any) => {
    if (failed || destroyed) return;
    let codec = "";
    let description: Uint8Array | undefined;
    try {
      const t = info.videoTracks && info.videoTracks[0];
      if (!t || !/^avc[13]/.test(t.codec)) return fail("codec " + (t && t.codec));
      codec = t.codec;
      const trak = file.getTrackById(t.id);
      const entry = trak.mdia.minf.stbl.stsd.entries[0];
      const stream = new (MP4Box as any).DataStream(undefined, 0, (MP4Box as any).DataStream.BIG_ENDIAN);
      entry.avcC.write(stream);
      description = new Uint8Array(stream.buffer, 8); // strip the box header
      // Extraction starts here, synchronously inside onReady: mp4box
      // discards media data that arrived while extraction was off (measured:
      // an async gap before start() loses all 504 samples). The samples land
      // in `samples` whether or not the decoder is configured yet — want()
      // only feeds it once it is.
      const timescale = t.timescale;
      file.onSamples = (_id: number, _user: unknown, arr: any[]) => {
        if (failed || destroyed) return;
        for (const s of arr) {
          const idx = Math.round((s.cts * FPS) / timescale);
          if (idx >= 0 && idx < opts.frameCount && !samples[idx]) {
            samples[idx] = { ts: Math.round((s.cts * 1e6) / timescale), data: s.data };
          }
        }
        want();
      };
      file.setExtractionOptions(t.id, null, { nbSamples: opts.frameCount + 8 });
      file.start();
      // The whole file was appended in one buffer, so start() delivered
      // every sample synchronously; the demuxer is done.
      try { file.stop(); } catch { /* noop */ }
      file = null;
    } catch (e) {
      return fail(e);
    }
    // Pick a configuration the decoder actually accepts — support varies by
    // build (headless software decode rejects prefer-hardware) — then start
    // feeding from the samples already collected above.
    const candidates: VideoDecoderConfig[] = [
      { codec, description, hardwareAcceleration: "prefer-hardware", optimizeForLatency: true },
      { codec, description, optimizeForLatency: true },
      { codec, description },
      { codec },
    ];
    let configured = false;
    for (const c of candidates) {
      try {
        const support = await VideoDecoder.isConfigSupported(c);
        if (!support.supported) continue;
        decoder.configure(c);
        configured = true;
        break;
      } catch (e) {
      }
    }
    if (failed || destroyed) return;
    if (!configured) return fail("configure");
    want();
  };

  // mp4box 2.x does not reliably emit samples for media appended in chunks
  // (measured: 0 of 504 samples with 64 KB appends, 504 of 504 with one
  // whole-file append), so the file is downloaded first and demuxed in a
  // single append. The image sequence owns the film in the meantime — it is
  // already the fallback, so nothing about startup changes.
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  (async () => {
    try {
      const resp = await fetch(opts.url);
      if (!resp.ok || !resp.body) return fail();
      reader = resp.body.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (destroyed || failed) {
          try { await reader.cancel(); } catch { /* noop */ }
          return;
        }
        if (done) break;
        chunks.push(value);
        total += value.byteLength;
      }
      const whole = new Uint8Array(total);
      let off = 0;
      for (const c of chunks) { whole.set(c, off); off += c.byteLength; }
      const buf = whole.buffer as ArrayBuffer & { fileStart: number };
      buf.fileStart = 0;
      file.appendBuffer(buf);
      if (file) file.flush();
    } catch {
      fail();
    }
  })();

  // Stall watchdog, checked once a second.
  const watchdog = setInterval(() => {
    if (!engagedFlag || failed || destroyed) return;
    if (!opts.sink.has(playhead) && performance.now() - lastAdvance > STALL_MS) fail();
  }, 1000);

  return {
    engaged: () => engagedFlag && !failed,
    setPlayhead(fi: number) {
      playhead = fi;
      // Drop frames the window has left behind; they re-decode on return.
      for (let i = Math.max(0, fi - opts.radius - 24); i <= Math.min(opts.frameCount - 1, fi + opts.radius + 24); i++) {
        if ((i < fi - opts.radius || i > fi + opts.radius) && opts.sink.has(i)) opts.sink.close(i);
      }
      want();
    },
    destroy() {
      destroyed = true;
      clearInterval(watchdog);
      try {
        if (decoder.state !== "closed") decoder.close();
      } catch {
        /* noop */
      }
      if (reader) {
        try { reader.cancel(); } catch { /* noop */ }
      }
    },
  };
}
