import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-05-ventures.jpg";

import magppieLogo from "@/assets/clients/magppie.png";
import vinroxLogo from "@/assets/clients/vinrox.png";
import vprplLogo from "@/assets/clients/vprpl.webp";
import tileopediaLogo from "@/assets/clients/tileopedia.webp";
import wehearLogo from "@/assets/clients/wehear.webp";

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
  { name: "Magppie", sector: "Design · Living", logo: magppieLogo },
  { name: "Vinrox", sector: "Materials", logo: vinroxLogo },
  { name: "VPRPL", sector: "Industrial", logo: vprplLogo },
  { name: "Tileopedia", sector: "Surfaces", logo: tileopediaLogo },
  { name: "WeHear", sector: "Consumer Tech", logo: wehearLogo },
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
        <div className="not-prose mt-12 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
          {advisories.map((a) => (
            <div
              key={a.name}
              className="group relative flex flex-col items-center justify-center gap-4 rounded-sm px-4 py-8 md:py-10 text-center overflow-hidden transition-all duration-700"
            >
              {/* Volumetric halo — soft directional glow behind each mark */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(60% 55% at 50% 42%, oklch(0.55 0.04 235 / 0.18), transparent 70%)",
                }}
              />
              {/* Subtle local lift — raises contrast around the logo without flattening atmosphere */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-4 top-4 bottom-12 rounded-sm opacity-60 transition-opacity duration-700 group-hover:opacity-90"
                style={{
                  background:
                    "radial-gradient(70% 60% at 50% 50%, oklch(0.18 0.01 240 / 0.55), transparent 75%)",
                  boxShadow:
                    "inset 0 1px 0 oklch(1 0 0 / 0.04), inset 0 -1px 0 oklch(0 0 0 / 0.3)",
                }}
              />
              {/* Hairline frame — editorial separation */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-sm border border-foreground/[0.06] transition-colors duration-700 group-hover:border-foreground/[0.14]"
              />
              <img
                src={a.logo}
                alt={`${a.name} — ${a.sector}`}
                loading="lazy"
                className="relative z-10 h-12 md:h-16 w-auto max-w-[82%] object-contain opacity-95 mix-blend-screen drop-shadow-[0_2px_14px_oklch(0_0_0/0.6)] transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.02]"
              />
              <span className="relative z-10 font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/55 transition-colors duration-700 group-hover:text-foreground/75">
                {a.sector}
              </span>
            </div>
          ))}
        </div>
      </EditorialSection>
    </CinematicPageShell>
  );
}
