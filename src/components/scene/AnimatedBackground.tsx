import { useEffect, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface BackgroundScene {
  src: string;
  alt: string;
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
  /** Ordered chapter scenes; the layer crossfades between them with scroll. */
  scenes: BackgroundScene[];
  /** Optional dark overlay opacity stops (length must equal scenes.length). */
  overlayStops?: number[];
  /**
   * Optional externally-driven chapter phase (integer N = chapter N centered
   * in viewport). When provided, the background syncs to actual section
   * positions instead of uniform scroll progress.
   */
  phaseSource?: MotionValue<number>;
  /** Optional children rendered on top of the scenes (e.g. ParticleField). */
  children?: (ctx: { progress: MotionValue<number>; phase: MotionValue<number> }) => ReactNode;
}

function useSceneOpacity(phase: MotionValue<number>, center: number) {
  // Strict isolation: a scene only crossfades with its IMMEDIATE neighbour.
  // Beyond ±1 chapter the layer is exactly 0 — no bleed from distant
  // chapters, no stacked atmosphere across the page.
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

/**
 * Tracks normalized cursor position (-1…1) via rAF, smoothed with springs.
 * Returns zero-motion values on touch/coarse devices and when reduced-motion
 * is active — callers don't need to guard separately.
 */
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

// Per-layer CSS animation class selectors — cycling through scene index.
// Negative animation-delay (set inline) means "already N seconds into the cycle"
// so layers across scenes never breathe in lock-step.
const breatheClass = (i: number) =>
  i % 2 === 0 ? "sp-living-breathe-a" : "sp-living-breathe-b";
const hazeClass = (i: number) =>
  i % 2 === 0 ? "sp-living-haze-a" : "sp-living-haze-b";
const glowClass = (i: number) =>
  (["sp-living-glow-a", "sp-living-glow-b", "sp-living-glow-c"] as const)[i % 3];

function SceneLayer({
  scene,
  phase,
  index,
  parallax,
  isFirst,
  cursorX,
  cursorY,
}: {
  scene: BackgroundScene;
  phase: MotionValue<number>;
  index: number;
  parallax: MotionValue<number>;
  isFirst: boolean;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}) {
  const opacity = useSceneOpacity(phase, index);
  const scale = useSceneScale(phase, index);
  const parallaxStrength = scene.parallax ?? 1;

  // Scroll-driven vertical drift — alternating direction adds depth.
  const scrollY = useTransform(
    parallax,
    (p) => p * (index % 2 === 0 ? 1 : -1) * 24 * parallaxStrength,
  );

  // Cursor-driven lateral shift — deeper layers move more.
  // Max amplitude: ±9px horizontal, ±6px vertical at parallaxStrength=1.
  const mouseX = useTransform(cursorX, (v) => v * 9 * parallaxStrength);
  const mouseY = useTransform(cursorY, (v) => v * 6 * parallaxStrength);

  // Merge scroll and cursor contributions on the Y axis.
  const combinedY = useTransform(
    [scrollY, mouseY] as MotionValue<number>[],
    ([sy, my]: number[]) => sy + my,
  );

  // Stagger each layer so adjacent scenes never animate in lock-step.
  const breatheDelay = `${-(index * 4.2).toFixed(1)}s`;
  const hazeDelay    = `${-(index * 3.1).toFixed(1)}s`;
  const glowDelay    = `${-(index * 5.8).toFixed(1)}s`;

  return (
    // No overflow-hidden here — the outer container (fixed inset-0 overflow-hidden)
    // handles all clipping. Adding it per-scene forces 7 extra GPU compositing
    // layers that cause compositing thrash during opacity-driven transitions.
    <motion.div className="absolute inset-0" style={{ opacity }}>

      {/* ── Layer 1: Breathing wrapper (CSS) / scroll+cursor (FM) ───────── */}
      {/* Extends -4% outside parent bounds — clipped by the outer container. */}
      <div
        className={breatheClass(index)}
        style={{ position: "absolute", inset: "-4%", animationDelay: breatheDelay }}
      >
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
      </div>

      {/* ── Layer 2: Soft-focus edge haze ───────────────────────────────── */}
      {/* Same image at 6% opacity drifting counter to the base — depth.    */}
      {/* No mask-image (forces a GPU compositing layer) and no filter blur  */}
      {/* (expensive on a full-viewport div). Low opacity is sufficient.     */}
      <div
        aria-hidden
        className={hazeClass(index)}
        style={{
          position: "absolute",
          inset: "-6%",
          backgroundImage: `url(${scene.src})`,
          backgroundSize: "cover",
          backgroundPosition: scene.objectPosition ?? "center",
          opacity: 0.06,
          animationDelay: hazeDelay,
        }}
      />

      {/* ── Layer 3: Ambient glow sweep ─────────────────────────────────── */}
      {/* Warm copper light drifts diagonally. No mix-blend-screen — blend   */}
      {/* modes inside an opacity-animated parent create a compositing       */}
      {/* isolation context that pops during 0↔1 transitions.               */}
      <div
        aria-hidden
        className={glowClass(index)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(55% 45% at 50% 50%, oklch(0.62 0.09 50 / 0.08), transparent 70%)",
          animationDelay: glowDelay,
        }}
      />

      {/* ── Layer 4: Per-chapter chroma tint ────────────────────────────── */}
      {scene.tint && (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light pointer-events-none"
          style={{ background: scene.tint }}
        />
      )}

      {/* ── Layer 5: Per-chapter cinematic overlay ──────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: scene.overlay ?? DEFAULT_OVERLAY }}
      />
    </motion.div>
  );
}

/**
 * Cinematic scroll-synchronized background. Each scene carries its own
 * chroma tint, overlay gradient, parallax depth and (optionally) grade —
 * the chapters evolve rather than cross-fading between near-identical plates.
 */
export default function AnimatedBackground({
  scenes,
  overlayStops,
  phaseSource,
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

  // When a section-anchored phase is provided, smooth it the same way scroll
  // progress is smoothed so the crossfade still breathes instead of snapping.
  const rawPhase = useTransform(progress, [0, 1], [0, stages - 1]);
  const smoothedExternal = useSpring(phaseSource ?? rawPhase, {
    stiffness: 120,
    damping: 28,
    mass: 0.5,
  });
  const phase = phaseSource ? smoothedExternal : rawPhase;
  const parallax = useTransform(progress, [0, 1], [-1, 1]);

  // A gentle global dim that breathes with progress — sits BENEATH each
  // chapter's own overlay so legibility stays guaranteed during long reads.
  const globalDim = useTransform(
    progress,
    stops,
    overlayStops ?? Array(stages).fill(0.3),
  );

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-background">
      {scenes.map((scene, index) => (
        <SceneLayer
          key={scene.src}
          scene={scene}
          phase={phase}
          index={index}
          parallax={parallax}
          isFirst={index === 0}
          cursorX={cursorX}
          cursorY={cursorY}
        />
      ))}

      {/* Soft global dim — additive, light touch only. */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: globalDim,
          background: "oklch(0.03 0.006 260)",
        }}
      />

      {/* Vignette — softened from 0.86 → 0.72 alpha so the focal pull
          remains cinematic without crushing the plate edges into mud. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, oklch(0.02 0.006 260 / 0.58) 100%)",
        }}
      />

      {/* Edge fades — lighter so chapter imagery remains legible across
          section seams without overpowering the plate. */}
      <div
        className="absolute inset-x-0 top-0 h-28"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.03 0.006 260 / 0.32), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            "linear-gradient(to top, oklch(0.03 0.006 260 / 0.32), transparent)",
        }}
      />

      {children?.({ progress, phase })}
    </div>
  );
}
