import { Link } from "@tanstack/react-router";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { N_CHAPTERS, CHAPTER_BANDS } from "./chapterBands";

/* ──────────────────────────────────────────────────────────────────
   Homepage = single sticky cinematic stage.
   Seven chapters. One viewport. Scroll is the timeline.

   Each chapter occupies ~217 vh of scroll travel (Industrial: ~336 vh).
   OV=0.15 → 15 % fade window. Active hold: 70 % of band.
   Future Systems holds at full opacity to close the documentary.
   ────────────────────────────────────────────────────────────────── */

const TOTAL_VH = 1620; // ghost-track height; scrollable = 1520 vh

const gateways = [
  { to: "/about",        n: "I",   label: "About",        line: "Founder, philosophy, journey." },
  { to: "/innovations",  n: "II",  label: "Innovations",  line: "Graphene, materials, systems." },
  { to: "/ventures",     n: "III", label: "Ventures",     line: "Five operating companies. One stack." },
  { to: "/recognitions", n: "IV",  label: "Recognitions", line: "Six Presidential awards. TED. MIT TR." },
  { to: "/essays",       n: "V",   label: "Essays",       line: "Notes from the workshop." },
  { to: "/engage",       n: "VI",  label: "Engage",       line: "Partnerships, advisory, and origin archive." },
  { to: "/news",         n: "VII", label: "News",         line: "Editorial archive." },
] as const;

/* ──────────────────────────────────────────────────────────────────
   Cinematic content protection gradient
   Film-style scrim — no card, no box, no border.

   Left/Right: multi-stop linear dissolve from the text column edge
   toward the subject, peak rgba(0,0,0, strength), transparent by 82%.

   Center: radial headline shield + vertical body-copy lift so all
   three text sizes (h1/h2, body, mono) clear WCAG AA contrast.

   strength tuning:
     bright backgrounds (metallic, industrial)  → 0.78–0.84
     mid backgrounds (founder, ecosystem)       → 0.62–0.70
     dark backgrounds (origin, recognition,
                       future)                  → 0.52–0.58
   ────────────────────────────────────────────────────────────────── */
function ContentShield({
  align = "left" as "left" | "right" | "center",
  strength = 0.72,
}: {
  align?: "left" | "right" | "center";
  strength?: number;
}) {
  const s = strength;
  const o = (v: number) => (s * v).toFixed(2);
  let bg: string;

  if (align === "left") {
    bg = `linear-gradient(90deg,
      rgba(0,0,0,${o(1.00)})  0%,
      rgba(0,0,0,${o(0.97)})  8%,
      rgba(0,0,0,${o(0.88)}) 20%,
      rgba(0,0,0,${o(0.72)}) 34%,
      rgba(0,0,0,${o(0.50)}) 48%,
      rgba(0,0,0,${o(0.28)}) 60%,
      rgba(0,0,0,${o(0.10)}) 72%,
      transparent            82%)`;
  } else if (align === "right") {
    bg = `linear-gradient(270deg,
      rgba(0,0,0,${o(1.00)})  0%,
      rgba(0,0,0,${o(0.97)})  8%,
      rgba(0,0,0,${o(0.88)}) 20%,
      rgba(0,0,0,${o(0.72)}) 34%,
      rgba(0,0,0,${o(0.50)}) 48%,
      rgba(0,0,0,${o(0.28)}) 60%,
      rgba(0,0,0,${o(0.10)}) 72%,
      transparent            82%)`;
  } else {
    // Radial covers headline zone; vertical lift covers body-copy rows below.
    bg = [
      `radial-gradient(ellipse 78% 68% at 50% 46%,
        rgba(0,0,0,${o(0.82)})  0%,
        rgba(0,0,0,${o(0.62)}) 22%,
        rgba(0,0,0,${o(0.36)}) 50%,
        rgba(0,0,0,${o(0.10)}) 70%,
        transparent            82%)`,
      `linear-gradient(180deg,
        transparent            15%,
        rgba(0,0,0,${o(0.18)}) 45%,
        rgba(0,0,0,${o(0.34)}) 72%,
        rgba(0,0,0,${o(0.44)}) 100%)`,
    ].join(", ");
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: bg }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────────
   Scroll progress bar
   ────────────────────────────────────────────────────────────────── */
function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      className="fixed left-0 right-0 top-0 z-[55] h-px bg-foreground/[0.04]"
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: progress,
          willChange: "transform",
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.02 232 / 0.55) 35%, oklch(0.86 0.02 232 / 0.72) 65%, transparent)",
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 0 — Origin (id="spark")
   ────────────────────────────────────────────────────────────────── */
