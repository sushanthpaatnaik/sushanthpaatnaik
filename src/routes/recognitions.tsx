import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";

import {
  HallOfFameRibbon,
  LegacyTimeline,
  StatsAuthorityBlock,
  ArchivePlateSeries,
  PresidentialTriptych,
  type ArchiveItem,
} from "@/components/scene/ArchiveMosaic";
import backdrop from "@/assets/scene-recognition-archive.webp";

import awardKalam from "@/assets/hof/award-kalam.webp";
import awardPranab from "@/assets/hof/award-pranab-mukherjee.webp";
import awardPatil from "@/assets/hof/award-pratibha-patil.webp";
import awardPranabDemo from "@/assets/hof/award-pranab-demo.webp";
import awardPranabTrophy from "@/assets/hof/award-pranab-trophy.webp";
import awardLeaDiaMirza from "@/assets/hof/award-lea-dia-mirza.webp";
import awardIeemaCheque from "@/assets/hof/award-ieema-cheque.webp";
import awardStpiCert from "@/assets/hof/award-stpi-certificate.webp";
import awardBharatiya from "@/assets/hof/award-bharatiya-knowledge-symposium.webp";

import keynoteTed from "@/assets/hof/keynote-ted.webp";
import keynoteIit from "@/assets/hof/keynote-iit.webp";
import keynoteSV from "@/assets/hof/keynote-silicon-valley.webp";
import keynoteJosh from "@/assets/hof/keynote-josh-talks.webp";
import keynoteInk from "@/assets/hof/keynote-ink-fellows-retreat.webp";
import keynoteTiecon from "@/assets/hof/keynote-tiecon-mumbai.webp";
import keynoteBritish from "@/assets/hof/keynote-british-high-commission.webp";
import keynoteBeyond from "@/assets/hof/keynote-beyond-retreat-uncharted.webp";
import keynoteGmr from "@/assets/hof/keynote-gmr-innovex.webp";
import keynoteNit from "@/assets/hof/keynote-nit-rourkela.webp";
import keynoteIeema from "@/assets/hof/keynote-ieema-stage.webp";
import keynoteDriiv from "@/assets/hof/keynote-monoatom-driiv-booth.webp";
import keynoteBrics from "@/assets/hof/keynote-brics-roundtable.webp";

import fellowCert from "@/assets/hof/fellowship-certificate.webp";

import honorNasa from "@/assets/hof/honor-nasa-mqf.webp";
import honorIeema from "@/assets/hof/honor-ieema-finalists.webp";
import honorItalian from "@/assets/hof/honor-italian-embassy.webp";
import honorFicci from "@/assets/hof/honor-ficci-bharat.webp";
import honorStpi from "@/assets/hof/honor-stpi-startup-group.webp";
import honorGadkari from "@/assets/hof/honor-nitin-gadkari.webp";
import honorBricsMedal from "@/assets/hof/honor-brics-medal.webp";
import honorMop from "@/assets/hof/honor-ministry-power-bee.webp";
import honorG20 from "@/assets/hof/honor-startup20-g20.webp";
import honorMauritius from "@/assets/hof/honor-mauritius-high-commissioner.webp";
import honorIocl from "@/assets/hof/honor-sujoy-choudhury-iocl.webp";
import honorDriiv from "@/assets/hof/honor-driiv-mou.webp";

export const Route = createFileRoute("/recognitions")({
  component: RecognitionsPage,
  head: () => ({
    meta: [
      { title: "Recognitions — Six Presidential Awards · TED · MIT · NASA" },
      {
        name: "description",
        content:
          "Archival journey of recognition: six Indian Presidential awards, MIT TR-35, TED-India, NASA, NIF-India IGNITE, MIT Fab-10/11 and more.",
      },
      { property: "og:title", content: "Recognitions — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Archival record of twenty-seven honors and sixty-plus keynotes across research, deep-tech and public stages.",
      },
      { property: "og:url", content: "/recognitions" },
    ],
    links: [{ rel: "canonical", href: "/recognitions" }],
  }),
});

