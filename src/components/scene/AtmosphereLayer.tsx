import { useMemo } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

/**
 * Sitewide cinematic ENVIRONMENT layer.
 *
 * No looping wallpaper video. Instead, the page becomes a scroll-synchronized
 * cinematic journey through 7 distinct environmental scenes that crossfade
 * into each other as the user scrolls:
 *
 *   0 Origin / Ideation       — abstract particles, scientific fog
 *   1 Research / Graphene     — emerging graphene lattice, molecular geometry
 *   2 Innovation              — flowing conductive energy, active networks
 *   3 Prototyping / Engineering — advanced material architecture
 *   4 Commercialization       — futuristic manufacturing, industrial systems
 *   5 Impact                  — climate/energy systems, planetary scale
 *   6 Future                  — calm cinematic resolution
 *
 * Movement is slow, restrained, luxurious. Framer Motion only.
 */

const SCENE_COUNT = 7;
const STOPS = Array.from({ length: SCENE_COUNT }, (_, i) => i / (SCENE_COUNT - 1));

// Triangle weight: 1 at its own stop, 0 at neighbors → smooth crossfade.
function sceneWeight(i: number, p: MotionValue<number>): MotionValue<number> {
  const weights: number[] = STOPS.map((_, j) => (i === j ? 1 : 0));
  return useTransform(p, STOPS, weights);
}

