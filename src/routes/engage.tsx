import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-06-india.jpg";

export const Route = createFileRoute("/engage")({
  component: EngagePage,
  head: () => ({
    meta: [
      { title: "Engage — Partnerships, Advisory & Strategic Collaboration" },
      {
        name: "description",
        content:
          "Industrial partnerships, capital co-architecture, research collaboration, and advisory — how to engage with Sushanth Paatnaik and the ecosystem.",
      },
      { property: "og:title", content: "Engage — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Strategic collaboration, advisory, partnerships, and capital co-architecture across the deep-tech operating group.",
      },
      { property: "og:url", content: "/engage" },
    ],
    links: [{ rel: "canonical", href: "/engage" }],
  }),
});

const lanes = [
  {
    n: "01",
    title: "Industrial partnerships",
    body: "For incumbents seeking to integrate graphene, advanced coatings, or nano-additives into existing product lines without re-engineering supply chains.",
  },
  {
    n: "02",
    title: "Capital co-architecture",
    body: "For sovereign, family-office, and institutional investors interested in patient capital for deep-tech commercialization at industrial scale.",
  },
  {
    n: "03",
    title: "Research collaboration",
    body: "For universities, national labs, and corporate R&D groups working on materials, energy, water, or climate infrastructure.",
  },
  {
    n: "04",
    title: "Advisory & board seats",
    body: "Selective advisory work at the intersection of advanced materials, deep-tech commercialization, and India-to-world industrial strategy.",
  },
  {
    n: "05",
    title: "Speaking & editorial",
    body: "Keynotes, long-form interviews, and editorial contributions on invention, deep-tech, and the carbon century.",
  },
];

function EngagePage() {
  return (
    <CinematicPageShell
      eyebrow="Engage · Strategic Collaboration"
      title={<>The doors open<br className="hidden md:inline" /> for the right work.</>}
      lead="Selective engagement across partnerships, capital, research, and advisory — designed to move frontier materials further into the industrial world."
      backdrop={backdrop}
      overlay={0.74}
    >
      <EditorialList items={lanes} />

      <EditorialSection number="06 · Protocol" heading="How to reach the desk.">
        <p>
          The fastest route is a short, specific note. One paragraph on what
          you are building or considering, one paragraph on why a conversation
          would change the trajectory.
        </p>
        <p>
          <a
            href="mailto:me@sushanthpaatnaik.com?subject=Engage"
            className="text-foreground underline-offset-4 hover:underline"
          >
            me@sushanthpaatnaik.com
          </a>
          {" · "}direct, read, and triaged personally.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
