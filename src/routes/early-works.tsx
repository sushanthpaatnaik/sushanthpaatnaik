import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/scene-early-workshop.webp";

import enablerImg from "@/assets/early/enabler.webp";
import powergenImg from "@/assets/early/powergen.webp";
import rectofitImg from "@/assets/early/rectofit.webp";
import shewatchImg from "@/assets/early/shewatch.webp";
import solkaImg from "@/assets/early/solka.webp";
import supersenseImg from "@/assets/early/supersense.webp";

export const Route = createFileRoute("/early-works")({
  component: EarlyWorksPage,
  head: () => ({
    meta: [
      { title: "Early Works | Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Explore the formative innovations, prototypes, recognitions, and milestones that shaped the journey of inventor and deep-tech entrepreneur Sushanth Paatnaik.",
      },
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
  }),
});

const EASE = [0.19, 1, 0.22, 1] as const;

const innovations = [
  {
    n: "01",
    year: "2008",
    category: "MOBILITY SAFETY",
    name: "Rectofit Kit",
    tagline: "Universal vehicle safety retrofit",
    description:
      "A retrofittable safety system designed to transform any existing vehicle into a safer machine — without redesigning the host platform. Field-deployable, hardware-first engineering.",
    image: rectofitImg,
  },
  {
    n: "02",
    year: "2009",
    category: "ASSISTIVE TECH",
    name: "Enabler",
    tagline: "Breath-operated wheelchair",
    description:
      "A wheelchair operated entirely through breath patterns — built to empower individuals with severe paralysis to regain independent mobility. The foundational invention that opened every door that followed.",
    image: enablerImg,
  },
  {
    n: "03",
    year: "2011",
    category: "OFF-GRID ENERGY",
    name: "Powergen",
    tagline: "Off-grid electricity for rural India",
    description:
      "A high-efficiency, low-cost power generation kit conceived to bring reliable electricity to remote rural communities.",
    image: powergenImg,
  },
  {
    n: "04",
    year: "2012",
    category: "ENERGY HARVESTING",
    name: "Sol-Ka",
    tagline: "Ambient-light charging power bank",
    description:
      "A power-bank case that harvests ambient indoor light to keep devices continuously topped up — a quietly self-sufficient piece of everyday hardware.",
    image: solkaImg,
  },
  {
    n: "05",
    year: "2013",
    category: "WEARABLES",
    name: "She Watch",
    tagline: "Women's safety wearable",
    description:
      "A discreet smart-watch form-factor wearable engineered to alert and locate — designed long before the women's safety wearable category became mainstream.",
    image: shewatchImg,
  },
  {
    n: "06",
    year: "2013",
    category: "HCI",
    name: "Super Sense",
    tagline: "Gesture-controlled computing",
    description:
      "A system enabling computers to be operated through hand gestures alone — exploring a more natural human-machine interface.",
    image: supersenseImg,
  },
] as const;

const stats = [
  { value: "6", label: "Original Devices" },
  { value: "6×", label: "Presidential Awards" },
  { value: "2008", label: "Origin Year" },
  { value: "2013", label: "Closed Chapter" },
];

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-l border-foreground/[0.12] pl-5">
      <span className="font-display text-2xl md:text-3xl text-gradient leading-none tracking-tight">
        {value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-foreground/45">
        {label}
      </span>
    </div>
  );
}

function InnovationCard({
  innovation,
  index,
}: {
  innovation: (typeof innovations)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.1, ease: EASE, delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]"
    >
      {/* Image plate */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={innovation.image}
          alt={innovation.name}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05] archive-grade"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.04_0.005_245/0.75)] via-transparent to-transparent"
        />
        {/* Number badge */}
        <span className="absolute left-3 top-3 rounded-[2px] bg-background/55 px-2 py-1 font-mono text-[10px] tracking-[0.28em] text-foreground/80 backdrop-blur-sm">
          {innovation.n}
        </span>
        {/* Year badge */}
        <span className="absolute right-3 top-3 rounded-[2px] bg-background/55 px-2 py-1 font-mono text-[10px] tracking-[0.28em] text-accent/85 backdrop-blur-sm">
          {innovation.year}
        </span>
        {/* Presidential marker — bottom of image */}
        <span className="absolute bottom-3 left-3 rounded-[2px] bg-accent/[0.15] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.28em] text-accent/80 backdrop-blur-sm border border-accent/20">
          Presidential Award
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.44em] text-accent/65">
          {innovation.category}
        </span>
        <div className="space-y-1">
          <h3 className="font-display text-xl md:text-[1.35rem] tracking-[-0.025em] text-foreground/95 leading-tight">
            {innovation.name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary/75">
            {innovation.tagline}
          </p>
        </div>
        <p className="flex-1 text-[13px] md:text-[14px] leading-relaxed text-foreground/60">
          {innovation.description}
        </p>
      </div>

      {/* Hover accent line */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
    </motion.article>
  );
}

