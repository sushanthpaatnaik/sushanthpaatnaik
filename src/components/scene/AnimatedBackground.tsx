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
}

interface AnimatedBackgroundProps {
  /** Ordered chapter scenes; the layer crossfades between them with scroll. */
  scenes: BackgroundScene[];
  /** Optional dark overlay opacity stops (length must equal scenes.length). */
  overlayStops?: number[];
  /** Optional children rendered on top of the scenes (e.g. ParticleField). */
  children?: (ctx: { progress: MotionValue<number>; phase: MotionValue<number> }) => ReactNode;
}

function useSceneOpacity(phase: MotionValue<number>, center: number, spread = 1.25) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - center) / spread;
    if (d >= 1) return 0;
    const t = 1 - d;
    // Wider, softer crossfade — longer overlap between adjacent scenes,
    // so the cut between chapters dissolves rather than handing off.
    return t * t * t * (t * (t * 6 - 15) + 10);
  });
}

function useSceneScale(phase: MotionValue<number>, center: number) {
  // Gentler Ken Burns drift; aggressive parallax replaced with restraint.
  return useTransform(phase, (v) => 1.03 - (v - center) * 0.018);
}

// Static color grade. Dynamic blur on 1920x1080 images every scroll frame was
// the single largest GPU cost on the page; crossfade + scale already
// communicates depth, blur is no longer needed.
const SCENE_FILTER = "brightness(0.78) contrast(1.05) saturate(0.92)";

function SceneLayer({
  src,
  alt,
  phase,
  index,
  parallax,
  isFirst,
}: {
  src: string;
  alt: string;
  phase: MotionValue<number>;
  index: number;
  parallax: MotionValue<number>;
  isFirst: boolean;
}) {
  const opacity = useSceneOpacity(phase, index);
  const scale = useSceneScale(phase, index);
  const y = useTransform(parallax, (p) => p * (index % 2 === 0 ? 1 : -1) * 40);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.img
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        loading={isFirst ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        fetchPriority={isFirst ? "high" : "low"}
        className="h-full w-full object-cover select-none"
        style={{ scale, y, filter: SCENE_FILTER, transform: "translateZ(0)" }}
      />
    </motion.div>
  );
}

/**
 * Cinematic scroll-synchronized background. Renders a stack of full-bleed
 * scene images that crossfade across the page scroll, plus dark overlays,
 * vignette and edge fades. Pass children to layer particle fields or
 * other atmospheric effects on top.
 */
export default function AnimatedBackground({
  scenes,
  overlayStops,
  children,
}: AnimatedBackgroundProps) {
  const stages = scenes.length;
  const stops = Array.from({ length: stages }, (_, i) => i / (stages - 1));

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 34,
    damping: 42,
    mass: 1.1,
  });

  const phase = useTransform(progress, [0, 1], [0, stages - 1]);
  const parallax = useTransform(progress, [0, 1], [-1, 1]);

  const overlayOpacity = useTransform(
    progress,
    stops,
    overlayStops ?? Array(stages).fill(0.5),
  );

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-background">
      {scenes.map((scene, index) => (
        <SceneLayer
          key={scene.src}
          src={scene.src}
          alt={scene.alt}
          phase={phase}
          index={index}
          parallax={parallax}
          isFirst={index === 0}
        />
      ))}

      {/* Cinematic dark overlay for text readability */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: overlayOpacity,
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.65) 0%, oklch(0.03 0.006 260 / 0.38) 50%, oklch(0.03 0.006 260 / 0.72) 100%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, oklch(0.02 0.006 260 / 0.88) 100%)",
        }}
      />

      {/* Edge fades */}
      <div
        className="absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.02 0.006 260 / 0.92), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-64"
        style={{
          background:
            "linear-gradient(to top, oklch(0.02 0.006 260 / 0.92), transparent)",
        }}
      />

      {children?.({ progress, phase })}
    </div>
  );
}
