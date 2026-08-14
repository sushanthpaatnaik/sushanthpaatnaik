import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  N_CHAPTERS,
  CHAPTER_BANDS,
  CONTENT_FADE,
  getChapterFromProgress,
  clamp01 as c01,
  smoothstep as eoo,
  fadeOutAt,
  fadeInAt,
} from "./chapterBands";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

/* ──────────────────────────────────────────────────────────────────
   Mobile stage gate.

   Phones get a different *composition* of the same chapters, not a
   different site: where a laptop can hold a headline, a paragraph, an
   index and a CTA in one frame, a 360 px portrait viewport cannot. On
   mobile each chapter is broken into successive states — one thought
   per frame — driven by the chapter's own scroll band. Desktop never
   enters this path and its layout, copy and timing are untouched.

   Breakpoint matches Tailwind's `md`, so the JS gate and the `md:`
   utilities in the markup always agree.
   ────────────────────────────────────────────────────────────────── */
function useIsMobileStage(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

/* ──────────────────────────────────────────────────────────────────
   Homepage = single sticky cinematic stage.
   Eight chapters. One viewport. Scroll is the timeline.

   Each chapter occupies ~217 vh of scroll travel (Industrial: ~336 vh).
   OV=0.15 → 15 % fade window. Active hold: 70 % of band.
   Future Systems holds at full opacity to close the documentary.
   ────────────────────────────────────────────────────────────────── */

// Ghost-track height; scrollable travel = TOTAL_VH - 100.
//
// 1620 → 1100 (travel 1520vh → 1000vh), a 34% shorter page.
//
// CONTENT_FADE moves with it. The dissolve is a fraction of total progress, so
// leaving it at 0.043 would have shrunk every hand-over from 65vh to 43vh and
// undone the pacing work this shortening sits on top of. Raised to 0.060 the
// dissolve stays at ~60vh of scrolling on a shorter page.
//
// What actually pays for the cut is the holds. Measured after: Origin ~210vh,
// Recognition ~170vh, Future ~160vh, Industrial ~130vh, Material ~90vh.
// Material is the pinch — its band is the narrowest, so a fixed-length
// dissolve eats proportionally most of it, and 90vh is just under one screen
// of scrolling at full opacity. Readable, but it is the first thing to feel
// rushed if this page is ever shortened further.
//
// Frame density improves: 476 frames over 1000vh is 2.1vh/frame against the
// old 3.2, so the sequence steps less, not more.
const TOTAL_VH = 1100;

// Ecosystem directory — every primary-nav destination still reachable, but
// grouped into six entries instead of nine so the closing chapter reads as a
// compact index rather than a wall. Grouped rows link to their primary route
// and expose the companions as secondary links, so no page lost an entrance.
const gateways = [
  {
    to: "/about", n: "I", label: "About",
    line: "Founder, philosophy, journey.",
    also: [],
  },
  {
    to: "/early-works", n: "II", label: "Early Works",
    line: "Inventions and the origin archive.",
    also: [],
  },
  {
    to: "/innovations", n: "III", label: "Innovations",
    line: "Graphene, materials, systems.",
    also: [],
  },
  {
    to: "/ventures", n: "IV", label: "Ventures",
    line: "Operating companies. Industrial translation.",
    also: [],
  },
  {
    to: "/recognitions", n: "V", label: "Recognitions & Voices",
    line: "Recognition, talks, perspectives.",
    also: [{ to: "/voices", label: "Voices" }],
  },
  {
    to: "/essays", n: "VI", label: "Essays, News & Engage",
    line: "Workshop notes, editorial archive, collaboration.",
    also: [{ to: "/news", label: "News" }, { to: "/engage", label: "Engage" }],
  },
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

   Two beats inside one chapter, not two chapters. Beat A is the hero over
   the planetary opening; beat B is the founder's voice once the canvas has
   dissolved into the lab. They cross-fade against each other on local band
   progress, and are laid out in different columns (centred vs right) so the
   overlap reads as a dissolve rather than as two texts stacked in the same
   place. Founder was previously its own full-screen chapter with its own
   rail entry.
   ────────────────────────────────────────────────────────────────── */
function OriginContent({
  beatA,
  beatB,
  peA,
  peB,
}: {
  beatA: MotionValue<number>;
  beatB: MotionValue<number>;
  peA: MotionValue<"auto" | "none">;
  peB: MotionValue<"auto" | "none">;
}) {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0"
        style={{ opacity: beatA, pointerEvents: peA }}
      >
        <OriginHero />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ opacity: beatB, pointerEvents: peB }}
      >
        <FounderVoice />
      </motion.div>
    </div>
  );
}

function OriginHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-5 sm:px-6">
      {/* Origin: dark cosmic background — moderate center shield */}
      <ContentShield align="center" strength={0.56} />

      {/* All text content lives in one centered block — headline, subtitle,
          and awards. Nothing can overlap because they share a single layout
          context. The animated indicator is purely decorative (aria-hidden)
          and lives at absolute bottom separately. */}
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
          {/* Credibility strip — value+label pairs separated by · dots.
              Dot is placed BETWEEN spans (not inside) so spacing is
              consistent regardless of flex-gap or font-size.
              Result: 06 Presidential Awards · 23 Innovations · 06 Ventures · TED · MIT TR · Global Recognition

              The labels used to be `hidden sm:inline`, so on every phone this
              read as "06 · 23 · 06 · TED · MIT TR · Global Recognition" —
              three bare numbers with nothing saying what they counted. A
              number without its noun is not a shorter version of the claim,
              it is not the claim at all, and it is unreadable to a screen
              reader and to search on any width.

              They are always shown now. Phones get a shorter label for the
              two that would otherwise wrap awkwardly at 360px, and the row
              wraps rather than scrolls. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2">
            {[
              { v: "06",                  l: "Presidential Awards", short: "Presidential" },
              { v: "23",                  l: "Innovations",         short: "Innovations" },
              { v: "06",                  l: "Ventures",            short: "Ventures" },
              { v: "TED",                 l: "" },
              { v: "MIT TR",              l: "" },
              { v: "Global Recognition",  l: "" },
            ].map((s, i) => (
              <span key={i} className="inline-flex items-center whitespace-nowrap">
                {i > 0 && (
                  <span className="mx-0.5 font-mono text-[9px] text-foreground/25" aria-hidden>·</span>
                )}
                <span className="font-mono text-[11px] sm:text-[12px] text-foreground/70 tracking-[-0.01em]">{s.v}</span>
                {s.l && (
                  <>
                    <span className="sm:hidden ml-1.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted-foreground/55">{s.short}</span>
                    <span className="hidden sm:inline ml-1.5 font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground/50">{s.l}</span>
                  </>
                )}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Animated indicator — decorative only, no text, aria-hidden.
          Lives at absolute bottom; cannot overlap any text. */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[3px]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden
      >
        <div className="relative flex flex-col items-center">
          <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-foreground/18 via-foreground/10 to-transparent" />
          <motion.div
            className="absolute top-0 w-[3px] h-[3px] rounded-full"
            style={{
              background: "oklch(0.88 0.04 232 / 0.85)",
              boxShadow: "0 0 6px 1px oklch(0.78 0.06 232 / 0.55)",
              left: "50%",
              translateX: "-50%",
            }}
            animate={{ y: [0, 40, 40], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: ["easeIn", "easeOut", "easeOut"],
              times: [0, 0.72, 1],
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              animate={{ opacity: [0.15, 0.65, 0.15] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.22,
                ease: "easeInOut",
              }}
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/60"
              />
            </motion.svg>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Origin, beat B — the founder's voice (no separate chapter id)
   ────────────────────────────────────────────────────────────────── */
function FounderVoice() {
  return (
    /* Anchored to the upper third on phones, centred from md up.
       ─────────────────────────────────────────────────────────────
       On a laptop this beat lives in grid columns 7-12 and Material
       Intelligence is left-aligned, so the dissolve between them reads
       as a hand-off across the frame. On a phone the grid collapses to
       one column and both land in the same place: measured at 393x873,
       "The future is not imagined." occupied y=368-425 and "Engineering
       intelligent matter." y=408-471, so at the dissolve midpoint the
       two headlines interleaved at 50% each — the second line of one
       running through the first line of the other, with "Read the
       journey" landing on top of "Coatings · Composites".

       Raising this beat to the upper third opens ~140px between them,
       so the same cross-dissolve reads as one text handing over to
       another rather than as two texts sharing a space. It also lifts
       the quote off the founder's mouth, where it had been sitting. */
    <div className="relative w-full h-full flex items-start pt-[11vh] md:items-center md:pt-0 px-5 sm:px-6 lg:pl-32 xl:pl-36">
      {/* Founder: dark footage, text on right — right-side shield */}
      <ContentShield align="right" strength={0.68} />
      {/* Founder label top left */}
      <p className="pointer-events-none absolute top-10 left-[8%] z-10 font-mono text-[10px] uppercase tracking-[0.55em] text-muted-foreground/25 blur-[0.3px]">
        Founder
      </p>

      {/* 12-col grid, content in cols 7-12 */}
      <div className="relative mx-auto grid w-full max-w-6xl md:grid-cols-12">
        <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p className="mb-4 md:mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Founder · Voice
          </p>
          <blockquote className="font-display text-2xl leading-[1.19] tracking-[-0.025em] text-gradient md:text-3xl lg:text-[2.4rem] whitespace-pre-line">
            {"The future is not imagined.\nIt is engineered quietly."}
          </blockquote>
          <div className="mt-5 md:mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45">
            <span className="h-px w-10 bg-gradient-to-r from-foreground/25 to-transparent" />
            <span>Sushanth Paatnaik</span>
          </div>
          <Link
            to="/about"
            className="mt-6 md:mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-foreground/70 hover:text-foreground transition-colors"
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
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20">
      {/* Material: dim lab footage (founder examining graphene) — moderate
          shield, left column. Was 0.82 for the old bright-metallic plate;
          the new footage is already dark, so the old strength crushed it. */}
      <ContentShield align="left" strength={0.62} />
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
        {/* Body — the full argument is a laptop-sized paragraph. On a phone
            it lands as eight lines of 14 px over lab footage, so the frame
            carries the material list instead and the paragraph stays in the
            document for search and screen readers. */}
        <p className="hidden md:block text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md">
          Graphene, nano-materials, coatings, additives, composites. A single sheet of carbon, manufactured cleanly and at scale, is the most under-priced strategic asset on the table this decade.
        </p>
        <div
          className="md:hidden flex flex-col gap-2 font-mono text-[10.5px] uppercase tracking-[0.26em] text-foreground/80"
          style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.85)" }}
        >
          <span>Graphene · Nano-materials</span>
          <span>Coatings · Composites</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 3 — Industrial Translation (id="industrial")
   ────────────────────────────────────────────────────────────────── */
function IndustrialContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20">
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
        {/* Body — narrower measure than the heading so the two read as
            separate steps rather than one dense block at laptop widths. */}
        <p className="hidden md:block text-[15px] md:text-base text-muted-foreground/90 leading-relaxed max-w-[26rem] ml-auto">
          Solar coatings, batteries that charge in minutes, polymer additives, protective coatings, composites, climate infrastructure — each downstream of the same material platform.
        </p>
        {/* Phone: the enumeration is the paragraph's whole point, so it is
            shown as a list and the sentence stays in the document. */}
        <p
          className="md:hidden font-mono text-[10.5px] uppercase tracking-[0.24em] leading-[2] text-foreground/80"
          style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.85)" }}
        >
          Solar coatings · Batteries<br />Additives · Composites<br />Climate infrastructure
        </p>
        {/* Ventures — the commercial expression of the platform. Given more
            air above it than the body copy's own line spacing so it reads as
            its own beat, not a trailing sentence. */}
        <p className="mt-7 text-sm md:text-[15px] text-foreground/65 leading-relaxed max-w-[26rem] ml-auto">
          Six operating companies carry that platform into industry.
        </p>
        {/* Link row */}
        <div className="mt-10 flex flex-wrap items-center justify-start md:justify-end gap-x-8 gap-y-3">
          <Link
            to="/innovations"
            className="text-[11px] uppercase tracking-[0.4em] text-foreground/70 hover:text-foreground transition-colors"
          >
            Explore Innovations →
          </Link>
          <Link
            to="/ventures"
            className="text-[11px] uppercase tracking-[0.4em] text-foreground/70 hover:text-foreground transition-colors"
          >
            View Ventures →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 3 — Recognition & Ecosystem (id="recognition")

   Recognition and Ecosystem were separate chapters. Merged: the record
   states the context, the directory is where the reader goes next. One
   background, one shield, one column — the two never cross-fade against
   each other, so no duplicated plate and no overlapping text.
   ────────────────────────────────────────────────────────────────── */
function RecognitionEcosystemContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 xl:pl-36">
      {/* Bright product/industrial plate. The directory spans nearly the full
          width in its two-column form, so a left-weighted scrim would leave
          the right column sitting on the brightest part of the frame — this
          chapter needs the centre shield, not the left one. */}
      <ContentShield align="center" strength={0.80} />
      {/* overflow-y-auto on the inner scroller, not the flex container, so iOS
          doesn't fight the fixed parent's overflow-hidden on the scroll chain.
          max-height uses dvh so it's constrained to the actual viewport height
          and overflow-y actually triggers (100% in flex items-center doesn't). */}
      {/* The scroll box has to clear the page chrome, not just the viewport:
          the fixed header sits at the top and MobileCTABar at the bottom on
          touch widths. Sizing this to the bare viewport centred the content
          such that the eyebrow tucked under the header and the last directory
          rows sat behind the CTA bar. */}
      <div
        className="relative z-10 w-full max-w-6xl xl:max-w-7xl overflow-y-auto overflow-x-hidden overscroll-contain max-h-[calc(100dvh-8rem)] md:max-h-[calc(100dvh-5rem)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Eyebrow */}
        <p className="mb-2 md:mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
          Recognition &amp; Ecosystem
        </p>
        {/* H2 — ~9% smaller ceiling than the other chapter headings and
            capped in width. At full size this line nearly spans a laptop
            viewport, which reads as a banner rather than a headline. */}
        <h2 className="font-display text-[clamp(1.35rem,5.4vw,4rem)] leading-[1.02] md:leading-[1.04] tracking-[-0.04em] text-gradient [text-wrap:balance] max-w-[20ch]">
          Recognised early. Building continuously.
        </h2>
        {/* The record, then the philosophy that outranks it */}
        <p className="mt-2.5 md:mt-7 max-w-2xl text-[12.5px] md:text-[15px] leading-snug md:leading-relaxed text-muted-foreground/85">
          Six Indian Presidential Awards. NIF-India IGNITE. TED@Bangalore. MIT Technology Review. India Today.
        </p>
        <p className="mt-1.5 md:mt-3 max-w-2xl text-[12.5px] md:text-[15px] leading-snug md:leading-relaxed text-foreground/70">
          The record exists. The next prototype matters more.
        </p>
        <Link
          to="/recognitions"
          className="mt-3 md:mt-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-foreground/75 hover:text-foreground transition-colors"
        >
          Open the archive →
        </Link>

        {/* Ecosystem directory — restrained editorial index. Single column on
            mobile, two on md+. Roman numerals retained for archive character.
            The directory sits over the founder silhouette and the lit works
            behind it, which is the busiest part of this plate; it carries its
            own soft scrim rather than pushing the global shield darker and
            flattening the whole frame. Gradient only — no card, no border. */}
        <div className="relative mt-3.5 md:mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 62% 70% at 42% 50%, oklch(0.02 0.006 260 / 0.62) 0%, oklch(0.02 0.006 260 / 0.42) 45%, oklch(0.02 0.006 260 / 0.12) 78%, transparent 100%)",
            }}
          />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-0">
          {gateways.map((g) => (
            <div
              key={g.to}
              className="group border-t border-foreground/[0.08] py-1 md:py-4 hover:border-foreground/25 transition-colors duration-500"
            >
              <div className="flex items-baseline gap-3 md:gap-5">
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-muted-foreground/45 shrink-0 whitespace-nowrap">
                  {g.n}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    to={g.to}
                    className="font-display text-base md:text-lg lg:text-xl tracking-[-0.015em] text-foreground/90 hover:text-gradient transition-colors duration-500"
                    style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.65)" }}
                  >
                    {g.label}
                  </Link>
                  {/* Sub-line sits over the brightest part of the plate on
                      narrow screens, so it carries its own shadow rather than
                      relying on the shield alone. */}
                  <p
                    className="mt-0.5 text-[10.5px] md:text-[12.5px] leading-snug text-muted-foreground/80 [text-wrap:balance]"
                    style={{ textShadow: "0 1px 6px oklch(0.02 0.006 260 / 0.7)" }}
                  >
                    {g.line}
                  </p>
                  {g.also.length > 0 && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                      {g.also.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-muted-foreground/50 hover:text-foreground/80 transition-colors"
                        >
                          {s.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 3 — Recognition & Ecosystem, phone composition.

   Desktop can carry the record and the directory in one frame because
   the directory runs two columns beside the copy. On a phone the same
   markup collapses into a single column and the whole chapter becomes
   a wall of 10 px type — the record, six destinations and six
   descriptions competing at once.

   So the merge is kept (one background, one shield, one chapter) but
   the two halves are separated in *time*: the record holds first, the
   directory replaces it. Descriptions stay in the document for search
   and screen readers; visually the phone index is labels only, and
   every destination remains one tap away in the header menu.
   ────────────────────────────────────────────────────────────────── */
const RECORD = [
  "Six Indian Presidential Awards",
  "NIF-India · IGNITE",
  "TED@Bangalore",
  "MIT Technology Review",
] as const;

function RecognitionMobile({ lp }: { lp: MotionValue<number> }) {
  const opA = useTransform(lp, (v) => stageOp(v, 0.000, 0.420));
  const opB = useTransform(lp, (v) => stageOp(v, 0.475, 1, true));
  const peA = useTransform(opA, (v) => (v > 0.5 ? "auto" : "none"));
  const peB = useTransform(opB, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <div className="relative w-full h-full overflow-hidden px-6">
      <ContentShield align="center" strength={0.72} />

      {/* A — the record. Read as an evidence list, not a run-on sentence. */}
      <motion.div
        className="absolute inset-x-6 top-[22%] z-10"
        style={{ opacity: opA, pointerEvents: peA }}
      >
        <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-primary/80">
          Recognition
        </p>
        <h2 className="font-display text-[clamp(1.9rem,8.6vw,2.5rem)] leading-[1.06] tracking-[-0.03em] text-gradient">
          Recognised early.<br />Building continuously.
        </h2>
        <ul className="mt-8 space-y-2.5">
          {RECORD.map((r) => (
            <li
              key={r}
              className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/70"
              style={{ textShadow: "0 1px 6px oklch(0.02 0.006 260 / 0.7)" }}
            >
              {r}
            </li>
          ))}
        </ul>
        <p
          className="mt-8 max-w-[26ch] text-[15px] leading-[1.55] text-foreground/80"
          style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.8)" }}
        >
          The record exists. The next prototype matters more.
        </p>
        <Link
          to="/recognitions"
          className="mt-6 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.32em] text-foreground/90 transition-colors hover:text-foreground"
          style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.8)" }}
        >
          Open the archive →
        </Link>
      </motion.div>

      {/* B — the directory, in its own frame. Labels only. */}
      <motion.div
        className="absolute inset-x-6 top-[19%] z-10"
        style={{ opacity: opB, pointerEvents: peB }}
      >
        <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-primary/80">
          Ecosystem
        </p>
        <h2 className="font-display text-[clamp(1.9rem,8.6vw,2.5rem)] leading-[1.06] tracking-[-0.03em] text-gradient">
          The work<br />continues outward.
        </h2>
        <div className="mt-7">
          {gateways.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="flex items-baseline gap-4 border-t border-foreground/[0.1] py-3.5 transition-colors active:border-foreground/30"
            >
              <span
                className="font-mono text-[9px] tracking-[0.3em] text-foreground/45 w-6 shrink-0"
                style={{ textShadow: "0 1px 6px oklch(0.02 0.006 260 / 0.8)" }}
              >
                {g.n}
              </span>
              <span
                className="font-display text-[17px] tracking-[-0.015em] text-foreground/90"
                style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.65)" }}
              >
                {g.label}
              </span>
              <span className="sr-only">— {g.line}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 4 — Future Systems (id="future")
   ────────────────────────────────────────────────────────────────── */
function FutureContent() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Future: closing shot is a bright sunset corridor, not dark space —
          needs meaningfully more shield than the old plate did to keep the
          headline legible against direct sun through the windows. */}
      <ContentShield align="center" strength={0.68} />
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
      <div className="relative z-10 max-w-3xl px-5 sm:px-6 -translate-y-[4%] md:-translate-y-[6%]">
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
          className="mx-auto max-w-[30ch] font-display text-[clamp(1.75rem,4.8vw,3.8rem)] leading-[1.08] tracking-[-0.03em] font-medium text-gradient [text-wrap:balance]"
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
        <p className="mt-7 md:mt-9 font-mono text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.4em] text-muted-foreground/60 [text-wrap:balance]">
          Advanced Materials · Energy Systems · Planetary Infrastructure
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 4 — Future Systems, phone composition.

   The desktop frame above holds eyebrow, hypothesis, headline,
   paragraph, two buttons and a domain row at once. On a 360 px
   portrait screen that stack buries the silhouette it is sitting on,
   so the phone gets the same thought delivered in five successive
   states instead of one dense one:

     A  Not a forecast. A working hypothesis.
     B  Energy as infrastructure.
     C  Industry at planetary scale.
     D  Advanced Materials · Energy Systems · Planetary Infrastructure
     E  The next century will be engineered. → Begin a conversation

   The long paragraph is kept in the document for search and screen
   readers but is never painted over the frame. The eyebrow persists
   across every state so the chapter never loses its label, and text
   is held in the upper band of the frame so the silhouette and the
   industrial landscape below it stay uncovered.
   ────────────────────────────────────────────────────────────────── */
function FutureMobile({ lp }: { lp: MotionValue<number> }) {
  // Four states, not five. The thesis is one sentence pair — desktop sets
  // it as a single h2 with a line break — and splitting it across two
  // scroll states was buying a hand-over with reading time. Five states
  // in a 250vh band could only afford 0.38 of a phone screen each, about
  // one gentle swipe; four afford half a screen, and the pair now reads
  // as the single thought it is.
  //
  // 0.20 + 0.22 + 0.20 + 0.215 hold, 3 x 0.055 hand-over = 1.000.
  const opA = useTransform(lp, (v) => stageOp(v, 0.000, 0.200));
  const opB = useTransform(lp, (v) => stageOp(v, 0.255, 0.475));
  const opC = useTransform(lp, (v) => stageOp(v, 0.530, 0.730));
  const opD = useTransform(lp, (v) => stageOp(v, 0.785, 1, true));
  const peD = useTransform(opD, (v) => (v > 0.5 ? "auto" : "none"));

  // Upper text band: clear of the subject's head at the top and of the
  // silhouette's body below. Every transient state lands in this box.
  const band = "absolute inset-x-0 top-[26%] px-6 text-center";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Lighter than the desktop shield: on a phone the frame is the
          argument, so it is lifted for contrast rather than covered. */}
      <ContentShield align="center" strength={0.46} />

      {/* Persistent chapter label */}
      <p className="absolute inset-x-0 top-[17%] z-10 text-center text-[10px] uppercase tracking-[0.32em] text-foreground/70">
        Future Systems
      </p>

      {/* Full copy preserved for search and assistive tech, never painted */}
      <p className="sr-only">
        The next century is not science fiction. It is calibrated alloys, intelligent grids, water systems, hydrogen logistics, and quietly engineered materials shaping the floor of every industry. The work is restrained, technical, and inevitable.
      </p>

      {/* A — the premise */}
      <motion.p
        className={`${band} z-10 font-display italic text-[16px] leading-[1.6] text-foreground/75`}
        style={{ opacity: opA }}
      >
        Not a forecast.<br />A working hypothesis.
      </motion.p>

      {/* B — the thesis, both halves together. Four lines at this size, so
          it is set a step smaller than the single-sentence states were and
          the two sentences are separated by leading rather than by scroll. */}
      <motion.h2
        className={`${band} z-10 font-display text-[clamp(1.75rem,8.0vw,2.25rem)] leading-[1.12] tracking-[-0.03em] font-medium text-gradient`}
        style={{ opacity: opB, textShadow: "0 1px 16px oklch(0.05 0.012 240 / 0.5)" }}
      >
        Energy as<br />infrastructure.
        <span className="mt-3 block">
          Industry at<br />planetary scale.
        </span>
      </motion.h2>

      {/* C — the domains, stacked so they read rather than wrap */}
      <motion.div
        className={`${band} z-10 flex flex-col items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.3em] text-foreground/80`}
        style={{ opacity: opC }}
      >
        <span>Advanced Materials</span>
        <span className="h-px w-6 bg-foreground/20" aria-hidden />
        <span>Energy Systems</span>
        <span className="h-px w-6 bg-foreground/20" aria-hidden />
        <span>Planetary Infrastructure</span>
      </motion.div>

      {/* D — closing state. Statement in the text band, the single CTA and
          the page's ending anchored to the bottom, clear of Android's
          navigation area and Chrome's controls. */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ opacity: opD, pointerEvents: peD }}
      >
        <p
          className={`${band} font-display text-[clamp(2.05rem,9.4vw,2.6rem)] leading-[1.06] tracking-[-0.03em] font-medium text-gradient`}
          style={{ textShadow: "0 1px 16px oklch(0.05 0.012 240 / 0.5)" }}
        >
          The next century<br />will be engineered.
        </p>

        {/* The closing block sits over the brightest part of the plate —
            the lit industrial landscape. It carries its own bottom lift so
            the CTA and the page's ending stay legible without darkening the
            whole frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.02 0.006 260 / 0.34) 34%, oklch(0.02 0.006 260 / 0.72) 72%, oklch(0.02 0.006 260 / 0.88) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6"
          style={{ paddingBottom: "max(1.75rem, calc(env(safe-area-inset-bottom, 0px) + 1.25rem))" }}
        >
          {/* Editorial CTA — a rule, not a pill. The arrow is the affordance. */}
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 border-b border-foreground/35 pb-2 text-[13px] uppercase tracking-[0.34em] text-foreground/95 transition-colors hover:border-foreground/70 active:border-foreground/70"
          >
            <span>Begin a conversation</span>
            <span className="transition-transform duration-300 group-active:translate-x-1" aria-hidden>→</span>
          </Link>

          <div className="flex flex-col items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.3em]">
            <span className="text-foreground/75">Sushanth Paatnaik</span>
            <span className="text-foreground/45">© 2026</span>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex min-h-6 items-center font-mono text-[9.5px] uppercase tracking-[0.3em] text-foreground/55 transition-colors hover:text-foreground/85"
          >
            Back to top ↑
          </button>
        </div>
      </motion.div>
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
const OV  = CONTENT_FADE;

/* Chapters hand over in sequence, not by cross-dissolving.
   ─────────────────────────────────────────────────────────────────
   Film dissolves images. It does not dissolve one title card into
   another, because superimposed text is unreadable — and these
   chapters are text over a continuous film.

   Both layers used to share the fade window, each passing through 50 %
   at its midpoint. Measured at the Recognition → Future hand-over on a
   1440×900 desktop: 27 text nodes above 25 % opacity at once, against 7
   with Future settled. Recognition's desktop composition is a heading, an
   awards line, the record line, an archive link and a six-row directory
   with a description per row; Future's is a full centred block. Mid-
   dissolve every one of them was painted over every other. Widening the
   dissolve to a readable length is what exposed it — at 10vh the overlap
   lasted a wheel notch and nobody could catch it.

   So the outgoing chapter now finishes leaving before the incoming one
   starts arriving: out across the first 46 % of the window, a beat of
   nothing across 8 %, in across the last 46 %. The two are never both
   painted — not at 50 %, not at 5 %.

   That 8 % beat is ~5vh, about 43px of scrolling on a 900px viewport.
   The cinematic frame is still there and still moving; it is the text
   that steps aside for a moment, which is exactly the grammar a title
   card follows. It also means each chapter stays legible right up to the
   instant it goes, instead of degrading through a smear.

   HANDOVER_OUT/IN, fadeOutAt/fadeInAt and smoothstep live in chapterBands.ts
   with the bands they are timed against, because the canvas colour grade is
   sequenced on the same curve — see gradeOpacityAt. */

/* Mobile staged reveal ────────────────────────────────────────────
   `v` is local progress inside a chapter band (0–1). A stage holds at
   full opacity across [from, to]; the STAGE_FADE-wide window between
   one stage's `to` and the next stage's `from` is its hand-over.

   These hand over in sequence, exactly as chapters do, and for exactly
   the same reason: every phone state in Future Systems is painted in
   the same text band at top-26 %, so a cross-dissolve put "Energy as
   infrastructure." and "Industry at planetary scale." on top of each
   other at 50 % apiece. That was the same defect as the desktop
   Recognition → Future overlap, one level down, and it was shipping.
   fadeOutAt/fadeInAt carve the window into leave / beat / arrive, so
   only ever one of them is painted.

   `hold` pins the final stage on so the closing composition is also the
   page's last state. `from <= 0` pins the first stage on from the start
   of the chapter, since it has nothing to arrive from. */
const STAGE_FADE = 0.055;
function stageOp(v: number, from: number, to: number, hold = false): number {
  const arrive = from <= 0 ? 1 : fadeInAt((v - from + STAGE_FADE) / STAGE_FADE);
  if (hold) return arrive;
  return Math.min(arrive, fadeOutAt((v - to) / STAGE_FADE));
}

function chapOp(sp: number, n: number): number {
  const [bIn, bOut] = CHAPTER_BANDS[n];
  const fadeW  = OV; // absolute — see CONTENT_FADE in chapterBands.ts
  const fiStart = bIn - fadeW;
  const foStart = bOut - fadeW;
  // t is position within a hand-over window, 0 at its start, 1 at its end.
  // bOut of chapter n is bIn of chapter n+1, so both read the same t and
  // fadeOutAt/fadeInAt carve it into leave / beat / arrive.
  const tOut = (sp - foStart) / fadeW;
  const tIn  = (sp - fiStart) / fadeW;

  if (n === 0) {
    if (sp <= foStart) return 1;
    if (sp <= bOut)    return fadeOutAt(tOut);
    return 0;
  }
  if (n === N_CHAPTERS - 1) {
    if (sp <= fiStart) return 0;
    if (sp <= bIn)     return fadeInAt(tIn);
    return 1;
  }
  if (sp <= fiStart) return 0;
  if (sp <= bIn)     return fadeInAt(tIn);
  if (sp <= foStart) return 1;
  if (sp <= bOut)    return fadeOutAt(tOut);
  return 0;
}

function chapY(sp: number, n: number, yIn: number, yOut: number): number {
  const [bIn, bOut] = CHAPTER_BANDS[n];
  const fadeW  = OV; // absolute — see CONTENT_FADE in chapterBands.ts
  const fiStart = bIn - fadeW;
  const foStart = bOut - fadeW;

  const tOut = (sp - foStart) / fadeW;
  const tIn  = (sp - fiStart) / fadeW;

  if (n === 0) {
    if (sp <= foStart) return 0;
    if (sp <= bOut)    return (1 - fadeOutAt(tOut)) * yOut;
    return yOut;
  }
  if (n === N_CHAPTERS - 1) {
    if (sp <= fiStart) return yIn;
    if (sp <= bIn)     return yIn * (1 - fadeInAt(tIn));
    return 0;
  }
  if (sp <= fiStart) return yIn;
  if (sp <= bIn)     return yIn * (1 - fadeInAt(tIn));
  if (sp <= foStart) return 0;
  if (sp <= bOut)    return (1 - fadeOutAt(tOut)) * yOut;
  return yOut;
}


/* ──────────────────────────────────────────────────────────────────
   Main export — single sticky cinematic stage
   ────────────────────────────────────────────────────────────────── */
export default function ScrollSections() {
  const reduce = useReducedMotionSafe();
  const mobile = useIsMobileStage();
  const { scrollYProgress } = useScroll();

  // On touch / mobile devices, clearing willChange avoids reserving 2–4 MB of
  // GPU memory per layer. The CSS @media reset at styles.css:625 can't override
  // inline styles, so we gate here in JS.
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;
  const wc = reduce || isTouch ? "auto" : "opacity, transform";

  const yIn  = reduce ? 0 : 6;
  const yOut = reduce ? 0 : -4;

  const op0 = useTransform(scrollYProgress, (sp) => chapOp(sp, 0));
  const op1 = useTransform(scrollYProgress, (sp) => chapOp(sp, 1));
  const op2 = useTransform(scrollYProgress, (sp) => chapOp(sp, 2));
  const op3 = useTransform(scrollYProgress, (sp) => chapOp(sp, 3));
  const op4 = useTransform(scrollYProgress, (sp) => chapOp(sp, 4));

  /* Exactly one chapter is interactive at a time — the dominant one.
     ─────────────────────────────────────────────────────────────────
     This was `opacity > 0.05 ? "auto" : "none"` per chapter, which is
     correct only while chapters are disjoint. Through a cross-dissolve
     both neighbours clear 0.05, so both were live: the outgoing chapter
     sits above the incoming one in DOM order and swallows taps meant
     for it. Widening the dissolve to a readable length turned that from
     a sliver into ~65vh of ambiguity.

     Dominance comes from getChapterFromProgress — the same function the
     chapter rail and the canvas colour grade already run on — rather than an
     argmax over the opacities. Both answer identically everywhere that
     matters, because that function switches at the dissolve midpoint, which
     is where the two curves cross. The difference is only at the crossing
     itself, and it is the whole point: smoothstep puts both chapters at
     exactly 0.5 there, so an argmax is deciding between equal floats and can
     flip on a rounding difference between the frame that wrote the opacity
     and the frame that read it. Measured, that showed up at 360x800 as the
     interactive chapter and the aria state disagreeing at sp=0.78.

     Reading position instead of opacity makes the handover a single
     deterministic switch, and makes rail, grade, pointer events and
     accessibility state agree by construction rather than by coincidence. */
  const dominant = useTransform(scrollYProgress, getChapterFromProgress);

  const pe0 = useTransform(dominant, (d) => (d === 0 ? "auto" : "none"));
  const pe1 = useTransform(dominant, (d) => (d === 1 ? "auto" : "none"));
  const pe2 = useTransform(dominant, (d) => (d === 2 ? "auto" : "none"));
  const pe3 = useTransform(dominant, (d) => (d === 3 ? "auto" : "none"));
  const pe4 = useTransform(dominant, (d) => (d === 4 ? "auto" : "none"));

  /* `aria-hidden` and `inert` are attributes, not styles, so they cannot ride
     a MotionValue — they need a render. This is the only per-scroll React
     state on the page and it changes five times over the whole page, not per frame.

     Without it a screen reader reads all five chapters as one continuous
     document and keyboard focus tabs into links sitting at opacity 0. `inert`
     covers the focus half, `aria-hidden` the announcement half; React 19
     passes both straight through. */
  const [activeChapter, setActiveChapter] = useState(0);
  useEffect(() => {
    setActiveChapter(dominant.get());
    return dominant.on("change", (d) => setActiveChapter(d));
  }, [dominant]);

  const y0 = useTransform(scrollYProgress, (sp) => chapY(sp, 0, yIn, yOut));
  const y1 = useTransform(scrollYProgress, (sp) => chapY(sp, 1, yIn, yOut));
  const y2 = useTransform(scrollYProgress, (sp) => chapY(sp, 2, yIn, yOut));
  const y3 = useTransform(scrollYProgress, (sp) => chapY(sp, 3, yIn, yOut));
  const y4 = useTransform(scrollYProgress, (sp) => chapY(sp, 4, yIn, yOut));

  // ── Origin's internal two-beat cross-fade ────────────────────────────────
  // Local progress inside chapter 0's band, then a single dissolve from the
  // hero (beat A) to the founder's voice (beat B). Reduced motion skips the
  // dissolve entirely and holds the hero, so nothing animates and no text is
  // ever mid-fade.
  const BEAT_FROM = 0.46;
  const BEAT_TO   = 0.60;
  const lp0 = useTransform(scrollYProgress, (sp) => {
    const [bIn, bOut] = CHAPTER_BANDS[0];
    return c01((sp - bIn) / (bOut - bIn));
  });
  const beatA = useTransform(lp0, (v) =>
    reduce ? 1 : 1 - eoo(c01((v - BEAT_FROM) / (BEAT_TO - BEAT_FROM))),
  );
  const beatB = useTransform(lp0, (v) =>
    reduce ? 0 : eoo(c01((v - BEAT_FROM) / (BEAT_TO - BEAT_FROM))),
  );
  const peA = useTransform(beatA, (v) => (v > 0.5 ? "auto" : "none"));
  const peB = useTransform(beatB, (v) => (v > 0.5 ? "auto" : "none"));

  // Local progress inside chapters 3 and 4 — the timeline the phone's
  // staged compositions run on. Computed unconditionally (hooks cannot be
  // conditional); desktop simply never reads them.
  const lp3 = useTransform(scrollYProgress, (sp) => {
    const [bIn, bOut] = CHAPTER_BANDS[3];
    return c01((sp - bIn) / (bOut - bIn));
  });
  const lp4 = useTransform(scrollYProgress, (sp) => {
    const [bIn, bOut] = CHAPTER_BANDS[4];
    return c01((sp - bIn) / (bOut - bIn));
  });

  return (
    <>
      {/* Ghost scroll track — provides TOTAL_VH of scroll travel and chapter anchor points */}
      <div className="relative" style={{ height: `${TOTAL_VH}vh` }}>
        {(["spark", "carbon-intelligence", "industrial", "recognition", "future"] as const).map((id, i) => (
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
        className="fixed inset-0 overflow-clip cinematic-stage-overlay"
        style={{ pointerEvents: "none" }}
      >
        <ScrollProgressBar progress={scrollYProgress} />

        {/* Chapter 0 — Origin (hero → founder voice, one chapter, two beats) */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: op0, y: y0, pointerEvents: pe0, willChange: wc }}
          aria-hidden={activeChapter !== 0}
          inert={activeChapter !== 0}
        >
          <OriginContent beatA={beatA} beatB={beatB} peA={peA} peB={peB} />
        </motion.div>

        {/* Chapter 1 — Material Intelligence */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op1, y: y1, pointerEvents: pe1, willChange: wc }}
          aria-hidden={activeChapter !== 1}
          inert={activeChapter !== 1}
        >
          <MaterialContent />
        </motion.div>

        {/* Chapter 2 — Industrial Translation */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op2, y: y2, pointerEvents: pe2, willChange: wc }}
          aria-hidden={activeChapter !== 2}
          inert={activeChapter !== 2}
        >
          <IndustrialContent />
        </motion.div>

        {/* Chapter 3 — Recognition & Ecosystem */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op3, y: y3, pointerEvents: pe3, willChange: wc }}
          aria-hidden={activeChapter !== 3}
          inert={activeChapter !== 3}
        >
          {mobile ? <RecognitionMobile lp={lp3} /> : <RecognitionEcosystemContent />}
        </motion.div>

        {/* Chapter 4 — Future Systems */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: op4, y: y4, pointerEvents: pe4, willChange: wc }}
          aria-hidden={activeChapter !== 4}
          inert={activeChapter !== 4}
        >
          {mobile ? <FutureMobile lp={lp4} /> : <FutureContent />}
        </motion.div>
      </div>
    </>
  );
}
