import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-03-material.jpg";

export const Route = createFileRoute("/innovations")({
  component: InnovationsPage,
  head: () => ({
    meta: [
      { title: "Innovations — Graphene, Nano-Materials & Industrial Systems" },
      {
        name: "description",
        content:
          "Deep-tech archive: graphene synthesis, nano-materials, coatings, composites, batteries, climate infrastructure, and AI-assisted material discovery.",
      },
      { property: "og:title", content: "Innovations — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Graphene, advanced materials, industrial coatings, energy systems, and the environmental technologies built around them.",
      },
      { property: "og:url", content: "/innovations" },
    ],
    links: [{ rel: "canonical", href: "/innovations" }],
  }),
});

const platforms = [
  {
    n: "01",
    title: "Graphene & 2D-material synthesis",
    body: "Clean, scalable production routes for high-quality graphene and adjacent two-dimensional materials — the upstream lattice that every downstream platform inherits.",
  },
  {
    n: "02",
    title: "Advanced coatings",
    body: "Functional coatings for solar absorption, thermal management, corrosion resistance, and anti-fouling surfaces — engineered atom-up for industrial substrates.",
  },
  {
    n: "03",
    title: "Energy storage & charging",
    body: "Graphene-augmented battery chemistries and electrode architectures targeting minute-scale charging, longer cycle life, and grid-scale durability.",
  },
  {
    n: "04",
    title: "Polymer & composite additives",
    body: "Nano-additives that lift strength, conductivity, and weight performance of industrial polymers and structural composites without re-engineering supply chains.",
  },
  {
    n: "05",
    title: "Environmental systems",
    body: "Water purification, air filtration, and coal-moisture reduction — frontier materials applied to the unglamorous infrastructure that decides climate outcomes.",
  },
  {
    n: "06",
    title: "AI-assisted material discovery",
    body: "Computational pipelines that compress the discovery loop — modelling matter, processes, and economics before they reach the pilot line.",
  },
];

function InnovationsPage() {
  return (
    <CinematicPageShell
      eyebrow="Innovations · Deep-Tech Archive"
      title={<>One material platform. <br className="hidden md:inline" />Many industries.</>}
      lead="Graphene, nano-materials, coatings, additives, composites, energy systems, environmental technologies, and AI-assisted discovery — each a downstream of the same lattice."
      backdrop={backdrop}
      overlay={0.7}
    >
      <EditorialSection number="00 · Thesis" heading="A single sheet of carbon, manufactured cleanly and at scale, is the most under-priced strategic asset on the table this decade.">
        <p>
          The platforms below are not separate inventions. They are downstream
          expressions of one upstream capability: producing engineered carbon
          and adjacent materials at industrial quality, with industrial economics.
        </p>
      </EditorialSection>

      <EditorialList items={platforms} />

      <EditorialSection number="07 · Pipeline" heading="What is moving from lab to line.">
        <p>
          Pilot-scale graphene coatings for utility-scale solar. Conductive
          additives in field trials with polymer majors. Filtration cartridges
          deployed in industrial water reuse loops. The work is intentionally
          quiet — the right time to talk is after the data has stabilised.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
