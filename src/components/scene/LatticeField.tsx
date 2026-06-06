import { motion } from "framer-motion";

/**
 * LatticeField — graphene-inspired hexagonal lattice rendered as an SVG.
 * Used as a restrained ambient overlay for the Innovations / R&D sections.
 *
 * The lattice is procedurally generated, sub-1% opacity vectors with a
 * very slow drift to suggest a live material substrate without competing
 * with foreground content.
 */
export default function LatticeField({
  className = "",
  density = 1,
  drift = true,
  intensity = 0.06,
}: {
  className?: string;
  density?: number;
  drift?: boolean;
  intensity?: number;
}) {
  const r = 22 / density; // hex radius
  const w = r * Math.sqrt(3);
  const h = r * 1.5;
  const cols = Math.ceil(1600 / w) + 2;
  const rows = Math.ceil(1000 / h) + 2;

  const points: { cx: number; cy: number }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0);
      const cy = row * h;
      points.push({ cx, cy });
    }
  }

  const hex = (cx: number, cy: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  };

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      initial={{ opacity: 0 }}
      animate={drift ? { opacity: [intensity * 0.6, intensity, intensity * 0.6] } : { opacity: intensity }}
      transition={drift ? { duration: 14, repeat: Infinity, ease: "easeInOut" } : { duration: 1.4 }}
    >
      <defs>
        <radialGradient id="lattice-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="lattice-mask">
          <rect width="1600" height="1000" fill="url(#lattice-fade)" />
        </mask>
      </defs>
      <g
        mask="url(#lattice-mask)"
        fill="none"
        stroke="oklch(0.78 0.04 232)"
        strokeWidth="0.5"
        strokeOpacity="0.6"
      >
        {points.map((p, i) => (
          <polygon key={i} points={hex(p.cx, p.cy)} />
        ))}
      </g>
      {/* Atom nodes — scattered bright vertices */}
      <g mask="url(#lattice-mask)" fill="oklch(0.82 0.05 232)">
        {points
          .filter((_, i) => i % 17 === 0)
          .map((p, i) => (
            <circle key={`n-${i}`} cx={p.cx} cy={p.cy} r="1.1" opacity="0.5" />
          ))}
      </g>
    </motion.svg>
  );
}