export default function AtmosphereLayer() {
  const { scrollYProgress } = useScroll();
  const pFast = useSpring(scrollYProgress, { stiffness: 30, damping: 46, mass: 1.1 });
  const pSlow = useSpring(scrollYProgress, { stiffness: 16, damping: 56, mass: 2.0 });

  // Per-scene crossfade opacities
  const w0 = sceneWeight(0, pSlow);
  const w1 = sceneWeight(1, pSlow);
  const w2 = sceneWeight(2, pSlow);
  const w3 = sceneWeight(3, pSlow);
  const w4 = sceneWeight(4, pSlow);
  const w5 = sceneWeight(5, pSlow);
  const w6 = sceneWeight(6, pSlow);

  // Global cinematic depth — vignette deepens through commercialization & impact
  const vignetteOpacity = useTransform(pSlow, STOPS, [0.55, 0.68, 0.74, 0.82, 0.88, 0.80, 1.0]);

  // Aurora glow sweeping across the timeline
  const auroraX = useTransform(pSlow, [0, 1], ["18%", "82%"]);
  const auroraY = useTransform(pSlow, [0, 1], ["32%", "68%"]);
  const auroraOpacity = useTransform(pSlow, STOPS, [0.08, 0.16, 0.32, 0.24, 0.20, 0.26, 0.12]);

  // Cinematic camera drift (applied to whole environment)
  const camY = useTransform(pFast, [0, 1], [0, -40]);
  const camScale = useTransform(pFast, STOPS, [1.0, 1.03, 1.06, 1.08, 1.06, 1.05, 1.02]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-[#02030a]">
      {/* Base atmospheric gradient — always present, ultra dark graphite */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.12_0.02_245)_0%,#02030a_75%)]" />

      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: camY, scale: camScale }}
      >
        <SceneOrigin opacity={w0} />
        <SceneGraphene opacity={w1} progress={pSlow} />
        <SceneInnovation opacity={w2} progress={pSlow} />
        <ScenePrototyping opacity={w3} progress={pSlow} />
        <SceneCommercialization opacity={w4} progress={pSlow} />
        <SceneImpact opacity={w5} progress={pSlow} />
        <SceneFuture opacity={w6} />
      </motion.div>

      {/* Aurora glow — sweeps across the scene timeline */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform pointer-events-none"
        style={{ opacity: auroraOpacity }}
      >
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[140px] bg-[radial-gradient(circle,oklch(0.6_0.18_215/0.5),transparent_70%)]"
          style={{ left: auroraX, top: auroraY, x: "-50%", y: "-50%" }}
        />
      </motion.div>

      {/* Vignette */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#02030a_100%)]"
        style={{ opacity: vignetteOpacity }}
      />

      {/* Letterbox bars */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02030a]/95 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#02030a]/95 to-transparent" />

      {/* Cinematic grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0%   { transform: translate3d(0, 0, 0); opacity: 0.18; }
          50%  { transform: translate3d(4px, -10px, 0); opacity: 0.32; }
          100% { transform: translate3d(-3px, -16px, 0); opacity: 0.22; }
        }
        @keyframes flowPulse {
          0%, 100% { opacity: 0.35; transform: translateX(0); }
          50%      { opacity: 0.7; transform: translateX(20px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * SCENE 0 — Origin / Ideation
 * Abstract particles, scientific fog, dark cinematic gradient.
 * ============================================================ */
function SceneOrigin({ opacity }: { opacity: MotionValue<number> }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 0.6 + Math.random() * 1.8,
        delay: Math.random() * 22,
        dur: 26 + Math.random() * 30,
        seed: i,
      })),
    [],
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,oklch(0.18_0.04_240/0.7),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,oklch(0.15_0.03_220/0.5),transparent_65%)] mix-blend-screen" />
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.seed}
            className="absolute rounded-full bg-[oklch(0.85_0.04_220)]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.22,
              filter: "blur(1.4px)",
              boxShadow: "0 0 6px oklch(0.7 0.08 220 / 0.35)",
              animation: `atmosDrift ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ============================================================
 * SCENE 1 — Research / Graphene
 * Emerging hexagonal lattice + molecular geometry.
 * ============================================================ */
function SceneGraphene({ opacity, progress }: { opacity: MotionValue<number>; progress: MotionValue<number> }) {
  const latticeOpacity = useTransform(progress, [0.1, 0.18, 0.3], [0, 0.55, 0.0]);
  const latticeScale = useTransform(progress, [0.1, 0.3], [0.92, 1.08]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_50%,oklch(0.22_0.06_215/0.65),transparent_72%)]" />
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: latticeOpacity, scale: latticeScale }}
      >
        <defs>
          <pattern id="hex" width="80" height="69.28" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
            <path
              d="M40 0 L80 23 L80 46 L40 69 L0 46 L0 23 Z"
              fill="none"
              stroke="oklch(0.75 0.10 215)"
              strokeWidth="0.6"
              opacity="0.55"
            />
            <circle cx="40" cy="0" r="1.4" fill="oklch(0.85 0.12 215)" opacity="0.7" />
            <circle cx="80" cy="23" r="1.4" fill="oklch(0.85 0.12 215)" opacity="0.7" />
            <circle cx="80" cy="46" r="1.4" fill="oklch(0.85 0.12 215)" opacity="0.7" />
            <circle cx="40" cy="69" r="1.4" fill="oklch(0.85 0.12 215)" opacity="0.7" />
            <circle cx="0" cy="23" r="1.4" fill="oklch(0.85 0.12 215)" opacity="0.7" />
            <circle cx="0" cy="46" r="1.4" fill="oklch(0.85 0.12 215)" opacity="0.7" />
          </pattern>
          <radialGradient id="hexMask" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="latticeMask">
            <rect width="100%" height="100%" fill="url(#hexMask)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" mask="url(#latticeMask)" />
      </motion.svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_30%,#02030a_85%)]" />
    </motion.div>
  );
}

/* ============================================================
 * SCENE 2 — Innovation
 * Flowing conductive energy, atmospheric cyan.
 * ============================================================ */
function SceneInnovation({ opacity, progress }: { opacity: MotionValue<number>; progress: MotionValue<number> }) {
  const flowX = useTransform(progress, [0.25, 0.45], ["-10%", "10%"]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.40_0.16_215/0.55),transparent_70%)] mix-blend-screen" />
      <motion.div
        className="absolute inset-0"
        style={{ x: flowX }}
      >
        <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.7_0.18_215/0.6)] to-transparent" style={{ animation: "flowPulse 6s ease-in-out infinite" }} />
        <div className="absolute top-[48%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.65_0.16_220/0.5)] to-transparent" style={{ animation: "flowPulse 8s ease-in-out infinite 1s" }} />
        <div className="absolute top-[62%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.7_0.18_210/0.55)] to-transparent" style={{ animation: "flowPulse 7s ease-in-out infinite 2s" }} />
        <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.6_0.14_225/0.45)] to-transparent" style={{ animation: "flowPulse 9s ease-in-out infinite 0.5s" }} />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,oklch(0.45_0.18_210/0.3),transparent_60%)] mix-blend-screen" />
    </motion.div>
  );
}

/* ============================================================
 * SCENE 3 — Prototyping / Engineering
 * Advanced material architecture, blueprint grid, mechanical depth.
 * ============================================================ */
function ScenePrototyping({ opacity, progress }: { opacity: MotionValue<number>; progress: MotionValue<number> }) {
  const gridY = useTransform(progress, [0.4, 0.6], ["0%", "-8%"]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.15_0.04_240/0.6)_0%,oklch(0.10_0.03_230/0.8)_100%)]" />
      <motion.div className="absolute inset-0" style={{ y: gridY }}>
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.7 0.10 215 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.10 215 / 0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          }}
        />
      </motion.div>
      {/* Concentric engineering rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[60vmin] h-[60vmin]" style={{ animation: "spinSlow 180s linear infinite" }}>
          <div className="absolute inset-0 rounded-full border border-[oklch(0.55_0.12_215/0.25)]" />
          <div className="absolute inset-[10%] rounded-full border border-[oklch(0.55_0.12_215/0.20)]" />
          <div className="absolute inset-[22%] rounded-full border border-[oklch(0.55_0.12_215/0.15)]" />
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
 * SCENE 4 — Commercialization
 * Industrial deployment, manufacturing depth.
 * ============================================================ */
function SceneCommercialization({ opacity, progress }: { opacity: MotionValue<number>; progress: MotionValue<number> }) {
  const drift = useTransform(progress, [0.55, 0.75], ["0%", "-6%"]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[linear-gradient(200deg,oklch(0.14_0.03_240/0.8)_0%,oklch(0.08_0.02_230/0.9)_70%,transparent_100%)]" />
      {/* Vertical industrial columns suggesting infrastructure */}
      <motion.div className="absolute inset-0 flex items-end justify-around opacity-30" style={{ y: drift }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-[oklch(0.45_0.10_215/0.4)] to-transparent"
            style={{
              width: "2px",
              height: `${30 + (i % 5) * 12}%`,
              opacity: 0.4 + (i % 3) * 0.15,
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,oklch(0.30_0.08_215/0.4),transparent_65%)] mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#02030a_90%)]" />
    </motion.div>
  );
}

/* ============================================================
 * SCENE 5 — Impact
 * Planetary, climate-tech, energy systems.
 * ============================================================ */
function SceneImpact({ opacity, progress }: { opacity: MotionValue<number>; progress: MotionValue<number> }) {
  const planetRotate = useTransform(progress, [0.7, 0.9], [-8, 8]);
  const planetScale = useTransform(progress, [0.7, 0.9], [0.95, 1.05]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,oklch(0.20_0.08_180/0.55),transparent_72%)] mix-blend-screen" />
      <motion.div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[75vmin] h-[75vmin] rounded-full"
        style={{
          rotate: planetRotate,
          scale: planetScale,
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.32 0.10 180 / 0.55) 0%, oklch(0.15 0.06 220 / 0.4) 45%, transparent 70%)",
          boxShadow:
            "inset -40px -40px 120px oklch(0.05 0.02 240 / 0.8), 0 0 180px oklch(0.45 0.14 195 / 0.35)",
          filter: "blur(2px)",
        }}
      />
      {/* Orbital ring */}
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[88vmin] h-[88vmin] rounded-full border border-[oklch(0.55_0.12_195/0.18)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#02030a_92%)]" />
    </motion.div>
  );
}

/* ============================================================
 * SCENE 6 — Future
 * Calm cinematic resolution, minimal molecular drift.
 * ============================================================ */
function SceneFuture({ opacity }: { opacity: MotionValue<number> }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 0.8 + Math.random() * 1.4,
        delay: Math.random() * 30,
        dur: 36 + Math.random() * 34,
        seed: i,
      })),
    [],
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.10_0.02_240/0.85),#02030a_80%)]" />
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.seed}
            className="absolute rounded-full bg-[oklch(0.85_0.04_220)]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.18,
              filter: "blur(1.8px)",
              boxShadow: "0 0 5px oklch(0.7 0.06 220 / 0.25)",
              animation: `atmosDrift ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
