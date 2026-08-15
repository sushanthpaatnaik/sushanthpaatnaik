import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Nav from "@/components/scene/Nav";
import AmbientAtmosphere from "@/components/scene/AmbientAtmosphere";
import CursorAura from "@/components/scene/CursorAura";
import SignatureMotif from "@/components/scene/SignatureMotif";
import backdrop from "@/assets/scene-early-workshop.webp";
import enablerImg from "@/assets/early/enabler.webp";
import powergenImg from "@/assets/early/powergen.webp";
import rectofitImg from "@/assets/early/rectofit.webp";
import shewatchImg from "@/assets/early/shewatch.webp";
import solkaImg from "@/assets/early/solka.webp";
import supersenseImg from "@/assets/early/supersense.webp";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";

const description =
  "Six original inventions built between 2008 and 2013 — the teenage innovations that earned six Presidential Awards and became the foundation for today's deep-tech ventures.";

export const Route = createFileRoute("/early-works")({
  component: EarlyWorksPage,
  head: () => ({
    meta: [
      { title: "Early Works — Sushanth Paatnaik" },
      { name: "description", content: description },
      { property: "og:title", content: "Early Works — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Six original devices built between 2008 and 2013 — the teenage innovations that earned six Presidential Awards.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/early-works" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/early-works" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ type: "CollectionPage", name: "Early Works — Sushanth Paatnaik", description, path: "/early-works" }),
      ),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Early Works", path: "/early-works" }])),
    ],
  }),
});

const EASE = [0.19, 1, 0.22, 1] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Innovation {
  n: string;
  year: string;
  category: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  impact: string;
  image: string;
  videoUrl?: string;
  badges: string[];
  /** Historical filing reference — not a status badge, since it may not reflect an active/granted patent. */
  patentNote?: string;
  layout: "split-right" | "split-left" | "feature";
}

// ── Data ──────────────────────────────────────────────────────────────────────

