import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/story-06-india.webp";

export const Route = createFileRoute("/engage")({
  component: EngagePage,
  head: () => ({
    meta: [
      { title: "Engage — Partnerships, Advisory & Strategic Collaboration" },
      {
        name: "description",
        content:
          "Selective engagement for industrial partnerships, capital co-architecture, research collaboration, and advisory with the operating group.",
      },
      { property: "og:title", content: "Engage — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Strategic collaboration, advisory, partnerships, and capital co-architecture across the deep-tech operating group.",
      },
      { property: "og:url", content: "/engage" },
    ],
    links: [{ rel: "canonical", href: "/engage" }],
  }),
});

const lanes = [
  {
    n: "01",
    title: "Industrial partnerships",
    body: "For incumbents seeking to integrate graphene, advanced coatings, or nano-additives into existing product lines without re-engineering supply chains.",
    fit: "Manufacturers · Materials buyers · Operators",
    horizon: "12 – 36 months",
  },
  {
    n: "02",
    title: "Capital co-architecture",
    body: "For sovereign, family-office, and institutional investors interested in patient capital for deep-tech commercialization at industrial scale.",
    fit: "Sovereign · Family office · Strategic LPs",
    horizon: "Multi-year vehicles",
  },
  {
    n: "03",
    title: "Research collaboration",
    body: "For universities, national labs, and corporate R&D groups working on materials, energy, water, or climate infrastructure.",
    fit: "Labs · Universities · Corporate R&D",
    horizon: "24 – 60 months",
  },
  {
    n: "04",
    title: "Advisory & board seats",
    body: "Selective advisory work at the intersection of advanced materials, deep-tech commercialization, and India-to-world industrial strategy.",
    fit: "Founders · Operators · Boards",
    horizon: "By mandate",
  },
  {
    n: "05",
    title: "Speaking & editorial",
    body: "Keynotes, long-form interviews, and editorial contributions on invention, deep-tech, and the carbon century.",
    fit: "Conferences · Publications · Studios",
    horizon: "Quarterly",
  },
];

function AccessStrip() {
  return (
    <StatsStrip
      className="mt-4"
      items={[
        { v: "05", l: "Engagement lanes" },
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
          viewport={{ once: true, amount: 0.3 }}
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
            <h3 className="font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
              {l.title}
            </h3>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-foreground/70 md:text-base">
              {l.body}
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground/55">
                  Fit
                </dt>
                <dd className="mt-1 text-[13px] text-foreground/75">{l.fit}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground/55">
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
        <span className="text-accent/80">Open The Line</span>
        <span className="hidden md:inline text-muted-foreground/40">
          Selective Access · By Appointment
        </span>
      </div>

      <p className="mt-10 max-w-2xl font-display text-[18px] md:text-[21px] leading-[1.5] tracking-[-0.015em] text-foreground/80">
        Building systems for industrial futures and material intelligence.
        <span className="block mt-3 text-foreground/55 italic text-[15px] md:text-[16px]">
          When the work is right, the desk opens.
        </span>
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr] md:items-end md:gap-16">
        <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.15] tracking-[-0.025em] text-foreground/95">
          One paragraph on context.
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
            <span>Begin the inquiry</span>
            <span className="transition-transform duration-700 group-hover:translate-x-1.5">
              —→
            </span>
          </Link>
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Engage"
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/55 transition-colors hover:text-accent"
          >
            Or write directly &nbsp;—↗
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function EngagePage() {
  return (
    <CinematicPageShell
      eyebrow="Engage · Strategic Collaboration · By Selection"
      title={
        <>
          The doors open<br className="hidden md:inline" /> for the right work.
        </>
      }
      lead="Selective engagement across partnerships, capital, research, and advisory — designed to move frontier materials further into the industrial world. The inbox is small on purpose, so signal can survive."
      backdrop={backdrop}
      overlay={0.74}
    >
      <AccessStrip />

      <EditorialSection number="01 · Lanes" heading="Five ways the desk opens.">
        <p>
          Each lane is held to the same standard: a real problem, an honest
          horizon, and the patience to build the thing properly. If your
          inquiry doesn't yet fit a lane, write anyway — clarity is welcome.
        </p>
      </EditorialSection>

      <LanesList />

      <EditorialSection number="07 · Protocol" heading="How to reach the desk.">
        <p>
          The fastest route is a short, specific note. One paragraph on what
          you are building or considering, one paragraph on why a conversation
          would change the trajectory.
        </p>
        <p>
          <Link to="/contact" className="text-foreground underline-offset-4 hover:underline">
            Open the inquiry form →
          </Link>
          {" · "}
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Engage"
            className="text-foreground underline-offset-4 hover:underline"
          >
            info@sushanthpaatnaik.com
          </a>
          {" · "}
          <a
            href="https://www.linkedin.com/in/sushanthpaatnaik/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline-offset-4 hover:underline"
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
