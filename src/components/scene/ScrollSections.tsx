import { useEffect, useRef, useState, type ReactNode } from "react";
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
  HANDOVER_IN,
  clamp01 as c01,
  smoothstep,
  fadeOutAt,
  fadeInAt,
} from "./chapterBands";
import { HOME_CHAPTER_IDS } from "./useChapterPhase";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

// The three Presidential plates are the site's own archive photographs — the
// same files, with the same captions, that /recognitions prints. They are laid
// over the film's hall as DOM, never burned into it: the hall and everything
// standing in it is generated, and these are not.
import awardKalam from "@/assets/hof/award-kalam.webp";
import awardPatil from "@/assets/hof/award-pratibha-patil.webp";
import awardPranab from "@/assets/hof/award-pranab-mukherjee.webp";

/* ──────────────────────────────────────────────────────────────────
   Mobile stage gate.

   Phones get a different *composition* of the same chapters, not a
   different site: where a laptop can hold a headline, three photographs
   and a link in one frame, a 360 px portrait viewport cannot. On mobile
   the two chapters that carry more than one thought are broken into
   successive states — one thought per frame — driven by the chapter's
   own scroll band. Desktop never enters this path.

   Breakpoint matches Tailwind's `md`, so the JS gate and the `md:`
   utilities in the markup always agree.

   Portrait only. These compositions are built for a tall frame: a
   full-width 4:3 photograph, text bands placed at fixed fractions of the
   height. On a phone narrower than 768px held sideways — 667x375,
   740x360 — the gate used to say "mobile" as well, and the photograph
   came out 500px tall in a 375px viewport with its caption and link off
   the bottom, while the closing chapter's bands landed on top of each
   other. Sideways, the laptop compositions are the ones that fit: they
   already step their optional rows back below 560px of height.
   ────────────────────────────────────────────────────────────────── */
