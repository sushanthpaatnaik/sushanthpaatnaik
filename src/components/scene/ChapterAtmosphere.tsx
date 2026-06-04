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

/* ─── Atmosphere scroll-progress opacity ────────────────────────────────
   Uses the same CHAPTER_BANDS as content — identical boundaries.
   OV_A_IN  = 0.14 → atmosphere enters 2 pp before content (OV=0.12 + 2 pp).
   OV_A_OUT = 0.10 → atmosphere holds 2 pp after content (OV=0.12 - 2 pp).
   This guarantees: background is always at least as visible as content.
   eooA = easeOutExpo — same curve as content, matching cubic-bezier(0.16,1,0.3,1).
   ─────────────────────────────────────────────────────────────────────── */
const OV_A_IN  = 0.10;  // wider entry  — atmosphere appears before content
const OV_A_OUT = 0.07;  // narrower exit — atmosphere holds after content fades
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

function RecognitionAtmosphere() {
  return (
    <>
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

function EcosystemAtmosphere() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Atmospheric glow — opacity-only, GPU-composited */}
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 58% 50% at 65% 52%, oklch(0.28 0.018 232 / 0.07), transparent 72%), radial-gradient(ellipse 36% 56% at 80% 36%, oklch(0.22 0.012 240 / 0.05), transparent 68%)",
        }}
        animate={reduce ? undefined : { opacity: [0.68, 1, 0.68] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Volumetric haze — blur on static element, no animation (cached rasterization) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 34% at 70% 56%, oklch(0.18 0.014 236 / 0.06), transparent 70%)",
          filter: "blur(42px)",
        }}
      />
    </>
  );
}

// Pre-computed star field — deterministic positions, 4 luminosity classes + navigational stars.
// Module-level constant so it is never re-allocated on re-renders.
// Density: ~120 faint + 20 mid + 12 bright + 4 super + 2 navigational.
const STAR_FIELD_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='700'>" +
  "<g fill='white'>" +
  // Faint background stars — dense field, 0.6r
  "<g fill-opacity='0.38'>" +
  "<circle cx='22' cy='15' r='0.6'/><circle cx='163' cy='9' r='0.6'/><circle cx='318' cy='22' r='0.6'/><circle cx='461' cy='14' r='0.6'/><circle cx='614' cy='81' r='0.6'/><circle cx='751' cy='62' r='0.6'/><circle cx='918' cy='74' r='0.6'/>" +
  "<circle cx='78' cy='138' r='0.6'/><circle cx='228' cy='132' r='0.6'/><circle cx='384' cy='109' r='0.6'/><circle cx='524' cy='176' r='0.6'/><circle cx='672' cy='162' r='0.6'/><circle cx='814' cy='145' r='0.6'/><circle cx='962' cy='112' r='0.6'/>" +
  "<circle cx='58' cy='218' r='0.6'/><circle cx='209' cy='236' r='0.6'/><circle cx='364' cy='245' r='0.6'/><circle cx='518' cy='221' r='0.6'/><circle cx='669' cy='290' r='0.6'/><circle cx='808' cy='268' r='0.6'/><circle cx='944' cy='194' r='0.6'/>" +
  "<circle cx='42' cy='312' r='0.6'/><circle cx='194' cy='328' r='0.6'/><circle cx='349' cy='338' r='0.6'/><circle cx='502' cy='352' r='0.6'/><circle cx='654' cy='318' r='0.6'/><circle cx='794' cy='342' r='0.6'/><circle cx='878' cy='298' r='0.6'/>" +
  "<circle cx='65' cy='418' r='0.6'/><circle cx='216' cy='434' r='0.6'/><circle cx='370' cy='443' r='0.6'/><circle cx='526' cy='412' r='0.6'/><circle cx='679' cy='483' r='0.6'/><circle cx='828' cy='464' r='0.6'/><circle cx='934' cy='436' r='0.6'/>" +
  "<circle cx='34' cy='518' r='0.6'/><circle cx='186' cy='536' r='0.6'/><circle cx='342' cy='548' r='0.6'/><circle cx='497' cy='522' r='0.6'/><circle cx='648' cy='594' r='0.6'/><circle cx='798' cy='572' r='0.6'/><circle cx='912' cy='548' r='0.6'/>" +
  "<circle cx='52' cy='628' r='0.6'/><circle cx='205' cy='644' r='0.6'/><circle cx='361' cy='654' r='0.6'/><circle cx='517' cy='634' r='0.6'/><circle cx='671' cy='648' r='0.6'/><circle cx='824' cy='656' r='0.6'/><circle cx='968' cy='632' r='0.6'/>" +
  // Extra faint scatter — fills gaps for deep-space density
  "<circle cx='130' cy='52' r='0.5'/><circle cx='255' cy='68' r='0.5'/><circle cx='400' cy='46' r='0.5'/><circle cx='542' cy='58' r='0.5'/><circle cx='840' cy='28' r='0.5'/><circle cx='980' cy='42' r='0.5'/>" +
  "<circle cx='106' cy='172' r='0.5'/><circle cx='296' cy='158' r='0.5'/><circle cx='456' cy='148' r='0.5'/><circle cx='608' cy='122' r='0.5'/><circle cx='762' cy='106' r='0.5'/><circle cx='888' cy='136' r='0.5'/>" +
  "<circle cx='148' cy='282' r='0.5'/><circle cx='308' cy='274' r='0.5'/><circle cx='468' cy='306' r='0.5'/><circle cx='626' cy='378' r='0.5'/><circle cx='786' cy='394' r='0.5'/><circle cx='922' cy='366' r='0.5'/>" +
  "<circle cx='172' cy='394' r='0.5'/><circle cx='332' cy='456' r='0.5'/><circle cx='484' cy='468' r='0.5'/><circle cx='642' cy='436' r='0.5'/><circle cx='854' cy='514' r='0.5'/><circle cx='976' cy='494' r='0.5'/>" +
  "<circle cx='118' cy='484' r='0.5'/><circle cx='272' cy='498' r='0.5'/><circle cx='428' cy='514' r='0.5'/><circle cx='588' cy='526' r='0.5'/><circle cx='738' cy='496' r='0.5'/><circle cx='896' cy='508' r='0.5'/>" +
  "</g>" +
  // Mid-brightness stars
  "<g fill-opacity='0.70'>" +
  "<circle cx='89' cy='47' r='1'/><circle cx='688' cy='35' r='1'/><circle cx='149' cy='94' r='1'/><circle cx='738' cy='188' r='1'/><circle cx='438' cy='284' r='1'/><circle cx='744' cy='232' r='1'/><circle cx='116' cy='348' r='1'/><circle cx='578' cy='387' r='1'/><circle cx='447' cy='478' r='1'/><circle cx='574' cy='558' r='1'/><circle cx='108' cy='554' r='1'/><circle cx='283' cy='678' r='1'/><circle cx='749' cy='686' r='1'/><circle cx='958' cy='158' r='1'/><circle cx='952' cy='276' r='1'/>" +
  "<circle cx='336' cy='72' r='1'/><circle cx='536' cy='128' r='1'/><circle cx='836' cy='92' r='1'/><circle cx='248' cy='462' r='1'/><circle cx='862' cy='582' r='1'/>" +
  "</g>" +
  // Bright stars
  "<g fill-opacity='0.88'>" +
  "<circle cx='301' cy='131' r='1.5'/><circle cx='489' cy='184' r='1.5'/><circle cx='91' cy='278' r='1.5'/><circle cx='627' cy='93' r='1.5'/><circle cx='198' cy='341' r='1.5'/><circle cx='566' cy='267' r='1.5'/><circle cx='755' cy='211' r='1.5'/><circle cx='423' cy='482' r='1.5'/>" +
  "<circle cx='182' cy='56' r='1.5'/><circle cx='872' cy='144' r='1.5'/><circle cx='692' cy='454' r='1.5'/><circle cx='344' cy='596' r='1.5'/>" +
  "</g>" +
  // Super-bright stars
  "<g fill-opacity='0.96'>" +
  "<circle cx='312' cy='244' r='2'/><circle cx='664' cy='358' r='2'/><circle cx='138' cy='178' r='2'/><circle cx='826' cy='316' r='2'/>" +
  "</g>" +
  // Navigational / focal stars — largest, with subtle diffraction feel
  "<g fill-opacity='1'>" +
  "<circle cx='468' cy='112' r='2.4'/><circle cx='722' cy='486' r='2.2'/>" +
  "</g>" +
  "</g></svg>";

