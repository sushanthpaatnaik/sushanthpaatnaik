import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-02-recognition.jpg";

export const Route = createFileRoute("/recognitions")({
  component: RecognitionsPage,
  head: () => ({
    meta: [
      { title: "Recognitions — Six-Time Presidential Awardee, TED, MIT TR" },
      {
        name: "description",
        content:
          "Awards, publications, and institutional validation — six Indian Presidential awards, NIF-India IGNITE, TED-India, MIT Technology Review and more.",
      },
      { property: "og:title", content: "Recognitions — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Six Indian Presidential awards, NIF-India IGNITE, TED-India, and editorial coverage across leading publications.",
      },
      { property: "og:url", content: "/recognitions" },
    ],
    links: [{ rel: "canonical", href: "/recognitions" }],
  }),
});

const awards = [
  {
    n: "2008–2013",
    title: "Six-time Indian Presidential awardee",
    body: "Awarded by successive Presidents of India for inventions in assistive technology, materials, and industrial systems — one of the youngest recipients on record.",
  },
  {
    n: "NIF-India",
    title: "IGNITE awardee · National Innovation Foundation",
    body: "Recognised by NIF-India under the IGNITE programme for original invention at a school-age stage.",
  },
  {
    n: "TED-India",
    title: "One of the youngest TED-India speakers",
    body: "Invited to address TED-India on engineering, dignity, and the discipline of inventing for one specific person at a time.",
  },
];

const press = [
  {
    n: "MIT Technology Review",
    title: "Featured · Advanced materials & invention",
    body: "Editorial coverage of graphene work and the venture architecture behind it.",
  },
  {
    n: "India Today",
    title: "Profiled · Inventor & founder",
    body: "Long-form profile on the journey from a borrowed workshop to a deep-tech operating group.",
  },
  {
    n: "Times of India",
    title: "Reported · Awards & invention",
    body: "Recurring national coverage of Presidential recognitions and downstream work.",
  },
  {
    n: "Business Standard",
    title: "Featured · Deep-tech commercialization",
    body: "Reporting on the commercialization architecture spanning materials, AI, and capital.",
  },
  {
    n: "Global Indian",
    title: "Profiled · India to world",
    body: "Editorial on Indian invention reaching global industrial deployment.",
  },
];

function RecognitionsPage() {
  return (
    <CinematicPageShell
      eyebrow="Recognitions · Institutional Validation"
      title={<>Awarded early.<br className="hidden md:inline" /> Responsible forever.</>}
      lead="Recognition is a lagging indicator. The catalogue below is a record, not a destination — the next prototype is where the real work continues."
      backdrop={backdrop}
      overlay={0.74}
    >
      <EditorialSection number="01 · Honours" heading="Presidential & institutional.">
        <p>
          Six awards from the office of the President of India between 2008
          and 2013 — for inventions ranging from assistive devices to
          materials and industrial systems. Each award was, in retrospect, a
          quiet contract: keep building.
        </p>
      </EditorialSection>

      <EditorialList items={awards} />

      <EditorialSection number="02 · Press" heading="In the editorial archive.">
        <p>
          Long-form coverage across global and Indian editorial publications —
          the public footprint of work that has historically preferred the
          workshop to the stage.
        </p>
      </EditorialSection>

      <EditorialList items={press} />
    </CinematicPageShell>
  );
}
