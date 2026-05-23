import { useEffect, useMemo, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

interface ParticleFieldProps {
  /** Spring-smoothed scroll progress, 0 → 1. */
  progress: MotionValue<number>;
  /** Chapter phase (0 → stages-1) — drives per-chapter hue / saturation. */
  phase?: MotionValue<number>;
  /** Opacity envelope sampled across the scroll, one stop per chapter. */
  opacityStops?: number[];
  /** Number of particles on desktop. Mobile uses ~half. */
  count?: number;
  /** Color tokens (oklch) for the alternating particle palette. */
  primaryColor?: string;
  accentColor?: string;
}

const PHASE_INDICES = [0, 1, 2, 3, 4, 5, 6];
const HUE_BY_PHASE = [0, 28, -18, -8, 38, -22, 22];
const SAT_BY_PHASE = [1.0, 0.78, 1.05, 1.0, 0.6, 0.95, 1.05];

/**
 * Drifting particle layer used inside the cinematic background.
 * Mobile renders a lighter, slower field to preserve battery and smoothness.
 *
 * When `phase` is provided, the field shifts hue & saturation per chapter —
 * cool cobalt in the opening, warmer amber through founder & recognition,
 * deep indigo in the ecosystem, dawn gold at the close — so the atmosphere
 * evolves alongside the background plates.
 */
export default function ParticleField({
  progress,
  phase,
  opacityStops = [0.36, 0.31, 0.28, 0.24, 0.21, 0.17, 0.10],
  count = 13,
  primaryColor = "oklch(0.81 0.1 235)",
  accentColor = "oklch(0.63 0.1 75)",
}: ParticleFieldProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const effectiveCount = isMobile ? Math.max(8, Math.round(count * 0.55)) : count;

  const particles = useMemo(
    () =>
      Array.from({ length: effectiveCount }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        blur: 1 + Math.random() * 2.5,
        delay: Math.random() * 14,
        duration: (isMobile ? 36 : 24) + Math.random() * (isMobile ? 28 : 30),
        accent: index % 3 === 0,
      })),
    [effectiveCount, isMobile],
  );

  const stops = useMemo(
    () => Array.from({ length: opacityStops.length }, (_, i) => i / (opacityStops.length - 1)),
    [opacityStops.length],
  );

  const y = useTransform(progress, [0, 1], [0, -260]);
  const opacity = useTransform(progress, stops, opacityStops);

  // Always create both motion values to keep hook order stable.
  const phaseHue = useTransform(phase ?? progress, PHASE_INDICES, HUE_BY_PHASE);
  const phaseSat = useTransform(phase ?? progress, PHASE_INDICES, SAT_BY_PHASE);
  const filter = useTransform(
    [phaseHue, phaseSat] as unknown as MotionValue<number>[],
    ([h, s]) => `hue-rotate(${h as number}deg) saturate(${s as number})`,
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ y, opacity, filter: phase ? filter : undefined }}
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
