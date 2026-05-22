import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import ScrollStory from "./ScrollStory";
import VentureConstellation, { type Venture } from "./VentureConstellation";
import type { StoryChapter } from "./StorySection";
import founderPresence from "@/assets/founder-presence.jpg";
import founderLab from "@/assets/founder-lab.jpg";


// 7-chapter cinematic storyline.
// Chapter 01 (Spark) is rendered by HeroSection.
// Chapter 07 (Future) is rendered by the closing CTA section.
// ScrollStory covers chapters 02–06.
const chapters: readonly StoryChapter[] = [
  {
    id: "spark",
    eyebrow: "01 — Spark",
    title: "I build what does not yet exist.",
    body: "Curiosity turned into inventions, patents, companies, and industrial technologies.",
    align: "center",
  },
  {
    id: "recognition",
    eyebrow: "02 — Recognition",
    title: "Awarded early. Responsible forever.",
    body: "A young innovator recognized at the national level, now building technologies with industrial consequence.",
    align: "left",
  },
  {
    id: "carbon-intelligence",
    eyebrow: "03 — Carbon Intelligence",
    title: "Engineering intelligent matter.",
    body: "Graphene, nano-materials, coatings, additives, composites, and AI-assisted material systems.",
    align: "right",
  },
  {
    id: "industrial",
    eyebrow: "04 — Industrial Applications",
    title: "One material platform. Many industries.",
    body: "Solar coatings, batteries, concrete, polymers, fuels, coal moisture reduction, and climate infrastructure.",
    align: "left",
  },
  {
    id: "ventures",
    eyebrow: "05 — Venture Builder",
    title: "I do not only invent. I build companies.",
    body: "Ventures across advanced materials, industrial products, AI, capital, and technology commercialization.",
    align: "right",
  },
  {
    id: "india",
    eyebrow: "06 — India to World",
    title: "Built in India. Designed for the world.",
    body: "Translating Indian invention into global industrial deployment.",
    align: "left",
  },
];

const ventures: Venture[] = [
  { n: "01", title: "Monoatom Labs", body: "Frontier graphene and 2D-material synthesis — the research engine behind every downstream industrial platform." },
  { n: "02", title: "Grafillium", body: "Graphene-enabled advanced materials engineered for solar, batteries, polymers, and industrial-scale deployment." },
  { n: "03", title: "SPI Industries", body: "Operating arm translating advanced materials into production-grade industrial products and supply chains." },
  { n: "04", title: "InThinks · Starunico Capital", body: "AI systems and capital architecture — the commercialization vehicles that carry deep-tech from lab to industry." },
];

const processSteps = [
  { n: "01", t: "Hypothesize", b: "Identify a material-level lever with world-scale consequence." },
  { n: "02", t: "Model", b: "Simulate matter, systems, and economics before they reach deployment." },
  { n: "03", t: "Prototype", b: "Build the lattice, module, and operating pathway into physical form." },
  { n: "04", t: "Deploy", b: "Scale from scientific validity to industrial adoption." },
];

