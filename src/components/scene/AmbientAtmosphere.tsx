import { motion } from "framer-motion";

export default function AmbientAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden mix-blend-screen"
      style={{ contain: "layout paint style", touchAction: "pan-y" }}
    >
      {/* Haze blob A — opacity-only: GPU composites without re-rasterizing */}
      <motion.div
        className="absolute -left-[20%] top-[10%] h-[70vh] w-[70vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.48 0.03 230 / 0.05), transparent 65%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Haze blob B — offset phase, opacity-only */}
      <motion.div
        className="absolute -right-[15%] bottom-[8%] h-[60vh] w-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.42 0.025 232 / 0.045), transparent 70%)",
        }}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Faint vertical atmospheric depth — static, zero GPU cost */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.05 0.006 232 / 0.06) 0%, transparent 30%, transparent 70%, oklch(0.04 0.006 232 / 0.07) 100%)",
        }}
      />

      {/* Slow cinematic light breathing — opacity-only, GPU-composited */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, oklch(0.58 0.03 232 / 0.055), transparent 70%)",
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Organic film grain — static, mix-blend-overlay, no animation */}
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
