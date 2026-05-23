import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-early-workshop.jpg";
import workshopPlate from "@/assets/scene-early-workshop.jpg";
import notebookPlate from "@/assets/scene-about-notebook.jpg";
import newsPlate from "@/assets/scene-news-archive.jpg";

import enabler from "@/assets/early/enabler.webp";
import rectofit from "@/assets/early/rectofit.webp";
import shewatch from "@/assets/early/shewatch.webp";
import solka from "@/assets/early/solka.webp";
import supersense from "@/assets/early/supersense.webp";
import powergen from "@/assets/early/powergen.webp";

export const Route = createFileRoute("/early-works")({
  component: EarlyWorksPage,
  head: () => ({
    meta: [
      { title: "Early Works — Six Presidential-Awarded Origin Inventions" },
      {
        name: "description",
        content:
          "Between 2008 and 2013, still in his teens, Sushanth designed six original devices — each tackling a real human problem. An archival record of the teenage inventions that earned six Presidential Awards.",
      },
      { property: "og:title", content: "Early Works — Origin Archive" },
      {
        property: "og:description",
        content:
          "Enabler · Rectofit · She Watch · Sol-Ka · Super Sense · Power Gen Kit — six origin inventions, in the inventor's own hand.",
      },
      { property: "og:url", content: "/early-works" },
    ],
    links: [{ rel: "canonical", href: "/early-works" }],
  }),
});

type Work = {
  code: string;
  category: string;
  title: string;
  tagline: string;
  body: string;
  img: string;
  year: string;
  age: string;
  problem: string;
  material: string;
  press?: string;
  video?: string;
  videoSource?: "youtube" | "vimeo";
  hero?: boolean;
};

const works: Work[] = [
  {
    code: "Specimen 01",
    category: "Off-grid Energy",
    title: "High-Eff Power Generation Kit",
    tagline: "Off-grid electricity for rural India",
    body: "A high-efficiency, low-cost power generation kit conceived to bring reliable electricity to remote rural communities — the first prototype, built in a borrowed workshop at fifteen.",
    img: powergen,
    year: "2008",
    age: "Age 15",
    problem: "Villages without grid access",
    material: "Salvaged dynamo · copper coil · hand-fabricated housing",
    press: "Press · The Hindu · Deccan Chronicle",
    video: "57665099",
    videoSource: "vimeo",
    hero: true,
  },
  {
    code: "Specimen 02",
    category: "Assistive Tech",
    title: "Enabler",
    tagline: "Breath-operated wheelchair",
    body: "A wheelchair operated entirely through breath patterns — built to empower individuals with severe paralysis to regain independent mobility.",
    img: enabler,
    year: "2010",
    age: "Age 17",
    problem: "Mobility for severe paralysis",
    material: "Pressure transducer · servo array · steel frame",
    press: "Press · Times of India",
    video: "n-JiX6vmwOI",
  },
  {
    code: "Specimen 03",
    category: "Mobility Safety",
    title: "Accident-Proof Rectofit Kit",
    tagline: "Universal vehicle safety retrofit",
    body: "A retrofittable safety kit designed to transform any existing vehicle into a safer machine — without redesign of the host platform.",
    img: rectofit,
    year: "2011",
    age: "Age 18",
    problem: "Road fatalities, legacy vehicles",
    material: "Sensor cluster · mechanical interlock · aftermarket harness",
  },
  {
    code: "Specimen 04",
    category: "Wearables",
    title: "She Watch",
    tagline: "Women's safety wearable",
    body: "A discreet, smart-watch form-factor wearable engineered to alert and locate — designed long before the category became mainstream.",
    img: shewatch,
    year: "2012",
    age: "Age 19",
    problem: "Personal safety, silent distress",
    material: "GSM module · accelerometer · low-profile enclosure",
    press: "Press · NDTV",
    video: "o8nir3oFzXg",
    hero: true,
  },
  {
    code: "Specimen 05",
    category: "Energy Harvesting",
    title: "Sol-Ka",
    tagline: "Ambient-light charging power bank",
    body: "A power bank case that harvests ambient indoor light to keep devices topped up — a quietly self-sufficient piece of everyday hardware.",
    img: solka,
    year: "2012",
    age: "Age 19",
    problem: "Always-on device dependence",
    material: "Indoor-tuned PV film · regulator · pocket housing",
    video: "LDdIsTrE_Uw",
  },
  {
    code: "Specimen 06",
    category: "Human–Computer Interaction",
    title: "Super Sense Technology",
    tagline: "Gesture-controlled computing",
    body: "A system enabling computers to be operated through hand gestures alone — exploring a more natural human–machine interface.",
    img: supersense,
    year: "2013",
    age: "Age 20",
    problem: "Touchless interfaces",
    material: "IR depth array · custom driver layer",
    video: "YuNwD71F3tA",
  },
];