function HeroSection() {
  const { scrollYProgress } = useScroll();
  // Progressive founder reveal: starts deeply hidden, subtly emerges as user scrolls into journey
  const silhouetteOpacity = useTransform(scrollYProgress, [0, 0.04, 0.1], [0.08, 0.18, 0.32]);
  const silhouetteBlur = useTransform(scrollYProgress, [0, 0.1], [18, 10]);
  const silhouetteFilter = useTransform(silhouetteBlur, (b) => `blur(${b}px) grayscale(0.4) contrast(1.05)`);
  const silhouetteScale = useTransform(scrollYProgress, [0, 0.1], [1.04, 1]);

  return (
    <section id="spark" className="relative min-h-[calc(var(--viewport-height)*1.32)] px-6">
      <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center overflow-clip text-center pt-24 pb-12 render-stable">
        {/* Atmospheric founder silhouette — subtle, environmental, behind typography */}
        <motion.div
          aria-hidden
          style={{ opacity: silhouetteOpacity, filter: silhouetteFilter, scale: silhouetteScale }}
          className="pointer-events-none absolute inset-0 z-0 render-stable"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${founderPresence})`,
              backgroundPosition: "center 30%",
              backgroundSize: "auto 95%",
              backgroundRepeat: "no-repeat",
              WebkitMaskImage:
                "radial-gradient(ellipse 42% 58% at 50% 48%, #000 18%, rgba(0,0,0,0.55) 48%, transparent 82%)",
              maskImage:
                "radial-gradient(ellipse 42% 58% at 50% 48%, #000 18%, rgba(0,0,0,0.55) 48%, transparent 82%)",
            }}
          />
          {/* Volumetric haze wash across silhouette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, oklch(0.04 0 0 / 0.55) 70%, oklch(0.03 0 0) 95%)",
            }}
          />
          {/* Single cool rim breath — replaces 3 drift layers + dust grid */}
          <motion.div
            className="absolute inset-0 mix-blend-screen render-stable"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse 42% 48% at 60% 44%, oklch(0.5 0.08 240 / 0.09) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        {/* Cinematic top + bottom fade so silhouette dissolves into page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.03 0 0) 0%, transparent 22%, transparent 70%, oklch(0.03 0 0) 100%)",
          }}
        />
        <div className="relative z-10 max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            01 — Spark
          </motion.p>
          <motion.h1 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.92] tracking-[-0.045em] font-medium">
            {[
              { text: "I build", delay: 0.2 },
              { text: "what does not", delay: 0.34 },
              { text: "yet exist.", delay: 0.48 },
            ].map((line, index) => (
              <motion.span
                key={line.text}
                initial={{ opacity: 0, y: 72, filter: "blur(18px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 1.2, delay: line.delay, ease: [0.19, 1, 0.22, 1] }}
                className={`block ${index < 2 ? "text-gradient" : "text-glow text-foreground"}`}
              >
                {line.text}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.05, delay: 0.72, ease: [0.19, 1, 0.22, 1] }}
            className="mx-auto mt-12 max-w-xl text-sm text-muted-foreground md:text-base"
          >
            Curiosity turned into inventions, patents, companies, and industrial technologies — graphene, nano-materials, and deep-tech ventures built from India for the world.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.05, delay: 0.88, ease: [0.19, 1, 0.22, 1] }}
            className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <a href="#carbon-intelligence" className="btn-cinematic pointer-events-auto">
              Enter the Journey
            </a>
            <a href="#future" className="btn-cinematic-secondary pointer-events-auto">
              Collaborate
            </a>
          </motion.div>
        </div>
        {/* Atmospheric founder identity — right side, minimal, cinematic */}
        <div
          className="pointer-events-none absolute right-6 top-1/2 z-[15] hidden -translate-y-1/2 flex-col items-end gap-5 md:right-10 md:flex lg:right-16"
        >
          <span className="text-[10px] font-light uppercase tracking-[0.35em] text-foreground/55">
            Inventor
          </span>
          <span className="h-px w-4 bg-foreground/30" />
          <span className="text-[10px] font-light uppercase tracking-[0.35em] text-foreground/55">
            Advanced Materials
          </span>
          <span className="h-px w-4 bg-foreground/30" />
          <span className="text-[10px] font-light uppercase tracking-[0.35em] text-foreground/55">
            Deep-Tech Systems
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          <span>Scroll to enter</span>
          <motion.div
            animate={{ opacity: [0.35, 1, 0.35], scaleY: [1, 1.18, 1] }}
            transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="h-14 w-px origin-top bg-gradient-to-b from-foreground/60 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });

  return (
    <div className="fixed left-0 right-0 top-0 z-[55] h-[2px] bg-foreground/5">
      <motion.div className="h-full origin-left bg-gradient-to-r from-primary via-accent to-primary" style={{ scaleX }} />
    </div>
  );
}

function MotionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollSections() {
  const { scrollYProgress } = useScroll();
  const sectionProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.22 });
  const drift = useTransform(sectionProgress, [0, 1], [0, -64]);

  // Chapters 02–06 render as sticky story panels (01 = hero, 07 = closing CTA).
  const storyChapters = chapters.slice(1);
  const totalChapters = 7;

  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar />

      <motion.div style={{ y: drift }} className="render-stable">
        <HeroSection />
      </motion.div>

      <ScrollStory chapters={storyChapters} total={totalChapters} startIndex={1} />

      {/* Ventures — supports chapter 05 (Founder Layer) */}
      <VentureConstellation ventures={ventures} />

      {/* Carbon Intelligence metrics — supports chapter 03 */}
      <section className="relative viewport-section flex items-center px-6 py-24 md:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.12_0.04_240/0.10),transparent_70%)]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal className="text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">Carbon Intelligence</p>
            <h3 className="mb-16 font-display text-4xl leading-[1] tracking-[-0.035em] text-gradient md:text-6xl">Intelligent matter, measured.</h3>
          </MotionReveal>
          <div className="grid grid-cols-2 gap-px bg-foreground/10 md:grid-cols-4">
            {[
              { k: "1", u: "atom", l: "Graphene lattice thickness" },
              { k: "200×", u: "", l: "Stronger than steel" },
              { k: "10⁶", u: "S/m", l: "Electrical conductivity" },
              { k: "∞", u: "", l: "Industrial application surface" },
            ].map((metric, index) => (
              <MotionReveal
                key={metric.l}
                delay={index * 0.08}
                className="panel-surface p-8 transition-all duration-700 hover:bg-background/80 md:p-12"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-medium text-gradient md:text-7xl">{metric.k}</span>
                  <span className="text-sm text-muted-foreground">{metric.u}</span>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{metric.l}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Method — supports chapter 04 (Industrial Applications) */}
      <section className="relative viewport-section flex items-center px-6 py-24 md:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_30%_50%,oklch(0.10_0.03_250/0.09),transparent_72%)]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">Method</p>
            <h3 className="mb-20 max-w-2xl font-display text-4xl leading-[1] tracking-[-0.035em] text-gradient md:text-6xl">
              From invention to industrial scale.

            </h3>
          </MotionReveal>
          <div className="grid gap-10 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <MotionReveal key={step.n} delay={index * 0.08} className="border-t border-foreground/15 pt-6">
                <span className="font-mono text-xs tracking-[0.3em] text-primary/80">{step.n}</span>
                <h4 className="mt-4 mb-3 font-display text-2xl tracking-[-0.02em]">{step.t}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.b}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes — supports chapter 06 (India → World) */}
      <section className="relative viewport-section flex items-center px-6 py-24 md:px-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_70%_50%,oklch(0.11_0.03_245/0.10),transparent_72%)]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">Outcomes</p>
            <h3 className="mb-20 max-w-3xl font-display text-4xl leading-[1] tracking-[-0.035em] text-gradient md:text-6xl">
              Measured in tons of carbon, joules of energy, years of life.
            </h3>
          </MotionReveal>
          <div className="grid gap-px bg-foreground/10 md:grid-cols-3">
            {[
              { k: "GW", l: "Energy systems", s: "Graphene-enabled storage & transmission" },
              { k: "Gt CO₂", l: "Climate trajectory", s: "Material pathways for decarbonization" },
              { k: "10⁹", l: "Lives downstream", s: "Filtration, sensing, intelligent infrastructure" },
            ].map((metric, index) => (
              <MotionReveal key={metric.l} delay={index * 0.08} className="panel-surface p-10 md:p-14">
                <div className="font-display text-5xl font-medium text-gradient md:text-6xl">{metric.k}</div>
                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-foreground/80">{metric.l}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{metric.s}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Voice — cinematic editorial frame.
          Portrait dissolves into atmospheric darkness; India map is pushed deep. */}
      <section className="relative min-h-[calc(var(--viewport-height)*1.1)] overflow-hidden px-6 py-24 md:px-20">
        {/* Heavy atmospheric scrim that pushes the India network bg deep into the scene */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,oklch(0.04_0_0/0.84),oklch(0.03_0_0/0.97))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.6),transparent_25%,transparent_70%,oklch(0.03_0_0/0.85))]" />

        {/* Ambient volumetric wash — single blended layer */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-1/2 h-[72vh] w-[65vw] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.16_0.05_240/0.2),transparent_62%)] blur-2xl render-stable" />
          <div className="absolute right-[-12%] top-[18%] h-[54vh] w-[42vw] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.09_0.02_260/0.28),transparent_70%)] blur-2xl render-stable" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          {/* Asymmetric portrait — enlarged, fully dissolved into the scene */}
          <MotionReveal className="relative md:col-span-8 md:col-start-1 md:-ml-[6%] lg:-ml-[10%]">
            <div className="relative">
              <p className="absolute top-4 left-[12%] z-10 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/40">
                Plate 02 · Founder
              </p>
              <img
                src={founderPresence}
                alt="Sushanth Paatnaik — founder portrait dissolving into industrial darkness."
                width={1100}
                height={1450}
                loading="lazy"
                decoding="async"
                className="relative w-full grayscale-[0.22] contrast-[1.1] [filter:brightness(0.82)_saturate(0.7)] [mask-image:radial-gradient(ellipse_55%_62%_at_50%_42%,#000_28%,rgba(0,0,0,0.55)_55%,transparent_88%)] [-webkit-mask-image:radial-gradient(ellipse_55%_62%_at_50%_42%,#000_28%,rgba(0,0,0,0.55)_55%,transparent_88%)]"
              />
              {/* Deep cinematic shadow integration */}
              <div className="pointer-events-none absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_65%_75%_at_50%_48%,transparent_22%,oklch(0.02_0_0/0.98)_92%)]" />
              {/* Subtle volumetric rim light from the right */}
              <div className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_28%_45%_at_70%_36%,oklch(0.45_0.1_240/0.16),transparent_60%)]" />
              {/* Atmospheric haze drift across the figure */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,oklch(0.1_0.02_240/0.18)_60%,transparent_85%)]" />
              {/* Top + bottom fade into darkness */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-[linear-gradient(180deg,oklch(0.03_0_0)_8%,transparent)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,oklch(0.03_0_0)_88%)]" />
              {/* Side vignettes */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-[linear-gradient(90deg,oklch(0.03_0_0)_12%,transparent)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-[linear-gradient(270deg,oklch(0.03_0_0)_12%,transparent)]" />
            </div>
          </MotionReveal>

          {/* Editorial quote — offset down-right for cinematic asymmetry */}
          <MotionReveal delay={0.14} className="md:col-span-5 md:col-start-8 md:pt-56 lg:pt-72">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em] text-primary/80">
              Founder · Voice
            </p>
            <blockquote className="font-display text-2xl leading-[1.15] tracking-[-0.025em] text-gradient md:text-3xl lg:text-4xl">
              “Cleaner materials. Faster systems. Smarter infrastructure. Built in India — designed for the world.”
            </blockquote>
            <p className="mt-10 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Inventor. Founder. Working at the intersection of graphene, advanced materials, AI, and industrial commercialization.
            </p>
            <div className="mt-12 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
              <span className="h-px w-10 bg-foreground/30" />
              <span>Sushanth Paatnaik</span>
            </div>

            {/* Plate 03 · R&D — atmospheric inventor-documentary inset.
                Small, asymmetric, edge-blended, emerging from darkness. */}
            <div className="relative mt-20 -ml-[20%] hidden md:block lg:-ml-[30%]">
              <p className="absolute -top-5 left-2 z-10 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/40">
                Plate 03 · R&amp;D · Inventor at work
              </p>
              <div className="relative aspect-square w-[78%]">
                <img
                  src={founderLab}
                  alt="Sushanth Paatnaik inside an advanced materials research environment, instrument in hand."
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.3] contrast-[1.08] [filter:brightness(0.72)_saturate(0.65)] [mask-image:radial-gradient(ellipse_70%_75%_at_45%_50%,#000_25%,rgba(0,0,0,0.5)_60%,transparent_92%)] [-webkit-mask-image:radial-gradient(ellipse_70%_75%_at_45%_50%,#000_25%,rgba(0,0,0,0.5)_60%,transparent_92%)]"
                />
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_70%_75%_at_45%_50%,transparent_25%,oklch(0.02_0_0/0.97)_92%)]" />
                <div className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_25%_45%_at_82%_42%,oklch(0.45_0.1_240/0.18),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_45%,oklch(0.1_0.02_240/0.16)_65%,transparent_88%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,oklch(0.03_0_0)_5%,transparent)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,oklch(0.03_0_0)_88%)]" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-[linear-gradient(90deg,oklch(0.03_0_0)_8%,transparent)]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-[linear-gradient(270deg,oklch(0.03_0_0)_8%,transparent)]" />
              </div>
              <p className="mt-4 max-w-[18rem] font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/55">
                R&amp;D bench · Instrumentation · Graphene · Nano-materials
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>


      {/* Chapter 07 — The Future System */}
      <section id="future" className="relative min-h-[calc(var(--viewport-height)*1.24)] px-6 text-center">
        <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center pt-24 pb-12 render-stable">
          <div className="max-w-3xl pointer-events-auto">
            <MotionReveal>
              <p className="mb-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
                07 — The Future System
              </p>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <h2 className="mb-12 font-display text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.045em] font-medium text-gradient">
                Cleaner materials. Faster systems. Smarter infrastructure.
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.16}>
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                <a href="mailto:me@sushanthpaatnaik.com?subject=Collaborate" className="btn-cinematic">
                  Collaborate
                </a>
                <a href="mailto:me@sushanthpaatnaik.com?subject=Invest" className="btn-cinematic">
                  Invest
                </a>
                <a href="mailto:me@sushanthpaatnaik.com?subject=Build%20with%20me" className="btn-cinematic-secondary">
                  Build with me <span className="text-[10px] opacity-60">→</span>
                </a>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.24}>
              <div className="mt-24 flex items-center justify-center gap-8 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
                <span>Graphene</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span>Nano-Materials</span>
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span>AI · Climate</span>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.32}>
              <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                © Sushanth Paatnaik — Engineering matter, capital, and scale.
              </p>
            </MotionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
