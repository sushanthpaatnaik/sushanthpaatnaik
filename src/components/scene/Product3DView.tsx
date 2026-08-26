import { useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2, Play, Pause, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { track } from "@/lib/analytics";
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
  /**
   * oklch hue angle for this card's domain, giving each sector its own light
   * without breaking the shared cyclorama. Sits directly on the cyc and under
   * the whole light rig, so the key, floor, contact shadow, rim and vignette
   * all still composite over it and grounding is unchanged. Omit for the
   * neutral stage.
   */
  tintHue?: number;
  /**
   * Contextual ground — the product's own application photograph, sitting on
   * the cyclorama and under the whole light rig. Softens the floor and
   * vignette, which at their default strengths (0.98 and 0.7) leave a
   * photograph nothing to survive on; the contact shadow is deliberately not
   * softened, since it is what still seats the product on the surface.
   */
  bgSrc?: string;
  contextual?: boolean;
  /** Per-card exposure multiplier applied on top of --stage-ctx-bg-filter. */
  bgExposure?: number;
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
  tintHue,
  bgSrc,
  contextual = false,
  bgExposure,
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
            "var(--stage-cyc)",
        }}
      />

      {contextual && bgSrc && (
        <img
          src={bgSrc}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          style={{
            opacity: "var(--stage-ctx-bg-opacity)" as unknown as number,
            filter: bgExposure
              ? `var(--stage-ctx-bg-filter) brightness(${bgExposure})`
              : "var(--stage-ctx-bg-filter)",
          }}
        />
      )}

      {/* Domain light. The one thing that differentiates a sector's cards,
          kept as a wash of coloured light on the existing cyclorama rather
          than a photograph: it costs no assets, and because it rides on
          tokens it re-lights per theme — `screen` to add a glow on graphite,
          `multiply` to tint the paper — which is exactly what a photographic
          background could not do. */}
      {tintHue != null && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 82% 66% at 50% 36%, oklch(var(--stage-tint-l) var(--stage-tint-c) ${tintHue}), transparent 74%)`,
            opacity: "var(--stage-tint-opacity)" as unknown as number,
            mixBlendMode: "var(--stage-tint-blend)" as React.CSSProperties["mixBlendMode"],
          }}
        />
      )}

      {/* Volumetric key light haze — soft top diffusion */}
      <div
        aria-hidden
        className="absolute inset-x-[6%] top-[6%] h-[36%] rounded-[50%] opacity-55 blur-3xl"
        style={{ background: "var(--stage-key)" }}
      />

      {/* Separation light. Several products are photographed with a black cap
          on a black bottle (Ignitron P and D, Bitumax), and against a dark
          ground the cap BODY lands within a few levels of what is behind it —
          measured 42 on the asset — so only its rim highlight survives and the
          bottle reads as though its top were cut off. This lifts the ground
          behind the subject so a dark crown becomes a silhouette again. Broad
          and low-alpha so it reads as cyclorama falloff, not a glow ring, and
          transparent in the light theme where nothing needs separating. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--stage-separation)" }}
      />

      {/* Reflective grounding plane — sub-surface */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "var(--stage-floor)",
          ...(contextual ? { opacity: "var(--stage-ctx-floor-opacity)" as unknown as number } : null),
        }}
      />
      {/* Hairline horizon */}
      <div
        aria-hidden
        className="absolute left-[4%] right-[4%] bottom-[18%] h-px opacity-40"
        style={{ background: "var(--stage-horizon)" }}
      />

      {/* Contact shadow — tight beneath subject */}
      <div
        aria-hidden
        className="absolute bottom-[14%] left-1/2 h-[8%] w-[58%] -translate-x-1/2 rounded-[50%] opacity-85 blur-2xl"
        style={{ background: "var(--stage-contact)" }}
      />
      {/* Ambient bounce shadow — wider, softer */}
      <div
        aria-hidden
        className="absolute bottom-[10%] left-1/2 h-[14%] w-[82%] -translate-x-1/2 rounded-[50%] opacity-60 blur-3xl"
        style={{ background: "var(--stage-bounce)" }}
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
            "var(--stage-subject-shadow)",
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
            opacity: "var(--stage-refl-opacity)" as unknown as number,
            filter: "var(--stage-refl-filter)",
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
        style={{ background: "var(--stage-rim)" }}
      />

      {/* Lens vignette + atmospheric cinematic rolloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "var(--stage-vignette)",
          ...(contextual ? { opacity: "var(--stage-ctx-vig-opacity)" as unknown as number } : null),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "var(--stage-foot)",
        }}
      />

      {contextual && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[15%]"
          style={{ background: "var(--stage-ctx-head)" }}
        />
      )}

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
/**
 * Cinematic video frame with an unmute control, play/pause and fullscreen.
 * Exported because /about reuses it for the identity film — it takes only a
 * src and styling, and references no product state, so there is no reason for
 * a second implementation to exist.
 */
export function HeroVideo({
  src,
  className,
  style,
  caption,
  silent = false,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Optional frame caption. Rendered by this component rather than by the
   * caller so it shares one flex row with the control cluster — see the
   * comment on that row for why a sibling box does not work.
   */
  caption?: string;
  /**
   * Set when the file carries no audio track. The unmute control and the
   * "Sound Available" hint are then not rendered at all, rather than offering
   * a toggle that does nothing — the same rule that keeps "Field" off an
   * application frame that is not one. Declared by the caller because the
   * platforms disagree on detecting this: Chromium ships neither audioTracks
   * nor mozHasAudio, so a runtime probe would have to guess.
   */
  silent?: boolean;
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

      {/* Bottom row — frame caption and control cluster share one flex line.
          As independent boxes (caption bottom-5 left-5, cluster bottom-4
          right-4) they ran through each other: the 304px application caption
          on an /innovations panel was overlapped by 124px at 1024, 15px at
          768 and 113-169px at 430/390/360, and only 1440 was clear. A width
          breakpoint cannot fix that, because the collision depends on the
          frame width and the panel goes two-column at lg — so 1024 is worse
          than 768. Sharing a row, they wrap instead of collide at any width.

          The row is pointer-events-none so clicks outside the cluster still
          reach the video for click-to-play; the cluster takes them back.
          ml-1 on the caption lands it at the frame's 20px inset while the
          cluster keeps its 16px one, so neither moves where they already fit.

          Control order: Play/Pause · Replay · Sound · Full View. Labels are
          icon-only until the row is 26rem wide. With them the cluster wants
          362px, and the frame is 350/335/320 at 390/375/360 — so it was
          squeezed and broke mid-word, rendering PAUS/E, SOUN/D and FULL/VIEW
          on two lines. Icon-only it is 169px. The threshold is a container
          query rather than `sm:` because what squeezes the cluster is the
          FRAME, not the viewport: this component is also used at 240px inside
          a full-width desktop panel, where any viewport breakpoint would show
          the labels and overflow. The buttons carry aria-label either way.
          Shared with /about — check both pages. */}
      <div className="@container pointer-events-none absolute inset-x-4 bottom-4 z-20 flex flex-col items-end gap-2">
        {/* Sound hint — stacked above the row rather than pinned to its own
            bottom-16. Pinned, it sat on top of the caption as soon as the row
            wrapped, which is every width below 1440. */}
        <AnimatePresence>
          {muted && hintVisible && !silent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="rounded-sm border border-accent/25 bg-[var(--surface-glass-soft)] px-2.5 py-1 backdrop-blur-md"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-accent/85">
                Sound Available
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
        {caption && (
          <p className="ml-1 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
            {caption}
          </p>
        )}
        <div className="pointer-events-auto ml-auto flex items-center gap-1.5 rounded-sm border border-foreground/[0.14] bg-[var(--surface-veil)] p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="group/pp flex h-7 items-center gap-1.5 rounded-[2px] px-2 transition-colors hover:bg-[var(--surface-glass)]"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 text-foreground/75 transition-colors group-hover/pp:text-accent" strokeWidth={1.6} />
            ) : (
              <Play className="h-3.5 w-3.5 text-accent/95 transition-colors" strokeWidth={1.6} />
            )}
            <span className="hidden @[26rem]:inline font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/pp:text-foreground/95">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>

          <span aria-hidden className="h-3 w-px bg-foreground/[0.12]" />

          <button
            type="button"
            onClick={replay}
            aria-label="Replay from start"
            className="group/rp flex h-7 items-center justify-center rounded-[2px] px-2 transition-colors hover:bg-[var(--surface-glass)]"
          >
            <RotateCcw className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/rp:text-accent" strokeWidth={1.6} />
          </button>

          <span aria-hidden className="h-3 w-px bg-foreground/[0.12]" />

          {!silent && (
          <button
            type="button"
            onClick={toggle}
            aria-label={muted ? "Enable sound" : "Mute sound"}
            className="group/snd flex h-7 items-center gap-1.5 rounded-[2px] px-2 transition-colors hover:bg-[var(--surface-glass)]"
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/snd:text-accent" strokeWidth={1.6} />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-accent/90" strokeWidth={1.6} />
            )}
            <span className="hidden @[26rem]:inline font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/snd:text-foreground/95">
              {muted ? "Sound" : "Mute"}
            </span>
          </button>
          )}

          <span aria-hidden className="h-3 w-px bg-foreground/[0.12]" />

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit full view" : "Open full view"}
            className="group/fs flex h-7 items-center gap-1.5 rounded-[2px] px-2 transition-colors hover:bg-[var(--surface-glass)]"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-accent/90" strokeWidth={1.6} />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-foreground/65 transition-colors group-hover/fs:text-accent" strokeWidth={1.6} />
            )}
            <span className="hidden @[26rem]:inline font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70 transition-colors group-hover/fs:text-foreground/95">
              {isFullscreen ? "Exit" : "Full View"}
            </span>
          </button>
          </div>
        </div>
      </div>
    </>
  );
}


/**
 * The one CTA at the foot of a product panel.
 *
 * Shared by both panel variants — the standard one and Aquamax's, which
 * replaces the right column entirely. It shipped in the standard branch only,
 * and Aquamax silently lost its CTA despite having a verified product page.
 *
 * Shown only where a real product page was verified. Where none exists,
 * Commercial and Pilot entries offer /engage instead; an R&D entry gets
 * nothing, because a bench-stage programme has no product to enquire about.
 */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function ProductCta({ item }: { item: Product3DModalData }) {
  const shell =
    "group/cta flex items-center justify-between gap-4 rounded-sm border border-foreground/[0.12] bg-background/40 px-4 py-3.5 transition-colors duration-500 hover:border-accent/45 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70";
  const label =
    "font-mono text-[10.5px] uppercase tracking-[0.3em] text-foreground/75 transition-colors group-hover/cta:text-foreground";
  const mark =
    "font-mono text-[11px] text-foreground/40 transition-colors group-hover/cta:text-accent";

  if (item.productUrl) {
    return (
      <a
        href={item.productUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Explore ${item.title} product details on the company website`}
        onClick={() => {
          let domain = "";
          try {
            domain = new URL(item.productUrl as string).hostname;
          } catch {
            // A malformed url must not break the navigation.
          }
          track("product_site_click", {
            innovation_name: item.title,
            // The catalogue carries no id field, so this is derived from the
            // title rather than stored — which makes it the same slug the
            // company sites use ("Ignitron D" → ignitron-d) and keeps the two
            // analytics properties from drifting apart. Titles are unique
            // across all 25, verified against the rendered grid and the
            // JSON-LD ItemList, so the slug is unique too.
            innovation_id: slugify(item.title),
            destination_domain: domain,
            destination_url: item.productUrl as string,
            stage: item.stage,
          });
        }}
        className={shell}
      >
        <span className={label}>Explore Product Details</span>
        <span aria-hidden className={mark}>↗</span>
      </a>
    );
  }
  if (item.stage === "R&D") return null;
  return (
    <Link to="/engage" aria-label={`Engage on ${item.title}`} className={shell}>
      <span className={label}>Engage on this Innovation</span>
      <span aria-hidden className={mark}>→</span>
    </Link>
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
  applicationVideoSilent?: boolean;
  /** Optional field-deployment video used in place of the application still. */
  applicationVideo?: string;
  /**
   * Optional vertical product film — a narrated explainer in 9:16, distinct
   * from the landscape application film above it. Gets its own slot rather
   * than the hero, because object-cover would keep less than half a 9:16
   * source in the 16:10 hero frame and the burnt-in captions sit low.
   */
  productFilm?: string;
  /** One-paragraph description of what the product film shows. */
  productFilmNote?: string;
  /**
   * Verified company product page. Present only where one genuinely exists —
   * never a company homepage standing in for a product page, and never a
   * guessed slug. Both destination sites are hash-routed SPAs, so a 200 proves
   * nothing: each url was rendered and checked for product-specific content.
   */
  productUrl?: string;
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

  // Two Monoatom co-developments arrived with a single photograph instead of
  // the three every other programme ships, so they have no field frame at all.
  const hasApplicationMedia = Boolean(item?.detailImg || item?.applicationVideo);

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
          /* The panel used to stay dark in both themes on the argument that a
             lightbox is a dark room. That argument is sound for a lightbox
             and wrong here: this one opens out of a card that is now a paper
             plate, and a full-screen black surface arriving from that is the
             "dark theme pasted in" the whole pass is about.

             Every surface in it is a token, so the panel follows the page.
             The media frames are the exception and stay graphite on both —
             the application photographs and films genuinely are dark, and a
             paper frame behind a dark film is a halo round it, not a mount. */
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain"
          style={{
            background:
              "var(--panel-ground)",
            backdropFilter: "blur(20px)",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
          onClick={onClose}
        >
          <div className="pointer-events-none fixed left-0 right-0 top-0 z-[82] flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-10" style={{ background: "var(--panel-topveil)" }}>
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
              className="pointer-events-auto flex items-center gap-2 rounded-sm border border-foreground/[0.12] bg-[var(--surface-veil)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/75 backdrop-blur-md transition-colors hover:border-accent/40 hover:text-foreground"
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
              <div className="relative aspect-[1.05/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-sunken)]">
                <motion.img
                  key={item.img + "-aqua-hero"}
                  src={item.img}
                  alt={`${item.title} — HV-LC recovery system`}
                  draggable={false}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 h-full w-full object-contain px-[5%] py-[7%]"
                  style={{ filter: "contrast(1.04) saturate(0.94) brightness(0.97) var(--media-lift)" }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "var(--panel-vig-a)",
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
                <div className="theme-dark-island group relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-deep)]">
                  <motion.img
                    key={item.detailImg + "-aqua-app"}
                    src={item.detailImg}
                    alt={`${item.title} — field deployment`}
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.025 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
                    style={{ filter: "contrast(1.05) saturate(0.86) brightness(0.92) var(--media-lift)" }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "var(--panel-vig-b)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[image:var(--panel-media-foot)]" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                  <FilmGrain opacity={0.06} />
                  <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2 opacity-80">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/85" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/72">
                      Deployment Context
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
              <ProductCta item={item} />
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
                <div className="theme-dark-island group relative aspect-[16/10] overflow-hidden rounded-sm border border-foreground/[0.1] bg-[var(--surface-deep)]">
                  {item.applicationVideo ? (
                    <HeroVideo
                      key={item.applicationVideo + "-hero"}
                      src={item.applicationVideo}
                        silent={item.applicationVideoSilent}
                      caption={item.applicationCaption ?? `${item.title} · Deployment`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
                      style={{ filter: "var(--film-tone-hero) var(--media-lift)" }}
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
                      style={{ filter: "contrast(1.05) saturate(0.86) brightness(0.92) var(--media-lift)" }}
                    />
                  )}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "var(--panel-vig-b)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[image:var(--panel-media-foot)]" />
                  {/* Industrial corner brackets */}
                  <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                  <FilmGrain opacity={0.06} />
                  <div className="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/85" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/70">
                      Deployment Context
                    </span>
                  </div>
                  {/* Only for the still hero. With a video, HeroVideo renders
                      this caption itself so it shares a row with the control
                      cluster instead of running underneath it. */}
                  {!item.applicationVideo && (
                    <div className="pointer-events-none absolute bottom-5 left-5 z-10">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
                        {item.applicationCaption ?? `${item.title} · Deployment`}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Not an island, for the same reason the largeApplicationFrame
                   products' "Engineered Artifact" box below isn't one: this
                   frame holds item.img — which is it.cutout, the transparent
                   cut-out, not a photograph — on a CSS cyclorama rather than a
                   fixed dark plate. The old theme-dark-island + flat surface
                   here was leftover from when this box genuinely held a
                   photograph with an unpredictable light/dark bottom strip;
                   it hasn't since img was aliased to the cutout, so every one
                   of the ~18 non-hero-frame products (Graphenodes, Thermene,
                   Texaphene, HD-G-PE, Bitumax and the rest) was stuck showing
                   its product on a graphite plate even on paper — the one
                   dark card left in an otherwise light panel, and the exact
                   thing the largeApplicationFrame comment below already warns
                   against. Same cyclorama, same tokens, so it's lit for paper
                   exactly as the grid cards and the Engineered Artifact box
                   already are. */
                <div className="group relative aspect-[1.05/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--photo-plate)]">
                  {/* Studio cyclorama backdrop */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "var(--panel-stage-cyc)",
                    }}
                  />
                  {/* Soft top diffusion */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[10%] top-[5%] h-[28%] rounded-[50%] opacity-55 blur-3xl"
                    style={{ background: "var(--stage-key)" }}
                  />
                  {/* Ground contact shadow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-[10%] left-1/2 h-[6%] w-[64%] -translate-x-1/2 rounded-[50%] opacity-85 blur-2xl"
                    style={{ background: "var(--panel-stage-contact)" }}
                  />
                  <motion.img
                    key={item.img}
                    src={item.img}
                    alt={item.title}
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.015 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0 h-full w-full object-contain px-[9%] py-[10%] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025] group-hover:-translate-y-1"
                    style={{ filter: "var(--panel-stage-shadow)" }}
                  />
                  {/* Industrial corner brackets */}
                  <div aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r border-t border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute left-2.5 bottom-2.5 h-3.5 w-3.5 border-l border-b border-foreground/30" />
                  <div aria-hidden className="pointer-events-none absolute right-2.5 bottom-2.5 h-3.5 w-3.5 border-r border-b border-foreground/30" />
                  <FilmGrain opacity={0.05} />
                  {/* One flex row rather than a bottom-left and a bottom-right
                      box. Independently positioned, the two captions ran into
                      each other below about 430px — on a 390px phone they
                      interleaved into "ARCHIVE · STU D/I2O. C8A5PMTM URE ·
                      CINEMA". Sharing a row they wrap instead of collide, at
                      any width. */}
                  <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.34em]">
                    <span className="text-foreground/70">Archive · Studio capture</span>
                    <span className="text-foreground/45">ƒ/2.0 · 85mm · cinema</span>
                  </div>
                </div>
              )}

              <div
                className={
                  hasApplicationMedia
                    ? "grid grid-cols-1 gap-5 sm:grid-cols-[1.35fr_1fr]"
                    : "grid grid-cols-1 gap-5"
                }
              >
                {/* SECONDARY FRAME.
                    Default: application media. When the hero is the
                    application, this slot becomes the studio product artifact.
                    With no application media at all the frame is dropped and
                    the note beside it takes the row — rather than falling back
                    to `item.img`, which puts the studio photograph on screen a
                    second time under an "Application" label it has not
                    earned. */}
                {!hasApplicationMedia ? null : item.largeApplicationFrame ? (
                  <div className="theme-dark-island group relative aspect-[1.45/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-deep)]">
                    <motion.img
                      key={(item.detailImg ?? item.img) + "-fieldctx"}
                      src={item.detailImg ?? item.img}
                      alt={`${item.title} — supporting field context`}
                      draggable={false}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.9, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                      style={{ filter: "contrast(1.05) saturate(0.82) brightness(0.88) var(--media-lift)" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "var(--panel-vig-d)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[image:var(--panel-media-foot-tight)]" />
                    <FilmGrain opacity={0.06} />
                    <div className="absolute bottom-3 left-3 z-10">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/65">
                        Application · Deployment context
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="theme-dark-island group relative aspect-[1.15/1] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-plate-soft)]">
                    {item.applicationVideo ? (
                      <HeroVideo
                        key={item.applicationVideo + "-secondary"}
                        src={item.applicationVideo}
                        silent={item.applicationVideoSilent}
                        className="absolute inset-0 h-full w-full object-cover opacity-95 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ filter: "contrast(1.05) saturate(0.85) brightness(0.9) var(--media-lift)" }}
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
                        style={{ filter: "contrast(1.05) saturate(0.82) brightness(0.88) var(--media-lift)" }}
                      />
                    )}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "var(--panel-vig-d)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[image:var(--panel-media-foot-tight)]" />
                    <FilmGrain opacity={0.07} />
                    <div className="absolute bottom-3 left-3 z-10">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/65">
                        Application · Deployment context
                      </p>
                    </div>
                    {item.applicationVideo && (
                      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-sm border border-foreground/[0.12] bg-[var(--surface-veil)] px-2 py-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/90" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
                          Live · Loop
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Optical / studio note */}
                <div className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-plate-soft)] px-5 py-5">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "var(--panel-frame)",
                    }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-accent/75">
                        {hasApplicationMedia ? "Application Note" : "Capture Note"}
                      </p>
                      <p className="mt-3 text-[12.5px] leading-[1.65] text-foreground/74">
                        {hasApplicationMedia
                          ? "Application context prioritised over studio artifact — the assembly the material sits in, the industrial environment it is specified for, and the scale at which it works."
                          : "Photographed against a low-key graphite cyclorama. Soft top diffusion, single edge key, controlled specular rolloff — staged as a confidential industrial artifact."}
                      </p>
                    </div>
                    <div className="border-t border-foreground/[0.08] pt-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                        {hasApplicationMedia ? "Capture context" : "Optical treatment"}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/62">
                        {hasApplicationMedia
                          ? "Application context · illustrative"
                          : "Cinema lens · shallow DOF · 16mm grain"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT FILM — vertical explainer.
                  240px wide at sm+ so a 480px source maps 1:1 at DPR 2 with no
                  upscaling, and paired with its note so the text carries the
                  height the 9:16 frame adds rather than leaving a column of
                  dead space beside it. The frame is narrower than the control
                  cluster's 362px labelled width, which is why that cluster is
                  keyed to a container query. */}
              {item.productFilm && (
                <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-[240px_1fr]">
                  <div className="theme-dark-island group relative mx-auto aspect-[9/16] w-[240px] max-w-full overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-deep)] sm:mx-0">
                    <HeroVideo
                      key={item.productFilm + "-film"}
                      src={item.productFilm}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ filter: "contrast(1.04) saturate(0.9) brightness(0.95) var(--media-lift)" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "var(--panel-vig-e)",
                      }}
                    />
                    <FilmGrain opacity={0.05} />
                  </div>

                  <div className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-plate-soft)] px-5 py-5">
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "var(--panel-frame)",
                      }}
                    />
                    {/* Content height, not the film's. Stretched to the 9:16
                        frame beside it, three lines of note left ~250px of
                        empty panel between the copy and the format line. */}
                    <div className="relative z-10 flex flex-col gap-5">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-accent/75">
                          Product Film
                        </p>
                        <p className="mt-3 text-[12.5px] leading-[1.65] text-foreground/74">
                          {item.productFilmNote ??
                            "A short narrated explainer on what the product does and where it acts."}
                        </p>
                      </div>
                      <div className="border-t border-foreground/[0.08] pt-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
                          Format
                        </p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/62">
                          Vertical · 0:30 · narrated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {/* Product titles are single words, and the longest of them do
                  not fit this column at 48px. styles.css sets `overflow-wrap:
                  anywhere` on every heading as an overflow guard, which does
                  not just permit a break — it collapses the heading's
                  min-content width to one character, so the 1fr track shrank
                  and Chrome split the word. "Thermaphene" rendered as
                  "Thermaphe / ne" from 1024px up.

                  Measured at 48px in the display face: the widest titles are
                  Thermaphene 335px, Graphenodes 322px, Graphacrete 300px,
                  Aerophenter 299px, and what was then Fibrasphene at 292px —
                  since renamed Vitraphene, which is a character shorter and so
                  still inside the envelope. The track was 280px at 1440 and
                  204px at 1024, because a 96px decorative thumbnail and its
                  16px gap sat beside it.

                  Two changes, and both are needed — neither closes the gap on
                  its own. The thumbnail is gone: it was aria-hidden decoration
                  showing the same product image already on screen beside it,
                  and the five hero-frame products never rendered it at all, so
                  its absence is already the established look. That gives the
                  title 316px at 1024 and 392px at 1280. And 48px now waits for
                  xl rather than md, so the 1024–1279 band — where the two
                  column layout is at its narrowest — sets at 36px, where the
                  longest title is 251px. Every title clears its track at every
                  width with room to spare. */}
              <div className="border-b border-foreground/[0.08] pb-6">
                <div className="flex items-center gap-2">
                  <span className="h-px w-6 bg-accent/70" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/85">
                    {item.stage}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl tracking-[-0.025em] text-foreground/98 xl:text-5xl">
                  {item.title}
                </h2>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                  {item.domain}
                </p>
              </div>

              {item.largeApplicationFrame && (
                /* Not an island. This frame holds the transparent cut-out on
                   a CSS cyclorama, not a photograph — so the cyclorama can be
                   lit for paper exactly as the grid cards are, and the product
                   stands on it. Keeping it dark made the one black card in an
                   otherwise light panel. */
                <div className="group relative mx-auto aspect-[1/1.15] w-full max-w-[92%] overflow-hidden rounded-sm border border-[var(--product-border)] bg-[var(--photo-plate)]">
                  {/* Studio cyclorama backdrop */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "var(--panel-stage-cyc)",
                    }}
                  />
                  {/* Soft top diffusion */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[10%] top-[5%] h-[28%] rounded-[50%] opacity-55 blur-3xl"
                    style={{ background: "var(--stage-key)" }}
                  />
                  {/* Ground contact shadow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-[10%] left-1/2 h-[6%] w-[64%] -translate-x-1/2 rounded-[50%] opacity-85 blur-2xl"
                    style={{ background: "var(--panel-stage-contact)" }}
                  />
                  <motion.img
                    key={item.img + "-hero-artifact"}
                    src={item.img}
                    alt={`${item.title} — engineered artifact`}
                    draggable={false}
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0 h-full w-full object-contain px-[9%] py-[10%] transition-transform duration-[1600ms] ease-out group-hover:scale-[1.025] group-hover:-translate-y-1"
                    style={{
                      filter:
                        "var(--panel-stage-shadow)",
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
                <div className="overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-plate-soft)] px-4 py-4">
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

              <ProductCta item={item} />
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
