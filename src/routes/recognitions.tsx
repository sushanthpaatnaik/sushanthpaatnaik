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
      { title: "Recognitions — Six Presidential Awards · TED · MIT · NASA" },
      {
        name: "description",
        content:
          "Six Indian Presidential awards, MIT TR-35, TED-India, NASA, NIF-India IGNITE, MIT Fab-10/11, Golden Book of World Records — twenty-seven honors of record.",
      },
      { property: "og:title", content: "Recognitions — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "A ledger of twenty-seven honors of record across research, deep-tech and public speaking.",
      },
      { property: "og:url", content: "/recognitions" },
    ],
    links: [{ rel: "canonical", href: "/recognitions" }],
  }),
});

const milestones = [
  {
    n: "2008–13",
    title: "Six-time Indian Presidential awardee",
    body: "Honoured six times by three sitting Presidents of India — Dr. A.P.J. Abdul Kalam, Smt. Pratibha Patil and Shri Pranab Mukherjee — for sustained contribution to indigenous deep-tech and assistive innovation.",
  },
  {
    n: "2013–14",
    title: "MIT Fab-10 & Fab-11 Awardee",
    body: "Selected at the MIT Fab-10 (Barcelona) and Fab-11 international conferences for original prototypes built end-to-end in personal fabrication labs.",
  },
  {
    n: "2012",
    title: "TED-India Speaker",
    body: "Invited to TED-India as one of the youngest speakers ever featured — on sustainable graphene and the long arc from empathy to engineering.",
  },
  {
    n: "2010",
    title: "MIT TR-35 Awardee",
    body: "Recognised by MIT Technology Review among the world's top young innovators for work on sustainable materials and assistive technology.",
  },
  {
    n: "2011",
    title: "NASA Awardee",
    body: "International recognition at NASA Kennedy Space Center — including a research visit to the Mobile Quarantine Facility — for breakthrough engineering in human–machine interfaces.",
  },
  {
    n: "2010",
    title: "Intel IRIS Awardee",
    body: "Won the Intel IRIS National Science Fair for the breath-operated wheelchair — the school-bench prototype that opened a fifteen-year practice in deep-tech.",
  },
];

const ledger = [
  "President of India Award by Dr. APJ Abdul Kalam, NIF · 2008",
  "35th Jawaharlal Nehru National Science Exhibition Award, NCERT · 2008",
  "CBSE National Science Exhibition Award · 2008",
  "Institute of Physics Exhibition Award · 2008",
  "President of India Award by Smt. Pratibha Devisingh Patil, NIF · 2009",
  "President of India Award by Dr. APJ Abdul Kalam, NIF · 2009",
  "KVPY Fellow · 2009",
  "NCSC Award · 2009",
  "TR-35 Award, MIT Technology Review · 2010",
  "INK Fellow · 2010",
  "Intel IRIS Best Popular Invention Award · 2010",
  "NASA Award · 2011",
  "DLF–Pramerica Spirit of Community Award · 2011",
  "Eureka-11, IIT-Bombay Business Plan Contest · 2011",
  "Golden Book of World Record Holder · 2012",
  "TED-India Speaker · 2012",
  "IDEAS-12, IIT-Kanpur Business Plan Contest · 2012",
  "Innovio-12, KIIT Business Plan Contest · 2012",
  "Judge at SELL-X Exodia, IIT-Mandi · 2012",
  "President of India Award by Shri Pranab Mukherjee, NIF · 2013",
  "Under-35 CEO Award by Yinka Brand · 2014",
  "MIT Fab-10 & Fab-11 Awardee · 2013–14",
  "ICAI Abu Dhabi Speaker · 2013",
  "STPI-Chunauti Winner · 2021",
  "ELECRAMA Winner · 2024",
  "Silicon Valley Speaker · 2024",
  "CEO Club Speaker · 2025",
];

function RecognitionsPage() {
  return (
    <CinematicPageShell
      eyebrow="Recognitions · Twenty-Seven Honors of Record"
      title={<>A life of recognised<br className="hidden md:inline" /> innovation.</>}
      lead="From six Indian Presidential Awards to NASA, MIT TR-35 and global stages — a roster of honors spanning research, deep-tech and public speaking, with 60+ keynotes since 2010."
      backdrop={backdrop}
      overlay={0.74}
    >
      <EditorialList items={milestones} />

      <EditorialSection number="07 · Ledger" heading="Achievement milestones · 27 of record.">
        <p>
          The complete register, in chronological order — the public-record
          ledger that the cinematic timeline above sits on top of.
        </p>
        <ul className="not-prose mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {ledger.map((line) => (
            <li
              key={line}
              className="flex gap-3 border-t border-foreground/[0.06] pt-3 text-[13px] leading-relaxed text-foreground/70"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-primary/70 mt-1">
                ◦
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection number="08 · Posture" heading="Recognition is a lagging indicator.">
        <p>
          The catalogue is a record, not a destination. By the time an award
          arrives the work it celebrates is already behind. The next prototype —
          the one that doesn't yet exist — is where the real work continues.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
