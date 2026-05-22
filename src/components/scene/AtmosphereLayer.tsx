import { useMemo } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

// 4 stages: Ideation → Innovation → Commercialisation → Industry Deployment
const STAGES = 4;
const STOPS = Array.from({ length: STAGES }, (_, i) => i / (STAGES - 1));


function useStageOpacity(phase: MotionValue<number>, center: number, spread = 0.85) {
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
      Array.from({ length: 44 }, (_, index) => ({
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


  const globalDarkness = useTransform(progressSlow, STOPS, [0.82, 0.42, 0.4, 0.72]);
  const vignetteOpacity = useTransform(progressSlow, STOPS, [1, 0.7, 0.74, 0.96]);

  const hazeOpacity = useTransform(progressSlow, STOPS, [0.32, 0.22, 0.38, 0.24]);
  const hazeY = useTransform(progressSlow, [0, 1], [0, -160]);
  const hazeScale = useTransform(progressSlow, STOPS, [1.04, 1.12, 1.18, 1.06]);

  const particleY = useTransform(progressSlow, [0, 1], [0, -260]);
  const particleOpacity = useTransform(progressSlow, STOPS, [0.92, 0.56, 0.32, 0.08]);
  const particleScale = useTransform(progressSlow, STOPS, [1, 0.88, 0.78, 0.62]);

  const stageLayers = [
    // 01 IDEATION — deep void + conceptual ember
    {
      key: "ideation-void",
      opacity: s0,
      blendMode: "normal" as const,
      background:
        "radial-gradient(ellipse at 50% 60%, oklch(0.12 0.03 270 / 0.6), oklch(0.04 0.01 260 / 0.95) 75%)",
    },
    {
      key: "ideation-ember",
      opacity: s0,
      blendMode: "screen" as const,
      background:
        "radial-gradient(circle at 50% 72%, oklch(0.58 0.18 32 / 0.34), transparent 44%)",
    },
    // 02 INNOVATION — cyan molecular field + lattice + conductive sweep
    {
      key: "innovation-field",
      opacity: s1,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 42% 48%, oklch(0.66 0.2 215 / 0.82), oklch(0.36 0.14 226 / 0.4) 44%, transparent 74%)",
    },
    {
      key: "innovation-lattice",
      opacity: s1,
      blendMode: "overlay" as const,
      background:
        "repeating-linear-gradient(60deg, oklch(0.72 0.18 205 / 0.2) 0 1px, transparent 1px 32px), repeating-linear-gradient(-60deg, oklch(0.72 0.18 205 / 0.2) 0 1px, transparent 1px 32px), repeating-linear-gradient(0deg, oklch(0.72 0.18 205 / 0.14) 0 1px, transparent 1px 32px)",
    },
    {
      key: "innovation-sweep",
      opacity: s1,
      blendMode: "screen" as const,
      background:
        "linear-gradient(110deg, transparent 30%, oklch(0.76 0.22 218 / 0.3) 50%, transparent 70%)",
    },
    // 03 COMMERCIALISATION — industrial amber/steel + production pathways + scale grid
    {
      key: "comm-forge",
      opacity: s2,
      blendMode: "overlay" as const,
      background:
        "radial-gradient(ellipse at 64% 56%, oklch(0.6 0.18 52 / 0.8), oklch(0.34 0.12 38 / 0.42) 42%, transparent 76%)",
    },
    {
      key: "comm-steel",
      opacity: s2,
      blendMode: "soft-light" as const,
      background:
        "linear-gradient(200deg, oklch(0.32 0.06 44 / 0.74), oklch(0.16 0.04 240 / 0.62) 64%, transparent 100%)",
    },
    {
      key: "comm-paths",
      opacity: s2,
      blendMode: "overlay" as const,
      background:
        "repeating-linear-gradient(90deg, transparent 0 72px, oklch(0.7 0.16 58 / 0.18) 72px 73px), repeating-linear-gradient(0deg, transparent 0 72px, oklch(0.7 0.14 50 / 0.14) 72px 73px)",
    },
    {
      key: "comm-horizon",
      opacity: s2,
      blendMode: "screen" as const,
      background:
        "radial-gradient(circle at 30% 38%, oklch(0.72 0.2 60 / 0.2), transparent 30%), radial-gradient(circle at 80% 70%, oklch(0.66 0.18 48 / 0.18), transparent 32%)",
    },
    // 04 INDUSTRY DEPLOYMENT — climate-tech green/teal + infrastructure + calm horizon
    {
      key: "deploy-biosphere",
      opacity: s3,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 50% 52%, oklch(0.6 0.18 162 / 0.76), oklch(0.32 0.12 178 / 0.4) 44%, transparent 76%)",
    },
    {
      key: "deploy-haze",
      opacity: s3,
      blendMode: "soft-light" as const,
      background:
        "linear-gradient(160deg, oklch(0.28 0.1 168 / 0.7), transparent 70%)",
    },
    {
      key: "deploy-horizon",
      opacity: s3,
      blendMode: "overlay" as const,
      background:
        "linear-gradient(180deg, transparent 0%, transparent 56%, oklch(0.5 0.14 175 / 0.32) 62%, transparent 66%, transparent 100%)",
    },
    {
      key: "deploy-resolution",
      opacity: s3,
      blendMode: "normal" as const,
      background:
        "radial-gradient(ellipse at center, oklch(0.08 0.025 248 / 0.5), oklch(0.04 0.01 258 / 0.9) 90%)",
    },
  ];

  const sweepX = useTransform(progressSlow, STOPS, ["50%", "62%", "32%", "50%"]);
  const sweepY = useTransform(progressSlow, STOPS, ["70%", "44%", "58%", "50%"]);
  const sweepHue = useTransform(progressSlow, STOPS, [32, 218, 52, 162]);
  const sweepOpacity = useTransform(progressSlow, STOPS, [0.1, 0.42, 0.36, 0.18]);
  const sweepBg = useMotionTemplate`radial-gradient(circle, oklch(0.62 0.18 ${sweepHue} / 0.5), transparent 70%)`;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          x: videoX,
          y: videoY,
          scale: videoScale,
          rotate: videoRotate,
          opacity: videoOpacity,
          filter: videoFilter,
        }}
      >
        <video
          ref={videoRef}
          src={atmosphereVideo}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>

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
