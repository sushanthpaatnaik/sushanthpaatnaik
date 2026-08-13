import React, { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import type Lenis from "lenis";
import sceneSpark from "@/assets/story-01-spark.webp";
import { CHAPTER_BANDS, N_CHAPTERS, getChapterFromProgress } from "./chapterBands";

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
// 476 frames: a native-1080p 24fps/8s master interpolated to 60fps so the
// frame-per-scroll-distance density stays at ~3.2vh/frame (see the
// linear-mapping note above). Desktop frames are the source's own 1920x1080
// with no rescaling; the /m/ variants are 854x480.
const FRAME_COUNT   = 476;
const LAST_FRAME    = FRAME_COUNT - 1;

const SCROLL_BREAKS: number[] = [CHAPTER_BANDS[0][0], ...CHAPTER_BANDS.map(b => b[1])];

// Frame range owned by each text chapter, derived from the linear mapping so
// it stays in lock-step with getFrameIndex by construction. This is the
// "group" of the old per-chapter-clip system, redefined as a slice of the one
// continuous sequence instead of a separate file: loading is still triggered
// by chapter boundary crossings (proven to work under throttling), it just no
// longer needs a boundary-aligned hard cut in the asset itself.
const CHAPTER_FRAME_RANGES: ReadonlyArray<readonly [number, number]> =
  SCROLL_BREAKS.slice(0, -1).map((s, i) => [
    Math.round(LAST_FRAME * s),
    Math.round(LAST_FRAME * SCROLL_BREAKS[i + 1]),
  ] as const);

function getFrameIndex(sp: number): number {
  const s = Math.max(0, Math.min(sp, 1));
  return Math.round(s * LAST_FRAME);
}


// ─── Per-chapter color grades ────────────────────────────────────────────────
// Applied as mix-blend-mode:color overlays — replaces hue+saturation of the
// canvas frames while preserving luminance, matching a film LUT grade.
// opacity is the active strength; divs cross-fade on chapter change via the
// CSS transition below (unchanged mechanism, now keyed to text chapter
// instead of video group since there's only one video group now).
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
const CHAPTER_GRADES = [
  // Origin — cold blue atmosphere, warm gold horizon. Holds through the
  // in-chapter dissolve into the lab, so it stays neutral enough for both.
  { bg: "linear-gradient(155deg, oklch(0.40 0.18 238) 50%, oklch(0.65 0.16 80) 100%)", opacity: 0.075 },
  // Material Intelligence — graphene blue: deep, cool, metallic
  { bg: "oklch(0.36 0.14 218)", opacity: 0.09 },
  // Industrial Translation — warm industrial amber
  { bg: "oklch(0.58 0.15 50)", opacity: 0.085 },
  // Recognition & Ecosystem — prestige white-gold
  { bg: "linear-gradient(160deg, oklch(0.88 0.04 88) 30%, oklch(0.76 0.10 82) 100%)", opacity: 0.07 },
  // Future Systems — electric blue-cyan
  { bg: "oklch(0.48 0.24 242)", opacity: 0.105 },
] as const;

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
  const gradeRefs    = useRef<(HTMLDivElement | null)[]>(new Array(N_CHAPTERS).fill(null));
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
  const chapterLoadingRef = useRef<boolean[]>(Array(N_CHAPTERS).fill(false));
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
    const framesPath = (path: string) => (isTouch ? `${path}/m` : path);
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
      // Prefetch only as far ahead as the retention window will actually
      // keep. Desktop used to start every chapter here, which was right
      // when it retained the whole sequence; with a sliding window those
      // far frames would be discarded on arrival and re-fetched later, so
      // it now pulls one chapter ahead like touch does. The tick's
      // chapter-change handler brings in idx±1 as the reader advances.
      loadChapterRegion(1);
      lastChapterRef.current = -1; // re-trigger the chapter-change block on next tick
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
      const dpr = isTouch ? Math.min(rawDpr, 1.5) : Math.min(rawDpr, 2);
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

    // ── object-fit:cover draw in physical-pixel space ────────────────────────
    const drawBitmap = (bmp: ImageBitmap) => {
      const cW    = canvas.width;
      const cH    = canvas.height;
      const scale = Math.max(cW / bmp.width, cH / bmp.height);
      const dW    = bmp.width  * scale;
      const dH    = bmp.height * scale;
      ctx.drawImage(bmp, (cW - dW) / 2, (cH - dH) / 2, dW, dH);
    };

    // ── Frame loader ─────────────────────────────────────────────────────────
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
      return fetch(`/sequences/${framesPath(SEQUENCE_PATH)}/frame_${pad}.webp`, opts)
        .then(r  => r.blob())
        .then(b  => makeBitmap(b))
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
          if (lastFrameRef.current >= 0) {
            const cur = lastFrameRef.current;
            if (fi < cur - RETAIN_RADIUS || fi > cur + RETAIN_RADIUS) {
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

    // ── Bulk loaders ─────────────────────────────────────────────────────────
    // shouldContinue is checked before every batch so a chapter's own load
    // sequence can self-terminate once it's no longer relevant, instead of
    // grinding through its full frame list regardless. Without this, a
    // chapter's async batch loop kept running after the user scrolled well
    // past it — each batch spawning fresh fetches for frames that were
    // immediately stale, contending for the same throttled bandwidth the
    // *current* chapter needed. evictExcept's abort() only cancels frames
    // already in flight at the moment it runs; it can't stop a loop from
    // starting new ones a moment later.
    const runBatches = async (frames: number[], size: number, shouldContinue?: () => boolean) => {
      for (let i = 0; i < frames.length; i += size) {
        if (destroyed) return;
        if (shouldContinue && !shouldContinue()) return;
        await Promise.all(frames.slice(i, i + size).map(loadFrame));
      }
    };

    // ── Chapter-region loader ────────────────────────────────────────────────
    // Loads one chapter's slice of the sequence — the direct equivalent of
    // the old per-file loadGroup(), just operating on a range within the one
    // shared frame array instead of a separate folder. Same guard shape
    // (loadingRef → chapterLoadingRef), same "defer until unblocked" rule,
    // same coverage-first ordering on touch. Triggered by chapter-boundary
    // crossings in tick() below, exactly like the old group system was
    // triggered by group-boundary crossings — that trigger shape is what
    // was actually proven robust under throttling; a generic scroll-position
    // sliding window (tried first here) was not, because sparse anchors
    // spread across the *whole* 476-frame sequence kept getting evicted the
    // instant they fell outside a window sized for local density, measured
    // as an 18-of-41-sample freeze.
    const loadChapterRegion = (idx: number) => {
      if (idx < 0 || idx >= N_CHAPTERS) return;
      if (chapterLoadingRef.current[idx]) return;
      // Defer all non-critical chapters until the loader has exited.
      // Without this the first RAF tick would start every chapter's
      // fetches at once, competing with chapter-0's critical frames for
      // HTTP/2 streams. notifyReady() explicitly loads the next chapter(s)
      // once the loader clears.
      if (idx > 0 && !notifiedRef.current) return;
      chapterLoadingRef.current[idx] = true;
      const [fIn, fOut] = CHAPTER_FRAME_RANGES[idx];

      // True while idx is still within active±1 of wherever the user
      // actually is *now* (not wherever they were when this region load
      // started). Touch only — desktop never abandons a region early.
      const stillRelevant = () =>
        !isTouch || lastChapterRef.current < 0 || Math.abs(idx - lastChapterRef.current) <= 1;

      const frames: number[] = [];
      for (let f = fIn; f < fOut; f += frameStep) frames.push(f);
      if (frames[frames.length - 1] !== fOut) frames.push(fOut);

      // First frame of the region loads alone so the canvas has *something*
      // from this chapter the moment it's reachable, before the rest of the
      // region arrives.
      loadFrame(frames[0]).then(() => {
        if (!stillRelevant()) { chapterLoadingRef.current[idx] = false; return; }
        const rest = frames.slice(1);
        if (isTouch) {
          // COVERAGE-FIRST within the region: a handful of anchors spread
          // across just this chapter's own (much smaller) range, then fill.
          // Serial batches of 6 so we never saturate the browser's HTTP/2
          // connection pool (6 concurrent streams per origin on mobile).
          // shouldContinue lets either pass bail out early once the region
          // stops being relevant — see the runBatches comment above.
          const ANCHOR_COUNT = 8;
          const stride = Math.max(1, Math.floor(rest.length / ANCHOR_COUNT)) || 1;
          const anchors: number[] = [];
          for (let i = 0; i < rest.length; i += stride) anchors.push(rest[i]);
          const anchorSet = new Set(anchors);
          const fill = rest.filter(f => !anchorSet.has(f));
          runBatches(anchors, 6, stillRelevant).then(() => {
            if (!stillRelevant()) { chapterLoadingRef.current[idx] = false; return; }
            return runBatches(fill, 6, stillRelevant);
          }).then(() => {
            // Abandoned mid-way — clear the flag so a later re-entry (e.g.
            // scrolling back) restarts the load instead of permanently
            // no-op'ing on a chapter that never finished.
            if (!stillRelevant()) chapterLoadingRef.current[idx] = false;
          });
        } else {
          // Desktop: fire the whole region in parallel — HTTP/2
          // multiplexing on fast connections makes this fastest.
          rest.forEach(loadFrame);
        }
      });
    };

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
      const chapter = getChapterFromProgress(sp);

      // On chapter change: swap the color-grade overlay (cross-fades via the
      // div's own CSS transition, unchanged mechanism), and preload
      // active±1's frame regions — the direct equivalent of the old
      // on-group-change `loadGroup(gi); loadGroup(gi±1)` trigger.
      if (chapter !== lastChapterRef.current) {
        lastChapterRef.current = chapter;
        gradeRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === chapter ? String(CHAPTER_GRADES[i].opacity) : "0";
        });
        // Region preloading is desktop-only now. On touch the sliding window
        // both loads and evicts, and a chapter-triple region load would queue
        // ~260 full-density frames the window is about to throw away.
        if (!isTouch) {
          loadChapterRegion(chapter);
          loadChapterRegion(chapter + 1);
          loadChapterRegion(chapter - 1);
        }
      }

      // Slide the retained window with the playhead, and top it up. Runs off
      // the frame index rather than the chapter so the budget is a fixed
      // number of bitmaps regardless of how wide a chapter's band is — which
      // is what lets touch carry every frame instead of every second one.
      //
      // The top-up is not optional. Retention here is frame-based while
      // loading is chapter-based and one-shot, so a chapter whose frames
      // arrive while the playhead is still far away has them discarded on
      // arrival — and chapterLoadingRef is already set, so the region loader
      // will never ask for them again. Without this loop the window empties
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
        loadFrame(fi);
        for (let d = 1; d <= RETAIN_RADIUS; d++) {
          if (fi + d <= hi) loadFrame(fi + d);
          if (fi - d >= lo) loadFrame(fi - d);
        }
      }

      // Skip draw if frame unchanged — avoids redundant canvas writes.
      if (fi === lastFrameRef.current) return;

      // Find the nearest loaded frame: try exact match, then search outward.
      // This prevents a frozen canvas when scrolling into a not-yet-loaded
      // stretch of the sequence.
      let bmp = bitmapsRef.current[fi];
      if (!bmp) {
        for (let d = 1; d < FRAME_COUNT; d++) {
          const lo = fi - d, hi = fi + d;
          if (lo >= 0 && bitmapsRef.current[lo]) { bmp = bitmapsRef.current[lo]!; break; }
          if (hi < FRAME_COUNT && bitmapsRef.current[hi]) { bmp = bitmapsRef.current[hi]!; break; }
        }
      }
      if (!bmp) return; // nothing loaded yet anywhere nearby — keep previous visible

      // Only mark the target frame as drawn when it was the exact match.
      // For fallback frames, keep lastFrameRef at -1 so the next tick
      // retries the exact frame once it finishes loading.
      lastFrameRef.current = bitmapsRef.current[fi] === bmp ? fi : -1;
      drawBitmap(bmp);
    };

    // Kick off: load chapter 0's region (frame 0 first, so notifyReady fires
    // promptly and the canvas always has something to draw) and start the
    // RAF loop.
    loadChapterRegion(0);
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
      chapterLoadingRef.current = Array(N_CHAPTERS).fill(false);
      notifiedRef.current  = false;
      lastFrameRef.current = -1;
      lastChapterRef.current = -1;
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

      {/* Chapter color grades — mix-blend-mode:color tints, one per text
          chapter (was one per video group; now there's a single video). */}
      {CHAPTER_GRADES.map((grade, i) => (
        <div
          key={i}
          ref={el => { gradeRefs.current[i] = el; }}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            mixBlendMode: "color",
            background: grade.bg,
            opacity: i === 0 ? grade.opacity : 0,
            transition: "opacity 1.4s ease",
          }}
        />
      ))}

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