function useIsMobileStage(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

/* ──────────────────────────────────────────────────────────────────
   Homepage = single sticky cinematic stage.
   Seven chapters. One viewport. Scroll is the timeline.

   The chapters are the film's seven scenes, in the film's order:

     01  Origin                    the workbench
     02  Early Works               the inventor at the bench
     03  Presidential Recognition  the hall
     04  Global Recognition        Earth
     05  Advanced Materials        the graphene lattice
     06  Industrial Impact         the solar viaduct, then the plant
     07  The Work Continues        the city

   They used to be five, in the page's own order — Origin, Material,
   Industrial, Recognition, Future — over a film that ran workbench,
   inventor, hall, Earth, lattice, industry, city. So the hall played
   behind "Engineering intelligent matter." and the lattice arrived under
   Future Systems. The copy now follows the footage, one headline per
   scene, and the film is cut so each scene lasts as long as its chapter:
   see CHAPTER_BANDS and "The story cut" in CLAUDE.md.
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
// Seven chapters on the same 1000vh: six hand-overs instead of four, so the
// holds are shorter than they were — about 66-70vh for four of the chapters,
// 100vh for Origin, 167vh for Presidential Recognition and 105vh for the close,
// which never has to leave. Each chapter therefore carries one headline, one or two lines and
// one link, and nothing longer. The page was not lengthened to buy the holds
// back: it was shortened once on purpose.
const TOTAL_VH = 1100;

// The closing index. The homepage has no footer, and the stage is fixed, so
// this row is the one place in the page body that links every section the
// seven chapters do not already point at. About and Contact are the two
// buttons directly above it, so they are not repeated here.
const INDEX = [
  { to: "/early-works", label: "Early Works" },
  { to: "/innovations", label: "Innovations" },
  { to: "/ventures", label: "Ventures" },
  { to: "/recognitions", label: "Recognitions" },
  { to: "/voices", label: "Voices" },
  { to: "/essays", label: "Essays" },
  { to: "/news", label: "News" },
  { to: "/engage", label: "Engage" },
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
  className = "",
}: {
  align?: "left" | "right" | "center";
  strength?: number;
  /** Extra classes — used to show a shield at some breakpoints only. */
  className?: string;
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
      className={`pointer-events-none absolute inset-0 ${className}`}
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
   Chapter eyebrow — "03 · Presidential Recognition".

   The number is the chapter's place among the film's seven scenes, the
   same convention the internal pages use for their numbered sections.
   ────────────────────────────────────────────────────────────────── */
function Eyebrow({
  n,
  children,
  className = "",
}: {
  n: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] [@media(max-width:340px)]:tracking-[0.3em] text-primary ${className}`}>
      <span className="text-foreground/85">{n}</span>
      {" · "}
      {children}
    </p>
  );
}

// Below 340px of width the tracking steps in: at 0.4em "View Presidential
// Archive →" is 297px in a 272px column, and the arrow wrapped onto a line of
// its own.
const CHAPTER_LINK =
  "inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] [@media(max-width:340px)]:tracking-[0.28em] text-foreground/85 hover:text-foreground transition-colors";

/* ──────────────────────────────────────────────────────────────────
   Chapter 0 — Origin (id="spark"). Film: the workbench.

   The opening line used to be the site's signature, "I build what does
   not yet exist." That line is now where the story ends — chapter 7 —
   and the page opens on the sentence the film's first scene is about.
   This is still the document's one <h1>: it is the first heading a
   reader, a crawler or a screen reader meets, and the closing line is an
   <h2> like every other chapter heading.

   The credential strip that sat under the old headline (06 Presidential
   Awards · 25 Innovations · 06 Ventures · TED · MIT TR) is gone from this
   frame. Every figure in it is still on the page, each in the chapter
   that is about it; stating them all on the first screen told the ending
   before the story had started.
   ────────────────────────────────────────────────────────────────── */
function OriginHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-5 sm:px-6 [@media(max-height:560px)]:pt-14">
      {/* Origin: a dark workbench under one lamp — moderate centre shield */}
      <ContentShield align="center" strength={0.56} />

      <div className="relative z-10 max-w-4xl text-center">
        {/* Eyebrow */}
        <div className="mb-10 md:mb-12 [@media(max-height:560px)]:mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-foreground/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-foreground/70">
            01 · Origin
          </span>
          <span className="h-px w-8 bg-foreground/20" />
        </div>

        {/* H1 */}
        {/* The three lines are `block` spans, so JSX drops the whitespace
            between them and textContent would read "Every inventionbegins
            with a problemworth solving." for anything that does not run CSS.
            An explicit space restores each boundary; the spans are
            block-level, so it collapses and costs nothing on screen.

            The size is smaller than the old three-word-a-line headline's:
            "begins with a problem" is the longest line and has to clear a
            350px column at 390 wide and the 896px measure at 1440. */}
        <h1 className="font-display text-[clamp(1.85rem,min(6.4vw,11.5vh),4.75rem)] [@media(max-width:340px)]:text-[1.6rem] leading-[1.04] md:leading-[1.0] tracking-[-0.035em] md:tracking-[-0.04em] font-medium">
          <span className="block py-1 text-gradient">Every invention</span>{" "}
          <span className="block py-1 text-gradient">begins with a problem</span>{" "}
          <span className="block py-1 text-foreground/95">worth solving.</span>
        </h1>

        {/* Supporting line */}
        <p className="mx-auto mt-10 md:mt-14 [@media(max-height:560px)]:mt-5 max-w-xl font-display text-[14.5px] md:text-[16px] leading-[1.6] tracking-[-0.005em] text-foreground/80 [text-wrap:balance]">
          {/* Two lines everywhere, as a laptop sets it. Left to balance on a
              phone, it fitted on one line in the iPhone's face and ran edge
              to edge under a headline two thirds its width — a 390px iPhone,
              read off the owner's recording; Inter, wider, had wrapped it. */}
          A young inventor. A workbench.{" "}
          <br />
          The beginning of a journey.
        </p>
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
   Chapter 1 — Early Works (id="early-works"). Film: the inventor at
   the bench.

   Six inventions, 2008 to 2013: the count, the years and the four
   fields named here are /early-works' own — Mobility Safety, Assistive
   Technology, Off-Grid Energy and Energy Harvesting, Wearable Safety.

   The man is centre frame with his face in the upper half. On a laptop
   the copy takes the right-hand column, over the shelves. On a phone the
   frame is a centre crop with his face at 10-45% of its height, so the
   copy is a lower third and the scrim rises from the foot instead of
   coming in from the side: the face stays clear and the type sits over
   the bench.
   ────────────────────────────────────────────────────────────────── */
function EarlyWorksContent() {
  return (
    <div className="relative w-full h-full flex items-end pb-[17vh] md:items-center md:pb-0 stage-ls:items-center stage-ls:pb-0 px-5 sm:px-6 lg:pl-32 xl:pl-36 stage-ls:pt-14">
      <ContentShield align="right" strength={0.8} className="hidden md:block" />
      <div
        aria-hidden
        className="md:hidden pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 36%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.82) 68%, rgba(0,0,0,0.90) 100%)",
        }}
      />

      {/* 12-col grid, content in cols 7-12 */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl md:grid-cols-12">
        <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <Eyebrow n="02" className="mb-4 md:mb-6 stage-ls:mb-3">
            Early Works
          </Eyebrow>
          <h2 className="font-display text-[clamp(1.9rem,min(4.4vw,9.5vh),3.5rem)] leading-[1.06] tracking-[-0.03em] font-medium text-gradient">
            <span className="block">Six years.</span>{" "}
            <span className="block">Six inventions.</span>{" "}
            <span className="block">One purpose.</span>
          </h2>
          <p className="mt-5 md:mt-7 stage-ls:mt-4 font-mono text-[10.5px] uppercase tracking-[0.3em] text-foreground/75">
            2008–2013
          </p>
          {/* Balanced: unbalanced, a 390px iPhone left "wearable safety." on a
              line of its own under one that ran to the margin. */}
          <p className="mt-2.5 max-w-[26rem] text-[14.5px] md:text-base leading-relaxed text-foreground/80 [text-wrap:balance]">
            From vehicle safety and assistive technology to energy and wearable safety.
          </p>
          <Link to="/early-works" className={`mt-6 md:mt-9 stage-ls:mt-5 ${CHAPTER_LINK}`}>
            Explore Early Works →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 2 — Presidential Recognition (id="presidential"). Film: the
   hall.

   The centre of the page, and the one chapter where the film is not the
   picture. The hall is generated: its trophies, the framed "ceremony"
   photographs in its cases and the emblems on its plinths were made by
   the same model that made the room. None of it is evidence of anything,
   and none of it is counted — the headline says six because the record
   says six, not because of how many plinths the camera passes.

   So the hall is veiled down to a dim gold room, and the three archive
   photographs stand in front of it: the same files /recognitions prints,
   with the captions it gives them. They are DOM, laid over the film, so
   they are never part of the footage and can be replaced without
   touching a frame. The row sits across the middle band of the frame,
   which is where the hall's own cases are.

   "Three Presidents of India", never "three sitting Presidents":
   Dr. Kalam left office in 2007, and the ledger titles his two citations
   "Former President of India Award".
   ────────────────────────────────────────────────────────────────── */
type Plate = {
  src: string;
  w: number;
  h: number;
  caption: string;
  meta: string;
  focus: string;
};

const PRESIDENTIAL_PLATES: readonly Plate[] = [
  {
    src: awardKalam,
    w: 1195,
    h: 896,
    caption: "With Dr. A.P.J. Abdul Kalam",
    meta: "Presidential Award · NIF · 2009",
    focus: "center 30%",
  },
  {
    src: awardPatil,
    w: 1172,
    h: 912,
    caption: "With President Pratibha Patil",
    meta: "Presidential Award · 2010",
    focus: "center",
  },
  {
    src: awardPranab,
    w: 1183,
    h: 896,
    caption: "With President Pranab Mukherjee",
    meta: "Presidential Award · 2013",
    focus: "left top",
  },
];

/* ── Entrance, laptop composition ────────────────────────────────────
   The chapter's wrapper fades in across the last 0.030 of scroll before
   its band begins, as every chapter's does. Inside that same window the
   parts of this one arrive in reading order: the headline with the
   wrapper, the note just behind it, the three photographs left to right,
   then the line under them.

   Everything is complete by the band's first pixel, not shortly after
   it. The chapter rail jumps to exactly that pixel, so a reveal that ran
   on into the hold would leave a visitor who clicked "Presidential
   Recognition" looking at a half-arrived gallery, at rest. The windows
   are therefore fractions of the fade-in itself, and the last one closes
   at 0.95 of it.

   The photographs start 0.20 of the window apart — 6vh of scrolling,
   about a tenth of a second at the pace this page is usually scrolled.
   It is scroll-linked like everything else on the stage: stop half-way
   and it stops, scroll back and it runs backwards. Nothing here is on a
   clock.
   ────────────────────────────────────────────────────────────────── */
const PRES_ENTER_SPAN = CONTENT_FADE * (1 - HANDOVER_IN);
const PRES_ENTER_FROM = CHAPTER_BANDS[2][0] - PRES_ENTER_SPAN;
type RevealWindow = readonly [number, number];
const PRES_NOTE: RevealWindow = [0.05, 0.5];
const PRES_PLATES: readonly RevealWindow[] = [
  [0.1, 0.55],
  [0.3, 0.75],
  [0.5, 0.95],
];
const PRES_FOOT: RevealWindow = [0.55, 0.95];
const PRES_RISE = 12; // px a part travels upward as it arrives

function useReveal(sp: MotionValue<number>, [from, to]: RevealWindow, rise: number) {
  const opacity = useTransform(sp, (v) => {
    const t = (v - PRES_ENTER_FROM) / PRES_ENTER_SPAN;
    return smoothstep(c01((t - from) / (to - from)));
  });
  const y = useTransform(opacity, (o) => (1 - o) * rise);
  return { opacity, y };
}

/* The hall is the brightest sustained footage in the film — a lit gold room,
   edge to edge — and this chapter's copy runs the full width of it, so no
   side scrim can cover the type. A veil over the whole frame.

   Its shape follows what is in the room, not only where the type is. The top
   third of the frame is architecture: arches, a chandelier, the ceiling. From
   about 43% down it is the hall's display cases, their trophies and framed
   "ceremony" pictures, and plinths carrying the State Emblem — all of it
   generated, none of it evidence. The first veil was lightest across exactly
   that band, 0.60, and heaviest at the head, 0.80: backwards on both counts.
   So the head now lets the architecture through, 0.62 between the header and
   the copy, and the band the cases stand in is the darkest part of the frame,
   which is also the ground the photographs' captions sit on.

   The headline does not sit on 0.62. `HeadScrim` travels with the copy and
   brings its own band back to 0.72 wherever on the frame the block lands —
   the block's top runs from 17% of the height on a short laptop to 27% on a
   1080p screen, so no stop in a frame-sized gradient can be "just above the
   headline" for all of them. What is left lighter is whatever lies between
   the header and the copy: a wide band on a tall screen, nothing at all on a
   phone held sideways.

   A phone held upright has no band to open: its headline starts at 13.6% of
   the height, straight under the header. It keeps a plain veil, with the
   same darker ground under the photograph that the laptop has under its
   three. */
const HALL_VEIL = {
  laptop:
    "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.78) 8%, rgba(0,0,0,0.62) 13%, rgba(0,0,0,0.62) 30%, rgba(0,0,0,0.76) 46%, rgba(0,0,0,0.80) 100%)",
  phone:
    "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.76) 56%, rgba(0,0,0,0.80) 100%)",
} as const;

function HallVeil({ variant }: { variant: keyof typeof HALL_VEIL }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: HALL_VEIL[variant] }}
    />
  );
}

/* Behind the eyebrow, the headline and the note, wherever they are. It bleeds
   past both edges of the frame — the stage clips it — and fades in over the
   2.25rem above the block and out over the 2rem below the headline row, so
   there is no line across the hall where it starts or stops. 0.27 over the
   veil's 0.62 is 0.72, a hair more than the 0.71-0.72 the eyebrow stood on
   before. Negative z-index inside the block's own stacking context: above
   the veil, below the type. */
function HeadScrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -z-10 left-[-50vw] right-[-50vw] -top-9 -bottom-8"
      style={{
        background:
          "linear-gradient(180deg, transparent 0, rgba(0,0,0,0.27) 2.25rem, rgba(0,0,0,0.27) calc(100% - 2rem), transparent 100%)",
      }}
    />
  );
}

function ArchivePlate({ plate, armed }: { plate: Plate; armed: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  // Decode ahead of the hand-over rather than inside it. The plates mount a
  // chapter early, at opacity 0; without this the first paint of each one
  // could land in the middle of the dissolve that reveals it.
  useEffect(() => {
    if (!armed) return;
    ref.current?.decode?.().catch(() => {});
  }, [armed]);

  return (
    <figure className="min-w-0">
      <div className="archive-grade-wrap relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[oklch(0.08_0.006_250)] ring-1 ring-foreground/[0.16] shadow-[0_28px_64px_-30px_oklch(0_0_0/0.95)]">
        {armed && (
          <img
            ref={ref}
            src={plate.src}
            alt={`${plate.caption}. ${plate.meta}.`}
            width={plate.w}
            height={plate.h}
            decoding="async"
            draggable={false}
            className="archive-grade absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: plate.focus }}
          />
        )}
      </div>
      {/* Caption below the photograph, never on it: nothing here has to be
          legible against a picture. Two block spans, so an explicit space
          keeps "…Abdul Kalam" and "Presidential Award…" apart in the text
          stream.

          The second line is 10.5px from xl up and no sooner. "Presidential
          Award · NIF · 2009" is 31 monospace characters at 0.2em tracking:
          248px at 10px and 260px at 10.5px, whatever the face. A plate is
          265px wide at 1024 — 260px beside a classic scrollbar — and 251px
          on an 834px tablet, so the half pixel would have wrapped the first
          caption there and left the other two on one line. At 1280 a plate
          is 340px. */}
      <figcaption className="mt-2.5 md:mt-3">
        <span className="block font-display text-[13.5px] md:text-[15px] leading-snug tracking-[-0.01em] text-foreground/95">
          {plate.caption}
        </span>{" "}
        <span className="mt-1 block font-mono text-[9.5px] md:text-[10px] xl:text-[10.5px] uppercase tracking-[0.2em] text-foreground/95 [@media(orientation:landscape)_and_(max-height:340px)]:hidden">
          {plate.meta}
        </span>
      </figcaption>
    </figure>
  );
}

function PresidentialContent({
  armed,
  sp,
  rise,
  wc,
}: {
  armed: boolean;
  sp: MotionValue<number>;
  rise: number;
  wc: string;
}) {
  const note = useReveal(sp, PRES_NOTE, rise);
  const plate0 = useReveal(sp, PRES_PLATES[0], rise);
  const plate1 = useReveal(sp, PRES_PLATES[1], rise);
  const plate2 = useReveal(sp, PRES_PLATES[2], rise);
  const foot = useReveal(sp, PRES_FOOT, rise);
  const plates = [plate0, plate1, plate2];

  return (
    /* Symmetric gutters sized to the chapter rail (68px backing panel), and
       pt matching the fixed header, so the block centres in the frame below
       the chrome rather than in the raw viewport. This is the tallest
       composition on the page. */
    <div className="relative w-full h-full flex items-center justify-center px-5 sm:px-6 lg:px-24 xl:px-28 md:pt-[68px] max-md:stage-ls:pt-14">
      <HallVeil variant="laptop" />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="relative">
          <HeadScrim />
          <Eyebrow n="03" className="mb-4 md:mb-5 [@media(max-height:560px)]:mb-2.5">
            Presidential Recognition
          </Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-5">
            <h2 className="font-display text-[clamp(1.5rem,min(4.1vw,7.6vh),3.4rem)] leading-[1.05] tracking-[-0.03em] font-medium text-gradient">
              <span className="block">Six Presidential Awards.</span>{" "}
              <span className="block">Three Presidents of India.</span>
            </h2>
            <motion.div
              className="max-w-[23rem] pb-1 [@media(max-height:560px)]:hidden"
              style={{ opacity: note.opacity, y: note.y, willChange: wc }}
            >
              <p className="font-mono text-[10.5px] uppercase tracking-[0.3em] text-foreground/75">
                2008–2013
              </p>
              {/* One statement to a line, the way the headline beside it is set.
                  As a single run it wrapped after "…invention that" and left
                  "continues today." on a line of its own. It stood under
                  "National recognition for early inventions." until the owner
                  had that line removed: the two said the same thing twice.
                  Block spans, so the explicit space keeps the sentences apart
                  in the text stream. */}
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">
                <span className="block">Six national recognitions.</span>{" "}
                <span className="block">A journey of invention that continues today.</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* The row is capped by viewport height as well as by the column.
            Three 4:3 plates of height H are 4H wide plus the gaps, and the
            rest of this block — eyebrow, headline, captions, the line under
            the gallery — and the header above it take about 400px between
            them, so the plates get what is left: 400vh - 1552px of width.
            That only bites below about 650px of height. Under it the row
            falls back to 92vh of width, which on a phone held sideways is
            three plates about 80px tall: small, but nothing is clipped and
            nothing scrolls inside the chapter. The line under the gallery
            shares the cap, so its two ends sit under the gallery's edges. */}
        <div style={{ maxWidth: "clamp(15rem, max(calc(400vh - 1552px), 92vh), 100%)" }}>
          <div className="mt-7 lg:mt-9 [@media(max-height:560px)]:mt-3 grid grid-cols-3 gap-4 lg:gap-5">
            {PRESIDENTIAL_PLATES.map((p, i) => (
              <motion.div
                key={p.caption}
                className="min-w-0"
                style={{ opacity: plates[i].opacity, y: plates[i].y, willChange: wc }}
              >
                <ArchivePlate plate={p} armed={armed} />
              </motion.div>
            ))}
          </div>

          {/* What the three are, and where the rest is. Two flex items, so
              the explicit space keeps "…2008–2013" and "View Presidential
              Archive" apart for anything that does not execute CSS. Below
              560px of height the caption is one of the rows that steps
              back, and the link keeps its place. */}
          <motion.div
            className="mt-6 lg:mt-7 [@media(max-height:560px)]:mt-2 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3"
            style={{ opacity: foot.opacity, y: foot.y, willChange: wc }}
          >
            <p className="text-[12.5px] lg:text-[13px] leading-snug text-foreground/85 [@media(max-height:560px)]:hidden">
              Selected moments from the Presidential recognition archive · 2008–2013
            </p>{" "}
            <Link to="/recognitions" className={CHAPTER_LINK}>
              View Presidential Archive →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 2 — Presidential Recognition, phone composition.

   Three 4:3 photographs do not fit beside a headline on a 390px screen,
   and at a third of the width each they are too small to be looked at.
   So the statement holds for the whole chapter and the photographs turn
   over beneath it, one at a time at full width, each with its own
   caption: 2009, 2010, 2013.

   The three states have to finish inside the chapter's hold, not inside
   its band. The last 0.060 of every band is the hand-over to the next
   chapter, and for this one that is the final 29% of local progress — a
   first version timed the third photograph to arrive at 0.775, where the
   whole chapter was already at half opacity and falling, so the 2013
   plate never once appeared in full. Everything here is laid out on
   [0, HOLD] instead: three holds of 0.209 and two hand-overs of 0.055,
   which is about 47vh of scrolling for each photograph.
   ────────────────────────────────────────────────────────────────── */
function PresidentialMobile({
  lp,
  armed,
}: {
  lp: MotionValue<number>;
  armed: boolean;
}) {
  // Local progress at which the chapter itself starts to leave.
  const [bIn, bOut] = CHAPTER_BANDS[2];
  const HOLD = (bOut - bIn - CONTENT_FADE) / (bOut - bIn);
  const span = (HOLD - 2 * STAGE_FADE) / 3;
  const from = (i: number) => i * (span + STAGE_FADE);
  const op0 = useTransform(lp, (v) => stageOp(v, 0, span));
  const op1 = useTransform(lp, (v) => stageOp(v, from(1), from(1) + span));
  const op2 = useTransform(lp, (v) => stageOp(v, from(2), 1, true));
  const plateOps = [op0, op1, op2];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <HallVeil variant="phone" />

      <div className="absolute inset-x-6 top-[13.5%] z-10">
        <Eyebrow n="03" className="mb-3.5">
          Presidential Recognition
        </Eyebrow>
        <h2 className="font-display text-[clamp(1.35rem,6.4vw,1.6rem)] leading-[1.12] tracking-[-0.03em] font-medium text-gradient">
          <span className="block">Six Presidential Awards.</span>{" "}
          <span className="block">Three Presidents of India.</span>
        </h2>
      </div>

      {/* One archive photograph at a time. They share a box, so they hand
          over in sequence like every other staged state on this page. */}
      {/* The photograph's box is placed, not flowed, so it has to clear the
          headline at every size. On a 320x568 phone 27.5% left four pixels
          under the second line — and nothing at all once the eyebrow wrapped,
          which at 0.42em tracking it did: "Three Presidents of India." sat
          behind the picture. The eyebrow now fits that width, and under 600px
          of height the box starts lower. */}
      <div className="absolute inset-x-6 top-[27.5%] stage-ps:top-[30%] z-10">
        {/* Reserves the height of a plate and its caption, so the copy below
            sits in the same place whichever photograph is showing. */}
        <div className="invisible" aria-hidden>
          <div className="aspect-[4/3]" />
          <div className="mt-2.5 h-[2.6rem]" />
        </div>
        {PRESIDENTIAL_PLATES.map((p, i) => (
          <motion.div
            key={p.caption}
            className="absolute inset-0"
            style={{ opacity: plateOps[i] }}
          >
            <ArchivePlate plate={p} armed={armed} />
          </motion.div>
        ))}
        {/* On a phone under 700px tall the photograph, its caption, these two
            lines and the link do not all clear the action bar, so the lines
            step back and the link keeps its place. */}
        <p className="mt-5 max-w-[36ch] text-[14.5px] leading-[1.55] text-foreground/80 [text-wrap:balance] [@media(max-height:700px)]:hidden">
          Six national recognitions. A journey of invention that continues today.
        </p>
        <p className="mt-2.5 max-w-[40ch] text-[12px] leading-[1.5] text-foreground/85 [@media(max-height:700px)]:hidden">
          Selected moments from the Presidential recognition archive · 2008–2013
        </p>
        <Link to="/recognitions" className={`mt-5 ${CHAPTER_LINK}`}>
          View Presidential Archive →
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 3 — Global Recognition (id="recognition"). Film: Earth, with
   arcs leaving India.

   A dated register rather than a sentence. Every row is a line of the
   ledger on /recognitions, in that page's own words and with its years:
   TR-35 from MIT Technology Review, Intel IRIS and the INK fellowship in
   2010, NASA in 2011, TED@Bangalore in 2012, MIT Fab-10 and Fab-11 in
   2013-14. The INK row is one of the four on that page that carry an
   evidence link — to the organisation's own profile of him.

   Six rows is the most this chapter holds. On a 320x568 phone two of
   them wrap, and the list, the headline and the link then have 463px
   between the header and the action bar: the year column and the row
   padding step in below 340px of width and 600px of height to make that.

   The NASA row says where — Huntsville, Alabama — and nothing about
   what for. The film's Earth shot carried a generated NASA insignia and
   it was painted out of the frames; a satellite in the background is
   scenery, not a claim about a mission.

   The globe fills the left two thirds of the frame and India sits just
   left of centre, so the copy takes the right-hand column: the arcs and
   their origin stay in view.
   ────────────────────────────────────────────────────────────────── */
const HONOURS = [
  { year: "2010", title: "MIT Technology Review", note: "TR-35" },
  { year: "2010", title: "Intel IRIS", note: "Best Popular Invention" },
  { year: "2010", title: "INK Talks", note: "Fellow" },
  { year: "2011", title: "NASA recognition", note: "Huntsville, Alabama" },
  { year: "2012", title: "TED@Bangalore", note: "Speaker" },
  { year: "2013–14", title: "MIT Fab-10 & Fab-11", note: "Awardee" },
] as const;

function GlobalContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 xl:pl-36 stage-ls:pt-14 md:stage-ls:pt-[72px]">
      <ContentShield align="right" strength={0.82} className="hidden md:block" />
      {/* Phones show the centre of the frame, which is the globe itself —
          there is no dark side to stand the copy on, so it takes the centre
          shield. */}
      <ContentShield align="center" strength={0.8} className="md:hidden" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl md:grid-cols-12">
        <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <Eyebrow n="04" className="mb-4 md:mb-6 stage-ls:mb-3 [@media(orientation:landscape)_and_(max-height:340px)]:hidden">
            Global Recognition
          </Eyebrow>
          <h2 className="font-display text-[clamp(1.75rem,min(4.4vw,8vh),3.5rem)] leading-[1.06] tracking-[-0.03em] font-medium text-gradient">
            <span className="block">From India to</span>{" "}
            <span className="block">the global stage.</span>
          </h2>

          <ul className="mt-7 md:mt-9 stage-ps:mt-4 stage-ls:mt-2 max-w-[27rem]">
            {HONOURS.map((h) => (
              /* A baseline flex row, so the year, the name and the note are
                 three flex items and their text would otherwise run together
                 for anything that does not execute CSS. The explicit spaces
                 are dropped from layout and kept in the text stream. */
              <li
                key={h.title}
                className="flex items-baseline gap-4 [@media(max-width:340px)]:gap-3 border-t border-foreground/[0.12] py-2.5 md:py-3 stage-ps:py-1.5 stage-ls:py-0.5"
                style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.75)" }}
              >
                <span className="w-[4.1rem] [@media(max-width:340px)]:w-[3.4rem] shrink-0 font-mono text-[10px] md:text-[10.5px] tracking-[0.16em] text-foreground/95">
                  {h.year}
                </span>{" "}
                <span className="min-w-0">
                  <span className="font-display text-[14.5px] md:text-[16px] tracking-[-0.01em] text-foreground/95">
                    {h.title}
                  </span>
                  <span className="text-foreground/35">{" · "}</span>
                  <span className="text-[12.5px] md:text-[14px] text-foreground/85">{h.note}</span>
                </span>
              </li>
            ))}
          </ul>

          <Link to="/recognitions" className={`mt-6 md:mt-8 stage-ps:mt-4 stage-ls:mt-3 ${CHAPTER_LINK}`}>
            Explore Recognitions →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 4 — Advanced Materials (id="carbon-intelligence"). Film: the
   graphene lattice.
   ────────────────────────────────────────────────────────────────── */
function MaterialContent() {
  return (
    /* The lattice has one labelled atom, a "C" sitting dead centre of the
       frame, and both first layouts ran type through it. On a laptop the
       headline was two long lines and "materials." ended on the atom; on a
       phone the frame is a centre crop, the block was centred, and the "C"
       showed through the middle of the word. So the headline is three short
       lines, which end well left of centre, and on a phone the block is a
       lower third with the atom clear above it. */
    <div className="relative w-full h-full flex items-end pb-[15vh] md:items-center md:pb-0 stage-ls:items-center stage-ls:pb-0 px-5 sm:px-6 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20 stage-ls:pt-14">
      {/* Left column. This strength follows the footage and has moved with it
          three times — 0.82 for the original bright-metallic plate, 0.62 when
          the film behind it became a dim lab, 0.82 again when the inventor
          film put a lit workshop and the hall here, and it is now measured
          against the lattice, which is what this chapter finally sits on. */}
      <ContentShield align="left" strength={0.82} className="hidden md:block" />
      <div
        aria-hidden
        className="md:hidden pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.50) 54%, rgba(0,0,0,0.80) 70%, rgba(0,0,0,0.90) 100%)",
        }}
      />
      <div className="relative z-10 mr-auto text-left max-w-2xl">
        {/* Decorative line */}
        <div className="h-px w-20 md:w-24 mb-6 md:mb-7 stage-ls:mb-3 bg-gradient-to-r from-primary via-accent to-transparent" />
        <Eyebrow n="05" className="mb-4 md:mb-6 stage-ls:mb-3">
          Advanced Materials
        </Eyebrow>
        <h2 className="font-display text-[clamp(1.9rem,min(5.2vw,10vh),4rem)] leading-[1.04] tracking-[-0.025em] font-medium text-gradient mb-5 md:mb-7 stage-ls:mb-3">
          <span className="block">From inventions</span>{" "}
          <span className="block">to intelligent</span>{" "}
          <span className="block">materials.</span>
        </h2>
        <p className="text-[15px] md:text-lg text-foreground/80 leading-relaxed max-w-md">
          Graphene and advanced materials became the next chapter of the work.
        </p>
        {/* The technical claim is a laptop-sized sentence. On a phone it would
            be five more lines over the lattice, so the frame carries the one
            sentence above and this stays in the document. */}
        <p className="hidden md:block stage-ls:hidden mt-3 text-base text-foreground/70 leading-relaxed max-w-md">
          A single sheet of carbon, made cleanly and at scale, changes what concrete, batteries, coatings and composites can do.
        </p>
        <Link to="/innovations" className={`mt-6 md:mt-10 stage-ls:mt-4 ${CHAPTER_LINK}`}>
          Explore Innovations →
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 5 — Industrial Impact (id="industrial"). Film: the solar
   viaduct, then the plant.

   Five industries and four product names. Each name is a product on
   /innovations in the industry beside it: Graphacrete in Construction ·
   Cement, Graffisol in Solar · Coatings, Graphenodes in Energy Storage ·
   Electrodes, Thermene in Thermal · Interfaces. Composites has no name
   here because the brief that set this copy named four.

   What each one is comes from its own catalogue entry, cut to a noun
   phrase — not from the brief that asked for descriptors, whose "Graphene
   Thermal Management" and "Advanced Battery Materials" are not how the
   catalogue describes those products:
     Graphacrete  "Graphene nano-platelet admixture transforming standard
                  concrete into a high-performance material."
     Graffisol    "Solar coating delivering higher annual yield, …"
     Graphenodes  "…graphene polymer cathode and anode materials for
                  high-density batteries", in Energy Storage · Electrodes
     Thermene     "Graphene-loaded thermal interface compound. …"
   Each descriptor carries the industry the line above names for it, in
   the same order. None is a performance claim.
   ────────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  { name: "Graphacrete", what: "Concrete admixture" },
  { name: "Graffisol", what: "Solar coating" },
  { name: "Graphenodes", what: "Battery electrode materials" },
  { name: "Thermene", what: "Thermal interface compound" },
] as const;

function IndustrialContent() {
  return (
    <div className="relative w-full h-full flex items-center px-5 sm:px-6 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20 stage-ls:pt-14">
      {/* Text on the right. This is daylight footage — green ground, grey
          deck, a white plant building in exactly this corner — so the shield
          is the strongest side shield on the page. */}
      <ContentShield align="right" strength={0.88} />
      {/* Below md the copy is left-aligned, so the right-side shield is
          strongest where there is no text and absent where the lines begin.
          A left shield, phones only, on top of the right one. */}
      <ContentShield align="left" strength={0.7} className="md:hidden" />
      <div className="relative z-10 ml-auto md:text-right max-w-2xl">
        {/* Decorative line */}
        {/* At the copy's own edge: flush right where the copy is, which is
            from md up, and flush left below that, the way chapter 5 sets its
            rule. It stayed at the right edge on a phone, over copy that starts
            at the left. */}
        <div className="h-px w-20 md:w-24 mb-7 stage-ls:mb-3 md:ml-auto bg-gradient-to-r md:bg-gradient-to-l from-primary via-accent to-transparent" />
        <Eyebrow n="06" className="mb-6 stage-ls:mb-3">
          Industrial Impact
        </Eyebrow>
        <h2 className="font-display text-[clamp(1.75rem,min(4.6vw,9.5vh),3.6rem)] [@media(max-width:340px)]:text-[1.55rem] leading-[1.05] tracking-[-0.025em] font-medium text-gradient mb-7 stage-ls:mb-3">
          <span className="block">One material platform.</span>{" "}
          <span className="block">Many industries.</span>
        </h2>
        {/* On a phone held sideways the sentence takes the column's width
            and one line instead of two. On one under 340px tall it steps
            back: the four rows under it name four of its five industries.
            When the rows first went in, the chapter ran 28px into the header
            and 36px off the foot at 568x320. */}
        <p
          className="text-[15px] md:text-base text-foreground/85 leading-relaxed max-w-[26rem] stage-ls:max-w-none ml-auto [@media(orientation:landscape)_and_(max-height:340px)]:hidden"
          style={{ textShadow: "0 1px 10px oklch(0.02 0.006 260 / 0.8)" }}
        >
          Concrete. Solar. Batteries. Thermal management. Advanced composites.
        </p>
        {/* One product to a row: the name as the label it was, then what it
            is. Flush right on a laptop like everything else in the column,
            flush left on a phone. The row's size is the descriptor's, so
            the line height is set by the text in it: left at the inherited
            16px, four rows stood 28px apart. */}
        <ul
          className="mt-4 stage-ls:mt-2 max-w-[26rem] ml-auto"
          style={{ textShadow: "0 1px 8px oklch(0.02 0.006 260 / 0.85)" }}
        >
          {PRODUCTS.map((p) => (
            <li
              key={p.name}
              className="text-[13px] md:text-[13.5px] leading-[1.7] stage-ls:leading-[1.5]"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/85">
                {p.name}
              </span>
              <span className="text-foreground/35">{" · "}</span>
              <span className="text-foreground/80">{p.what}</span>
            </li>
          ))}
        </ul>
        {/* Ventures — the commercial expression of the platform. */}
        <p
          className="mt-6 stage-ls:mt-2 text-sm md:text-[15px] text-foreground/70 leading-relaxed max-w-[26rem] ml-auto"
          style={{ textShadow: "0 1px 10px oklch(0.02 0.006 260 / 0.8)" }}
        >
          Six operating companies carry that platform into industry.
        </p>
        {/* Link row */}
        <div className="mt-9 stage-ls:mt-4 flex flex-wrap items-center justify-start md:justify-end gap-x-8 gap-y-3">
          <Link to="/innovations" className={CHAPTER_LINK}>
            See the Work →
          </Link>{" "}
          <Link to="/ventures" className={CHAPTER_LINK}>
            View Ventures →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 6 — The Work Continues (id="future"). Film: the city.

   Where the story lands: the name, then the line the site is known by.
   "I build what does not yet exist." opened the page until the copy was
   set to the film; it closes it now, in the same three-line form.

   The founder's line — "The future is not imagined. It is engineered
   quietly." — used to be Origin's second beat. It is the only place on
   the site that sentence appears, so it moved here rather than being
   dropped, and this is the chapter it was always about.

   Four of the five roles are stated elsewhere on the site: inventor
   throughout, "serial entrepreneur" in the press on /news, TED@Bangalore
   and sixty keynotes on /recognitions, six companies advised on
   /ventures. Mentor is not; it is here on the owner's word, given on
   2026-11-18, and it is last because that is where the storyline put it.
   25 and 6 are the catalogue on /innovations and the roster on /ventures.
   ────────────────────────────────────────────────────────────────── */
const ROLES = ["Inventor", "Entrepreneur", "Speaker", "Advisor", "Mentor"] as const;

/* One row on a laptop. On a phone the five do not fit on a line at any
   tracking that still reads as a label, and a wrapping row strands a word
   on a line of its own, so `rows` sets them as two rows by design: the
   first two, then the other three. The second row is the wider, and at
   10px it is 258px, inside a 320px phone's 272. The separator between the
   rows is still in the text stream. */
function RoleLine({
  className = "",
  rows = false,
}: {
  className?: string;
  rows?: boolean;
}) {
  const dot = <span className="mx-2.5 text-foreground/30">{" · "}</span>;
  if (rows) {
    return (
      <p className={`font-mono uppercase ${className}`}>
        <span className="block">
          {ROLES[0]}
          {dot}
          {ROLES[1]}
        </span>
        <span className="sr-only"> · </span>
        <span className="mt-1.5 block">
          {ROLES[2]}
          {dot}
          {ROLES[3]}
          {dot}
          {ROLES[4]}
        </span>
      </p>
    );
  }
  return (
    <p className={`flex flex-wrap items-center justify-center gap-y-1.5 font-mono uppercase ${className}`}>
      {ROLES.map((r, i) => (
        <span key={r} className="inline-flex items-center whitespace-nowrap">
          <span>{r}</span>
          {/* The separator trails its item, so a wrap never starts a line
              with a dot. Margin for the eye, a literal space for the text
              stream — flex trims a leading space in an item's own text. */}
          {i < ROLES.length - 1 && dot}
        </span>
      ))}
    </p>
  );
}

/* The name is set the way the preloader sets it — light, wide-tracked
   capitals — so the page ends on the mark it opened on. */
const NAME_CLASS =
  "font-light uppercase tracking-[0.44em] pl-[0.44em] text-foreground/90";

/* A shadow belongs on the plain last line only. On the two gradient lines the
   fill is transparent and the gradient is the element's *background*, which
   paints before text-shadow does — so a dark shadow lands on top of the
   gradient and greys the letters it was meant to lift. That is what the first
   version of this heading did: "I build / what does not" came out visibly
   duller than "yet exist." beneath them. */
const LAST_LINE_SHADOW = "0 2px 22px oklch(0.04 0.010 240 / 0.7), 0 1px 8px oklch(0.04 0.010 240 / 0.5)";

function FutureContent() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden md:pt-[68px] max-md:stage-ls:pt-14">
      {/* A title card over a subject. The closing shot puts the tallest
          tower and a lit sky behind centred copy, so the separation is
          bought with the scrim rather than with position: 0.84, the top of
          the band this shield prescribes for bright plates. */}
      <ContentShield align="center" strength={0.84} />
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

      {/* Text zone — centred on the frame below the header, both axes. The
          large gaps are sized in vh as well as rem so the block still clears
          a 720px-tall laptop: it is eight rows deep. */}
      <div className="relative z-10 w-full max-w-3xl px-5 sm:px-6">
        {/* Eyebrow */}
        <p className="mb-[clamp(0.6rem,3vh,1.75rem)] text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-foreground/95">
          <span>07</span>
          {" · "}
          The Work Continues
        </p>
        {/* The founder's line */}
        <p className="mx-auto mb-[clamp(1.5rem,5vh,2.75rem)] max-w-xl font-display italic text-[14px] md:text-[15px] leading-[1.65] text-foreground/75 [@media(max-height:560px)]:hidden">
          The future is not imagined. It is engineered quietly.
        </p>
        {/* Name */}
        <p className={`mb-[clamp(0.75rem,2.2vh,1.4rem)] text-[clamp(14px,1.55vw,21px)] leading-none ${NAME_CLASS}`}>
          Sushanth Paatnaik
        </p>
        {/* H2 — three block spans; the explicit spaces keep the line
            "I build what does not yet exist." whole in the text stream. */}
        <h2 className="mx-auto font-display text-[clamp(1.9rem,min(5.6vw,8.4vh),4.5rem)] leading-[1.0] tracking-[-0.035em] font-medium">
          <span className="block py-1 max-md:stage-ls:py-0 text-gradient">I build</span>{" "}
          <span className="block py-1 max-md:stage-ls:py-0 text-gradient">what does not</span>{" "}
          <span className="block py-1 max-md:stage-ls:py-0 text-foreground/95" style={{ textShadow: LAST_LINE_SHADOW }}>
            yet exist.
          </span>
        </h2>
        {/* Roles, then the count */}
        {/* 90% ink, not the phone's 80: with Mentor the line is 516px wide,
            and its ends reach past the shield over the brighter edges of the
            city, where at 80% they measured 4.14 and 4.46 against 4.5. */}
        <RoleLine className="mt-[clamp(1.25rem,4vh,2.25rem)] text-[10.5px] md:text-[11px] tracking-[0.3em] text-foreground/90" />
        <p className="mt-2.5 font-mono text-[10.5px] md:text-[11px] uppercase tracking-[0.3em] text-foreground/70 [@media(orientation:landscape)_and_(max-height:340px)]:hidden">
          25 Innovations · 6 Ventures
        </p>
        {/* CTA row */}
        <div className="mt-[clamp(1.5rem,4.6vh,2.75rem)] flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-center sm:gap-5 stage-ls:flex-row stage-ls:gap-5">
          <Link to="/contact" className="btn-cinematic btn-cinematic-atmospheric">
            Begin a conversation
          </Link>{" "}
          <Link to="/about" className="btn-cinematic-ghost">
            Explore my journey →
          </Link>
        </div>
        {/* Closing index */}
        <nav
          aria-label="Sections"
          className="mt-[clamp(1.5rem,4.6vh,2.75rem)] -mx-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 [@media(max-height:560px)]:hidden"
        >
          {INDEX.map((s) => (
            <span key={s.to} className="inline-flex">
              <Link
                to={s.to}
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/85 hover:text-foreground transition-colors"
              >
                {s.label}
              </Link>{" "}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Chapter 6 — The Work Continues, phone composition.

   Two states, not one. The desktop frame holds the founder's line, the
   name, the headline, the roles, the count, two buttons and an index;
   on a 360px portrait screen that stack would bury the skyline it is
   set against. So the line arrives first, alone, and then the identity
   replaces it and stays: the last state is also the page's ending.

   The band is 105vh, so two states hold for roughly 36vh and 64vh. Three
   would have held for under 30vh each, which is the pace this page
   already measured as too quick to read on a phone.
   ────────────────────────────────────────────────────────────────── */
function FutureMobile({ lp }: { lp: MotionValue<number> }) {
  // 0.34 hold + 0.055 hand-over + 0.605 hold = 1.000.
  const opA = useTransform(lp, (v) => stageOp(v, 0.000, 0.340));
  const opB = useTransform(lp, (v) => stageOp(v, 0.395, 1, true));
  const peB = useTransform(opB, (v) => (v > 0.5 ? "auto" : "none"));

  // Upper text band, clear of the header above and of the towers below.
  const band = "absolute inset-x-0 top-[24%] px-6 text-center";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* The portrait crop puts the lit sky directly behind the text band,
          so the scrim is weighted to the head of the frame and lets the
          skyline through below it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.70) 34%, rgba(0,0,0,0.46) 54%, rgba(0,0,0,0.14) 70%, transparent 80%)",
        }}
      />

      {/* Persistent chapter label */}
      {/* The number is a weight heavier than the label. At 10px the strokes
          of "0" and "7" are under a pixel wide, and at the label's weight
          their cores measured 4.0:1 on black with the ink at 95%: thin, not
          dim. */}
      <p className="absolute inset-x-0 top-[16%] z-10 text-center text-[10px] uppercase tracking-[0.32em] text-foreground/95">
        <span className="font-medium">07</span>
        {" · "}
        The Work Continues
      </p>

      {/* A — the founder's line */}
      <motion.p
        className={`${band} z-10 font-display italic text-[17px] leading-[1.6] text-foreground/85`}
        style={{ opacity: opA, textShadow: "0 1px 12px oklch(0.03 0.008 250 / 0.7)" }}
      >
        The future is not imagined.{" "}
        <br />
        It is engineered quietly.
      </motion.p>

      {/* B — the identity, and the page's ending */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ opacity: opB, pointerEvents: peB }}
      >
        <div className={band}>
          <p className={`mb-4 text-[13px] leading-none ${NAME_CLASS}`}>
            Sushanth Paatnaik
          </p>
          <h2 className="font-display text-[clamp(2.2rem,10.6vw,2.9rem)] leading-[1.02] tracking-[-0.035em] font-medium">
            <span className="block py-0.5 text-gradient">I build</span>{" "}
            <span className="block py-0.5 text-gradient">what does not</span>{" "}
            <span className="block py-0.5 text-foreground/95" style={{ textShadow: LAST_LINE_SHADOW }}>
              yet exist.
            </span>
          </h2>
          <RoleLine rows className="mt-6 text-[10px] tracking-[0.24em] text-foreground/80" />
          <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/75">
            25 Innovations · 6 Ventures
          </p>
        </div>

        {/* The closing block sits over the brightest part of the plate — the
            lit city. It carries its own bottom lift so the CTA and the page's
            ending stay legible without darkening the whole frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.02 0.006 260 / 0.40) 30%, oklch(0.02 0.006 260 / 0.78) 68%, oklch(0.02 0.006 260 / 0.90) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6"
          style={{ paddingBottom: "max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.1rem))" }}
        >
          {/* Editorial CTA — a rule, not a pill. The arrow is the affordance. */}
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 border-b border-foreground/35 pb-2 text-[13px] uppercase tracking-[0.34em] text-foreground/95 transition-colors hover:border-foreground/70 active:border-foreground/70"
          >
            <span>Begin a conversation</span>{" "}
            <span className="transition-transform duration-300 group-active:translate-x-1" aria-hidden>→</span>
          </Link>
          <Link
            to="/about"
            className="inline-flex min-h-6 items-center text-[11px] uppercase tracking-[0.3em] text-foreground/75 transition-colors hover:text-foreground active:text-foreground"
          >
            Explore my journey →
          </Link>

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/65">
            © 2026 Sushanth Paatnaik
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex min-h-6 items-center font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/85 transition-colors hover:text-foreground"
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
   infrastructure." and "Industry at global scale." on top of each
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

// The archive photographs are fetched once the reader reaches this chapter —
// the one before Presidential Recognition — and not on first paint. They sit
// inside a fixed stage, so to the browser they are "in the viewport" from the
// first frame and loading="lazy" would fetch them immediately; mounting them
// late is what actually defers the bytes. A full chapter of scrolling is ample
// lead: three files, 197 KB together.
const ARM_PLATES_AT = 1;

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
  const op5 = useTransform(scrollYProgress, (sp) => chapOp(sp, 5));
  const op6 = useTransform(scrollYProgress, (sp) => chapOp(sp, 6));

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
  const pe5 = useTransform(dominant, (d) => (d === 5 ? "auto" : "none"));
  const pe6 = useTransform(dominant, (d) => (d === 6 ? "auto" : "none"));

  /* `aria-hidden` and `inert` are attributes, not styles, so they cannot ride
     a MotionValue — they need a render. This is the only per-scroll React
     state on the page and it changes seven times over the whole page, not per
     frame.

     Without it a screen reader reads all seven chapters as one continuous
     document and keyboard focus tabs into links sitting at opacity 0. `inert`
     covers the focus half, `aria-hidden` the announcement half; React 19
     passes both straight through.

     `armed` rides the same subscription: it latches on the first time the
     reader reaches ARM_PLATES_AT and never clears, so the photographs load
     once and stay. */
  const [activeChapter, setActiveChapter] = useState(0);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const apply = (d: number) => {
      setActiveChapter(d);
      if (d >= ARM_PLATES_AT) setArmed(true);
    };
    apply(dominant.get());
    return dominant.on("change", apply);
  }, [dominant]);

  const y0 = useTransform(scrollYProgress, (sp) => chapY(sp, 0, yIn, yOut));
  const y1 = useTransform(scrollYProgress, (sp) => chapY(sp, 1, yIn, yOut));
  const y2 = useTransform(scrollYProgress, (sp) => chapY(sp, 2, yIn, yOut));
  const y3 = useTransform(scrollYProgress, (sp) => chapY(sp, 3, yIn, yOut));
  const y4 = useTransform(scrollYProgress, (sp) => chapY(sp, 4, yIn, yOut));
  const y5 = useTransform(scrollYProgress, (sp) => chapY(sp, 5, yIn, yOut));
  const y6 = useTransform(scrollYProgress, (sp) => chapY(sp, 6, yIn, yOut));

  // Local progress inside chapters 2 and 6 — the timeline the phone's staged
  // compositions run on. Computed unconditionally (hooks cannot be
  // conditional); desktop simply never reads them.
  const lp2 = useTransform(scrollYProgress, (sp) => {
    const [bIn, bOut] = CHAPTER_BANDS[2];
    return c01((sp - bIn) / (bOut - bIn));
  });
  const lp6 = useTransform(scrollYProgress, (sp) => {
    const [bIn, bOut] = CHAPTER_BANDS[6];
    return c01((sp - bIn) / (bOut - bIn));
  });

  return (
    <>
      {/* Ghost scroll track — provides TOTAL_VH of scroll travel and chapter anchor points */}
      <div className="relative" style={{ height: `${TOTAL_VH}vh` }}>
        {HOME_CHAPTER_IDS.map((id, i) => (
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

        {/* Chapter 0 — Origin */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: op0, y: y0, pointerEvents: pe0, willChange: wc }}
          aria-hidden={activeChapter !== 0}
          inert={activeChapter !== 0}
        >
          <OriginHero />
        </motion.div>

        {/* Chapter 1 — Early Works */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op1, y: y1, pointerEvents: pe1, willChange: wc }}
          aria-hidden={activeChapter !== 1}
          inert={activeChapter !== 1}
        >
          <EarlyWorksContent />
        </motion.div>

        {/* Chapter 2 — Presidential Recognition */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op2, y: y2, pointerEvents: pe2, willChange: wc }}
          aria-hidden={activeChapter !== 2}
          inert={activeChapter !== 2}
        >
          {mobile ? (
            <PresidentialMobile lp={lp2} armed={armed} />
          ) : (
            <PresidentialContent
              armed={armed}
              sp={scrollYProgress}
              rise={reduce ? 0 : PRES_RISE}
              wc={wc}
            />
          )}
        </motion.div>

        {/* Chapter 3 — Global Recognition */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op3, y: y3, pointerEvents: pe3, willChange: wc }}
          aria-hidden={activeChapter !== 3}
          inert={activeChapter !== 3}
        >
          <GlobalContent />
        </motion.div>

        {/* Chapter 4 — Advanced Materials */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op4, y: y4, pointerEvents: pe4, willChange: wc }}
          aria-hidden={activeChapter !== 4}
          inert={activeChapter !== 4}
        >
          <MaterialContent />
        </motion.div>

        {/* Chapter 5 — Industrial Impact */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: op5, y: y5, pointerEvents: pe5, willChange: wc }}
          aria-hidden={activeChapter !== 5}
          inert={activeChapter !== 5}
        >
          <IndustrialContent />
        </motion.div>

        {/* Chapter 6 — The Work Continues */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ opacity: op6, y: y6, pointerEvents: pe6, willChange: wc }}
          aria-hidden={activeChapter !== 6}
          inert={activeChapter !== 6}
        >
          {mobile ? <FutureMobile lp={lp6} /> : <FutureContent />}
        </motion.div>
      </div>
    </>
  );
}
