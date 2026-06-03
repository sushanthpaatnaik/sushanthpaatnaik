import { Link } from "@tanstack/react-router";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import founderPresence from "@/assets/founder-editorial.webp";

/* ──────────────────────────────────────────────────────────────────
   Homepage = single sticky cinematic stage.
   Seven chapters. One viewport. Scroll is the timeline.

   Each chapter occupies ~200 vh of scroll travel.
   OV=0.30 → 30 % of each band is the dissolve window (~60 vh).
   ENTER_LAG → background shifts first; content follows 13 vh later.
   Future Systems holds at full opacity to close the documentary.
   ────────────────────────────────────────────────────────────────── */

const N_CHAPTERS = 7;
const TOTAL_VH   = 1620;                             // 1520 vh scroll ÷ 7 ≈ 217 vh per chapter
const CHAPTER_VH = (TOTAL_VH - 100) / N_CHAPTERS;   // scroll height per chapter in vh

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
   Scroll progress bar
   ────────────────────────────────────────────────────────────────── */
function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useSpring(progress, { stiffness: 60, damping: 32, mass: 0.5 });
  return (
    <div
      className="fixed left-0 right-0 top-0 z-[55] h-px bg-foreground/[0.04]"
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
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
      <div className="relative z-10 max-w-4xl text-center" style={{ transform: "translateX(-2vw)" }}>
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
      {/* Portrait — dissolved into industrial darkness */}
      <div
        aria-hidden
        className="absolute inset-y-[2%] left-0 w-[68%] md:w-[54%] lg:w-[46%] bg-center bg-no-repeat bg-cover opacity-[0.42] md:opacity-[0.27] [filter:grayscale(1)_contrast(1.04)_brightness(0.72)_saturate(1)_blur(2.2px)] [mask-image:radial-gradient(ellipse_52%_62%_at_38%_40%,#000_18%,rgba(0,0,0,0.82)_44%,rgba(0,0,0,0.32)_68%,transparent_92%)] [-webkit-mask-image:radial-gradient(ellipse_52%_62%_at_38%_40%,#000_18%,rgba(0,0,0,0.82)_44%,rgba(0,0,0,0.32)_68%,transparent_92%)] pointer-events-none"
        style={{ backgroundImage: `url(${founderPresence})`, backgroundPosition: "center 28%" }}
      />

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
      <div className="mr-auto text-left max-w-2xl">
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
      <div className="ml-auto md:text-right max-w-2xl">
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
      {/* Soft radial gradient bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.18_0.012_232/0.10),transparent_72%)",
        }}
      />
      <div className="relative max-w-4xl text-center" style={{ transform: "translateX(-1vw)" }}>
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
      <div className="relative w-full max-w-6xl mt-7">
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
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
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

   OV = 0.40  → each chapter dissolves in/out over 40 % of its band
                 ≈ 87 vh of shared overlap at TOTAL_VH=1620.
                 Outgoing and incoming chapters coexist for ~62 vh —
                 story evolves continuously, never switches.

   ENTER_LAG = 0.28
                 → content appears 28 % into the overlap window.
                 Background shifts first; text follows ~24 vh later.
                 Viewer's environment changes before words arrive.

   Active zone per chapter ≈ 105 vh — over a full screen height where
   the chapter is the sole voice before dissolving into the next.

   Future Systems holds at opacity 1 through end of scroll — the
   documentary closes on a held frame, not a fade.

   eio = cosine ease-in-out: the most gradual, film-like curve.
   Chapters appear early and fade late — no snap, no rush, no cut.
   At t=0.2 → 9.5 % visible (vs 3.2 % with cubic).
   At t=0.8 → 90.5 % still visible — outgoing chapter stays present.
   No filter on absolute outer wrappers (GPU compositing artefacts).
   ────────────────────────────────────────────────────────────────── */
const W          = 1 / N_CHAPTERS;
const OV         = 0.40;   // dissolve fraction — 40 % of each chapter band
const ENTER_LAG  = 0.28;   // background leads content by this fraction of OV
const c01        = (v: number) => Math.max(0, Math.min(1, v));

// Cosine ease-in-out: slow start, linear-ish middle, slow finish.
// Much gentler than cubic — identical to professional cross-dissolves.
const eio = (t: number): number => {
  const x = c01(t);
  return (1 - Math.cos(Math.PI * x)) / 2;
};

function chapOp(sp: number, n: number): number {
  const bIn    = n / N_CHAPTERS;
  const bOut   = (n + 1) / N_CHAPTERS;
  const fadeW  = OV * W;                     // width of each dissolve window
  const lagW   = ENTER_LAG * fadeW;          // background leads content by this

  // Fade-in: n+1 starts appearing while n is still exiting
  const fiStart = bIn - fadeW + lagW;        // content opacity begins rising
  const fiEnd   = bIn + lagW;               // content fully visible

  // Fade-out
  const foStart = bOut - fadeW;             // content begins falling
  // foEnd = bOut

  if (n === 0) {
    // Origin: opens at full opacity; slow dissolve out
    if (sp <= foStart) return 1;
    if (sp <= bOut)    return eio(1 - (sp - foStart) / fadeW);
    return 0;
  }
  if (n === N_CHAPTERS - 1) {
    // Future Systems: dissolves in, then holds as final frame
    if (sp <= fiStart) return 0;
    if (sp <= fiEnd)   return eio((sp - fiStart) / fadeW);
    return 1;
  }
  // Middle chapters: gradual enter → active hold → gradual exit
  if (sp <= fiStart) return 0;
  if (sp <= fiEnd)   return eio((sp - fiStart) / fadeW);
  if (sp <= foStart) return 1;
  if (sp <= bOut)    return eio(1 - (sp - foStart) / fadeW);
  return 0;
}

function chapY(sp: number, n: number, yIn: number, yOut: number): number {
  const bIn    = n / N_CHAPTERS;
  const bOut   = (n + 1) / N_CHAPTERS;
  const fadeW  = OV * W;
  const lagW   = ENTER_LAG * fadeW;

  const fiStart = bIn - fadeW + lagW;
  const fiEnd   = bIn + lagW;
  const foStart = bOut - fadeW;

  if (n === 0) {
    if (sp <= foStart) return 0;
    if (sp <= bOut)    return eio((sp - foStart) / fadeW) * yOut;
    return yOut;
  }
  if (n === N_CHAPTERS - 1) {
    if (sp <= fiStart) return yIn;
    if (sp <= fiEnd)   return yIn * (1 - eio((sp - fiStart) / fadeW));
    return 0;
  }
  if (sp <= fiStart) return yIn;
  if (sp <= fiEnd)   return yIn * (1 - eio((sp - fiStart) / fadeW));
  if (sp <= foStart) return 0;
  if (sp <= bOut)    return eio((sp - foStart) / fadeW) * yOut;
  return yOut;
}


/* ──────────────────────────────────────────────────────────────────
   Main export — single sticky cinematic stage
   ────────────────────────────────────────────────────────────────── */
export default function ScrollSections() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const yIn  = reduce ? 0 : 52;
  const yOut = reduce ? 0 : -30;

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
              top: `${(i + 0.5) * CHAPTER_VH}vh`,
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
