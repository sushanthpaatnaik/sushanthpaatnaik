import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Nav from "@/components/scene/Nav";

interface EssayMeta {
  slug: string;
  number: string;
  date: string;
  readTime: string;
  title: string;
  pull: string;
  description: string;
}

export const essays: EssayMeta[] = [
  {
    slug: "engineering-with-empathy",
    number: "01",
    date: "October 2024",
    readTime: "4 min read",
    title: "On engineering with empathy",
    pull: "The most important specification on any drawing I make is the human being it is meant for.",
    description:
      "Why the wheelchair I built at fourteen taught me everything I now know about deep-tech, dignity, and the discipline of building for someone — not for an audience.",
  },
  {
    slug: "graphene-and-the-next-century",
    number: "02",
    date: "January 2026",
    readTime: "6 min read",
    title: "On graphene and the next century",
    pull: "India does not need to follow the silicon century. We can lead the carbon one.",
    description:
      "A note on why graphene — produced cleanly and at scale — is the most under-priced strategic asset on the table for India this decade.",
  },
  {
    slug: "staying-a-beginner",
    number: "03",
    date: "August 2025",
    readTime: "3 min read",
    title: "On staying a beginner",
    pull: "I have been awarded six times by the President. I still feel most useful in a workshop, holding a screwdriver.",
    description:
      "On recognitions as lagging indicators, and why curiosity is the only honest currency a builder has.",
  },
];

export const Route = createFileRoute("/essays")({
  component: EssaysIndex,
  head: () => ({
    meta: [
      { title: "Essays — Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Long-form notes from Sushanth Paatnaik on engineering with empathy, graphene and the carbon century, and the discipline of staying a beginner.",
      },
      { property: "og:title", content: "Essays — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Editorial notes on deep-tech, graphene, and the discipline of invention — from inventor and founder Sushanth Paatnaik.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/essays" },
    ],
    links: [{ rel: "canonical", href: "/essays" }],
  }),
});

function EssaysIndex() {
  return (
    <div className="relative min-h-screen bg-background text-foreground noise">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 sm:px-6 pt-36 md:pt-44 pb-24 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="text-[10px] uppercase tracking-[0.45em] text-primary/80"
        >
          Essays · Vol. 01
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.3, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em] text-gradient"
        >
          Notes from the workshop.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          Occasional dispatches on deep-tech, graphene, and the quiet discipline of inventing for one specific person at a time.
        </motion.p>

        <ol className="mt-20 md:mt-28 flex flex-col gap-16 md:gap-20">
          {essays.map((essay, i) => (
            <motion.li
              key={essay.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
            >
              <Link
                to="/essays/$slug"
                params={{ slug: essay.slug }}
                className="group block border-t border-foreground/[0.08] pt-8 transition-colors duration-700 hover:border-foreground/25"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
                  {essay.number} · {essay.date} · {essay.readTime}
                </p>
                <h2 className="mt-5 font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/90 transition-colors duration-500 group-hover:text-gradient">
                  {essay.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
                  <span className="text-foreground/90">{essay.pull}</span>{" "}
                  {essay.description}
                </p>
              </Link>
            </motion.li>
          ))}
        </ol>

        <p className="mt-24 text-[10px] font-extralight uppercase tracking-[0.4em] text-muted-foreground/40">
          — More essays in the works ·{" "}
          <a href="mailto:me@sushanthpaatnaik.com?subject=Subscribe" className="underline-offset-4 hover:underline">
            subscribe
          </a>{" "}
          to be notified —
        </p>
      </main>
    </div>
  );
}
