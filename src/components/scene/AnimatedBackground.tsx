import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface BackgroundScene {
  src?: string;
  alt: string;
  /** Public-relative path to an MP4 background video (e.g. "/videos/spi-industry-video.mp4").
   *  Ignored when a globalVideoSrc is active on the parent AnimatedBackground. */
  videoSrc?: string;
  /** Per-chapter chroma wash applied over the plate (mix-blend: soft-light). */
  tint?: string;
  /** Per-chapter cinematic overlay gradient — sets the chapter's emotional tone. */
  overlay?: string;
  /** Per-chapter parallax strength multiplier (0 = static, 1 = default). */
  parallax?: number;
  /** Per-chapter scene-image filter override (replaces the default grade). */
  filter?: string;
  /** Per-chapter object-position for the plate (defaults to center). */
  objectPosition?: string;
}

interface AnimatedBackgroundProps {
  scenes: BackgroundScene[];
  overlayStops?: number[];
  phaseSource?: MotionValue<number>;
  /**
   * Public-relative path to a single continuous MP4 that plays as the
   * persistent backdrop for ALL chapters (e.g. "/videos/cinematic-homepage.mp4").
   * When set, per-scene image/video plates are suppressed (only overlays/tints
   * render) and the video runs autoplay/muted/loop behind the entire scroll.
   * Reduced-motion users fall back to the per-scene static images.
   */
  globalVideoSrc?: string;
  children?: (ctx: { progress: MotionValue<number>; phase: MotionValue<number> }) => ReactNode;
}

function useSceneOpacity(phase: MotionValue<number>, center: number) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - center);
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * t * (t * (t * 6 - 15) + 10);
  });
}

function useSceneScale(phase: MotionValue<number>, center: number) {
  return useTransform(phase, (v) => {
    const d = Math.min(Math.abs(v - center), 1);
    return 1.035 - d * 0.014;
  });
}

