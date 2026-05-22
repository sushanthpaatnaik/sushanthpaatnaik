import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import atmosphereVideo from "@/assets/atmosphere.mp4";

const STOPS = [0, 1, 2, 3, 4, 5, 6].map((i) => i / 6);

// Tighter spread => only the active chapter dominates, neighbours fade out fast.
function useSceneOpacity(phase: MotionValue<number>, center: number, spread = 0.62) {
  return useTransform(phase, (value) => {
    const d = Math.abs(value - center) / spread;
    if (d >= 1) return 0;
    // smoothstep for cinematic crossfade
    const t = 1 - d;
    return t * t * (3 - 2 * t);
  });
}

export default function AtmosphereLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);

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
  const progress = useSpring(scrollYProgress, { stiffness: 26, damping: 42, mass: 1.1 });
  const progressSlow = useSpring(scrollYProgress, { stiffness: 14, damping: 38, mass: 1.8 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncDuration = () => {
      durationRef.current = Number.isFinite(video.duration) ? video.duration : 0;
      if (durationRef.current > 0 && video.currentTime === 0) {
        video.currentTime = durationRef.current * 0.02;
      }
    };

    video.muted = true;
    video.loop = false;
    video.pause();
    video.addEventListener("loadedmetadata", syncDuration);
    syncDuration();

    return () => video.removeEventListener("loadedmetadata", syncDuration);
  }, []);

  useMotionValueEvent(progress, "change", (value) => {
    const video = videoRef.current;
    const duration = durationRef.current || video?.duration || 0;
    if (!video || !duration) return;
    const targetTime = duration * (0.04 + value * 0.92);
    if (Math.abs(video.currentTime - targetTime) > 0.033) {
      video.currentTime = targetTime;
    }
  });

  const chapterPhase = useTransform(progressSlow, [0, 1], [0, 6]);

  const scene0 = useSceneOpacity(chapterPhase, 0);
  const scene1 = useSceneOpacity(chapterPhase, 1);
  const scene2 = useSceneOpacity(chapterPhase, 2);
  const scene3 = useSceneOpacity(chapterPhase, 3);
  const scene4 = useSceneOpacity(chapterPhase, 4);
  const scene5 = useSceneOpacity(chapterPhase, 5);
  const scene6 = useSceneOpacity(chapterPhase, 6);

  // Video: strongest mid-journey (Engineering→Scale), quiet at Origin/Future
  const videoScale = useTransform(progress, STOPS, [1.28, 1.18, 1.08, 1.12, 1.18, 1.24, 1.34]);
  const videoX = useTransform(progress, STOPS, [0, -22, 18, -14, 22, -16, 0]);
  const videoY = useTransform(progress, STOPS, [0, -38, -16, -46, -28, -58, -78]);
  const videoRotate = useTransform(progress, STOPS, [-0.6, 0.24, -0.22, 0.18, -0.26, 0.2, 0]);
  const videoBlur = useTransform(progress, STOPS, [6, 2.4, 0.4, 0.6, 1.2, 2.4, 5.5]);
  const videoBrightness = useTransform(progress, STOPS, [0.22, 0.46, 0.7, 0.78, 0.62, 0.5, 0.28]);
  const videoContrast = useTransform(progress, STOPS, [0.96, 1.16, 1.32, 1.24, 1.22, 1.06, 0.98]);
  const videoSaturate = useTransform(progress, STOPS, [0.2, 0.7, 0.95, 0.9, 0.78, 0.66, 0.32]);
  const videoHue = useTransform(progress, STOPS, [-20, 10, 30, -15, 0, 40, -10]);
  const videoOpacity = useTransform(progress, STOPS, [0.22, 0.58, 0.78, 0.84, 0.72, 0.56, 0.3]);
  const videoFilter = useMotionTemplate`blur(${videoBlur}px) brightness(${videoBrightness}) contrast(${videoContrast}) saturate(${videoSaturate}) hue-rotate(${videoHue}deg)`;

  // Global darkness pulses: deep at Origin/Future, breathing open mid-journey
  const globalDarkness = useTransform(progressSlow, STOPS, [0.82, 0.62, 0.42, 0.36, 0.46, 0.56, 0.78]);
  const vignetteOpacity = useTransform(progressSlow, STOPS, [1, 0.88, 0.7, 0.68, 0.76, 0.84, 0.98]);

  const hazeOpacity = useTransform(progressSlow, STOPS, [0.32, 0.42, 0.24, 0.16, 0.34, 0.46, 0.22]);
  const hazeY = useTransform(progressSlow, [0, 1], [0, -160]);
  const hazeScale = useTransform(progressSlow, STOPS, [1.04, 1.18, 1.12, 1.04, 1.12, 1.22, 1.06]);

  const particleY = useTransform(progressSlow, [0, 1], [0, -260]);
  const particleOpacity = useTransform(progressSlow, STOPS, [0.92, 0.74, 0.52, 0.36, 0.28, 0.2, 0.06]);
  const particleScale = useTransform(progressSlow, STOPS, [1, 0.92, 0.84, 0.78, 0.74, 0.7, 0.6]);

  // Per-chapter signature overlays — each uses distinctly different texture & hue
  const sceneLayers = [
    // 01 ORIGIN — deep void, conceptual ember
    {
      key: "origin-void",
      opacity: scene0,
      blendMode: "normal" as const,
      background:
        "radial-gradient(ellipse at 50% 60%, oklch(0.12 0.03 270 / 0.6), oklch(0.04 0.01 260 / 0.95) 75%)",
    },
    {
      key: "origin-ember",
      opacity: scene0,
      blendMode: "screen" as const,
      background:
        "radial-gradient(circle at 50% 72%, oklch(0.58 0.18 32 / 0.32), transparent 42%)",
    },
    // 02 DISCOVERY — cyan molecular field + lattice grid
    {
      key: "discovery-field",
      opacity: scene1,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 36% 50%, oklch(0.62 0.18 210 / 0.78), oklch(0.32 0.12 220 / 0.36) 46%, transparent 72%)",
    },
    {
      key: "discovery-lattice",
      opacity: scene1,
      blendMode: "overlay" as const,
      background:
        "repeating-linear-gradient(60deg, oklch(0.7 0.16 200 / 0.18) 0 1px, transparent 1px 28px), repeating-linear-gradient(-60deg, oklch(0.7 0.16 200 / 0.18) 0 1px, transparent 1px 28px), repeating-linear-gradient(0deg, oklch(0.7 0.16 200 / 0.14) 0 1px, transparent 1px 28px)",
    },
    // 03 ENGINEERING — conductive pathways, structured grid
    {
      key: "engineering-current",
      opacity: scene2,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 58% 46%, oklch(0.68 0.2 220 / 0.86), oklch(0.38 0.14 232 / 0.4) 40%, transparent 76%)",
    },
    {
      key: "engineering-paths",
      opacity: scene2,
      blendMode: "overlay" as const,
      background:
        "repeating-linear-gradient(90deg, transparent 0 64px, oklch(0.7 0.18 215 / 0.22) 64px 65px), repeating-linear-gradient(0deg, transparent 0 64px, oklch(0.7 0.18 215 / 0.16) 64px 65px)",
    },
    {
      key: "engineering-sweep",
      opacity: scene2,
      blendMode: "screen" as const,
      background:
        "linear-gradient(110deg, transparent 30%, oklch(0.74 0.2 218 / 0.28) 50%, transparent 70%)",
    },
    // 04 PROTOTYPE — industrial amber/steel manufacturing
    {
      key: "prototype-forge",
      opacity: scene3,
      blendMode: "overlay" as const,
      background:
        "radial-gradient(ellipse at 64% 56%, oklch(0.58 0.16 52 / 0.78), oklch(0.34 0.12 38 / 0.4) 40%, transparent 74%)",
    },
    {
      key: "prototype-steel",
      opacity: scene3,
      blendMode: "soft-light" as const,
      background:
        "linear-gradient(200deg, oklch(0.32 0.06 44 / 0.72), oklch(0.16 0.04 240 / 0.6) 64%, transparent 100%)",
    },
    {
      key: "prototype-spark",
      opacity: scene3,
      blendMode: "screen" as const,
      background:
        "radial-gradient(circle at 30% 38%, oklch(0.72 0.2 60 / 0.18), transparent 28%), radial-gradient(circle at 78% 70%, oklch(0.68 0.18 48 / 0.16), transparent 30%)",
    },
    // 05 SCALE — industrial infrastructure, energy networks
    {
      key: "scale-grid",
      opacity: scene4,
      blendMode: "soft-light" as const,
      background:
        "linear-gradient(180deg, oklch(0.2 0.08 250 / 0.95), oklch(0.12 0.05 244 / 0.62) 70%, transparent 100%)",
    },
    {
      key: "scale-energy",
      opacity: scene4,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 82% 70%, oklch(0.64 0.16 78 / 0.46), transparent 50%), radial-gradient(ellipse at 18% 30%, oklch(0.58 0.14 250 / 0.36), transparent 52%)",
    },
    {
      key: "scale-horizon",
      opacity: scene4,
      blendMode: "overlay" as const,
      background:
        "linear-gradient(180deg, transparent 0%, transparent 58%, oklch(0.5 0.14 240 / 0.34) 62%, transparent 64%, transparent 100%)",
    },
    // 06 IMPACT — climate-tech, biosphere green/teal diffusion
    {
      key: "impact-biosphere",
      opacity: scene5,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 46% 54%, oklch(0.6 0.18 162 / 0.74), oklch(0.34 0.12 178 / 0.36) 42%, transparent 76%)",
    },
    {
      key: "impact-haze",
      opacity: scene5,
      blendMode: "soft-light" as const,
      background:
        "linear-gradient(160deg, oklch(0.28 0.1 168 / 0.68), transparent 68%)",
    },
    {
      key: "impact-bloom",
      opacity: scene5,
      blendMode: "screen" as const,
      background:
        "radial-gradient(circle at 50% 90%, oklch(0.7 0.18 155 / 0.22), transparent 50%)",
    },
    // 07 FUTURE — calm cinematic stillness
    {
      key: "future-void",
      opacity: scene6,
      blendMode: "normal" as const,
      background:
        "radial-gradient(ellipse at center, oklch(0.08 0.025 268 / 0.96), oklch(0.02 0.008 258 / 1) 88%)",
    },
    {
      key: "future-pearl",
      opacity: scene6,
      blendMode: "screen" as const,
      background:
        "radial-gradient(ellipse at 50% 42%, oklch(0.7 0.06 278 / 0.3), transparent 60%)",
    },
  ];

  // Per-scene moving light sweep position & color
  const sweepX = useTransform(progressSlow, STOPS, ["50%", "32%", "62%", "68%", "20%", "78%", "50%"]);
  const sweepY = useTransform(progressSlow, STOPS, ["70%", "52%", "44%", "58%", "48%", "60%", "50%"]);
  const sweepHue = useTransform(progressSlow, STOPS, [32, 210, 218, 52, 240, 162, 270]);
  const sweepOpacity = useTransform(progressSlow, STOPS, [0.1, 0.32, 0.42, 0.36, 0.3, 0.34, 0.12]);
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

      {sceneLayers.map((layer) => (
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
