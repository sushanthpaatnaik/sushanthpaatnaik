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

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sushanthpaatnaik/" },
  { label: "Twitter / X", href: "https://x.com/sushantinthinks" },
  { label: "YouTube", href: "https://www.youtube.com/@Susantinventions" },
  { label: "Instagram", href: "https://www.instagram.com/sushanthpaatnaik/" },
  { label: "Facebook", href: "https://www.facebook.com/sushanthpaatnaik" },
];

function ContactPage() {
  return (
    <CinematicPageShell
      eyebrow="Contact · Direct Line"
      title={<>Let's build something that<br className="hidden md:inline" /> outlasts the news cycle.</>}
      lead="One inbox. Read personally. Open to collaborations on sustainable technology, R&D consulting, advisory mandates, and deep-tech investments."
      backdrop={backdrop}
      overlay={0.76}
    >
      <EditorialSection number="01 · Direct lines" heading="The shortest path.">
        <p>
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Hello"
            className="text-foreground underline-offset-4 hover:underline"
          >
            info@sushanthpaatnaik.com
          </a>
        </p>
        <p className="text-foreground/65">
          A short, specific note moves faster than a long one. One paragraph on
          context, one on what you are hoping to build.
        </p>
      </EditorialSection>

      <EditorialSection number="02 · Based in" heading="Bhubaneswar · New Delhi · Ahmedabad.">
        <p>
          Work travel across Europe, the Gulf, and Southeast Asia on a
          recurring basis.
        </p>
      </EditorialSection>

      <EditorialSection number="03 · Find me" heading="Social registry.">
        <ul className="not-prose mt-4 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.3em]">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                {s.label} <span className="opacity-60">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection number="04 · What to write about" heading="Signal worth holding.">
        <p>
          Industrial partnerships in advanced materials. Capital co-architecture for
          deep-tech. Research collaboration in graphene, energy, water, or climate
          systems. Advisory and board work. Editorial, press, and speaking.
        </p>
      </EditorialSection>

      <EditorialSection number="05 · What not to write about" heading="Kept off the desk.">
        <p>
          Generic outreach, mass campaigns, or unsolicited fundraising decks. The
          inbox is small on purpose, so signal can survive.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
