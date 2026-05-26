import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * Earth chapter index in AtmosphereLayer's SCENES array.
 * Scene 6 = "Future Systems" (story-07-future.webp — the Earth plate).
 */
const EARTH_CHAPTER = 6;

/**
 * Mirror the same smooth-step opacity curve used by SceneLayer, so this
 * overlay fades in/out in perfect lock-step with the underlying Earth image.
 */
function useEarthOpacity(phase: MotionValue<number>) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - EARTH_CHAPTER);
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * t * (t * (t * 6 - 15) + 10);
  });
}

/**
 * Convenience helper for looping mirror transitions.
 * "mirror" = CSS alternate — value goes A→B→A→B without a reset jump.
 * All animations are FM/WAAPI-managed; no CSS keyframes are used so
 * there is zero risk of the CSS-vs-WAAPI compositor blink.
 */
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
 * Living Earth overlay for the "Future Systems" homepage chapter.
 *
 * Rendered as a child of AnimatedBackground (above the scene vignette) so it
 * stays inside the outer overflow-hidden boundary without creating its own
 * stacking context issues. Uses only FM-managed animations — no CSS keyframes.
 *
 * Layer stack (bottom → top):
 *   1  Atmospheric limb haze — blue-cool arc at the planet edge, slow breathe
 *   2  City light warmth — amber terminator glow, lateral drift
 *   3  Cloud/fog layer — pale cool band drifting across the upper atmosphere
 *   4  Orbital arc SVG — faint elliptical grid, ultra-slow rotation
 *   5  Outer aurora ring — diffuse deep-space edge glow, gentle pulse
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

  // All hooks called above — safe to bail early.
  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {/* ── 1: Atmospheric limb haze ──────────────────────────────────────
          A cool blue-violet arc tracing the planet limb. Slowly breathes
          in scale so it feels like the atmosphere itself is expanding. */}
      <motion.div
        animate={{ opacity: [0.10, 0.26], scale: [1.00, 1.024] }}
        transition={loop(42)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 74% 68% at 62% 52%, transparent 38%, oklch(0.55 0.09 232 / 0.22) 64%, transparent 82%)",
        }}
      />

      {/* ── 2: City light warmth ──────────────────────────────────────────
          Warm amber glow from the lit side of the planet. Drifts subtly
          left-to-right to suggest the Earth's slow rotation. */}
      <motion.div
        animate={{ opacity: [0.07, 0.17], x: [0, 26] }}
        transition={loop(22)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 48% at 55% 62%, oklch(0.68 0.14 52 / 0.13), transparent 62%)",
        }}
      />

      {/* ── 3: Cloud/fog band (desktop only) ─────────────────────────────
          A pale cool layer drifting slowly across the upper atmosphere.
          Skipped on coarse-pointer (touch) devices to reduce GPU load. */}
      {!isMobile && (
        <motion.div
          animate={{ x: [0, 52], opacity: [0.08, 0.20] }}
          transition={loop(58)}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 52% at 50% 38%, oklch(0.84 0.02 228 / 0.07) 22%, transparent 58%)",
          }}
        />
      )}

      {/* ── 4: Orbital arc grid (desktop only) ───────────────────────────
          Three faint ellipses at different inclinations — suggests
          infrastructure at planetary scale. Ultra-slow rotation (0.25 deg
          over 80 s) keeps it subliminal. Skipped on mobile. */}
      {!isMobile && (
        <motion.svg
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          animate={{ opacity: [0.0, 0.09], rotate: [0, 0.25] }}
          transition={loop(80)}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            transformOrigin: "50% 50%",
          }}
        >
          {/* Equatorial orbit */}
          <ellipse
            cx="100" cy="50" rx="90" ry="31"
            fill="none"
            stroke="oklch(0.80 0.04 232)"
            strokeWidth="0.35"
            opacity="0.78"
          />
          {/* Mid-inclination orbit */}
          <ellipse
            cx="100" cy="50" rx="74" ry="46"
            fill="none"
            stroke="oklch(0.78 0.03 232)"
            strokeWidth="0.22"
            opacity="0.58"
            transform="rotate(22, 100, 50)"
          />
          {/* Polar-ish orbit with warm tint */}
          <ellipse
            cx="100" cy="50" rx="58" ry="26"
            fill="none"
            stroke="oklch(0.72 0.05 52)"
            strokeWidth="0.18"
            opacity="0.46"
            transform="rotate(-16, 100, 50)"
          />
        </motion.svg>
      )}

      {/* ── 5: Outer aurora ring ──────────────────────────────────────────
          A diffuse halo just outside the visible planet disk — evokes the
          deep-space atmosphere edge seen from orbit. Pulses gently. */}
      <motion.div
        animate={{ opacity: [0.08, 0.22], scale: [1.00, 1.020] }}
        transition={loop(34)}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 96% 86% at 50% 52%, transparent 54%, oklch(0.52 0.08 232 / 0.18) 70%, transparent 88%)",
        }}
      />
    </motion.div>
  );
}
