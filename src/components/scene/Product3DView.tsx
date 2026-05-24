import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import LatticeField from "./LatticeField";

/**
 * Faux-3D product view.
 *
 * - Wraps an image with mouse-tracked tilt + depth parallax (no WebGL, no new assets).
 * - Click opens a cinematic modal with drag-to-rotate spin + zoom.
 * - Respects prefers-reduced-motion.
 */

interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Max tilt in degrees */
  maxTilt?: number;
  /** Image filter passthrough */
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  children?: ReactNode;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function Tilt3DSurface({
  src,
  alt,
  className = "",
  style,
  maxTilt = 8,
  imgClassName = "",
  imgStyle,
  children,
}: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let cx = 0, cy = 0, tcx = 0, tcy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tcx = nx * 18;
      tcy = ny * 18;
    };
    const onLeave = () => { tcx = 0; tcy = 0; };

    const loop = () => {
      cx += (tcx - cx) * 0.08;
      cy += (tcy - cy) * 0.08;
      const img = el.querySelector<HTMLElement>("[data-tilt-img]");
      if (img) img.style.transform = `translate3d(${(-cx).toFixed(1)}px, ${(-cy).toFixed(1)}px, 0) scale(1.08)`;
      const sheen = el.querySelector<HTMLElement>("[data-tilt-sheen]");
      if (sheen) {
        const gx = 50 - cx * 1.6;
        const gy = 50 - cy * 1.6;
        sheen.style.background = `radial-gradient(circle at ${gx}% ${gy}%, oklch(0.95 0.04 220 / 0.16), transparent 55%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf.current = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [maxTilt, reduced]);

  return (
    <div
      ref={ref}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={style}
    >
      <img
        data-tilt-img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover will-change-transform transition-transform duration-[800ms] ease-out ${imgClassName}`}
        style={{ transform: "scale(1.08)", ...imgStyle }}
      />
      <div
        data-tilt-sheen
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70 transition-opacity duration-700"
      />
      {children}
    </div>
  );
}

/* ── Modal viewer with drag-to-spin ─────────────────────────────────── */

export interface Product3DModalData {
  title: string;
  domain: string;
  status: string;
  metric: string;
  body: string;
  img: string;
  stage: string;
}

export function Product3DModal({
  item,
  onClose,
}: {
  item: Product3DModalData | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Drag-to-spin state
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ down: false, lastX: 0, lastY: 0, ry: 0, rx: 0, vy: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!item || reduced) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const state = dragRef.current;
    state.ry = -18;
    state.rx = 6;

    const apply = () => {
      // Clamp Y so a flat cutout never rotates past edge-on (which would mirror the label).
      state.ry = Math.max(-32, Math.min(32, state.ry));
      stage.style.transform = `perspective(1400px) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg)`;
    };
    const loop = () => {
      if (!state.down) {
        state.ry += state.vy;
        state.vy *= 0.94;
        // gentle auto-sway when idle, bouncing within clamp
        if (Math.abs(state.vy) < 0.02) {
          state.ry += Math.sin(Date.now() / 1400) * 0.12;
        }
        apply();
      }

      raf = requestAnimationFrame(loop);
    };
    const onDown = (e: PointerEvent) => {
      state.down = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.vy = 0;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!state.down) return;
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.ry += dx * 0.4;
      state.rx = Math.max(-25, Math.min(25, state.rx - dy * 0.25));
      state.vy = dx * 0.4;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      apply();
    };
    const onUp = () => { state.down = false; };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);
    apply();

    return () => {
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [item, reduced]);

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ background: "oklch(0.02 0.006 245 / 0.86)", backdropFilter: "blur(18px)" }}
          onClick={onClose}
        >
          {/* Header */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/70" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                Product · 3D View
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/60 transition-colors hover:text-foreground/95"
              aria-label="Close 3D view"
            >
              Close · ESC
            </button>
          </div>

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="relative grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[1.4fr_1fr] md:px-10"
          >
            {/* Stage — flat frame; only the product inside rotates */}
            <div
              className="relative aspect-square w-full select-none touch-none overflow-hidden rounded-sm border border-foreground/[0.08] bg-white"
              style={{ perspective: "1600px" }}
            >
              {/* Floor shadow — anchors the product in space */}
              <div
                aria-hidden
                className="absolute bottom-[10%] left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-[50%] opacity-40 blur-2xl"
                style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.6), transparent 70%)" }}
              />

              {/* Soft studio vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 50% 35%, transparent 55%, oklch(0 0 0 / 0.06) 100%)" }}
              />


              <div
                ref={stageRef}
                className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Only the product floats and rotates — no rectangular frame around it */}
                <img
                  src={item.img}
                  alt={item.title}
                  draggable={false}
                  className="max-h-[78%] max-w-[78%] object-contain"
                  style={{
                    filter:
                      "contrast(1.06) saturate(0.95) brightness(0.98) drop-shadow(0 30px 40px oklch(0 0 0 / 0.55)) drop-shadow(0 0 30px oklch(0.6 0.12 220 / 0.18))",
                  }}
                />
              </div>

              {/* Hint */}
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9.5px] uppercase tracking-[0.38em] text-foreground/50">
                Drag · Rotate
              </div>
            </div>

            {/* Spec panel */}
            <div className="flex flex-col justify-center gap-5">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent/70" />
                <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                  {item.stage}
                </span>
              </div>
              <h2 className="font-display text-4xl tracking-[-0.025em] text-foreground/98 md:text-5xl">
                {item.title}
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                {item.domain}
              </p>
              <p className="max-w-md text-[14.5px] leading-relaxed text-foreground/80">
                {item.body}
              </p>
              <div className="mt-2 border-t border-foreground/[0.08] pt-4">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                  Performance
                </p>
                <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                  {item.metric}
                </p>
              </div>
              <div className="border-t border-foreground/[0.08] pt-4">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                  Status
                </p>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/75">
                  {item.status}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
