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
      { title: "In His Words — Essays by Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "An editorial archive of long-form notes by Sushanth Paatnaik on engineering with empathy, graphene and the carbon century, and the discipline of staying a beginner.",
      },
      { property: "og:title", content: "In His Words — Essays" },
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
  const [lead, ...rest] = essays;

  return (
    <div className="relative min-h-screen bg-background text-foreground noise overflow-x-clip">
      <AtmosphericWash />

      <Nav />

      <main className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 pt-36 md:pt-44 pb-24 md:pb-32">
        {/* Masthead */}
        <header className="border-b border-foreground/[0.08] pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/55"
          >
            <span className="text-primary/80">In His Words · Vol. 01</span>
            <span>Editorial Archive · MMXXVI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.12, ease: [0.19, 1, 0.22, 1] }}
            className="mt-10 font-display text-[clamp(2.6rem,8vw,5rem)] leading-[0.98] tracking-[-0.04em] text-gradient"
          >
            Notes from <em className="not-italic font-display italic text-foreground/85">the workshop.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.28, ease: [0.19, 1, 0.22, 1] }}
            className="mt-8 max-w-xl text-[15px] leading-[1.7] text-foreground/70 md:text-base"
          >
            Occasional dispatches on deep-tech, graphene, and the quiet
            discipline of inventing for one specific person at a time. Filed in
            the order they were written; read in the order you wish.
          </motion.p>
        </header>

        {/* Lead essay — broadsheet feature treatment */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="mt-16 md:mt-24"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80">
            Lead Essay · Featured
          </p>
          <Link
            to="/essays/$slug"
            params={{ slug: lead.slug }}
            className="group mt-6 block"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
              Essay {lead.number} · {lead.date} · {lead.readTime}
            </p>
            <h2 className="mt-5 font-display text-3xl md:text-5xl leading-[1.02] tracking-[-0.03em] text-foreground/95 transition-colors duration-700 group-hover:text-gradient">
              {lead.title}
            </h2>
            <blockquote className="mt-8 border-l border-accent/40 pl-6 md:pl-8">
              <p className="font-display italic text-xl md:text-2xl leading-[1.45] tracking-[-0.005em] text-foreground/85">
                “{lead.pull}”
              </p>
            </blockquote>
            <p className="mt-7 max-w-xl text-[15px] leading-[1.75] text-foreground/65 md:text-base">
              {lead.description}
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/55 transition-colors duration-500 group-hover:text-accent/90">
              Read the essay →
            </p>
          </Link>
        </motion.section>

        {/* Archive list */}
        <section className="mt-24 md:mt-32">
          <div className="flex items-baseline justify-between border-t border-foreground/[0.08] pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
              The Archive · {String(rest.length).padStart(2, "0")} Entries
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40">
              Chronological
            </p>
          </div>

          <ol className="mt-12 md:mt-16 flex flex-col">
            {rest.map((essay, i) => (
              <motion.li
                key={essay.slug}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.08,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                <Link
                  to="/essays/$slug"
                  params={{ slug: essay.slug }}
                  className="group grid grid-cols-[auto_1fr] gap-6 md:gap-10 border-t border-foreground/[0.08] py-10 md:py-12 transition-colors duration-700 hover:border-foreground/25"
                >
                  <div className="pt-1 font-display text-3xl md:text-4xl font-extralight tracking-[-0.02em] text-foreground/30 transition-colors duration-500 group-hover:text-accent/80">
                    {essay.number}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
                      {essay.date} · {essay.readTime}
                    </p>
                    <h3 className="mt-4 font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/90 transition-colors duration-500 group-hover:text-gradient">
                      {essay.title}
                    </h3>
                    <p className="mt-5 font-display italic text-[15px] md:text-[17px] leading-[1.55] text-foreground/75">
                      “{essay.pull}”
                    </p>
                    <p className="mt-4 max-w-xl text-[14px] leading-[1.7] text-foreground/60">
                      {essay.description}
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
            <li className="border-t border-foreground/[0.08]" />
          </ol>
        </section>

        {/* Colophon */}
        <footer className="mt-24 border-t border-foreground/[0.08] pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45">
            <span>Set in Display Serif &amp; Mono</span>
            <a
              href="mailto:info@sushanthpaatnaik.com?subject=Subscribe"
              className="hover:text-foreground/80 underline-offset-4 hover:underline"
            >
              Subscribe to dispatches →
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
