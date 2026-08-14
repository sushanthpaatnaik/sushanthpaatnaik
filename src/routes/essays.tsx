import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Nav from "@/components/scene/Nav";
import { AtmosphericWash } from "@/components/scene/cinematic";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";

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
      "Why the wheelchair I built at sixteen taught me about deep-tech, dignity, and building for someone — not an audience.",
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

const description =
  "An editorial archive of long-form notes by Sushanth Paatnaik on engineering, graphene, and the discipline of invention.";

export const Route = createFileRoute("/essays")({
  component: EssaysIndex,
  head: () => ({
    meta: [
      { title: "Essays — Sushanth Paatnaik · Deep-Tech & Invention" },
      { name: "description", content: description },
      { property: "og:title", content: "Essays — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Editorial notes on deep-tech, graphene, and the discipline of invention — from inventor and founder Sushanth Paatnaik.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/essays" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/essays" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ type: "CollectionPage", name: "Essays — Sushanth Paatnaik", description, path: "/essays" }),
      ),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Essays", path: "/essays" }])),
    ],
  }),
});

function EssaysIndex() {
  const [lead, ...rest] = essays;

  return (
    <div className="relative min-h-screen bg-background text-foreground noise overflow-x-clip">
      <AtmosphericWash />

      <Nav />

      <main id="main" className="relative z-10 mx-auto max-w-[44rem] px-6 sm:px-8 pt-40 md:pt-56 pb-32 md:pb-44">
        {/* Folio */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55"
        >
          <span className="text-primary/80">BLOGS</span>
          <span className="hidden sm:inline">Volume I · MMXXVI</span>
          <span>Essays {String(essays.length).padStart(2, "0")}</span>
        </motion.div>

        {/* Masthead */}
        <header className="mt-28 md:mt-40">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent/75"
          >
            Editorial · Long-form
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.18, ease: [0.19, 1, 0.22, 1] }}
            className="mt-10 font-display text-[clamp(3rem,9vw,6rem)] leading-[0.96] tracking-[-0.045em] text-foreground/95"
          >
            Notes from
            <br />
            <em className="not-italic font-display italic text-foreground/70">the workshop.</em>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="mt-16 h-px w-16 origin-left bg-foreground/20"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.46, ease: [0.19, 1, 0.22, 1] }}
            className="mt-10 max-w-[34rem] font-display text-[19px] md:text-[22px] leading-[1.55] tracking-[-0.005em] text-foreground/70"
          >
            Occasional dispatches on deep-tech, graphene, and the quiet
            discipline of inventing for one specific person at a time.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.7 }}
            className="mt-8 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45"
          >
            Filed in the order they were written. Read in the order you wish.
          </motion.p>
        </header>

        {/* Lead essay — cinematic feature */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-40 md:mt-56"
        >
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.5em] text-accent/75">
            <span className="h-px w-8 bg-accent/40" />
            <span>The Lead Essay</span>
          </div>

          <Link
            to="/essays/$slug"
            params={{ slug: lead.slug }}
            className="group mt-12 block"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/55">
              № {lead.number} · {lead.date} · {lead.readTime}
            </p>
            <h2 className="mt-7 font-display text-4xl md:text-[3.5rem] leading-[1.02] tracking-[-0.035em] text-foreground/95 transition-colors duration-700 group-hover:text-foreground">
              {lead.title}
            </h2>

            <figure className="mt-14 md:mt-16">
              <p className="font-display italic text-2xl md:text-[2rem] leading-[1.35] tracking-[-0.012em] text-foreground/85">
                <span aria-hidden className="mr-2 text-accent/60">“</span>
                {lead.pull}
                <span aria-hidden className="ml-1 text-accent/60">”</span>
              </p>
              <figcaption className="mt-7 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/50">
                <span className="h-px w-6 bg-foreground/20" />
                Sushanth Paatnaik
              </figcaption>
            </figure>

            <p className="mt-14 max-w-[34rem] text-[15px] leading-[1.8] text-foreground/60 md:text-[16px]">
              {lead.description}
            </p>

            <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/55 transition-colors duration-500 group-hover:text-accent">
              Read the essay&nbsp;&nbsp;—→
            </p>
          </Link>
        </motion.section>

        {/* Archive register */}
        <section className="mt-44 md:mt-56">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
            <span>The Register</span>
            <span className="text-muted-foreground/40">
              {String(rest.length).padStart(2, "0")} entries · chronological
            </span>
          </div>

          <ol className="mt-14 md:mt-20 flex flex-col">
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
                  className="group grid grid-cols-[3rem_1fr] md:grid-cols-[4.5rem_1fr] gap-8 md:gap-14 border-t border-foreground/[0.08] py-14 md:py-20 transition-colors duration-700 hover:border-foreground/25"
                >
                  <div className="pt-2 font-display text-3xl md:text-[2.75rem] font-extralight tracking-[-0.02em] text-foreground/25 transition-colors duration-500 group-hover:text-accent/75">
                    {essay.number}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/50">
                      {essay.date} · {essay.readTime}
                    </p>
                    <h3 className="mt-5 font-display text-2xl md:text-[2rem] leading-[1.1] tracking-[-0.025em] text-foreground/90 transition-colors duration-500 group-hover:text-foreground">
                      {essay.title}
                    </h3>
                    <p className="mt-7 font-display italic text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.005em] text-foreground/70">
                      “{essay.pull}”
                    </p>
                    <p className="mt-6 max-w-[32rem] text-[14px] leading-[1.75] text-foreground/55">
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
        <footer className="mt-32 md:mt-44">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-foreground/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/45">
              End of Volume I
            </span>
            <span className="h-px w-10 bg-foreground/15" />
          </div>
          <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/40">
            Set in a display serif &amp; mono · Bhubaneswar · MMXXVI
          </p>
        </footer>
      </main>
    </div>
  );
}
