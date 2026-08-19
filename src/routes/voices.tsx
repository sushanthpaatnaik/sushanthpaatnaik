import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-media-wall.webp";

import mitTrLogo from "@/assets/outlets/mit-tr-color.webp";
import nifLogo from "@/assets/outlets/nif-color.webp";
/* Reversed lockup: the stock mark's navy ring and wordmark all but vanish on
   the near-black plate every other logo here sits on, which is why this one
   alone was on a white card. The roundel keeps its own colours untouched — it
   already reads on dark — and only the ring and wordmark are lifted to a pale
   blue-white, the way a brand's own reversed lockup would be. */
import ioclLogo from "@/assets/outlets/iocl-reversed.webp";
import deloitteLogo from "@/assets/outlets/deloitte-mark.svg";
import yourStoryLogo from "@/assets/outlets/yourstory-color.webp";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";

const description =
  "What institutions, founders, journalists, and global platforms say about the work — on record testimonials from MIT Technology Review, NIF, Deloitte, TED, INK, and more.";

export const Route = createFileRoute("/voices")({
  component: VoicesPage,
  head: () => ({
    meta: [
      { title: "Voices — Testimonials & On-Record Recognition" },
      { name: "description", content: description },
      { property: "og:title", content: "Voices — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Testimonials and endorsements from sovereign bodies, innovation foundations, global press, and industry leaders.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/voices" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/voices" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ type: "CollectionPage", name: "Voices — Sushanth Paatnaik", description, path: "/voices" }),
      ),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Voices", path: "/voices" }])),
    ],
  }),
});

type Voice = {
  category: string;
  quote: string;
  personName: string;
  personTitle: string;
  organization: string;
  logo?: string;
  href?: string;
  logoInvert?: boolean;
  logoWhiteBg?: boolean;
  logoScale?: number;
};

const voices: Voice[] = [
  {
    category: "Innovation Foundation · India",
    quote:
      "Sushant is an amazing innovator and always innovates with high social impact.",
    personName: "Anil K. Gupta",
    personTitle: "Professor, IIM-Ahmedabad · Vice-Chair",
    organization: "National Innovation Foundation — India",
    logo: nifLogo,
    logoInvert: true,
    logoScale: 1.1,
  },
  {
    category: "Press · Technology",
    quote:
      "A life-changing innovation 'Enabler' for the disabled — highly appreciable.",
    personName: "Mr. Srinivas",
    personTitle: "Senior Journalist",
    organization: "MIT Technology Review Magazine",
    logo: mitTrLogo,
    logoInvert: true,
    logoScale: 0.95,
  },
  {
    category: "Professional Services · Innovation",
    quote:
      "The best AI live demo ever seen so far. This demo really made my day.",
    personName: "P. R. Ramesh",
    personTitle: "Chairman",
    organization: "Deloitte India",
    logo: deloitteLogo,
    logoInvert: true,
    logoScale: 0.9,
  },
  {
    category: "Energy Sector · Industrial",
    quote:
      "Very effective and innovative solution for underground pipelines.",
    personName: "Mr. Joseph",
    personTitle: "Eastern Zone",
    organization: "Indian Oil Corporation (IOCL)",
    logo: ioclLogo,
    // 1.6, not 1.0. Every other mark here is a wide wordmark bound by
    // maxWidth; this one is taller than it is wide, so maxHeight bound first
    // and it rendered 43x52 in a 108px plate — visibly the smallest thing on
    // the page, with the Devanagari band collapsing into a smudge. At 1.6 it
    // renders 69x83 and the band resolves.
    logoScale: 1.6,
  },
  {
    category: "Media · Entrepreneurship",
    quote:
      "A very inspiring entrepreneur and great social-revolutionary products.",
    personName: "Shradha Sharma",
    personTitle: "Founder & CEO",
    organization: "YourStory",
    logoScale: 1.0,
    logo: yourStoryLogo,
  },
];

function VoicesStrip() {
  return (
    <StatsStrip
      className="mt-4"
      items={[
        { v: "06", l: "Presidential cycles" },
        { v: "20+", l: "Institutional voices" },
        { v: "40+", l: "Editorial features" },
        { v: "Global", l: "Stages & outlets" },
      ]}
    />
  );
}

