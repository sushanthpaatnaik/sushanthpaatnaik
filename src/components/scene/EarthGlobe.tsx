import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

const EARTH_CHAPTER = 6;

function useEarthOpacity(phase: MotionValue<number>) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - EARTH_CHAPTER);
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * t * (t * (t * 6 - 15) + 10);
  });
}

/**
 * Full-viewport slowly-rotating Earth for the "Future Systems" chapter.
 *
 * The image itself rotates — not a gradient overlay, not a panning trick.
 * FM animates rotate: 0 → 360 over 180 s, linear, repeat:loop.
 * transformOrigin: "center center" keeps it spinning on its own axis.
 *
 * Scale 1.6 is intentional: a rectangle that rotates 360° must be scaled
 * up so its nearest edge (half the short dimension × scale) always exceeds
 * the distance from center to the viewport corner (≈ diagonal/2).
 * For 16:9: corner distance ≈ 1101 px, image half-height at 1.6× ≈ 864 px.
 * The remaining outer ~4% is inside the darkest band of the depth vignette
 * and is visually imperceptible.
 *
 * EarthLivingScene (sibling) adds atmospheric overlays on top — untouched.
 */
export default function EarthGlobe({
  phase,
  src,
}: {
  phase: MotionValue<number>;
  src: string;
}) {
  const opacity = useEarthOpacity(phase);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Earth image — rotates on its central axis */}
      <motion.img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{
          duration: 180,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          scale: 1.6,
          transformOrigin: "center center",
          filter: "brightness(0.82) contrast(1.10) saturate(1.14)",
        }}
      />

      {/* Depth vignette — cinematic edge darkening, covers any corner gap */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 78% 68% at 50% 44%, transparent 26%, oklch(0.04 0.006 245 / 0.28) 56%, oklch(0.02 0.004 245 / 0.64) 78%, oklch(0.01 0.002 245 / 0.94) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Terminator line — day/night boundary, 108° diagonal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(108deg, transparent 40%, oklch(0.03 0.005 245 / 0.34) 58%, oklch(0.015 0.003 245 / 0.70) 80%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
