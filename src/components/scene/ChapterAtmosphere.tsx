import { motion, useTransform, type MotionValue } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

/**
 * ChapterAtmosphere
 * -----------------
 * A second, image-free atmospheric layer that overlays the photographic
 * `AtmosphereLayer` and gives each homepage chapter its own *environmental
 * identity*. Nothing here is an illustration or stock visual — every layer
 * is SVG, gradient, or CSS, kept at ultra-low opacity so it is **felt**
 * rather than seen.
 *
 *   0 Origin       → neural particles + soft cool ink wash
 *   1 Founder      → faint volumetric beam + grain
 *   2 Material     → graphene hex micro-grid + cool diffusion
 *   3 Industrial   → engineering grid + measurement marks
 *   4 Recognition  → warm archival sepia + faint paper grain
 *   5 Ecosystem    → infrastructure grid + connecting orbital lines
 *   6 Future       → planetary curvature arc + orbital rings + far glow
 *
 * Cross-fades are strict (only neighbouring chapters overlap) and driven by
 * the shared `useChapterPhase` motion value, so the rail, photographic
 * scene and atmospheric identity all move as one synchronised system.
 */

function chapterOpacity(phase: MotionValue<number>, idx: number) {
  // Triangular window around `idx`; 0 outside [idx-1, idx+1].
  const span = 0.85;
  return useTransform(phase, (p) => {
    const d = Math.abs(p - idx);
    if (d >= span) return 0;
    const t = 1 - d / span;
    // smootherstep
    return t * t * (3 - 2 * t);
  });
}

function ChapterLayer({
  phase,
  idx,
  children,
}: {
  phase: MotionValue<number>;
  idx: number;
  children: React.ReactNode;
}) {
  const opacity = chapterOpacity(phase, idx);
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="absolute inset-0 will-change-[opacity]"
    >
      {children}
    </motion.div>
  );
}

/* ─────────── Reusable atmospheric primitives (no images) ─────────── */

function OrbitalRings({
  cx = "50%",
  cy = "118%",
  radii = [70, 86, 104, 124],
  stroke = "oklch(0.78 0.02 232 / 0.10)",
}: {
  cx?: string;
  cy?: string;
  radii?: number[];
  stroke?: string;
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="orbital-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="55%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="orbital-mask">
          <rect width="100" height="100" fill="url(#orbital-fade)" />
        </mask>
      </defs>
      <g mask="url(#orbital-mask)" fill="none" stroke={stroke} strokeWidth="0.08">
        {radii.map((r) => (
          <ellipse key={r} cx={cx} cy={cy} rx={r} ry={r * 0.46} />
        ))}
      </g>
    </svg>
  );
}

function PlanetaryArc() {
  return (
    <svg
      className="absolute inset-x-0 bottom-[-12%] h-[62%] w-full opacity-90"
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <radialGradient id="planet-glow" cx="50%" cy="100%" r="78%">
          <stop offset="0%" stopColor="oklch(0.52 0.05 232 / 0.18)" />
          <stop offset="55%" stopColor="oklch(0.32 0.04 232 / 0.10)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="planet-limb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.82 0.04 232 / 0.40)" />
          <stop offset="60%" stopColor="oklch(0.50 0.04 232 / 0.10)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* atmospheric glow above the limb */}
      <ellipse cx="50" cy="80" rx="78" ry="46" fill="url(#planet-glow)" />
      {/* the limb itself — a hairline arc */}
      <path
        d="M -10 56 Q 50 6 110 56"
        fill="none"
        stroke="url(#planet-limb)"
        strokeWidth="0.18"
      />
      <path
        d="M -10 56 Q 50 10 110 56"
        fill="none"
        stroke="oklch(0.96 0.01 232 / 0.10)"
        strokeWidth="0.06"
      />
    </svg>
  );
}

function EngineeringGrid({
  cell = 64,
  color = "oklch(0.78 0.02 232 / 0.045)",
}: {
  cell?: number;
  color?: string;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: `${cell}px ${cell}px`,
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 85%)",
      }}
    />
  );
}

function HexLattice({ opacity = 0.05 }: { opacity?: number }) {
  // Pure CSS hex micro-grid via SVG data URI — single tiny tile, very low alpha.
  const svg =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='32' viewBox='0 0 28 32'><g fill='none' stroke='%237fb3d5' stroke-width='0.6' stroke-opacity='0.55'><path d='M14 1 L27 8 L27 24 L14 31 L1 24 L1 8 Z'/></g></svg>";
  return (
    <div
      className="absolute inset-0 mix-blend-screen"
      style={{
        opacity,
        backgroundImage: `url("${svg}")`,
        backgroundSize: "28px 32px",
        maskImage:
          "radial-gradient(ellipse 60% 55% at 50% 50%, #000 25%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 60% 55% at 50% 50%, #000 25%, transparent 80%)",
      }}
    />
  );
}

