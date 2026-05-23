import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import FounderPortrait from "@/components/scene/FounderPortrait";
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

const dossierStats = [
  { n: "27", label: "Honors of record · National + International" },
  { n: "50+", label: "Featured by news & media outlets" },
  { n: "2", label: "Academic degrees · IISER & OCT, Bhopal" },
  { n: "TED", label: "Global platform · among the youngest at the time" },
];

function AboutPage() {
  return (
    <CinematicPageShell
      eyebrow="About · Founder"
      title={<>An inventor, quietly building<br className="hidden md:inline" /> industrial futures.</>}
      lead="Born in Bhubaneswar, Odisha. Six-time Indian Presidential awardee between 2008 and 2013. Founder of Monoatom Labs, Grafillium, SPI Industries, InThinks, and Starunico Capital. Chief Innovation Officer at Magppie. The work began in a borrowed workshop at fourteen — and has not really paused since."
      backdrop={backdrop}
      overlay={0.74}
    >
      <FounderPortrait
        variant="editorial"
        eyebrow="02 — Founder"
        narrative={[
          "Industrial systems builder.",
          "Materials strategist.",
          "Deep-tech founder from India.",
        ]}
        caption="Sushanth Paatnaik — inventor, deep-tech founder, and six-time Indian Presidential awardee."
        meta="Portrait · Bhubaneswar"
      />

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

      <EditorialSection number="02 · Academia" heading="IISER Bhopal · OCT Bhopal.">
        <p>
          <span className="text-foreground/95">BSc.</span> from{" "}
          <span className="text-foreground/95">IISER Bhopal</span>, admitted
          under the <span className="text-foreground/95">KVPY-SP</span>{" "}
          scholarship — the foundation in chemistry, physics, and the
          discipline of asking questions matter cannot easily answer.
        </p>
        <p>
          <span className="text-foreground/95">BEd.</span> in ETE from{" "}
          <span className="text-foreground/95">OCT, Bhopal</span>, under the
          Special Achiever category — a quiet conviction that an inventor who
          cannot teach has not really finished the invention.
        </p>
      </EditorialSection>

      <EditorialSection number="03 · Philosophy" heading="Engineer matter. Engineer capital. Engineer scale.">
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

      <EditorialSection number="04 · Dossier" heading="Honors of record.">
        <ul className="not-prose mt-4 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {dossierStats.map((s) => (
            <li key={s.label} className="border-t border-foreground/[0.08] pt-5">
              <p className="font-display text-3xl tracking-[-0.02em] text-gradient md:text-4xl">
                {s.n}
              </p>
              <p className="mt-3 text-[12px] uppercase tracking-[0.32em] text-muted-foreground/70">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection number="05 · Mission" heading="Built in India. Designed for the world.">
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

      <EditorialSection number="06 · Evolution" heading="From inventor to ecosystem.">
        <p>
          The first decade was about inventions — ten-plus working prototypes
          shipped from a borrowed workshop. The second is about systems —
          companies, capital, and the talent that compounds across them. The
          third, I suspect, will be about handing the work to the next
          generation of Indian builders who never had to ask permission.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
