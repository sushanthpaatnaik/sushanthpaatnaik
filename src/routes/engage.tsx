import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/story-06-india.webp";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";

const description =
  "A single, selective desk for industrial collaboration, deep-tech research, venture and strategic advisory, speaking, and global partnerships across the operating group.";

export const Route = createFileRoute("/engage")({
  component: EngagePage,
  head: () => ({
    meta: [
      {
        title:
          "Engage — Collaboration, Advisory, Research & Speaking · Sushanth Paatnaik",
      },
      { name: "description", content: description },
      { property: "og:title", content: "Engage — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Selective collaboration across industry, research, ventures, speaking, and global partnerships. Invitation-based, mandate-led.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/engage" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/engage" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ name: "Engage — Sushanth Paatnaik", description, path: "/engage" }),
      ),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Engage", path: "/engage" }])),
    ],
  }),
});

/* ── Five engagement categories — the single dossier of how the desk
   opens. Merged from the former Services and Engage pages. */
type Lane = {
  n: string;
  category: string;
  title: string;
  body: string;
  surfaces: string[];
  fit: string;
  horizon: string;
};

const lanes: Lane[] = [
  {
    n: "01",
    category: "Industrial Collaboration",
    title: "Materials, infrastructure, manufacturing systems.",
    body: "Co-development with incumbents and operators integrating graphene, advanced coatings, and nano-additives into existing product lines and industrial infrastructure — without re-engineering supply chains.",
    surfaces: [
      "Graphene & advanced materials",
      "Industrial coatings",
      "Infrastructure systems",
      "Manufacturing integration",
    ],
    fit: "Manufacturers · Materials buyers · Operators",
    horizon: "12 – 36 months",
  },
  {
    n: "02",
    category: "Research & Deep-Tech",
    title: "R&D direction, applied science, lab collaboration.",
    body: "Embedded research direction and applied-science collaboration with universities, national labs, and corporate R&D groups working on materials, energy storage, water systems, and climate infrastructure — from problem framing to lab-scale validation and prototyping.",
    surfaces: [
      "Embedded R&D direction",
      "Prototyping & lab validation",
      "Joint research programmes",
      "Patent & IP architecture",
    ],
    fit: "Universities · National labs · Corporate R&D",
    horizon: "24 – 60 months",
  },
  {
    n: "03",
    category: "Venture & Strategic Advisory",
    title: "Commercialization, innovation systems, venture architecture.",
    body: "Founder-to-founder advisory, selective board seats, and capital co-architecture for deep-tech ventures at the materials, climate, and industrial interface — and multi-horizon innovation strategy for conglomerates and sovereign bodies moving from invention pipelines to industrial outcome.",
    surfaces: [
      "Deep-tech venture advisory",
      "Innovation strategy for conglomerates & sovereign bodies",
      "Capital co-architecture · sovereign, family-office, strategic LPs",
      "Commercialization · IP, JV design, industrial partner matching",
    ],
    fit: "Founders · Operators · Boards · Strategic LPs",
    horizon: "By mandate · Multi-year vehicles",
  },
  {
    n: "04",
    category: "Speaking & Thought Leadership",
    title: "Keynotes, institutional stages, editorial voice.",
    body: "Keynotes, long-form interviews, panels, and stage conversations on invention, deep-tech, the carbon century, and India's industrial trajectory — for conferences, ministries, publications, and institutional convenings.",
    surfaces: [
      "Conference keynotes",
      "Institutional & ministry talks",
      "Panels & moderated dialogues",
      "Editorial & long-form interviews",
    ],
    fit: "Conferences · Institutions · Publications · Studios",
    horizon: "Quarterly · By invitation",
  },
  {
    n: "05",
    category: "Global Partnerships",
    title: "Academia, climate systems, cross-border collaboration.",
    body: "Cross-border partnerships with academic institutions, climate organisations, and industrial transition programmes — coordinating frontier materials and deep-tech capacity across India and the international ecosystem.",
    surfaces: [
      "Academic & research consortia",
      "Climate systems & industrial transition",
      "Bilateral & cross-border programmes",
      "Standards, policy, and ecosystem-building",
    ],
    fit: "Academia · Climate bodies · Sovereign · Multilateral",
    horizon: "Multi-year",
  },
];