function OriginContent() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-5 sm:px-6 pointer-events-auto">
      {/* Origin: dark cosmic background — moderate center shield */}
      <ContentShield align="center" strength={0.56} />
      <div className="relative z-10 max-w-4xl text-center">
        {/* Eyebrow */}
        <div className="mb-10 md:mb-12 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-foreground/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground/80">
            Origin
          </span>
          <span className="h-px w-8 bg-foreground/20" />
        </div>

        {/* H1 */}
        <h1 className="font-display text-[clamp(2.2rem,7.8vw,6.5rem)] leading-[1.02] md:leading-[0.98] tracking-[-0.035em] md:tracking-[-0.04em] font-medium">
          <span className="block py-1 text-gradient">I build</span>
          <span className="block py-1 text-gradient">what does not</span>
          <span className="block py-1 text-foreground/95">yet exist.</span>
        </h1>

        {/* Subtitle */}
        <div className="mx-auto mt-14 md:mt-20 max-w-xl">
          <p className="font-display text-[14.5px] md:text-[16px] leading-[1.6] tracking-[-0.005em] text-foreground/80">
            Inventor and deep-tech founder.{" "}
            <br className="hidden md:inline" />
            Building from India — for the world.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/65">
            Six-time Presidential awardee · TED · MIT TR-35
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 text-[9.5px] font-extralight uppercase tracking-[0.5em] text-muted-foreground/65">
        <span className="blur-[0.3px]">Scroll</span>
        <span
          aria-hidden
          className="block h-16 w-px origin-top bg-gradient-to-b from-foreground/22 via-foreground/12 to-transparent"
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 1 — Founder (id="founder")
   ────────────────────────────────────────────────────────────────── */
function FounderContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 xl:pl-36 pointer-events-auto">
      {/* Founder: dark footage, text on right — right-side shield */}
      <ContentShield align="right" strength={0.68} />
      {/* Founder label top left */}
      <p className="pointer-events-none absolute top-10 left-[8%] z-10 font-mono text-[10px] uppercase tracking-[0.55em] text-muted-foreground/25 blur-[0.3px]">
        Founder
      </p>

      {/* 12-col grid, content in cols 7-12 */}
      <div className="relative mx-auto grid w-full max-w-6xl md:grid-cols-12">
        <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Founder · Voice
          </p>
          <blockquote className="font-display text-2xl leading-[1.19] tracking-[-0.025em] text-gradient md:text-3xl lg:text-[2.4rem] whitespace-pre-line">
            {"The future is not imagined.\nIt is engineered quietly."}
          </blockquote>
          <div className="mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45">
            <span className="h-px w-10 bg-gradient-to-r from-foreground/25 to-transparent" />
            <span>Sushanth Paatnaik</span>
          </div>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-foreground/70 hover:text-foreground transition-colors"
          >
            Read the journey →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 2 — Material Intelligence (id="carbon-intelligence")
   ────────────────────────────────────────────────────────────────── */
function MaterialContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20 pointer-events-auto">
      {/* Material: bright metallic footage — strongest shield, left column */}
      <ContentShield align="left" strength={0.82} />
      <div className="relative z-10 mr-auto text-left max-w-2xl">
        {/* Decorative line */}
        <div className="h-px w-20 md:w-24 mb-7 bg-gradient-to-r from-primary via-accent to-transparent" />
        {/* Eyebrow */}
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6">
          Material Intelligence
        </p>
        {/* H2 */}
        <h2 className="font-display text-[clamp(1.9rem,6.2vw,4.4rem)] leading-[1.04] tracking-[-0.025em] font-medium text-gradient mb-7 [text-wrap:balance]">
          Engineering intelligent matter.
        </h2>
        {/* Body */}
        <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md">
          Graphene, nano-materials, coatings, additives, composites. A single sheet of carbon, manufactured cleanly and at scale, is the most under-priced strategic asset on the table this decade.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 3 — Industrial Translation (id="industrial")
   ────────────────────────────────────────────────────────────────── */
function IndustrialContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20 pointer-events-auto">
      {/* Industrial: bright machinery footage, text on right — right-side shield */}
      <ContentShield align="right" strength={0.80} />
      <div className="relative z-10 ml-auto md:text-right max-w-2xl">
        {/* Decorative line */}
        <div className="h-px w-20 md:w-24 mb-7 ml-auto bg-gradient-to-l from-primary via-accent to-transparent" />
        {/* Eyebrow */}
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6">
          Industrial Translation
        </p>
        {/* H2 */}
        <h2 className="font-display text-[clamp(1.9rem,6.2vw,4.4rem)] leading-[1.04] tracking-[-0.025em] font-medium text-gradient mb-7 [text-wrap:balance]">
          One lattice. Many industries.
        </h2>
        {/* Body */}
        <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md ml-auto">
          Solar coatings, batteries that charge in minutes, polymer additives, climate infrastructure — each a downstream of the same material platform.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 4 — Recognition (id="recognition")
   ────────────────────────────────────────────────────────────────── */
function RecognitionContent() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-5 sm:px-6 lg:pl-32 xl:pl-36 pointer-events-auto">
      {/* Recognition: dark spotlight setting — moderate center shield */}
      <ContentShield align="center" strength={0.60} />
      {/* Soft radial gradient bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.18_0.012_232/0.10),transparent_72%)",
        }}
      />
      <div className="relative z-10 max-w-4xl text-center" style={{ transform: "translateX(-1vw)" }}>
        {/* Eyebrow */}
        <p className="text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-8">
          Recognition
        </p>
        {/* H2 */}
        <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em] text-gradient">
          Recognised early.<br className="hidden md:inline" /> Responsible forever.
        </h2>
        {/* Body */}
        <p className="mx-auto mt-10 max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
          Six Indian Presidential awards. NIF-India IGNITE. TED-India. MIT Technology Review. India Today. The record exists. The next prototype matters more.
        </p>
        {/* Link */}
        <Link
          to="/recognitions"
          className="mt-12 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-foreground/75 hover:text-foreground transition-colors"
        >
          Open the archive →
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 5 — Ecosystem (id="ecosystem")
   ────────────────────────────────────────────────────────────────── */
function EcosystemContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 xl:pl-36 overflow-y-auto pointer-events-auto">
      {/* Ecosystem: dark infrastructure footage, left-aligned content */}
      <ContentShield align="left" strength={0.66} />
      <div className="relative z-10 w-full max-w-6xl mt-7">
        {/* Eyebrow */}
        <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
          Ecosystem
        </p>
        {/* H2 */}
        <h2 className="font-display text-[clamp(2.2rem,7.5vw,4.75rem)] leading-[1] tracking-[-0.04em] text-gradient">
          Seven thresholds into the work.
        </h2>
        {/* Body */}
        <p className="mt-8 max-w-xl text-sm text-muted-foreground/85">
          The homepage is the opening sequence. The ecosystem lives behind these doors — each one its own cinematic world.
        </p>
        {/* Gateway list */}
        <div className="mt-12 md:mt-16 grid gap-x-10 gap-y-1 sm:grid-cols-2">
          {gateways.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="group block border-t border-foreground/[0.08] py-5 hover:border-foreground/30 transition-colors duration-500"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground/50 w-6">
                  {g.n}
                </span>
                <div className="flex-1">
                  <div className="font-display text-xl md:text-2xl tracking-[-0.015em] text-foreground/90 group-hover:text-gradient transition-colors duration-500">
                    {g.label}
                  </div>
                  <p className="text-[13px] text-muted-foreground/70">{g.line}</p>
                </div>
                <span className="text-foreground/40 group-hover:text-foreground/80 group-hover:translate-x-1 transition-all duration-500">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 6 — Future Systems (id="future")
   ────────────────────────────────────────────────────────────────── */
function FutureContent() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden pointer-events-auto">
      {/* Future: dark space, centered text — light center shield */}
      <ContentShield align="center" strength={0.54} />
      {/* Atmospheric volumetric glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[120%] h-[44%] mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, oklch(0.50 0.022 232 / 0.10), transparent 72%)",
          filter: "blur(40px)",
          willChange: "opacity",
        }}
        animate={{ opacity: [0.45, 0.62, 0.45] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom fade — subtle depth only, no solid fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.018 0.005 250 / 0.10) 60%, oklch(0.014 0.004 250 / 0.18) 100%)",
        }}
      />

      {/* Text zone */}
      <div className="relative z-10 max-w-3xl px-5 sm:px-6">
        {/* Eyebrow */}
        <p className="mb-4 md:mb-5 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground">
          Future Systems
        </p>
        {/* Italic intro */}
        <p className="mx-auto mb-8 max-w-xl font-display italic text-[14px] md:text-[15px] leading-[1.65] text-foreground/55">
          Not a forecast. A working hypothesis — built one industrial system at a time.
        </p>
        {/* H2 */}
        <h2
          className="font-display text-[clamp(1.75rem,5.4vw,4.2rem)] leading-[1.05] tracking-[-0.03em] font-medium text-gradient [text-wrap:balance]"
          style={{
            textShadow:
              "0 1px 14px oklch(0.05 0.012 240 / 0.45), 0 0 0.5px oklch(0.98 0.008 232 / 0.32)",
          }}
        >
          Energy as infrastructure.<br /> Industry at planetary scale.
        </h2>
        {/* Body */}
        <p className="mx-auto mb-8 max-w-[540px] text-[14px] md:text-[15.5px] leading-[1.7] text-foreground/75">
          The next century is not science fiction. It is calibrated alloys, intelligent grids, water systems, hydrogen logistics, and quietly engineered materials shaping the floor of every industry. The work is restrained, technical, and inevitable.
        </p>
        {/* CTA row */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link to="/contact" className="btn-cinematic btn-cinematic-atmospheric">
            Begin a conversation
          </Link>
          <Link to="/engage" className="btn-cinematic-secondary">
            Engage →
          </Link>
        </div>
        {/* Tag row */}
        <p className="mt-6 md:mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45">
          Advanced Materials · Energy Systems · Planetary Infrastructure
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Cinematic dissolve math — Enter / Active / Exit model
   ─────────────────────────────────────────────────────────────────

   OV = 0.12 → Enter 0–12 %, Active 12–88 %, Exit 88–100 % of band width.
   Chapter bands are non-uniform (Industrial gets ~83 % more space than avg).
   Background leads content by 2 pp; holds 2 pp longer (OV_A_IN/OV_A_OUT).
   eoo = easeOutExpo ≈ cubic-bezier(0.16, 1, 0.3, 1).
   At t=0.10 → 50 % opacity; t=0.30 → 88 %; t=0.50 → 97 %.
   This makes chapters feel they snap into place instantly and leave cleanly.
   No filter on outer wrappers (GPU compositing artefacts).
   ────────────────────────────────────────────────────────────────── */
const OV  = 0.057;
const c01 = (v: number) => Math.max(0, Math.min(1, v));
// easeOutQuint — fast initial rise, ultra-smooth tail: premium cinematic feel
// t=0.20 → 67 %, t=0.40 → 92 %, t=0.50 → 97 %
const eoo = (t: number): number => 1 - Math.pow(1 - c01(t), 5);

function chapOp(sp: number, n: number): number {
  const [bIn, bOut] = CHAPTER_BANDS[n];
  const fadeW  = OV * (bOut - bIn);
  const fiStart = bIn - fadeW;
  const foStart = bOut - fadeW;

  if (n === 0) {
    if (sp <= foStart) return 1;
    if (sp <= bOut)    return eoo(1 - (sp - foStart) / fadeW);
    return 0;
  }
  if (n === N_CHAPTERS - 1) {
    if (sp <= fiStart) return 0;
    if (sp <= bIn)     return eoo((sp - fiStart) / fadeW);
    return 1;
  }
  if (sp <= fiStart) return 0;
  if (sp <= bIn)     return eoo((sp - fiStart) / fadeW);
  if (sp <= foStart) return 1;
  if (sp <= bOut)    return eoo(1 - (sp - foStart) / fadeW);
  return 0;
}

function chapY(sp: number, n: number, yIn: number, yOut: number): number {
  const [bIn, bOut] = CHAPTER_BANDS[n];
  const fadeW  = OV * (bOut - bIn);
  const fiStart = bIn - fadeW;
  const foStart = bOut - fadeW;

  if (n === 0) {
    if (sp <= foStart) return 0;
    if (sp <= bOut)    return eoo((sp - foStart) / fadeW) * yOut;
    return yOut;
  }
  if (n === N_CHAPTERS - 1) {
    if (sp <= fiStart) return yIn;
    if (sp <= bIn)     return yIn * (1 - eoo((sp - fiStart) / fadeW));
    return 0;
  }
  if (sp <= fiStart) return yIn;
  if (sp <= bIn)     return yIn * (1 - eoo((sp - fiStart) / fadeW));
  if (sp <= foStart) return 0;
  if (sp <= bOut)    return eoo((sp - foStart) / fadeW) * yOut;
  return yOut;
}


/* ──────────────────────────────────────────────────────────────────
   Main export — single sticky cinematic stage
   ────────────────────────────────────────────────────────────────── */
export default function ScrollSections() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const yIn  = reduce ? 0 : 6;
  const yOut = reduce ? 0 : -4;

  const op0 = useTransform(scrollYProgress, (sp) => chapOp(sp, 0));
  const op1 = useTransform(scrollYProgress, (sp) => chapOp(sp, 1));
  const op2 = useTransform(scrollYProgress, (sp) => chapOp(sp, 2));
  const op3 = useTransform(scrollYProgress, (sp) => chapOp(sp, 3));
  const op4 = useTransform(scrollYProgress, (sp) => chapOp(sp, 4));
  const op5 = useTransform(scrollYProgress, (sp) => chapOp(sp, 5));
  const op6 = useTransform(scrollYProgress, (sp) => chapOp(sp, 6));

  const y0 = useTransform(scrollYProgress, (sp) => chapY(sp, 0, yIn, yOut));
  const y1 = useTransform(scrollYProgress, (sp) => chapY(sp, 1, yIn, yOut));
  const y2 = useTransform(scrollYProgress, (sp) => chapY(sp, 2, yIn, yOut));
  const y3 = useTransform(scrollYProgress, (sp) => chapY(sp, 3, yIn, yOut));
  const y4 = useTransform(scrollYProgress, (sp) => chapY(sp, 4, yIn, yOut));
  const y5 = useTransform(scrollYProgress, (sp) => chapY(sp, 5, yIn, yOut));
  const y6 = useTransform(scrollYProgress, (sp) => chapY(sp, 6, yIn, yOut));

  return (
    <>
      {/* Ghost scroll track — provides TOTAL_VH of scroll travel and chapter anchor points */}
      <div className="relative" style={{ height: `${TOTAL_VH}vh` }}>
        {(["spark", "founder", "carbon-intelligence", "industrial", "recognition", "ecosystem", "future"] as const).map((id, i) => (
          <div
            key={id}
            id={id}
            aria-hidden
            style={{
              position: "absolute",
              top: `${(CHAPTER_BANDS[i][0] + CHAPTER_BANDS[i][1]) / 2 * (TOTAL_VH - 100)}vh`,
              height: 0,
              width: "100%",
            }}
          />
        ))}
      </div>

      {/* Fixed cinematic content stage — all chapters layered, driven by global scroll */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <ScrollProgressBar progress={scrollYProgress} />

        {/* Chapter 0 — Origin */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: op0, y: y0, willChange: "opacity, transform" }}
        >
          <OriginContent />
        </motion.div>

        {/* Chapter 1 — Founder */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op1, y: y1, willChange: "opacity, transform" }}
        >
          <FounderContent />
        </motion.div>

        {/* Chapter 2 — Material Intelligence */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op2, y: y2, willChange: "opacity, transform" }}
        >
          <MaterialContent />
        </motion.div>

        {/* Chapter 3 — Industrial Translation */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op3, y: y3, willChange: "opacity, transform" }}
        >
          <IndustrialContent />
        </motion.div>

        {/* Chapter 4 — Recognition */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: op4, y: y4, willChange: "opacity, transform" }}
        >
          <RecognitionContent />
        </motion.div>

        {/* Chapter 5 — Ecosystem */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op5, y: y5, willChange: "opacity, transform" }}
        >
          <EcosystemContent />
        </motion.div>

        {/* Chapter 6 — Future Systems */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: op6, y: y6, willChange: "opacity, transform" }}
        >
          <FutureContent />
        </motion.div>
      </div>
    </>
  );
}