const milestones = [
  {
    n: "2008–13",
    title: "Six-time Indian Presidential awardee",
    body: "Honoured six times by three sitting Presidents of India — Dr. A.P.J. Abdul Kalam, Smt. Pratibha Patil and Shri Pranab Mukherjee — for sustained contribution to indigenous deep-tech and assistive innovation.",
  },
  {
    n: "2013–14",
    title: "MIT Fab-10 & Fab-11 Awardee",
    body: "Selected at the MIT Fab-10 (Barcelona) and Fab-11 international conferences for original prototypes built end-to-end in personal fabrication labs.",
  },
  {
    n: "2012",
    title: "TED-India Speaker",
    body: "Invited to TED-India as one of the youngest speakers ever featured — on sustainable graphene and the long arc from empathy to engineering.",
  },
  {
    n: "2010",
    title: "MIT TR-35 Awardee",
    body: "Recognised by MIT Technology Review among the world's top young innovators for work on sustainable materials and assistive technology.",
  },
  {
    n: "2011",
    title: "NASA Awardee",
    body: "International recognition at NASA Kennedy Space Center — including a research visit to the Mobile Quarantine Facility — for breakthrough engineering in human–machine interfaces.",
  },
  {
    n: "2010",
    title: "Intel IRIS Awardee",
    body: "Won the Intel IRIS National Science Fair for the breath-operated wheelchair — the school-bench prototype that opened a fifteen-year practice in deep-tech.",
  },
];

// Archival ledger — chronologically grouped, with featured milestones
// marked for cinematic hierarchy (Presidential, MIT TR-35, NASA, TED,
// Intel IRIS, MIT Fab-10/11, BRICS, G20, Silicon Valley). Featured
// entries get a foregrounded archival marker; the rest sit as supporting
// register lines beneath the year anchor.
type LedgerEntry = { title: string; institution?: string; featured?: boolean };
type LedgerYear = { year: string; entries: LedgerEntry[] };

const ledgerByYear: LedgerYear[] = [
  {
    year: "2008",
    entries: [
      { title: "President of India Award", institution: "Dr. A.P.J. Abdul Kalam · NIF", featured: true },
      { title: "35th Jawaharlal Nehru National Science Exhibition", institution: "NCERT" },
      { title: "CBSE National Science Exhibition Award" },
      { title: "Institute of Physics Exhibition Award" },
    ],
  },
  {
    year: "2009",
    entries: [
      { title: "President of India Award", institution: "Smt. Pratibha Devisingh Patil · NIF", featured: true },
      { title: "President of India Award", institution: "Dr. A.P.J. Abdul Kalam · NIF", featured: true },
      { title: "KVPY Fellow", institution: "Department of Science & Technology" },
      { title: "NCSC Award" },
    ],
  },
  {
    year: "2010",
    entries: [
      { title: "TR-35 Award", institution: "MIT Technology Review", featured: true },
      { title: "Intel IRIS · Best Popular Invention Award", featured: true },
      { title: "INK Fellow" },
    ],
  },
  {
    year: "2011",
    entries: [
      { title: "NASA Award", institution: "Kennedy Space Center · Huntsville", featured: true },
      { title: "DLF–Pramerica Spirit of Community Award" },
      { title: "Eureka-11 · IIT-Bombay Business Plan Contest" },
    ],
  },
  {
    year: "2012",
    entries: [
      { title: "TED-India Speaker", institution: "TED · Mysore", featured: true },
      { title: "Golden Book of World Record Holder" },
      { title: "IDEAS-12 · IIT-Kanpur Business Plan Contest" },
      { title: "Innovio-12 · KIIT Business Plan Contest" },
      { title: "Judge · SELL-X Exodia · IIT-Mandi" },
    ],
  },
  {
    year: "2013",
    entries: [
      { title: "President of India Award", institution: "Shri Pranab Mukherjee · NIF", featured: true },
      { title: "ICAI Abu Dhabi Speaker" },
    ],
  },
  {
    year: "2013–14",
    entries: [
      { title: "MIT Fab-10 & Fab-11 Awardee", institution: "MIT · Barcelona", featured: true },
      { title: "Under-35 CEO Award", institution: "Yinka Brand" },
    ],
  },
  {
    year: "2021",
    entries: [
      { title: "STPI-Chunauti Winner", institution: "Software Technology Parks of India" },
    ],
  },
  {
    year: "2022",
    entries: [
      { title: "BRICS Diplomatic Honour", institution: "BRICS Global Forum", featured: true },
    ],
  },
  {
    year: "2023",
    entries: [
      { title: "Startup20 · G20 Presidency", institution: "Government of India", featured: true },
    ],
  },
  {
    year: "2024",
    entries: [
      { title: "ELECRAMA Winner" },
      { title: "Silicon Valley Speaker", institution: "Bay Area · USA", featured: true },
    ],
  },
  {
    year: "2025",
    entries: [
      { title: "CEO Club Speaker" },
      { title: "Innovision Keynote", institution: "NIT Rourkela" },
    ],
  },
];

