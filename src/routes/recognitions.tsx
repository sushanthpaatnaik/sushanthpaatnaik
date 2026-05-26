import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";

import ArchiveMosaic, {
  HallOfFameRibbon,

  StatsAuthorityBlock,
  ArchivePlateSeries,
  PresidentialTriptych,
  type ArchiveItem,
} from "@/components/scene/ArchiveMosaic";
import backdrop from "@/assets/scene-recognition-archive.webp";
import closureBackdrop from "@/assets/scene-legacy-closure.webp";
import futureBackdrop from "@/assets/scene-future-signal.webp";

import awardKalam from "@/assets/hof/award-kalam.webp";
import awardPranab from "@/assets/hof/award-pranab-mukherjee.webp";
import awardPatil from "@/assets/hof/award-pratibha-patil.webp";
import awardPranabDemo from "@/assets/hof/award-pranab-ceremony.png";
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
import keynoteStage from "@/assets/hof/keynote-stage.webp";
import keynoteMkm from "@/assets/hof/keynote-mkm-foundation.webp";
import keynoteGmrFel from "@/assets/hof/keynote-gmr-innovex-felicitation.webp";


import fellowCert from "@/assets/hof/fellowship-certificate.webp";
import honorIntelIris from "@/assets/honor-intel-iris.png";
import honorPresidentialTrio from "@/assets/honor-presidential-trio.png";
import honorMitFab from "@/assets/honor-mit-fab.png";
import honorMitTr35 from "@/assets/honor-mit-tr35.png";

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
import honorBricsDiplomat from "@/assets/hof/honor-brics-diplomat.webp";
import honorRepublic from "@/assets/hof/honor-republic-day-event.webp";
import honorGlobal from "@/assets/hof/honor-global-flags.webp";
import honorBada from "@/assets/hof/honor-bada-business.webp";
import honorBeyond from "@/assets/hof/honor-beyond-retreat-trophy.webp";
import honorUk from "@/assets/hof/honor-uk-envoy-trophy.webp";
import honorMonoatomTrophies from "@/assets/hof/honor-monoatom-labs-trophies.webp";


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
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/recognitions" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/recognitions" }],
  }),
});

type RecognitionCategory =
  | "Presidential"
  | "Global"
  | "Innovation"
  | "Research"
  | "Industry"
  | "Diplomacy"
  | "Institutional";

type Milestone = {
  year: string;
  sortYear: number;
  title: string;
  body: string;
  image: string;
  imageFocus?: string;
  imageFit?: "cover" | "contain";
  institution: string;
  category: RecognitionCategory;
  major?: boolean;
};

const milestones: Milestone[] = [
  {
    year: "2008–2013",
    sortYear: 2008,
    title: "Six-Time Indian Presidential Awardee",
    body: "Recognized by three Presidents of India across six national innovation honours — Dr. A.P.J. Abdul Kalam (2009), Smt. Pratibha Patil (2010) and Shri Pranab Mukherjee (2013) — for sustained contribution to indigenous deep-tech and assistive innovation.",
    image: honorPresidentialTrio,
    imageFocus: "center center",
    institution: "President of India · National Innovation Foundation",
    category: "Presidential",
    major: true,
  },
  {
    year: "2010",
    sortYear: 2010,
    title: "MIT TR-35 Awardee",
    body: "Recognized by MIT Technology Review among the world's leading young innovators under 35 — for early work on sustainable materials and assistive technology.",
    image: honorMitTr35,
    imageFocus: "center 25%",
    institution: "MIT Technology Review · Cambridge",
    category: "Global",
  },
  {
    year: "2010",
    sortYear: 2010.5,
    title: "Intel IRIS National Recognition",
    body: "Intel IRIS National Science Fair · Best Popular Invention for the breath-operated wheelchair — the school-bench prototype that opened a fifteen-year practice in deep-tech.",
    image: honorIntelIris,
    institution: "Intel Foundation · National Science Fair",
    category: "Innovation",
  },
  {
    year: "2011",
    sortYear: 2011,
    title: "NASA recognition",
    body: "International recognition at NASA Kennedy Space Center — including a research visit to the Mobile Quarantine Facility at the U.S. Space & Rocket Center, Huntsville — for breakthrough engineering in human–machine interfaces.",
    image: honorNasa,
    institution: "NASA · Kennedy Space Center",
    category: "Research",
    major: true,
  },
  {
    year: "2012",
    sortYear: 2012,
    title: "TED-India Speaker",
    body: "Invited to TED-India as one of the youngest speakers ever featured — on sustainable graphene and the long arc from empathy to engineering.",
    image: keynoteTed,
    institution: "TED · Bangalore",
    category: "Global",
    major: true,
  },
  {
    year: "2013–14",
    sortYear: 2013,
    title: "MIT Fab-10 & Fab-11 Awardee",
    body: "Selected at MIT Fab-10 (Barcelona) and Fab-11 for fabrication-led prototype systems and experimental engineering — built end-to-end inside MIT's Center for Bits and Atoms personal fabrication network.",
    image: honorMitFab,
    imageFocus: "center 35%",
    institution: "MIT · Center for Bits and Atoms",
    category: "Institutional",
  },
];

