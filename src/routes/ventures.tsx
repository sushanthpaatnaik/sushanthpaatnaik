import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-05-ventures.jpg";

export const Route = createFileRoute("/ventures")({
  component: VenturesPage,
  head: () => ({
    meta: [
      { title: "Ventures — Monoatom, Grafillium, SPI, InThinks, Starunico" },
      {
        name: "description",
        content:
          "Six operating vehicles across advanced materials, industrial products, AI, and capital — the commercialization architecture behind the science.",
      },
      { property: "og:title", content: "Ventures — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Ecosystem architecture and commercialization systems carrying frontier science from lab to industrial world.",
      },
      { property: "og:url", content: "/ventures" },
    ],
    links: [{ rel: "canonical", href: "/ventures" }],
  }),
});

const ventures = [
  {
    n: "01",
    title: "Monoatom Labs",
    body: "Frontier graphene and 2D-material research — the upstream engine feeding every downstream venture.",
  },
  {
    n: "02",
    title: "Grafillium",
    body: "Graphene-enabled advanced materials engineered for solar, batteries, polymers, and industrial-scale deployment.",
  },
  {
    n: "03",
    title: "SPI Industries",
    body: "Operating arm translating advanced materials into production-grade industrial products, plants, and supply chains.",
  },
  {
    n: "04",
    title: "InThinks",
    body: "AI systems applied to materials discovery, process intelligence, and the commercialization layer beneath every venture.",
  },
  {
    n: "05",
    title: "Starunico Capital",
    body: "Capital architecture for deep-tech — the patient vehicle carrying frontier science from lab through industrial scale.",
  },
  {
    n: "06",
    title: "Magppie · CIO",
    body: "Chief Innovation Officer — embedding advanced-materials thinking into an established industrial design house.",
  },
];

function VenturesPage() {
  return (
    <CinematicPageShell
      eyebrow="Ventures · Ecosystem Architecture"
      title={<>Invention alone is not enough.<br className="hidden md:inline" /> So I build the vehicles.</>}
      lead="Five operating ventures plus a CIO seat at Magppie — a vertically integrated stack carrying frontier materials from the lab into the industrial world."
      backdrop={backdrop}
      overlay={0.72}
    >
      <EditorialList items={ventures} />

      <EditorialSection number="07 · Architecture" heading="One stack, four layers.">
        <p>
          <span className="text-foreground/95">Research</span> at Monoatom feeds{" "}
          <span className="text-foreground/95">materials</span> at Grafillium, which feed{" "}
          <span className="text-foreground/95">industrial products</span> at SPI. InThinks runs the
          intelligence layer across all three. Starunico is the patient capital underneath.
          Magppie is the field deployment of materials thinking inside an established house.
        </p>
        <p>
          Each company is independently viable. Together, they form a closed
          loop from atom to invoice.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