/* ---------- Archival primitives ---------- */

function HairlinePlate({
  src,
  caption,
  meta,
  className = "",
}: {
  src: string;
  caption: string;
  meta: string;
  className?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className={`not-prose relative ${className}`}
    >
      <div className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.02]">
        <div className="relative aspect-[16/9]">
          <img
            src={src}
            alt={caption}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[0.45] contrast-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 50%, transparent 45%, oklch(0.02 0 0 / 0.85) 100%)",
            }}
          />
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-4 px-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-muted-foreground/60">
          {meta}
        </p>
        <p className="font-display italic text-[13px] tracking-[0.01em] text-foreground/65">
          {caption}
        </p>
      </figcaption>
    </motion.figure>
  );
}

function SpecimenCard({ w, index }: { w: Work; index: number }) {
  const isHero = w.hero;
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.15, delay: index * 0.04, ease: [0.19, 1, 0.22, 1] }}
      className={`group relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.025] ${
        isHero ? "md:col-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          isHero ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <img
          src={w.img}
          alt={`${w.title} — ${w.tagline}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-72 grayscale-[0.35] contrast-[1.04] transition-all duration-[1200ms] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.03]"
        />
        {/* Cinematic overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-60"
          style={{
            background:
              "radial-gradient(110% 80% at 50% 50%, transparent 40%, oklch(0.02 0 0 / 0.72) 100%)",
          }}
        />
        {/* Archival corner marks */}
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-foreground/30" />
        <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-foreground/30" />
        <div className="pointer-events-none absolute left-3 bottom-3 h-3 w-3 border-l border-b border-foreground/30" />
        <div className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-foreground/30" />
        {/* Plate ID */}
        <div className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.35em] text-foreground/75 mix-blend-screen">
          {w.code} · {w.year}
        </div>
        {isHero && (
          <div className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.35em] text-accent/85">
            Plate I · Hero Specimen
          </div>
        )}
      </div>

      <div className={`p-6 md:p-8 ${isHero ? "md:p-10" : ""}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-primary/75">
            {w.category}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-muted-foreground/55">
            {w.age}
          </p>
        </div>

        <h3
          className={`mt-4 font-display tracking-[-0.018em] text-foreground/95 ${
            isHero
              ? "text-3xl md:text-4xl"
              : "text-xl md:text-2xl"
          }`}
        >
          {w.title}
        </h3>
        <p className="mt-2 font-display italic text-[13px] md:text-[14px] tracking-[0.01em] text-accent/80">
          {w.tagline}
        </p>

        <p
          className={`mt-5 leading-relaxed text-foreground/70 ${
            isHero ? "text-[15px] md:text-base max-w-2xl" : "text-[14px]"
          }`}
        >
          {w.body}
        </p>

        {/* Archival field plate */}
        <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-foreground/[0.08] pt-5 text-[12px] md:grid-cols-2">
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground/55">
              Problem
            </dt>
            <dd className="mt-1 text-foreground/75">{w.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground/55">
              Material
            </dt>
            <dd className="mt-1 text-foreground/75">{w.material}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {w.press && (
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/65">
              {w.press}
            </span>
          )}
          {w.video && (
            <a
              href={
                w.videoSource === "vimeo"
                  ? `https://vimeo.com/${w.video}`
                  : `https://www.youtube.com/watch?v=${w.video}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80 hover:text-accent transition-colors"
            >
              Watch demo <span className="opacity-70">↗</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function OriginStats() {
  return (
    <StatsStrip
      className="mt-12"
      items={[
        { v: "06", l: "Presidential Awards" },
        { v: "2008–2013", l: "Origin Era" },
        { v: "15–20", l: "Age At Build" },
        { v: "06", l: "Working Devices" },
      ]}
    />
  );
}

function Timeline() {
  const beats = [
    { y: "2008", t: "Power Gen Kit", n: "Specimen 01" },
    { y: "2010", t: "Enabler", n: "Specimen 02" },
    { y: "2011", t: "Rectofit", n: "Specimen 03" },
    { y: "2012", t: "She Watch · Sol-Ka", n: "Specimen 04 · 05" },
    { y: "2013", t: "Super Sense", n: "Specimen 06" },
  ];
  return (
    <div className="not-prose mt-10">
      <div className="relative">
        <div className="absolute left-0 right-0 top-[34px] h-px bg-foreground/[0.1]" />
        <ol className="relative grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
          {beats.map((b, i) => (
            <motion.li
              key={b.y}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
              className="relative pl-1"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-primary/70">
                {b.y}
              </p>
              <span className="mt-3 block h-[7px] w-[7px] rounded-full bg-accent/80 ring-4 ring-background" />
              <p className="mt-4 font-display text-[15px] tracking-[-0.01em] text-foreground/90">
                {b.t}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground/55">
                {b.n}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function HandwrittenNote() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mt-12 overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.055_0.006_245)] p-8 md:p-12"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
        Field Note · Recovered Page
      </p>
      <blockquote className="mt-6 font-display italic text-xl md:text-2xl leading-[1.45] tracking-[-0.005em] text-foreground/90">
        “I didn't have a lab. I had a corner of the house, a soldering iron, and
        a notebook full of problems I'd seen people live with. Every device on
        this page started as a sentence in that notebook.”
      </blockquote>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.36em] text-foreground/55">
        — Sushanth Paatnaik · circa 2013
      </p>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.10 55 / 0.10), transparent 70%)",
        }}
      />
    </motion.aside>
  );
}

function EarlyWorksPage() {
  const hero = works.filter((w) => w.hero);
  const rest = works.filter((w) => !w.hero);

  return (
    <CinematicPageShell
      eyebrow="Early Works · 2008–2013 · Origin Archive"
      title={
        <>
          A boy, a workshop,<br className="hidden md:inline" /> and six devices
          that worked.
        </>
      }
      lead="Between 2008 and 2013 — still in his teens — Sushanth designed and built six original devices, each tackling a real human problem with hardware that worked. What follows is the archival record, kept in the order it was made."
      backdrop={backdrop}
      overlay={0.74}
    >
      {/* Stats authority strip */}
      <OriginStats />

      {/* Workshop atmosphere plate */}
      <div className="mt-16 md:mt-24">
        <HairlinePlate
          src={workshopPlate}
          caption="The corner of a house that became a workshop."
          meta="Plate A · Workshop · Hyderabad · c. 2010"
        />
      </div>

      {/* Childhood mythology / origin overture */}
      <EditorialSection number="01 · Origin" heading="Before there was a company, there was a notebook.">
        <p>
          The story begins with a boy who couldn't stop opening things. Radios,
          clocks, a stalled inverter on the back wall — every object in the
          house was a question with a screwdriver as the answer. By thirteen
          there were diagrams in the margins of school notebooks; by fifteen
          there was a working prototype on the kitchen table.
        </p>
        <p>
          The six specimens below were built between 2008 and 2013, in a
          borrowed workshop, with salvaged parts and pocket money. Six
          Presidential Awards followed. They are presented here as an archive —
          chronologically, plainly, with the marks of their making intact.
        </p>
      </EditorialSection>

      {/* Notebook archival plate */}
      <div className="mt-12 md:mt-16">
        <HairlinePlate
          src={notebookPlate}
          caption="Marginalia from a school notebook, c. 2008."
          meta="Plate B · Handwritten Concepts · Folio 14"
        />
      </div>

      {/* Handwritten note */}
      <HandwrittenNote />

      {/* Timeline */}
      <EditorialSection number="02 · Chronology" heading="Five years, six specimens.">
        <p>
          A documentary timeline of the origin era — each beat a device that
          left the workshop in working order.
        </p>
        <Timeline />
      </EditorialSection>

      {/* Prototype evolution — specimens */}
      <EditorialSection number="03 · Prototype Evolution" heading="The specimens, in the order they were made.">
        <p>
          Each entry is presented as an archival plate: a problem in the world,
          a material answer, a year. The hero specimens anchor their eras; the
          rest follow in chronological order.
        </p>
        <div className="not-prose mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {hero.map((w, i) => (
            <SpecimenCard key={w.title} w={w} index={i} />
          ))}
          {rest.map((w, i) => (
            <SpecimenCard key={w.title} w={w} index={i + hero.length} />
          ))}
        </div>
      </EditorialSection>

      {/* Newspaper archive plate */}
      <div className="mt-16 md:mt-24">
        <HairlinePlate
          src={newsPlate}
          caption="Press clippings recovered from the family archive."
          meta="Plate C · Newspaper Scans · 2008–2013"
        />
      </div>

      <EditorialSection number="04 · Continuity" heading="A through-line, in retrospect.">
        <p>
          Each early invention had the same shape: an unmet human need, a
          material constraint nobody else found interesting, and a weekend in
          a borrowed workshop. The companies built later are the same instinct
          — with a longer fuse.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