function useCursorParallax() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 28, damping: 16, mass: 0.9 });
  const y = useSpring(rawY, { stiffness: 28, damping: 16, mass: 0.9 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let rafId = 0;
    let pending = false;
    let nx = 0;
    let ny = 0;

    const onMove = (e: PointerEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(() => {
          rawX.set(nx);
          rawY.set(ny);
          pending = false;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY]);

  return { x, y };
}

const DEFAULT_FILTER = "brightness(0.78) contrast(1.05) saturate(0.92)";
const DEFAULT_OVERLAY =
  "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.65) 0%, oklch(0.03 0.006 260 / 0.38) 50%, oklch(0.03 0.006 260 / 0.72) 100%)";

/**
 * Persistent full-screen video that plays continuously behind all chapters.
 * Mounted once — never remounted or paused during scroll.
 */
function GlobalVideoLayer({ src, fallbackSrc }: { src: string; fallbackSrc?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    // Resume if autoplay policy paused it (e.g. tab hidden then restored)
    const onPause = () => vid.play().catch(() => {});
    vid.addEventListener("pause", onPause);
    vid.play().catch(() => {});
    return () => vid.removeEventListener("pause", onPause);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={fallbackSrc}
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover select-none"
        style={{ filter: "brightness(0.72) contrast(1.04) saturate(0.82)" }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

function SceneLayer({
  scene,
  phase,
  index,
  parallax,
  isFirst,
  cursorX,
  cursorY,
  suppressPlate,
}: {
  scene: BackgroundScene;
  phase: MotionValue<number>;
  index: number;
  parallax: MotionValue<number>;
  isFirst: boolean;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  /** When true, skip image/video plates — only overlays/tints render (used with global video). */
  suppressPlate: boolean;
}) {
  const opacity = useSceneOpacity(phase, index);
  const scale   = useSceneScale(phase, index);
  const reduce  = useReducedMotion();
  const parallaxStrength = scene.parallax ?? 1;

  const scrollY = useTransform(
    parallax,
    (p) => p * (index % 2 === 0 ? 1 : -1) * 24 * parallaxStrength,
  );
  const mouseX = useTransform(cursorX, (v) => v * 9 * parallaxStrength);
  const mouseY = useTransform(cursorY, (v) => v * 6 * parallaxStrength);
  const combinedY = useTransform(
    [scrollY, mouseY] as MotionValue<number>[],
    ([sy, my]: number[]) => sy + my,
  );

  // Per-scene video plate — only active when no global video is running.
  const showVideo = !suppressPlate && Boolean(scene.videoSrc) && !reduce;

  // Play-once + replay-on-reenter for per-scene video.
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasActiveRef = useRef(false);
  useEffect(() => {
    if (!showVideo) return;
    const vid = videoRef.current;
    if (!vid) return;

    const THRESHOLD = 0.05;
    const unsubscribe = opacity.on("change", (v) => {
      const active = v > THRESHOLD;
      if (active && !wasActiveRef.current) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else if (!active && wasActiveRef.current) {
        vid.pause();
      }
      wasActiveRef.current = active;
    });

    return unsubscribe;
  }, [showVideo, opacity]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {suppressPlate ? null : showVideo ? (
        /* Per-scene video plate */
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ scale, x: mouseX, y: combinedY }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={scene.src}
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover select-none"
            style={{
              filter: scene.filter ?? DEFAULT_FILTER,
              objectPosition: scene.objectPosition ?? "center",
            }}
          >
            <source src={scene.videoSrc} type="video/mp4" />
          </video>
        </motion.div>
      ) : scene.src ? (
        /* Static image plate — fallback for reduced-motion or non-global-video builds */
        <motion.img
          src={scene.src}
          alt={scene.alt}
          width={1920}
          height={1080}
          loading={isFirst ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          fetchPriority={isFirst ? "high" : "low"}
          className="h-full w-full object-cover select-none"
          style={{
            scale,
            x: mouseX,
            y: combinedY,
            filter: scene.filter ?? DEFAULT_FILTER,
            objectPosition: scene.objectPosition ?? "center",
          }}
        />
      ) : null}

      {scene.tint && (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light pointer-events-none"
          style={{ background: scene.tint }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: scene.overlay ?? DEFAULT_OVERLAY }}
      />
    </motion.div>
  );
}

export default function AnimatedBackground({
  scenes,
  overlayStops,
  phaseSource,
  globalVideoSrc,
  children,
}: AnimatedBackgroundProps) {
  const stages = scenes.length;
  const stops = Array.from({ length: stages }, (_, i) => i / (stages - 1));

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 14,
    damping: 58,
    mass: 1.45,
  });

  const { x: cursorX, y: cursorY } = useCursorParallax();
  const reduce = useReducedMotion();

  const rawPhase = useTransform(progress, [0, 1], [0, stages - 1]);
  const smoothedExternal = useSpring(phaseSource ?? rawPhase, {
    stiffness: 120,
    damping: 28,
    mass: 0.5,
  });
  const phase = phaseSource ? smoothedExternal : rawPhase;
  const parallax = useTransform(progress, [0, 1], [-1, 1]);

  const globalDim = useTransform(
    progress,
    stops,
    overlayStops ?? Array(stages).fill(0.3),
  );

  // Plates are suppressed when a global video is active and motion is allowed.
  const suppressPlate = Boolean(globalVideoSrc) && !reduce;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-background">
      {/* Global cinematic video — base layer, always mounted, never remounted */}
      {suppressPlate && (
        <GlobalVideoLayer
          src={globalVideoSrc!}
          fallbackSrc={scenes[0]?.src}
        />
      )}

      {scenes.map((scene, index) => (
        <SceneLayer
          key={scene.src ?? index}
          scene={scene}
          phase={phase}
          index={index}
          parallax={parallax}
          isFirst={index === 0}
          cursorX={cursorX}
          cursorY={cursorY}
          suppressPlate={suppressPlate}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{ opacity: globalDim, background: "oklch(0.03 0.006 260)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, oklch(0.02 0.006 260 / 0.58) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-28"
        style={{ background: "linear-gradient(to bottom, oklch(0.03 0.006 260 / 0.32), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to top, oklch(0.03 0.006 260 / 0.32), transparent)" }}
      />

      {children?.({ progress, phase })}
    </div>
  );
}
