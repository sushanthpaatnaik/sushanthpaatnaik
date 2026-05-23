import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
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

      <EditorialList items={milestones} />

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



      <EditorialSection number="12 · Ledger" heading="Achievement milestones · 27 of record.">
        <p>
          The complete register, in chronological order — the public-record
          ledger that the photographic archive above sits on top of.
        </p>
        <ul className="not-prose mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {ledger.map((line) => (
            <li
              key={line}
              className="flex gap-3 border-t border-foreground/[0.06] pt-3 text-[13px] leading-relaxed text-foreground/70"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary/70 mt-1">
                ◦
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </EditorialSection>

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
