import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
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
  const reduced = useReducedMotion();

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={style}>
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={reduced ? undefined : { opacity: [0.94, 1, 0.96] }}
        transition={reduced ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 36% 18%, oklch(0.76 0.02 230 / 0.18), transparent 0 18%), radial-gradient(circle at 68% 28%, oklch(0.44 0.01 240 / 0.22), transparent 0 30%), linear-gradient(180deg, oklch(0.13 0.008 245) 0%, oklch(0.07 0.008 245) 50%, oklch(0.04 0.008 245) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-[9%] top-[10%] h-[32%] rounded-[50%] opacity-50 blur-3xl"
        style={{ background: "radial-gradient(ellipse, oklch(0.86 0.02 235 / 0.18), transparent 72%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-[8%] left-1/2 h-[18%] w-[78%] -translate-x-1/2 rounded-[50%] opacity-70 blur-3xl"
        style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.78), transparent 72%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-[10.5%] left-1/2 h-[11%] w-[42%] -translate-x-1/2 rounded-[50%] opacity-60 blur-xl"
        style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.82), transparent 68%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[12%] top-[9%] h-px opacity-60"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.9 0.02 235 / 0.55), transparent)" }}
      />
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        animate={reduced ? undefined : { y: [0, -2, 0], scale: [1.012, 1.018, 1.012] }}
        transition={reduced ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 h-full w-full object-contain p-[10%] ${imgClassName}`}
        style={{
          filter:
            "drop-shadow(0 28px 38px oklch(0 0 0 / 0.72)) drop-shadow(0 14px 22px oklch(0 0 0 / 0.36))",
          ...imgStyle,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.08) 0%, transparent 22%, transparent 58%, oklch(0.02 0.006 245 / 0.72) 100%)",
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
  detailImg?: string;
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
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

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
              "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.92) 0%, oklch(0.03 0.006 245 / 0.97) 100%)",
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
            initial={{ scale: 0.98, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.985, y: 8 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="relative grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[1.35fr_0.95fr] md:px-10"
          >
            <div className="grid gap-4">
              <div className="relative aspect-[1.05/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.008_245)]">
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  animate={reduced ? undefined : { opacity: [0.94, 1, 0.95] }}
                  transition={reduced ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background:
                      "radial-gradient(circle at 34% 18%, oklch(0.82 0.025 235 / 0.18), transparent 0 18%), radial-gradient(circle at 64% 24%, oklch(0.44 0.012 240 / 0.18), transparent 0 32%), linear-gradient(180deg, oklch(0.12 0.008 245) 0%, oklch(0.06 0.008 245) 52%, oklch(0.04 0.008 245) 100%)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-x-[10%] top-[10%] h-[28%] rounded-[50%] opacity-55 blur-3xl"
                  style={{ background: "radial-gradient(ellipse, oklch(0.86 0.02 235 / 0.22), transparent 72%)" }}
                />
                <div
                  aria-hidden
                  className="absolute bottom-[9%] left-1/2 h-[17%] w-[82%] -translate-x-1/2 rounded-[50%] opacity-75 blur-3xl"
                  style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.8), transparent 72%)" }}
                />
                <div
                  aria-hidden
                  className="absolute bottom-[11.5%] left-1/2 h-[10.5%] w-[40%] -translate-x-1/2 rounded-[50%] opacity-60 blur-xl"
                  style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.82), transparent 68%)" }}
                />
                <motion.img
                  src={item.img}
                  alt={item.title}
                  draggable={false}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={reduced ? { opacity: 1, y: 0, scale: 1.01 } : { opacity: 1, y: [0, -3, 0], scale: [1.01, 1.018, 1.01] }}
                  transition={reduced ? { duration: 0.8, ease: [0.19, 1, 0.22, 1] } : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full object-contain p-[11%]"
                  style={{ filter: "drop-shadow(0 34px 46px oklch(0 0 0 / 0.76)) drop-shadow(0 14px 24px oklch(0 0 0 / 0.4))" }}
                />
                <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[9.5px] uppercase tracking-[0.34em] text-foreground/45">
                  Archive studio capture
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[1.15/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)]">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 20%, oklch(0.84 0.02 235 / 0.2), transparent 0 18%), linear-gradient(180deg, oklch(0.1 0.008 245) 0%, oklch(0.05 0.008 245) 100%)",
                    }}
                  />
                  <img
                    src={item.detailImg ?? item.img}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover opacity-76"
                    style={{ objectPosition: "center 24%", filter: "contrast(1.02) saturate(0.82) brightness(0.88)" }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_18%,oklch(0.03_0.006_245/0.74)_100%)]" />
                  <div className="absolute bottom-3 left-3">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/48">
                      Material detail
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)] p-4">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.09 0.008 245) 0%, oklch(0.05 0.008 245) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-accent/75">
                        Presentation Note
                      </p>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/72">
                        Exact product identity preserved and staged as a restrained industrial editorial photograph — grounded, tactile, and atmospheric without synthetic 3D rotation.
                      </p>
                    </div>
                    <div className="border-t border-foreground/[0.08] pt-3">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/45">
                        Optical treatment
                      </p>
                      <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-foreground/62">
                        Low-key studio · graphite surface · soft edge light
                      </p>
                    </div>
                  </div>
                </div>
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
                        "radial-gradient(circle at 42% 26%, oklch(0.82 0.02 235 / 0.16), transparent 28%), linear-gradient(180deg, oklch(0.1 0.008 245), oklch(0.06 0.008 245))",
                    }}
                  >
                    <img
                      src={item.img}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-contain p-3"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

