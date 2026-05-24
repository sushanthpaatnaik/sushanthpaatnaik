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
  /** Reduce inner padding to increase product authority on flagship cards. */
  hero?: boolean;
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

/**
 * FilmGrain — micro 16mm-style noise layer for photographic optical realism.
 * SVG fractal noise rendered once; sits above everything except UI text.
 */
function FilmGrain({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.58 0 0 0 0 0.62 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: "220px 220px",
      }}
    />
  );
}

export function Tilt3DSurface({
  src,
  alt,
  className = "",
  style,
  imgClassName = "",
  imgStyle,
  children,
  hero = false,
}: TiltImageProps) {
  const reduced = useReducedMotion();
  // Hero products get tighter padding → ~12% larger visual presence.
  const pad = hero ? "p-[7%]" : "p-[9%]";
  const reflPad = hero ? "7%" : "9%";

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={style}>
      {/* Atmospheric studio gradient — deep graphite cyc */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={reduced ? undefined : { opacity: [0.95, 1, 0.96] }}
        transition={reduced ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 38% 16%, oklch(0.78 0.025 230 / 0.20), transparent 0 22%), radial-gradient(circle at 70% 30%, oklch(0.42 0.012 240 / 0.22), transparent 0 32%), linear-gradient(180deg, oklch(0.135 0.008 245) 0%, oklch(0.075 0.008 245) 48%, oklch(0.035 0.008 245) 100%)",
        }}
      />

      {/* Volumetric key light haze — soft top diffusion */}
      <div
        aria-hidden
        className="absolute inset-x-[6%] top-[6%] h-[36%] rounded-[50%] opacity-55 blur-3xl"
        style={{ background: "radial-gradient(ellipse, oklch(0.88 0.02 235 / 0.22), transparent 70%)" }}
      />

      {/* Reflective grounding plane — sub-surface */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.04 0.006 245 / 0.55) 40%, oklch(0.018 0.006 245 / 0.98) 100%)",
        }}
      />
      {/* Hairline horizon */}
      <div
        aria-hidden
        className="absolute left-[4%] right-[4%] bottom-[18%] h-px opacity-40"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.7 0.015 235 / 0.5), transparent)" }}
      />

      {/* Contact shadow — tight beneath subject */}
      <div
        aria-hidden
        className="absolute bottom-[14%] left-1/2 h-[8%] w-[58%] -translate-x-1/2 rounded-[50%] opacity-85 blur-2xl"
        style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.92), transparent 65%)" }}
      />
      {/* Ambient bounce shadow — wider, softer */}
      <div
        aria-hidden
        className="absolute bottom-[10%] left-1/2 h-[14%] w-[82%] -translate-x-1/2 rounded-[50%] opacity-60 blur-3xl"
        style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.7), transparent 72%)" }}
      />

      {/* Subject — main product */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        animate={reduced ? undefined : { y: [0, -2.5, 0], scale: [1.012, 1.02, 1.012] }}
        transition={reduced ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 h-full w-full object-contain ${pad} ${imgClassName}`}
        style={{
          filter:
            "drop-shadow(0 32px 42px oklch(0 0 0 / 0.78)) drop-shadow(0 16px 24px oklch(0 0 0 / 0.4)) drop-shadow(0 0 22px oklch(0.85 0.02 235 / 0.06))",
          ...imgStyle,
        }}
      />

      {/* Floor reflection — mirrored, blurred, masked.
          NOTE: framer-motion's `y`/`scale` writes to transform and would
          overwrite the flip. Keep flip on a static wrapper; animate INSIDE. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          transform: "scaleY(-1) translateY(-78%)",
          opacity: 0.16,
          filter: "blur(5px) saturate(0.55) brightness(0.65)",
          maskImage: "linear-gradient(180deg, oklch(0 0 0 / 0.85) 0%, transparent 60%)",
          WebkitMaskImage: "linear-gradient(180deg, oklch(0 0 0 / 0.85) 0%, transparent 60%)",
        }}
      >
        <motion.img
          src={src}
          alt=""
          loading="lazy"
          animate={reduced ? undefined : { y: [0, -2.5, 0], scale: [1.012, 1.02, 1.012] }}
          transition={reduced ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ padding: reflPad }}
        />
      </div>

      {/* Top edge specular — soft rim light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] top-[6%] h-px opacity-55"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.92 0.02 235 / 0.6), transparent)" }}
      />

      {/* Lens vignette + atmospheric cinematic rolloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, transparent 48%, oklch(0.02 0.006 245 / 0.32) 78%, oklch(0.015 0.006 245 / 0.7) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.10) 0%, transparent 22%, transparent 56%, oklch(0.015 0.006 245 / 0.78) 100%)",
        }}
      />

      <FilmGrain opacity={0.06} />
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
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, oklch(0.05 0.008 245 / 0.92) 0%, oklch(0.02 0.006 245 / 0.98) 70%)",
            backdropFilter: "blur(20px)",
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
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="relative grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-[1.35fr_0.95fr] md:px-10"
          >
            <div className="grid gap-4">
              {/* Hero capture — flagship product photograph.
                  Render the cinematic photo directly (no Tilt stage). One
                  stable fade-in, then it stays — no looping opacity. */}
              <div className="relative aspect-[1.05/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.04_0.008_245)]">
                <motion.img
                  key={item.img}
                  src={item.img}
                  alt={item.title}
                  draggable={false}
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: "contrast(1.02) saturate(0.96) brightness(0.98)" }}
                />
                {/* Cinematic vignette + grain layered on top — never touches opacity of subject */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 44%, transparent 52%, oklch(0.02 0.006 245 / 0.34) 82%, oklch(0.015 0.006 245 / 0.7) 100%)",
                  }}
                />
                <FilmGrain opacity={0.05} />
                <div className="pointer-events-none absolute bottom-5 left-5 z-10 font-mono text-[9.5px] uppercase tracking-[0.34em] text-foreground/70">
                  Archive · Studio capture
                </div>
                <div className="pointer-events-none absolute bottom-5 right-5 z-10 font-mono text-[9.5px] uppercase tracking-[0.34em] text-foreground/45">
                  ƒ/2.0 · 85mm · cinema
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Application — real-world use-case photograph */}
                <div className="relative aspect-[1.15/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)]">
                  <motion.img
                    key={(item.detailImg ?? item.img) + "-app"}
                    src={item.detailImg ?? item.img}
                    alt={`${item.title} — application`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: "contrast(1.05) saturate(0.82) brightness(0.88)" }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.02 0.006 245 / 0.42) 95%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,oklch(0.03_0.006_245/0.78)_100%)]" />
                  <FilmGrain opacity={0.07} />
                  <div className="absolute bottom-3 left-3 z-10">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/65">
                      Application · Field
                    </p>
                  </div>
                </div>

                {/* Optical / studio note */}
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
                        Capture Note
                      </p>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/72">
                        Photographed against a low-key graphite cyclorama. Soft top diffusion, single edge key, controlled specular rolloff — staged as a confidential industrial artifact.
                      </p>
                    </div>
                    <div className="border-t border-foreground/[0.08] pt-3">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/45">
                        Optical treatment
                      </p>
                      <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-foreground/62">
                        Cinema lens · shallow DOF · 16mm grain
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
                        "radial-gradient(circle at 42% 26%, oklch(0.82 0.02 235 / 0.18), transparent 30%), linear-gradient(180deg, oklch(0.1 0.008 245), oklch(0.05 0.008 245))",
                    }}
                  >
                    <img
                      src={item.img}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-contain p-2.5"
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
