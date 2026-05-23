import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/scene-media-wall.jpg";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "News & Media — Editorial Archive · Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Editorial archive and public footprint: MIT Technology Review, India Today, Times of India, Business Standard, Global Indian, and ongoing coverage.",
      },
      { property: "og:title", content: "News — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Editorial archive of coverage across global and Indian publications — recognized early, evolving globally.",
      },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
});

const archive = [
  {
    n: "MIT Technology Review",
    title: "Featured Innovator · Graphene work & venture architecture",
    body: "Editorial coverage of the materials platform and the operating group built around it.",
  },
  {
    n: "Global Indian",
    title: "Cover Story · India to world",
    body: "Cover feature on Indian invention reaching global industrial deployment.",
  },
  {
    n: "India Today",
    title: "Profile · From borrowed workshop to operating group",
    body: "Long-form profile on the journey from origin inventions to a deep-tech ecosystem.",
  },
  {
    n: "Times of India",
    title: "21 Patents & Awards · National recognitions",
    body: "Recurring national reporting on Presidential awards and the twenty-one-strong patent record.",
  },
  {
    n: "Business Standard",
    title: "Battery Breakthrough · Deep-tech commercialization",
    body: "Reporting on graphene-augmented battery work and the architecture spanning research, industrial products, AI, and capital.",
  },
  {
    n: "NIF-India",
    title: "IGNITE Awardee · National Innovation Foundation",
    body: "Recognised under the IGNITE programme of the National Innovation Foundation for original invention at a school-age stage.",
  },
  {
    n: "TED-India",
    title: "Speaker · One of the youngest invited",
    body: "A talk on engineering, dignity, and the discipline of inventing for one person at a time.",
  },
];


function NewsPage() {
  return (
    <CinematicPageShell
      eyebrow="News · Editorial Archive"
      title={<>Recognized early.<br className="hidden md:inline" /> Evolving globally.</>}
      lead="An archival media wall — a quiet record of where the work has been seen, read, and discussed across the last fifteen years."
      backdrop={backdrop}
      overlay={0.78}
    >
      <EditorialList items={archive} />

      <EditorialSection number="07 · Notes" heading="On press, with restraint.">
        <p>
          The archive is curated rather than complete. Press is useful when it
          accelerates the work and quiet when it does not. New coverage is
          added here as it stabilises.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
