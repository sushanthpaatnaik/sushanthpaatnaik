import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-05-ventures.jpg";

import magppieLogo from "@/assets/clients/magppie.png";
import vinroxLogo from "@/assets/clients/vinrox.png";
import vprplLogo from "@/assets/clients/vprpl.webp";
import tileopediaLogo from "@/assets/clients/tileopedia.webp";
import wehearLogo from "@/assets/clients/wehear.png";

export const Route = createFileRoute("/ventures")({
  component: VenturesPage,
  head: () => ({
    meta: [
      { title: "Ventures — Operating Group · Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Six operating vehicles across advanced materials, industrial products, AI, and capital — and a five-mark advisory roster.",
      },
      { property: "og:title", content: "Ventures — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Ecosystem architecture carrying frontier materials from lab to industrial world.",
      },
      { property: "og:url", content: "/ventures" },
    ],
    links: [{ rel: "canonical", href: "/ventures" }],
  }),
});

type Venture = {
  code: string;
  name: string;
  year: string;
  role: string;
  category: string;
  domain: string;
  thesis: string;
  href: string;
};

const ventures: Venture[] = [
  {
    code: "01",
    name: "Monoatom Labs",
    year: "2025",
    role: "Co-Founder & CEO",
    category: "Materials",
    domain: "Graphene at scale",
    thesis:
      "An innovative, scalable and economical method to manufacture graphene — and the applications that turn it into real-world performance gains.",
    href: "https://monoatomlabs.com/",
  },
  {
    code: "02",
    name: "Grafillium",
    year: "2025",
    role: "Co-Founder & CIO",
    category: "Materials",
    domain: "Eco nano additives",
    thesis:
      "Deep-tech nanomaterial additive technologies that boost efficiency and cut carbon emissions across power, logistics and heavy industry.",
    href: "https://grafillium.com/",
  },
  {
    code: "03",
    name: "SPI Industries",
    year: "2024",
    role: "Founder & CEO",
    category: "Industrial Systems",
    domain: "R&D industrial solutions",
    thesis:
      "Innovative R&D-led industrial solutions in nanomaterial engineering — translating advanced materials science into deployable systems that move the needle for industry.",
    href: "https://spiindustries.co/",
  },
  {
    code: "04",
    name: "InThinks",
    year: "2026",
    role: "Co-Founder",
    category: "Innovation Studio",
    domain: "Ideation & IP transfer",
    thesis:
      "An ideation and innovation studio that shapes early-stage thinking into products, then transfers or licenses the technology to partner organisations.",
    href: "https://inthinks.com/",
  },
  {
    code: "05",
    name: "Starunico Capital",
    year: "2026",
    role: "Co-Founder",
    category: "Deep-Tech Capital",
    domain: "Materials & energy",
    thesis:
      "Backing founders building the materials and energy layer of the next century.",
    href: "https://starunico.com/",
  },
  {
    code: "06",
    name: "Magppie",
    year: "2025",
    role: "Chief Innovation Officer",
    category: "Design + Living",
    domain: "Stone wellness kitchens",
    thesis:
      "Pioneering the world's first 100% stone-built modular kitchen — transforming ordinary homes into wellness homes that protect family and planet.",
    href: "https://magppie.com/",
  },
];

/* ------------------------------------------------------------------ */
/*  Advisory roster — five marks, five industry layers                */
/* ------------------------------------------------------------------ */
type Advisory = {
  name: string;
  category: string;
  logo: string;
  /** Optical scale — normalised so every mark reads at the same weight. */
  scale: number;
  /** Px vertical nudge for optical centering. */
  offsetY?: number;
};