// Archival authority strip — the small register of numbers shown directly
// under the section index. Read as a museum plaque, not a marketing stat.
const authoritySignals: Array<{ value: string; label: string }> = [
  { value: "27", label: "Honors of Record" },
  { value: "42", label: "Hall of Fame Moments" },
  { value: "06", label: "Presidential Recognitions" },
  { value: "03", label: "Presidents of India" },
  { value: "∞", label: "Global Innovation Citations" },
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
      { title: "Former President of India Award", institution: "Dr. A.P.J. Abdul Kalam · NIF", featured: true },
      { title: "35th Jawaharlal Nehru National Science Exhibition Award", institution: "NCERT · Govt of India" },
      { title: "CBSE National Science Exhibition Award", institution: "Central Board of Secondary Education" },
      { title: "Institute of Physics Exhibition Award", institution: "IOP" },
    ],
  },
  {
    year: "2009",
    entries: [
      { title: "President of India Award", institution: "Smt. Pratibha Devisingh Patil · NIF", featured: true },
      { title: "Former President of India Award", institution: "Dr. A.P.J. Abdul Kalam · NIF", featured: true },
      { title: "KVPY Fellow", institution: "Department of Science & Technology, Govt of India" },
      { title: "NCSC Award", institution: "National Children's Science Congress" },
    ],
  },
  {
    year: "2010",
    entries: [
      { title: "TR-35 Award", institution: "MIT Technology Review", featured: true },
      { title: "INK Fellow", institution: "INK Talks · TED Partner" },
      { title: "Intel IRIS · Best Popular Invention Award", institution: "Intel Foundation · National Science Fair", featured: true },
    ],
  },
  {
    year: "2011",
    entries: [
      { title: "NASA Award", institution: "Kennedy Space Center · Huntsville", featured: true },
      { title: "DLF–Pramerica Spirit of Community Award", institution: "Prudential · DLF Foundation" },
      { title: "Eureka-11 · IIT-Bombay Business Plan Contest Award", institution: "E-Cell · IIT Bombay" },
    ],
  },
  {
    year: "2012",
    entries: [
      { title: "Golden Book of World Record Holder", institution: "World Record Citation" },
      { title: "TED-India Speaker", institution: "TED · Bangalore", featured: true },
      { title: "IDEAS-12 · IIT-Kanpur Business Plan Contest Award", institution: "E-Cell · IIT Kanpur" },
      { title: "Judge · SELL-X Exodia · IIT-Mandi Business Plan Contest", institution: "IIT Mandi" },
      { title: "Innovio-12 · KIIT Business Plan Contest Award", institution: "KIIT University" },
    ],
  },
  {
    year: "2013",
    entries: [
      { title: "President of India Award", institution: "Shri Pranab Mukherjee · NIF", featured: true },
      { title: "ICAI Abu Dhabi Speaker", institution: "Institute of Chartered Accountants of India" },
    ],
  },
  {
    year: "2013–14",
    entries: [
      { title: "MIT Fab-10 & Fab-11 Awardee", institution: "MIT · Barcelona / MIT Cambridge", featured: true },
    ],
  },
  {
    year: "2014",
    entries: [
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
    year: "2024",
    entries: [
      { title: "ELECRAMA Winner", institution: "IEEMA · Greater Noida" },
      { title: "Silicon Valley Speaker", institution: "Bay Area · USA", featured: true },
    ],
  },
  {
    year: "2025",
    entries: [
      { title: "CEO Club Speaker", institution: "Hyderabad" },
    ],
  },
];

// Internal integrity check — the canonical Ledger of Honors of Record holds
// exactly 27 unique entries. Logs a warning in development if drift is detected.
const recognitionMilestones = ledgerByYear.flatMap((y) =>
  y.entries.map((e) => ({ ...e, year: y.year })),
);
if (import.meta.env.DEV) {
  if (recognitionMilestones.length !== 27) {
    console.warn(
      `[RecognitionsLedger] Expected 27 honors of record, got ${recognitionMilestones.length}.`,
    );
  }
}


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
    src: awardPranabDemo,
    caption: "Presidential Trophy · President Pranab Mukherjee",
    meta: "Presidential Award · 2013",
    category: "Award",
    focus: "38% top",
    institution: "National Innovation Foundation",
    recognition: "Presidential Recognition · 2013",
    presenter: "Presented by Shri Pranab Mukherjee",
    venue: "Rashtrapati Bhavan · New Delhi",
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
    venue: "Bangalore · India",
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

