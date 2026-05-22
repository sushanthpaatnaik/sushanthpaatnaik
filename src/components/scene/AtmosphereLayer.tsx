import { useMemo } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

// 9 stages: Discover → Ideate → Invent → Validate → Protect → Prototype → Commercialize → Scale → Industrial Deployment
const STAGES = 9;
const STOPS = Array.from({ length: STAGES }, (_, i) => i / (STAGES - 1));

function useStageOpacity(phase: MotionValue<number>, center: number, spread = 0.75) {
  return useTransform(phase, (value) => {
    const d = Math.abs(value - center) / spread;
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * (3 - 2 * t);
  });
}

export default function AtmosphereLayer() {
  const particles = useMemo(
    () =>
      Array.from({ length: 52 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.6,
        blur: 1 + Math.random() * 3,
        delay: Math.random() * 16,
        duration: 22 + Math.random() * 34,
      })),
    [],
  );

  const { scrollYProgress } = useScroll();
  const progressSlow = useSpring(scrollYProgress, { stiffness: 14, damping: 38, mass: 1.8 });

  const stagePhase = useTransform(progressSlow, [0, 1], [0, STAGES - 1]);

  const s0 = useStageOpacity(stagePhase, 0);
  const s1 = useStageOpacity(stagePhase, 1);
  const s2 = useStageOpacity(stagePhase, 2);
  const s3 = useStageOpacity(stagePhase, 3);
  const s4 = useStageOpacity(stagePhase, 4);
  const s5 = useStageOpacity(stagePhase, 5);
  const s6 = useStageOpacity(stagePhase, 6);
  const s7 = useStageOpacity(stagePhase, 7);
  const s8 = useStageOpacity(stagePhase, 8);

  // Global atmosphere curves across 9 stops
  const globalDarkness = useTransform(progressSlow, STOPS, [0.86, 0.7, 0.46, 0.5, 0.6, 0.4, 0.38, 0.44, 0.74]);
  const vignetteOpacity = useTransform(progressSlow, STOPS, [1, 0.86, 0.7, 0.74, 0.84, 0.7, 0.72, 0.78, 0.96]);

  const hazeOpacity = useTransform(progressSlow, STOPS, [0.34, 0.28, 0.22, 0.3, 0.32, 0.2, 0.34, 0.42, 0.24]);
  const hazeY = useTransform(progressSlow, [0, 1], [0, -200]);
  const hazeScale = useTransform(progressSlow, STOPS, [1.04, 1.08, 1.1, 1.06, 1.04, 1.1, 1.14, 1.2, 1.06]);

  const particleY = useTransform(progressSlow, [0, 1], [0, -320]);
  const particleOpacity = useTransform(progressSlow, STOPS, [0.94, 0.78, 0.6, 0.5, 0.42, 0.36, 0.3, 0.22, 0.08]);
  const particleScale = useTransform(progressSlow, STOPS, [1, 0.96, 0.9, 0.86, 0.82, 0.78, 0.74, 0.7, 0.62]);

  const stageLayers = [
    // 01 DISCOVER — deep void + faint ember signal
    { key: "discover-void", opacity: s0, blendMode: "normal" as const,
      background: "radial-gradient(ellipse at 50% 60%, oklch(0.12 0.03 270 / 0.6), oklch(0.04 0.01 260 / 0.95) 75%)" },
    { key: "discover-ember", opacity: s0, blendMode: "screen" as const,
      background: "radial-gradient(circle at 50% 72%, oklch(0.58 0.18 32 / 0.34), transparent 44%)" },

    // 02 IDEATE — indigo bloom + constellation grid
    { key: "ideate-bloom", opacity: s1, blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 40% 50%, oklch(0.5 0.18 268 / 0.7), oklch(0.22 0.1 262 / 0.4) 44%, transparent 76%)" },
    { key: "ideate-constellation", opacity: s1, blendMode: "overlay" as const,
      background: "radial-gradient(circle at 22% 28%, oklch(0.78 0.14 268 / 0.5) 0 1.5px, transparent 2px), radial-gradient(circle at 68% 18%, oklch(0.78 0.14 268 / 0.4) 0 1.5px, transparent 2px), radial-gradient(circle at 82% 64%, oklch(0.78 0.14 268 / 0.5) 0 1.5px, transparent 2px), radial-gradient(circle at 36% 78%, oklch(0.78 0.14 268 / 0.4) 0 1.5px, transparent 2px)" },

    // 03 INVENT — cyan molecular field + graphene lattice + conductive sweep
    { key: "invent-field", opacity: s2, blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 42% 48%, oklch(0.66 0.2 215 / 0.82), oklch(0.36 0.14 226 / 0.4) 44%, transparent 74%)" },
    { key: "invent-lattice", opacity: s2, blendMode: "overlay" as const,
      background: "repeating-linear-gradient(60deg, oklch(0.72 0.18 205 / 0.22) 0 1px, transparent 1px 32px), repeating-linear-gradient(-60deg, oklch(0.72 0.18 205 / 0.22) 0 1px, transparent 1px 32px), repeating-linear-gradient(0deg, oklch(0.72 0.18 205 / 0.14) 0 1px, transparent 1px 32px)" },
    { key: "invent-sweep", opacity: s2, blendMode: "screen" as const,
      background: "linear-gradient(110deg, transparent 30%, oklch(0.76 0.22 218 / 0.3) 50%, transparent 70%)" },

    // 04 VALIDATE — oscilloscope band + clinical data grid
    { key: "validate-base", opacity: s3, blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 50% 50%, oklch(0.58 0.14 188 / 0.62), oklch(0.28 0.08 200 / 0.4) 50%, transparent 78%)" },
    { key: "validate-grid", opacity: s3, blendMode: "overlay" as const,
      background: "repeating-linear-gradient(0deg, oklch(0.78 0.12 188 / 0.22) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, oklch(0.78 0.12 188 / 0.14) 0 1px, transparent 1px 24px)" },
    { key: "validate-wave", opacity: s3, blendMode: "screen" as const,
      background: "linear-gradient(180deg, transparent 0%, transparent 46%, oklch(0.74 0.18 188 / 0.32) 50%, transparent 54%, transparent 100%)" },

    // 05 PROTECT — monolithic slate + vertical IP light shafts
    { key: "protect-slate", opacity: s4, blendMode: "normal" as const,
      background: "radial-gradient(ellipse at center, oklch(0.16 0.04 264 / 0.78), oklch(0.06 0.02 260 / 0.96) 80%)" },
    { key: "protect-shafts", opacity: s4, blendMode: "screen" as const,
      background: "linear-gradient(90deg, transparent 18%, oklch(0.6 0.1 280 / 0.22) 20%, transparent 22%, transparent 48%, oklch(0.6 0.1 280 / 0.18) 50%, transparent 52%, transparent 78%, oklch(0.6 0.1 280 / 0.22) 80%, transparent 82%)" },
    { key: "protect-seal", opacity: s4, blendMode: "overlay" as const,
      background: "radial-gradient(circle at 50% 50%, oklch(0.5 0.12 280 / 0.24), transparent 38%)" },

    // 06 PROTOTYPE — industrial amber forge + steel underlayer + sparks
    { key: "proto-forge", opacity: s5, blendMode: "overlay" as const,
      background: "radial-gradient(ellipse at 64% 56%, oklch(0.6 0.18 52 / 0.82), oklch(0.34 0.12 38 / 0.44) 42%, transparent 76%)" },
    { key: "proto-steel", opacity: s5, blendMode: "soft-light" as const,
      background: "linear-gradient(200deg, oklch(0.32 0.06 44 / 0.74), oklch(0.16 0.04 240 / 0.62) 64%, transparent 100%)" },
    { key: "proto-spark", opacity: s5, blendMode: "screen" as const,
      background: "radial-gradient(circle at 30% 38%, oklch(0.72 0.2 60 / 0.22), transparent 28%), radial-gradient(circle at 78% 70%, oklch(0.68 0.18 48 / 0.2), transparent 30%)" },

    // 07 COMMERCIALIZE — metallic copper sweep + production-line geometry
    { key: "comm-copper", opacity: s6, blendMode: "overlay" as const,
      background: "linear-gradient(135deg, oklch(0.52 0.16 38 / 0.62), oklch(0.32 0.1 32 / 0.4) 50%, oklch(0.18 0.06 268 / 0.5) 100%)" },
    { key: "comm-lines", opacity: s6, blendMode: "overlay" as const,
      background: "repeating-linear-gradient(90deg, transparent 0 84px, oklch(0.72 0.16 48 / 0.2) 84px 85px), repeating-linear-gradient(0deg, transparent 0 84px, oklch(0.72 0.14 40 / 0.14) 84px 85px)" },
    { key: "comm-glow", opacity: s6, blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 70% 56%, oklch(0.68 0.18 48 / 0.36), transparent 56%)" },

    // 08 SCALE — wide cool-blue horizon + infrastructure grid + energy blooms
    { key: "scale-base", opacity: s7, blendMode: "soft-light" as const,
      background: "linear-gradient(180deg, oklch(0.2 0.08 250 / 0.95), oklch(0.12 0.05 244 / 0.62) 70%, transparent 100%)" },
    { key: "scale-horizon", opacity: s7, blendMode: "overlay" as const,
      background: "linear-gradient(180deg, transparent 0%, transparent 58%, oklch(0.5 0.14 240 / 0.34) 62%, transparent 64%, transparent 100%)" },
    { key: "scale-energy", opacity: s7, blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 82% 70%, oklch(0.64 0.16 78 / 0.42), transparent 50%), radial-gradient(ellipse at 18% 30%, oklch(0.58 0.14 250 / 0.34), transparent 52%)" },

    // 09 INDUSTRIAL DEPLOYMENT — biosphere green/teal + calm horizon resolution
    { key: "deploy-biosphere", opacity: s8, blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 50% 52%, oklch(0.6 0.18 162 / 0.76), oklch(0.32 0.12 178 / 0.4) 44%, transparent 76%)" },
    { key: "deploy-haze", opacity: s8, blendMode: "soft-light" as const,
      background: "linear-gradient(160deg, oklch(0.28 0.1 168 / 0.7), transparent 70%)" },
    { key: "deploy-resolution", opacity: s8, blendMode: "normal" as const,
      background: "radial-gradient(ellipse at center, oklch(0.08 0.025 248 / 0.5), oklch(0.04 0.01 258 / 0.9) 90%)" },
  ];

  const sweepX = useTransform(progressSlow, STOPS, ["50%", "38%", "62%", "50%", "50%", "68%", "72%", "30%", "50%"]);
  const sweepY = useTransform(progressSlow, STOPS, ["70%", "50%", "44%", "50%", "46%", "58%", "54%", "48%", "50%"]);
  const sweepHue = useTransform(progressSlow, STOPS, [32, 268, 218, 188, 280, 52, 38, 240, 162]);
  const sweepOpacity = useTransform(progressSlow, STOPS, [0.1, 0.26, 0.42, 0.32, 0.22, 0.4, 0.36, 0.32, 0.18]);
  const sweepBg = useMotionTemplate`radial-gradient(circle, oklch(0.62 0.18 ${sweepHue} / 0.5), transparent 70%)`;



  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">



      <motion.div
        className="absolute inset-0"
        style={{ opacity: globalDarkness, background: "oklch(0.03 0.01 258)" }}
      />

      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: hazeOpacity, y: hazeY, scale: hazeScale }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 42%, oklch(0.32 0.06 235 / 0.46), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 74% 68%, oklch(0.26 0.06 205 / 0.34), transparent 64%)",
          }}
        />
      </motion.div>

      {stageLayers.map((layer) => (
        <motion.div
          key={layer.key}
          className="absolute inset-0"
          style={{
            opacity: layer.opacity,
            mixBlendMode: layer.blendMode,
            background: layer.background,
          }}
        />
      ))}

      <motion.div className="absolute inset-0 will-change-transform" style={{ opacity: sweepOpacity }}>
        <motion.div
          className="absolute h-[90vw] w-[90vw] rounded-full blur-[160px]"
          style={{
            left: sweepX,
            top: sweepY,
            x: "-50%",
            y: "-50%",
            background: sweepBg,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: particleY, opacity: particleOpacity, scale: particleScale }}
      >
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.28,
              filter: `blur(${particle.blur}px)`,
              background: "oklch(0.9 0.04 220)",
              boxShadow: "0 0 10px oklch(0.74 0.08 220 / 0.3)",
              animation: `atmosDrift ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          opacity: vignetteOpacity,
          background:
            "radial-gradient(ellipse at center, transparent 34%, oklch(0.02 0.01 255) 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-80"
        style={{
          background: "linear-gradient(to bottom, oklch(0.02 0.01 255 / 0.98), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-80"
        style={{
          background: "linear-gradient(to top, oklch(0.02 0.01 255 / 0.98), transparent)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.72  0 0 0 0 0.76  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0% { transform: translate3d(0, 0, 1px); opacity: 0.14; }
          50% { transform: translate3d(8px, -14px, 1px); opacity: 0.32; }
          100% { transform: translate3d(-6px, -22px, 1px); opacity: 0.18; }
        }
      `}</style>
    </div>
  );
}
