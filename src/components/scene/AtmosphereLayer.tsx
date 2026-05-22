import { useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import atmosphereVideo from "@/assets/atmosphere.mp4";

/**
 * Sitewide cinematic atmosphere — a 7-chapter scroll-synchronized journey from
 * scientific ideation to industrial transformation. The looping video acts as a
 * neutral environmental base; the visible cinematic effect comes from
 * scroll-linked transforms + crossfading scene overlays per chapter.
 *
 *   0 Origin       — abstract particles, atmospheric darkness, emerging energy
 *   1 Discovery    — molecular systems, graphene lattice emergence
 *   2 Engineering  — conductive pathways, precision industrial geometry
 *   3 Prototype    — futuristic manufacturing, applied material systems
 *   4 Scale        — industrial infrastructure, energy networks
 *   5 Deployment   — climate-tech environments, intelligent infrastructure
 *   6 Future       — calm futuristic atmosphere, cinematic stillness
 */
const STOPS = [0, 1, 2, 3, 4, 5, 6].map((i) => i / 6);

export default function AtmosphereLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 0.8 + Math.random() * 1.8,
        delay: Math.random() * 24,
        dur: 28 + Math.random() * 34,
        seed: i,
      })),
    [],
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.22;
    v.play().catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll();
  const pFast = useSpring(scrollYProgress, { stiffness: 27, damping: 44, mass: 1.2 });
  const pSlow = useSpring(scrollYProgress, { stiffness: 15, damping: 54, mass: 2.0 });

  /* ---------- Video "camera" through 7 chapters ----------
   *                              Origin Disco. Engin. Proto. Scale  Deploy. Future
   */
  const scale      = useTransform(pFast, STOPS, [1.02, 1.06, 1.10, 1.08, 1.12, 1.07, 1.14]);
  const translateY = useTransform(pFast, STOPS, [   0,  -12,  -22,  -18,  -30,  -24,  -38]);
  const rotate     = useTransform(pFast, STOPS, [   0, -0.34, 0.28, -0.22, 0.40, -0.26, 0.18]);
  const blurPx     = useTransform(pFast, STOPS, [ 0.12, 0.50, 0.80, 1.40, 1.90, 2.20, 2.40]);
  const brightness = useTransform(pFast, STOPS, [0.62, 0.78, 0.82, 0.74, 0.66, 0.70, 0.55]);
  const contrast   = useTransform(pFast, STOPS, [1.04, 1.12, 1.18, 1.10, 1.06, 0.98, 1.08]);
  const saturate   = useTransform(pFast, STOPS, [0.78, 0.92, 1.00, 0.82, 0.74, 0.86, 0.62]);
  const videoOpacity = useTransform(pFast, STOPS, [0.82, 0.88, 0.90, 0.80, 0.72, 0.74, 0.58]);

  const videoFilter = useTransform(
    [blurPx, brightness, contrast, saturate] as never,
    ([b, br, ct, sa]: number[]) =>
      `blur(${b.toFixed(2)}px) brightness(${br.toFixed(2)}) contrast(${ct.toFixed(2)}) saturate(${sa.toFixed(2)})`,
  );

  const darkOpacity     = useTransform(pSlow, STOPS, [0.42, 0.30, 0.32, 0.40, 0.48, 0.42, 0.58]);
  const hazeOpacity     = useTransform(pSlow, STOPS, [0.18, 0.22, 0.26, 0.32, 0.36, 0.38, 0.30]);
  const hazeY           = useTransform(pSlow, [0, 1], [0, -77]);
  const glowOpacity     = useTransform(pSlow, STOPS, [0.08, 0.22, 0.32, 0.20, 0.14, 0.18, 0.10]);
  const glowScale       = useTransform(pSlow, STOPS, [1.00, 1.08, 1.15, 1.08, 1.05, 1.10, 1.02]);
  const vignetteOpacity = useTransform(pSlow, STOPS, [0.62, 0.62, 0.70, 0.78, 0.86, 0.80, 1.00]);

  const particleY       = useTransform(pSlow, [0, 1], [0, -110]);
  const particleOpacity = useTransform(pSlow, STOPS, [0.95, 0.86, 0.66, 0.50, 0.42, 0.56, 0.38]);

  /* ---------- Per-chapter SCENES — crossfade between cinematic environments ---------- */
  const peak = (i: number): number[] =>
    STOPS.map((_, j) => (i === j ? 0.9 : Math.abs(i - j) === 1 ? 0.18 : 0));

  const scene0 = useTransform(pSlow, STOPS, peak(0)); // Origin     — obsidian + ember
  const scene1 = useTransform(pSlow, STOPS, peak(1)); // Discovery  — graphite + cyan lattice
  const scene2 = useTransform(pSlow, STOPS, peak(2)); // Engineering — electric conductive blue
  const scene3 = useTransform(pSlow, STOPS, peak(3)); // Prototype  — warm steel / industrial amber
  const scene4 = useTransform(pSlow, STOPS, peak(4)); // Scale      — cobalt + amber infrastructure
  const scene5 = useTransform(pSlow, STOPS, peak(5)); // Deployment — emerald / climate teal
  const scene6 = useTransform(pSlow, STOPS, peak(6)); // Future     — luminous pearl indigo

  const auroraX = useTransform(pSlow, [0, 1], ["18%", "82%"]);
  const auroraY = useTransform(pSlow, [0, 1], ["32%", "68%"]);
  const auroraOpacity = useTransform(pSlow, STOPS, [0.10, 0.22, 0.32, 0.20, 0.18, 0.26, 0.14]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Environmental video base — drifts as a cinematic camera */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale, y: translateY, rotate, opacity: videoOpacity, filter: videoFilter }}
      >
        <video
          ref={videoRef}
          src={atmosphereVideo}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 mix-blend-color bg-[linear-gradient(135deg,oklch(0.12_0.02_240)_0%,oklch(0.15_0.04_220)_55%,oklch(0.13_0.03_255)_100%)] opacity-50" />
        <div className="absolute inset-0 mix-blend-multiply bg-[#0a0d14]/65" />
      </motion.div>

      {/* Section-reactive darkening */}
      <motion.div className="absolute inset-0 bg-[#03050a]" style={{ opacity: darkOpacity }} />

      {/* Atmospheric haze — slow drifting fog */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: hazeOpacity, y: hazeY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,oklch(0.30_0.06_240/0.42),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,oklch(0.26_0.05_230/0.32),transparent_65%)]" />
      </motion.div>

      {/* ===== 7 cinematic scene overlays — crossfade per chapter ===== */}

      {/* 01 Origin — abstract particles, atmospheric darkness, emerging energy */}
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_at_50%_60%,oklch(0.20_0.04_260/0.95),transparent_72%)]"
        style={{ opacity: scene0 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(circle_at_50%_70%,oklch(0.40_0.08_30/0.18),transparent_55%)]"
        style={{ opacity: scene0 }}
      />

      {/* 02 Discovery — graphene lattice, molecular emergence */}
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_35%_55%,oklch(0.42_0.12_210/0.55),transparent_65%)]"
        style={{ opacity: scene1 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-overlay bg-[linear-gradient(140deg,transparent_0%,oklch(0.30_0.10_220/0.35)_50%,transparent_100%)]"
        style={{ opacity: scene1 }}
      />

      {/* 03 Engineering — conductive pathways, electric precision */}
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_55%_50%,oklch(0.58_0.20_220/0.70),oklch(0.32_0.14_230/0.30)_45%,transparent_75%)]"
        style={{ opacity: scene2 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-overlay bg-[linear-gradient(90deg,transparent_0%,oklch(0.50_0.18_215/0.25)_50%,transparent_100%)]"
        style={{ opacity: scene2 }}
      />

      {/* 04 Prototype — warm steel + industrial amber, applied machinery */}
      <motion.div
        className="absolute inset-0 mix-blend-overlay bg-[radial-gradient(ellipse_at_60%_55%,oklch(0.38_0.08_55/0.55),transparent_68%)]"
        style={{ opacity: scene3 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(200deg,oklch(0.28_0.05_40/0.55),oklch(0.18_0.03_240/0.4)_65%,transparent_100%)]"
        style={{ opacity: scene3 }}
      />

      {/* 05 Scale — cobalt infrastructure + amber energy networks */}
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(180deg,oklch(0.18_0.10_255/0.85),oklch(0.12_0.06_245/0.55)_70%,transparent_100%)]"
        style={{ opacity: scene4 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_80%_70%,oklch(0.50_0.12_60/0.30),transparent_55%)]"
        style={{ opacity: scene4 }}
      />

      {/* 06 Deployment — emerald climate-tech, verdant intelligent infrastructure */}
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_45%_55%,oklch(0.48_0.14_165/0.55),transparent_72%)]"
        style={{ opacity: scene5 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(160deg,oklch(0.22_0.08_180/0.55),transparent_70%)]"
        style={{ opacity: scene5 }}
      />

      {/* 07 Future — luminous pearl indigo, calm cinematic stillness */}
      <motion.div
        className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,oklch(0.08_0.03_260/0.9),#02030a_88%)]"
        style={{ opacity: scene6 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_50%_45%,oklch(0.55_0.10_270/0.30),transparent_65%)]"
        style={{ opacity: scene6 }}
      />

      {/* Aurora glow — sweeps across the chapter timeline */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform pointer-events-none"
        style={{ opacity: auroraOpacity }}
      >
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[120px] bg-[radial-gradient(circle,oklch(0.6_0.18_215/0.5),transparent_70%)]"
          style={{ left: auroraX, top: auroraY, x: "-50%", y: "-50%" }}
        />
      </motion.div>

      {/* Conductive cyan breathing glow — peaks through Engineering */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform"
        style={{ opacity: glowOpacity, scale: glowScale }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.55_0.16_220/0.45),transparent_60%)]" />
      </motion.div>

      {/* Molecular particle drift — dense in Origin/Discovery, sparse in Future */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: particleY, opacity: particleOpacity }}
      >
        {particles.map((pt) => (
          <span
            key={pt.seed}
            className="absolute rounded-full bg-[oklch(0.85_0.05_220)]"
            style={{
              left: `${pt.left}%`,
              top: `${pt.top}%`,
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              opacity: 0.22,
              filter: "blur(1.6px)",
              boxShadow: "0 0 4px oklch(0.7 0.08 220 / 0.24)",
              animation: `atmosDrift ${pt.dur}s ease-in-out ${pt.delay}s infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      {/* Cinematic vignette */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#02030a_100%)]"
        style={{ opacity: vignetteOpacity }}
      />

      {/* Letterbox gradients */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02030a]/95 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#02030a]/95 to-transparent" />

      {/* Procedural grain */}
      <div
        className="absolute inset-0 opacity-[0.034] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0%   { transform: translate3d(0, 0, 1px); opacity: 0.15; }
          50%  { transform: translate3d(4px, -8px, 1px); opacity: 0.28; }
          100% { transform: translate3d(-3px, -14px, 1px); opacity: 0.19; }
        }
      `}</style>
    </div>
  );
}