// Hall of Fame ribbon — full 42-plate archival reel migrated from the
// legacy site. Original order, captions, year labels and recognition
// context are preserved verbatim.
const hallOfFame: ArchiveItem[] = [
  { src: honorDriiv, caption: "MoU Signing · DRIIV, PSA, Govt of India", meta: "Delhi Research Implementation & Innovation · New Delhi", category: "Honor" },
  { src: honorIocl, caption: "With Shri Sujoy Choudhury", meta: "Director (P&BD) · Indian Oil Corporation", category: "Honor" },
  { src: awardKalam, caption: "With Dr. A.P.J. Abdul Kalam", meta: "PRESIDENTIAL AWARD · 2009", category: "Award" },
  { src: awardPranab, caption: "With President Pranab Mukherjee", meta: "PRESIDENTIAL AWARD · 2013", category: "Award", focus: "left top" },
  { src: honorBricsDiplomat, caption: "BRICS Global Forum", meta: "Diplomatic Engagement · New Delhi", category: "Honor" },
  { src: honorNasa, caption: "NASA Mobile Quarantine Facility", meta: "U.S. Space & Rocket Center · Huntsville, Alabama", category: "Honor" },
  { src: honorRepublic, caption: "With Mr. Amit Jain, CarDekho", meta: "Founder & CEO · CarDekho Group", category: "Honor" },
  { src: awardPatil, caption: "With President Pratibha Patil", meta: "Presidential Award · 2010", category: "Award" },
  { src: keynoteBritish, caption: "British High Commission", meta: "Address · New Delhi", category: "Keynote" },
  { src: keynoteStage, caption: "Main stage INK Talks", meta: "60+ keynotes since 2010", category: "Keynote", focus: "25% 40%" },
  { src: keynoteJosh, caption: "Josh Talks × Facebook", meta: "Empowering Youth & Entrepreneurs", category: "Keynote" },
  { src: keynoteTed, caption: "TED-India Speaker", meta: "Youngest at the time · 2012", category: "Keynote" },
  { src: honorGlobal, caption: "Global Forum Delegate", meta: "International Summit · 2023", category: "Honor", focus: "30% center" },
  { src: awardLeaDiaMirza, caption: "LEA Excellence Award with Dia Mirza", meta: "Mumbai · July 2022", category: "Award" },
  { src: keynoteTiecon, caption: "TiECON Mumbai", meta: "India Unicorn Summit · 2022", category: "Keynote" },
  { src: honorGadkari, caption: "With Shri Nitin Gadkari", meta: "Union Minister · Transport Bhawan", category: "Honor", focus: "center 22%" },
  { src: honorIeema, caption: "IEEMA Finalists", meta: "Buildelec · Intelect · Distribuelec · 2024", category: "Honor", focus: "70% center" },
  { src: awardIeemaCheque, caption: "IEEMA Award Presentation", meta: "Young Innovator Recognition · 2024", category: "Award" },
  { src: awardPranabDemo, caption: "Demonstrating to President Pranab Mukherjee", meta: "Presidential Showcase", category: "Award", focus: "center 35%" },
  { src: keynoteInk, caption: "INK Fellows Retreat", meta: "Bengaluru · 2022", category: "Keynote" },
  { src: honorFicci, caption: "FICCI Bharat Summit", meta: "Delegate · 2024", category: "Honor", focus: "center 20%" },
  { src: keynoteIeema, caption: "IEEMA Mainstage Address", meta: "Buildelec · Mumbai · Jan 2024", category: "Keynote" },
  { src: honorBeyond, caption: "Beyond Retreat Honour", meta: "Session Chair Recognition · Mar 2025", category: "Honor" },
  { src: awardBharatiya, caption: "Bharatiya Knowledge Systems Symposium", meta: "Felicitation · School of IT · 2024", category: "Award", focus: "center 60%" },
  { src: honorItalian, caption: "With H.E. Antonio Bartoli", meta: "Ambassador of Italy to India · New Delhi", category: "Honor" },
  { src: honorUk, caption: "Trophy Presentation · H.E. Antonio Bartoli", meta: "Ambassador of Italy to India · Embassy of Italy, New Delhi", category: "Honor" },
  { src: keynoteBeyond, caption: "Beyond Retreat · Uncharted Paths", meta: "Speaker · Ahmedabad · Mar 2025", category: "Keynote" },
  { src: keynoteGmr, caption: "GMR Innovex Innovation Summit", meta: "Felicitation · GMRIT", category: "Keynote" },
  { src: keynoteNit, caption: "Innovision · NIT Rourkela", meta: "Marine Matrix Keynote · Nov 2025", category: "Keynote" },
  { src: awardStpiCert, caption: "STPI Certificate of Merit, National Conclave Winner", meta: "National Conclave · 2022", category: "Award" },
  { src: keynoteMkm, caption: "Monoatom Labs Address", meta: "MKM Foundation · Mashaal", category: "Keynote" },
  { src: fellowCert, caption: "Honour Certificate", meta: "Recognition of record", category: "Fellowship" },
  { src: keynoteDriiv, caption: "Monoatom Labs · DRIIV Showcase", meta: "Graphene Innovation Pavilion", category: "Keynote", focus: "30% center" },
  { src: honorStpi, caption: "ESC–STPI Startup Initiative Winners", meta: "Building the Next Unicorn · 2022", category: "Honor" },
  { src: keynoteGmrFel, caption: "GMR Innovex · Stage Felicitation", meta: "GMRIT Innovation Summit", category: "Keynote", focus: "45% center" },
  { src: keynoteBrics, caption: "BRICS Roundtable Address", meta: "Diplomatic Forum · New Delhi · 2022", category: "Keynote", focus: "70% center" },
  { src: honorBricsMedal, caption: "BRICS Honour", meta: "International Recognition · 2022", category: "Honor", focus: "center 25%" },
  { src: honorMop, caption: "Ministry of Power · Bureau of Energy Efficiency", meta: "Government of India · New Delhi · 2023", category: "Honor", focus: "center 30%" },
  { src: honorG20, caption: "With Prince Fahad bin Mansour Al-Saud", meta: "Startup20 Shikhar · G20 · Gurugram · Jul 2023", category: "Honor", focus: "center 25%" },
  { src: honorBada, caption: "With Dr. Vivek Bindra", meta: "Bada Business HQ · 2023", category: "Honor", focus: "right 20%" },
  { src: honorMauritius, caption: "With H.E. Mrs. Sheilabai Bappoo, G.O.S.K.", meta: "High Commissioner · Mauritius High Commission", category: "Honor", focus: "center 30%" },
  { src: honorMonoatomTrophies, caption: "Founder's Desk · Monoatom Labs", meta: "TEDx · Startup Summit · SGSAST Pattros · Trophies on Display", category: "Honor" },
];

