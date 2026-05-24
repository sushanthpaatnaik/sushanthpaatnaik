import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
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

    let cx = 0;
    let cy = 0;
    let tcx = 0;
    let tcy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tcx = nx * 14;
      tcy = ny * 14;
    };

    const onLeave = () => {
      tcx = 0;
      tcy = 0;
    };

    const loop = () => {
      cx += (tcx - cx) * 0.08;
      cy += (tcy - cy) * 0.08;

      const product = el.querySelector<HTMLElement>("[data-tilt-product]");
      if (product) {
        product.style.transform = `translate3d(${(-cx * 0.9).toFixed(1)}px, ${(-cy * 0.55).toFixed(1)}px, 0) scale(1.03)`;
      }

      const shadow = el.querySelector<HTMLElement>("[data-tilt-shadow]");
      if (shadow) {
        shadow.style.transform = `translate3d(${(cx * 0.32).toFixed(1)}px, ${(cy * 0.14).toFixed(1)}px, 0) scaleX(1.02)`;
      }

      const glow = el.querySelector<HTMLElement>("[data-tilt-glow]");
      if (glow) {
        const gx = 50 - cx * 2.4;
        const gy = 36 - cy * 1.8;
        glow.style.background = `radial-gradient(circle at ${gx}% ${gy}%, oklch(0.78 0.05 220 / 0.24), transparent 34%), radial-gradient(circle at ${gx + 8}% ${gy + 6}%, oklch(0.92 0.02 250 / 0.12), transparent 44%)`;
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
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 26%, oklch(0.28 0.01 245 / 0.7), transparent 30%), linear-gradient(180deg, oklch(0.11 0.008 245) 0%, oklch(0.07 0.008 245) 52%, oklch(0.05 0.008 245) 100%)",
        }}
      />
      <div
        data-tilt-glow
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-700"
      />
      <div
        aria-hidden
        className="absolute bottom-[8%] left-1/2 h-[16%] w-[62%] -translate-x-1/2 rounded-[50%] opacity-60 blur-2xl"
        style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.72), transparent 70%)" }}
      />
      <div
        data-tilt-shadow
        aria-hidden
        className="absolute bottom-[12%] left-1/2 h-[12%] w-[40%] -translate-x-1/2 rounded-[50%] opacity-55 blur-xl"
        style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.7), transparent 68%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[12%] top-[10%] h-px opacity-55"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.84 0.03 230 / 0.45), transparent)" }}
      />
      <img
        data-tilt-product
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-contain p-[10%] will-change-transform transition-transform duration-[1200ms] ease-out ${imgClassName}`}
        style={{
          transform: "scale(1.03)",
          filter:
            "drop-shadow(0 22px 40px oklch(0 0 0 / 0.68)) drop-shadow(0 0 28px oklch(0.68 0.04 225 / 0.16))",
          ...imgStyle,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.06) 0%, transparent 22%, transparent 58%, oklch(0.02 0.006 245 / 0.6) 100%)",
        }}
      />
      {children}
    </div>
  );
}

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
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!item || reduced) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) / r.width;
      ty = (e.clientY - (r.top + r.height / 2)) / r.height;
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
    };

    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;

      const t = Date.now() / 1600;
      const driftX = Math.sin(t) * 5;
      const driftY = Math.cos(t * 0.9) * 4;

      const product = stage.querySelector<HTMLElement>("[data-modal-product]");
      if (product) {
        product.style.transform = `translate3d(${(-cx * 18 + driftX).toFixed(1)}px, ${(-cy * 10 + driftY).toFixed(1)}px, 0) scale(1.015)`;
      }

      const glow = stage.querySelector<HTMLElement>("[data-modal-glow]");
      if (glow) {
        const gx = 50 + cx * 18;
        const gy = 28 + cy * 12;
        glow.style.background = `radial-gradient(circle at ${gx}% ${gy}%, oklch(0.82 0.04 225 / 0.22), transparent 24%), radial-gradient(circle at ${gx - 8}% ${gy + 10}%, oklch(0.62 0.03 250 / 0.18), transparent 34%)`;
      }

      const shadow = stage.querySelector<HTMLElement>("[data-modal-shadow]");
      if (shadow) {
        shadow.style.transform = `translate3d(${(cx * 10).toFixed(1)}px, ${(cy * 3).toFixed(1)}px, 0) scaleX(1.02)`;
      }

      raf = requestAnimationFrame(loop);
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [item, reduced]);

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.92) 0%, oklch(0.03 0.006 245 / 0.96) 100%)",
            backdropFilter: "blur(18px)",
          }}
          onClick={onClose}
        >
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/70" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                Product · Inspection
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/60 transition-colors hover:text-foreground/95"
              aria-label="Close product inspection"
            >
              Close · ESC
            </button>
          </div>

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.97, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 10 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="relative grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[1.45fr_0.95fr] md:px-10"
          >
            <div
              ref={stageRef}
              className="relative aspect-square w-full overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.06_0.008_245)]"
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 22%, oklch(0.28 0.012 235 / 0.85), transparent 22%), linear-gradient(180deg, oklch(0.1 0.008 245) 0%, oklch(0.06 0.008 245) 52%, oklch(0.04 0.008 245) 100%)",
                }}
              />
              <div data-modal-glow aria-hidden className="pointer-events-none absolute inset-0 opacity-90" />
              <div
                aria-hidden
                className="absolute inset-x-[10%] top-[11%] h-px opacity-70"
                style={{ background: "linear-gradient(90deg, transparent, oklch(0.85 0.035 225 / 0.5), transparent)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ background: "radial-gradient(circle at 50% 58%, transparent 44%, oklch(0 0 0 / 0.22) 100%)" }}
              />
              <div
                aria-hidden
                className="absolute bottom-[11%] left-1/2 h-[11%] w-[56%] -translate-x-1/2 rounded-[50%] opacity-70 blur-3xl"
                style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.78), transparent 70%)" }}
              />
              <div
                data-modal-shadow
                aria-hidden
                className="absolute bottom-[14%] left-1/2 h-[10%] w-[34%] -translate-x-1/2 rounded-[50%] opacity-55 blur-2xl"
                style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.72), transparent 68%)" }}
              />
              <motion.img
                data-modal-product
                src={item.img}
                alt={item.title}
                draggable={false}
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 h-full w-full object-contain p-[11%]"
                style={{
                  filter:
                    "drop-shadow(0 34px 46px oklch(0 0 0 / 0.74)) drop-shadow(0 0 36px oklch(0.66 0.04 225 / 0.18))",
                }}
              />
              <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[9.5px] uppercase tracking-[0.34em] text-foreground/45">
                Cinematic studio capture
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-foreground/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-accent/70" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                      {item.stage}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-foreground/98 md:text-5xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                    {item.domain}
                  </p>
                </div>
                <div className="aspect-square w-24 overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.07_0.008_245)]">
                  <div
                    className="h-full w-full"
                    style={{
                      background:
                        `radial-gradient(circle at 50% 28%, oklch(0.82 0.03 225 / 0.18), transparent 28%), linear-gradient(180deg, oklch(0.1 0.008 245), oklch(0.06 0.008 245))`,
                    }}
                  >
                    <img
                      src={item.img}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-contain scale-[1.45] p-3"
                      style={{ filter: "drop-shadow(0 14px 18px oklch(0 0 0 / 0.62))" }}
                    />
                  </div>
                </div>
              </div>

              <p className="max-w-md text-[14.5px] leading-relaxed text-foreground/80">
                {item.body}
              </p>

              <div className="grid gap-px overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.08]">
                <div className="bg-background/50 px-4 py-4">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                    Performance
                  </p>
                  <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                    {item.metric}
                  </p>
                </div>
                <div className="bg-background/50 px-4 py-4">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                    Program Status
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/75">
                    {item.status}
                  </p>
                </div>
              </div>

              <div className="rounded-sm border border-foreground/[0.08] bg-background/40 px-4 py-4">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-accent/75">
                  Presentation Note
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/72">
                  Identity-preserved studio staging with restrained light drift and atmospheric separation — engineered to feel photographic, tactile, and physically grounded without gimmicky 3D controls.
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
