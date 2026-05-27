import { motion, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

const RECOG = 4;

/**
 * Cinematic institutional archive atmosphere for the Recognition chapter.
 *
 * Layers (back to front):
 *   1. Architectural void      — ceiling / floor / side-wall crushes collapse ambient light
 *   2. Spotlight columns       — three narrow cool-white ceiling beams, institutional track lighting
 *   3. Focal pool              — cool silver pool on trophy midline, slow breathing
 *   4. Volumetric haze         — diffuse silver-blue atmosphere, near-imperceptible drift
 *   5. Trophy surface shimmer  — slow cool reflective light ripple across the trophy zone
 *   6. Cinematic dust          — eight ultra-slow floating motes, sub-perceptual
 *
 * All motion is near-subconscious: the viewer senses the space, not the animation.
 * All tones are cool silver-blue (hue ~218–228); no warm amber is used anywhere.
 */
export default function RecognitionAmbient({ phase }: { phase: MotionValue<number> }) {
  const reduce = useReducedMotion();

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
      {/* Ceiling void — deep overhead crush grounds the trophy tableau in darkness */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "52%",
          background:
            "linear-gradient(180deg, oklch(0.004 0.001 260 / 0.97) 0%, oklch(0.008 0.002 252 / 0.58) 58%, transparent 100%)",
        }}
      />

      {/* Floor void — grounding darkness beneath the trophies */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "34%",
          background:
            "linear-gradient(0deg, oklch(0.004 0.001 260 / 0.94) 0%, oklch(0.008 0.002 255 / 0.50) 58%, transparent 100%)",
        }}
      />

      {/* Side walls — museum recession pulls focus inward.
          Left wall is lighter than right: Presidential trophy sits in this zone
          and needs breathing room to read as a prestige object. */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: "15%",
          background:
            "linear-gradient(90deg, oklch(0.005 0.001 260 / 0.52) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: "18%",
          background:
            "linear-gradient(270deg, oklch(0.005 0.001 260 / 0.68) 0%, transparent 100%)",
        }}
      />

      {/* Presidential trophy rim light — subtle cool metallic edge illumination
          from the far-left axis. Recovers trophy silhouette without brightening
          the whole scene. Asymmetric: only applied on the left side. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 22% 55% at 2% 58%, oklch(0.60 0.010 218 / 0.09) 0%, transparent 100%)",
        }}
      />

      {/* Institutional spotlight columns — three narrow ceiling track beams */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 6% 60% at 30% 0%, oklch(0.76 0.006 220 / 0.10) 0%, transparent 92%)",
            "radial-gradient(ellipse 8% 66% at 50% 0%, oklch(0.80 0.005 218 / 0.14) 0%, transparent 96%)",
            "radial-gradient(ellipse 6% 60% at 70% 0%, oklch(0.76 0.006 220 / 0.10) 0%, transparent 92%)",
          ].join(", "),
        }}
      />

      {/* Spotlight focal pool — cool silver on trophy midline, slow institutional breath */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 36% at 50% 60%, oklch(0.48 0.008 222 / 0.13) 0%, transparent 80%)",
        }}
        animate={reduce ? undefined : { opacity: [0.50, 1, 0.50] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Volumetric haze — silver-blue atmospheric diffusion, near-imperceptible drift */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 42% at 50% 58%, oklch(0.28 0.010 226 / 0.08), transparent 74%)",
          filter: "blur(36px)",
        }}
        animate={reduce ? undefined : { opacity: [0.38, 0.82, 0.38], x: [0, 4, -3, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Trophy surface shimmer — slow cool reflective light drift across focal zone */}
      <motion.div
        className="absolute"
        style={{
          left: "18%",
          right: "18%",
          top: "40%",
          bottom: "16%",
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, oklch(0.70 0.012 218 / 0.042) 0%, transparent 66%)",
          filter: "blur(24px)",
        }}
        animate={reduce ? undefined : { opacity: [0.06, 0.62, 0.18, 0.78, 0.06], x: [0, 7, -4, 3, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Cinematic dust — 8 ultra-slow motes, almost subconscious in the spotlight columns */}
      {!reduce &&
        [
          { x: "29%", y: "58%", d: 38, delay: 0 },
          { x: "50%", y: "50%", d: 44, delay: 8 },
          { x: "42%", y: "64%", d: 40, delay: 16 },
          { x: "66%", y: "54%", d: 36, delay: 4 },
          { x: "34%", y: "46%", d: 46, delay: 20 },
          { x: "57%", y: "60%", d: 42, delay: 12 },
          { x: "48%", y: "52%", d: 34, delay: 25 },
          { x: "73%", y: "48%", d: 40, delay: 9 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: "1px",
              height: "1px",
              background: "oklch(0.80 0.008 220)",
              filter: "blur(0.3px)",
            }}
            animate={{
              opacity: [0, 0.36, 0.12, 0.28, 0],
              y: [0, -10, -22, -36, -50],
              x: [0, 3, -2, 4, 1],
            }}
            transition={{
              duration: p.d,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
    </motion.div>
  );
}
