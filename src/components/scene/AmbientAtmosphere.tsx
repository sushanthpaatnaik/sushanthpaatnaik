import { motion } from "framer-motion";

/**
 * Sitewide ambient atmosphere — a near-imperceptible layer of cinematic depth.
 *
 * Five barely-visible passes, tuned for restraint:
 *  1. Three slow-drifting volumetric haze blobs (industrial cool tint + one warm).
 *  2. A faint blueprint-trace SVG layer for industrial micro-texture in dead-center regions.
 *  3. A faint vertical depth gradient.
 *  4. A very low-opacity SVG film grain.
 *  5. A slow cinematic "light breathing" overlay.
 *
 * Everything is fixed, pointer-events-none, mix-blend-screen. The eye never
 * notices it directly — it only feels the scene breathe and stay alive.
 */
export default function AmbientAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden mix-blend-screen"
      style={{ contain: "strict" }}
    >
      {/* Three slow drifting haze fields. The third one carries a hint of
          restrained copper to break perfect tonal uniformity. */}
      <motion.div
        className="absolute -left-[20%] top-[10%] h-[70vh] w-[70vw] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.5 0.06 240 / 0.05), transparent 65%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[8%] h-[60vh] w-[60vw] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.45 0.05 260 / 0.045), transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 18, 0], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      {/* Restrained copper haze — barely visible, breaks tonal monotony. */}
      <motion.div
        className="absolute left-[35%] top-[35%] hidden h-[55vh] w-[55vw] rounded-full will-change-transform md:block"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.55 0.08 55 / 0.028), transparent 70%)",
        }}
        animate={{ x: [0, 24, -10, 0], y: [0, -16, 12, 0], opacity: [0.5, 0.95, 0.6, 0.5] }}
        transition={{ duration: 54, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />

      {/* Faint blueprint trace — industrial geometric depth in the center. */}
      <div
        className="absolute inset-0 opacity-[0.025] md:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420' viewBox='0 0 420 420'><g fill='none' stroke='%237fb1d9' stroke-width='0.4' stroke-opacity='0.55'><circle cx='210' cy='210' r='180'/><circle cx='210' cy='210' r='120'/><circle cx='210' cy='210' r='60'/><path d='M30 210 H390 M210 30 V390 M75 75 L345 345 M345 75 L75 345'/><rect x='90' y='90' width='240' height='240'/></g></svg>\")",
          backgroundSize: "640px 640px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "screen",
        }}
      />

      {/* Faint vertical atmospheric depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.06 0.01 260 / 0.10) 0%, transparent 30%, transparent 70%, oklch(0.05 0.01 260 / 0.12) 100%)",
        }}
      />

      {/* Slow cinematic light breathing — global luminance pulse. */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, oklch(0.62 0.05 235 / 0.035), transparent 70%)",
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Organic film grain — barely perceptible industrial texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.6  0 0 0 0 0.7  0 0 0 0 0.85  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}
