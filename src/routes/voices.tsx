import type { CSSProperties } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-media-wall.webp";

import mitTrLogo from "@/assets/outlets/mit-tr-color.webp";
import nifLogo from "@/assets/outlets/nif-color.webp";
import ioclLogo from "@/assets/outlets/iocl.webp";
import deloitteLogo from "@/assets/outlets/deloitte-mark.svg";
import yourStoryLogo from "@/assets/outlets/yourstory-color.webp";

export const Route = createFileRoute("/voices")({
  component: VoicesPage,
  head: () => ({
    meta: [
      { title: "Voices — Testimonials & On-Record Recognition" },
      {
        name: "description",
        content:
          "What institutions, founders, journalists, and global platforms say about the work — on record testimonials from MIT Technology Review, NIF, Deloitte, TED, INK, and more.",
      },
      { property: "og:title", content: "Voices — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Testimonials and endorsements from sovereign bodies, innovation foundations, global press, and industry leaders.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/voices" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/voices" }],
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
  lighten?: boolean;
  transparentBg?: boolean;
  tone?: "muted" | "lift";
  wide?: boolean;
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
    lighten: true,
    wide: true,
  },
  {
    category: "Press · Technology",
    quote:
      "A life-changing innovation 'Enabler' for the disabled — highly appreciable.",
    personName: "Mr. Srinivas",
    personTitle: "Senior Journalist",
    organization: "MIT Technology Review Magazine",
    logo: mitTrLogo,
    tone: "lift",
  },
  {
    category: "Professional Services · Innovation",
    quote:
      "The best AI live demo ever seen so far. This demo really made my day.",
    personName: "P. R. Ramesh",
    personTitle: "Chairman",
    organization: "Deloitte India",
    logo: deloitteLogo,
    lighten: true,
  },
  {
    category: "Energy Sector · Industrial",
    quote:
      "Very effective and innovative solution for underground pipelines.",
    personName: "Mr. Joseph",
    personTitle: "Eastern Zone",
    organization: "Indian Oil Corporation (IOCL)",
    logo: ioclLogo,
    tone: "lift",
  },
  {
    category: "Media · Entrepreneurship",
    quote:
      "A very inspiring entrepreneur and great social-revolutionary products.",
    personName: "Shradha Sharma",
    personTitle: "Founder & CEO",
    organization: "YourStory",
    logo: yourStoryLogo,
    tone: "lift",
  },
  {
    category: "Sovereign Recognition · India",
    quote:
      "Honored by Presidents Pratibha Patil and Pranab Mukherjee across IGNITE, NIF and National Inspire platforms — among the youngest multi-cycle Presidential awardees in the country.",
    personName: "Government of India",
    personTitle: "Presidential Recognition",
    organization: "Six laureate cycles · IGNITE & NIF",
    logo: nifLogo,
    lighten: true,
    wide: true,
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

function LogoMark({ v }: { v: Voice }) {
  const imgStyle: CSSProperties = {
    objectFit: "contain",
    ...(v.wide
      ? { maxHeight: "60%", maxWidth: "88%" }
      : { maxHeight: "100%", maxWidth: "100%" }),
  };
  if (v.transparentBg) imgStyle.mixBlendMode = "screen";

  const imgCls =
    v.wide && v.lighten
      ? "[filter:invert(1)_brightness(1.08)_contrast(1.15)_saturate(0)] opacity-[0.96] group-hover:opacity-100 group-hover:[filter:invert(1)_brightness(1.14)_contrast(1.2)_saturate(0)] transition-all duration-700"
      : v.transparentBg
      ? "[filter:invert(1)_brightness(0.92)_contrast(1.05)_saturate(0)] opacity-[0.9] group-hover:opacity-100 transition-all duration-700"
      : v.lighten
      ? "[filter:invert(1)_brightness(0.96)_contrast(1.08)_saturate(0)] opacity-[0.94] group-hover:opacity-100 group-hover:[filter:invert(1)_brightness(1.02)_contrast(1.1)_saturate(0)] transition-all duration-700"
      : v.tone === "muted"
      ? "opacity-[0.92] saturate-[0.85] brightness-[1.0] contrast-[1.06] group-hover:opacity-100 group-hover:brightness-[1.04] transition-all duration-700"
      : "opacity-[0.94] saturate-[0.92] brightness-[1.02] contrast-[1.08] group-hover:opacity-100 group-hover:brightness-[1.06] transition-all duration-700";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-foreground/[0.05] bg-[linear-gradient(180deg,oklch(0.075_0.003_250)_0%,oklch(0.06_0.003_250)_100%)] shadow-[inset_0_1px_0_oklch(1_0_0_/_0.012),inset_0_0_40px_oklch(0_0_0_/_0.35)] ${
        v.wide ? "h-10 w-24 sm:h-11 sm:w-28 p-1.5" : "h-12 w-12 sm:h-14 sm:w-14 p-2"
      }`}
    >
      {v.logo ? (
        <img
          src={v.logo}
          alt={`${v.organization} logo`}
          loading="lazy"
          style={imgStyle}
          className={`h-auto w-auto ${imgCls}`}
        />
      ) : (
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.08] py-10 md:py-14"
    >
      <Wrap
        {...(v.href
          ? { href: v.href, target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="group"
      >
        {/* Category label */}
        <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-muted-foreground/45 mb-6">
          {v.category}
        </p>

        {/* Quote — visually dominant */}
        <blockquote className="max-w-3xl font-display text-[clamp(1.15rem,2.4vw,1.65rem)] leading-[1.48] tracking-[-0.018em] text-foreground/90 italic mb-8">
          &ldquo;{v.quote}&rdquo;
        </blockquote>

        {/* Attribution row: logo + name + title */}
        <div className="flex items-center gap-4 md:gap-5">
          <LogoMark v={v} />
          <div>
            <p className="font-display text-[14px] md:text-[15px] tracking-[-0.01em] text-foreground/85 leading-snug">
              {v.personName}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/50 leading-snug">
              {v.personTitle}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/38 leading-snug">
              {v.organization}
            </p>
          </div>
        </div>
      </Wrap>
    </motion.li>
  );
}

function VoicesList({ items }: { items: Voice[] }) {
  return (
    <ul className="not-prose mt-12 md:mt-16 flex flex-col">
      {items.map((v, i) => (
        <VoiceCard key={`${v.personName}-${v.organization}`} v={v} i={i} />
      ))}
      <li className="border-t border-foreground/[0.08]" />
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
    </CinematicPageShell>
  );
}
