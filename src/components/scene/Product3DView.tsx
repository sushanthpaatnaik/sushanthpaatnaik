import { useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
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

/**
 * HeroVideo — cinematic looping video for the field-deployment hero frame.
 * Autoplays muted (browser policy compliant), then offers an elegant
 * interactive unmute on click/tap or via the sound toggle. Volume ramps
 * smoothly via requestAnimationFrame for a non-jarring audio fade-in.
 */
function HeroVideo({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);

  // Reveal the "Sound Available" hint after a short delay, only while muted.
  useEffect(() => {
    if (!muted) {
      setHintVisible(false);
      return;
    }
    const t = window.setTimeout(() => setHintVisible(true), 2400);
    return () => window.clearTimeout(t);
  }, [muted]);

  const rampVolume = (target: number, durationMs = 650) => {
    const el = ref.current;
    if (!el) return;
    const start = el.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - k, 3);
      el.volume = start + (target - start) * eased;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const enableSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    el.volume = 0;
    setMuted(false);
    // Re-issue play in case the unmute requires a fresh user-gesture play.
    el.play().catch(() => {});
    rampVolume(1, 700);
  };

  const disableSound = () => {
    const el = ref.current;
    if (!el) return;
    rampVolume(0, 350);
    window.setTimeout(() => {
      if (!ref.current) return;
      ref.current.muted = true;
      setMuted(true);
    }, 360);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (muted) enableSound();
    else disableSound();
  };

  return (
    <>
      <motion.video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onClick={() => {
          if (muted) enableSound();
        }}
        initial={{ opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        className={`cursor-pointer ${className ?? ""}`}
        style={style}
      />
      {/* Sound toggle — minimal amber/graphite control */}
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Enable sound" : "Mute sound"}
        className="group/snd absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-sm border border-foreground/[0.14] bg-[oklch(0.04_0.006_245/0.72)] px-2.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:bg-[oklch(0.06_0.01_245/0.85)]"
      >
        {muted ? (
          <VolumeX className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/snd:text-accent" />
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-accent/90" />
        )}
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/snd:text-foreground/95">
          {muted ? "Sound On" : "Mute"}
        </span>
      </button>
      {/* Subtle hint that audio is available — fades in after a moment */}
      <AnimatePresence>
        {muted && hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="pointer-events-none absolute bottom-16 right-4 z-20 rounded-sm border border-accent/25 bg-[oklch(0.05_0.01_245/0.8)] px-2.5 py-1 backdrop-blur-md"
          >
            <span className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-accent/85">
              Sound Available
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
  /** Optional field-deployment video used in place of the application still. */
  applicationVideo?: string;
  stage: string;
  specs?: { k: string; v: string; note: string }[];
  positioning?: string;
  applicationContext?: string[];
  /** When true, hide the small product thumbnail next to the title and render
   *  a wide cinematic Field Application Preview frame inside the info panel. */
  largeApplicationFrame?: boolean;
  /** Short caption shown inside the large application frame. */
  applicationCaption?: string;
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
              {/* TOP HERO FRAME.
                  Default: studio product photograph.
                  When largeApplicationFrame is on, the field application media
                  takes over the hero slot and the studio photo moves below. */}
              {item.largeApplicationFrame ? (
                <div className="group relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.1] bg-[oklch(0.045_0.008_245)]">
                  {item.applicationVideo ? (
                    <HeroVideo
                      key={item.applicationVideo + "-hero"}
                      src={item.applicationVideo}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
                      style={{ filter: "contrast(1.05) saturate(0.88) brightness(0.94)" }}
                    />
                  ) : (
                    <motion.img
                      key={(item.detailImg ?? item.img) + "-hero"}
                      src={item.detailImg ?? item.img}
                      alt={`${item.title} — field deployment`}
                      draggable={false}
                      initial={{ opacity: 0, scale: 1.025 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
                      style={{ filter: "contrast(1.05) saturate(0.86) brightness(0.92)" }}
                    />
                  )}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 46%, transparent 50%, oklch(0.02 0.006 245 / 0.4) 88%, oklch(0.015 0.006 245 / 0.72) 100%)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,oklch(0.03_0.006_245/0.88)_100%)]" />
                  {/* Industrial corner brackets */}
                  <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                  <FilmGrain opacity={0.06} />
                  <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/85" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/75">
                      Field Deployment · Preview
                    </span>
                  </div>
                  <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-4">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.3em] text-foreground/82">
                      {item.applicationCaption ?? `${item.title} · Deployment`}
                    </p>
                    {!item.applicationVideo && (
                      <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/45">
                        Archive · Field capture
                      </p>
                    )}
                  </div>
                </div>
              ) : (
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
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* SECONDARY FRAME.
                    Default: application media. When the hero is the
                    application, this slot becomes the studio product artifact. */}
                {item.largeApplicationFrame ? (
                  <div className="group relative aspect-[1.15/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.045_0.008_245)]">
                    <motion.img
                      key={(item.detailImg ?? item.img) + "-fieldctx"}
                      src={item.detailImg ?? item.img}
                      alt={`${item.title} — supporting field context`}
                      draggable={false}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.9, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                      style={{ filter: "contrast(1.05) saturate(0.82) brightness(0.88)" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.02 0.006 245 / 0.42) 95%)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,oklch(0.03_0.006_245/0.78)_100%)]" />
                    <FilmGrain opacity={0.06} />
                    <div className="absolute bottom-3 left-3 z-10">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/65">
                        Field · In-situ context
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="group relative aspect-[1.15/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)]">
                    {item.applicationVideo ? (
                      <motion.video
                        key={item.applicationVideo}
                        src={item.applicationVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                        className="absolute inset-0 h-full w-full object-cover opacity-95 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ filter: "contrast(1.05) saturate(0.85) brightness(0.9)" }}
                      />
                    ) : (
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
                    )}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 50%, transparent 40%, oklch(0.02 0.006 245 / 0.42) 95%)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,oklch(0.03_0.006_245/0.78)_100%)]" />
                    <FilmGrain opacity={0.07} />
                    <div className="absolute bottom-3 left-3 z-10">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/65">
                        {item.applicationVideo ? "Application · Field capture" : "Application · Field"}
                      </p>
                    </div>
                    {item.applicationVideo && (
                      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-sm border border-foreground/[0.12] bg-[oklch(0.04_0.006_245/0.7)] px-2 py-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/90" />
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/80">
                          Live · Loop
                        </span>
                      </div>
                    )}
                  </div>
                )}

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
                        {item.largeApplicationFrame ? "Deployment Note" : "Capture Note"}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/72">
                        {item.largeApplicationFrame
                          ? "Field documentation prioritised over studio artifact — deployment context, industrial atmosphere, and material behaviour observed in situ within real operating environments."
                          : "Photographed against a low-key graphite cyclorama. Soft top diffusion, single edge key, controlled specular rolloff — staged as a confidential industrial artifact."}
                      </p>
                    </div>
                    <div className="border-t border-foreground/[0.08] pt-3">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/45">
                        {item.largeApplicationFrame ? "Capture context" : "Optical treatment"}
                      </p>
                      <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-foreground/62">
                        {item.largeApplicationFrame
                          ? "Field deployment · in-situ documentation"
                          : "Cinema lens · shallow DOF · 16mm grain"}
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
                {!item.largeApplicationFrame && (
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
                )}
              </div>

              {item.largeApplicationFrame && (
                <div className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-foreground/[0.1] bg-[oklch(0.045_0.008_245)]">
                  {/* Studio cyclorama backdrop */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 22%, oklch(0.82 0.02 235 / 0.16), transparent 55%), radial-gradient(circle at 50% 110%, oklch(0 0 0 / 0.9), transparent 60%), linear-gradient(180deg, oklch(0.09 0.008 245) 0%, oklch(0.045 0.008 245) 55%, oklch(0.02 0.006 245) 100%)",
                    }}
                  />
                  {/* Soft top diffusion */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[10%] top-[5%] h-[28%] rounded-[50%] opacity-55 blur-3xl"
                    style={{ background: "radial-gradient(ellipse, oklch(0.88 0.02 235 / 0.22), transparent 70%)" }}
                  />
                  {/* Ground contact shadow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-[12%] left-1/2 h-[6%] w-[58%] -translate-x-1/2 rounded-[50%] opacity-85 blur-2xl"
                    style={{ background: "radial-gradient(ellipse, oklch(0 0 0 / 0.95), transparent 65%)" }}
                  />
                  <motion.img
                    key={item.img + "-hero-artifact"}
                    src={item.img}
                    alt={`${item.title} — engineered artifact`}
                    draggable={false}
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0 h-full w-full object-contain p-[10%] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025] group-hover:-translate-y-1"
                    style={{
                      filter:
                        "drop-shadow(0 36px 44px oklch(0 0 0 / 0.78)) drop-shadow(0 18px 22px oklch(0 0 0 / 0.45)) drop-shadow(0 0 24px oklch(0.85 0.02 235 / 0.06))",
                    }}
                  />
                  {/* Industrial corner brackets */}
                  <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                  <FilmGrain opacity={0.05} />
                  <div className="pointer-events-none absolute left-4 top-3.5 z-10 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.36em] text-foreground/72">
                      Engineered Artifact · Studio
                    </span>
                  </div>
                  <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between gap-4">
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-foreground/72">
                      {item.title}
                    </p>
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-foreground/40">
                      ƒ/2.0 · 85mm · cinema
                    </p>
                  </div>
                </div>
              )}

              <p className="max-w-md text-[14.5px] leading-relaxed text-foreground/80">
                {item.positioning || item.body}
              </p>

              {item.specs && (
                <div className="grid gap-px overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.08]">
                  {item.specs.map((spec) => (
                    <div key={spec.k} className="bg-background/50 px-4 py-4">
                      <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                        {spec.k}
                      </p>
                      <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                        {spec.v}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/45">
                        {spec.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {item.applicationContext && (
                <div className="overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)] px-4 py-4">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                    Application Context
                  </p>
                  <ul className="mt-2.5 space-y-1.5">
                    {item.applicationContext.map((ctx) => (
                      <li key={ctx} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-accent/60" />
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/65">
                          {ctx}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-px overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.08]">
                {!item.specs && (
                  <div className="bg-background/50 px-4 py-4">
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
                      Performance
                    </p>
                    <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                      {item.metric}
                    </p>
                  </div>
                )}
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
