import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-08-scale.jpg";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — R&D Consulting, Materials Advisory & Strategy" },
      {
        name: "description",
        content:
          "Selective service mandates: R&D consulting, graphene & advanced materials advisory, industrial partnerships, innovation strategy, keynotes, venture advisory, and technology commercialization.",
      },
      { property: "og:title", content: "Services — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Where the operating group opens its bench: seven service lanes spanning R&D, materials, industry, strategy, capital, voice, and commercialization.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

const services = [
  {
    n: "01",
    title: "R&D consulting",
    body: "Embedded research direction for industrial R&D groups working on advanced materials, energy storage, water systems, or coatings. From problem framing to lab-scale validation.",
    fit: "Corporate R&D · National labs",
    horizon: "6 – 24 months",
  },
  {
    n: "02",
    title: "Graphene & advanced materials advisory",
    body: "Domain advisory on graphene, 2D materials, nano-additives, and carbon-anchored chemistries — translating frontier science into manufacturable specification.",
    fit: "Materials buyers · Formulators",
    horizon: "Per program",
  },
  {
    n: "03",
    title: "Industrial partnerships",
    body: "Co-development with incumbents seeking to integrate new materials or coatings into existing product lines without re-engineering supply chains.",
    fit: "Manufacturers · Operators",
    horizon: "12 – 36 months",
  },
  {
    n: "04",
    title: "Innovation strategy",
    body: "Multi-horizon innovation architecture for sovereign bodies, ministries, and conglomerates — moving from invention pipelines to industrial outcome.",
    fit: "Conglomerates · Sovereign",
    horizon: "12 – 60 months",
  },
  {
    n: "05",
    title: "Keynotes & speaking",
    body: "Keynotes, long-form interviews, and stage conversations on invention, deep-tech, the carbon century, and India's industrial trajectory. Selective, by mandate.",
    fit: "Conferences · Publications",
    horizon: "Quarterly",
  },
  {
    n: "06",
    title: "Venture advisory",
    body: "Founder-to-founder advisory and selective board seats for deep-tech ventures at the materials / climate / industrial interface.",
    fit: "Founders · Boards · Strategic LPs",
    horizon: "By mandate",
  },
  {
    n: "07",
    title: "Technology commercialization",
    body: "Pathways from patent and prototype to manufactured product — IP architecture, JV design, capital co-architecture, and industrial partner matching.",
    fit: "Universities · Spin-outs · Family-office capital",
    horizon: "Multi-year",
  },
];

function ServicesStrip() {
  return (
    <StatsStrip
      className="mt-4"
      items={[
        { v: "07", l: "Service lanes" },
        { v: "Selective", l: "Engagement model" },
        { v: "48h", l: "Typical reply" },
        { v: "Global", l: "Operating reach" },
      ]}
    />
  );
}

function ServicesList() {
  return (
    <ul className="not-prose mt-12 md:mt-16 flex flex-col">
      {services.map((l, i) => (
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

function ServicesPage() {
  return (
    <CinematicPageShell
      eyebrow="Services · The Operating Bench · By Selection"
      title={
        <>
          Where the bench<br className="hidden md:inline" /> opens to the world.
        </>
      }
      lead="Seven service lanes — research, materials, industry, strategy, voice, capital, and commercialization. Engagements are selective, mandate-led, and run through the operating group."
      backdrop={backdrop}
      overlay={0.74}
    >
      <ServicesStrip />

      <EditorialSection number="01 · Lanes" heading="Seven ways the bench opens.">
        <p>
          Each lane below is held to the same standard: a real problem, a
          clear horizon, and the patience to build the thing properly. For
          higher-order partnerships, capital, or board work, continue to{" "}
          <Link to="/engage" className="text-foreground underline-offset-4 hover:underline">
            Engage →
          </Link>
          .
        </p>
      </EditorialSection>

      <ServicesList />

      <EditorialSection number="02 · Protocol" heading="How to open a mandate.">
        <p>
          Send a short, specific note — one paragraph on what you are
          building or considering, one paragraph on why a conversation would
          change the trajectory.{" "}
          <Link to="/contact" className="text-foreground underline-offset-4 hover:underline">
            Open the inquiry form →
          </Link>
          {" · "}
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Services"
            className="text-foreground underline-offset-4 hover:underline"
          >
            info@sushanthpaatnaik.com
          </a>
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
