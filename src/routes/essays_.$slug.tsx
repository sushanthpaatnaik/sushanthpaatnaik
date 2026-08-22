import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Nav from "@/components/scene/Nav";
import { AtmosphericWash } from "@/components/scene/cinematic";
import { essays } from "./essays";

type EssaySection = { heading?: string; paragraphs: string[]; bullets?: string[] };

interface EssayContent {
  slug: string;
  number: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  sections: EssaySection[];
}

const essayBodies: Record<string, EssayContent> = {
  "engineering-with-empathy": {
    slug: "engineering-with-empathy",
    number: "01",
    date: "October 2024",
    readTime: "4 min read",
    title: "On engineering with empathy",
    description:
      "The most important specification on any drawing I make is the human being it is meant for.",
    sections: [
      {
        heading: "A man asking for water",
        paragraphs: [
          "I learned the lesson at fourteen, watching a man with locked-in syndrome try to ask for water. He could move two muscles: his eyebrows and his diaphragm. The room was full of caring people who could not hear him.",
          "The wheelchair I built him wasn't elegant. It was a breath-pressure sensor wired to a relay, taped to a frame that I welded badly in a workshop borrowed for the weekend. But for the first time in years, he could move himself toward the glass.",
          "That afternoon rewrote what engineering meant to me. Until then, I had thought it was the discipline of optimisation — getting more performance out of less material, less power, less time. After that afternoon, I understood it as the discipline of agency. Performance is the means; agency is the brief.",
        ],
      },
      {
        heading: "Why this still organises my work",
        paragraphs: [
          "Every venture I have built since has begun with the same question: who is this for, and what does dignity feel like for them?",
          "In materials science, that question becomes: which sectors are still using carbon-intensive composites because nothing better has scaled? In energy, it becomes: which communities are still spending nine percent of their income on cooking fuel because the grid hasn't reached them? In assistive technology, it becomes the question I started with — and still, twenty years later, the one I am proudest to answer well.",
          "The deep-tech world likes to romanticise the science. The science is necessary. It is not, by itself, the work.",
        ],
      },
      {
        heading: "The discipline of building for one person",
        paragraphs: [
          "There is a strange honesty that comes from building for one specific person. You cannot hide behind market segments or addressable opportunities. The prototype either gives them what they could not have before, or it does not.",
          "That clarity is, I think, why most of the things I have built that ended up mattering started as one-offs. The breath wheelchair. The off-grid water purifier. The tactile interface for a blind chemistry student. None of them were built for a market. All of them, eventually, found one.",
          "If there is a single rule I would give a young innovator, it is this: find one person whose life would change if your idea worked, and build the first version for them. The market, when it arrives, will arrive carrying their fingerprints.",
        ],
      },
    ],
  },
  "graphene-and-the-next-century": {
    slug: "graphene-and-the-next-century",
    number: "02",
    date: "January 2026",
    readTime: "6 min read",
    title: "On graphene and the next century",
    description:
      "India does not need to follow the silicon century. We can lead the carbon one.",
    sections: [
      {
        heading: "A century built on a single sheet",
        paragraphs: [
          "Silicon defined the second half of the twentieth century — not because it was a miraculous element, but because we learned, slowly and expensively, to manufacture it at staggering purity and scale. The trillion-dollar industries that followed were downstream of that learning curve.",
          "Graphene is, today, where silicon was in 1958. The science is settled. The applications are emerging. The manufacturing is not yet routine. Whoever solves the manufacturing — cleanly, at scale, at a price industry can absorb — gets to write the rules of the next industrial vocabulary.",
        ],
      },
      {
        heading: "What graphene unlocks",
        paragraphs: [
          "A single layer of carbon atoms in a hexagonal lattice does, casually, things that the rest of the periodic table struggles with:",
        ],
        bullets: [
          "Energy storage — batteries that charge in minutes, not hours, with cycle lives counted in tens of thousands.",
          "Composites — structures with the strength of steel at a fraction of the weight, opening aviation, automotive and infrastructure to genuinely lower carbon footprints.",
          "Water and air — selective membranes that filter out pathogens, salts and pollutants at energy budgets the desalination industry currently considers science fiction.",
          "Sensors — single-molecule detection sensitive enough to redesign how we think about diagnostics and environmental monitoring.",
        ],
      },
      {
        paragraphs: [
          "None of these is speculative anymore. All of them are bottlenecked by the same constraint: how do you produce kilogram-scale, then ton-scale, then continent-scale graphene without re-creating the carbon problem you set out to solve?",
        ],
      },
      {
        heading: "Why India, and why now",
        paragraphs: [
          "India has the three things this requires. We have the talent — a generation of materials chemists, electrochemists and process engineers trained in our IITs, IISERs and CSIR labs. We have the demand — a domestic market that needs cleaner energy, lighter vehicles, better water and stronger infrastructure simultaneously. And we have the urgency — a climate ledger that does not allow us the slow, polluting industrial path the West took to get rich.",
          "What we now need is the patience. Materials science is a decade-long discipline. Venture capital is an annual one. Bridging that gap — through patient capital, public–private programmes, and founders willing to spend their thirties on a single problem — is the strategic question of this decade.",
        ],
      },
      {
        heading: "A quiet wager",
        paragraphs: [
          "I have spent the last several years, with my co-founders, betting on exactly this gap. We will not be the only ones. The companies and labs that emerge from this period will not look like the silicon giants of the last century — they will look more like steel mills meeting semiconductor fabs meeting biotech. That is, in itself, a very Indian sort of company.",
          "If we get the next ten years right, the second half of this century will rhyme with the second half of the last one — except the master material will be carbon, the centre of gravity will have shifted, and the question of who gets to industrialise without destroying the planet will, for the first time, have a serious answer.",
        ],
      },
    ],
  },
  "staying-a-beginner": {
    slug: "staying-a-beginner",
    number: "03",
    date: "August 2025",
    readTime: "3 min read",
    title: "On staying a beginner",
    description:
      "I have been awarded six times by the President. I still feel most useful in a workshop, holding a screwdriver.",
    sections: [
      {
        heading: "The kindness of awards",
        paragraphs: [
          "Recognitions are kind. They open doors, they invite collaborations, and they let your parents finally explain to their friends what it is, exactly, that you do.",
          "But they are lagging indicators. By the time an award arrives, the work it celebrates is already behind you. The version of you that did it has moved on. If you are not careful, the awards become a quiet substitute for the next prototype — the framed certificate hanging in the place where a soldering iron used to be.",
        ],
      },
      {
        heading: "The next prototype",
        paragraphs: [
          "The work, always, is in the next prototype. The one that doesn't yet exist. The one that will probably fail, then fail again, and finally — on a quiet Tuesday afternoon when no one is filming — do something quietly remarkable.",
          "That is the only honest currency a builder has: the willingness to be a beginner again. To not know how something will turn out. To start with a sketch on a napkin and the suspicion that this might be the one.",
        ],
      },
      {
        heading: "A small daily discipline",
        paragraphs: [
          "I try, in practice, to spend more time being curious than being credentialed. The ratio I aim for is roughly: one hour answering an interview, two hours reading something I don't understand. One day on stage, three days in the workshop. One thank-you for an old project, ten questions about a new one.",
          "I don't always get the ratio right. But it is the only one I trust.",
        ],
      },
    ],
  },
};