// Era 1 — Young inventor & presidential years (2008–2013) · curated 6
const eraPresidential: ArchiveItem[] = [
  {
    src: awardKalam,
    caption: "With Dr. A.P.J. Abdul Kalam",
    meta: "Presidential Award · NIF · 2008",
    category: "Award",
    shape: "hero",
    focus: "center 28%",
    institution: "National Innovation Foundation",
    recognition: "Presidential Recognition · 2008",
    presenter: "Presented by Dr. A.P.J. Abdul Kalam",
    venue: "Rashtrapati Bhavan · New Delhi",
  },
  {
    src: awardPatil,
    caption: "With President Pratibha Patil",
    meta: "Presidential Award · 2009",
    category: "Award",
    shape: "tall",
    institution: "National Innovation Foundation",
    recognition: "Presidential Recognition · 2009",
    presenter: "Presented by Smt. Pratibha Devisingh Patil",
    venue: "Rashtrapati Bhavan · New Delhi",
  },
  {
    src: awardPranab,
    caption: "With President Pranab Mukherjee",
    meta: "Presidential Award · 2013",
    category: "Award",
    shape: "wide",
    focus: "left top",
    institution: "National Innovation Foundation",
    recognition: "Presidential Recognition · 2013",
    presenter: "Presented by Shri Pranab Mukherjee",
    venue: "Rashtrapati Bhavan · New Delhi",
  },
  {
    src: awardPranabDemo,
    caption: "Demonstrating to the President",
    meta: "Presidential Showcase · 2013",
    category: "Award",
    focus: "center 35%",
    institution: "Presidential Innovation Showcase",
    recognition: "Demonstration · 2013",
    venue: "Rashtrapati Bhavan · New Delhi",
  },
  {
    src: awardPranabTrophy,
    caption: "Presidential Trophy",
    meta: "NIF-India · 2013",
    category: "Award",
    shape: "tall",
    institution: "National Innovation Foundation",
    recognition: "Presidential Trophy · 2013",
    venue: "Government of India · New Delhi",
  },
  {
    src: fellowCert,
    caption: "Honour Certificate",
    meta: "Record of Recognition",
    category: "Fellowship",
    institution: "Archival Citation",
    recognition: "Record of Recognition",
  },
];

// Era 2 — Global stages & institutional recognition (2010–2014) · curated 5
const eraGlobal: ArchiveItem[] = [
  {
    src: keynoteTed,
    caption: "TED-India Speaker",
    meta: "Youngest at the time · 2012",
    category: "Keynote",
    shape: "hero",
    institution: "TED-India",
    recognition: "Featured Speaker · 2012",
    presenter: "Among the youngest speakers ever featured",
    venue: "Mysore · India",
  },
  {
    src: honorNasa,
    caption: "NASA Mobile Quarantine Facility",
    meta: "U.S. Space & Rocket Center · Huntsville",
    category: "Honor",
    shape: "wide",
    institution: "NASA",
    recognition: "International Recognition · 2011",
    venue: "Kennedy Space Center · Huntsville",
  },
  { src: keynoteIit, caption: "IIT Stage Address", meta: "Inter-IIT Forum · early 2010s", category: "Keynote" },
  { src: keynoteJosh, caption: "Josh Talks × Facebook", meta: "Empowering Youth & Entrepreneurs", category: "Keynote", shape: "tall" },
  { src: keynoteInk, caption: "INK Fellows Retreat", meta: "Bengaluru · 2022", category: "Keynote", shape: "wide" },
];

