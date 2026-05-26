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
 * Full-viewport Earth surface for the "Future Systems" chapter.
 *
 * The base image is completely static — no translate, no pan.
 * Rotation is simulated by animating lightweight gradient overlays at
 * independent speeds and directions. The viewer's eye reads the shifting
 * light zones as surface rotation beneath the atmosphere.
 *
 * Layer stack (bottom → top):
 *   1  Base image — fixed, object-fit:cover, slight scale for presence
 *   2  Lit-hemisphere sweep — warm golden ellipse drifting L→R (68 s)
 *   3  Cloud band A — pale haze drifting R→L, slower (96 s)
 *   4  Cloud band B — second haze at a different altitude, opposite (118 s)
 *   5  Night-side city lights — amber glow pulsing on the dark hemisphere (18 s)
 *   6  Atmospheric rim sweep — outer blue-cool halo drifting very slowly (150 s)
 *   7  Depth vignette — fixed cinematic edge darkening
 *   8  Terminator line — fixed day/night boundary
 *
 * EarthLivingScene (sibling) adds limb haze, terminator warmth, orbital arcs,
 * and aurora on top of this layer — all FM-only, no CSS keyframes.
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
      {/* ── 1: Base Earth image — pinned, no translation ──────────────────
          object-fit:cover fills the viewport regardless of aspect ratio.
          scale(1.04) adds slight presence without crop artifact.
          All perceived rotation comes from the overlay layers below. */}
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          transform: "scale(1.04)",
          transformOrigin: "center center",
          filter: "brightness(0.80) contrast(1.12) saturate(1.18)",
        }}
      />

      {reduceMotion ? null : (
        <>
          {/* ── 2: Lit-hemisphere sweep ──────────────────────────────────
              Warm golden ellipse that slowly drifts left→right and back.
              Simulates the sunlit side of the globe rotating into view.
              Gradients fade to transparent — no hard edge at any x position. */}
          <motion.div
            animate={{ x: ["-16%", "16%"] }}
            transition={{
              duration: 68,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 58% 74% at 44% 50%, oklch(0.74 0.10 50 / 0.13), transparent 62%)",
              pointerEvents: "none",
            }}
          />

          {/* ── 3: Cloud band A ──────────────────────────────────────────
              Pale haze drifting opposite direction to the lit hemisphere —
              atmosphere at a different altitude rotating at a different rate.
              The opposing drift is the primary "two-body" rotation cue. */}
          <motion.div
            animate={{ x: ["12%", "-12%"] }}
            transition={{
              duration: 96,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 82% 46% at 50% 34%, oklch(0.90 0.014 228 / 0.07) 18%, transparent 54%)",
              pointerEvents: "none",
            }}
          />

          {/* ── 4: Cloud band B ──────────────────────────────────────────
              Second cloud layer at a different altitude (lower centre),
              drifting left to reinforce the multi-layer atmosphere feel. */}
          <motion.div
            animate={{ x: ["-9%", "9%"] }}
            transition={{
              duration: 118,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 64% 36% at 56% 66%, oklch(0.84 0.014 230 / 0.05) 16%, transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {/* ── 5: Night-side city lights ────────────────────────────────
              Warm amber glow pulsing on the dark right hemisphere.
              Opacity-only animation — no translate, just shimmer. */}
          <motion.div
            animate={{ opacity: [0.06, 0.20, 0.06] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 48% 44% at 68% 58%, oklch(0.72 0.16 52 / 0.16), transparent 56%)",
              pointerEvents: "none",
            }}
          />

          {/* ── 6: Atmospheric rim sweep ─────────────────────────────────
              Outer blue-cool halo shifting very slowly — exosphere layer
              at the highest "altitude", slowest apparent rotation speed. */}
          <motion.div
            animate={{ x: ["-8%", "8%"] }}
            transition={{
              duration: 150,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 92% 80% at 50% 50%, transparent 46%, oklch(0.55 0.09 232 / 0.11) 66%, transparent 80%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* ── 7: Depth vignette — fixed ────────────────────────────────────
          Darkens edges for cinematic framing and headline legibility.
          Never animates — would interfere with the rotation illusion. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 78% 68% at 50% 42%, transparent 26%, oklch(0.04 0.006 245 / 0.28) 56%, oklch(0.02 0.004 245 / 0.60) 78%, oklch(0.01 0.002 245 / 0.88) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 8: Terminator line — fixed ───────────────────────────────────
          108° diagonal gradient — lit hemisphere left, night side right.
          Fixed so the structural day/night divide is stable while the
          atmospheric layers breathe and drift above it. */}
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
