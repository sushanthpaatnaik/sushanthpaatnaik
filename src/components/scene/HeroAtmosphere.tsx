import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero atmosphere — invisible environmental depth beneath the hero.
 * No founder portrait, no literal imagery. Volumetric haze, faint
 * particle drift, near-invisible graphene blueprint traces, soft
 * industrial gradients, and a slow cinematic light breath. Designed
 * to read as "deep space ahead of you" rather than "image behind you".
 *
 * All layers are pointer-events:none, contain:strict, gpu-promoted,
 * and tuned so foreground typography always dominates.
 */
export default function HeroAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {/* Layer 1 — distant cinematic glow, slow breath. */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        animate={reduce ? undefined : { opacity: [0.30, 0.50, 0.30] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 44% 34% at 50% 54%, oklch(0.38 0.025 230 / 0.08), transparent 70%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Layer 2 — soft industrial gradient, top-down depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.025 0.004 232 / 0.55) 0%, transparent 32%, transparent 68%, oklch(0.025 0.004 232 / 0.72) 100%)",
        }}
      />

      {/* Layer 3 — faint copper rim, off-axis, barely there. */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        animate={reduce ? undefined : { opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          background:
            "radial-gradient(ellipse 28% 18% at 76% 24%, oklch(0.55 0.05 50 / 0.05), transparent 70%)",
        }}
      />

      {/* Layer 4 — volumetric haze drift, asymmetric. */}
      <motion.div
        className="absolute inset-1"
        animate={reduce ? undefined : { x: ["-2%", "2%", "-2%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 62% 52% at 32% 58%, oklch(0.08 0.012 232 / 0.12), transparent 65%)",
        }}
      />

      {/* Graphene blueprint trace removed — the centered hexagon tile
          produced a visible white snowflake/asterisk artifact behind the
          hero typography under mix-blend-screen. Atmosphere now relies on
          gradients, haze, and motes alone. */}

      {/* Layer 6 — microscopic material texture (very low-amplitude noise). */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
        }}
      />

      {/* Layer 7 — faint particle drift (5 slow-moving motes). */}
      {!reduce &&
        [
          { x: "18%", y: "32%", d: 28, delay: 0 },
          { x: "76%", y: "58%", d: 34, delay: 6 },
          { x: "42%", y: "78%", d: 30, delay: 11 },
          { x: "62%", y: "22%", d: 38, delay: 3 },
          { x: "30%", y: "52%", d: 32, delay: 8 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-foreground/50"
            style={{ left: p.x, top: p.y, filter: "blur(0.6px)" }}
            animate={{
              opacity: [0, 0.5, 0.2, 0.45, 0],
              y: [0, -18, -36, -54, -72],
              x: [0, 4, -2, 6, 0],
            }}
            transition={{
              duration: p.d,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

      {/* Layer 8 — final vignette, holds typography dominant. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 74% 68% at 50% 50%, transparent 36%, oklch(0.022 0.004 232 / 0.82) 100%)",
        }}
      />
    </div>
  );
}
