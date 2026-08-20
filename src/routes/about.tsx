import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import FounderPortrait from "@/components/scene/FounderPortrait";
import { HeroVideo } from "@/components/scene/Product3DView";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-about-graphite.webp";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";

const description =
  "The philosophy, journey, and mission of Sushanth Paatnaik — inventor and six-time Indian Presidential awardee building from India.";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Sushanth Paatnaik · Inventor & Deep-Tech Founder" },
      { name: "description", content: description },
      { property: "og:title", content: "About — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Inventor, founder, and six-time Indian Presidential awardee. The philosophy and journey behind the work.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/about" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/about" }],
    scripts: [
      ldJsonScript(webPageSchema({ name: "About — Sushanth Paatnaik", description, path: "/about" })),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])),
    ],
  }),
});

const dossierStats = [
  { v: "27", l: "Recognitions of record · National + International" },
  { v: "18+", l: "Featured by news & media outlets" },
  { v: "2", l: "Academic degrees · IISER & OCT, Bhopal" },
  { v: "TED", l: "Global platform · among the youngest at the time" },
];

/* ── Manifesto pull-quote ── */
function ManifestoBlock({
  label,
  lines,
}: {
  label: string;
  lines: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose my-24 md:my-32 flex flex-col items-center text-center"
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-foreground/[0.08]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/40">
          {label}
        </span>
        <span className="h-px w-6 bg-foreground/[0.08]" />
      </div>
      <div className="mt-8 space-y-3 md:space-y-4">
        {lines.map((line) => (
          <p
            key={line}
            className="font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-[1.25] tracking-[-0.02em] text-foreground/85"
          >
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Narrative passage — wide prose with indent option ── */
function NarrativePassage({
  children,
  indent = false,
}: {
  children: React.ReactNode;
  indent?: boolean;
}) {
  return (
    <div
      className={`text-[15px] md:text-base leading-[1.72] text-foreground/65 ${
        indent ? "md:ml-[8%] md:max-w-[84%]" : ""
      }`}
    >
      {children}
    </div>
  );
}

function AboutPage() {
  return (
    <CinematicPageShell
      eyebrow="About · Founder"
      title={<>An inventor, quietly building<br className="hidden md:inline" /> industrial futures.</>}
      lead="Born in Bhubaneswar, Odisha. The work began in a borrowed workshop at fourteen — and has not really paused since."
      backdrop={backdrop}
      overlay={0.82}
    >
      {/* ── Identity film ──
          Its own 16/9 frame rather than the portrait plate below. The plate is
          aspect-[4/5] on mobile through aspect-[4/4.6] at md, so object-cover
          on a 16:9 source would keep only 42-49% of the film's width — and the
          title cards sit at the left and right edges, so they would be the
          first thing lost. Content column is max-w-4xl (896px), which is 1792
          device px at DPR 2, so the source's native 1920x1080 covers it. */}
      <motion.figure
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
        className="not-prose relative mx-auto mt-12 md:mt-16"
      >
        {/* Dark island for the same reason the portrait plate is one: the film
            is graded to a multiply pass and a vignette that reaches
            oklch(0.015) at the corners, so the frame is dark whatever the
            theme. On paper --surface-sunken made the ground behind it — the
            poster frame, and whatever shows while it buffers — near-white,
            which flashed a white rectangle where a black one was about to
            appear. HeroVideo's own controls read this too, and they sit on
            the film, not on the page. */}
        <div className="theme-dark-island group relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-sunken)]">
          {/* Graded to the site's palette. Ungraded, the film's frames average
              a luminance of 70-83 against 38 for the founder portrait's source
              — and the portrait then takes brightness(0.9) and a multiply
              gradient on top, so the film read as the one bright object on a
              graphite page. Held at brightness(0.82) rather than lower because
              the burnt-in title cards have to stay legible; 0.74 flattened
              them. Every other visual on the site carries a grade like this —
              the portrait, and the /innovations application videos. */}
          <HeroVideo
            src="/videos/identity-film.mp4"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter:
                "grayscale(0.15) contrast(1.06) saturate(0.78) brightness(0.82)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.05 0.01 260 / 0.34) 0%, oklch(0.04 0.005 260 / 0.16) 45%, oklch(0.02 0 0 / 0.48) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 46%, transparent 52%, oklch(0.02 0.006 245 / 0.38) 88%, oklch(0.015 0.006 245 / 0.7) 100%)",
            }}
          />
        </div>
        <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/55">
          {/* Flex drops a whitespace-only text node from layout but keeps it
              in textContent, so this space costs nothing on screen and stops
              the caption extracting as "Identity filmInventor · Deep-tech
              founder". */}
          <span>Identity film</span>{" "}
          <span>Inventor · Deep-tech founder</span>
        </figcaption>
      </motion.figure>

      {/* ── Founder dossier — premium narrative block ──
          Sits between the film and the portrait rather than after both. Two
          set-pieces stacked put a 160px void between them at 1440 — against a
          56px section rhythm — and stepped the column through 896 → 520 → 640
          in three consecutive blocks. Text here tapers 896 → 640 → 520 and
          gives the portrait the page's personal narrative to introduce. */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
        className="not-prose mx-auto mt-16 md:mt-24 max-w-[640px]"
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-accent/45" />
          <span className="font-mono text-[10px] uppercase tracking-[0.55em] text-accent/80">
            02 — Founder
          </span>
        </div>

        <div className="mt-10 space-y-3 md:space-y-4">
          {[
            "Industrial systems builder.",
            "Deep-tech founder.",
            "Materials strategist.",
            "Building from India for the world.",
          ].map((line) => (
            <p
              key={line}
              className="font-display text-[clamp(1.5rem,3.4vw,2.2rem)] leading-[1.18] tracking-[-0.025em] text-foreground/90"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="mt-14 h-px w-12 bg-foreground/20" />

        <p className="mt-10 text-[16px] md:text-[17px] leading-[1.85] text-foreground/70">
          Fourteen years inside the workshop have taught one lesson without
          exception: frontier science only matters when it reaches the
          industrial world. The brief is not a paper, not a prototype, not even
          a product — it is the discipline of carrying invention through capital,
          through manufacturing, and through the long quiet years before scale.
        </p>

        <p className="mt-7 font-display italic text-[18px] md:text-[20px] leading-[1.55] tracking-[-0.005em] text-foreground/80">
          The philosophy is simple. Engineer matter. Engineer capital. Engineer
          scale. Hold all three in one hand long enough for the work to
          outlive the inventor.
        </p>

        <p className="mt-7 text-[15px] md:text-[16px] leading-[1.8] text-foreground/60">
          The direction is narrower still — graphene and advanced materials,
          patient industrial capital, and a vertically integrated stack
          designed to make Indian deep-tech globally inevitable in the carbon
          century ahead.
        </p>
      </motion.section>

      {/* ── Founder plate ──
          my-20 md:my-24 rather than the component default my-28 md:my-40: the
          default was tuned for a plate the dossier was pulled up into with a
          negative margin, and standing alone it opened a gap ~3x the 56px
          section rhythm on either side. */}
      <FounderPortrait
        variant="editorial"
        plate
        margin="my-20 md:my-24"
        caption="Inventor, deep-tech founder, and six-time Indian Presidential awardee."
        meta="Portrait · Bhubaneswar, India"
      />

      {/* ── Origin ── */}
      <EditorialSection number="01 · Origin" heading="A workshop, a wheelchair, and a question.">
        <NarrativePassage indent>
          <p>
            At sixteen, in a workshop borrowed for a weekend, I built a
            breath-powered wheelchair for a man with locked-in syndrome who could
            no longer ask for water. That afternoon rewrote what engineering
            meant to me: not optimisation, but agency. Performance is the means.
            Agency is the brief.
          </p>
          <p className="mt-5">
            Every venture since has begun with the same question — who is this
            for, and what does dignity look like for them at scale?
          </p>
        </NarrativePassage>
      </EditorialSection>

      {/* ── Academia ── */}
      <EditorialSection number="02 · Academia" heading="IISER Bhopal · OCT Bhopal.">
        <NarrativePassage>
          <p>
            <span className="text-foreground/90">BSc.</span> from{" "}
            <span className="text-foreground/90">IISER Bhopal</span>, admitted
            under the <span className="text-foreground/90">KVPY-SP</span>{" "}
            scholarship — the foundation in chemistry, physics, and the
            discipline of asking questions matter cannot easily answer.
          </p>
          <p className="mt-5">
            <span className="text-foreground/90">B.E.</span> in ETE from{" "}
            <span className="text-foreground/90">OCT, Bhopal</span>, under the
            Special Achiever category — a quiet conviction that an inventor who
            cannot teach has not really finished the invention.
          </p>
        </NarrativePassage>
      </EditorialSection>

      {/* ── Manifesto interlude ── */}
      <ManifestoBlock
        label="03 — Philosophy"
        lines={[
          "Engineer matter.",
          "Engineer capital.",
          "Engineer scale.",
        ]}
      />

      {/* ── Philosophy body ── */}
      <EditorialSection number="" heading="">
        <NarrativePassage indent>
          <p>
            Frontier science only matters when it reaches the industrial world.
            That requires three disciplines held together: invention, capital
            architecture, and operating systems. I have spent the last fourteen
            years learning to hold all three in one hand.
          </p>
          <p className="mt-5">
            Recognition is a lagging indicator. The real measure is whether the
            next prototype shipped, whether the next venture is solvent, and
            whether the work eventually outlives the inventor.
          </p>
        </NarrativePassage>
      </EditorialSection>

      {/* ── Dossier stats ── */}
      <div className="mt-20 md:mt-28">
        <StatsStrip
          eyebrow="04 · Dossier"
          items={dossierStats}
        />
      </div>

      {/* ── Mission ── */}
      <EditorialSection number="05 · Mission" heading="Built in India. Designed for the world.">
        <NarrativePassage indent>
          <p>
            India has the talent, the demand, and the urgency to lead the carbon
            century. What remains is patience — the institutional patience to
            translate Indian invention into global industrial deployment.
          </p>
          <p className="mt-5">
            My ventures, taken together, are one answer to that question: a
            vertically integrated stack from atom-scale research to capital and
            commercialization, designed to make Indian deep-tech globally
            inevitable.
          </p>
        </NarrativePassage>
      </EditorialSection>

      {/* ── Evolution ── */}
      <EditorialSection number="06 · Evolution" heading="From inventor to ecosystem.">
        <NarrativePassage>
          <p>
            The first decade was about inventions — ten-plus working prototypes
            shipped from a borrowed workshop. The second is about systems —
            companies, capital, and the talent that compounds across them. The
            third, I suspect, will be about handing the work to the next
            generation of Indian builders who never had to ask permission.
          </p>
        </NarrativePassage>
      </EditorialSection>

      {/* ── Closing manifesto ── */}
      <ManifestoBlock
        label=""
        lines={[
          "The work continues.",
        ]}
      />

      {/* ── Page-ending CTA ── */}
      <div className="not-prose mt-24 mb-4 flex flex-col items-center gap-10 border-t border-foreground/[0.06] pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/40">Continue</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <Link
            to="/early-works"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[var(--surface-raised)] border border-foreground/[0.10] rounded-sm transition-all duration-700 hover:border-foreground/25 hover:bg-[var(--surface-high)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
              style={{ background: "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--foreground) 3%, transparent) 0%, transparent 55%)" }}
            />
            <span className="relative font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/75 group-hover:text-foreground/90 transition-colors duration-700">
              View the Origin Story
            </span>
            <span className="relative font-mono text-[10px] text-foreground/40 group-hover:text-foreground/60 transition-colors duration-700">→</span>
          </Link>
          <Link
            to="/innovations"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 border border-transparent rounded-sm transition-all duration-700 hover:border-foreground/[0.08] hover:bg-[var(--surface-level)]/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/50 group-hover:text-foreground/75 transition-colors duration-700">
              View Current Innovations
            </span>
            <span className="font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-700">→</span>
          </Link>
        </motion.div>
      </div>
    </CinematicPageShell>
  );
}