function FutureAtmosphere() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Deep space ceiling — cool blue-black grounds the upper frame */}
      <div
        className="absolute inset-x-0 top-0 h-[68%]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.012 262 / 0.55) 0%, oklch(0.04 0.010 260 / 0.22) 55%, transparent 100%)",
        }}
      />

      {/* CSS star field — pre-computed SVG data URI, covers full frame */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage: `url("${STAR_FIELD_SVG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          opacity: 1.0,
        }}
      />

      {/* Milky Way band — faint tilted diffusion haze crossing the field */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(148deg, transparent 18%, oklch(0.58 0.020 260 / 0.070) 34%, oklch(0.70 0.024 248 / 0.110) 50%, oklch(0.58 0.020 260 / 0.070) 66%, transparent 82%)",
          filter: "blur(24px)",
        }}
      />

      {/* Planetary arc — horizon curvature at the bottom of the frame */}
      <PlanetaryArc />

      {/* Orbital rings — concentric ellipses rising from the limb */}
      <OrbitalRings
        cx="50%"
        cy="112%"
        radii={[68, 84, 102, 122, 144]}
        stroke="oklch(0.80 0.024 232 / 0.12)"
      />

      {/* Earth rim lighting — stronger atmospheric glow for depth */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 88% 52% at 50% 100%, oklch(0.50 0.048 232 / 0.20), transparent 65%)",
        }}
      />
      {/* Secondary warm inner-limb highlight */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 50% 22% at 50% 100%, oklch(0.68 0.032 210 / 0.12), transparent 70%)",
        }}
      />

      {/* Nebula depth pair — blur on outer static div (cached), opacity-only on inner */}
      {!reduce && (
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{ filter: "blur(32px)" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 40% 28% at 74% 20%, oklch(0.44 0.030 280 / 0.062), transparent 80%), radial-gradient(ellipse 32% 24% at 20% 34%, oklch(0.38 0.024 210 / 0.052), transparent 80%)",
            }}
            animate={{ opacity: [0.40, 1, 0.40] }}
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Soft far-depth vignette — increases perceived planetary scale */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 30%, transparent 42%, oklch(0.02 0.008 260 / 0.28) 100%)",
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
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
      style={{ contain: "strict" }}
    >
      <ContinuityFloor />
      <ChapterLayer scrollYProgress={scrollYProgress} idx={0}>
        <OriginAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={1}>
        <FounderAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={2}>
        <MaterialAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={3}>
        <IndustrialAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={4}>
        <RecognitionAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={5}>
        <EcosystemAtmosphere />
      </ChapterLayer>
      <ChapterLayer scrollYProgress={scrollYProgress} idx={6}>
        <FutureAtmosphere />
      </ChapterLayer>
    </div>
  );
}
