import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/scene-early-workshop.jpg";

export const Route = createFileRoute("/early-works")({
  component: EarlyWorksPage,
  head: () => ({
    meta: [
      { title: "Early Works — Origin Archive · Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Prototypes, early inventions, and the origin archive of an inventor — the workshop years that became the foundation of a deep-tech operating group.",
      },
      { property: "og:title", content: "Early Works — Origin Archive" },
      {
        property: "og:description",
        content:
          "The breath wheelchair, the off-grid purifier, the tactile chemistry interface — origin inventions, in the inventor's own hand.",
      },
      { property: "og:url", content: "/early-works" },
    ],
    links: [{ rel: "canonical", href: "/early-works" }],
  }),
});

const earlyInventions = [
  {
    n: "2006",
    title: "Breath-powered wheelchair",
    body: "Built at fourteen for a man with locked-in syndrome. A breath-pressure sensor wired into a relay, mounted on a hand-welded frame. The invention that decided everything that followed.",
  },
  {
    n: "2008",
    title: "Off-grid water purifier",
    body: "A low-cost gravity purifier for communities without grid power — first deployment of a lifelong instinct that the unglamorous infrastructure decides the outcome.",
  },
  {
    n: "2009",
    title: "Tactile interface for blind chemistry students",
    body: "A haptic periodic table allowing visually impaired students to feel the structure of matter. Built for one student. Eventually used by many.",
  },
  {
    n: "2010",
    title: "Solar-thermal cooking module",
    body: "A modular solar cooker for rural kitchens — an early lesson in why energy access is a materials problem before it is a power problem.",
  },
  {
    n: "2012",
    title: "Low-cost prosthetic hand",
    body: "A mechanically actuated prosthetic prototype designed for sub-thousand-rupee manufacturing — dignity, engineered into the bill of materials.",
  },
];

function EarlyWorksPage() {
  return (
    <CinematicPageShell
      eyebrow="Early Works · Origin Archive"
      title={<>Where the inventor<br className="hidden md:inline" /> began.</>}
      lead="A small catalogue of prototypes from the workshop years — the inventions that taught me everything I now know about deep-tech, dignity, and the discipline of building for one specific person."
      backdrop={backdrop}
      overlay={0.74}
    >
      <EditorialSection number="00 · Note" heading="On origin inventions.">
        <p>
          None of these were built for a market. All of them, eventually,
          found one. They are kept here in their original form — unrefined,
          undesigned, and instructive.
        </p>
      </EditorialSection>

      <EditorialList items={earlyInventions} />

      <EditorialSection number="06 · Continuity" heading="A through-line, in retrospect.">
        <p>
          Each early invention had the same shape: an unmet human need, a
          material constraint that nobody else found interesting, and a
          weekend in a borrowed workshop. The companies built later are the
          same instinct, with a longer fuse.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
