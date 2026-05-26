import { motion, useTransform, type MotionValue } from "framer-motion";

const RECOG = 4; // chapter index for "recognition"

/**
 * Museum-grade atmospheric layering for the Recognition chapter.
 *
 * Layers (back to front):
 *   1. Architectural shell — ceiling / wall / floor crushes create gallery depth
 *   2. Institutional spotlight — slow-breathing warm-white focal pool over trophies
 *   3. Trophy surface shimmer — imperceptibly slow warm reflective drift
 *
 * All motion is sub-perceptual: the viewer feels the space, not the animation.
 */
export default function RecognitionAmbient({ phase }: { phase: MotionValue<number> }) {
  const visible = useTransform(phase, (v) => {
    const d = Math.abs(v - RECOG);
    if (d >= 0.9) return 0;
    const t = 1 - d / 0.9;
    return t * t * (3 - 2 * t);
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ opacity: visible }}
    >
      {/* Institutional ceiling — overhead crush anchors the trophy tableau */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "44%",
          background:
            "linear-gradient(180deg, oklch(0.006 0.002 260 / 0.82) 0%, oklch(0.010 0.002 260 / 0.40) 55%, transparent 100%)",
        }}
      />

      {/* Side walls — museum recession depth, pulls focus to trophy center */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: "16%",
          background:
            "linear-gradient(90deg, oklch(0.008 0.002 260 / 0.72) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: "16%",
          background:
            "linear-gradient(270deg, oklch(0.008 0.002 260 / 0.72) 0%, transparent 100%)",
        }}
      />

      {/* Floor plane — grounding depth, slight reflective warmth */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "30%",
          background:
            "linear-gradient(0deg, oklch(0.008 0.002 260 / 0.78) 0%, oklch(0.022 0.008 50 / 0.08) 55%, transparent 100%)",
        }}
      />

      {/* Institutional spotlight — warm-white museum focal pool, 11s breath */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 40% at 50% 58%, oklch(0.58 0.020 50 / 0.10) 0%, transparent 72%)",
        }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Trophy surface shimmer — sub-perceptual warm reflective drift, 15s cycle */}
      <motion.div
        className="absolute"
        style={{
          left: "22%",
          right: "22%",
          top: "40%",
          bottom: "12%",
          background:
            "radial-gradient(ellipse 100% 80% at 50% 52%, oklch(0.68 0.030 54 / 0.052) 0%, transparent 62%)",
          filter: "blur(26px)",
        }}
        animate={{ opacity: [0.12, 0.78, 0.32, 0.95, 0.12], x: [0, 5, -3, 2, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
