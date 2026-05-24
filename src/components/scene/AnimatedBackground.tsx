import { type ReactNode } from "react";
import {
  motion,
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

// Blur removed — it was stacking across overlapping layers and muddying
// every chapter handoff. Scene sharpness now carries section identity.
function useSceneBlur(phase: MotionValue<number>, _center: number) {
  return useTransform(phase, () => "none");
}

const DEFAULT_FILTER = "brightness(0.78) contrast(1.05) saturate(0.92)";
const DEFAULT_OVERLAY =
  "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.65) 0%, oklch(0.03 0.006 260 / 0.38) 50%, oklch(0.03 0.006 260 / 0.72) 100%)";

function SceneLayer({
  scene,
  phase,
  index,
  parallax,
  isFirst,
}: {
  scene: BackgroundScene;
  phase: MotionValue<number>;
  index: number;
  parallax: MotionValue<number>;
  isFirst: boolean;
}) {
  const opacity = useSceneOpacity(phase, index);
  const scale = useSceneScale(phase, index);
  const blur = useSceneBlur(phase, index);
  const parallaxStrength = scene.parallax ?? 1;
  const y = useTransform(
    parallax,
    (p) => p * (index % 2 === 0 ? 1 : -1) * 24 * parallaxStrength,
  );

  return (
    <motion.div className="absolute inset-0" style={{ opacity, filter: blur }}>
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
          y,
          filter: scene.filter ?? DEFAULT_FILTER,
          transform: "translateZ(0)",
          objectPosition: scene.objectPosition ?? "center",
        }}
      />
      {/* Per-chapter chroma wash — gives each scene its own emotional color. */}
      {scene.tint && (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light pointer-events-none"
          style={{ background: scene.tint }}
        />
      )}
      {/* Per-chapter cinematic overlay — replaces a single shared overlay so
          each chapter has its own mood (top-down dusk, radial vault, side-lit
          archive, etc.). */}
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
