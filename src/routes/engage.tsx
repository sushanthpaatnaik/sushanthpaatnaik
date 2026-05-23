import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/story-06-india.jpg";

export const Route = createFileRoute("/engage")({
  component: EngagePage,
  head: () => ({
    meta: [
      { title: "Engage — Partnerships, Advisory & Strategic Collaboration" },
      {
        name: "description",
        content:
          "Selective engagement protocol for industrial partnerships, capital co-architecture, research collaboration, and advisory with Sushanth Paatnaik and the operating group.",
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
      className="not-prose relative mt-16 overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]/85 p-8 md:p-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 12% 0%, oklch(0.62 0.10 55 / 0.10), transparent 60%), radial-gradient(60% 50% at 100% 100%, oklch(0.42 0.07 240 / 0.10), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/85">
            Open The Line · Selective Access
          </p>
          <h3 className="mt-4 font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
            One paragraph on context. One on why a conversation would change the trajectory.
          </h3>
        </div>
        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-3 rounded-sm bg-foreground/95 px-7 py-4 font-mono text-[10px] uppercase tracking-[0.4em] text-background transition-all duration-500 hover:bg-accent hover:text-background"
          >
            <span>Begin the inquiry</span>
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Engage"
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/55 transition-colors hover:text-foreground/90"
          >
            Or write directly →
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