function LogoPlate({ v }: { v: Voice }) {
  const scale = v.logoScale ?? 1;

  const containerCls = v.logoWhiteBg
    ? "rounded-[6px] border border-black/[0.08] bg-white shadow-[0_2px_12px_oklch(0_0_0_/_0.18)]"
    : "rounded-[4px] border border-foreground/[0.07] bg-[var(--surface-raised)] shadow-[inset_0_1px_0_oklch(1_0_0_/_0.03)]";

  const imgStyle: CSSProperties = {
    maxWidth: `${Math.round(76 * scale)}%`,
    maxHeight: `${Math.round(52 * scale)}px`,
    objectFit: "contain",
  };

  const imgCls = v.logoWhiteBg
    ? "opacity-100"
    : v.logoInvert
    ? "[filter:invert(1)_brightness(1.05)_contrast(1.1)_saturate(0)] opacity-[0.92] group-hover:opacity-100 transition-all duration-700"
    : "opacity-[0.88] saturate-[0.9] brightness-[1.04] group-hover:opacity-100 transition-all duration-700";

  return (
    <div
      className={`flex shrink-0 items-center justify-center w-[88px] h-[88px] md:w-[108px] md:h-[108px] ${containerCls}`}
    >
      {v.logo ? (
        <img
          src={v.logo}
          alt={`${v.organization} logo`}
          loading="lazy"
          style={imgStyle}
          className={`w-auto h-auto ${imgCls}`}
        />
      ) : (
        <span className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground/60">
          {v.organization.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function VoiceCard({ v, i }: { v: Voice; i: number }) {
  const Wrap = v.href ? "a" : "div";
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.07]"
    >
      <Wrap
        {...(v.href
          ? { href: v.href, target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="group block py-10 md:py-14 lg:py-16"
      >
        {/* ── Desktop: 2-column grid (logo | content). Mobile: stacked. ── */}
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] lg:grid-cols-[140px_1fr] gap-6 md:gap-10 lg:gap-16 items-start">

          {/* LEFT col — logo + institution name */}
          <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-4">
            <LogoPlate v={v} />
            {/* Institution name below logo on desktop */}
            <p className="hidden md:block font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/45 leading-relaxed mt-1">
              {v.organization}
            </p>
          </div>

          {/* RIGHT col — full content */}
          <div>
            {/* Category eyebrow */}
            <p className="font-mono text-[10px] uppercase tracking-[0.48em] text-primary/70 mb-5 md:mb-6">
              {v.category}
            </p>

            {/* Quote — dominant */}
            <blockquote className="font-display text-[clamp(1.2rem,2.6vw,1.75rem)] leading-[1.45] tracking-[-0.02em] text-foreground/92 italic mb-8 md:mb-10">
              &ldquo;{v.quote}&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-accent/50 shrink-0" />
              <div>
                <p className="font-display text-[14px] md:text-[15px] tracking-[-0.01em] text-foreground/88 leading-snug">
                  {v.personName}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/50 leading-snug">
                  {v.personTitle}
                </p>
                {/* Institution shown inline on mobile (hidden on desktop where it's in left col) */}
                <p className="md:hidden mt-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/38 leading-snug">
                  {v.organization}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Wrap>
    </motion.li>
  );
}

function VoicesList({ items }: { items: Voice[] }) {
  return (
    <ul className="not-prose mt-10 md:mt-14 flex flex-col">
      {items.map((v, i) => (
        <VoiceCard key={`${v.personName}-${v.organization}`} v={v} i={i} />
      ))}
      <li className="border-t border-foreground/[0.07]" />
    </ul>
  );
}

function VoicesPage() {
  return (
    <CinematicPageShell
      eyebrow="Voices · Endorsements & Testimonials"
      title={
        <>
          What people say<br className="hidden md:inline" /> about the work.
        </>
      }
      lead="On-record testimonials from innovation foundations, global press, industry leaders, and international stages — spanning two decades of invention."
      backdrop={backdrop}
      overlay={0.76}
    >
      <VoicesStrip />

      <EditorialSection number="01 · Voices" heading="Direct, on the record.">
        <p>
          Comments, endorsements, and testimonials from the people and
          institutions who have engaged the work — in their own words.
        </p>
      </EditorialSection>

      <VoicesList items={voices} />

      {/* ── Page-ending CTA ── */}
      <div className="not-prose mt-24 mb-4 flex flex-col items-center gap-10 border-t border-foreground/[0.06] pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/40">Continue</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <Link
            to="/recognitions"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[var(--surface-raised)] border border-foreground/[0.10] rounded-sm transition-all duration-700 hover:border-foreground/25 hover:bg-[var(--surface-high)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
              style={{ background: "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--foreground) 3%, transparent) 0%, transparent 55%)" }}
            />
            <span className="relative font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/75 group-hover:text-foreground/90 transition-colors duration-700">
              View Media Archive
            </span>
            <span className="relative font-mono text-[10px] text-foreground/40 group-hover:text-foreground/60 transition-colors duration-700">→</span>
          </Link>
          <Link
            to="/engage"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 border border-transparent rounded-sm transition-all duration-700 hover:border-foreground/[0.08] hover:bg-[var(--surface-level)]/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/50 group-hover:text-foreground/75 transition-colors duration-700">
              Begin a Conversation
            </span>
            <span className="font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-700">→</span>
          </Link>
        </motion.div>
      </div>
    </CinematicPageShell>
  );
}