export const Route = createFileRoute("/essays_/$slug")({
  loader: ({ params }) => {
    const essay = essayBodies[params.slug];
    if (!essay) throw notFound();
    return { essay };
  },
  head: ({ params, loaderData }) => {
    const e = loaderData?.essay;
    if (!e) {
      return { meta: [{ title: "Essay not found" }] };
    }
    return {
      meta: [
        { title: `${e.title} — Sushanth Paatnaik` },
        { name: "description", content: e.description },
        { property: "og:title", content: e.title },
        { property: "og:description", content: e.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://sushanthpaatnaik.com/essays/${params.slug}` },
        { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
        { property: "article:author", content: "Sushanth Paatnaik" },
        { property: "article:published_time", content: e.date },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: e.title },
        { name: "twitter:description", content: e.description },
        { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      ],
      links: [{ rel: "canonical", href: `https://sushanthpaatnaik.com/essays/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: e.title,
            description: e.description,
            datePublished: e.date,
            author: { "@type": "Person", name: "Sushanth Paatnaik" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">404 · Essay</p>
        <h1 className="mt-4 font-display text-3xl text-foreground/90">Not in the archive.</h1>
        <Link to="/essays" className="mt-8 inline-block text-sm text-foreground/70 underline-offset-4 hover:underline">
          All essays
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="font-display text-2xl text-foreground/90">This essay didn't load.</h1>
        <button onClick={reset} className="mt-6 text-sm text-foreground/70 underline-offset-4 hover:underline">
          Try again
        </button>
      </div>
    </div>
  ),
  component: EssayPage,
});

function EssayPage() {
  const { essay } = Route.useLoaderData() as { essay: EssayContent };
  const totalSections = essay.sections.length;

  return (
    <div className="relative min-h-screen bg-background text-foreground noise overflow-x-clip">
      <AtmosphericWash />

      <Nav />

      <main id="main" className="relative z-10 mx-auto max-w-[40rem] px-6 sm:px-8 pt-40 md:pt-52 pb-28 md:pb-40">
        {/* Folio crumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55"
        >
          <Link to="/essays" className="hover:text-foreground/85 transition-colors">
            ← BLOGS
          </Link>
          <span className="text-muted-foreground/40">
            № {essay.number} · {essay.date} · {essay.readTime}
          </span>
        </motion.div>

        {/* Title block */}
        <header className="mt-24 md:mt-36">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.05, ease: [0.19, 1, 0.22, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent/75"
          >
            Essay № {essay.number}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 font-display text-[clamp(2.4rem,7vw,4.25rem)] leading-[1.0] tracking-[-0.04em] text-foreground/95"
          >
            {essay.title}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.38, ease: [0.19, 1, 0.22, 1] }}
            className="mt-14 h-px w-16 origin-left bg-foreground/20"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.44, ease: [0.19, 1, 0.22, 1] }}
            className="mt-10 font-display italic text-[22px] md:text-[28px] leading-[1.4] tracking-[-0.01em] text-foreground/75"
          >
            {essay.description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="mt-14 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/50"
          >
            By Sushanth Paatnaik
          </motion.p>
        </header>

        {/* Body */}
        <article className="mt-28 md:mt-36 flex flex-col gap-20 md:gap-28">
          {essay.sections.map((section, i) => {
            const sectionNumber = String(i + 1).padStart(2, "0");
            return (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, delay: i * 0.04, ease: [0.19, 1, 0.22, 1] }}
              >
                {section.heading && (
                  <div className="mb-12 flex items-baseline gap-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent/70">
                      {sectionNumber} / {String(totalSections).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-foreground/[0.08]" />
                    <h2 className="font-display italic text-[17px] md:text-[19px] tracking-[-0.005em] text-foreground/80">
                      {section.heading}
                    </h2>
                  </div>
                )}
                {section.paragraphs.map((p, j) => {
                  const isLead = i === 0 && j === 0;
                  return (
                    <p
                      key={j}
                      className={`mb-8 text-[17px] leading-[1.85] text-foreground/80 md:text-[19px] md:leading-[1.8] ${
                        isLead
                          ? "first-letter:font-display first-letter:text-[4.2rem] first-letter:md:text-[5rem] first-letter:font-normal first-letter:leading-[0.85] first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:text-foreground/95"
                          : ""
                      }`}
                    >
                      {p}
                    </p>
                  );
                })}
                {section.bullets && (
                  <ul className="mt-10 flex flex-col gap-6">
                    {section.bullets.map((b, k) => (
                      <li
                        key={k}
                        className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-foreground/[0.06] pt-5 text-[16px] leading-[1.8] text-foreground/75 md:text-[17px]"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/65">
                          {String(k + 1).padStart(2, "0")}
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            );
          })}
        </article>

        {/* End mark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-20 flex items-center justify-center gap-4"
        >
          <span className="h-px w-10 bg-foreground/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/50">
            Fin
          </span>
          <span className="h-px w-10 bg-foreground/15" />
        </motion.div>

        {/* Colophon */}
        <div className="mt-20 border-t border-foreground/[0.08] pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45">
                Filed
              </p>
              <p className="mt-3 font-display italic text-[15px] text-foreground/75">
                Sushanth Paatnaik · Bhubaneswar
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45">
                {essay.date}
              </p>
            </div>
            <Link
              to="/essays"
              className="font-mono text-[11px] uppercase tracking-[0.4em] text-foreground/65 underline-offset-4 hover:text-accent hover:underline"
            >
              Return to the archive →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
