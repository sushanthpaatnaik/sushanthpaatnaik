import { motion } from "framer-motion";

/**
 * Sitewide ambient atmosphere — a near-imperceptible layer of cinematic depth.
 *
 * Composed of three barely-visible passes:
 *  1. Two slow-drifting volumetric haze blobs (industrial cool tint).
 *  2. A faint vertical depth gradient that pushes the scene back into space.
 *  3. A very low-opacity SVG film grain for organic, non-digital surface.
 *
 * Everything is fixed, pointer-events-none, and tuned for restraint — the
 * eye should never notice it directly, only feel the scene "breathe".
 */
export default function AmbientAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden mix-blend-screen"
      style={{ contain: "strict" }}
    >
      {/* Slow drifting volumetric haze — cool industrial tint */}
      <motion.div
        className="absolute -left-[20%] top-[10%] h-[70vh] w-[70vw] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.5 0.06 240 / 0.05), transparent 65%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[8%] h-[60vh] w-[60vw] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.45 0.05 260 / 0.045), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 18, 0], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Faint vertical atmospheric depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.06 0.01 260 / 0.10) 0%, transparent 30%, transparent 70%, oklch(0.05 0.01 260 / 0.12) 100%)",
        }}
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