// Era 3 — Industrial leadership & diplomacy (2020–2025) · curated 11
const eraIndustrial: ArchiveItem[] = [
  { src: honorDriiv, caption: "MoU Signing · DRIIV, PSA, Govt of India", meta: "Delhi Research Implementation & Innovation", category: "Honor", shape: "wide" },
  { src: honorIocl, caption: "With Shri Sujoy Choudhury", meta: "Director (P&BD) · Indian Oil Corporation", category: "Honor", shape: "tall" },
  { src: keynoteBrics, caption: "BRICS Roundtable Address", meta: "Diplomatic Forum · New Delhi · 2022", category: "Keynote", shape: "wide", focus: "70% center" },
  { src: honorBricsMedal, caption: "BRICS Honour", meta: "International Recognition · 2022", category: "Honor", focus: "center 25%" },
  { src: honorItalian, caption: "With H.E. Antonio Bartoli", meta: "Ambassador of Italy to India", category: "Honor" },
  { src: honorMauritius, caption: "With H.E. Mrs. Sheilabai Bappoo, G.O.S.K.", meta: "High Commissioner · Mauritius", category: "Honor", shape: "wide", focus: "center 30%" },
  { src: honorG20, caption: "With Prince Fahad bin Mansour Al-Saud", meta: "Startup20 · G20 · Gurugram · 2023", category: "Honor", shape: "hero", focus: "center 25%", institution: "Startup20 Engagement Group", recognition: "G20 India Presidency · 2023", presenter: "With H.H. Prince Fahad bin Mansour Al-Saud", venue: "Gurugram · India" },
  { src: keynoteBritish, caption: "British High Commission", meta: "Address · New Delhi", category: "Keynote" },
  { src: honorGadkari, caption: "With Shri Nitin Gadkari", meta: "Union Minister · Transport Bhawan", category: "Honor", focus: "center 22%" },
  { src: honorMop, caption: "Ministry of Power · Bureau of Energy Efficiency", meta: "Govt of India · New Delhi · 2023", category: "Honor", focus: "center 30%" },
  { src: honorFicci, caption: "FICCI Bharat Summit", meta: "Delegate · 2024", category: "Honor", shape: "tall", focus: "center 20%" },
];

// Era 4 — Awards, stages, and the present field (2022–2025) · curated 13
const eraPresent: ArchiveItem[] = [
  { src: awardLeaDiaMirza, caption: "LEA Excellence Award with Dia Mirza", meta: "Mumbai · July 2022", category: "Award", shape: "hero", institution: "Lions Excellence Awards", recognition: "Excellence in Innovation · 2022", presenter: "Felicitated alongside Dia Mirza", venue: "Mumbai · India" },
  { src: keynoteTiecon, caption: "TiECON Mumbai", meta: "India Unicorn Summit · 2022", category: "Keynote" },
  { src: honorIeema, caption: "IEEMA Finalists", meta: "Buildelec · Intelect · Distribuelec · 2024", category: "Honor", shape: "wide", focus: "70% center" },
  { src: awardIeemaCheque, caption: "IEEMA Award Presentation", meta: "Young Innovator Recognition · 2024", category: "Award" },
  { src: keynoteIeema, caption: "IEEMA Mainstage Address", meta: "Buildelec · Mumbai · Jan 2024", category: "Keynote", shape: "wide" },
  { src: keynoteBeyond, caption: "Beyond Retreat · Uncharted Paths", meta: "Speaker · Ahmedabad · Mar 2025", category: "Keynote", shape: "wide" },
  { src: keynoteGmr, caption: "GMR Innovex Innovation Summit", meta: "Felicitation · GMRIT", category: "Keynote" },
  { src: keynoteNit, caption: "Innovision · NIT Rourkela", meta: "Marine Matrix Keynote · Nov 2025", category: "Keynote", shape: "wide" },
  { src: awardStpiCert, caption: "STPI Certificate of Merit", meta: "National Conclave Winner · 2022", category: "Award", shape: "tall" },
  { src: honorStpi, caption: "ESC–STPI Startup Initiative Winners", meta: "Building the Next Unicorn · 2022", category: "Honor", shape: "wide" },
  { src: keynoteDriiv, caption: "Monoatom Labs · DRIIV Showcase", meta: "Graphene Innovation Pavilion", category: "Keynote", shape: "wide", focus: "30% center" },
  { src: awardBharatiya, caption: "Bharatiya Knowledge Systems Symposium", meta: "Felicitation · School of IT · 2024", category: "Award", shape: "tall", focus: "center 60%" },
  { src: keynoteSV, caption: "Silicon Valley Address", meta: "Bay Area · 2024", category: "Keynote", shape: "wide" },
];