const innovations: Innovation[] = [
  {
    n: "01",
    year: "2008",
    category: "Mobility Safety",
    name: "Rectofit Kit",
    tagline: "Universal vehicle safety retrofit",
    problem:
      "Road accidents claimed thousands of lives annually across India. Existing vehicles lacked basic safety mechanisms, and factory-level safety upgrades were cost-prohibitive for most families.",
    solution:
      "A hardware-first safety system engineered to retrofit onto any existing vehicle — without redesigning the host platform. Field-deployable, low-cost, and scalable from a school workshop.",
    impact:
      "Recognized by the President of India at age 14. Proved that life-saving engineering could emerge from constrained resources and genuine intent.",
    image: rectofitImg,
    badges: ["Presidential Award"],
    layout: "split-right",
  },
  {
    n: "02",
    year: "2009",
    category: "Assistive Technology",
    name: "Enabler",
    tagline: "Breath-operated wheelchair",
    problem:
      "Individuals with severe paralysis had no affordable means of independent mobility in India. Commercial alternatives — where they existed — were inaccessible to most families.",
    solution:
      "A wheelchair controlled entirely through breath patterns, a sip-and-puff interface built with hardware a teenager could design, iterate, and test. No imported components. No institutional lab.",
    impact:
      "Won the National Innovation Award. Recognized by the President of India. The foundation invention that opened every door that followed — and the one that made everything else inevitable.",
    image: enablerImg,
    videoUrl: "https://youtu.be/n-JiX6vmwOI",
    badges: ["Presidential Award", "National Innovation Award"],
    patentNote: "International Patent Application · WO2011138794A1 · Filed 2011",
    layout: "feature",
  },
  {
    n: "03",
    year: "2010",
    category: "Human–Computer Interaction",
    name: "Super Sense",
    tagline: "Gesture-controlled computing",
    problem:
      "Traditional computing interfaces — keyboards and mice — excluded individuals with motor disabilities from fully engaging with technology.",
    solution:
      "A system enabling computers to be operated entirely through hand gestures, reimagining human-machine interaction before gesture computing reached mainstream awareness.",
    impact:
      "Recognized by the President at the Intel IRIS National Science Fair. Explored a computing paradigm that mainstream technology would adopt nearly a decade later.",
    image: supersenseImg,
    videoUrl: "https://youtu.be/YuNwD71F3tA",
    badges: ["Presidential Award", "Intel IRIS"],
    layout: "split-left",
  },
  {
    n: "04",
    year: "2011",
    category: "Off-Grid Energy",
    name: "Powergen",
    tagline: "Off-grid electricity for rural India",
    problem:
      "Over 400 million Indians had no reliable access to electricity. Grid extension was slow, expensive, and politically complex. The problem was urgent and compounding.",
    solution:
      "A high-efficiency, low-cost portable power generation kit designed for rural deployment — no grid dependency, no infrastructure prerequisite, built for the real conditions of India's hinterland.",
    impact:
      "Recognized by the President. Shortlisted by the National Innovation Foundation. Addressed one of India's most pressing humanitarian engineering challenges of the era.",
    image: powergenImg,
    videoUrl: "https://vimeo.com/57665099",
    badges: ["Presidential Award", "National Innovation Foundation"],
    layout: "split-right",
  },
  {
    n: "05",
    year: "2012",
    category: "Energy Harvesting",
    name: "Sol-Ka",
    tagline: "Ambient-light charging power bank",
    problem:
      "Devices died at the worst possible moments. Solar chargers required direct sunlight, were bulky for everyday carry, and performed poorly in indoor environments.",
    solution:
      "A power bank case that harvests ambient indoor light — not direct sunlight — to continuously trickle-charge connected devices. Quietly self-sufficient. Invisible in its operation.",
    impact:
      "Presidential Award for ambient energy harvesting as a practical portable product, at a time when the concept existed primarily in academic literature.",
    image: solkaImg,
    videoUrl: "https://youtu.be/LDdIsTrE_Uw",
    badges: ["Presidential Award"],
    layout: "split-left",
  },
  {
    n: "06",
    year: "2013",
    category: "Wearable Safety",
    name: "She Watch",
    tagline: "Women's safety wearable",
    problem:
      "Women's personal safety in India remained an urgent, unsolved problem. Existing solutions were reactive, visible to the threat, and dependent on network coverage that was often unavailable.",
    solution:
      "A discreet smart-watch wearable with silent alert and real-time location capabilities — engineered years before the women's safety wearable category reached mainstream product awareness.",
    impact:
      "Presidential Award for the sixth consecutive year. The invention that closed this chapter and confirmed that hardware innovation would define the decade ahead.",
    image: shewatchImg,
    videoUrl: "https://youtu.be/o8nir3oFzXg",
    badges: ["Presidential Award"],
    layout: "feature",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEmbedUrl(url: string): string {
  const ytShort = url.match(/youtu\.be\/([^?&/]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?rel=0&modestbranding=1`;
  const ytLong = url.match(/[?&]v=([^&]+)/);
  if (ytLong) return `https://www.youtube.com/embed/${ytLong[1]}?rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?title=0&byline=0&portrait=0&dnt=1`;
  return url;
}

// ── Video Modal ───────────────────────────────────────────────────────────────

interface VideoModalProps { videoUrl: string; title: string; onClose: () => void; }

function VideoModal({ videoUrl, title, onClose }: VideoModalProps) {
  const embedUrl = getEmbedUrl(videoUrl);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — Demo`}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 md:p-12"
    >
      <div aria-hidden className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative z-10 w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.44em] text-foreground/40">Demo</p>
            <h2 className="font-display text-base md:text-lg tracking-[-0.02em] text-foreground/88 leading-tight">{title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/[0.18] text-foreground/55 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-sm border border-foreground/[0.10] bg-black shadow-[0_0_60px_oklch(0_0_0/0.5)]">
          <iframe
            src={embedUrl}
            title={`${title} — Demo Video`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.36em] text-foreground/25">
          Press Esc or click outside to close
        </p>
      </motion.div>
    </div>
  );
}

// ── Demo Button ───────────────────────────────────────────────────────────────

function DemoButton({ onWatch }: { onWatch?: () => void }) {
  if (!onWatch) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/22 select-none">
        Demo unavailable
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onWatch}
      className="group/btn flex min-h-6 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
    >
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-accent/30 transition-all duration-300 group-hover/btn:border-accent/70 group-hover/btn:bg-accent/[0.12]">
        <svg width="5" height="6" viewBox="0 0 5 6" fill="currentColor" aria-hidden>
          <path d="M0 0.5v5l5-2.5z" />
        </svg>
      </span>
      Watch Demo
      <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
    </button>
  );
}

// ── Recognition Badge ─────────────────────────────────────────────────────────

function RecognitionBadge({ label }: { label: string }) {
  const icons: Record<string, string> = {
    "Presidential Award": "✦",
    "National Innovation Award": "◈",
    "Intel IRIS": "◆",
    "National Innovation Foundation": "◇",
    "NASA": "⬡",
    "MIT TR35": "◉",
    "TED@Bangalore": "◎",
  };
  return (
    <span className="inline-flex items-center gap-1.5 border border-accent/20 rounded-[2px] bg-accent/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.32em] text-accent/70">
      <span className="text-accent/50 text-[10px]">{icons[label] ?? "✦"}</span>
      {label}
    </span>
  );
}

// ── Parallax Image ────────────────────────────────────────────────────────────

function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="h-[112%] w-full object-cover archive-grade"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

// ── Chapter — Split Layout ────────────────────────────────────────────────────

function ChapterSplit({
  inv, index, reversed, onWatch,
}: {
  inv: Innovation;
  index: number;
  reversed: boolean;
  onWatch?: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
      className={`grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}
      aria-label={`${inv.name} — ${inv.year}`}
    >
      {/* Content side */}
      <div className={`flex flex-col justify-center py-12 lg:py-20 ${reversed ? "lg:pl-12 xl:pl-16" : "lg:pr-12 xl:pr-16"}`}>
        {/* Chapter label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/30">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 h-px bg-foreground/[0.08]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/50">{inv.year}</span>
        </div>

        {/* Category */}
        <p className="font-mono text-[10px] uppercase tracking-[0.46em] text-accent/60 mb-4">{inv.category}</p>

        {/* Name */}
        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.96] tracking-[-0.03em] text-foreground/95 mb-3">
          {inv.name}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70 mb-8">{inv.tagline}</p>

        {/* Three-part content */}
        <div className="space-y-6 mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/35 mb-2">The Problem</p>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-foreground/65">{inv.problem}</p>
          </div>
          <div className="border-l border-accent/20 pl-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/50 mb-2">The Innovation</p>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-foreground/80">{inv.solution}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/35 mb-2">The Impact</p>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-foreground/65">{inv.impact}</p>
          </div>
        </div>

        {/* Badges + demo */}
        <div className="flex flex-wrap items-center gap-3">
          {inv.badges.map((b) => <RecognitionBadge key={b} label={b} />)}
        </div>
        {inv.patentNote && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/35">
            {inv.patentNote}
          </p>
        )}
        <div className="mt-5">
          <DemoButton onWatch={onWatch} />
        </div>
      </div>

      {/* Image side */}
      <div className={`relative group ${reversed ? "lg:order-first" : ""}`}>
        <ParallaxImage
          src={inv.image}
          alt={inv.name}
          className="h-[340px] sm:h-[440px] lg:h-full min-h-[400px] lg:min-h-[560px] rounded-sm"
        />
        {/* Year overlay */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, oklch(0.04 0.005 245 / 0.6), transparent)" }}
        />
        <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.32em] text-accent/60 bg-background/40 backdrop-blur-sm px-2 py-1 rounded-[2px]">
          {inv.year}
        </span>
        {/* Hover frame */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-sm border border-accent/0 transition-all duration-700 group-hover:border-accent/20 pointer-events-none"
        />
      </div>
    </motion.article>
  );
}