// Internal integrity check — the migrated Hall of Fame must contain exactly
// 42 unique images. Logs a warning in development if drift is detected.
if (import.meta.env.DEV) {
  const uniqueSrcs = new Set(hallOfFame.map((i) => i.src));
  if (hallOfFame.length !== 42 || uniqueSrcs.size !== 42) {
    console.warn(
      `[HallOfFame] Expected 42 unique plates, got ${hallOfFame.length} entries / ${uniqueSrcs.size} unique.`,
    );
  }
}


// Documentary Mosaic — dense cinematic collage drawn from the full archive,
// intermixing newspaper plates, ministerial moments, presidential citations,
// fellowship certificates and mainstage photography. Restores archival
// realism and historical scale without expanding the chronological registry.
const documentaryMosaic: ArchiveItem[] = [
  { src: awardKalam, caption: "With Dr. A.P.J. Abdul Kalam", meta: "Presidential Award · 2008", category: "Award", shape: "hero", focus: "center 28%" },
  { src: keynoteTed, caption: "TED-India Mainstage", meta: "Bangalore · 2012", category: "Keynote" },
  { src: honorNasa, caption: "NASA · Kennedy Space Center", meta: "Huntsville · 2011", category: "Honor", shape: "wide" },
  { src: fellowCert, caption: "Honour Certificate", meta: "Archival Citation", category: "Fellowship" },
  { src: awardPatil, caption: "With President Pratibha Patil", meta: "Rashtrapati Bhavan · 2009", category: "Award", shape: "tall" },
  { src: awardPranab, caption: "With President Pranab Mukherjee", meta: "Rashtrapati Bhavan · 2013", category: "Award", shape: "wide", focus: "left top" },
  { src: honorG20, caption: "Startup20 · G20 India Presidency", meta: "Gurugram · 2023", category: "Honor", focus: "center 25%" },
  { src: keynoteSV, caption: "Silicon Valley Address", meta: "Bay Area · 2024", category: "Keynote", shape: "wide" },
  { src: keynoteBrics, caption: "BRICS Diplomatic Roundtable", meta: "New Delhi · 2022", category: "Keynote", focus: "70% center" },
  { src: awardPranabDemo, caption: "Presidential Demonstration", meta: "New Delhi · 2013", category: "Award", focus: "center 35%" },
  { src: honorItalian, caption: "Italian Embassy", meta: "H.E. Antonio Bartoli", category: "Honor" },
  { src: keynoteIeema, caption: "IEEMA Buildelec Mainstage", meta: "Mumbai · 2024", category: "Keynote", shape: "wide" },
  { src: awardLeaDiaMirza, caption: "LEA Excellence Award", meta: "with Dia Mirza · 2022", category: "Award" },
  { src: honorGadkari, caption: "With Shri Nitin Gadkari", meta: "Transport Bhawan · 2023", category: "Honor", focus: "center 22%" },
  { src: keynoteBritish, caption: "British High Commission", meta: "New Delhi", category: "Keynote" },
  { src: honorDriiv, caption: "DRIIV MoU Signing", meta: "PSA · Govt of India", category: "Honor", shape: "wide" },
];


