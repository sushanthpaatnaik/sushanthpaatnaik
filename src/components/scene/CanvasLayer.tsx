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
export default function CanvasLayer({ onReady, lenisRef }: CanvasLayerProps) {
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

    const notifyReady = () => {
      if (notifiedRef.current) return;
      notifiedRef.current = true;
      onReady?.();
    };

    // Hard fallback — dismiss loader if frame 0 never arrives (slow network).
    // 6s on mobile (CDN-cached frames typically <1s; 6s covers 3G edge cases).
    // 10s on desktop where a slow connection is less common.
    const fallbackMs = isTouch ? 6_000 : 10_000;
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
      loadingRef.current[gi] = true;
      const { path } = GROUPS[gi];
      const gen = genRef.current; // capture generation at load-start

      const loadFrame = (fi: number): Promise<void> => {
        const pad = String(fi + 1).padStart(4, "0");
        // Frame 0: high priority so the loader dismisses quickly.
        // Remaining frames: auto priority so they don't starve other resources.
        const priority: RequestInit = fi === 0 ? { priority: "high" } as RequestInit : {};
        return fetch(`/sequences/${path}/frame_${pad}.webp`, priority)
          .then(r  => r.blob())
          .then(b  => createImageBitmap(b))
          .then(bmp => {
            // Discard if this effect run was already cleaned up (StrictMode or unmount).
            if (destroyed || genRef.current !== gen) { bmp.close(); return; }
            bitmapsRef.current[gi][fi] = bmp;
            if (gi === 0 && fi === 0) notifyReady();
          })
          .catch(() => {
            if (gi === 0 && fi === 0) notifyReady();
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
          const loadBatch = async (start: number): Promise<void> => {
            const end = Math.min(start + 6, FRAME_COUNT);
            const batch: Promise<void>[] = [];
            for (let i = start; i < end; i++) batch.push(loadFrame(i));
            await Promise.all(batch);
            if (end < FRAME_COUNT && !destroyed) await loadBatch(end);
          };
          loadBatch(1);
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

      // On group change: preload active ± 1, reset frame tracker, swap color grade.
      if (gi !== lastGroupRef.current) {
        lastGroupRef.current = gi;
        loadGroup(gi);
        loadGroup(gi + 1);
        loadGroup(gi - 1);
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

      lastFrameRef.current = fi;
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
      className="fixed inset-0 z-[1] overflow-hidden pointer-events-none cinematic-stage-overlay"
      style={{
        backgroundColor: "oklch(0.03 0.006 260)",
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "strict",
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