const advisories: Advisory[] = [
  { name: "Vinrox",     category: "Materials",           logo: vinroxLogo,     scale: 1.00, offsetY: 0 },
  { name: "VPRPL",      category: "Industrial Systems",  logo: vprplLogo,      scale: 0.84, offsetY: -1 },
  { name: "WeHear",     category: "Consumer Tech",       logo: wehearLogo,     scale: 0.88, offsetY: 0 },
  { name: "Tileopedia", category: "Surface Technologies",logo: tileopediaLogo, scale: 1.06, offsetY: 2 },
  { name: "Magppie",    category: "Design + Living",     logo: magppieLogo,    scale: 1.10, offsetY: 1 },
];


/* ------------------------------------------------------------------ */
/*  Holdings authority block                                          */
/* ------------------------------------------------------------------ */
const holdingStats = [
  { value: "06", label: "Operating Vehicles" },
  { value: "05", label: "Advisory Positions" },
  { value: "03", label: "Material Science Layers" },
  { value: "01", label: "Closed Loop Ecosystem" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
function VenturesPage() {
  return (
    <CinematicPageShell
      eyebrow="Ventures · Ecosystem Architecture"
      title={<>A portfolio engineered<br className="hidden md:inline" /> for planetary impact.</>}
      lead="Founder, co-founder and chief innovation officer across six ventures — plus a quietly held advisory roster of five houses shaping industry, materials and climate."
      backdrop={backdrop}
      overlay={0.72}
    >
      {/* ---------- Holdings authority strip ---------- */}
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
        className="not-prose mb-12 md:mb-16 grid grid-cols-2 gap-px rounded-sm overflow-hidden ring-1 ring-foreground/[0.04] bg-foreground/[0.03]"
      >
        {holdingStats.map((s) => (
          <div
            key={s.label}
            className="relative flex flex-col items-center gap-1.5 px-4 py-6 md:py-8 bg-[oklch(0.055_0.006_240)]"
          >
            <span className="font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
              {s.value}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground/60">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ---------- Operating companies list ---------- */}
      <ul className="not-prose flex flex-col">
        {ventures.map((v, i) => (
          <motion.li
            key={v.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, delay: i * 1, ease: [0.19, 1, 0.22, 1] }}
            className="group relative"
          >
            {/* Hairline separator — full width, subtle */}
            <div className="absolute top-0 left-0 right-0 h-px bg-foreground/[0.06]" />
            {/* Hover accent line — restrained copper-gold */}
            <div className="absolute top-1/2 left-0 h-px w-0 bg-accent/30 transition-all duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-0 group-hover:w-full" />
            {/* Cinematic atmospheric wash on hover — restrained graphene diffusion */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-2%] inset-y-2 opacity-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(60% 70% at 22% 50%, oklch(0.62 0.025 232 / 0.08), transparent 72%)",
              }}
            />

            <div className="relative py-9 md:py-11 transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-[2px]">
              {/* Code · Year · Industry layer */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/50">
                <span>{v.code} · {v.year}</span>
                <span className="text-accent/70">{v.category}</span>
              </div>

              {/* Name */}
              <h3 className="mt-5 font-display text-xl md:text-[1.6rem] tracking-[-0.015em] text-foreground/95 transition-colors duration-700 group-hover:text-foreground">
                {v.name}
              </h3>

              {/* Role · Domain */}
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                <span className="text-accent/75">{v.role}</span>
                <span className="mx-2 text-foreground/25">·</span>
                <span>{v.domain}</span>
              </p>


              {/* Thesis */}
              <p className="mt-4 max-w-2xl text-[15px] md:text-[15px] leading-[1.72] text-foreground/65 transition-colors duration-700 group-hover:text-foreground/80">
                {v.thesis}
              </p>

              {/* Visit link */}
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 hover:text-foreground/90 transition-colors duration-700"
              >
                <span className="relative">
                  Visit {v.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-px w-0 bg-foreground/25 group-hover:w-full transition-all duration-700" />
                </span>
                <span className="transition-transform duration-700 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* ---------- Architecture editorial ---------- */}
      <EditorialSection number="07 · Architecture" heading="One stack, four layers.">
        <p>
          <span className="text-foreground/95">Research</span> at Monoatom feeds{" "}
          <span className="text-foreground/95">materials</span> at Grafillium, which feed{" "}
          <span className="text-foreground/95">industrial products</span> at SPI. InThinks
          runs the intelligence layer across all three. Starunico is the patient capital
          underneath. Magppie is the field deployment of materials thinking inside an
          established house.
        </p>
        <p>
          Each company is independently viable. Together, they form a closed loop from
          atom to invoice.
        </p>
      </EditorialSection>

      {/* ---------- Advisory roster · Industry layer wall ---------- */}
      <EditorialSection number="08 · Advisory" heading="Counsel across five industry layers.">
        <p>
          A short ledger of the houses I quietly advise — one mark per layer
          of the industrial network: materials, industrial systems, consumer
          technology, surface technologies, and design + living.
        </p>

        {/* Industry-layer header strip — anchors the wall as one network */}
        <div className="not-prose mt-14 mb-px flex items-center gap-3">
          <span className="h-px flex-1 bg-foreground/[0.08]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
            Industry Layers · Advisory Network
          </span>
          <span className="h-px flex-1 bg-foreground/[0.08]" />
        </div>

        {/* Unified glass-dark mark wall — equal cells, optical normalisation */}
        <div className="not-prose grid grid-cols-2 gap-px bg-foreground/[0.05] ring-1 ring-foreground/[0.05] sm:grid-cols-3 md:grid-cols-5 rounded-sm overflow-hidden">
          {advisories.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] }}
              className="group relative flex flex-col items-center justify-between gap-7 overflow-hidden bg-[oklch(0.05_0.006_245)] px-5 py-10 md:py-12 text-center"
            >
              {/* ── Atmospheric base — restrained graphene wash ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(85% 60% at 50% 35%, oklch(0.11 0.012 235 / 0.32) 0%, transparent 75%)",
                }}
              />

              {/* ── Cinematic glass sheen ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(1 0 0 / 0.025) 0%, transparent 100%)",
                }}
              />

              {/* ── Restrained blue diffusion on hover (matches site wash) ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 30%, oklch(0.78 0.02 232 / 0.10), transparent 72%)",
                }}
              />

              {/* ── Hairline top — turns accent on hover ── */}
              <div
                aria-hidden
                className="absolute left-0 right-0 top-0 h-px bg-foreground/[0.06] transition-all duration-[1100ms] group-hover:bg-accent/30"
              />

              {/* ── Industry layer eyebrow ── */}
              <span className="relative z-10 font-mono text-[9px] uppercase tracking-[0.42em] text-accent/70">
                {a.category}
              </span>

              {/* ── Logo plate — fixed canvas for optical normalisation ── */}
              <div
                className="relative z-10 flex items-center justify-center w-full"
                style={{ height: "64px" }}
              >
                <img
                  src={a.logo}
                  alt={`${a.name} — ${a.category}`}
                  loading="lazy"
                  style={{
                    maxHeight: `${Math.round(46 * a.scale)}px`,
                    maxWidth: `${Math.round(74 * a.scale)}%`,
                    transform: `translateY(${a.offsetY || 0}px)`,
                    filter: "grayscale(0.18) brightness(0.95) contrast(1.04)",
                  }}
                  className="h-auto w-auto object-contain opacity-[0.82] transition-all duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>

              {/* ── Editorial caption ── */}
              <div className="relative z-10 flex flex-col items-center gap-2.5">
                <span
                  aria-hidden
                  className="block h-px w-6 bg-foreground/20 transition-all duration-[1100ms] group-hover:w-10 group-hover:bg-accent/45"
                />
                <span className="font-display text-[13px] tracking-[-0.005em] text-foreground/80 transition-colors duration-[1100ms] group-hover:text-foreground/95">
                  {a.name}
                </span>
              </div>
            </motion.div>

          ))}
        </div>
      </EditorialSection>
    </CinematicPageShell>
  );
}
