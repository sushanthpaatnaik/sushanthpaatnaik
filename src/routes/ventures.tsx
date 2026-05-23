import { createFileRoute } from "@tanstack/react-router";
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
    domain: "Innovation studio",
    thesis:
      "An ideation and innovation studio that shapes early-stage thinking into products, then transfers or licenses the technology to partner organisations.",
    href: "https://inthinks.com/",
  },
  {
    code: "05",
    name: "Starunico Capital",
    year: "2026",
    role: "Co-Founder",
    domain: "Deep-tech capital",
    thesis:
      "Backing founders building the materials and energy layer of the next century.",
    href: "https://starunico.com/",
  },
  {
    code: "06",
    name: "Magppie",
    year: "2025",
    role: "Chief Innovation Officer",
    domain: "Stone wellness kitchens",
    thesis:
      "Pioneering the world's first 100% stone-built modular kitchen — transforming ordinary homes into wellness homes that protect family and planet.",
    href: "https://magppie.com/",
  },
];

const advisories = [
  // scale: per-logo optical normalization (1.0 = baseline)
  { name: "Magppie", sector: "Design · Living", logo: magppieLogo, scale: 1.18 },
  { name: "Vinrox", sector: "Materials", logo: vinroxLogo, scale: 1.0 },
  { name: "VPRPL", sector: "Industrial", logo: vprplLogo, scale: 0.86 },
  { name: "Tileopedia", sector: "Surfaces", logo: tileopediaLogo, scale: 1.15 }, // "Eurogres" parent — slightly larger
  { name: "WeHear", sector: "Consumer Tech", logo: wehearLogo, scale: 0.88 },
];

function VenturesPage() {
  return (
    <CinematicPageShell
      eyebrow="Ventures · Ecosystem Architecture"
      title={<>A portfolio engineered<br className="hidden md:inline" /> for planetary impact.</>}
      lead="Founder, co-founder and chief innovation officer across six ventures — plus a quietly held advisory roster of five houses shaping industry, materials and climate."
      backdrop={backdrop}
      overlay={0.72}
    >
      <ul className="not-prose mt-10 flex flex-col gap-10 md:gap-12">
        {ventures.map((v) => (
          <li key={v.name} className="border-t border-foreground/[0.07] pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/55">
              <span>{v.code} · {v.year}</span>
              <span>{v.domain}</span>
            </div>
            <h3 className="mt-4 font-display text-xl md:text-2xl tracking-[-0.015em] text-foreground/95">
              {v.name}
            </h3>
            <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-accent/80">
              {v.role}
            </p>
            <p className="mt-3 max-w-2xl text-[15px] md:text-base leading-relaxed text-foreground/70">
              {v.thesis}
            </p>
            <a
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/75 hover:text-foreground transition-colors"
            >
              Visit {v.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗
            </a>
          </li>
        ))}
      </ul>

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

      <EditorialSection number="08 · Advisory" heading="Counsel to industrial & climate change.">
        <p>
          A short ledger of the houses I quietly advise across materials, design and
          consumer technology.
        </p>
        <div className="not-prose mt-14 grid grid-cols-2 items-stretch gap-px sm:grid-cols-3 md:grid-cols-5 bg-foreground/[0.03] rounded-sm overflow-hidden ring-1 ring-foreground/[0.04]">
          {advisories.map((a) => (
            <div
              key={a.name}
              className="group relative flex flex-col items-center justify-center gap-5 px-4 py-8 md:py-9 text-center overflow-hidden bg-[oklch(0.055_0.006_240)] transition-all duration-700"
            >
              {/* Atmospheric well — calmer cinematic base behind the mark */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(80% 70% at 50% 42%, oklch(0.10 0.008 240 / 0.55) 0%, oklch(0.05 0.006 245 / 0.92) 78%)",
                }}
              />
              {/* Volumetric key light — softer directional glow appears on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(50% 42% at 50% 32%, oklch(0.62 0.04 230 / 0.14), transparent 76%)",
                }}
              />
              {/* Reflective floor — subtle industrial sheen at the base */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background:
                    "linear-gradient(to top, oklch(0.08 0.008 240 / 0.40), transparent)",
                }}
              />
              {/* Logo plate — fixed optical container, per-mark scaling */}
              <div className="relative z-10 flex items-center justify-center w-full h-[68px] md:h-[78px]">
                <img
                  src={a.logo}
                  alt={`${a.name} — ${a.sector}`}
                  loading="lazy"
                  style={{
                    maxHeight: `${Math.round(54 * a.scale)}px`,
                    maxWidth: `${Math.round(74 * a.scale)}%`,
                  }}
                  className="w-auto h-auto object-contain opacity-95 drop-shadow-[0_2px_14px_oklch(0_0_0/0.55)] transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
                />
              </div>
              {/* Editorial caption block — hairline + tracked label */}
              <div className="relative z-10 flex flex-col items-center gap-2.5">
                <span
                  aria-hidden
                  className="block h-px w-7 bg-foreground/20 transition-all duration-700 group-hover:w-11 group-hover:bg-accent/45"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.38em] leading-none text-foreground/70 transition-colors duration-700 group-hover:text-foreground/90">
                  {a.sector}
                </span>
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>
    </CinematicPageShell>
  );
}
