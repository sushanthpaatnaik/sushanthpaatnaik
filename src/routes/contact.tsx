import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-07-future.jpg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Direct contact for partnerships, capital, research collaboration, advisory, and press — read and triaged personally.",
      },
      { property: "og:title", content: "Contact — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Direct, restrained, and personally triaged. The shortest route from idea to first conversation.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  return (
    <CinematicPageShell
      eyebrow="Contact · Direct Line"
      title={<>Begin a conversation.</>}
      lead="One inbox. Read personally. The shortest route from idea to first conversation."
      backdrop={backdrop}
      overlay={0.76}
    >
      <EditorialSection heading="Direct email">
        <p>
          <a
            href="mailto:me@sushanthpaatnaik.com?subject=Hello"
            className="text-foreground underline-offset-4 hover:underline"
          >
            me@sushanthpaatnaik.com
          </a>
        </p>
        <p className="text-foreground/65">
          A short, specific note moves faster than a long one. One paragraph
          on context, one on what you are hoping to build.
        </p>
      </EditorialSection>

      <EditorialSection number="01" heading="What to write about.">
        <p>
          Industrial partnerships in advanced materials. Capital
          co-architecture for deep-tech. Research collaboration in graphene,
          energy, water, or climate systems. Advisory and board work.
          Editorial, press, and speaking.
        </p>
      </EditorialSection>

      <EditorialSection number="02" heading="What not to write about.">
        <p>
          Generic outreach, mass campaigns, or unsolicited fundraising
          decks. The inbox is small on purpose, so signal can survive.
        </p>
      </EditorialSection>

      <EditorialSection number="03" heading="Locations.">
        <p>
          Based across India · Bhubaneswar · Bhopal · Delhi-NCR. Work travel
          across Europe, the Gulf, and Southeast Asia on a recurring basis.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
