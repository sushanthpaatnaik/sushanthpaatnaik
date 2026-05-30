import { useEffect, useState } from "react";
import { motion, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

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

function chapterOpacity(phase: MotionValue<number>, idx: number, span = 0.85) {
  return useTransform(phase, (p) => {
    const d = Math.abs(p - idx);
    if (d >= span) return 0;
    const t = 1 - d / span;
    return t * t * (3 - 2 * t);
  });
}

function ChapterLayer({
  phase,
  idx,
  span = 0.85,
  children,
}: {
  phase: MotionValue<number>;
  idx: number;
  span?: number;
  children: React.ReactNode;
}) {
  const opacity = chapterOpacity(phase, idx, span);
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
      className="absolute inset-x-0 bottom-[-12%] h-[62%] w-full opacity-[0.7]"
      viewBox="0 0 100 60"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <radialGradient id="planet-glow" cx="50%" cy="100%" r="82%">
          <stop offset="0%" stopColor="oklch(0.54 0.05 232 / 0.18)" />
          <stop offset="48%" stopColor="oklch(0.34 0.04 232 / 0.09)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Thin atmospheric halo hugging the limb — volumetric diffusion */}
        <radialGradient id="planet-halo" cx="50%" cy="93%" r="60%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="62%" stopColor="oklch(0.72 0.045 232 / 0.10)" />
          <stop offset="78%" stopColor="oklch(0.62 0.04 232 / 0.05)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="planet-limb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.84 0.035 232 / 0.24)" />
          <stop offset="60%" stopColor="oklch(0.50 0.04 232 / 0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        {/* Edge fade so the limb dissolves into atmosphere at screen edges
            instead of reading as a graphic overlay crossing the viewport. */}
        <linearGradient id="planet-limb-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="18%" stopColor="white" stopOpacity="0.55" />
          <stop offset="50%" stopColor="white" stopOpacity="1" />
          <stop offset="82%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="planet-limb-mask">
          <rect x="0" y="0" width="100" height="60" fill="url(#planet-limb-fade)" />
        </mask>
      </defs>
      {/* Volumetric atmospheric diffusion above the limb */}
      <ellipse cx="50" cy="80" rx="82" ry="48" fill="url(#planet-glow)" />
      {/* Thin atmospheric halo — soft volumetric breath kissing the horizon */}
      <ellipse cx="50" cy="56" rx="64" ry="14" fill="url(#planet-halo)" />
      {/* The limb itself — hairline arc, softened and edge-faded */}
      <g mask="url(#planet-limb-mask)">
        <path
          d="M -10 56 Q 50 6 110 56"
          fill="none"
          stroke="url(#planet-limb)"
          strokeWidth="0.12"
        />
        <path
          d="M -10 56 Q 50 10 110 56"
          fill="none"
          stroke="oklch(0.96 0.01 232 / 0.05)"
          strokeWidth="0.04"
        />
      </g>
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
  const reduce = useReducedMotion();
  const isMobile = useMobile();
  return (
    <>
      <EngineeringGrid cell={72} color="oklch(0.74 0.02 232 / 0.040)" />
      <MeasurementRail side="right" />

      {/* Warm amber floor wash — reflects the building's practical interior lights */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(180deg, transparent 52%, oklch(0.42 0.05 50 / 0.038) 82%, transparent)",
        }}
      />

      {/* Faint drifting haze — ultra-slow lateral atmospheric mass, barely visible */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 38% at 38% 62%, oklch(0.12 0.010 232 / 0.10), transparent 68%)",
          filter: "blur(32px)",
        }}
        animate={reduce ? undefined : { opacity: [0.40, 0.82, 0.40] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Slow interior light flicker — simulates the building's fluorescent/LED
          array seen through the glass facade. Opacity-only: GPU-composited. */}
      <motion.div
        className="absolute mix-blend-screen"
        style={{
          right: "8%",
          top: "22%",
          width: "44%",
          height: "42%",
          background:
            "radial-gradient(ellipse 80% 70% at 60% 45%, oklch(0.72 0.008 215 / 0.06), transparent 72%)",
          willChange: "opacity",
        }}
        animate={reduce ? undefined : {
          opacity: [0.55, 0.78, 0.60, 0.88, 0.55],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Restrained cool steel-blue highlight — upper-left architectural plane */}
      <motion.div
        className="absolute mix-blend-screen"
        style={{
          left: 0,
          top: 0,
          width: "40%",
          height: "38%",
          background:
            "radial-gradient(ellipse 70% 60% at 28% 32%, oklch(0.55 0.015 220 / 0.05), transparent 78%)",
          willChange: "opacity",
        }}
        animate={reduce ? undefined : { opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      />

      {/* Cinematic dust — 4 ultra-slow motes in the forecourt/entrance zone */}
      {!reduce && !isMobile &&
        [
          { x: "34%", y: "58%", d: 44, delay: 0  },
          { x: "52%", y: "48%", d: 50, delay: 14 },
          { x: "44%", y: "66%", d: 42, delay: 27 },
          { x: "60%", y: "54%", d: 48, delay: 8  },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: "1px",
              height: "1px",
              background: "oklch(0.78 0.006 220)",
            }}
            animate={{
              opacity: [0, 0.22, 0.08, 0.18, 0],
              y: [0, -10, -22, -36, -50],
              x: [0, 3, -2, 4, 0],
            }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
    </>
  );
}

function RecognitionAtmosphere() {
  return (
    <>
      {/* Deep institutional vignette — amplifies the void around the trophy zone */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 40% at 50% 58%, transparent 0%, oklch(0.008 0.002 252 / 0.58) 92%)",
        }}
      />
      {/* Hairline column markers — near-invisible guide lines aligning to spotlight beams */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: [
            "linear-gradient(90deg, transparent 29.6%, oklch(0.72 0.010 220 / 0.18) 30%, transparent 30.4%)",
            "linear-gradient(90deg, transparent 49.6%, oklch(0.72 0.010 220 / 0.22) 50%, transparent 50.4%)",
            "linear-gradient(90deg, transparent 69.6%, oklch(0.72 0.010 220 / 0.18) 70%, transparent 70.4%)",
          ].join(", "),
          maskImage:
            "linear-gradient(180deg, transparent 8%, #000 22%, #000 74%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 8%, #000 22%, #000 74%, transparent 92%)",
        }}
      />
      {/* Cool platinum micro-grain — ultra-low amplitude archival texture */}
      <div
        className="absolute inset-0 opacity-[0.038] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.60  0 0 0 0 0.66  0 0 0 0 0.78  0 0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\")",
        }}
      />
    </>
  );
}

