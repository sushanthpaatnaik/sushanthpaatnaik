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

function useSceneOpacity(phase: MotionValue<number>, center: number, spread = 1.08) {
  return useTransform(phase, (value) => Math.max(0, 1 - Math.abs(value - center) / spread));
}

export default function AtmosphereLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        blur: 1 + Math.random() * 3,
        delay: Math.random() * 16,
        duration: 24 + Math.random() * 32,
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

  const scene0 = useSceneOpacity(chapterPhase, 0, 1.0);
  const scene1 = useSceneOpacity(chapterPhase, 1, 1.0);
  const scene2 = useSceneOpacity(chapterPhase, 2, 1.0);
  const scene3 = useSceneOpacity(chapterPhase, 3, 1.0);
  const scene4 = useSceneOpacity(chapterPhase, 4, 1.0);
  const scene5 = useSceneOpacity(chapterPhase, 5, 1.0);
  const scene6 = useSceneOpacity(chapterPhase, 6, 1.0);

  const videoScale = useTransform(progress, STOPS, [1.18, 1.12, 1.06, 1.1, 1.14, 1.18, 1.22]);
  const videoX = useTransform(progress, STOPS, [0, -18, 12, -10, 18, -12, 0]);
  const videoY = useTransform(progress, STOPS, [0, -30, -12, -38, -20, -48, -66]);
  const videoRotate = useTransform(progress, STOPS, [-0.5, 0.2, -0.18, 0.14, -0.22, 0.18, 0]);
  const videoBlur = useTransform(progress, STOPS, [2.4, 1.7, 0.8, 1.1, 1.4, 1.9, 2.8]);
  const videoBrightness = useTransform(progress, STOPS, [0.32, 0.42, 0.56, 0.66, 0.58, 0.62, 0.38]);
  const videoContrast = useTransform(progress, STOPS, [1.04, 1.12, 1.2, 1.12, 1.18, 1.08, 1.02]);
  const videoSaturate = useTransform(progress, STOPS, [0.42, 0.6, 0.76, 0.72, 0.68, 0.74, 0.48]);
  const videoOpacity = useTransform(progress, STOPS, [0.42, 0.56, 0.66, 0.74, 0.7, 0.64, 0.46]);
  const videoFilter = useMotionTemplate`blur(${videoBlur}px) brightness(${videoBrightness}) contrast(${videoContrast}) saturate(${videoSaturate})`;

  const globalDarkness = useTransform(progressSlow, STOPS, [0.7, 0.64, 0.56, 0.48, 0.4, 0.34, 0.52]);
  const vignetteOpacity = useTransform(progressSlow, STOPS, [0.98, 0.92, 0.82, 0.78, 0.72, 0.76, 0.94]);
  const hazeOpacity = useTransform(progressSlow, STOPS, [0.18, 0.26, 0.18, 0.14, 0.22, 0.28, 0.16]);
  const hazeY = useTransform(progressSlow, [0, 1], [0, -88]);
  const hazeScale = useTransform(progressSlow, STOPS, [1.08, 1.14, 1.1, 1.06, 1.1, 1.16, 1.08]);
  const glowOpacity = useTransform(progressSlow, STOPS, [0.08, 0.22, 0.34, 0.26, 0.18, 0.24, 0.1]);
  const glowScale = useTransform(progressSlow, STOPS, [1, 1.06, 1.14, 1.08, 1.04, 1.1, 1.02]);
  const particleY = useTransform(progressSlow, [0, 1], [0, -140]);
  const particleOpacity = useTransform(progressSlow, STOPS, [0.78, 0.68, 0.44, 0.34, 0.24, 0.18, 0.08]);

  const lightSweepX = useTransform(progressSlow, [0, 1], ["18%", "78%"]);
  const lightSweepY = useTransform(progressSlow, [0, 1], ["58%", "38%"]);
  const lightSweepOpacity = useTransform(progressSlow, STOPS, [0.08, 0.18, 0.26, 0.22, 0.2, 0.24, 0.1]);

  const sceneLayers = [
    {
      key: "origin-core",
      opacity: scene0,
      blendMode: "soft-light" as const,
      background: "radial-gradient(ellipse at 50% 62%, oklch(0.22 0.04 260 / 0.95), transparent 70%)",
    },
    {
      key: "origin-ember",
      opacity: scene0,
      blendMode: "screen" as const,
      background: "radial-gradient(circle at 50% 70%, oklch(0.52 0.12 38 / 0.2), transparent 48%)",
    },
    {
      key: "discovery-field",
      opacity: scene1,
      blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 34% 52%, oklch(0.5 0.12 215 / 0.58), transparent 64%)",
    },
    {
      key: "discovery-lattice",
      opacity: scene1,
      blendMode: "overlay" as const,
      background: "linear-gradient(135deg, transparent 0%, oklch(0.34 0.08 220 / 0.4) 46%, transparent 100%)",
    },
    {
      key: "engineering-current",
      opacity: scene2,
      blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 58% 48%, oklch(0.62 0.18 220 / 0.76), oklch(0.36 0.12 230 / 0.3) 42%, transparent 76%)",
    },
    {
      key: "engineering-lines",
      opacity: scene2,
      blendMode: "overlay" as const,
      background: "linear-gradient(90deg, transparent 0%, oklch(0.56 0.16 220 / 0.24) 50%, transparent 100%)",
    },
    {
      key: "prototype-amber",
      opacity: scene3,
      blendMode: "overlay" as const,
      background: "radial-gradient(ellipse at 62% 54%, oklch(0.44 0.1 54 / 0.58), transparent 68%)",
    },
    {
      key: "prototype-steel",
      opacity: scene3,
      blendMode: "soft-light" as const,
      background: "linear-gradient(200deg, oklch(0.28 0.05 42 / 0.54), oklch(0.16 0.03 240 / 0.42) 68%, transparent 100%)",
    },
    {
      key: "scale-grid",
      opacity: scene4,
      blendMode: "soft-light" as const,
      background: "linear-gradient(180deg, oklch(0.18 0.08 250 / 0.9), oklch(0.12 0.05 244 / 0.58) 72%, transparent 100%)",
    },
    {
      key: "scale-energy",
      opacity: scene4,
      blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 80% 68%, oklch(0.56 0.12 68 / 0.3), transparent 54%)",
    },
    {
      key: "impact-biosphere",
      opacity: scene5,
      blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 44% 54%, oklch(0.52 0.14 165 / 0.56), transparent 72%)",
    },
    {
      key: "impact-haze",
      opacity: scene5,
      blendMode: "soft-light" as const,
      background: "linear-gradient(160deg, oklch(0.22 0.08 180 / 0.58), transparent 70%)",
    },
    {
      key: "future-void",
      opacity: scene6,
      blendMode: "multiply" as const,
      background: "radial-gradient(ellipse at center, oklch(0.08 0.03 260 / 0.94), oklch(0.03 0.01 255 / 1) 86%)",
    },
    {
      key: "future-pearl",
      opacity: scene6,
      blendMode: "screen" as const,
      background: "radial-gradient(ellipse at 50% 44%, oklch(0.62 0.08 275 / 0.24), transparent 66%)",
    },
  ];

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

      <motion.div className="absolute inset-0" style={{ opacity: globalDarkness, background: "oklch(0.04 0.01 255)" }} />

      <motion.div className="absolute inset-0 will-change-transform" style={{ opacity: hazeOpacity, y: hazeY, scale: hazeScale }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 42%, oklch(0.28 0.05 235 / 0.34), transparent 60%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 74% 68%, oklch(0.22 0.05 205 / 0.26), transparent 64%)" }}
        />
      </motion.div>

      {sceneLayers.map((layer) => (
        <motion.div
          key={layer.key}
          className="absolute inset-0"
          style={{ opacity: layer.opacity, mixBlendMode: layer.blendMode, background: layer.background }}
        />
      ))}

      <motion.div className="absolute inset-0 will-change-transform" style={{ opacity: lightSweepOpacity }}>
        <motion.div
          className="absolute h-[80vw] w-[80vw] rounded-full blur-[140px]"
          style={{
            left: lightSweepX,
            top: lightSweepY,
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle, oklch(0.58 0.18 215 / 0.42), transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div className="absolute inset-0 will-change-transform" style={{ opacity: glowOpacity, scale: glowScale }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 56%, oklch(0.56 0.16 220 / 0.34), transparent 60%)" }}
        />
      </motion.div>

      <motion.div className="absolute inset-0 will-change-transform" style={{ y: particleY, opacity: particleOpacity }}>
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.24,
              filter: `blur(${particle.blur}px)`,
              background: "oklch(0.88 0.04 220)",
              boxShadow: "0 0 8px oklch(0.72 0.08 220 / 0.22)",
              animation: `atmosDrift ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ opacity: vignetteOpacity, background: "radial-gradient(ellipse at center, transparent 36%, oklch(0.02 0.01 255) 100%)" }}
      />

      <div
        className="absolute inset-x-0 top-0 h-80"
        style={{ background: "linear-gradient(to bottom, oklch(0.02 0.01 255 / 0.98), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-80"
        style={{ background: "linear-gradient(to top, oklch(0.02 0.01 255 / 0.98), transparent)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.72  0 0 0 0 0.76  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0% { transform: translate3d(0, 0, 1px); opacity: 0.12; }
          50% { transform: translate3d(6px, -10px, 1px); opacity: 0.28; }
          100% { transform: translate3d(-4px, -18px, 1px); opacity: 0.16; }
        }
      `}</style>
    </div>
  );
}