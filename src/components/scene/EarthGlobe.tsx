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
 * Full-viewport rotating Earth surface for the "Future Systems" chapter.
 *
 * Technique — seamless two-copy loop:
 *   Two identical copies of the Earth image placed side by side in a flex row
 *   (total width = 200% of the viewport). FM animates translateX from 0% to
 *   -50% linearly over 120 s, then loops invisibly — the identical second copy
 *   snaps to the first's position. Result: continuous unidirectional surface
 *   drift that reads as planetary rotation.
 *
 * Layering (bottom → top):
 *   1  Scrolling surface texture (two image copies, linear, 120 s/cycle)
 *   2  Cinematic depth vignette (darkens edges, adds depth)
 *   3  Terminator line (day/night boundary, 108° diagonal)
 *
 * This component sits below EarthLivingScene which adds atmospheric overlays.
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
      {/* ── Rotating surface texture ──────────────────────────────────────
          Two copies of the Earth image in a 200%-wide flex row covering the
          full viewport. FM drives continuous linear drift x: 0% → -50%.
          At x=0 the first copy fills the viewport.
          At x=-50% the second copy fills it — identical, seamless loop. */}
      <motion.div
        animate={reduceMotion ? {} : { x: ["0%", "-50%"] }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        style={{
          display: "flex",
          width: "200%",
          height: "100%",
          willChange: "transform",
        }}
      >
        {[0, 1].map((i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden
            draggable={false}
            style={{
              width: "50%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 40%",
              display: "block",
              flexShrink: 0,
              filter: "brightness(0.80) contrast(1.12) saturate(1.20)",
            }}
          />
        ))}
      </motion.div>

      {/* ── Cinematic depth vignette ──────────────────────────────────────
          Darkens corners and edges for cinematic framing and to ensure
          headline text remains legible over the rotating surface. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 42%, transparent 28%, oklch(0.04 0.006 245 / 0.30) 58%, oklch(0.02 0.004 245 / 0.62) 80%, oklch(0.01 0.002 245 / 0.88) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Terminator line ───────────────────────────────────────────────
          Diagonal gradient darkening the right side — the night hemisphere.
          108° puts the lit side left/centre, matching EarthLivingScene's
          amber city-light glow position. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(108deg, transparent 40%, oklch(0.03 0.005 245 / 0.36) 60%, oklch(0.015 0.003 245 / 0.72) 82%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