function MeasurementRail({ side = "right" as "left" | "right" }) {
  const isRight = side === "right";
  return (
    <svg
      className="absolute inset-y-0 h-full opacity-40"
      style={{ [isRight ? "right" : "left"]: 0, width: 36 } as React.CSSProperties}
      viewBox="0 0 36 1000"
      preserveAspectRatio="none"
    >
      <g
        stroke="oklch(0.74 0.015 232 / 0.18)"
        strokeWidth="0.6"
        fill="none"
      >
        <line x1={isRight ? 24 : 12} y1={0} x2={isRight ? 24 : 12} y2={1000} />
        {Array.from({ length: 40 }).map((_, i) => (
          <line
            key={i}
            x1={isRight ? 20 : 8}
            x2={isRight ? 30 : 18}
            y1={i * 25}
            y2={i * 25}
            strokeOpacity={i % 4 === 0 ? 0.35 : 0.12}
          />
        ))}
      </g>
    </svg>
  );
}

function ConnectingLines() {
  // Faint infrastructure constellation — 5 anchor points with thin links.
  const pts = [
    { x: 18, y: 32 },
    { x: 42, y: 22 },
    { x: 64, y: 38 },
    { x: 76, y: 64 },
    { x: 30, y: 70 },
  ];
  const links: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 3],
    [1, 4],
  ];
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <g
        stroke="oklch(0.72 0.025 232 / 0.22)"
        strokeWidth="0.12"
        fill="none"
      >
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={pts[a].x}
            y1={pts[a].y}
            x2={pts[b].x}
            y2={pts[b].y}
          />
        ))}
      </g>
      <g fill="oklch(0.86 0.02 232 / 0.55)">
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="0.35" />
        ))}
      </g>
    </svg>
  );
}

/* ──────────────────────── Chapter compositions ──────────────────────── */

function OriginAtmosphere() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, oklch(0.06 0.012 232 / 0.30), transparent 80%)",
        }}
      />
      <HexLattice opacity={0.03} />
    </>
  );
}

function FounderAtmosphere() {
  return (
    <div
      className="absolute inset-0 mix-blend-screen"
      style={{
        background:
          "radial-gradient(ellipse 40% 80% at 22% 50%, oklch(0.52 0.04 232 / 0.05), transparent 70%), radial-gradient(ellipse 30% 70% at 78% 50%, oklch(0.50 0.05 50 / 0.04), transparent 75%)",
      }}
    />
  );
}

function MaterialAtmosphere() {
  return (
    <>
      <HexLattice opacity={0.08} />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.55 0.05 200 / 0.05), transparent 70%)",
        }}
      />
    </>
  );
}

function IndustrialAtmosphere() {
  return (
    <>
      <EngineeringGrid cell={72} color="oklch(0.74 0.02 232 / 0.055)" />
      <MeasurementRail side="right" />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, oklch(0.42 0.05 50 / 0.045) 70%, transparent)",
        }}
      />
    </>
  );
}

function RecognitionAtmosphere() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.42 0.04 60 / 0.10), transparent 78%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.30  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\")",
        }}
      />
    </>
  );
}

function EcosystemAtmosphere() {
  return (
    <>
      <EngineeringGrid cell={96} color="oklch(0.72 0.02 232 / 0.04)" />
      <ConnectingLines />
    </>
  );
}

function FutureAtmosphere() {
  return (
    <>
      <PlanetaryArc />
      <OrbitalRings />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 100%, oklch(0.45 0.04 232 / 0.10), transparent 70%)",
        }}
      />
    </>
  );
}

/* ─────────────────────────── Root layer ─────────────────────────── */

/**
 * Persistent continuity layer — always at full opacity beneath every
 * chapter identity. Provides the ambient floor that prevents transitions
 * from collapsing to pure black between chapters, and adds a soft bottom
 * atmospheric band so sections never feel visually dead at the fold.
 */
function ContinuityFloor() {
  return (
    <>
      {/* Faint cool wash, off-axis */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 30%, oklch(0.40 0.025 232 / 0.035), transparent 70%), radial-gradient(ellipse 60% 45% at 80% 70%, oklch(0.38 0.025 232 / 0.028), transparent 75%)",
        }}
      />
      {/* Bottom atmospheric band — eliminates lower-screen energy collapse */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.06 0.012 232 / 0.18) 60%, oklch(0.05 0.010 232 / 0.10) 100%)",
        }}
      />
      {/* Faint horizon line — anchors the lower frame, near-invisible */}
      <div
        className="absolute inset-x-0 bottom-[18%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.02 232 / 0.08) 50%, transparent)",
        }}
      />
    </>
  );
}

export default function ChapterAtmosphere() {
  const phase = useChapterPhase(HOME_CHAPTER_IDS);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
      style={{ contain: "strict" }}
    >
      <ContinuityFloor />
      <ChapterLayer phase={phase} idx={0}>
        <OriginAtmosphere />
      </ChapterLayer>
      <ChapterLayer phase={phase} idx={1}>
        <FounderAtmosphere />
      </ChapterLayer>
      <ChapterLayer phase={phase} idx={2}>
        <MaterialAtmosphere />
      </ChapterLayer>
      <ChapterLayer phase={phase} idx={3}>
        <IndustrialAtmosphere />
      </ChapterLayer>
      <ChapterLayer phase={phase} idx={4}>
        <RecognitionAtmosphere />
      </ChapterLayer>
      <ChapterLayer phase={phase} idx={5}>
        <EcosystemAtmosphere />
      </ChapterLayer>
      <ChapterLayer phase={phase} idx={6}>
        <FutureAtmosphere />
      </ChapterLayer>
    </div>
  );
}
