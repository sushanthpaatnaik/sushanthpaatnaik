import { useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";

import scene01 from "@/assets/scene-01-discover.jpg";
import scene02 from "@/assets/scene-02-ideate.jpg";
import scene03 from "@/assets/scene-03-invent.jpg";
import scene04 from "@/assets/scene-04-validate.jpg";
import scene05 from "@/assets/scene-05-protect.jpg";
import scene06 from "@/assets/scene-06-prototype.jpg";
import scene07 from "@/assets/scene-07-commercialize.jpg";
import scene08 from "@/assets/scene-08-scale.jpg";
import scene09 from "@/assets/scene-09-deployment.jpg";

// 9 cinematic stages mapped to the innovation lifecycle.
const SCENES = [
  { src: scene01, alt: "Discover — conceptual particles, idea formation" },
  { src: scene02, alt: "Ideate — graphene lattice, molecular exploration" },
  { src: scene03, alt: "Invent — conductive pathways, engineering precision" },
  { src: scene04, alt: "Validate — lab atmosphere, prototype validation" },
  { src: scene05, alt: "Protect — IP vault, secure system architecture" },
  { src: scene06, alt: "Prototype — advanced manufacturing, product emergence" },
  { src: scene07, alt: "Commercialize — industrial-scale infrastructure" },
  { src: scene08, alt: "Scale — global climate-tech deployment network" },
  { src: scene09, alt: "Deployment — visionary stillness, future resolution" },
];

const STAGES = SCENES.length;
const STOPS = Array.from({ length: STAGES }, (_, i) => i / (STAGES - 1));

function useSceneOpacity(phase: MotionValue<number>, center: number, spread = 1) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - center) / spread;
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * (3 - 2 * t);
  });
}

function useSceneScale(phase: MotionValue<number>, center: number) {
  return useTransform(phase, (v) => {
    const d = v - center;
    return 1.08 - d * 0.05;
  });
}

function useSceneBlur(phase: MotionValue<number>, center: number) {
  return useTransform(phase, (v) => {
    const d = Math.min(Math.abs(v - center), 1);
    return d * 8;
  });
}

function SceneLayer({
  src,
  alt,
  phase,
  index,
  parallax,
  isFirst,
}: {
  src: string;
  alt: string;
  phase: MotionValue<number>;
  index: number;
  parallax: MotionValue<number>;
  isFirst: boolean;
}) {
  const opacity = useSceneOpacity(phase, index);
  const scale = useSceneScale(phase, index);
  const blurPx = useSceneBlur(phase, index);
  const filter = useMotionTemplate`blur(${blurPx}px) brightness(0.7) contrast(1.08) saturate(1.05)`;
  const y = useTransform(parallax, (p) => p * (index % 2 === 0 ? 1 : -1) * 40);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ opacity }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        loading={isFirst ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover select-none"
        style={{ scale, filter, y }}
      />
    </motion.div>
  );
}

export default function AtmosphereLayer() {
  const { scrollYProgress } = useScroll();
  const progressSlow = useSpring(scrollYProgress, {
    stiffness: 22,
    damping: 38,
    mass: 1.4,
  });

  const phase = useTransform(progressSlow, [0, 1], [0, STAGES - 1]);
  const parallax = useTransform(progressSlow, [0, 1], [-1, 1]);

  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        blur: 1 + Math.random() * 2.5,
        delay: Math.random() * 14,
        duration: 24 + Math.random() * 30,
      })),
    [],
  );

  const particleY = useTransform(progressSlow, [0, 1], [0, -260]);
  const particleOpacity = useTransform(
    progressSlow,
    STOPS,
    [0.5, 0.46, 0.42, 0.38, 0.34, 0.3, 0.24, 0.18, 0.1],
  );

  // Darker bookends, slightly lighter mid-journey so imagery breathes.
  const overlayOpacity = useTransform(
    progressSlow,
    STOPS,
    [0.62, 0.5, 0.46, 0.5, 0.54, 0.48, 0.46, 0.5, 0.6],
  );

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-background">
      {SCENES.map((scene, index) => (
        <SceneLayer
          key={scene.src}
          src={scene.src}
          alt={scene.alt}
          phase={phase}
          index={index}
          parallax={parallax}
          isFirst={index === 0}
        />
      ))}

      {/* Cinematic dark overlay for text readability */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: overlayOpacity,
          background:
            "linear-gradient(180deg, oklch(0.04 0.01 258 / 0.6) 0%, oklch(0.04 0.01 258 / 0.4) 50%, oklch(0.04 0.01 258 / 0.7) 100%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, oklch(0.02 0.01 255 / 0.85) 100%)",
        }}
      />

      {/* Edge fades */}
      <div
        className="absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.02 0.01 255 / 0.92), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-64"
        style={{
          background:
            "linear-gradient(to top, oklch(0.02 0.01 255 / 0.92), transparent)",
        }}
      />

      {/* Drifting particles */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: particleY, opacity: particleOpacity }}
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
              opacity: 0.32,
              filter: `blur(${particle.blur}px)`,
              background: "oklch(0.92 0.04 220)",
              boxShadow: "0 0 10px oklch(0.74 0.08 220 / 0.35)",
              animation: `atmosDrift ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      {/* Subtle cyan glow for premium readability */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 55%, oklch(0.74 0.12 220 / 0.12), transparent 70%)",
        }}
      />


      <style>{`
        @keyframes atmosDrift {
          0% { transform: translate3d(0, 0, 1px); opacity: 0.16; }
          50% { transform: translate3d(8px, -14px, 1px); opacity: 0.36; }
          100% { transform: translate3d(-6px, -22px, 1px); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
