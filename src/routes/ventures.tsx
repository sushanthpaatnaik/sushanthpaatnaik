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
      { title: "Ventures — Monoatom, Grafillium, SPI, InThinks, Starunico, Magppie" },
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

            <div className="relative py-9 md:py-11 transition-all duration-700">
              {/* Code · Year row */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/50">
                <span>{v.code} · {v.year}</span>
                <span>{v.domain}</span>
              </div>

              {/* Name */}
              <h3 className="mt-5 font-display text-xl md:text-[1.6rem] tracking-[-0.015em] text-foreground/95 transition-colors duration-700 group-hover:text-foreground">
                {v.name}
              </h3>

              {/* Role */}
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-accent/70">
                {v.role}
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

      {/* ---------- Advisory roster ---------- */}
      <EditorialSection number="08 · Advisory" heading="Counsel to industrial & climate houses.">
        <p>
          A short ledger of the houses I quietly advise across materials, design and
          consumer technology.
        </p>

        {/* Premium institutional advisory grid */}
        <div className="not-prose mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {advisories.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
              className="group relative flex flex-col items-center justify-between gap-6 px-4 py-8 md:py-10 text-center overflow-hidden rounded-sm"
              style={{
                background: "oklch(0.055 0.006 240 / 0.85)",
                border: "1px solid oklch(1 0 0 / 0.05)",
                boxShadow: "inset 1px 1.5px 0 oklch(1 1 0 / 0.03), 0 4px 24px -12px oklch(1 0 0 / 1)",
              }}
            >
              {/* ── Atmospheric base layer ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-1"
                style={{
                  borderRadius: "1px",
                  background:
                    "radial-gradient(80% 65% at 50% 40%, oklch(0.10 0.008 240 / 0.48) 0%, oklch(0.05 0.006 245 / 0.92) 78%)",
                }}
              />

              {/* ── Hover volumetric key light ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[900ms] group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(45% 40% at 50% 30%, oklch(0.65 0.05 230 / 0.10), transparent 72%)",
                }}
              />

              {/* ── Metallic floor reflection ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-1 h-[28%]"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.09 0.01 240 / 0.45), transparent)",
                }}
              />

              {/* ── Hairline top accent ── */}
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px bg-foreground/[0.08] transition-all duration-[900ms] group-hover:bg-accent/25"
              />

              {/* ── Logo plate ── */}
              <div
                className="relative z-10 flex items-center justify-center w-full"
                style={{ height: "72px" }}
              >
                <img
                  src={a.logo}
                  alt={`${a.name} — ${a.sector}`}
                  loading="lazy"
                  style={{
                    maxHeight: `${Math.round(48 * a.scale)}px`,
                    maxWidth: `${Math.round(72 * a.scale)}%`,
                    transform: `translateY(${a.offsetY || 0}px)`,
                    filter: "grayscale(12%) brightness(0.97)",
                  }}
                  className="w-auto h-auto object-contain opacity-[0.88] drop-shadow-[0_2px_12px_oklch(0_0_0/0.5)] transition-all duration-[900ms] group-hover:opacity-100 group-hover:grayscale-0 group-hover:drop-shadow-[0_3px_18px_oklch(0_0_0/0.65)]"
                />
              </div>

              {/* ── Editorial caption ── */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span
                  aria-hidden
                  className="block h-px w-6 bg-foreground/18 transition-all duration-[900ms] group-hover:w-9 group-hover:bg-foreground/35"
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.36em] leading-none text-foreground/55 transition-colors duration-[900ms] group-hover:text-foreground/85">
                  {a.sector}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </EditorialSection>
    </CinematicPageShell>
  );
}