const counters = [
  { value: "27", label: "Honors of record" },
  { value: "6", label: "Presidential recognitions" },
  { value: "60+", label: "Keynotes since 2010" },
  { value: "14+", label: "Years of industrial research" },
];

// Hall of Fame ribbon — curated continuous archival reel (9 plates).
const hallOfFame: ArchiveItem[] = [
  { src: keynoteTed, caption: "TED-India Main Stage", meta: "Mysore · 2012", category: "Keynote" },
  { src: awardKalam, caption: "With Dr. A.P.J. Abdul Kalam", meta: "Rashtrapati Bhavan · 2008", category: "Award", focus: "center 28%" },
  { src: keynoteSV, caption: "Silicon Valley Address", meta: "Bay Area · 2024", category: "Keynote" },
  { src: awardPranabDemo, caption: "Presidential Demonstration", meta: "New Delhi · 2013", category: "Award", focus: "center 35%" },
  { src: honorNasa, caption: "NASA Recognition", meta: "Kennedy Space Center · 2011", category: "Honor" },
  { src: keynoteBrics, caption: "BRICS Roundtable", meta: "New Delhi · 2022", category: "Keynote", focus: "70% center" },
  { src: keynoteIeema, caption: "IEEMA Mainstage", meta: "Mumbai · 2024", category: "Keynote" },
  { src: awardLeaDiaMirza, caption: "LEA Excellence Award", meta: "Mumbai · 2022", category: "Award" },
  { src: honorG20, caption: "Startup20 · G20", meta: "Gurugram · 2023", category: "Honor", focus: "center 25%" },
];

