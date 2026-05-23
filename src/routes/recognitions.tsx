import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";

import {
  HallOfFameRibbon,

  StatsAuthorityBlock,
  ArchivePlateSeries,
  PresidentialTriptych,
  type ArchiveItem,
} from "@/components/scene/ArchiveMosaic";
import backdrop from "@/assets/scene-recognition-archive.webp";
import closureBackdrop from "@/assets/scene-legacy-closure.webp";

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

function EraAccordion({
  number,
  era,
  title,
  description,
  defaultOpen = false,
  plateCount,
  registryCount,
  children,
}: {
  number: string;
  era: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  plateCount: number;
  registryCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="not-prose group/era relative border-t border-foreground/[0.08]"
    >
      <Collapsible.Trigger className="w-full text-left py-10 md:py-14 transition-colors duration-700 hover:bg-[oklch(0.05_0.003_245)]/40">
        <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-8 md:gap-x-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/55 pt-2">
            {number}
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55 mb-3">
              Era · {era}
            </p>
            <h3 className="font-display text-[26px] md:text-[34px] leading-[1.1] tracking-[-0.03em] text-foreground/95">
              {title}
            </h3>
            <p className="mt-4 max-w-[58ch] text-[13.5px] md:text-[14px] leading-[1.75] text-foreground/60">
              {description}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45">
              {plateCount} plates · {registryCount} citations
            </p>
          </div>
          <span
            aria-hidden
            className="font-mono text-[11px] uppercase tracking-[0.4em] text-foreground/55 pt-2 flex items-center gap-3 select-none"
          >
            <span className="hidden md:inline">{open ? "Collapse" : "Open archive"}</span>
            <span
              className={`inline-block h-px w-8 bg-foreground/40 transition-transform duration-700 ${
                open ? "rotate-90" : ""
              }`}
            />
          </span>
        </div>
      </Collapsible.Trigger>
      <AnimatePresence initial={false}>
        {open && (
          <Collapsible.Content forceMount asChild>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-16 md:pb-20 pt-2">{children}</div>
            </motion.div>
          </Collapsible.Content>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  );
}

function LedgerYearGroup({ groups }: { groups: LedgerYear[] }) {
  return (
    <div className="relative mt-2">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[80px] md:left-[120px] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-foreground/[0.10] to-transparent"
      />
      <ol className="flex flex-col gap-12 md:gap-14">
        {groups.map((group, gi) => (
          <li
            key={group.year}
            className="relative grid grid-cols-[72px_1fr] md:grid-cols-[112px_1fr] gap-x-8 md:gap-x-12"
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute right-[-7px] top-[14px] h-1.5 w-1.5 rounded-full bg-foreground/30 ring-4 ring-[oklch(0.045_0.003_245)]"
              />
              <h4 className="font-display text-xl md:text-3xl tracking-[-0.04em] text-foreground/80 leading-none pt-2">
                {group.year}
              </h4>
            </div>
            <ul className="flex flex-col">
              {group.entries.map((e, ei) => (
                <li
                  key={`${group.year}-${ei}`}
                  className={`group/row border-t border-foreground/[0.06] transition-colors duration-700 hover:border-foreground/20 ${
                    e.featured ? "py-4 md:py-5" : "py-3 md:py-3.5"
                  } ${ei === group.entries.length - 1 ? "border-b border-foreground/[0.06]" : ""}`}
                >
                  {e.featured ? (
                    <div className="grid grid-cols-[auto_1fr] gap-x-5 items-baseline">
                      <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-foreground/55 pt-1">
                        ◆
                      </span>
                      <div>
                        <h5 className="font-display text-[16px] md:text-[18px] tracking-[-0.018em] text-foreground/95 leading-snug">
                          {e.title}
                        </h5>
                        {e.institution && (
                          <p className="mt-1 text-[12px] leading-relaxed text-foreground/55">
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
                        <span className="text-[13px] leading-relaxed text-foreground/72">
                          {e.title}
                        </span>
                        {e.institution && (
                          <span className="text-[11px] text-muted-foreground/55">
                            {e.institution}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Helper: slice ledger by year membership
function ledgerSlice(years: string[]): LedgerYear[] {
  return ledgerByYear.filter((g) => years.includes(g.year));
}

function RecognitionsPage() {
  return (
    <CinematicPageShell
      eyebrow="Recognitions · Twenty-Seven Honors of Record"
      title={<>An archival journey<br className="hidden md:inline" /> of recognition.</>}
      lead="From a school-bench prototype to Rashtrapati Bhavan and Silicon Valley — a photographic record of two decades on stage, in the lab, and in conversation with institutions."
      backdrop={backdrop}
      overlay={0.74}
    >
      {/* 01 · Featured Recognition — cinematic highlight tier (lead) */}
      <EditorialSection
        number="01 · Featured"
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

      {/* 02 · Authority block — institutional register at a glance */}
      <StatsAuthorityBlock items={counters} eyebrow="Archive · Register of Record" />

      {/* 03 · Hall of Fame overture — cinematic reel as visual pause */}
      <EditorialSection number="03 · Overture" heading="A continuous archival reel.">
        <p>
          A single cinematic strip — newspaper plates, mainstage moments,
          presidential demonstrations and honorary citations — before the
          deeper archive opens.
        </p>
      </EditorialSection>
      <HallOfFameRibbon items={hallOfFame} eyebrow="Hall of Fame · Continuous Reel" />

      {/* 04 · Centerpiece — Presidential triptych */}
      <EditorialSection number="04 · Centerpiece" heading="Three Presidents of India. Six citations.">
        <p>
          The defining plate of the archive — felicitated by three sitting
          Presidents of India across six separate citations between 2008 and
          2013. The gravitational centre around which the rest of the
          recognitions orbit.
        </p>
      </EditorialSection>
      <PresidentialTriptych
        items={[eraPresidential[0], eraPresidential[1], eraPresidential[3]]}
      />

      {/* 05 · Era archives — progressive disclosure */}
      <EditorialSection number="05 · Archives" heading="Open the era you want to walk through.">
        <p>
          Four eras, four archives. Each opens into the full photographic
          plates and the year-by-year register for that period. Closed by
          default so the chronology can be read at the pace of attention.
        </p>
      </EditorialSection>

      <div className="not-prose mt-10 border-b border-foreground/[0.08]">
        <EraAccordion
          number="I"
          era="2008 – 2013"
          title="Rashtrapati Bhavan years."
          description="Six citations, three sitting Presidents of India. The earliest plates in the archive — when the prototypes still smelled of school workshop and the country was just beginning to notice."
          plateCount={eraPresidential.length}
          registryCount={ledgerSlice(["2008", "2009", "2013"]).reduce((a, g) => a + g.entries.length, 0)}
          defaultOpen
        >
          <ArchivePlateSeries
            items={eraPresidential}
            eyebrow="Archive I · Presidential Years"
            startIndex={1}
          />
          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55 mb-6">
              Register · Year by Year
            </p>
            <LedgerYearGroup groups={ledgerSlice(["2008", "2009", "2013"])} />
          </div>
        </EraAccordion>

        <EraAccordion
          number="II"
          era="2010 – 2014"
          title="Global stages."
          description="TED-India, NASA Kennedy Space Center, INK, MIT Technology Review, MIT Fab-10 & Fab-11. The first decade abroad — speaking, fellowshipping, and bringing the work into conversation with the world."
          plateCount={eraGlobal.length}
          registryCount={ledgerSlice(["2010", "2011", "2012", "2013–14"]).reduce((a, g) => a + g.entries.length, 0)}
        >
          <ArchivePlateSeries
            items={eraGlobal}
            eyebrow="Archive II · Global Stages"
            startIndex={eraPresidential.length + 1}
          />
          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55 mb-6">
              Register · Year by Year
            </p>
            <LedgerYearGroup groups={ledgerSlice(["2010", "2011", "2012", "2013–14"])} />
          </div>
        </EraAccordion>

        <EraAccordion
          number="III"
          era="2020 – 2023"
          title="Industrial leadership & diplomacy."
          description="The diplomatic and ministerial years — embassies, BRICS, G20, the Ministry of Power, and the signing of MoUs that turn frontier research into national infrastructure."
          plateCount={eraIndustrial.length}
          registryCount={ledgerSlice(["2021", "2022", "2023"]).reduce((a, g) => a + g.entries.length, 0)}
        >
          <ArchivePlateSeries
            items={eraIndustrial}
            eyebrow="Archive III · Industrial & Diplomatic"
            startIndex={eraPresidential.length + eraGlobal.length + 1}
          />
          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55 mb-6">
              Register · Year by Year
            </p>
            <LedgerYearGroup groups={ledgerSlice(["2021", "2022", "2023"])} />
          </div>
        </EraAccordion>

        <EraAccordion
          number="IV"
          era="2024 – 2025"
          title="The present field."
          description="IEEMA mainstage, Silicon Valley, GMR Innovex, NIT Rourkela, Beyond Retreat, Bharatiya Knowledge Systems. The current chapter — where materials, ventures and public address converge."
          plateCount={eraPresent.length}
          registryCount={ledgerSlice(["2024", "2025"]).reduce((a, g) => a + g.entries.length, 0)}
        >
          <ArchivePlateSeries
            items={eraPresent}
            eyebrow="Archive IV · The Present Field"
            startIndex={eraPresidential.length + eraGlobal.length + eraIndustrial.length + 1}
          />
          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55 mb-6">
              Register · Year by Year
            </p>
            <LedgerYearGroup groups={ledgerSlice(["2024", "2025"])} />
          </div>
        </EraAccordion>
      </div>

      {/* 06 · Legacy Closure — cinematic institutional farewell */}
      <section className="not-prose relative mt-32 md:mt-44 overflow-hidden">
        {/* Atmospheric backdrop plate */}
        <div aria-hidden className="absolute inset-1 z-0 overflow-hidden rounded-sm">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${closureBackdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center 55%",
              filter: "blur(5px) saturate(0.30) brightness(0.40) contrast(1.06)",
              transform: "scale(1.12)",
            }}
          />
          <div
            className="absolute inset-1"
            style={{
              backgroundImage: `url(${closureBackdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center 55%",
              filter: "blur(32px) saturate(0.24) brightness(0.36)",
              transform: "scale(1.20)",
              WebkitMaskImage:
                "radial-gradient(ellipse 68% 58% at 50% 48%, transparent 28%, #000 88%)",
              maskImage:
                "radial-gradient(ellipse 68% 58% at 50% 48%, transparent 28%, #000 88%)",
              opacity: 0.90,
            }}
          />
          <div
            className="absolute inset-1"
            style={{
              background:
                "linear-gradient(180deg, oklch( 0.035 0.006 260 / 0.88) 0%, oklch(0.03 0.005 260 / 0.92) 50%, oklch(0.032 0.005 260 / 0.90) 100%)",
            }}
          />
          <div
            className="absolute inset-1 mix-blend-screen"
            style={{
              background:
                "radial-gradient(55% 42% at 78% 22%, oklch(0.60 0.09 55 / 0.055), transparent 65%)",
            }}
          />
        </div>

        {/* Content — generous vertical breathing room */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8 py-32 md:py-48 lg:py-56">
          {/* Eyebrow — archival marker */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/45 mb-16 md:mb-20"
          >
            06 · Legacy
          </motion.p>

          {/* Primary statement — oversized, calm, architectural */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 1.15, ease: [0.19, 1, 0.22, 1] }}
            className="font-display text-[32px] md:text-[52px] lg:text-[64px] leading-[1.08] tracking-[-0.035em] text-foreground/92 max-w-[16ch]"
          >
            Recognition was never the objective.
          </motion.h2>

          {/* Divider — hairline, slow reveal */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 1.4, delay: 1.38, ease: [0.19, 1, 0.22, 1] }}
            className="mt-14 md:mt-16 h-px w-20 md:w-24 bg-foreground/18 origin-center"
          />

          {/* Secondary statements — quiet, reflective */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, delay: 1.55, ease: [0.19, 1, 0.22, 1] }}
            className="mt-14 md:mt-16 flex flex-col items-center gap-5 md:gap-6"
          >
            <p className="font-display text-[17px] md:text-[22px] leading-[1.35] tracking-[-0.018em] text-foreground/55 max-w-[28ch]">
              The archive documents the journey.
            </p>
            <p className="font-display text-[17px] md:text-[22px] leading-[1.35] tracking-[-0.018em] text-foreground/55 max-w-[28ch]">
              Infrastructure remains.
            </p>
            <p className="font-display text-[17px] md:text-[22px] leading-[1.35] tracking-[-0.018em] text-foreground/55 max-w-[28ch]">
              The work continues beyond the record.
            </p>
          </motion.div>

          {/* Final decompression — signature line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.6, delay: 1.9, ease: [0.19, 1, 0.22, 1] }}
            className="mt-20 md:mt-24 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/30"
          >
            Sushanth Paatnaik · Monoatom Labs
          </motion.p>

          {/* Refined CTA — matte black luxury */}
          <motion.div
            initial={{ opacity: 1, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.0, delay: 1.12, ease: [0.19, 1, 0.22, 1] }}
            className="mt-20 md:mt-28 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <Link
              to="/ventures"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[oklch(0.07_0.005_245)] border border-foreground/[0.10] rounded-sm transition-all duration-700 hover:border-foreground/25 hover:bg-[oklch(0.09_0.005_245)]"
            >
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  background:
                    "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--foreground) 3%, transparent) 0%, transparent 55%)",
                }}
              />
              <span className="relative font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/75 group-hover:text-foreground/90 transition-colors duration-700">
                Explore the Work
              </span>
              <span className="relative font-mono text-[10px] text-foreground/40 group-hover:text-foreground/60 transition-colors duration-700">→</span>
            </Link>

            <Link
              to="/engage"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 border border-transparent rounded-sm transition-all duration-700 hover:border-foreground/[0.08] hover:bg-[oklch(0.06_0.004_245)]/60"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/50 group-hover:text-foreground/75 transition-colors duration-700">
                Begin a Conversation
              </span>
              <span className="font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-700">→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </CinematicPageShell>
  );
}