function EcosystemAtmosphere() {
  const reduce = useReducedMotion();
  const isMobile = useMobile();
  return (
    <>
      {/* Atmospheric glow — shifted right of center so the left typography column stays darker */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 58% 50% at 65% 52%, oklch(0.28 0.018 232 / 0.07), transparent 72%), radial-gradient(ellipse 36% 56% at 80% 36%, oklch(0.22 0.012 240 / 0.05), transparent 68%)",
        }}
        animate={reduce ? undefined : { opacity: [0.68, 1, 0.68] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Volumetric haze drift — ultra-slow rightward atmospheric mass */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 34% at 70% 56%, oklch(0.18 0.014 236 / 0.06), transparent 70%)",
          filter: "blur(42px)",
        }}
        animate={reduce ? undefined : { opacity: [0.44, 1, 0.44] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />

      {/* Cinematic dust — 5 ultra-slow motes biased toward the right glow zone */}
      {!reduce && !isMobile &&
        [
          { x: "63%", y: "46%", d: 36, delay: 0 },
          { x: "76%", y: "60%", d: 42, delay: 10 },
          { x: "56%", y: "64%", d: 40, delay: 19 },
          { x: "84%", y: "40%", d: 46, delay: 5 },
          { x: "70%", y: "54%", d: 38, delay: 15 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: "1px",
              height: "1px",
              background: "oklch(0.66 0.008 232)",
              filter: "blur(0.4px)",
            }}
            animate={{
              opacity: [0, 0.26, 0.09, 0.20, 0],
              y: [0, -12, -26, -42, -58],
              x: [0, 4, -2, 5, 1],
            }}
            transition={{
              duration: p.d,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
    </>
  );
}

function FutureAtmosphere() {
  return (
    <>
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
      <ChapterLayer phase={phase} idx={6} span={1.3}>
        <FutureAtmosphere />
      </ChapterLayer>
    </div>
  );
}