function AccessStrip() {
  return (
    <StatsStrip
      className="mt-4"
      items={[
        { v: "05", l: "Engagement categories" },
        { v: "01", l: "Inbox · personally read" },
        { v: "48h", l: "Typical reply" },
        { v: "Selective", l: "By fit, not volume" },
      ]}
    />
  );
}

function LanesList() {
  return (
    <ul className="not-prose mt-12 md:mt-16 flex flex-col">
      {lanes.map((l, i) => (
        <motion.li
          key={l.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
          className="group relative grid grid-cols-[auto_1fr] gap-6 md:gap-10 border-t border-foreground/[0.08] py-10 md:py-12 transition-colors duration-700 hover:border-foreground/25"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent/40 transition-all duration-700 group-hover:w-24"
          />
          <div className="pt-1 font-display text-2xl md:text-3xl font-extralight tracking-[-0.02em] text-foreground/30 transition-colors duration-500 group-hover:text-accent/85">
            {l.n}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-accent/80">
              {l.category}
            </p>
            <h3 className="mt-3 font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
              {l.title}
            </h3>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-foreground/72 md:text-base">
              {l.body}
            </p>

            {/* Surfaces — the territories within this category. Restrained
                so the page reads as a dossier, not a catalogue. */}
            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {l.surfaces.map((s) => (
                <li
                  key={s}
                  className="flex items-baseline gap-3 text-[13.5px] leading-[1.55] text-foreground/72"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-px w-3 shrink-0 bg-accent/55"
                  />
                  {s}
                </li>
              ))}
            </ul>

            <dl className="mt-7 grid grid-cols-1 gap-4 border-t border-foreground/[0.06] pt-5 md:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground/55">
                  Fit
                </dt>
                <dd className="mt-1 text-[13px] text-foreground/75">{l.fit}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground/55">
                  Horizon
                </dt>
                <dd className="mt-1 text-[13px] text-foreground/75">{l.horizon}</dd>
              </div>
            </dl>
          </div>
        </motion.li>
      ))}
      <li className="border-t border-foreground/[0.08]" />
    </ul>
  );
}

/* ── Engagement philosophy — sets the institutional posture. */
function PhilosophyBlock() {
  const tenets = [
    {
      n: "i.",
      t: "Selective collaboration",
      b: "A small inbox by design. Engagements are accepted by fit, not volume — so signal can survive and the work can be done properly.",
    },
    {
      n: "ii.",
      t: "Technical seriousness",
      b: "Every conversation begins from the science. No category is entered without the patience to work it from first principles.",
    },
    {
      n: "iii.",
      t: "Long-term impact",
      b: "Horizons are measured in years, not quarters. The collaborations that endure are the ones that change the trajectory of an industry.",
    },
    {
      n: "iv.",
      t: "Systems thinking",
      b: "Materials, capital, policy, and institutions move together. Each engagement is held against the wider ecosystem it sits inside.",
    },
  ];
  return (
    <div className="not-prose mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm hairline md:grid-cols-2" style={{ background: "var(--surface-hairline)" }}>
      {tenets.map((t, i) => (
        <motion.div
          key={t.t}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
          className="bg-[oklch(0.045_0.006_245)]/70 p-6 md:p-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-accent/75">
            {t.n}
          </p>
          {/* h3, not h4: these sit directly under "How the desk thinks about
              collaboration." (h2) and are peers of the page's other h3 groups.
              Level is outline position, not type size — the styling is
              unchanged. */}
          <h3 className="mt-4 font-display text-lg md:text-xl tracking-[-0.015em] text-foreground/95">
            {t.t}
          </h3>
          <p className="mt-3 text-[14px] leading-[1.7] text-foreground/70">
            {t.b}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function CTABlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mt-20 border-y border-foreground/15 py-14 md:py-20"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
        <span className="text-accent/80">Open The Dialogue</span>{" "}
        <span className="hidden md:inline text-muted-foreground/40">
          Invitation-based · By Appointment
        </span>
      </div>

      <p className="mt-10 max-w-2xl font-display text-[18px] md:text-[21px] leading-[1.5] tracking-[-0.015em] text-foreground/80">
        {/* The trailing {" "} is load-bearing. JSX drops whitespace between a
            text node and an element when it spans a newline, so without it the
            two sentences weld into "...material intelligence.When the work is
            right" for anything reading the text stream. `block` separates them
            on screen only, which is CSS, which readers and crawlers ignore. */}
        Building systems for industrial futures and material intelligence.{" "}
        <span className="block mt-3 text-foreground/55 italic text-[15px] md:text-[16px]">
          When the work is right, the desk opens.
        </span>
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr] md:items-end md:gap-16">
        <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.15] tracking-[-0.025em] text-foreground/95">
          {/* Same reason as above — a <br> is a line break, not a word break,
              so it contributes no whitespace to the text stream. */}
          One paragraph on context.{" "}
          <br />
          <em className="not-italic font-display italic text-foreground/65">
            One on why a conversation would change the trajectory.
          </em>
        </h3>

        <div className="flex flex-col items-stretch gap-4 md:items-end">
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-4 border border-foreground/85 bg-foreground/95 px-8 py-5 font-mono text-[10px] uppercase tracking-[0.55em] text-background transition-all duration-700 hover:border-accent hover:bg-accent"
          >
            <span>Begin a Conversation</span>
            <span className="transition-transform duration-700 group-hover:translate-x-1.5">
              —→
            </span>
          </Link>
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Strategic Inquiry"
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/55 transition-colors hover:text-accent"
          >
            Strategic inquiry · write directly &nbsp;—↗
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function EngagePage() {
  return (
    <CinematicPageShell
      eyebrow="Engage · Collaboration · Advisory · Speaking · By Selection"
      title={
        <>
          The doors open<br className="hidden md:inline" /> for the right work.
        </>
      }
      lead="A single, selective desk for collaboration across industry, research, ventures, speaking, and global partnerships. Invitation-based, mandate-led, and run through the operating group — designed to move frontier materials further into the industrial world."
      backdrop={backdrop}
      overlay={0.78}
    >
      <AccessStrip />

      <EditorialSection
        number="01 · Categories"
        heading="Five ways the desk opens."
      >
        <p>
          Each category below is held to the same standard: a real problem, an
          honest horizon, and the patience to build the thing properly. If
          your inquiry doesn't yet fit a category, write anyway — clarity is
          welcome.
        </p>
      </EditorialSection>

      <LanesList />

      <EditorialSection
        number="02 · Philosophy"
        heading="How the desk thinks about collaboration."
      >
        <p>
          The engagement model is small on purpose. Four principles hold the
          work to the same standard across every category.
        </p>
        <PhilosophyBlock />
      </EditorialSection>

      <EditorialSection
        number="03 · Protocol"
        heading="How to open the dialogue."
      >
        <p>
          The fastest route is a short, specific note. One paragraph on what
          you are building or considering, one paragraph on why a conversation
          would change the trajectory.
        </p>
        <p>
          <Link
            to="/contact"
            className="inline-flex min-h-6 items-center text-foreground underline-offset-4 hover:underline"
          >
            Open the inquiry form →
          </Link>
          {" · "}
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Strategic Inquiry"
            className="inline-flex min-h-6 items-center text-foreground underline-offset-4 hover:underline"
          >
            info@sushanthpaatnaik.com
          </a>
          {" · "}
          <a
            href="https://www.linkedin.com/in/sushanthpaatnaik/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-6 items-center text-foreground underline-offset-4 hover:underline"
          >
            LinkedIn ↗
          </a>
          {" · "}direct, read, and triaged personally.
        </p>
      </EditorialSection>

      <CTABlock />
    </CinematicPageShell>
  );
}
