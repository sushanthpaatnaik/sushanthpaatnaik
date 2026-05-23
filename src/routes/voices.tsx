import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-media-wall.webp";

// Institutional & outlet logos used as visual signal for each voice block.
import mitTrLogo from "@/assets/outlets/mit-tr-color.webp";
import tedLogo from "@/assets/outlets/ted-color.webp";
import nifLogo from "@/assets/outlets/nif-color.webp";
import ioclLogo from "@/assets/outlets/iocl.webp";
import deloitteLogo from "@/assets/outlets/deloitte-mark.svg";
import inkTalksLogo from "@/assets/outlets/inktalks.webp";
import globalIndianLogo from "@/assets/outlets/global-indian-color.webp";
import telegraphLogo from "@/assets/outlets/telegraph-color.svg";
import indiaTodayLogo from "@/assets/outlets/india-today.webp";
import businessStandardLogo from "@/assets/outlets/business-standard-color.webp";
import yourStoryLogo from "@/assets/outlets/yourstory-color.webp";
import thePrintLogo from "@/assets/outlets/theprint.webp";

export const Route = createFileRoute("/voices")({
  component: VoicesPage,
  head: () => ({
    meta: [
      { title: "Voices — Institutional Endorsements & On-Record Recognition" },
      {
        name: "description",
        content:
          "Institutional voices, on-record recognition, and editorial endorsements — from Presidents of India and NIF to MIT Technology Review, TED, INK, and the global press.",
      },
      { property: "og:title", content: "Voices — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "How institutions, stages, and the press have framed two decades of invention and industrial work.",
      },
      { property: "og:url", content: "/voices" },
    ],
    links: [{ rel: "canonical", href: "/voices" }],
  }),
});

type Voice = {
  source: string;
  role: string;
  quote: string;
  logo?: string;
  href?: string;
};

const institutional: Voice[] = [
  {
    source: "Government of India",
    role: "Presidential Recognition · Six laureate cycles",
    quote:
      "Honored by Presidents Pratibha Patil and Pranab Mukherjee across IGNITE, NIF and National Inspire platforms — among the youngest multi-cycle Presidential awardees.",
    logo: nifLogo,
  },
  {
    source: "National Innovation Foundation — India",
    role: "Featured Inventor · IGNITE & NIF Chair",
    quote:
      "Catalogued in NIF's official archive of grassroots inventors, with multiple prototypes selected for national exhibition and Presidential demonstration.",
    logo: nifLogo,
  },
  {
    source: "MIT Technology Review",
    role: "Editorial coverage · Innovators track",
    quote:
      "Featured in the global innovators discourse for graphene-anchored material work emerging from India's deep-tech bench.",
    logo: mitTrLogo,
  },
  {
    source: "TED · TED-India",
    role: "Speaker · Long-form stage",
    quote:
      "On-stage at TED-India and allied platforms on invention, materials, and the industrial future of the carbon century.",
    logo: tedLogo,
  },
  {
    source: "INK Talks · INK Fellows Retreat",
    role: "INK Fellow · Speaker",
    quote:
      "Selected as an INK Fellow and featured speaker — part of a curated cohort of inventors, founders, and public thinkers.",
    logo: inkTalksLogo,
  },
  {
    source: "Indian Oil Corporation (IOCL)",
    role: "Industrial Recognition · Sujoy Choudhury, Director",
    quote:
      "Recognized at IOCL's R&D forum for advanced-materials work at the energy interface.",
    logo: ioclLogo,
  },
  {
    source: "Deloitte",
    role: "Innovation programs · Featured founder",
    quote:
      "Profiled within Deloitte's innovation and deep-tech programming as a founder operating across materials and industrial commercialization.",
    logo: deloitteLogo,
  },
];

// Editorial / press voices have been moved out of this section. Media
// coverage and the press archive live exclusively on the /news page so
// Voices remains a pure wall of institutional endorsement.


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

function VoiceCard({ v, i }: { v: Voice; i: number }) {
  const Wrap = v.href ? "a" : "div";
  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.08] py-10 md:py-12"
    >
      <Wrap
        {...(v.href
          ? { href: v.href, target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="group grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
      >
        <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-sm border border-foreground/10 bg-background/30 p-2 flex items-center justify-center">
          {v.logo ? (
            <img
              src={v.logo}
              alt={`${v.source} logo`}
              className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          ) : (
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
              {v.source.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
            {v.role}
          </p>
          <h3 className="mt-3 font-display text-xl md:text-2xl tracking-[-0.02em] text-foreground/95">
            {v.source}
          </h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-foreground/70 md:text-base italic">
            “{v.quote}”
          </p>
        </div>
      </Wrap>
    </motion.li>
  );
}

function VoicesList({ items }: { items: Voice[] }) {
  return (
    <ul className="not-prose mt-12 md:mt-16 flex flex-col">
      {items.map((v, i) => (
        <VoiceCard key={v.source} v={v} i={i} />
      ))}
      <li className="border-t border-foreground/[0.08]" />
    </ul>
  );
}

function VoicesPage() {
  return (
    <CinematicPageShell
      eyebrow="Voices · Institutions, Stages & Press"
      title={
        <>
          What the institutions<br className="hidden md:inline" /> have on record.
        </>
      }
      lead="A curated set of institutional voices, on-record recognitions, and editorial endorsements — drawn from sovereign honors, global stages, and the long press trail. Quotes are paraphrased from public record; primary sources are linked in News and Recognitions."
      backdrop={backdrop}
      overlay={0.76}
    >
      <VoicesStrip />

      <EditorialSection number="01 · Institutions" heading="On the record, from the institutions.">
        <p>
          Voices from sovereign bodies, foundations, and global platforms
          that have engaged the work over the past two decades.
        </p>
      </EditorialSection>

      <VoicesList items={institutional} />

    </CinematicPageShell>
  );
}
