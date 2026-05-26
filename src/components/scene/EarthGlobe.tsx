import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

const EARTH_CHAPTER = 6;

/**
 * Same smooth-step curve as SceneLayer — the globe fades in/out in
 * perfect lock-step with the underlying Earth background plate.
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
 * Circular rotating Earth globe for the "Future Systems" homepage chapter.
 *
 * Technique — seamless two-copy loop:
 *   Two identical copies of the Earth image are placed side by side in a
 *   flex row (total width = 200% of the globe circle). The row continuously
 *   translates from x=0% to x=-50% (= -100% of one globe width), then
 *   jumps back to x=0%. Because both images are identical, the jump is
 *   visually invisible — the loop is seamless. The result is a surface
 *   texture that scrolls in one direction indefinitely, exactly like a
 *   planet rotating on its axis.
 *
 * Layers inside the circle:
 *   1  Scrolling surface texture (two image copies, linear, 120 s/cycle)
 *   2  Spherical depth vignette (radial dark gradient — 3D sphere illusion)
 *   3  Terminator line (day/night boundary, 108° diagonal)
 *
 * Outside the circle:
 *   4  Atmospheric rim glow (blue-cool halo, absolutely positioned)
 *
 * All motion: FM/WAAPI only — zero CSS keyframes, zero blink risk.
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Wrapper gives the rim glow a relative positioning context */}
      <div style={{ position: "relative", flexShrink: 0 }}>

        {/* ── Atmospheric rim glow ────────────────────────────────────────
            Sits behind the globe (rendered first), extends 28px beyond
            the circle edge — evokes the ionosphere seen from orbit. */}
        <div
          style={{
            position: "absolute",
            inset: "-28px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, transparent 70%, oklch(0.58 0.10 232 / 0.28) 82%, oklch(0.46 0.08 232 / 0.10) 94%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Globe circle ────────────────────────────────────────────────
            min(88vh, 88vw, 880px) keeps it under 880 px on large screens
            and fills 88% of the shorter viewport edge on smaller ones. */}
        <div
          style={{
            width: "min(88vh, 88vw, 880px)",
            height: "min(88vh, 88vw, 880px)",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ── Rotating surface texture ────────────────────────────────
              Two copies of the Earth image in a 200%-wide flex row.
              Continuous linear translateX from 0% → -50% → (loop) 0%.
              At x=0 the first copy fills the circle.
              At x=-50% the second copy fills it — identical, seamless.
              Duration 120 s = one full surface-width scroll; the viewer
              sees roughly 15–20% of the surface moving per 20 seconds,
              giving the unmistakable feel of planetary rotation. */}
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
                  objectPosition: "center",
                  display: "block",
                  flexShrink: 0,
                  // Brighter treatment inside the globe vs the dark
                  // background plate — shows surface detail clearly.
                  filter:
                    "brightness(1.10) contrast(1.14) saturate(1.30)",
                }}
              />
            ))}
          </motion.div>

          {/* ── Spherical depth vignette ────────────────────────────────
              Darkens the outer ring of the circle, creating the illusion
              that the surface curves away from the viewer. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, transparent 30%, oklch(0.04 0.006 245 / 0.35) 65%, oklch(0.02 0.004 245 / 0.72) 86%, oklch(0.01 0.002 245 / 0.94) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* ── Terminator line ─────────────────────────────────────────
              Diagonal gradient that darkens the right side of the globe —
              the night hemisphere. Angle 108° puts the lit side on the
              left/centre, the dark side on the right, matching the warm
              amber glow from EarthLivingScene. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(108deg, transparent 38%, oklch(0.03 0.005 245 / 0.42) 58%, oklch(0.015 0.003 245 / 0.78) 78%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
