import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/scene-about-notebook.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Sushanth Paatnaik · Inventor & Deep-Tech Founder" },
      {
        name: "description",
        content:
          "Founder philosophy, journey, and mission of Sushanth Paatnaik — inventor, deep-tech founder, and six-time Indian Presidential awardee building from India for the world.",
      },
      { property: "og:title", content: "About — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Inventor, founder, and six-time Indian Presidential awardee. The philosophy and journey behind the work.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  return (
    <CinematicPageShell
      eyebrow="About · Founder"
      title={<>An inventor, quietly building<br className="hidden md:inline" /> industrial futures.</>}
      lead="Six-time Indian Presidential awardee. Founder of Monoatom Labs, Grafillium, SPI Industries, InThinks, and Starunico Capital. Chief Innovation Officer at Magppie. The work began in a borrowed workshop at fourteen — and has not really paused since."
      backdrop={backdrop}
      overlay={0.74}
    >
      <EditorialSection number="01 · Origin" heading="A workshop, a wheelchair, and a question.">
        <p>
          At fourteen, in a workshop borrowed for a weekend, I built a
          breath-powered wheelchair for a man with locked-in syndrome who could
          no longer ask for water. That afternoon rewrote what engineering
          meant to me: not optimisation, but agency. Performance is the means.
          Agency is the brief.
        </p>
        <p>
          Every venture since has begun with the same question — who is this
          for, and what does dignity look like for them at scale?
        </p>
      </EditorialSection>

      <EditorialSection number="02 · Philosophy" heading="Engineer matter. Engineer capital. Engineer scale.">
        <p>
          Frontier science only matters when it reaches the industrial world.
          That requires three disciplines held together: invention, capital
          architecture, and operating systems. I have spent the last fifteen
          years learning to hold all three in one hand.
        </p>
        <p>
          Recognition is a lagging indicator. The real measure is whether the
          next prototype shipped, whether the next venture is solvent, and
          whether the work eventually outlives the inventor.
        </p>
      </EditorialSection>

      <EditorialSection number="03 · Mission" heading="Built in India. Designed for the world.">
        <p>
          India has the talent, the demand, and the urgency to lead the carbon
          century. What remains is patience — the institutional patience to
          translate Indian invention into global industrial deployment.
        </p>
        <p>
          My ventures, taken together, are one answer to that question: a
          vertically integrated stack from atom-scale research to capital and
          commercialization, designed to make Indian deep-tech globally
          inevitable.
        </p>
      </EditorialSection>

      <EditorialSection number="04 · Evolution" heading="From inventor to ecosystem.">
        <p>
          The first decade was about inventions. The second is about systems —
          companies, capital, and the talent that compounds across them. The
          third, I suspect, will be about handing the work to the next
          generation of Indian builders who never had to ask permission.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