function RecognitionsPage() {
  return (
    <CinematicPageShell
      eyebrow="Recognitions · Twenty-Seven Honors of Record"
      title={<>An archival journey<br className="hidden md:inline" /> of recognition.</>}
      lead="From a school-bench prototype to Rashtrapati Bhavan and Silicon Valley — a photographic record of two decades on stage, in the lab, and in conversation with institutions."
      backdrop={backdrop}
      overlay={0.74}
    >
      {/* Institutional statistics — authority block */}
      <StatsAuthorityBlock items={counters} eyebrow="Archive · Register of Record" />

      {/* Chronological prestige flow — single legible arc */}
      <LegacyTimeline
        eyebrow="Legacy · Chronological Prestige"
        items={[
          { year: "2008", title: "First Presidential Award", institution: "Dr. A.P.J. Abdul Kalam · NIF" },
          { year: "2009", title: "Second & Third Presidential Awards", institution: "Smt. Pratibha Patil · Dr. A.P.J. Abdul Kalam" },
          { year: "2010", title: "MIT TR-35 Innovator", institution: "MIT Technology Review" },
          { year: "2011", title: "NASA International Recognition", institution: "Kennedy Space Center" },
          { year: "2012", title: "TED-India Speaker", institution: "TED · Mysore" },
          { year: "2013", title: "Sixth Presidential Award", institution: "Shri Pranab Mukherjee · NIF" },
          { year: "2013–14", title: "MIT Fab-10 & Fab-11", institution: "MIT · Barcelona" },
          { year: "2022", title: "BRICS Diplomatic Honour", institution: "BRICS Global Forum" },
          { year: "2023", title: "Startup20 · G20 Presidency", institution: "Government of India" },
          { year: "2024", title: "Silicon Valley Address", institution: "Bay Area · USA" },
          { year: "2025", title: "Innovision Keynote", institution: "NIT Rourkela" },
        ]}
      />

      {/* Hall of Fame overture — cinematic reel as opening movement */}
      <EditorialSection number="06 · Overture" heading="A continuous archival reel.">
        <p>
          Before the chronology — an opening movement. Newspaper clippings,
          mainstage moments, presidential demonstrations and honorary
          citations arranged as a single cinematic strip.
        </p>
      </EditorialSection>
      <HallOfFameRibbon items={hallOfFame} eyebrow="Hall of Fame · Continuous Reel" />

      <EditorialSection
        number="06b · Featured"
        heading="Six recognitions that define the archive."
      >
        <p>
          The gravitational anchors of the register — the citations that the
          rest of the chronology orbits. Read each as an institutional plate
          rather than a line item.
        </p>
      </EditorialSection>

      <div className="not-prose mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/[0.06] border border-foreground/[0.06]">
        {milestones.map((m, i) => (
          <motion.article
            key={m.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, delay: (i % 2) * 0.08, ease: [0.19, 1, 0.22, 1] }}
            className="group relative bg-[oklch(0.045_0.003_245)] p-8 md:p-12 transition-colors duration-700 hover:bg-[oklch(0.062_0.003_245)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--foreground) 4%, transparent) 0%, transparent 60%)",
              }}
            />
            <div className="relative flex items-baseline justify-between gap-6 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/55">
                Milestone · {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-sm md:text-base tracking-[-0.02em] text-foreground/55">
                {m.n}
              </span>
            </div>
            <h3 className="relative font-display text-2xl md:text-[28px] leading-[1.15] tracking-[-0.028em] text-foreground/95">
              {m.title}
            </h3>
            <p className="relative mt-5 text-[14px] md:text-[14.5px] leading-[1.75] text-foreground/65 max-w-[52ch]">
              {m.body}
            </p>
            <div
              aria-hidden
              className="relative mt-8 h-px w-12 bg-foreground/20 group-hover:w-24 transition-all duration-700"
            />
          </motion.article>
        ))}
      </div>


      <EditorialSection number="07 · Centerpiece" heading="Three Presidents of India. Six citations.">
        <p>
          The defining plate of the archive — felicitated by three sitting
          Presidents of India across six separate citations, between 2008 and
          2013. The earliest works in the register, and the gravitational
          centre around which the rest of the recognitions orbit.
        </p>
      </EditorialSection>
      <PresidentialTriptych
        items={[eraPresidential[0], eraPresidential[1], eraPresidential[3]]}
      />

      <EditorialSection number="08 · Archive I" heading="2008 – 2013 · Rashtrapati Bhavan years.">
        <p>
          Six citations, three sitting Presidents of India. The earliest plates
          in the archive — when the prototypes still smelled of school workshop
          and the country was just beginning to notice.
        </p>
      </EditorialSection>
      <ArchivePlateSeries
        items={eraPresidential}
        eyebrow="Archive I · Presidential Years"
        startIndex={1}
      />

      <EditorialSection number="09 · Archive II" heading="2010 – 2014 · Global stages.">
        <p>
          TED-India, NASA Kennedy Space Center, INK, MIT Technology Review.
          The first decade abroad — speaking, fellowshipping, and bringing the
          work into conversation with the world.
        </p>
      </EditorialSection>
      <ArchivePlateSeries
        items={eraGlobal}
        eyebrow="Archive II · Global Stages"
        startIndex={eraPresidential.length + 1}
      />

      <EditorialSection number="10 · Archive III" heading="2020 – 2025 · Industrial leadership & diplomacy.">
        <p>
          The diplomatic and ministerial years — embassies, BRICS, G20, the
          Ministry of Power, and the signing of MoUs that turn frontier
          research into national infrastructure.
        </p>
      </EditorialSection>
      <ArchivePlateSeries
        items={eraIndustrial}
        eyebrow="Archive III · Industrial & Diplomatic"
        startIndex={eraPresidential.length + eraGlobal.length + 1}
      />

      <EditorialSection number="11 · Archive IV" heading="2022 – 2025 · The present field.">
        <p>
          IEEMA mainstage, Silicon Valley, GMR Innovex, NIT Rourkela, Beyond
          Retreat, Bharatiya Knowledge Systems. The current chapter — where
          materials, ventures and public address converge.
        </p>
      </EditorialSection>
      <ArchivePlateSeries
        items={eraPresent}
        eyebrow="Archive IV · The Present Field"
        startIndex={
          eraPresidential.length + eraGlobal.length + eraIndustrial.length + 1
        }
      />



      <EditorialSection number="12 · Register" heading="The legacy register, year by year.">
        <p>
          The complete chronological record — the public archive that the
          photographic plates above sit on top of. Featured citations are
          marked as cinematic milestone anchors; the rest read as the
          institutional register beneath them.
        </p>
      </EditorialSection>

      <div className="not-prose relative mt-12">
        {/* Vertical archival rail */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[88px] md:left-[140px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-foreground/[0.10] to-transparent"
        />

        <ol className="flex flex-col gap-16 md:gap-20">
          {ledgerByYear.map((group, gi) => (
            <motion.li
              key={group.year}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, delay: gi * 0.04, ease: [0.19, 1, 0.22, 1] }}
              className="relative grid grid-cols-[80px_1fr] md:grid-cols-[132px_1fr] gap-x-8 md:gap-x-14"
            >
              {/* Year anchor */}
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute right-[-8px] md:right-[-6px] top-[14px] h-1.5 w-1.5 rounded-full bg-foreground/30 ring-4 ring-[oklch(0.045_0.003_245)]"
                />
                <h3 className="font-display text-2xl md:text-4xl tracking-[-0.04em] text-foreground/85 leading-none pt-2">
                  {group.year}
                </h3>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/45">
                  Archive · {String(gi + 1).padStart(2, "0")}
                </p>
              </div>

              {/* Entries column */}
              <ul className="flex flex-col">
                {group.entries.map((e, ei) => (
                  <li
                    key={`${group.year}-${ei}`}
                    className={`group relative border-t border-foreground/[0.06] transition-colors duration-700 hover:border-foreground/20 ${
                      e.featured
                        ? "py-5 md:py-6"
                        : "py-3.5 md:py-4"
                    } ${ei === group.entries.length - 1 ? "border-b border-foreground/[0.06]" : ""}`}
                  >
                    {e.featured ? (
                      <div className="grid grid-cols-[auto_1fr] gap-x-5 items-baseline">
                        <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-foreground/55 pt-1.5">
                          ◆ Milestone
                        </span>
                        <div>
                          <h4 className="font-display text-[17px] md:text-[19px] tracking-[-0.018em] text-foreground/95 leading-snug">
                            {e.title}
                          </h4>
                          {e.institution && (
                            <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/55">
                              {e.institution}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-[auto_1fr] gap-x-5 items-baseline">
                        <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-muted-foreground/35 pt-0.5">
                          ·
                        </span>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-[13.5px] leading-relaxed text-foreground/72">
                            {e.title}
                          </span>
                          {e.institution && (
                            <span className="text-[11.5px] text-muted-foreground/55">
                              {e.institution}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>


      <EditorialSection number="13 · Posture" heading="Recognition is a lagging indicator.">
        <p>
          The catalogue is a record, not a destination. By the time an award
          arrives the work it celebrates is already behind. The next prototype —
          the one that doesn't yet exist — is where the real work continues.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
