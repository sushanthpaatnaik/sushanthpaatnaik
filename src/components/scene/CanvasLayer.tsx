import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type Lenis from "lenis";
import sceneSpark from "@/assets/story-01-spark.webp";

// ─── Sequence groups ────────────────────────────────────────────────────────
// Each entry spans one or two CHAPTER_BANDS and owns a 96-frame WebP sequence.
// start/end must exactly match the combined chapter band boundaries so that
// all scroll layers (content, atmosphere, HUD, canvas) share one timeline.
const GROUPS = [
  { path: "origin-founder",         start: 0.000, end: 0.240 },
  { path: "material-intelligence",  start: 0.240, end: 0.360 },
  { path: "industrial-translation", start: 0.360, end: 0.580 },
  { path: "recognition-ecosystem",  start: 0.580, end: 0.810 },
  { path: "future-systems",         start: 0.810, end: 1.000 },
] as const;

const N_GROUPS    = GROUPS.length;        // 5
const FRAME_COUNT = 96;                   // frames per sequence
const LAST_FRAME  = FRAME_COUNT - 1;      // 95

// ─── Per-chapter color grades ────────────────────────────────────────────────
// Applied as mix-blend-mode:color overlays — replaces hue+saturation of the
// canvas frames while preserving luminance, matching a film LUT grade.
// opacity is the active strength; divs fade in/out on group transition.
const CHAPTER_GRADES = [
  // origin-founder — cold blue atmosphere, warm gold horizon
  { bg: "linear-gradient(155deg, oklch(0.40 0.18 238) 50%, oklch(0.65 0.16 80) 100%)", opacity: 0.16 },
  // material-intelligence — graphene blue: deep, cool, metallic
  { bg: "oklch(0.36 0.14 218)", opacity: 0.18 },
  // industrial-translation — warm industrial amber
  { bg: "oklch(0.58 0.15 50)", opacity: 0.17 },
  // recognition-ecosystem — prestige white-gold
  { bg: "linear-gradient(160deg, oklch(0.88 0.04 88) 30%, oklch(0.76 0.10 82) 100%)", opacity: 0.14 },
  // future-systems — electric blue-cyan
  { bg: "oklch(0.48 0.24 242)", opacity: 0.21 },
] as const;

type Bitmaps = (ImageBitmap | null)[][];

interface CanvasLayerProps {
  onReady?: () => void;
  onProgress?: (pct: number) => void;
  lenisRef?: React.MutableRefObject<Lenis | null>;
}

/**
 * Chapter-based image-sequence canvas background.
 *
 * Master timeline: scrollYProgress [0, 1]
 *   → active group
 *   → group-local progress [0, 1]
 *   → frameIndex = floor(localProgress * 95)
 *
 * Preload policy: active group + one ahead + one behind.
 * Decode: createImageBitmap — GPU-ready, zero latency at draw time.
 * Draw: object-fit:cover with DPR-correct canvas buffer.
 * Reduced-motion: static poster, no canvas.
 */
