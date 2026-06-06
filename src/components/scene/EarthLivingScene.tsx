import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Earth chapter index in AtmosphereLayer's SCENES array.
 * Scene 6 = "Future Systems" — the Earth plate.
 */
const EARTH_CHAPTER = 6;

function useEarthOpacity(phase: MotionValue<number>) {
  return useTransform(phase, (v) => {
    if (v < 4.8 || v > 7) return 0;
    if (v <= 6) {
      const t = Math.max(0, Math.min(1, (v - 4.8) / 1.2));
      return t * t * (3 - 2 * t);
    }
    const t = Math.max(0, Math.min(1, 7 - v));
    return t * t * (3 - 2 * t);
  });
}

/** FM mirror-loop helper — never uses CSS keyframes. */
function loop(duration: number, delay = 0) {
  return {
    duration,
    delay,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  };
}

/**
 * Atmospheric overlay stack for the Earth chapter.
 *
 * The base image rotation is driven in SceneLayer via the `living` config.
 * This component adds the atmospheric FEEL on top:
 *   1  Planet limb haze   — blue-cool arc breathing at the planet edge
 *   2  Terminator warmth  — amber city-light glow drifting with the surface
 *   3  Cloud/fog band     — pale cool layer, slower drift than the surface
 *   4  Orbital arc grid   — three SVG ellipses, ultra-slow rotation
 *   5  Aurora corona      — outer deep-space glow, gentle pulse
 *
 * All motion: FM animate with repeat:Infinity — zero CSS keyframes,
 * zero compositor-blink risk.
 */
export default function EarthLivingScene({
  phase,
}: {
  phase: MotionValue<number>;
}) {
  const opacity = useEarthOpacity(phase);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {/* ── 1: Planet limb haze ───────────────────────────────────────────
          Cool blue-violet arc tracing the atmosphere edge. Slow breathing
          scale makes the atmosphere feel like it genuinely expands/contracts. */}
      <motion.div
        animate={{ opacity: [0.12, 0.30], scale: [1.00, 1.026] }}
        transition={loop(42)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 74% 68% at 62% 52%, transparent 36%, oklch(0.55 0.09 232 / 0.26) 62%, transparent 80%)",
        }}
      />

      {/* ── 2: Terminator warmth ──────────────────────────────────────────
          Warm amber glow from the illuminated side. Drifts in the same
          direction as the surface rotation to feel physically correct —
          22s (faster than 90s surface) so it has independent character. */}
      <motion.div
        animate={{ opacity: [0.08, 0.20], x: [0, 32] }}
        transition={loop(22)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 62% 50% at 54% 62%, oklch(0.70 0.15 52 / 0.15), transparent 60%)",
        }}
      />

      {/* ── 3: Cloud/fog band (desktop only) ─────────────────────────────
          Lighter than the surface drift. Two layers at slightly different
          speeds so they appear to be at different altitudes. */}
      {!isMobile && (
        <>
          <motion.div
            animate={{ x: [0, 48], opacity: [0.06, 0.16] }}
            transition={loop(54)}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 88% 50% at 50% 36%, oklch(0.86 0.02 228 / 0.07) 20%, transparent 56%)",
            }}
          />
          <motion.div
            animate={{ x: [0, -28], opacity: [0.04, 0.12] }}
            transition={loop(38)}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 70% 42% at 58% 68%, oklch(0.80 0.02 230 / 0.06) 18%, transparent 52%)",
            }}
          />
        </>
      )}


      {/* ── 5: Aurora corona ──────────────────────────────────────────────
          Diffuse deep-space atmosphere ring. Pulses gently, slightly faster
          than the limb haze so both breathe at different rates. */}
      <motion.div
        animate={{ opacity: [0.10, 0.26], scale: [1.00, 1.022] }}
        transition={loop(28)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 96% 86% at 50% 52%, transparent 52%, oklch(0.52 0.08 232 / 0.20) 68%, transparent 86%)",
        }}
      />
    </motion.div>
  );
}
