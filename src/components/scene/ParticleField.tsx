import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

interface ParticleFieldProps {
  /** Spring-smoothed scroll progress, 0 → 1. */
  progress: MotionValue<number>;
  /** Opacity envelope sampled across the scroll, one stop per chapter. */
  opacityStops?: number[];
  /** Number of particles to render. */
  count?: number;
  /** Color tokens (oklch) for the alternating particle palette. */
  primaryColor?: string;
  accentColor?: string;
}

/**
 * Drifting particle layer used inside the cinematic background.
 * Extracted from AtmosphereLayer so any scene can reuse it.
 */
export default function ParticleField({
  progress,
  opacityStops = [0.55, 0.46, 0.4, 0.34, 0.3, 0.24, 0.16],
  count = 20,
  primaryColor = "oklch(0.81 0.1 235)",
  accentColor = "oklch(0.63 0.1 75)",
}: ParticleFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        blur: 1 + Math.random() * 2.5,
        delay: Math.random() * 14,
        duration: 24 + Math.random() * 30,
        accent: index % 3 === 0,
      })),
    [count],
  );

  const stops = useMemo(
    () => Array.from({ length: opacityStops.length }, (_, i) => i / (opacityStops.length - 1)),
    [opacityStops.length],
  );

  const y = useTransform(progress, [0, 1], [0, -260]);
  const opacity = useTransform(progress, stops, opacityStops);

  return (
    <motion.div className="absolute inset-0 will-change-transform" style={{ y, opacity }}>
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
            background: particle.accent ? accentColor : primaryColor,
            boxShadow: particle.accent
              ? "0 0 10px oklch(0.63 0.1 75 / 0.35)"
              : "0 0 10px oklch(0.71 0.13 240 / 0.32)",
            animation: `atmosDrift ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes atmosDrift {
          0% { transform: translate3d(0, 0, 1px); opacity: 0.16; }
          50% { transform: translate3d(8px, -14px, 1px); opacity: 0.36; }
          100% { transform: translate3d(-6px, -22px, 1px); opacity: 0.2; }
        }
      `}</style>
    </motion.div>
  );
}
