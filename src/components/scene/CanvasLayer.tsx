import React, { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import type Lenis from "lenis";
import sceneSpark from "@/assets/story-01-spark.webp";
import { N_CHAPTERS, getChapterFromProgress, gradeOpacityAt } from "./chapterBands";

// ─── Single continuous sequence ─────────────────────────────────────────────
// The homepage plays one continuous film across the whole scroll instead of
// five independently-cut chapter clips.
//
// The frame advances LINEARLY with scroll — constant frames-per-pixel across
// the entire page. This is a smoothness requirement, not a stylistic choice:
// playback smoothness is governed by the sparsest stretch of the timeline,
// since that is where the image visibly steps.
//
// An earlier version mapped each chapter band to the frame range whose
// content best matched that chapter's copy, which stretched some stretches
// and compressed others. Measured result was a 5.7:1 density spread —
// Material advanced a frame every 1.5vh while Ecosystem and Future Systems
// went 6.3vh and 8.3vh between frames. The closing third of the page
// visibly stuttered on desktop. For reference the old five-clip system's
// worst case was 3.8vh/frame, so that mapping was ~2x coarser than what it
// replaced. Uniform mapping puts every chapter at 3.2vh/frame — better than
// the old system everywhere.
//
// Content still lands where it should because the film's own arc already
// follows the page's: Earth/India opening under Origin, the lab and graphene
// sheet under Founder/Material, the lattice under Industrial Translation
// ("One lattice. Many industries."), and the sunset facility walk under
// Future Systems. Verify frame-to-chapter alignment before changing
// CHAPTER_BANDS or the frame count — but do not reintroduce a non-uniform
// map to "fix" alignment; that trades a visible stutter for a subtlety.
const SEQUENCE_PATH = "founder-film";
// 381 frames: the native-1080p 24fps/8s master (192 frames) interpolated to
// 48fps — exactly 2x — so every synthesised frame sits at the midpoint of two
// real ones. Desktop frames are the source's own 1920x1080 with no rescaling.
// Touch has two sets: /p/ is a 500x1080 centre crop of the same master, for
// portrait phones, and /m/ is a 854x480 downscale, for landscape. See
// framesPath for which goes where and why.
//
// It was 476, a 2.479x resample of the same master, and the non-integer ratio
// is what made it shake. A fractional resample cannot place every synthesised
// frame evenly between two real ones, so the sequence steps unevenly on a
// repeating period. Measured on the served frames: the worst per-frame changes
// in step size fell at frames 19, 24, 29, 34 and 68, 73, 78 — a regular 5-frame
// beat. Scrolling through that reads as judder rather than motion, and it is
// baked into the images, which is why every renderer-side fix left it alone.
//
// At 2x the beat is gone: median jerk 0.390 -> 0.060, worst 1.33 -> 0.95, and
// the remaining worst frames are irregular and content-driven rather than
// periodic. Density is 2.6vh/frame against the old 2.1 — slightly coarser
// steps, but even ones, and the sequence is 88MB against 122MB.
//
// If this is ever regenerated, keep the frame count an integer multiple of the
// master's 192. 381 is 192 real + 189 synthesised; ffmpeg drops the trailing
// interpolation, which is harmless because the spacing stays uniform.
const FRAME_COUNT   = 381;
const LAST_FRAME    = FRAME_COUNT - 1;

function getFrameIndex(sp: number): number {
  const s = Math.max(0, Math.min(sp, 1));
  return Math.round(s * LAST_FRAME);
}

/** Where the playhead really is, before rounding to a frame. */
function getFramePosition(sp: number): number {
  const s = Math.max(0, Math.min(sp, 1));
  return s * LAST_FRAME;
}

/**
 * Sub-frame blend levels.
 *
 * 381 frames spread over 1000vh of travel is one frame per ~24px of scroll at
 * a 900px viewport. Scroll slowly — a trackpad, or the tail of a wheel lerp —
 * and the film visibly holds an image for several rendered frames and then
 * steps to the next. That step is the whole of what reads as "not smooth"
 * about the background: everything else on the page is a continuous function
 * of scroll, and the footage was the one thing quantised.
 *
 * So the playhead's fractional part cross-dissolves frame n into frame n+1.
 * 12 levels puts a visual step every ~2px of scroll, an order of magnitude
 * below what the eye resolves as a jump, and caps the redraw rate at roughly
 * what the film already cost — the alpha is quantised for the same reason the
 * colour grade is, so a stationary page stops redrawing rather than dithering
 * against a continuously-varying alpha.
 *
 * The blend is desktop-only. Touch carries half-density frames through a
 * sliding window that is already the tightest part of the memory budget, and
 * a second full-size drawImage per redraw is not a cost worth paying on the
 * device that has the least headroom for it — a phone's shorter travel per
 * frame also makes the stepping far less visible.
 */
const BLEND_STEPS = 12;


// ─── Per-chapter color grades ────────────────────────────────────────────────
// Applied as mix-blend-mode:color overlays — replaces hue+saturation of the
// canvas frames while preserving luminance, matching a film LUT grade.
// opacity is the active strength. The layers hand over in sequence as a pure
// function of scroll position — see gradeOpacityAt in chapterBands.ts and the
// write loop in the render tick. They used to cross-fade on a 1.4s CSS
// transition fired by a discrete chapter step, which is what made the tint
// keep moving after the scroll had stopped.
//
// Strengths halved from 0.14–0.21 to 0.07–0.105.
//
// The hues are unchanged — the grade still tints each chapter — but at the old
// strength the swing between neighbours was reading as a fault rather than as
// grading. Material Intelligence is a cool blue and Industrial Translation a
// warm amber, and the two sit on *one continuous shot*: the founder over the
// lattice runs unbroken from ~0.32 to ~0.46. So the same physical footage
// visibly changed colour as the reader scrolled past a boundary, with no cut
// to justify it. Halving keeps the chapter identity and lets the footage's own
// colour carry the frame.
const CHAPTER_GRADES: ReadonlyArray<{
  /** sRGB stops as [offset 0-1, "#rrggbb"]. One stop = a flat fill. */
  stops: ReadonlyArray<readonly [number, string]>;
  /** CSS gradient angle in degrees (0 = bottom-to-top, clockwise). */
  angle: number;
  opacity: number;
}> = [
  // Origin — cold blue atmosphere, warm gold horizon. Holds through the
  // in-chapter dissolve into the lab, so it stays neutral enough for both.
  { stops: [[0.5, "#004c9b"], [1, "#c18100"]], angle: 155, opacity: 0.075 },
  // Material Intelligence — graphene blue: deep, cool, metallic
  { stops: [[0, "#004a6d"]], angle: 0, opacity: 0.09 },
  // Industrial Translation — warm industrial amber
  { stops: [[0, "#be5a0a"]], angle: 0, opacity: 0.085 },
  // Recognition & Ecosystem — prestige white-gold
  { stops: [[0.3, "#e2d7ba"], [1, "#d1ab64"]], angle: 160, opacity: 0.07 },
  // Future Systems — electric blue-cyan
  { stops: [[0, "#005dd6"]], angle: 0, opacity: 0.105 },
] as const;

/* How many discrete opacity levels each chapter grade ramps through.
   See the write loop in the render tick: these are mix-blend-mode layers, so
   an opacity write costs a full-viewport re-blend. 20 levels of a 0.07-0.105
   peak is a ~0.005 step — invisible at that strength — and turns a per-frame
   write into roughly one frame in eight. */
const GRADE_STEPS = 20;

/* How far the draw loop may search for a substitute when the exact frame is
   not resident. 14 of 476 frames is under 3 % of the sequence — the same shot,
   a few hundredths of a second of footage. Past that a substitution stops
   being a substitution and becomes a cut to a different scene. */
const FALLBACK_RADIUS = 14;

type Bitmaps = (ImageBitmap | null)[];

interface CanvasLayerProps {
  onReady?: () => void;
  onProgress?: (pct: number) => void;
  lenisRef?: React.MutableRefObject<Lenis | null>;
}

/**
 * Single-sequence image canvas background.
 *
 * Master timeline: scrollYProgress [0, 1]
 *   → getFrameIndex(sp), a piecewise-linear map through FRAME_BREAKS
 *   → nearest-loaded-frame search
 *
 * Preload policy: a sliding window of frames around the current index on
 * both desktop and touch — see the memory-budget note in the effect for the
 * measured reason desktop can no longer retain the whole sequence.
 * Decode: createImageBitmap — GPU-ready, zero latency at draw time.
 * Draw: object-fit:cover with DPR-correct canvas buffer.
 * Reduced-motion: static poster, no canvas.
 */
export default function CanvasLayer({ onReady, onProgress, lenisRef }: CanvasLayerProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  // Grade state the canvas was last painted with, so the tick can skip a
  // redraw when neither the film nor the tint has moved.
  const lastGradeIdxRef   = useRef(-1);
  const lastGradeAlphaRef = useRef(-1);
  // Sub-frame dissolve state, on the same skip-the-redraw contract.
  const lastBlendToRef    = useRef(-1);
  const lastBlendAlphaRef = useRef(-1);
  // Frame index the playhead is on right now, written every tick before any
  // early return. Distinct from lastFrameRef, which is the last frame actually
  // *painted* — the two diverge exactly when the renderer is stuck, which is
  // when the difference matters most.
  const playheadRef       = useRef(-1);
  const reduce       = useReducedMotionSafe();
  const rafRef       = useRef(0);
  const notifiedRef  = useRef(false);
  const lastFrameRef = useRef(-1);
  const lastChapterRef = useRef(-1);
  // Frame index the desktop retention window was last recentred on.
  const lastEvictAtRef = useRef(-1);

  // bitmaps[frameIdx] — populated lazily as frames decode.
  const bitmapsRef = useRef<Bitmaps>(Array(FRAME_COUNT).fill(null));
  // loading[frameIdx] — true once fetch for that frame has started.
  const loadingRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  // chapterLoading[chapterIdx] — true once a load pass for that chapter's
  // frame region has started. Mirrors the old per-group loadingRef exactly,
  // just keyed to a slice of the single sequence instead of a separate file.
  // In-flight fetch() controllers, keyed by frame index — lets eviction
  // actually cancel a request instead of only discarding it once it
  // finishes. See the note above evictExcept for why this matters under
  // heavy throttling: without it, stale fetches for frames the user has
  // already scrolled past keep consuming the connection pool and the
  // throttled bandwidth budget, starving the frames actually on screen.
  const abortControllersRef = useRef<Map<number, AbortController>>(new Map());
  // Generation counter — incremented on cleanup so in-flight fetches from a
  // previous effect run (React StrictMode double-invoke) are discarded
  // without duplicating the bitmap array into memory.
  const genRef = useRef(0);

  // Reduced-motion path — no canvas, signal ready immediately.
  useEffect(() => {
    if (!reduce) return;
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      onReady?.();
    }
  }, [reduce, onReady]);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let destroyed = false;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // ── Memory budget ────────────────────────────────────────────────────────
    // A decoded ImageBitmap costs width×height×4 bytes, so the masters at
    // 1920×1080 are ~8.3 MB each and the 854×480 mobile variants ~1.6 MB.
    //
    // Touch: fetch the /m/ variants and retain a sliding window, same
    // mechanism as desktop, just a smaller radius. iOS Safari's per-tab
    // ceiling is ~300 MB and exceeding it kills the tab outright; a ±55
    // window holds 111 frames ≈ 182 MB of bitmaps, comfortably inside it.
    //
    // Touch used to load every 2nd frame and retain the active chapter ±1
    // instead. Retaining a whole chapter-triple at full density would be
    // ~260 frames ≈ 430 MB — over the ceiling — so density was what got
    // traded away, and the phone played the film at half the frame rate:
    // measured 238 distinct frames across the page, one frame change per
    // 4.2vh against desktop's 2.1. That stepping is what reads as "not
    // smooth" on a phone, most of all through the slow holds where the
    // image is the only thing moving. Capping *residency* rather than
    // density buys the frames back at a third of the memory.
    //
    // Desktop: retain a sliding window of frames around the current index.
    // Retaining the whole sequence (the previous behaviour, which was
    // survivable at 720p) costs 472 × 8.3 MB ≈ 3.9 GB of bitmaps at 1080p —
    // measured at 5.2 GB process RSS against a 0.7 GB baseline, enough to
    // thrash or kill the tab on an 8 GB machine. A ±70 window holds ~140
    // frames ≈ 1.2 GB, which is lower than the pre-1080p build actually
    // used. Evicted frames re-fetch from the HTTP cache (30-day
    // Cache-Control on /sequences/) so scrolling back costs a decode, not a
    // download.
    // Touch gets one of two sets, chosen by what the viewport actually needs.
    //
    // /m/ is 854x480 — a landscape frame. Cover-fitting that into a portrait
    // phone canvas scales by height: at 390x844 the canvas is 585x1266, so the
    // 480-tall frame is blown up 2.64x and only 26% of the file's pixels ever
    // reach the screen. The other 74% is downloaded and cropped away.
    //
    // /p/ is 500x1080, a pure centre crop of the 1920x1080 master — no
    // resampling, so these are the master's own pixels. 0.463 is the aspect
    // every current phone lands on (390x844, 430x932 and 375x812 are all
    // 0.461-0.462), which puts the draw scale at 1.17x and the on-screen share
    // at 100%. The centre is safe: measured across the sequence, the detail
    // centroid stays between 0.394 and 0.531 of the frame width, and this crop
    // spans 0.370-0.630.
    //
    // Measured: 20.2 MB against /m/'s 21.1 MB, and PSNR 42.1 dB against the
    // master where /m/ manages 37.8 dB against its own ideal downscale. Sharper
    // and slightly smaller, which is why this is a resolution fix rather than a
    // quality trade.
    //
    // Landscape touch — a tablet, or a rotated phone — keeps /m/, where the
    // reasoning runs the other way. The choice is made once at mount; rotating
    // mid-visit keeps the set it started with rather than re-fetching the film.
    const isPortrait = window.innerHeight >= window.innerWidth;
    const framesPath = (path: string) =>
      isTouch ? `${path}/${isPortrait ? "p" : "m"}` : path;
    /** Native size of whichever set this device is fetching. */
    const SOURCE_W = isTouch ? (isPortrait ? 500 : 854) : 1920;
    const SOURCE_H = isTouch ? (isPortrait ? 1080 : 480) : 1080;
    const makeBitmap = (blob: Blob): Promise<ImageBitmap> => createImageBitmap(blob);
    const frameStep = 1;
    const RETAIN_RADIUS = isTouch ? 55 : 70;

    // ── Critical frame threshold ──────────────────────────────────────────────
    // Scroll is locked until this many opening frames are decoded and drawn.
    // Kept intentionally small: the first 4 frames (desktop) or 2 (mobile)
    // are enough for smooth initial scroll.
    const criticalCount = isTouch ? 2 : 4;
    let criticalLoaded  = 0;


    // Close + drop every retained bitmap outside [lo, hi] and mark it
    // reloadable; ABORT anything still in-flight for those frames instead
    // of letting the throttled connection finish downloading bytes for a
    // frame that's already been decided to be unneeded. Touch only —
    // desktop keeps everything for instant scroll-back, unchanged.
    //
    // Without the abort, a fast scroll through several chapters leaves a
    // backlog of stale fetches from chapters already passed sitting in the
    // browser's (bandwidth- and connection-limited) queue ahead of the
    // frames the user is actually looking at now — measured as loadedCount
    // stuck near 0 while loadingCount climbed to 50 and the canvas froze on
    // a stale frame for the remaining ~40% of the scroll.
    const evictExcept = (lo: number, hi: number) => {
      for (let f = 0; f < FRAME_COUNT; f++) {
        if (f >= lo && f <= hi) continue;
        // Drop queued-but-unstarted work for this frame too. Without it the
        // pump would happily go on fetching frames the window has already
        // ruled out, which is the same wasted bandwidth the abort below
        // exists to prevent — just one stage earlier.
        pending.delete(f);
        if (loadingRef.current[f] && !bitmapsRef.current[f]) {
          abortControllersRef.current.get(f)?.abort();
          abortControllersRef.current.delete(f);
          loadingRef.current[f] = false;
        }
        if (bitmapsRef.current[f]) {
          bitmapsRef.current[f]!.close();
          bitmapsRef.current[f] = null;
          loadingRef.current[f] = false;
        }
      }
    };

    const notifyReady = () => {
      if (notifiedRef.current) return;
      notifiedRef.current = true;
      // Always push to 100 % so the Loader exits — covers the fallback-timer
      // path where criticalCount frames never fully loaded.
      onProgress?.(100);
      onReady?.();
      // No second-chapter prefetch. This used to call loadChapterRegion(1),
      // which is where 76 of the 149 pre-scroll frames came from. The
      // retention window already queues +/-RETAIN_RADIUS around the playhead
      // on its first tick and keeps refilling as the reader moves, so a whole
      // extra chapter bought nothing that the window would not fetch anyway —
      // it only bought it sooner, at the cost of saturating the connection
      // before the first gesture.
      lastChapterRef.current = -1;
    };

    // Hard fallback — dismiss loader if critical frames never arrive.
    // 3s on mobile / 4s on desktop: enough for 3G while still being a
    // reasonable worst-case UX ceiling.
    const fallbackMs = isTouch ? 3_000 : 4_000;
    const fallback = window.setTimeout(notifyReady, fallbackMs);

    // ── Canvas sizing ────────────────────────────────────────────────────────
    // Cap DPR at 1.5 on mobile. iPhone 15 Pro reports DPR=3 which creates
    // a 1170×2532 buffer — 9× more pixels than needed. At 1.5 the buffer is
    // 585×1266: sharp at phone viewing distance, ~4× faster draws.
    const syncSize = () => {
      const rawDpr = window.devicePixelRatio || 1;
      // The canvas carries the film and nothing else — no text, no UI — so its
      // resolution should follow the footage rather than the screen. Past a
      // canvas bigger than the source there is no detail left to reveal; the
      // extra pixels are the GPU upscaling harder and compositing more area for
      // an identical picture. Capping at the source size makes the portrait
      // set land 1:1 (390x844 -> 499x1080 against a 500x1080 frame) and cuts
      // the buffer 27% against the flat 1.5 cap.
      //
      // The cap now applies to desktop too, and reads both axes rather than
      // height alone. Measured before: a Retina laptop at 1440x900 built a
      // 2880x1800 backing store and drew the 1920x1080 frame into it at 1.67x,
      // and a Retina 1920x1080 display drew at 2.00x — 20.7 MB and 33.2 MB of
      // canvas for a picture whose detail ceiling is 1080p either way. Both
      // now land at 1.00x. Nothing is resampled down; the source is still the
      // limit, and the limit is what the canvas is now sized to.
      //
      // Both axes, because the draw is object-fit cover: the applied scale is
      // max(w/SOURCE_W, h/SOURCE_H), so keeping it at or below 1 needs the
      // smaller of the two ratios. Height alone left landscape touch at 1.22x.
      const fit = Math.min(
        SOURCE_W / Math.max(1, window.innerWidth),
        SOURCE_H / Math.max(1, window.innerHeight),
      );
      // Floored at 1: on a monitor wider than the film, dropping below 1 would
      // trade real on-screen pixels for memory, which is under-resolving.
      const dpr = Math.max(1, isTouch
        ? Math.min(rawDpr, 1.5, fit)
        : Math.min(rawDpr, 2, fit));
      const nW  = Math.round(window.innerWidth  * dpr);
      const nH  = Math.round(window.innerHeight * dpr);
      if (canvas.width !== nW || canvas.height !== nH) {
        canvas.width  = nW;
        canvas.height = nH;
        lastFrameRef.current = -1; // force redraw after resize
      }
    };
    syncSize();
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(syncSize)
      : null;
    if (ro) ro.observe(document.documentElement);

    // ── Grade fill styles, built once per canvas size ────────────────────────
    // A CSS `Ndeg` gradient runs clockwise from "to top", and its line is
    // sized so the box corners land on 0 % and 100 %. Canvas wants two points,
    // so project the direction vector out from the centre by half that length.
    const gradeStyleCache: (string | CanvasGradient | null)[] = new Array(N_CHAPTERS).fill(null);
    let gradeStyleFor = 0; // canvas.width the cache was built against
    const gradeStyle = (i: number): string | CanvasGradient => {
      const cW = canvas.width, cH = canvas.height;
      if (gradeStyleFor !== cW) { gradeStyleCache.fill(null); gradeStyleFor = cW; }
      const cached = gradeStyleCache[i];
      if (cached) return cached;
      const g = CHAPTER_GRADES[i];
      let style: string | CanvasGradient;
      if (g.stops.length === 1) {
        style = g.stops[0][1];
      } else {
        const rad = (g.angle * Math.PI) / 180;
        const dx = Math.sin(rad), dy = -Math.cos(rad);
        const len = Math.abs(cW * dx) + Math.abs(cH * dy);
        const grad = ctx.createLinearGradient(
          cW / 2 - (dx * len) / 2, cH / 2 - (dy * len) / 2,
          cW / 2 + (dx * len) / 2, cH / 2 + (dy * len) / 2,
        );
        for (const [off, col] of g.stops) grad.addColorStop(off, col);
        style = grad;
      }
      gradeStyleCache[i] = style;
      return style;
    };

    // ── object-fit:cover draw in physical-pixel space ────────────────────────
    // The chapter grade is composited into the same canvas, in the same pass,
    // rather than by a mix-blend-mode div stacked over it. See the note on the
    // tick's redraw condition for why.
    const cover = (bmp: ImageBitmap, cW: number, cH: number, alpha: number) => {
      const scale = Math.max(cW / bmp.width, cH / bmp.height);
      const dW    = bmp.width  * scale;
      const dH    = bmp.height * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(bmp, (cW - dW) / 2, (cH - dH) / 2, dW, dH);
    };

    const drawBitmap = (
      bmp: ImageBitmap,
      gradeIdx: number,
      gradeAlpha: number,
      blendBmp: ImageBitmap | null = null,
      blendAlpha = 0,
    ) => {
      const cW = canvas.width;
      const cH = canvas.height;
      ctx.globalCompositeOperation = "source-over";
      cover(bmp, cW, cH, 1);
      // The partner frame lands on top at the fractional alpha. Both frames
      // are opaque and temporally adjacent, so source-over at alpha a is a
      // true linear cross-dissolve between them — the grade below then reads
      // the dissolved result, exactly as it would read a real intermediate.
      if (blendBmp && blendAlpha > 0) cover(blendBmp, cW, cH, blendAlpha);
      ctx.globalAlpha = 1;
      if (gradeIdx >= 0 && gradeAlpha > 0) {
        // `color` takes hue+chroma from the fill and keeps the frame's own
        // luminance — the same operator as CSS mix-blend-mode: color, so the
        // result is identical to the overlay it replaces.
        ctx.globalCompositeOperation = "color";
        ctx.globalAlpha = gradeAlpha;
        ctx.fillStyle = gradeStyle(gradeIdx);
        ctx.fillRect(0, 0, cW, cH);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };

    // ── Frame loader ─────────────────────────────────────────────────────────
    // ── Bounded, playhead-prioritised fetch queue ────────────────────────────
    //
    // Everything below used to call loadFrame directly, which fires a fetch
    // per call with no ceiling. Measured before this: 132 concurrent frame
    // requests on desktop and 56 on mobile, against the 6-ish the chapter
    // loader's serial batching was written to enforce. The batching was real
    // but the retention top-up defeated it — on each recentre it walked the
    // whole +/-70 window in one tick, up to 141 loadFrame calls.
    //
    // On a fast link unbounded concurrency is merely wasteful. On a slow one
    // it is the whole problem: with 76 requests sharing 1.6 Mbit, the frame
    // the reader is looking at completes no sooner than the 76th, because
    // they all progress together. Measured on a Slow 4G profile, six frames
    // arrived in ten seconds.
    //
    // So: a pending set plus a pump that keeps at most MAX_INFLIGHT fetches
    // alive. Priority is not stored — it is computed at dequeue time as
    // distance from wherever the playhead is *now*. That means a scrollbar
    // jump reprioritises the entire backlog for free, with no queue to
    // rebuild and no requests to cancel: whatever is nearest the new position
    // simply goes next.
    // The cap adapts to measured throughput, because a fixed one cannot serve
    // both links. Capping at 12 fixed the desktop waste but barely moved Slow
    // 4G: at ~200 KB/s and 176 KB a frame, twelve in parallel means all twelve
    // finish together at ~10s rather than the first finishing at 0.9s.
    // Measured on that profile, the fourth frame — the one that dismisses the
    // preloader — landed at 7.5s.
    //
    // Throughput is measured here rather than read from
    // navigator.connection.effectiveType, which is unevenly implemented, absent
    // on desktop Safari and Firefox, and reports the network *class* rather
    // than the bandwidth actually available to this tab. An EWMA over frames
    // this page has really fetched needs no API and adapts to a link that
    // degrades mid-visit.
    const MAX_INFLIGHT = isTouch ? 6 : 12;
    // Ramp UP from a small cap rather than down from a large one. Starting
    // optimistic made the adaptation useless: the very first burst is the one
    // that decides how long the preloader sits there, and it goes out before
    // any sample exists. Measured on Slow 4G, starting at 12 put the fourth
    // frame — the one that dismisses the loader — at 7.5s, and the cap only
    // dropped afterwards, when it no longer mattered.
    //
    // Starting small costs a fast link almost nothing: four frames at ~40ms
    // each is one extra round-trip before the first sample raises the cap.
    const START_INFLIGHT = isTouch ? 3 : 4;
    let kbps = 0;                        // 0 = unmeasured
    const noteThroughput = (bytes: number, ms: number) => {
      if (ms <= 0 || bytes <= 0) return;
      const sample = bytes / 1024 / (ms / 1000);
      kbps = kbps === 0 ? sample : kbps * 0.7 + sample * 0.3;
    };
    // Few enough slots that the frames the reader needs first complete first,
    // instead of every frame progressing together and none arriving.
    const capNow = () =>
      kbps === 0 ? START_INFLIGHT
      : kbps < 350 ? 2
      : kbps < 900 ? 4
      : MAX_INFLIGHT;

    const pending = new Set<number>();
    let inFlight = 0;

    const enqueue = (fi: number) => {
      if (fi < 0 || fi >= FRAME_COUNT) return;
      if (bitmapsRef.current[fi] || loadingRef.current[fi]) return;
      pending.add(fi);
    };

    const pump = () => {
      while (inFlight < capNow() && pending.size > 0) {
        const head = playheadRef.current >= 0 ? playheadRef.current : 0;
        let best = -1, bestD = Infinity;
        for (const f of pending) {
          const d = Math.abs(f - head);
          if (d < bestD) { bestD = d; best = f; }
        }
        if (best < 0) return;
        pending.delete(best);
        if (bitmapsRef.current[best] || loadingRef.current[best]) continue;
        inFlight++;
        loadFrame(best).finally(() => { inFlight--; pump(); });
      }
    };

    const loadFrame = (fi: number): Promise<void> => {
      if (fi < 0 || fi >= FRAME_COUNT) return Promise.resolve();
      if (loadingRef.current[fi] || bitmapsRef.current[fi]) return Promise.resolve();
      loadingRef.current[fi] = true;
      const gen = genRef.current; // capture generation at load-start
      const pad = String(fi + 1).padStart(4, "0");
      const isCritical = fi < criticalCount;
      // NOTE: do NOT mark non-critical frames `priority: "low"`. Measured
      // 2026-07 on the old per-group loader: doing so regressed the
      // homepage from Perf 71 → 39, with Total Blocking Time 210 ms →
      // 8,160 ms and LCP 6.3 s → 15.4 s. Deprioritising the fetches bunches
      // their completion, so the createImageBitmap decodes all land on the
      // main thread at once instead of arriving spread out. Browser-default
      // priority keeps the decode work naturally staggered. Left explicit
      // so it isn't "optimised" again.
      const controller = isTouch ? new AbortController() : undefined;
      if (controller) abortControllersRef.current.set(fi, controller);
      const opts: RequestInit = {
        ...(fi === 0 || isCritical ? { priority: "high" as const } : {}),
        ...(controller ? { signal: controller.signal } : {}),
      };
      const startedAt = performance.now();
      return fetch(`/sequences/${framesPath(SEQUENCE_PATH)}/frame_${pad}.webp`, opts)
        .then(r  => r.blob())
        .then(b  => {
          // Timed at the blob, not after decode: this is meant to measure the
          // link, and folding decode time in would shrink the queue on a slow
          // CPU, which is the opposite of what helps there.
          noteThroughput(b.size, performance.now() - startedAt);
          return makeBitmap(b);
        })
        .then(bmp => {
          abortControllersRef.current.delete(fi);
          if (destroyed || genRef.current !== gen) { bmp.close(); return; }
          // Discard if this frame has since fallen outside the active
          // chapter's retained range — otherwise a late frame would re-bloat
          // memory for a now-offscreen part of the sequence. In practice
          // evictExcept's abort() catches most of these before they even
          // get this far; this is the fallback for a fetch that was already
          // past its network round-trip when eviction ran.
          //
          // CRITICAL: clear the frame's loading flag when we discard.
          // Without this the frame was permanently poisoned — loadFrame()
          // early-returns on `loadingRef.current[fi]`, so a frame whose
          // bitmap was discarded in flight could never be re-fetched. This
          // exact bug (at group granularity) was the mobile "scroll gets
          // stuck / no longer cinematic" freeze: measured on a throttled
          // iPhone profile the canvas froze for 27 of 41 scroll samples.
          // Range-check against the PLAYHEAD, not against the last frame that
          // was painted. Those are the same thing while the film is keeping
          // up, and they are catastrophically different when it is not.
          //
          // This used to read lastFrameRef, which only advances on a
          // successful draw. Jump the scroll forward — a scrollbar drag, a
          // hash link, the browser restoring position on reload — and the
          // playhead lands at, say, frame 160 while the last painted frame is
          // still 0. The loader correctly requests 160 and its neighbours;
          // every one of them then arrives here, fails `160 > 0 + 70`, and is
          // thrown away. The flag is cleared, so it is requested again, and
          // discarded again. The canvas can never paint a frame near the
          // playhead, so lastFrameRef can never advance, so the window can
          // never move: a livelock, not a slow load.
          //
          // Measured at 1440x900 on the local build: park at 42% of the page
          // by wheeling there and the canvas fingerprints 80 and keeps moving;
          // arrive at the same scrollY by one window.scrollTo and it
          // fingerprints 34 — Origin's opening, under Recognition's copy — and
          // stays 34 through twelve further wheel notches and fifteen seconds.
          // This is the "same position looks different depending on how you
          // got there" report, and the reason forward scrollbar jumps never
          // recovered while backward ones into resident frames took 500ms.
          //
          // The playhead is also the centre evictExcept uses, so the discard
          // test and the retention window now describe the same range instead
          // of drifting apart.
          const centre = playheadRef.current >= 0 ? playheadRef.current : lastFrameRef.current;
          if (centre >= 0) {
            if (fi < centre - RETAIN_RADIUS || fi > centre + RETAIN_RADIUS) {
              bmp.close();
              loadingRef.current[fi] = false; // allow a retry once in range
              return;
            }
          }
          bitmapsRef.current[fi] = bmp;
          if (fi < criticalCount && criticalLoaded < criticalCount) {
            criticalLoaded++;
            onProgress?.(Math.round((criticalLoaded / criticalCount) * 100));
            if (criticalLoaded >= criticalCount) notifyReady();
          }
        })
        .catch(() => {
          abortControllersRef.current.delete(fi);
          loadingRef.current[fi] = false;
          // Includes the expected AbortError from evictExcept() cancelling
          // this exact fetch — resetting loadingRef is the correct outcome
          // either way (a genuine network error or a deliberate cancel),
          // since it just means "eligible for a fresh loadFrame() call
          // later if this frame becomes relevant again."
          //
          // Frame-0 error: unblock immediately rather than hanging.
          // Other critical-frame errors: count toward threshold AND report
          // progress so the bar advances even through CDN failures.
          if (fi === 0) { notifyReady(); return; }
          if (fi < criticalCount && criticalLoaded < criticalCount) {
            criticalLoaded++;
            onProgress?.(Math.round((criticalLoaded / criticalCount) * 100));
            if (criticalLoaded >= criticalCount) notifyReady();
          }
        });
    };
    // The chapter-region loader that used to live here is gone. It batched
    // touch fetches in serial groups of six, which was the right instinct,
    // but the retention top-up walked the whole window in one tick and
    // defeated it — measured at 132 concurrent requests on desktop. The
    // bounded queue above now owns every fetch, so a second loader with its
    // own pacing rules would only be able to disagree with it.

    // ── RAF render loop ──────────────────────────────────────────────────────
    const tick = () => {
      if (!destroyed) rafRef.current = requestAnimationFrame(tick);

      // Read lenis.scroll — the *animated* position, the one Lenis has written
      // to the document and the one the visitor is actually looking at.
      //
      // This used to read lenis.targetScroll, the un-eased destination, on the
      // theory that it made frame updates feel instant. It did, but it made
      // them instant relative to the wrong clock: the text layer runs on
      // framer-motion's useScroll, which reads window.scrollY, so the footage
      // ran a whole lerp ahead of the headings. At lerp 0.12 that is a couple
      // of hundred pixels of scroll — the film reaching the next chapter's
      // imagery while its heading was still arriving. One clock for both.
      //
      // Falls back to window.scrollY when Lenis isn't ready, and on touch,
      // where Lenis is never constructed and window.scrollY *is* the position.
      const lenis = lenisRef?.current;
      const rawSp = lenis && lenis.limit > 0
        ? lenis.scroll / lenis.limit
        : window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const sp = Math.max(0, Math.min(rawSp, 1));
      const fi = getFrameIndex(sp);
      playheadRef.current = fi;
      const chapter = getChapterFromProgress(sp);

      // Sub-frame position, quantised. `fi` stays the rounded index — every
      // loader, evictor and fallback path below is keyed on it and must not
      // change — while `blendTo`/`blendAlpha` describe the dissolve painted on
      // top of it. Rounding means the partner is fi-1 below the midpoint and
      // fi+1 above it, and the alpha runs 0 → 0.5 in both directions.
      let blendTo = -1;
      let blendAlpha = 0;
      if (!isTouch) {
        const frac = getFramePosition(sp) - fi;   // -0.5 .. +0.5
        const partner = frac >= 0 ? fi + 1 : fi - 1;
        if (partner >= 0 && partner < FRAME_COUNT) {
          const a = Math.round(Math.abs(frac) * BLEND_STEPS) / BLEND_STEPS;
          if (a > 0) { blendTo = partner; blendAlpha = a; }
        }
      }

      // Colour grade — a pure function of scroll position, written every frame.
      //
      // It used to be a CSS `transition: opacity 1.4s ease` fired inside the
      // `chapter !== last` branch below: a wall-clock tween triggered by a
      // discrete step, on a page where every other moving thing is scroll-
      // linked. Stop mid-hand-over and the frame kept re-tinting for two more
      // seconds; scrub and the tint trailed the footage it was grading. See
      // GRADE_FADE in chapterBands.ts for the measurements.
      //
      // Which grade is live, and how strong — quantised.
      //
      // The grades used to be five full-viewport mix-blend-mode:color divs
      // stacked over the canvas. That is the most expensive thing on the page
      // to animate: the blend is defined against the backdrop, so an opacity
      // change cannot be composited on the GPU alone — it re-blends and
      // recomposites the whole viewport, on top of the canvas already drawing
      // a new 1920x1080 bitmap that same frame. Measured at 1440x900 across
      // the Recognition -> Future hand-over, 56 % of frames triggered one.
      // On an iPhone that was visible as the frame juddering through the
      // transition.
      //
      // Now the tint is drawn into the canvas in the same pass as the bitmap
      // (see drawBitmap), so it costs one extra fillRect on a surface that was
      // being redrawn anyway and no DOM blending at all.
      //
      // Still quantised, because the grade now shares the frame's redraw
      // condition: a continuously-varying alpha would force a redraw on every
      // frame even where the film itself has not advanced. At a peak of 0.105
      // one of GRADE_STEPS levels is ~0.005 of alpha on a colour blend, which
      // cannot render as a visible edge. Endpoints snap so a grade lands on a
      // true 0 and a true peak rather than drifting near them.
      let gradeIdx = -1;
      let gradeAlpha = 0;
      for (let i = 0; i < N_CHAPTERS; i++) {
        const peak = CHAPTER_GRADES[i].opacity;
        const raw = gradeOpacityAt(sp, i) * peak;
        if (raw <= 0.002) continue;
        gradeIdx = i;
        gradeAlpha = raw >= peak - 0.002
          ? peak
          : Math.round(raw / (peak / GRADE_STEPS)) * (peak / GRADE_STEPS);
        break; // sequenced — at most one grade is ever live
      }

      // On chapter change: preload active±1's frame regions — the direct
      // equivalent of the old on-group-change `loadGroup(gi); loadGroup(gi±1)`
      // trigger.
      if (chapter !== lastChapterRef.current) {
        lastChapterRef.current = chapter;
        // Chapter-region preloading is gone on both platforms now. The
        // argument that removed it for touch — "a chapter-triple region load
        // would queue ~260 full-density frames the window is about to throw
        // away" — was always true of desktop as well, and the numbers say so:
        // a chapter triple spans ~228 of the 381 frames while the retention
        // window is 141 wide, so the loader was guaranteed to evict its own
        // work before the playhead reached it and then re-queue it at the next
        // chapter change.
        //
        // Measured at 1440x900, scrolling 0 → 4500px of a 9000px page: 471
        // frame requests against ~190 frames actually crossed, i.e. 2.5x
        // redundant. Every one of those is a fetch and a createImageBitmap
        // decode, which is where the blocking on this page lives — 19 long
        // tasks totalling 2128ms during a 3s wheel gesture, against 1 task of
        // 85ms with the sequence stubbed out.
        //
        // Nothing is lost. The frame window below already tops up outward from
        // the playhead every 8 frames with a radius of 70, which is most of a
        // chapter of runway in the scroll direction — more than a fetch needs.
      }

      // Slide the retained window with the playhead, and top it up. Runs off
      // the frame index rather than the chapter so the budget is a fixed
      // number of bitmaps regardless of how wide a chapter's band is — which
      // is what lets touch carry every frame instead of every second one.
      //
      // The top-up is not optional. Retention here is frame-based while
      // loading is chapter-based and one-shot, so a chapter whose frames
      // arrive while the playhead is still far away has them discarded on
      // arrival, and nothing would ask for them again. Without this loop the
      // window empties
      // out behind the reader: measured 6% frame-change through Future
      // Systems with static runs of 19 samples. loadFrame() no-ops on
      // anything already loaded or in flight, so this is an array check per
      // frame, not a fetch.
      // Re-centre in steps, not on every frame. The window is 55 frames wide
      // on touch, so recentring every 8 keeps at least 47 frames of runway in
      // the scroll direction while doing an eighth of the work.
      //
      // Doing it per frame is what made full mobile density expensive: each
      // recentre walks the whole window queueing loadFrame, and during a fast
      // flick that ran ~110 array scans per frame change. Measured on a phone
      // profile it pushed p95 frame time from 33ms to 50ms and the worst
      // frame to 133ms — trading the stepping this change removed for a
      // hitch, which is not a trade worth making.
      const RECENTRE_EVERY = 8;
      if (Math.abs(fi - lastEvictAtRef.current) >= RECENTRE_EVERY || lastEvictAtRef.current < 0) {
        lastEvictAtRef.current = fi;
        const lo = Math.max(0, fi - RETAIN_RADIUS);
        const hi = Math.min(LAST_FRAME, fi + RETAIN_RADIUS);
        evictExcept(lo, hi);
        // Queue outward from the playhead, not lo → hi. loadFrame fires a
        // fetch per call and the decodes land in order, so filling linearly
        // means the frames furthest behind the reader are requested before
        // the ones they are about to scroll into. Walking outward puts the
        // next frame first and the far edges of the window last, so a
        // backed-up queue still delivers what is on screen.
        enqueue(fi);
        for (let d = 1; d <= RETAIN_RADIUS; d++) {
          if (fi + d <= hi) enqueue(fi + d);
          if (fi - d >= lo) enqueue(fi - d);
        }
        pump();
      }

      // Redraw when the film advances *or* the grade steps. Both are baked
      // into the same canvas now, so either changing invalidates it.
      const gradeSame = gradeIdx === lastGradeIdxRef.current
        && gradeAlpha === lastGradeAlphaRef.current;
      const blendSame = blendTo === lastBlendToRef.current
        && blendAlpha === lastBlendAlphaRef.current;
      if (fi === lastFrameRef.current && gradeSame && blendSame) return;

      // Find the nearest loaded frame: exact match, then search outward — but
      // only as far as FALLBACK_RADIUS.
      //
      // This search used to run to FRAME_COUNT, i.e. the whole film. That made
      // the page non-deterministic, because which frames are resident depends
      // on scroll *history*: the retention window slides with the playhead and
      // evicts behind it. Arrive at a given scroll position from the top and a
      // different set of frames is loaded than if you arrive from the bottom,
      // so an unbounded search resolved the same position to different images —
      // and not merely a neighbouring one. With nothing resident nearby it
      // would happily reach hundreds of frames away and draw the planetary
      // opening underneath the Future Systems copy.
      //
      // That is the reported glitch, and every symptom follows from it: scenes
      // "reappearing", background and foreground belonging to different stages,
      // the figure jumping position, the same position looking different on the
      // way back up. The chapter layers were never at fault — their opacities
      // are a pure function of scroll and measure identical from both
      // directions.
      //
      // Bounded, the worst case is a frame ~14 out of 476 away: same shot, a
      // fraction of a second of footage, invisible as a substitution. Beyond
      // that we keep whatever is already on the canvas, which is temporally
      // adjacent by construction, rather than cutting to an unrelated scene.
      let bmp = bitmapsRef.current[fi];
      if (!bmp) {
        for (let d = 1; d <= FALLBACK_RADIUS; d++) {
          const lo = fi - d, hi = fi + d;
          if (lo >= 0 && bitmapsRef.current[lo]) { bmp = bitmapsRef.current[lo]!; break; }
          if (hi < FRAME_COUNT && bitmapsRef.current[hi]) { bmp = bitmapsRef.current[hi]!; break; }
        }
      }
      if (!bmp) return; // nothing loaded within reach — hold the current frame

      // Only mark the target frame as drawn when it was the exact match.
      // For fallback frames, keep lastFrameRef at -1 so the next tick
      // retries the exact frame once it finishes loading.
      // Blend only against a frame that is already resident. The dissolve is
      // a refinement, never a reason to fetch — an absent partner simply
      // renders the frame as it did before.
      const exact = bitmapsRef.current[fi] === bmp;
      const partnerBmp = exact && blendTo >= 0 ? bitmapsRef.current[blendTo] : null;

      lastFrameRef.current = exact ? fi : -1;
      lastGradeIdxRef.current = gradeIdx;
      lastGradeAlphaRef.current = gradeAlpha;
      lastBlendToRef.current = partnerBmp ? blendTo : -1;
      lastBlendAlphaRef.current = partnerBmp ? blendAlpha : 0;
      drawBitmap(bmp, gradeIdx, gradeAlpha, partnerBmp, blendAlpha);
    };

    // Kick off with a bounded buffer around the opening frame, not a whole
    // chapter. loadChapterRegion(0) queued 76 frames and notifyReady queued
    // chapter 1's 76 more, so 149 frames — about 26 MB on desktop — were
    // downloading before the visitor had scrolled a single pixel, for a first
    // screen that needs four of them.
    //
    // INITIAL_AHEAD is sized to the runway a reader can consume before the
    // pump refills: the retention top-up runs every 8 frames of travel, and at
    // 2.6vh per frame 32 frames is most of a screen of scrolling. The window
    // takes over from there, so this is a head start, not a budget.
    const INITIAL_AHEAD = isTouch ? 24 : 32;
    for (let f = 0; f <= INITIAL_AHEAD; f++) enqueue(f);
    pump();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      genRef.current++;            // invalidate all in-flight fetches from this run
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallback);
      ro?.disconnect();
      abortControllersRef.current.forEach(c => c.abort());
      abortControllersRef.current.clear();
      bitmapsRef.current.forEach(bmp => bmp?.close());
      bitmapsRef.current = Array(FRAME_COUNT).fill(null);
      loadingRef.current = Array(FRAME_COUNT).fill(false);
      notifiedRef.current  = false;
      lastFrameRef.current = -1;
      lastChapterRef.current = -1;
      lastBlendToRef.current = -1;
      lastBlendAlphaRef.current = -1;
    };
  }, [reduce, lenisRef, onReady]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[1] overflow-clip pointer-events-none cinematic-stage-overlay"
      style={{
        backgroundColor: "oklch(0.03 0.006 260)",
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "layout paint style",
        touchAction: "pan-y",
      }}
    >
      {reduce ? (
        <img
          src={sceneSpark}
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          style={{ filter: "brightness(0.65) saturate(0.52)" }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 select-none pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            willChange: "transform",
            transform: "translateZ(0)",
            filter: "brightness(0.80) contrast(1.04) saturate(0.84)",
          }}
        />
      )}

      {/* The chapter colour grades used to live here as five stacked
          mix-blend-mode:color divs. They are now composited into the canvas
          itself, in the same pass as the frame — see drawBitmap. Nothing
          blends over the canvas any more, which is the point.

          Reduced motion keeps one static tint, because that path renders an
          <img> rather than the canvas and so has nothing to composite into.
          It never animates, so it costs one blend at paint time and nothing
          after. */}
      {reduce && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            mixBlendMode: "color",
            background: `linear-gradient(${CHAPTER_GRADES[0].angle}deg, ${
              CHAPTER_GRADES[0].stops.map(([o, c]) => `${c} ${o * 100}%`).join(", ")
            })`,
            opacity: CHAPTER_GRADES[0].opacity,
          }}
        />
      )}

      {/* Text readability — darkens sky/highlights without crushing blacks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.38) 0%, oklch(0.03 0.006 260 / 0.12) 48%, oklch(0.03 0.006 260 / 0.42) 100%)",
        }}
      />

      {/* Perimeter vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, oklch(0.02 0.006 260 / 0.50) 100%)",
        }}
      />

      {/* Bottom-right corner deepener — cinematic diagonal shadow. Originally
          added to cover a provenance mark baked into the old per-chapter
          source clips; left in place as a second line of defense while the
          new film's own mark is confirmed fully gone, not as the fix itself. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(225deg, oklch(0.01 0.003 260 / 0.99) 0%, oklch(0.01 0.003 260 / 0.99) 13%, oklch(0.01 0.003 260 / 0.86) 22%, oklch(0.01 0.003 260 / 0.40) 36%, transparent 50%)",
            "radial-gradient(ellipse 50% 42% at 100% 100%, oklch(0.01 0.003 260 / 0.92) 0%, transparent 65%)",
          ].join(", "),
        }}
      />

      {/* Top / bottom cinematic letterbox frames */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.03 0.006 260 / 0.26), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.03 0.006 260 / 0.26), transparent)",
        }}
      />
    </div>
  );
}