function EarlyWorksPage() {
  return (
    <CinematicPageShell
      eyebrow="Early Works · 2008–2013 · [ Origin Innovations ]"
      title={
        <>
          The teenage innovations
          <br className="hidden sm:block" />
          that earned six Presidential Awards.
        </>
      }
      lead="Between 2008 and 2013 — still in his teens — Sushanth designed and built six original devices, each tackling a real human problem with hardware that worked."
      backdrop={backdrop}
      overlay={0.82}
    >
      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="mb-14 flex flex-wrap gap-x-10 gap-y-6"
      >
        {stats.map((s) => (
          <StatPill key={s.label} value={s.value} label={s.label} />
        ))}
      </motion.div>

      {/* ── Section header ── */}
      <motion.header
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-foreground/[0.08] pt-6"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/80">
          Origin Innovations
        </span>
        <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
          Six Devices. Six Awards.
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
          2008–2013
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/35">
          01 · Hardware
        </span>
      </motion.header>

      {/* ── Innovation cards grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        {innovations.map((inv, i) => (
          <InnovationCard key={inv.n} innovation={inv} index={i} />
        ))}
      </div>

      {/* ── Timeline strip ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ transformOrigin: "left" }}
        className="mb-16 overflow-x-auto"
      >
        <div className="relative flex min-w-[480px] items-center gap-0 border border-foreground/[0.07] rounded-sm bg-[oklch(0.05_0.006_245)] px-6 py-5">
          {/* Connecting line */}
          <div
            aria-hidden
            className="absolute left-[calc(theme(spacing.6)+24px)] right-[calc(theme(spacing.6)+24px)] top-1/2 h-px -translate-y-1/2 bg-foreground/[0.08]"
          />
          {innovations.map((inv, i) => (
            <div
              key={inv.n}
              className="relative z-10 flex flex-1 flex-col items-center gap-2 text-center"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/40 bg-[oklch(0.05_0.006_245)] text-accent/80 transition-all duration-500 hover:border-accent hover:bg-accent/10">
                <span className="font-mono text-[7px] tracking-tight">{inv.n}</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-accent/60">
                {inv.year}
              </span>
              <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-foreground/40 leading-tight max-w-[72px]">
                {inv.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Editorial narrative ── */}
      <EditorialSection
        number="02 — Origin"
        heading="Every device started with a real person."
      >
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/72 mb-5">
          Before graphene. Before deep-tech ventures. Before a single stage appearance
          — there were six problems. A paralysed individual who couldn't move. A vehicle
          that couldn't stop in time. A woman who couldn't signal for help. A device that
          died when it mattered most.
        </p>
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/72 mb-5">
          Each innovation emerged not from a lab brief or a competition prompt, but from
          encountering a real human limitation and refusing to accept it as permanent.
          The breath-operated wheelchair was built because no commercially available
          solution existed that a teenager could build, test, and iterate. So one was made.
        </p>
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/72">
          Between 2008 and 2013, six such devices were built, refined, and recognised by
          the President of India across six separate national award ceremonies — a record
          across a five-year period that remains the foundation of everything that followed.
        </p>
      </EditorialSection>

      <EditorialSection
        number="03 — Recognition"
        heading="Recognised before the category existed."
      >
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/72 mb-5">
          The Intel IRIS National Science Fair, the National Innovation Foundation, and the
          President of India recognised these devices not for their polish, but for their
          problem-solving rigour. Each award was a signal that hardware solving real
          problems — built without institutional resources — was itself a category worth watching.
        </p>
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/72">
          MIT TR-35 followed. NASA research partnerships followed. TED-India followed.
          But all of it traced back to six devices built on determination and a genuine
          need to make things better — by a teenager who couldn't yet imagine what they
          would become.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
