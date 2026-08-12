import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { N_CHAPTERS, CHAPTER_BANDS } from "./chapterBands";

/**
 * ChapterAtmosphere
 * -----------------
 * A second, image-free atmospheric layer that overlays the photographic
 * `AtmosphereLayer` and gives each homepage chapter its own *environmental
 * identity*. Nothing here is an illustration or stock visual — every layer
 * is SVG, gradient, or CSS, kept at ultra-low opacity so it is **felt**
 * rather than seen.
 *
 *   0 Origin                 → cool ink wash + faint volumetric beam
 *                              (absorbs the former standalone Founder layer)
 *   1 Material               → graphene hex micro-grid + cool diffusion
 *   2 Industrial             → engineering grid + measurement marks
 *   3 Recognition & Ecosystem → archival spotlights + infrastructure haze
 *                              (the two former layers, composited)
 *   4 Future                 → horizon haze + atmospheric lift (the closing
 *                              plate is a daylit city, not deep space)
 *
 * Cross-fades are strict (only neighbouring chapters overlap) and driven by
 * the shared `useChapterPhase` motion value, so the rail, photographic
 * scene and atmospheric identity all move as one synchronised system.
 */

/* ─── Atmosphere scroll-progress opacity ────────────────────────────────
   Uses the same CHAPTER_BANDS as content — identical boundaries.
   OV_A_IN  = 0.14 → atmosphere enters 2 pp before content (OV=0.12 + 2 pp).
   OV_A_OUT = 0.10 → atmosphere holds 2 pp after content (OV=0.12 - 2 pp).
   This guarantees: background is always at least as visible as content.
   eooA = easeOutExpo — same curve as content, matching cubic-bezier(0.16,1,0.3,1).
   ─────────────────────────────────────────────────────────────────────── */
const OV_A_IN  = 0.065;  // wider entry  — atmosphere appears before content
const OV_A_OUT = 0.049;  // narrower exit — atmosphere holds after content fades
const c01A = (v: number) => Math.max(0, Math.min(1, v));
// easeOutQuint — same curve as content, perfectly synchronised
const eooA = (t: number) => 1 - Math.pow(1 - c01A(t), 5);

function atmoOp(sp: number, n: number): number {
  const [bIn, bOut] = CHAPTER_BANDS[n];
  const W       = bOut - bIn;
  const fadeIn  = OV_A_IN  * W;
  const fadeOut = OV_A_OUT * W;
  const fiStart = bIn - fadeIn;   // enters before content
  const foStart = bOut - fadeOut; // exits after content

  if (n === 0) {
    if (sp <= foStart) return 1;
    if (sp <= bOut)    return eooA(1 - (sp - foStart) / fadeOut);
    return 0;
  }
  if (n === N_CHAPTERS - 1) {
    if (sp <= fiStart) return 0;
    if (sp <= bIn)     return eooA((sp - fiStart) / fadeIn);
    return 1;
  }
  if (sp <= fiStart) return 0;
  if (sp <= bIn)     return eooA((sp - fiStart) / fadeIn);
  if (sp <= foStart) return 1;
  if (sp <= bOut)    return eooA(1 - (sp - foStart) / fadeOut);
  return 0;
}