function EraAccordion({
  number,
  era,
  title,
  description,
  defaultOpen = false,
  forceOpen,
  plateCount,
  registryCount,
  previewPlates,
  anchorId,
  children,
}: {
  number: string;
  era: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  plateCount: number;
  registryCount: number;
  previewPlates?: ArchiveItem[];
  anchorId?: string;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = forceOpen ?? internalOpen;
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setInternalOpen}
      id={anchorId}
      className="not-prose group/era relative border-t border-foreground/[0.08] scroll-mt-28"
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

        {/* Always-visible archival preview strip — restores documentary depth without forcing scroll */}
        {previewPlates && previewPlates.length > 0 && !open && (
          <div className="mt-8 md:mt-10 pl-0 md:pl-[calc(theme(spacing.12)+1.5rem)]">
            <div className="grid grid-cols-4 gap-px bg-foreground/[0.05] ring-1 ring-foreground/[0.05] rounded-sm overflow-hidden">
              {previewPlates.slice(0, 4).map((p, i) => (
                <figure
                  key={p.src + i}
                  className="relative aspect-[4/3] overflow-hidden bg-[oklch(0.05_0.006_245)]"
                >
                  <img
                    src={p.src}
                    alt={p.caption}
                    loading="eager"
                    className="archival-image-soft archival-image-hover absolute inset-0 h-full w-full object-cover opacity-90 group-hover/era:opacity-100"
                    style={{ objectPosition: p.focus ?? "center 30%" }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 45%, oklch(0.02 0.006 245 / 0.82) 100%)",
                    }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 px-2.5 py-2 font-mono text-[8.5px] uppercase tracking-[0.28em] text-foreground/55 line-clamp-1">
                    {p.category}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
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
          <motion.li
            key={group.year}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.0, delay: Math.min(gi * 0.05, 0.3), ease: [0.19, 1, 0.22, 1] }}
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
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

// Helper: slice ledger by year membership
function ledgerSlice(years: string[]): LedgerYear[] {
  return ledgerByYear.filter((g) => years.includes(g.year));
}

const sectionNav = [
  { id: "overview", label: "Overview" },
  { id: "hall-of-fame", label: "Hall of Fame" },
  { id: "presidential", label: "Presidential" },
  { id: "global", label: "Global Stages" },
  { id: "industrial", label: "Industrial & Diplomatic" },
  { id: "present", label: "Present Field" },
  { id: "ledger", label: "Achievement Ledger" },
];

function RecognitionsPage() {
  const [expandAll, setExpandAll] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Scroll-spy — observe each section anchor and surface the currently
  // dominant id so the sticky archival nav can highlight the active register.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = sectionNav.map((s) => s.id);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <CinematicPageShell
      eyebrow="Recognitions · Twenty-Seven Honors of Record"
      title={
        <>
          An archival journey<br className="hidden md:inline" /> of recognition.
        </>
      }
      lead="From a school-bench prototype to Rashtrapati Bhavan and Silicon Valley — a photographic record of two decades on stage, in the lab, and in conversation with institutions."
      backdrop={backdrop}
      overlay={0.74}
      contentPb="pb-0"
    >
      {/* In-page section index — sticky archival navigation */}
      <nav
        id="overview"
        aria-label="Recognitions sections"
        className="not-prose sticky top-2 z-30 -mx-4 md:mx-0 mt-2 mb-10 backdrop-blur-xl bg-[oklch(0.04_0.003_245)]/75 border-y border-foreground/[0.08] scroll-mt-2"
      >
        <ul className="flex gap-x-7 md:gap-x-9 overflow-x-auto px-5 py-3.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {sectionNav.map((s) => {
            const isActive = activeSection === s.id;
            return (
              <li key={s.id} className="flex-shrink-0">
                <a
                  href={`#${s.id}`}
                  className={`relative font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-500 ${
                    isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground/95"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {s.label}
                  <span
                    aria-hidden
                    className={`absolute left-0 right-0 -bottom-2 h-px origin-left transition-transform duration-700 ease-out ${
                      isActive ? "scale-x-100 bg-foreground/60" : "scale-x-0 bg-foreground/0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Archival intelligence layer — quiet authority signals with cinematic ambient backdrop */}
      <motion.aside
        aria-label="Archival authority signals"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="not-prose relative mb-16 md:mb-20 border-y border-foreground/[0.07] py-7 md:py-9 archival-sheen"
      >
        {/* Soft amber archival glow behind the numbers */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 120% at 50% 50%, oklch(0.62 0.07 65 / 0.06) 0%, transparent 60%)",
            }}
          />
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6">
          {authoritySignals.map((s, idx) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, delay: 0.1 + idx * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col items-start md:items-center text-left md:text-center"
            >
              <span className="font-display text-[26px] md:text-[36px] leading-none tracking-[-0.04em] text-foreground/92">
                {s.value}
              </span>
              <span className="mt-2.5 font-mono text-[9.5px] uppercase tracking-[0.36em] text-muted-foreground/60">
                {s.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.aside>

      {/* 01 · Hall of Fame — brought up front for immediate visual archive */}
      <div id="hall-of-fame" className="scroll-mt-24">
        <EditorialSection number="01 · Overture" heading="Moments of recognition.">
          <p>
            A continuous cinematic strip — mainstage keynotes, presidential
            demonstrations, diplomatic honours and institutional citations —
            offered up front so the visual depth of the record is felt
            before the chronology begins.
          </p>
        </EditorialSection>
        {/* Ambient lighting backdrop — soft cinematic glow behind the reel */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-2%] -inset-y-10 -z-10 overflow-hidden"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.55 0.05 232 / 0.10) 0%, oklch(0.40 0.04 232 / 0.05) 35%, transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(ellipse 30% 40% at 15% 50%, oklch(0.55 0.04 232 / 0.05), transparent 60%)," +
                  "radial-gradient(ellipse 30% 40% at 85% 50%, oklch(0.55 0.04 232 / 0.05), transparent 60%)",
              }}
            />
          </div>
          <HallOfFameRibbon items={hallOfFame} eyebrow="Hall of Fame · Continuous Reel" />
        </div>
      </div>

      {/* 02 · Featured Recognition — cinematic highlight tier */}
      <EditorialSection
        number="02 · Featured"
        heading="Six recognitions that define the archive."
      >
        <p>
          The gravitational anchors of the register — the citations that the
          rest of the chronology orbits. Read each as an institutional plate
          rather than a line item.
        </p>
      </EditorialSection>

      {/* Cinematic institutional timeline tree */}
      <div className="not-prose relative mt-16 md:mt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, oklch(var(--foreground) / 0.12) 8%, oklch(var(--foreground) / 0.18) 50%, oklch(var(--foreground) / 0.12) 92%, transparent 100%)",
          }}
        />

        <div
          aria-hidden
          className="absolute left-6 md:left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-foreground/40 ring-4 ring-[oklch(0.045_0.003_245)]"
        />

        <ol className="flex flex-col">
          {milestones
            .slice()
            .sort((a, b) => a.sortYear - b.sortYear)
            .map((m, i) => {
              const onLeft = i % 2 === 0;
              return (
                <li
                  key={m.title}
                  className="relative grid grid-cols-[48px_1fr] md:grid-cols-1 gap-x-8 md:gap-x-0 py-14 md:py-24"
                >
                  <div className="md:absolute md:left-1/2 md:top-20 md:-translate-x-1/2 md:flex md:flex-col md:items-center md:gap-3 z-10">
                    <span
                      aria-hidden
                      className="hidden md:block h-3 w-3 rounded-full bg-foreground/55 ring-[6px] ring-[oklch(0.045_0.003_245)] shadow-[0_0_0_1px_oklch(var(--foreground)/0.18)]"
                    />
                    <span className="md:hidden absolute left-6 top-16 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-foreground/55 ring-4 ring-[oklch(0.045_0.003_245)]" />
                    <div className="md:mt-1 md:px-3 md:py-[3px] md:bg-[oklch(0.045_0.003_245)] md:border md:border-foreground/10">
                      <span className="font-mono text-[10px] md:text-[10.5px] uppercase tracking-[0.32em] text-foreground/60">
                        {m.year}
                      </span>
                    </div>
                  </div>

                  <motion.article
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                    className={`group relative col-start-2 md:col-start-1 md:grid md:grid-cols-12 md:gap-12 lg:gap-20 md:items-center ${
                      onLeft ? "" : "md:[&>figure]:order-2"
                    }`}
                  >
                    <figure
                      className={`relative overflow-hidden rounded-[2px] bg-[oklch(0.045_0.006_245)] md:col-span-7 aspect-[5/4] transition-shadow duration-1000 ${
                        m.title.includes("Presidential")
                          ? "ring-1 ring-foreground/10 shadow-[0_30px_70px_-30px_oklch(0_0_0/0.7),inset_0_1px_0_oklch(1_0_0/0.025)] group-hover:shadow-[0_42px_90px_-32px_oklch(0_0_0/0.78),inset_0_1px_0_oklch(1_0_0/0.03)]"
                          : "ring-1 ring-foreground/8 shadow-[0_24px_60px_-30px_oklch(0_0_0/0.55),inset_0_1px_0_oklch(1_0_0/0.02)] group-hover:shadow-[0_34px_78px_-32px_oklch(0_0_0/0.62)]"
                      }`}
                    >
                      <img
                        src={m.image}
                        alt={m.title}
                        loading={i < 2 ? "eager" : "lazy"}
                        className={`archival-image archival-image-hover absolute inset-0 h-full w-full opacity-90 ease-out group-hover:scale-[1.015] group-hover:opacity-95 ${
                          m.imageFit === "contain" ? "object-contain p-6 md:p-8" : "object-cover"
                        }`}
                        style={{ objectPosition: m.imageFocus ?? "center 30%" }}
                      />
                      {/* Matte vignette — deeper edges, softer center */}
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            m.imageFit === "contain"
                              ? "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, oklch(0.018 0.006 245 / 0.45) 100%)"
                              : "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 50%, oklch(0.018 0.006 245 / 0.55) 100%)",
                        }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, oklch(0.025 0.006 245 / 0.12) 0%, transparent 40%, transparent 70%, oklch(0.016 0.006 245 / 0.55) 100%)",
                        }}
                      />
                    </figure>

                    <div
                      className={`relative pt-8 md:pt-0 md:col-span-5 ${
                        onLeft ? "md:pl-2" : "md:pr-2"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-6">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/55">
                          Milestone {String(i + 1).padStart(2, "0")}
                        </span>
                        {/* Category chip — archival classification */}
                        <span className="inline-flex items-center gap-1.5 border border-foreground/15 bg-[oklch(0.06_0.004_245)]/50 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/70">
                          <span
                            aria-hidden
                            className="h-[3px] w-[3px] rounded-full bg-accent/80"
                          />
                          {m.category}
                        </span>
                        {m.major && (
                          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-foreground/45">
                            · Anchor
                          </span>
                        )}
                      </div>

                      <span className="block font-mono text-[9px] uppercase tracking-[0.32em] text-accent/70 mb-3">
                        {m.institution}
                      </span>
                      <h3
                        className={`font-display leading-[1.15] tracking-[-0.025em] text-foreground/95 max-w-[18ch] ${
                          m.major
                            ? "text-[24px] md:text-[30px] lg:text-[36px]"
                            : "text-[20px] md:text-[24px]"
                        }`}
                      >
                        {m.title}
                      </h3>
                      <p className="mt-6 text-[14px] md:text-[14.5px] leading-[1.8] text-foreground/65 max-w-[46ch]">
                        {m.body}
                      </p>
                      <div
                        aria-hidden
                        className="mt-10 h-px w-12 bg-foreground/20 group-hover:w-24 transition-all duration-700"
                      />
                    </div>
                  </motion.article>
                </li>
              );
            })}
        </ol>

        <div
          aria-hidden
          className="absolute left-6 md:left-1/2 bottom-0 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="h-2 w-2 rounded-full bg-foreground/30 ring-4 ring-[oklch(0.045_0.003_245)]" />
          <span className="hidden md:block font-mono text-[9px] uppercase tracking-[0.42em] text-muted-foreground/40 mt-1">
            The chronology continues
          </span>
        </div>
      </div>

      {/* 03 · Authority block */}
      <StatsAuthorityBlock items={counters} eyebrow="Archive · Register of Record" />

      {/* 04 · Presidential triptych — centerpiece */}
      <div id="presidential" className="scroll-mt-24">
        <EditorialSection number="04 · Centerpiece" heading="Three Presidents of India. Six citations.">
          <p>
            The defining plate of the archive — felicitated by three sitting
            Presidents of India across six separate citations between 2008 and
            2013. The gravitational centre around which the rest of the
            recognitions orbit.
          </p>
        </EditorialSection>
        <PresidentialTriptych
          items={[eraPresidential[0], eraPresidential[1], eraPresidential[2]]}
        />
      </div>

      {/* 05 · Documentary mosaic */}
      <EditorialSection
        number="05 · Documentary"
        heading="A cinematic mosaic of the record."
      >
        <p>
          Newspaper plates, ministerial moments, presidential citations, and
          mainstage photography — drawn from the full archive and intercut as
          a single documentary collage.
        </p>
      </EditorialSection>
      <ArchiveMosaic items={documentaryMosaic} />

      {/* 06 · Era archives — progressive disclosure with expand-all */}
      <EditorialSection number="06 · Archives" heading="Open the era you want to walk through.">
        <p>
          Four eras, four archives. Each opens into the full photographic
          plates for that period. A preview strip remains visible for every
          era so the depth of the record is always felt — or expand the full
          archive at once.
        </p>
      </EditorialSection>

      <div className="not-prose mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
          {expandAll ? "Full archive · all eras open" : "Tap an era to walk through · or expand all"}
        </p>
        <button
          type="button"
          onClick={() => setExpandAll((v) => !v)}
          className="group inline-flex items-center gap-3 border border-foreground/15 hover:border-foreground/45 px-5 py-2.5 rounded-sm transition-all duration-500 hover:bg-[oklch(0.06_0.004_245)]/70"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/70 group-hover:text-foreground transition-colors duration-500">
            {expandAll ? "Collapse full archive" : "Expand full archive"}
          </span>
          <span className="font-mono text-[10px] text-foreground/35 group-hover:text-foreground/65 transition-colors duration-500">
            {expandAll ? "−" : "+"}
          </span>
        </button>
      </div>

      <div className="not-prose mt-6 border-b border-foreground/[0.08]">

        <EraAccordion
          number="II"
          era="2010 – 2014"
          title="Global stages."
          description="TED-India, NASA Kennedy Space Center, INK, MIT Technology Review, MIT Fab-10 & Fab-11. The first decade abroad — speaking, fellowshipping, and bringing the work into conversation with the world."
          plateCount={eraGlobal.length}
          registryCount={ledgerSlice(["2010", "2011", "2012", "2013–14"]).reduce((a, g) => a + g.entries.length, 0)}
          previewPlates={eraGlobal}
          anchorId="global"
          forceOpen={expandAll ? true : undefined}
        >
          <ArchivePlateSeries
            items={eraGlobal}
            eyebrow="Archive II · Global Stages"
            startIndex={eraPresidential.length + 1}
          />
        </EraAccordion>

        <EraAccordion
          number="III"
          era="2020 – 2023"
          title="Industrial leadership & diplomacy."
          description="The diplomatic and ministerial years — embassies, BRICS, G20, the Ministry of Power, and the signing of MoUs that turn frontier research into national infrastructure."
          plateCount={eraIndustrial.length}
          registryCount={ledgerSlice(["2021", "2022", "2023"]).reduce((a, g) => a + g.entries.length, 0)}
          previewPlates={eraIndustrial}
          anchorId="industrial"
          forceOpen={expandAll ? true : undefined}
        >
          <ArchivePlateSeries
            items={eraIndustrial}
            eyebrow="Archive III · Industrial & Diplomatic"
            startIndex={eraPresidential.length + eraGlobal.length + 1}
          />
        </EraAccordion>

        <EraAccordion
          number="IV"
          era="2024 – 2025"
          title="The present field."
          description="IEEMA mainstage, Silicon Valley, GMR Innovex, NIT Rourkela, Beyond Retreat, Bharatiya Knowledge Systems. The current chapter — where materials, ventures and public address converge."
          plateCount={eraPresent.length}
          registryCount={ledgerSlice(["2024", "2025"]).reduce((a, g) => a + g.entries.length, 0)}
          previewPlates={eraPresent}
          anchorId="present"
          forceOpen={expandAll ? true : undefined}
        >
          <ArchivePlateSeries
            items={eraPresent}
            eyebrow="Archive IV · The Present Field"
            startIndex={eraPresidential.length + eraGlobal.length + eraIndustrial.length + 1}
          />
        </EraAccordion>
      </div>

      {/* 07 · Achievement Ledger — full 27 honors, always visible */}
      <div id="ledger" className="scroll-mt-24 mt-20 md:mt-28">
        <EditorialSection number="07 · Register" heading="Achievement ledger · 27 of record.">
          <p>
            The complete year-by-year register — every Presidential citation,
            fellowship, award, keynote and felicitation on file from 2008 to
            2025. Featured entries are marked with a diamond; the full
            chronology is always open here.
          </p>
        </EditorialSection>
        <LedgerYearGroup groups={ledgerByYear} />
      </div>

      {/* 06 · Legacy Closure — cinematic institutional farewell */}
      <section className="not-prose relative mt-20 md:mt-28 overflow-hidden">
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
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8 py-24 md:py-32 lg:py-40">
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

      {/* 07 · Future Signal — cinematic decompression into forward momentum */}
      <section className="not-prose relative mt-2 overflow-hidden">
        {/* Atmospheric planetary backdrop */}
        <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-1"
            style={{
              backgroundImage: `url(${futureBackdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center 62%",
              filter: "blur(6px) saturate(0.22) brightness(0.28) contrast(1.05)",
              transform: "scale(1.14)",
            }}
          />
          <div
            className="absolute inset-1"
            style={{
              backgroundImage: `url(${futureBackdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center 62%",
              filter: "blur(40px) saturate(0.18) brightness(0.22)",
              transform: "scale(1.26)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 62% at 50% 52%, transparent 32%, #000 90%)",
              maskImage:
                "radial-gradient(ellipse 72% 62% at 50% 52%, transparent 32%, #000 90%)",
              opacity: 0.85,
            }}
          />
          {/* Deep matte overlay — heavier than closure for more silence */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.032 0.005 260 / 0.94) 0%, oklch(0.028 0.004 260 / 0.96) 45%, oklch(0.030 0.005 260 / 0.94) 100%)",
            }}
          />
          {/* Faint infrastructure glow — industrial geometry */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(60% 48% at 50% 68%, oklch(0.55 0.07 250 / 0.04), transparent 70%)",
            }}
          />
          {/* Bottom edge fade to pure black */}
          <div
            className="absolute inset-x-5 bottom-0 h-32"
            style={{
              background:
                "linear-gradient(to top, oklch(0.025 0.003 260 / 0.95), transparent)",
            }}
          />
        </div>

        {/* Content — asymmetric breathing: generous top, compact bottom */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8 pt-20 md:pt-28 pb-6 md:pb-8">
          {/* Eyebrow — forward signal */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="font-mono text-[9px] uppercase tracking-[0.55em] text-muted-foreground/30 mb-10 md:mb-12"
          >
            07 · Future Signal
          </motion.p>

          {/* Primary statement — monumental, whispered */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="font-display text-[36px] md:text-[56px] lg:text-[72px] leading-[1.06] tracking-[-0.04em] text-foreground/[0.82] max-w-[14ch]"
          >
            The archive closes here.
            <br />
            The work does not.
          </motion.h2>

          {/* Hairline divider — slower, more patient */}
          <motion.div
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.6, delay: 0.65, ease: [0.19, 1, 0.22, 1] }}
            className="mt-16 md:mt-20 h-px w-28 md:w-32 bg-foreground/10 origin-center"
            style={{ scaleX: 0 }}
          />

          {/* Secondary quiet signal */}
          <motion.p
            initial={{ opacity: 1, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.2, delay: 0.55, ease: [0.19, 1, 0.22, 1] }}
            className="mt-16 md:mt-20 font-display text-[15px] md:text-[19px] leading-[1.45] tracking-[-0.012em] text-foreground/40 max-w-[26ch]"
          >
            The next systems are already under construction.
          </motion.p>

          {/* Single refined CTA — absolute minimalism */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.0, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="mt-12 md:mt-16"
          >
            <Link
              to="/engage"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 md:px-12 md:py-6 bg-[oklch(0.065_0.004_245)]/50 border border-foreground/[0.08] rounded-sm transition-all duration-700 hover:border-foreground/20 hover:bg-[oklch(0.08_0.005_245)]/60"
            >
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  background:
                    "radial-gradient(130% 110% at 50% 0%, color-mix(in oklab, var(--foreground) 2.5%, transparent) 0%, transparent 55%)",
                }}
              />
              <span className="relative font-mono text-[11px] uppercase tracking-[0.38em] text-foreground/60 group-hover:text-foreground/80 transition-colors duration-700">
                Begin a Conversation
              </span>
              <span className="relative font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-700">→</span>
            </Link>
          </motion.div>

          {/* Terminal signature — the quietest possible close */}
          <motion.p
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 2.0, delay: 1.4, ease: [0.19, 1, 0.22, 1] }}
            className="mt-7 md:mt-8 font-mono text-[9px] uppercase tracking-[0.5em] text-muted-foreground/20"
          >
            Monoatom Labs · 2025
          </motion.p>
        </div>
      </section>
    </CinematicPageShell>
  );
}

