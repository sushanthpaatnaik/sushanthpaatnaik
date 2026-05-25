"use client";

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

      {/* Layer 5a — restrained engineering grid, fades hard at the
          center so it never crosses the hero typography column. */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.72 0.02 232 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.02 232 / 0.05) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage:
            "radial-gradient(ellipse 60% 65% at 50% 50%, transparent 0%, transparent 38%, #000 92%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 65% at 50% 50%, transparent 0%, transparent 38%, #000 92%)",
        }}
      />

      {/* Layer 5b — planetary curvature limb at the very bottom, a
          single hairline arc with a thin atmospheric glow above it.
          Pure SVG, no imagery, completely off-axis from the headline. */}
      <svg
        className="absolute inset-x-0 bottom-[-6%] h-[44%] w-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="hero-planet-glow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="oklch(0.55 0.05 232 / 0.14)" />
            <stop offset="55%" stopColor="oklch(0.30 0.04 232 / 0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="hero-planet-limb" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.82 0.04 232 / 0.30)" />
            <stop offset="65%" stopColor="oklch(0.50 0.04 232 / 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="60" rx="80" ry="34" fill="url(#hero-planet-glow)" />
        <path
          d="M -8 38 Q 50 4 108 38"
          fill="none"
          stroke="url(#hero-planet-limb)"
          strokeWidth="0.16"
        />
      </svg>

      {/* Layer 5c — single orbital ellipse, drawn off the lower-right
          axis, near-invisible. Hint of infrastructure, no sci-fi cliché. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse
          cx="50"
          cy="120"
          rx="92"
          ry="42"
          fill="none"
          stroke="oklch(0.78 0.02 232 / 0.10)"
          strokeWidth="0.08"
        />
        <ellipse
          cx="50"
          cy="120"
          rx="108"
          ry="50"
          fill="none"
          stroke="oklch(0.78 0.02 232 / 0.06)"
          strokeWidth="0.08"
        />
      </svg>

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
