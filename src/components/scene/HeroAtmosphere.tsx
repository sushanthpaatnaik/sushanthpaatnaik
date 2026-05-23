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
        animate={reduce ? undefined : { opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 48% 38% at 50% 52%, oklch(0.42 0.07 240 / 0.10), transparent 70%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Layer 2 — soft industrial gradient, top-down depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.45) 0%, transparent 28%, transparent 72%, oklch(0.03 0.006 260 / 0.6) 100%)",
        }}
      />

      {/* Layer 3 — faint copper rim, off-axis, barely there. */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        animate={reduce ? undefined : { opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          background:
            "radial-gradient(ellipse 32% 22% at 78% 22%, oklch(0.62 0.10 55 / 0.07), transparent 70%)",
        }}
      />

      {/* Layer 4 — volumetric haze drift, asymmetric. */}
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { x: ["-2%", "2%", "-2%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 30% 60%, oklch(0.10 0.02 245 / 0.18), transparent 65%)",
        }}
      />

      {/* Layer 5 — hidden graphene blueprint trace (extremely faint SVG). */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g fill='none' stroke='%2380a8d8' stroke-width='0.35'><polygon points='100,20 160,55 160,125 100,160 40,125 40,55'/><polygon points='100,55 130,72.5 130,107.5 100,125 70,107.5 70,72.5'/><line x1='100' y1='20' x2='100' y2='55'/><line x1='160' y1='55' x2='130' y2='72.5'/><line x1='160' y1='125' x2='130' y2='107.5'/><line x1='100' y1='160' x2='100' y2='125'/><line x1='40' y1='125' x2='70' y2='107.5'/><line x1='40' y1='55' x2='70' y2='72.5'/></g></svg>\")",
          backgroundSize: "320px 320px",
          backgroundRepeat: "repeat",
          maskImage:
            "radial-gradient(ellipse 55% 50% at 50% 50%, #000 10%, rgba(0,0,0,0.4) 50%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 50% at 50% 50%, #000 10%, rgba(0,0,0,0.4) 50%, transparent 85%)",
        }}
      />

      {/* Layer 6 — microscopic material texture (very low-amplitude noise). */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
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
            "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 40%, oklch(0.02 0.005 260 / 0.7) 100%)",
        }}
      />
    </div>
  );
}