// ── Chapter — Feature Layout ──────────────────────────────────────────────────

function ChapterFeature({
  inv, index, onWatch,
}: {
  inv: Innovation;
  index: number;
  onWatch?: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
      className="relative"
      aria-label={`${inv.name} — ${inv.year}`}
    >
      {/* Large image */}
      <div className="relative group overflow-hidden rounded-sm">
        <ParallaxImage
          src={inv.image}
          alt={inv.name}
          className="h-[60vw] max-h-[600px] min-h-[320px] sm:min-h-[420px]"
        />
        {/* Cinematic overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, oklch(0.04 0.005 245 / 0.85) 0%, oklch(0.04 0.005 245 / 0.25) 45%, transparent 70%)",
          }}
        />
        {/* Chapter label on image */}
        <div className="absolute top-5 left-5 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/50 bg-background/30 backdrop-blur-sm px-2 py-1 rounded-[2px]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {/* Year */}
        <span className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.32em] text-accent/70 bg-background/40 backdrop-blur-sm px-2 py-1 rounded-[2px]">
          {inv.year}
        </span>
        {/* Name on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.46em] text-accent/70 mb-2">{inv.category}</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.8rem)] leading-[0.94] tracking-[-0.035em] text-gradient">
            {inv.name}
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 mt-2">{inv.tagline}</p>
        </div>
        {/* Frame hover */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-sm border border-accent/0 group-hover:border-accent/15 transition-all duration-700 pointer-events-none"
        />
      </div>

      {/* Content below image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-8 md:pt-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/35 mb-2">The Problem</p>
          <p className="text-[14px] leading-relaxed text-foreground/65">{inv.problem}</p>
        </div>
        <div className="border-l border-accent/15 pl-6 md:pl-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/50 mb-2">The Innovation</p>
          <p className="text-[14px] leading-relaxed text-foreground/80">{inv.solution}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-foreground/35 mb-2">The Impact</p>
          <p className="text-[14px] leading-relaxed text-foreground/65">{inv.impact}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {inv.badges.map((b) => <RecognitionBadge key={b} label={b} />)}
          </div>
          {inv.patentNote && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/35">
              {inv.patentNote}
            </p>
          )}
          <div className="mt-4">
            <DemoButton onWatch={onWatch} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end px-5 sm:px-8 pt-28 pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-5xl">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="font-mono text-[10px] sm:text-[10px] uppercase tracking-[0.52em] text-foreground/40 mb-10"
        >
          Early Works · Origin · 2008–2013
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.08, ease: EASE }}
          className="font-display leading-[0.91] tracking-[-0.04em] mb-10"
        >
          {/* Each line carries a trailing {" "}. These have to stay <span>s —
              an <h1> takes phrasing content only, so the line breaks come from
              `block`, which is CSS. Without CSS the four lines run together and
              the headline extracts as "Before Graphene.Before Deep Tech.There
              were ideas that solvedreal human problems." A trailing space
              collapses at the end of a rendered line, so nothing moves. */}
          <span className="block text-[clamp(2.6rem,8.5vw,6.5rem)] text-gradient">
            Before Graphene.{" "}
          </span>
          <span className="block text-[clamp(2.6rem,8.5vw,6.5rem)] text-gradient">
            Before Deep Tech.{" "}
          </span>
          <span className="block text-[clamp(2rem,6vw,4.8rem)] text-foreground/55 mt-2">
            There were ideas that solved{" "}
          </span>
          <span className="block text-[clamp(2rem,6vw,4.8rem)] text-foreground/55">
            real human problems.
          </span>
        </motion.h1>

        {/* Year axis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          className="flex items-center gap-0 mb-8 overflow-x-auto scrollbar-none"
        >
          {["2008", "2009", "2010", "2011", "2012", "2013"].map((yr, i) => (
            <div key={yr} className="flex items-center shrink-0">
              {i > 0 && <div className="w-6 sm:w-10 md:w-14 h-px bg-foreground/[0.12]" />}
              <span className="font-mono text-[10px] sm:text-[10px] tracking-[0.3em] text-accent/60 whitespace-nowrap">
                {yr}
              </span>
            </div>
          ))}
          <div className="flex-1 h-px bg-foreground/[0.07] ml-6 min-w-4" />
        </motion.div>

        {/* Recognition pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
          className="flex flex-wrap items-center gap-2 sm:gap-3 mb-14"
        >
          {[
            { icon: "✦", label: "6× Presidential" },
            { icon: "⬡", label: "NASA" },
            { icon: "◈", label: "MIT TR35" },
            { icon: "◎", label: "TED@Bangalore" },
            { icon: "◆", label: "Intel IRIS" },
          ].map((badge) => (
            <span
              key={badge.label}
              className="flex items-center gap-1.5 border border-foreground/[0.10] rounded-[2px] px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[10px] uppercase tracking-[0.3em] text-foreground/50"
            >
              <span className="text-accent/55">{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col items-start gap-3"
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.46em] text-foreground/28">
            Scroll to explore
          </span>
          <motion.div
            animate={reduced ? {} : { y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" className="text-foreground/28">
              <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1" />
              <motion.rect
                x="5.5" y="4" width="3" height="5" rx="1.5" fill="currentColor"
                animate={reduced ? {} : { y: [0, 5, 0], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

// ── Chapter Divider ───────────────────────────────────────────────────────────

function ChapterDivider({ index, year, category }: { index: number; year: string; category: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="flex items-baseline gap-5 py-4 border-t border-foreground/[0.07]"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/28">
        Chapter {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/50">{year}</span>
      <div className="flex-1 h-px bg-foreground/[0.06]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-foreground/28">{category}</span>
    </motion.div>
  );
}

// ── Timeline Spine ────────────────────────────────────────────────────────────

function TimelineSpine({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 15%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="absolute left-0 top-0 bottom-0 hidden xl:block"
      style={{ width: "1px" }}
    >
      <div className="absolute inset-0 bg-foreground/[0.06]" />
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{
          scaleY,
          background: "linear-gradient(to bottom, oklch(0.63 0.1 75 / 0.6), oklch(0.63 0.1 75 / 0.15) 70%, transparent)",
          height: "100%",
        }}
      />
    </div>
  );
}

// ── Ending Section ────────────────────────────────────────────────────────────

function EndingSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
      className="border-t border-foreground/[0.07] pt-16 md:pt-24 pb-24 md:pb-32"
    >
      {/* Eyebrow */}
      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/35 mb-8">
        2008 — 2013 · The Foundation
      </p>

      {/* Statement */}
      <blockquote className="font-display text-[clamp(1.5rem,4.5vw,3.2rem)] leading-[1.08] tracking-[-0.025em] text-foreground/88 max-w-3xl mb-10">
        These six inventions became the foundation for today's work in graphene, advanced materials,
        energy systems, and industrial deep tech.
      </blockquote>

      <p className="max-w-2xl text-[15px] md:text-base leading-relaxed text-foreground/60 mb-14">
        Six problems. Six hardware solutions. Six Presidential Awards across six years.
        Recognition from NASA, MIT, and TED followed — not for a single invention, but for the
        consistent belief that real engineering could solve real human problems. That belief became
        the only constant across every venture that followed.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 items-center">
        <Link to="/innovations" className="btn-cinematic">
          Explore Innovations
        </Link>
        <Link to="/ventures" className="btn-cinematic-secondary">
          View Current Ventures
        </Link>
        <Link
          to="/about"
          className="inline-flex min-h-6 items-center font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/40 hover:text-foreground/70 transition-colors duration-300"
        >
          Continue the Journey →
        </Link>
      </div>

      {/* Signature stat strip */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-foreground/[0.07] pt-10">
        {[
          { n: "6", label: "Original Devices" },
          { n: "6×", label: "Presidential Awards" },
          { n: "2008", label: "First Invention" },
          { n: "2013", label: "Chapter Closed" },
        ].map((s) => (
          <div key={s.label} className="border-l border-foreground/[0.10] pl-5">
            <div className="font-display text-2xl md:text-3xl text-gradient leading-none tracking-tight mb-1.5">
              {s.n}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/40">{s.label}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ── Backdrop ──────────────────────────────────────────────────────────────────

function BackdropPanel({ isTouch }: { isTouch: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) saturate(0.38) brightness(0.46) contrast(1.05)",
          transform: "scale(1.10) translateZ(0)",
          willChange: "transform",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(28px) saturate(0.32) brightness(0.42)",
          transform: "scale(1.16)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #000 85%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #000 85%)",
          opacity: 0.85,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.04 0.006 260 / 0.84) 0%, oklch(0.03 0.005 260 / 0.78) 45%, oklch(0.03 0.005 260 / 0.82) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: "radial-gradient(60% 50% at 82% 18%, oklch(0.62 0.10 55 / 0.07), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: "radial-gradient(70% 55% at 18% 78%, oklch(0.42 0.07 240 / 0.10), transparent 65%)",
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: "radial-gradient(55% 45% at 50% 50%, oklch(0.55 0.05 235 / 0.05), transparent 70%)",
        }}
        animate={isTouch || reduced ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={isTouch || reduced ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 78% at 50% 50%, transparent 38%, oklch(0.02 0 0 / 0.72) 100%)",
        }}
      />
      <div className="absolute right-[-90px] bottom-[-80px] hidden md:block">
        <SignatureMotif variant="watermark" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function EarlyWorksPage() {
  const [isTouch, setIsTouch] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const chaptersRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const openVideo = (url: string, title: string) => setActiveVideo({ url, title });
  const closeVideo = () => setActiveVideo(null);

  return (
    <>
      <div className="relative min-h-screen bg-background text-foreground noise overflow-x-clip">
        <BackdropPanel isTouch={isTouch} />
        {!isTouch && <AmbientAtmosphere />}
        {!isTouch && <CursorAura />}

        <Nav />

        <main id="main" className="relative z-10">
          {/* Hero */}
          <HeroSection />

          {/* Intro bridge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: EASE }}
            className="px-5 sm:px-8 py-10 md:py-14"
          >
            <div className="mx-auto max-w-5xl flex flex-wrap items-center gap-4 border-y border-foreground/[0.07] py-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.46em] text-foreground/30">
                Six Inventions
              </span>
              <div className="flex-1 h-px bg-foreground/[0.06]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.46em] text-foreground/30">
                Six Years
              </span>
              <div className="flex-1 h-px bg-foreground/[0.06]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.46em] text-foreground/30">
                Six Presidential Awards
              </span>
            </div>
          </motion.div>

          {/* Chapter sections */}
          <section
            ref={chaptersRef as React.RefObject<HTMLElement>}
            className="relative px-5 sm:px-8 xl:px-14"
          >
            <TimelineSpine containerRef={chaptersRef} />

            <div className="mx-auto max-w-5xl xl:pl-10 space-y-0">
              {innovations.map((inv, i) => {
                const onWatch = inv.videoUrl
                  ? () => openVideo(inv.videoUrl!, inv.name)
                  : undefined;

                return (
                  <div key={inv.n}>
                    <ChapterDivider index={i} year={inv.year} category={inv.category} />

                    <div className="py-10 md:py-16">
                      {inv.layout === "feature" ? (
                        <ChapterFeature inv={inv} index={i} onWatch={onWatch} />
                      ) : (
                        <ChapterSplit
                          inv={inv}
                          index={i}
                          reversed={inv.layout === "split-left"}
                          onWatch={onWatch}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ending */}
          <section className="px-5 sm:px-8">
            <div className="mx-auto max-w-5xl">
              <EndingSection />
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 border-t border-foreground/[0.06] px-5 sm:px-8 py-10">
            <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
              <span>Sushanth Paatnaik · India → World</span>
              <a
                href="mailto:info@sushanthpaatnaik.com"
                className="inline-flex min-h-6 items-center hover:text-foreground/80 transition-colors"
              >
                info@sushanthpaatnaik.com
              </a>
            </div>
          </footer>
        </main>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo.url}
          title={activeVideo.title}
          onClose={closeVideo}
        />
      )}
    </>
  );
}
