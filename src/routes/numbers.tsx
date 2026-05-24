import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-numbers-field.webp";

export const Route = createFileRoute("/numbers")({
  component: NumbersPage,
  head: () => ({
    meta: [
      { title: "Numbers — Milestones, Honors & Industrial Footprint" },
      {
        name: "description",
        content:
          "A cinematic data ledger: presidential awards, honors, keynotes, ventures, prototypes, patents, media features, and years of work across two decades of deep-tech invention.",
      },
      { property: "og:title", content: "Numbers — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Quantified record of recognition, invention, and industrial reach — a ledger of the work behind the work.",
      },
      { property: "og:url", content: "/numbers" },
    ],
    links: [{ rel: "canonical", href: "/numbers" }],
  }),
});

const ledger: { n: string; v: string; l: string; note: string }[] = [
  {
    n: "01",
    v: "06",
    l: "Presidential awards",
    note: "Honored by three Presidents of India — Pratibha Patil, Pranab Mukherjee, and earlier laureates — across IGNITE, NIF and National Inspire platforms.",
  },
  {
    n: "02",
    v: "27+",
    l: "Honors & fellowships",
    note: "Including MIT TR-35 nomination cycles, NASA MQF, NIF-India IGNITE, Italian Embassy, FICCI Bharat, BRICS medal, Ministry of Power, and Mauritius High Commission.",
  },
  {
    n: "03",
    v: "60+",
    l: "Keynotes & talks",
    note: "TED-India, INK Fellows Retreat, Silicon Valley summits, IITs, TiECon Mumbai, British High Commission, Josh Talks, BRICS Roundtable, GMR Innovex, NIT Rourkela, IEEMA, MonoAtom·DRIIV booths.",
  },
  {
    n: "04",
    v: "23",
    l: "Material inventions",
    note: "Patented & in-process graphene-anchored materials across coatings, energy, water, defense, mobility, and construction — from Armophene to Voltaphene.",
  },
  {
    n: "05",
    v: "12+",
    l: "Ventures & operating arms",
    note: "Operating group spanning MonoAtom, DRIIV, and partner industrial vehicles taking frontier materials into manufactured product.",
  },
  {
    n: "06",
    v: "30+",
    l: "Prototypes shipped",
    note: "From early-works (Enabler, Powergen, Rectofit, SheWatch, Solka, SuperSense) through industrial-grade material prototypes commercialized via the operating group.",
  },
  {
    n: "07",
    v: "40+",
    l: "Media features",
    note: "India Today, Times of India, Business Standard, Deccan Chronicle, The Telegraph, Rediff, The Print, New Indian Express, Governance Now, YourStory, MIT Tech Review, Global Indian, NIF.",
  },
  {
    n: "08",
    v: "20",
    l: "Years of work",
    note: "From a teenage IGNITE awardee in the mid-2000s to a deep-tech operating group architect — two decades of continuous invention and industrialization.",
  },
];

function LedgerStrip() {
  return (
    <StatsStrip
      className="mt-4"
      items={[
        { v: "06", l: "Presidential awards" },
        { v: "27+", l: "Honors" },
        { v: "60+", l: "Keynotes" },
        { v: "23", l: "Inventions" },
      ]}
    />
  );
}

function LedgerList() {
  return (
    <ul className="not-prose mt-12 md:mt-16 flex flex-col">
      {ledger.map((l, i) => (
        <motion.li
          key={l.l}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, delay: i * 0.04, ease: [0.19, 1, 0.22, 1] }}
          className="group relative grid grid-cols-[auto_auto_1fr] gap-6 md:gap-10 items-baseline border-t border-foreground/[0.08] py-10 md:py-12 transition-colors duration-700 hover:border-foreground/25"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55 pt-2">
            {l.n}
          </span>
          <span className="font-display text-4xl md:text-6xl tracking-[-0.04em] text-gradient leading-none min-w-[3.5ch]">
            {l.v}
          </span>
          <div>
            <h3 className="font-display text-xl md:text-2xl tracking-[-0.02em] text-foreground/95">
              {l.l}
            </h3>
            <p className="mt-3 max-w-2xl text-[14px] md:text-[15px] leading-[1.7] text-foreground/65">
              {l.note}
            </p>
          </div>
        </motion.li>
      ))}
      <li className="border-t border-foreground/[0.08]" />
    </ul>
  );
}

function NumbersPage() {
  return (
    <CinematicPageShell
      eyebrow="Numbers · A Cinematic Data Ledger"
      title={
        <>
          The ledger<br className="hidden md:inline" /> behind the work.
        </>
      }
      lead="Two decades of invention, recognition, and industrial momentum — collected as a single quantified record. Numbers do not replace the story; they confirm it."
      backdrop={backdrop}
      overlay={0.76}
    >
      <LedgerStrip />

      <EditorialSection number="01 · Ledger" heading="Eight measurements of a single arc.">
        <p>
          Each row below is one dimension of the work: recognition, invention,
          industrialization, voice, and time. None of them are the work itself
          — but together they trace its outline.
        </p>
      </EditorialSection>

      <LedgerList />

      <EditorialSection number="02 · Method" heading="How the count is kept.">
        <p>
          Awards and honors are catalogued in the Recognitions archive.
          Inventions are tracked across the Innovations atlas with their
          provisional patent records. Ventures and prototypes are recorded
          through the Operating Group. Media features are mirrored in the
          News archive. Years count from the first IGNITE honor.
        </p>
        <p>
          Numbers are updated as the operating group ships. The ledger errs
          toward restraint — when in doubt, a milestone is omitted until it
          is fully on-record.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
