import { useEffect, useRef } from "react";
import { useReducedMotion, useScroll } from "framer-motion";
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

type Bitmaps = (ImageBitmap | null)[][];

interface CanvasLayerProps {
  onReady?: () => void;
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
export default function CanvasLayer({ onReady }: CanvasLayerProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
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

  const { scrollYProgress } = useScroll();

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

    const notifyReady = () => {
      if (notifiedRef.current) return;
      notifiedRef.current = true;
      onReady?.();
    };

    // 12 s hard fallback — same contract as the original video layer.
    const fallback = window.setTimeout(notifyReady, 12_000);

    // ── Canvas sizing ────────────────────────────────────────────────────────
    // Canvas buffer = physical pixels (DPR × CSS pixels) for crisp retina output.
    // drawBitmap operates in physical-pixel space to match.
    const syncSize = () => {
      const dpr = window.devicePixelRatio || 1;
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
        return fetch(`/sequences/${path}/frame_${pad}.webp`)
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
      loadFrame(0).then(() => {
        for (let i = 1; i < FRAME_COUNT; i++) loadFrame(i);
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

      const sp  = Math.max(0, Math.min(scrollYProgress.get(), 1));
      const gi  = getGroupIdx(sp);
      const grp = GROUPS[gi];

      // Local progress within this group, clamped to [0, 1].
      const lp  = Math.max(0, Math.min((sp - grp.start) / (grp.end - grp.start), 1));
      const fi  = Math.floor(lp * LAST_FRAME);

      // On group change: preload active ± 1, reset frame tracker.
      if (gi !== lastGroupRef.current) {
        lastGroupRef.current = gi;
        loadGroup(gi);
        loadGroup(gi + 1);
        loadGroup(gi - 1);
        lastFrameRef.current = -1; // force redraw for new group
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
  }, [reduce, scrollYProgress, onReady]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[1] overflow-hidden pointer-events-none"
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

      {/* Bottom-right corner deepener — extends natural vignette over watermark zone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 38% 32% at 100% 100%, oklch(0.01 0.003 260 / 0.97) 0%, oklch(0.01 0.003 260 / 0.72) 38%, transparent 72%)",
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
