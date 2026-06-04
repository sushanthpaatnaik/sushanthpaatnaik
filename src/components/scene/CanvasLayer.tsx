import { useEffect, useRef } from "react";
import { useReducedMotion, useScroll } from "framer-motion";
import sceneSpark from "@/assets/story-01-spark.webp";

const FRAME_COUNT = 120;
const FRAME_BASE  = "/sequence-12fps/frame_";

interface CanvasLayerProps {
  onReady?: () => void;
}

/**
 * Single persistent cinematic background — canvas image-sequence edition.
 *
 * - 120 WebP frames preloaded via createImageBitmap (GPU-ready, zero decode latency).
 * - scrollProgress [0,1] → frameIndex = floor(sp * 119), instant on direction reversal.
 * - Fixed, full-viewport, z-[1]. Content layers sit above.
 * - Reduced-motion: static poster image, no canvas.
 * - onReady fires after first frame decodes (or after 12s fallback).
 */
export default function CanvasLayer({ onReady }: CanvasLayerProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const reduce       = useReducedMotion();
  const rafRef       = useRef(0);
  const bitmapsRef   = useRef<(ImageBitmap | null)[]>(Array(FRAME_COUNT).fill(null));
  const loadedRef    = useRef(0);
  const notifiedRef  = useRef(false);
  const lastFrameRef = useRef(-1);
  const { scrollYProgress } = useScroll();

  // Reduced-motion: no canvas — signal ready immediately.
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

    // 12-second fallback — same pattern as original CinematicLayer.
    const fallback = window.setTimeout(notifyReady, 12_000);

    // Resize canvas to match device pixels.
    const syncSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w   = window.innerWidth;
      const h   = window.innerHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width  = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.scale(dpr, dpr);
        lastFrameRef.current = -1; // force redraw after resize
      }
    };
    syncSize();
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(syncSize)
      : null;
    if (ro) ro.observe(document.documentElement);

    // Draw a single bitmap with object-fit:cover semantics.
    const drawFrame = (bmp: ImageBitmap) => {
      const dpr = window.devicePixelRatio || 1;
      const cW  = canvas.width  / dpr;
      const cH  = canvas.height / dpr;
      const iW  = bmp.width;
      const iH  = bmp.height;
      const scale = Math.max(cW / iW, cH / iH);
      const dW  = iW * scale;
      const dH  = iH * scale;
      const dx  = (cW - dW) / 2;
      const dy  = (cH - dH) / 2;
      ctx.drawImage(bmp, dx, dy, dW, dH);
    };

    // RAF loop — reads scroll MotionValue directly (no re-render).
    const tick = () => {
      if (!destroyed) rafRef.current = requestAnimationFrame(tick);
      const sp  = Math.max(0, Math.min(scrollYProgress.get(), 1));
      const idx = Math.floor(sp * (FRAME_COUNT - 1));
      if (idx === lastFrameRef.current) return;
      const bmp = bitmapsRef.current[idx];
      if (!bmp) return;
      lastFrameRef.current = idx;
      drawFrame(bmp);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Preload all frames. Frame 0 triggers onReady.
    const loadFrame = (i: number) => {
      const n   = String(i + 1).padStart(4, "0");
      const url = `${FRAME_BASE}${n}.webp`;
      fetch(url)
        .then(r => r.blob())
        .then(blob => createImageBitmap(blob))
        .then(bmp => {
          if (destroyed) { bmp.close(); return; }
          bitmapsRef.current[i] = bmp;
          loadedRef.current += 1;
          // Fire onReady as soon as frame 0 is available.
          if (i === 0) notifyReady();
        })
        .catch(() => {
          loadedRef.current += 1;
        });
    };

    for (let i = 0; i < FRAME_COUNT; i++) loadFrame(i);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallback);
      ro?.disconnect();
      bitmapsRef.current.forEach(bmp => bmp?.close());
      bitmapsRef.current = Array(FRAME_COUNT).fill(null);
      loadedRef.current  = 0;
      lastFrameRef.current = -1;
      notifiedRef.current  = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
