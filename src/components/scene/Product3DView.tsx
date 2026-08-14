import { useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2, Play, Pause, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import AquamaxSimulationCompact from "@/components/scene/AquamaxSimulationCompact";

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
  // On touch/coarse-pointer devices: disable all repeat:Infinity animations
  // (23 cards × 3 animations = 69 RAF loops → iOS Safari OOM crash).
  // Also skip the floor-reflection image (halves per-card image memory).
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  const still = reduced || coarse;
  // Hero products get tighter padding → ~12% larger visual presence.
  const pad = hero ? "p-[7%]" : "p-[9%]";
  const reflPad = hero ? "7%" : "9%";

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={style}>
      {/* Atmospheric studio gradient — deep graphite cyc */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={still ? undefined : { opacity: [0.95, 1, 0.96] }}
        transition={still ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
        animate={still ? undefined : { y: [0, -2.5, 0], scale: [1.012, 1.02, 1.012] }}
        transition={still ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 h-full w-full object-contain ${pad} ${imgClassName}`}
        style={{
          filter:
            "drop-shadow(0 32px 42px oklch(0 0 0 / 0.78)) drop-shadow(0 16px 24px oklch(0 0 0 / 0.4)) drop-shadow(0 0 22px oklch(0.85 0.02 235 / 0.06))",
          ...imgStyle,
        }}
      />

      {/* Floor reflection — mirrored, blurred, masked. Skipped on touch to
          halve per-card image memory and eliminate the RAF loop. */}
      {!coarse && (
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
            animate={still ? undefined : { y: [0, -2.5, 0], scale: [1.012, 1.02, 1.012] }}
            transition={still ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-contain"
            style={{ padding: reflPad }}
          />
        </div>
      )}

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
  const mountedRef = useRef(true);
  const rampRafRef = useRef<number | null>(null);
  const muteTimeoutRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Keep React state synced with native play/pause events (e.g. fullscreen UI).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  // Reveal the "Sound Available" hint after a short delay, only while muted.
  useEffect(() => {
    if (!muted) {
      setHintVisible(false);
      return;
    }
    const t = window.setTimeout(() => setHintVisible(true), 2400);
    return () => window.clearTimeout(t);
  }, [muted]);

  // Track native fullscreen changes so the icon stays in sync.
  useEffect(() => {
    const onChange = () => {
      const el = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(el === ref.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange as EventListener);
    };
  }, []);

  // Hard cleanup on unmount — pause playback, mute, and cancel any pending
  // volume-ramp RAF / mute timeout so audio cannot bleed past modal close.
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (rampRafRef.current !== null) cancelAnimationFrame(rampRafRef.current);
      if (muteTimeoutRef.current !== null) window.clearTimeout(muteTimeoutRef.current);
      const el = ref.current;
      if (el) {
        try {
          el.pause();
          el.muted = true;
          el.volume = 0;
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  const rampVolume = (target: number, durationMs = 650) => {
    const el = ref.current;
    if (!el) return;
    if (rampRafRef.current !== null) cancelAnimationFrame(rampRafRef.current);
    const start = el.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      if (!mountedRef.current || !ref.current) return;
      const k = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - k, 3);
      ref.current.volume = start + (target - start) * eased;
      if (k < 1) rampRafRef.current = requestAnimationFrame(step);
      else rampRafRef.current = null;
    };
    rampRafRef.current = requestAnimationFrame(step);
  };

  const enableSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    el.volume = 0;
    setMuted(false);
    el.play().catch(() => {});
    rampVolume(1, 700);
  };

  const disableSound = () => {
    const el = ref.current;
    if (!el) return;
    rampVolume(0, 350);
    if (muteTimeoutRef.current !== null) window.clearTimeout(muteTimeoutRef.current);
    muteTimeoutRef.current = window.setTimeout(() => {
      muteTimeoutRef.current = null;
      if (!mountedRef.current || !ref.current) return;
      ref.current.muted = true;
      setMuted(true);
    }, 360);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (muted) enableSound();
    else disableSound();
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = ref.current as (HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => Promise<void>;
    }) | null;
    if (!el) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const inFs = !!(document.fullscreenElement || doc.webkitFullscreenElement);
    try {
      if (inFs) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.webkitEnterFullscreen) {
        // iOS Safari fallback — native video fullscreen.
        el.webkitEnterFullscreen();
      }
    } catch {
      // Silent fail — playback continues inline.
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const replay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
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
        preload="none"
        onClick={() => togglePlay()}
        initial={{ opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        className={`cursor-pointer ${className ?? ""}`}
        style={style}
      />

      {/* Cinematic micro-control cluster — bottom right.
          Order: Play/Pause · Replay · Sound · Full View */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-sm border border-foreground/[0.14] bg-[oklch(0.04_0.006_245/0.72)] p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="group/pp flex h-7 items-center gap-1.5 rounded-[2px] px-2 transition-colors hover:bg-[oklch(0.08_0.012_245/0.75)]"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 text-foreground/75 transition-colors group-hover/pp:text-accent" strokeWidth={1.6} />
          ) : (
            <Play className="h-3.5 w-3.5 text-accent/95 transition-colors" strokeWidth={1.6} />
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/pp:text-foreground/95">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </button>

        <span aria-hidden className="h-3 w-px bg-foreground/[0.12]" />

        <button
          type="button"
          onClick={replay}
          aria-label="Replay from start"
          className="group/rp flex h-7 items-center justify-center rounded-[2px] px-2 transition-colors hover:bg-[oklch(0.08_0.012_245/0.75)]"
        >
          <RotateCcw className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/rp:text-accent" strokeWidth={1.6} />
        </button>

        <span aria-hidden className="h-3 w-px bg-foreground/[0.12]" />

        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? "Enable sound" : "Mute sound"}
          className="group/snd flex h-7 items-center gap-1.5 rounded-[2px] px-2 transition-colors hover:bg-[oklch(0.08_0.012_245/0.75)]"
        >
          {muted ? (
            <VolumeX className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/snd:text-accent" strokeWidth={1.6} />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-accent/90" strokeWidth={1.6} />
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/snd:text-foreground/95">
            {muted ? "Sound" : "Mute"}
          </span>
        </button>

        <span aria-hidden className="h-3 w-px bg-foreground/[0.12]" />

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit full view" : "Open full view"}
          className="group/fs flex h-7 items-center gap-1.5 rounded-[2px] px-2 transition-colors hover:bg-[oklch(0.08_0.012_245/0.75)]"
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5 text-accent/90" strokeWidth={1.6} />
          ) : (
            <Maximize2 className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/fs:text-accent" strokeWidth={1.6} />
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/fs:text-foreground/95">
            {isFullscreen ? "Exit" : "Full View"}
          </span>
        </button>
      </div>

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
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-accent/85">
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
  /** Aquamax-only: render the interactive chimney hood / HV-LC recovery
   *  simulation as the right-side panel of the inspection view. */
  aquamaxSimulation?: boolean;
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
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    // Compensate for scrollbar disappearing to prevent layout shift on open.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
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
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, oklch(0.05 0.008 245 / 0.92) 0%, oklch(0.02 0.006 245 / 0.98) 70%)",
            backdropFilter: "blur(20px)",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
          onClick={onClose}
        >
          <div className="pointer-events-none fixed left-0 right-0 top-0 z-[82] flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-10" style={{ background: "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.85) 0%, oklch(0.02 0.006 245 / 0.55) 60%, transparent 100%)" }}>
            <div className="pointer-events-auto flex items-center gap-3">
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
              className="pointer-events-auto flex items-center gap-2 rounded-sm border border-foreground/[0.12] bg-[oklch(0.04_0.006_245/0.7)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/75 backdrop-blur-md transition-colors hover:border-accent/40 hover:text-foreground"
              aria-label="Close product inspection"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden sm:inline">Close · ESC</span>
              <span className="sm:hidden">Close</span>
            </button>
          </div>

          <div className="flex min-h-full w-full items-center justify-center py-24 md:py-28">
          {item.aquamaxSimulation ? (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative grid w-full max-w-[1480px] grid-cols-1 gap-x-10 gap-y-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:px-10"
          >
            {/* LEFT — Aquamax product studio hero */}
            <div className="grid content-start gap-5">
              <div className="relative aspect-[1.05/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.04_0.008_245)]">
                <motion.img
                  key={item.img + "-aqua-hero"}
                  src={item.img}
                  alt={`${item.title} — HV-LC recovery system`}
                  draggable={false}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 h-full w-full object-contain px-[5%] py-[7%]"
                  style={{ filter: "contrast(1.04) saturate(0.94) brightness(0.97)" }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 42%, transparent 50%, oklch(0.02 0.006 245 / 0.36) 84%, oklch(0.015 0.006 245 / 0.72) 100%)",
                  }}
                />
                <FilmGrain opacity={0.05} />
                <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/85" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/72">
                    HV-LC Recovery System · Archive
                  </span>
                </div>
                <div className="pointer-events-none absolute bottom-5 left-5 z-10 font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/70">
                  Aquamax · Studio capture
                </div>
                <div className="pointer-events-none absolute bottom-5 right-5 z-10 font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/45">
                  ƒ/2.0 · 85mm · cinema
                </div>
              </div>

              {item.detailImg && (
                <div className="group relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.045_0.008_245)]">
                  <motion.img
                    key={item.detailImg + "-aqua-app"}
                    src={item.detailImg}
                    alt={`${item.title} — field deployment`}
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.025 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
                    style={{ filter: "contrast(1.05) saturate(0.86) brightness(0.92)" }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 46%, transparent 50%, oklch(0.02 0.006 245 / 0.4) 88%, oklch(0.015 0.006 245 / 0.72) 100%)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,oklch(0.03_0.006_245/0.88)_100%)]" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                  <FilmGrain opacity={0.06} />
                  <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2 opacity-80">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/85" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/72">
                      Field Deployment
                    </span>
                  </div>
                  <div className="pointer-events-none absolute bottom-5 left-5 z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
                    {item.title} · Cooling tower recovery
                  </div>
                </div>
              )}

              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-foreground/[0.08] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-accent/70" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                      {item.stage}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-[-0.025em] text-foreground/98 md:text-5xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                    {item.domain}
                  </p>
                </div>
              </div>

              <p className="max-w-md text-[14.5px] leading-relaxed text-foreground/80">
                {item.positioning || item.body}
              </p>

              <div className="grid gap-px overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.08]">
                <div className="bg-background/50 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                    Performance
                  </p>
                  <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                    {item.metric}
                  </p>
                </div>
                <div className="bg-background/50 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                    Program Status
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/75">
                    {item.status}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Compact chimney hood / HV-LC simulation panel */}
            <div className="relative">
              <AquamaxSimulationCompact />
            </div>
          </motion.div>
          ) : (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative grid w-full max-w-[1240px] grid-cols-1 gap-x-12 gap-y-8 px-4 sm:px-6 lg:grid-cols-[1.65fr_0.9fr] md:px-10"
          >
            <div className="grid content-start gap-5">
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
                  <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/85" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/70">
                      Field Deployment
                    </span>
                  </div>
                  <div className="pointer-events-none absolute bottom-5 left-5 z-10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
                      {item.applicationCaption ?? `${item.title} · Deployment`}
                    </p>
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
                    className="absolute inset-0 h-full w-full object-contain px-[5.5%] py-[8%]"
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
                  <div className="pointer-events-none absolute bottom-5 left-5 z-10 font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/70">
                    Archive · Studio capture
                  </div>
                  <div className="pointer-events-none absolute bottom-5 right-5 z-10 font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/45">
                    ƒ/2.0 · 85mm · cinema
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.35fr_1fr]">
                {/* SECONDARY FRAME.
                    Default: application media. When the hero is the
                    application, this slot becomes the studio product artifact. */}
                {item.largeApplicationFrame ? (
                  <div className="group relative aspect-[1.45/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.045_0.008_245)]">
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
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/65">
                        Field · In-situ context
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="group relative aspect-[1.15/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)]">
                    {item.applicationVideo ? (
                      <HeroVideo
                        key={item.applicationVideo + "-secondary"}
                        src={item.applicationVideo}
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
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/65">
                        {item.applicationVideo ? "Application · Field capture" : "Application · Field"}
                      </p>
                    </div>
                    {item.applicationVideo && (
                      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-sm border border-foreground/[0.12] bg-[oklch(0.04_0.006_245/0.7)] px-2 py-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/90" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
                          Live · Loop
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Optical / studio note */}
                <div className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)] px-5 py-5">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.09 0.008 245) 0%, oklch(0.05 0.008 245) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-accent/75">
                        {item.largeApplicationFrame ? "Deployment Note" : "Capture Note"}
                      </p>
                      <p className="mt-3 text-[12.5px] leading-[1.65] text-foreground/74">
                        {item.largeApplicationFrame
                          ? "Field documentation prioritised over studio artifact — deployment context, industrial atmosphere, and material behaviour observed in situ within real operating environments."
                          : "Photographed against a low-key graphite cyclorama. Soft top diffusion, single edge key, controlled specular rolloff — staged as a confidential industrial artifact."}
                      </p>
                    </div>
                    <div className="border-t border-foreground/[0.08] pt-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                        {item.largeApplicationFrame ? "Capture context" : "Optical treatment"}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/62">
                        {item.largeApplicationFrame
                          ? "Field deployment · in-situ documentation"
                          : "Cinema lens · shallow DOF · 16mm grain"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-foreground/[0.08] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-accent/70" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                      {item.stage}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-[-0.025em] text-foreground/98 md:text-5xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                    {item.domain}
                  </p>
                </div>
                {!item.largeApplicationFrame && (
                  <div className="hidden sm:block aspect-square w-24 overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.07_0.008_245)]">
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
                <div className="group relative mx-auto aspect-[1/1.15] w-full max-w-[92%] overflow-hidden rounded-sm border border-foreground/[0.1] bg-[oklch(0.045_0.008_245)]">
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
                    className="pointer-events-none absolute bottom-[10%] left-1/2 h-[6%] w-[64%] -translate-x-1/2 rounded-[50%] opacity-85 blur-2xl"
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
                    className="absolute inset-0 h-full w-full object-contain px-[3%] py-[4%] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025] group-hover:-translate-y-1"
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
                    <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-foreground/72">
                      Engineered Artifact · Studio
                    </span>
                  </div>
                  <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between gap-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/72">
                      {item.title}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/40">
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
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                        {spec.k}
                      </p>
                      <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                        {spec.v}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/45">
                        {spec.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {item.applicationContext && (
                <div className="overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.008_245)] px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
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
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                      Performance
                    </p>
                    <p className="mt-1.5 font-display text-xl tracking-[-0.015em] text-foreground/95">
                      {item.metric}
                    </p>
                  </div>
                )}
                <div className="bg-background/50 px-4 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                    Program Status
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/75">
                    {item.status}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