export default function CanvasLayer({ onReady, onProgress, lenisRef }: CanvasLayerProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const gradeRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null]);
  const reduce       = useReducedMotion();
  const rafRef       = useRef(0);
  const notifiedRef  = useRef(false);
  const lastFrameRef = useRef(-1);
  const lastGroupRef = useRef(-1);

  // bitmaps[groupIdx][frameIdx] — populated lazily as frames decode
  const bitmapsRef  = useRef<Bitmaps>(
    Array.from({ length: N_GROUPS }, () => Array(FRAME_COUNT).fill(null))
  );
  // loading[groupIdx] — true once fetch for that group has started
  const loadingRef  = useRef<boolean[]>(Array(N_GROUPS).fill(false));
  // Generation counter — incremented on cleanup so in-flight fetches from
  // a previous effect run (React StrictMode double-invoke) are discarded
  // without duplicating the bitmap array into memory.
  const genRef      = useRef(0);

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

    // ── Mobile memory budget ──────────────────────────────────────────────────
    // Source frames are 1280×720 → ~3.69 MB each as a decoded ImageBitmap.
    // 96 frames × 5 groups = ~1.77 GB if all retained — far past iOS Safari's
    // ~300 MB per-tab ceiling, which crashes the tab ("A problem repeatedly
    // occurred"). On touch we (1) decode at reduced resolution, (2) load every
    // 2nd frame, and (3) evict groups outside the active±1 window. The
    // nearest-loaded-frame search in the render loop covers the skipped frames,
    // so the sequence still animates in lock-step with scroll.
    const decodeOpts: ImageBitmapOptions | undefined = isTouch
      ? { resizeWidth: 854, resizeHeight: 480, resizeQuality: "medium" }
      : undefined;
    const makeBitmap = (blob: Blob): Promise<ImageBitmap> =>
      decodeOpts
        ? createImageBitmap(blob, decodeOpts).catch(() => createImageBitmap(blob))
        : createImageBitmap(blob);
    const frameStep = isTouch ? 2 : 1;

    // ── Critical frame threshold ──────────────────────────────────────────────
    // Scroll is locked until this many group-0 frames are decoded and drawn.
    // Kept intentionally small: the first 4 frames (desktop) or 2 (mobile)
    // are enough for smooth initial scroll. Loading more before unblocking
    // scroll caused visible stalls because group-1 fetches were competing for
    // bandwidth — see notifyReady/loadGroup for the deferred-group fix.
    const criticalCount = isTouch ? 2 : 4;
    let criticalLoaded  = 0;

    // Close + drop every retained bitmap for groups outside [lo, hi] and mark
    // them reloadable. Touch only — desktop keeps all groups for instant
    // scroll-back, unchanged.
    const evictExcept = (lo: number, hi: number) => {
      for (let g = 0; g < N_GROUPS; g++) {
        if (g >= lo && g <= hi) continue;
        const grp = bitmapsRef.current[g];
        let freed = false;
        for (let f = 0; f < FRAME_COUNT; f++) {
          if (grp[f]) { grp[f]!.close(); grp[f] = null; freed = true; }
        }
        if (freed) loadingRef.current[g] = false;
      }
    };

    const notifyReady = () => {
      if (notifiedRef.current) return;
      notifiedRef.current = true;
      // Always push to 100 % so the Loader exits — covers the fallback-timer
      // path where criticalCount frames never fully loaded.
      onProgress?.(100);
      onReady?.();
      // Start ALL remaining groups now that the loader has exited and the
      // full HTTP/2 bandwidth budget is free. Previously only group 1 was
      // started here, so groups 2–4 only began loading when the user entered
      // each group — on a cold CDN that caused a visible freeze at each
      // group boundary. Firing all groups in parallel here means frames are
      // already in-flight before the user reaches them.
      for (let g = 1; g < N_GROUPS; g++) loadGroup(g);
      // Reset lastGroupRef so the next RAF tick re-triggers the group-change
      // block for whichever group the user has already scrolled into.
      lastGroupRef.current = -1;
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

    // ── Group loader ─────────────────────────────────────────────────────────
    const loadGroup = (gi: number) => {
      if (gi < 0 || gi >= N_GROUPS) return;
      if (loadingRef.current[gi]) return;
      // Defer all non-critical groups until the loader has exited.
      // Without this, the first RAF tick starts group 1 immediately (96+96
      // parallel fetches), competing with group-0 critical frames for HTTP/2
      // streams and causing the progress bar to stall. notifyReady() calls
      // loadGroup(1) explicitly once the loader clears.
      if (gi > 0 && !notifiedRef.current) return;
      loadingRef.current[gi] = true;
      const { path } = GROUPS[gi];
      const gen = genRef.current; // capture generation at load-start

      const loadFrame = (fi: number): Promise<void> => {
        const pad = String(fi + 1).padStart(4, "0");
        // All critical frames get high priority so they aren't queued behind
        // non-critical requests. Frame 0 was already high; extending to all
        // group-0 frames below criticalCount closes the 25%-stuck regression.
        const isCritical = gi === 0 && fi < criticalCount;
        const priority: RequestInit = (fi === 0 || isCritical) ? { priority: "high" } as RequestInit : {};
        return fetch(`/sequences/${path}/frame_${pad}.webp`, priority)
          .then(r  => r.blob())
          .then(b  => makeBitmap(b))
          .then(bmp => {
            // Discard if cleaned up (StrictMode/unmount), OR if this group has
            // since been evicted from the active±1 window — otherwise a late
            // frame would silently re-bloat memory for an off-screen group.
            const active = lastGroupRef.current;
            const evicted = isTouch && active >= 0 && (gi < active - 1 || gi > active + 1);
            if (destroyed || genRef.current !== gen || evicted) { bmp.close(); return; }
            bitmapsRef.current[gi][fi] = bmp;
            // Count critical group-0 frames; fire notifyReady once threshold
            // is met — not on frame 0 alone — so scroll unlocks only after
            // the opener can play smoothly without visible gaps.
            if (gi === 0 && criticalLoaded < criticalCount) {
              criticalLoaded++;
              onProgress?.(Math.round((criticalLoaded / criticalCount) * 100));
              if (criticalLoaded >= criticalCount) notifyReady();
            }
          })
          .catch(() => {
            // Frame-0 error: unblock immediately rather than hanging.
            // Other critical-frame errors: count toward threshold AND report
            // progress so the bar advances even through CDN failures.
            if (gi === 0) {
              if (fi === 0) { notifyReady(); return; }
              if (criticalLoaded < criticalCount) {
                criticalLoaded++;
                onProgress?.(Math.round((criticalLoaded / criticalCount) * 100));
                if (criticalLoaded >= criticalCount) notifyReady();
              }
            }
          });
      };

      // Frame 0 loads first so notifyReady fires promptly and the canvas
      // always has something to draw before the rest of the group arrives.
      // Mobile: load remaining frames in serial batches of 6 so we never
      // saturate the browser's HTTP/2 connection pool (6 concurrent streams
      // per origin on Chrome/Safari mobile). Desktop: fire all in parallel —
      // HTTP/2 multiplexing on fast connections makes this fastest.
      loadFrame(0).then(() => {
        if (isTouch) {
          // Serial batches of 6, stepping by frameStep (every 2nd frame) so we
          // load ~48 frames/group instead of 96 — half the memory and decodes.
          const loadBatch = async (start: number): Promise<void> => {
            const batch: Promise<void>[] = [];
            let i = start;
            for (let c = 0; c < 6 && i < FRAME_COUNT; c++, i += frameStep) batch.push(loadFrame(i));
            await Promise.all(batch);
            if (i < FRAME_COUNT && !destroyed) await loadBatch(i);
          };
          loadBatch(frameStep);
        } else {
          for (let i = 1; i < FRAME_COUNT; i++) loadFrame(i);
        }
      });
    };

    // ── Group lookup from global scroll progress ─────────────────────────────
    const getGroupIdx = (sp: number): number => {
      for (let i = N_GROUPS - 1; i >= 0; i--) {
        if (sp >= GROUPS[i].start) return i;
      }
      return 0;
    };

    // ── RAF render loop ──────────────────────────────────────────────────────
    const tick = () => {
      if (!destroyed) rafRef.current = requestAnimationFrame(tick);

      // Read lenis.targetScroll (raw user intent, no smoothing applied) so
      // frame updates are decoupled from Lenis easing — under-16ms latency.
      // Falls back to window.scrollY when Lenis isn't ready yet.
      const lenis = lenisRef?.current;
      const rawSp = lenis && lenis.limit > 0
        ? lenis.targetScroll / lenis.limit
        : window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const sp  = Math.max(0, Math.min(rawSp, 1));
      const gi  = getGroupIdx(sp);
      const grp = GROUPS[gi];

      // Local progress within this group, clamped to [0, 1].
      const lp  = Math.max(0, Math.min((sp - grp.start) / (grp.end - grp.start), 1));
      const fi  = Math.floor(lp * LAST_FRAME);

      // On group change: preload active ± 1 (and +2 on desktop for wider
      // lookahead so fast scrollers don't hit an unloaded group).
      if (gi !== lastGroupRef.current) {
        lastGroupRef.current = gi;
        loadGroup(gi);
        loadGroup(gi + 1);
        loadGroup(gi - 1);
        if (!isTouch) loadGroup(gi + 2); // extra desktop lookahead
        // Touch: free everything outside active±1 to stay under the iOS/Android
        // memory ceiling. Desktop retains all groups (unchanged).
        if (isTouch) evictExcept(gi - 1, gi + 1);
        lastFrameRef.current = -1; // force redraw for new group
        gradeRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === gi ? String(CHAPTER_GRADES[i].opacity) : "0";
        });
      }

      // Skip draw if frame unchanged — avoids redundant canvas writes.
      if (fi === lastFrameRef.current) return;

      // Find the nearest loaded frame: try exact match, then search outward.
      // This prevents frozen canvas when reversing to a group mid-load.
      let bmp = bitmapsRef.current[gi][fi];
      if (!bmp) {
        for (let d = 1; d < FRAME_COUNT; d++) {
          const lo = fi - d, hi = fi + d;
          if (lo >= 0 && bitmapsRef.current[gi][lo]) { bmp = bitmapsRef.current[gi][lo]!; break; }
          if (hi < FRAME_COUNT && bitmapsRef.current[gi][hi]) { bmp = bitmapsRef.current[gi][hi]!; break; }
        }
      }
      if (!bmp) return; // group has zero loaded frames yet — keep previous visible

      // Only mark the target frame as drawn when it was the exact match.
      // For fallback frames, keep lastFrameRef at -1 so the next tick retries
      // the exact frame once it finishes loading — prevents the frame from
      // being permanently skipped by the fi === lastFrameRef guard.
      if (bitmapsRef.current[gi][fi] === bmp) {
        lastFrameRef.current = fi;
      } else {
        lastFrameRef.current = -1;
      }
      drawBitmap(bmp);
    };

    // Kick off: load group 0 immediately, start RAF.
    loadGroup(0);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      genRef.current++;            // invalidate all in-flight fetches from this run
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallback);
      ro?.disconnect();
      bitmapsRef.current.forEach(grp => grp.forEach(bmp => bmp?.close()));
      bitmapsRef.current = Array.from({ length: N_GROUPS }, () => Array(FRAME_COUNT).fill(null));
      loadingRef.current = Array(N_GROUPS).fill(false);
      notifiedRef.current  = false;
      lastFrameRef.current = -1;
      lastGroupRef.current = -1;
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

      {/* Chapter color grades — mix-blend-mode:color tints each sequence */}
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

      {/* Bottom-right corner deepener — cinematic diagonal shadow covers watermark zone */}
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