function ChapterLayer({
  scrollYProgress,
  idx,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  idx: number;
  children: React.ReactNode;
}) {
  const opacity = useTransform(scrollYProgress, (sp) => atmoOp(sp, idx));
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

// Origin now spans the planetary opening *and* the founder's lab, so its
// atmosphere carries both: the cool cosmic wash for the first beat and the
// twin volumetric beams that used to be the standalone Founder layer. Both
// are near-invisible washes, so compositing them costs nothing and avoids a
// hard swap mid-chapter.
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
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 40% 80% at 22% 50%, oklch(0.52 0.04 232 / 0.05), transparent 70%), radial-gradient(ellipse 30% 70% at 78% 50%, oklch(0.50 0.05 50 / 0.04), transparent 75%)",
        }}
      />
    </>
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
  return (
    <>
      <EngineeringGrid cell={72} color="oklch(0.78 0.02 232 / 0.060)" />
      <MeasurementRail side="right" />

      {/* Warm amber floor wash */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(180deg, transparent 44%, oklch(0.48 0.06 50 / 0.065) 76%, oklch(0.42 0.05 50 / 0.040) 100%)",
        }}
      />

      {/* Mid-level brightness lift */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 54% 48%, oklch(0.62 0.018 220 / 0.055), transparent 72%)",
        }}
      />

      {/* Faint atmospheric haze — opacity-only, blur on static element (cached rasterization) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 38% at 38% 62%, oklch(0.18 0.010 232 / 0.08), transparent 68%)",
          filter: "blur(32px)",
        }}
      />

      {/* Interior light — opacity-only animation */}
      <motion.div
        className="absolute mix-blend-screen"
        style={{
          right: "8%",
          top: "22%",
          width: "44%",
          height: "42%",
          background:
            "radial-gradient(ellipse 80% 70% at 60% 45%, oklch(0.76 0.010 215 / 0.09), transparent 72%)",
        }}
        animate={reduce ? undefined : { opacity: [0.60, 0.86, 0.68, 0.94, 0.60] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Steel-blue architectural highlight — opacity-only */}
      <motion.div
        className="absolute mix-blend-screen"
        style={{
          left: 0,
          top: 0,
          width: "40%",
          height: "38%",
          background:
            "radial-gradient(ellipse 70% 60% at 28% 32%, oklch(0.60 0.018 220 / 0.072), transparent 78%)",
        }}
        animate={reduce ? undefined : { opacity: [0.50, 0.82, 0.50] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// Recognition & Ecosystem share one layer now: the archival spotlight
// treatment, then the ecosystem's atmospheric haze composited beneath it.
function RecognitionEcosystemAtmosphere() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Ecosystem haze — sits under the archival treatment */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 58% 50% at 65% 52%, oklch(0.28 0.018 232 / 0.07), transparent 72%), radial-gradient(ellipse 36% 56% at 80% 36%, oklch(0.22 0.012 240 / 0.05), transparent 68%)",
        }}
        animate={reduce ? undefined : { opacity: [0.68, 1, 0.68] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 34% at 70% 56%, oklch(0.18 0.014 236 / 0.06), transparent 70%)",
          filter: "blur(42px)",
        }}
      />
      {/* Subtle dark surround — luxury edge, eased to avoid crushed shadows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 50% 54%, transparent 0%, oklch(0.008 0.002 252 / 0.20) 100%)",
        }}
      />

      {/* Soft warm glow at center — improves trophy/subject visibility */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 44% 38% at 50% 52%, oklch(0.52 0.018 45 / 0.045), transparent 70%)",
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

function FutureAtmosphere() {
  const reduce = useReducedMotion();
  // The closing plate used to be deep space, so this layer was a star field,
  // Milky Way band, planetary limb, orbital rings and nebula. The film now
  // closes on a daylit industrial city seen through glass, where all of that
  // read as white speckle scattered over the buildings. Replaced with haze
  // and horizon light that belong to the shot: an atmospheric lift toward
  // the horizon line and a soft vignette that seats the silhouette.
  return (
    <>
      {/* Upper atmospheric gradient — depth without darkening the skyline */}
      <div
        className="absolute inset-x-0 top-0 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.06 0.014 250 / 0.42) 0%, oklch(0.06 0.012 246 / 0.16) 60%, transparent 100%)",
        }}
      />

      {/* Horizon haze — the distance glow the city sits in */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(180deg, transparent 26%, oklch(0.62 0.030 232 / 0.09) 44%, oklch(0.58 0.026 228 / 0.05) 56%, transparent 72%)",
          filter: "blur(28px)",
        }}
      />

      {/* Slow atmospheric breath — opacity only, GPU-composited */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 46%, oklch(0.60 0.028 226 / 0.06), transparent 74%)",
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Perimeter seat — keeps the silhouette anchored in frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 88% 82% at 50% 44%, transparent 46%, oklch(0.02 0.008 258 / 0.30) 100%)",
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
  const { scrollYProgress } = useScroll();
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] overflow-clip"
      style={{ contain: "layout paint style" }}
    >
      <ContinuityFloor />
      <ChapterLayer scrollYProgress={scrollYProgress} idx={0}>
        <OriginAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={1}>
        <MaterialAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={2}>
        <IndustrialAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={3}>
        <RecognitionEcosystemAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={4}>
        <FutureAtmosphere />
      </ChapterLayer>
    </div>
  );
}
