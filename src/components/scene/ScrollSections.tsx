import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
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
  return (
    <section id="spark" className="relative min-h-[150vh] px-6">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center text-center">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            01 — Spark · Founder · Inventor · Graphene · Nano-Materials · Deep-Tech Ventures · India to Global
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
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#carbon-intelligence"
              className="glass pointer-events-auto rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
            >
              Enter the Journey
            </a>
            <a
              href="#future"
              className="pointer-events-auto rounded-full px-8 py-4 text-sm tracking-wide text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Collaborate
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
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
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 36, filter: "blur(10px)" }}
      transition={{ duration: 1.05, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollSections() {
  const sectionProgress = useMotionValue(0);

  useEffect(() => {
    const handle = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sectionProgress.set(max > 0 ? window.scrollY / max : 0);
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [sectionProgress]);

  const drift = useTransform(sectionProgress, [0, 1], [0, -120]);

  // Chapters 02–06 render as sticky story panels (01 = hero, 07 = closing CTA).
  const storyChapters = chapters.slice(1);
  const totalChapters = 7;

  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar />

      <motion.div style={{ y: drift }}>
        <HeroSection />
      </motion.div>

      <ScrollStory chapters={storyChapters} total={totalChapters} startIndex={1} />

      {/* Ventures — supports chapter 05 (Founder Layer) */}
      <VentureConstellation ventures={ventures} />

      {/* Carbon Intelligence metrics — supports chapter 03 */}
      <section className="min-h-screen flex items-center px-6 md:px-20">
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
                className="bg-background/60 p-8 backdrop-blur-xl transition-all duration-700 hover:bg-background/80 md:p-12"
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
      <section className="min-h-screen flex items-center px-6 py-32 md:px-20">
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
      <section className="min-h-screen flex items-center px-6 py-32 md:px-20">
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
              <MotionReveal key={metric.l} delay={index * 0.08} className="bg-background/60 p-10 backdrop-blur-xl md:p-14">
                <div className="font-display text-5xl font-medium text-gradient md:text-6xl">{metric.k}</div>
                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-foreground/80">{metric.l}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{metric.s}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder presence — asymmetric editorial composition.
          Silhouette + handwritten quote; cinematic, mysterious, invention-driven. */}
      <section className="relative min-h-[110vh] px-6 py-32 md:px-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          {/* Asymmetric image — offset left, occupies 7 of 12 columns */}
          <MotionReveal className="relative md:col-span-7 md:col-start-1">
            <div className="relative overflow-hidden">
              <div className="absolute -top-3 left-0 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
                Plate 02 · Inventor at the bench
              </div>
              <img
                src={founderPresence}
                alt="Inventor silhouette at a graphite workbench, lit by cool blue light, surrounded by patent diagrams, microscope and graphene wafer."
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="mt-6 aspect-square w-full object-cover grayscale-[0.18] contrast-[1.05] [filter:brightness(0.92)_saturate(0.8)]"
              />
              {/* Soft lens diffusion + vignette over the plate */}
              <div className="pointer-events-none absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_at_50%_55%,transparent_35%,oklch(0.05_0_0/0.7)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,oklch(0.04_0_0/0.55)_100%)]" />

              {/* Plate 03 — laboratory inset, offset for editorial layering */}
              <div className="absolute -bottom-12 -right-8 hidden w-[42%] md:block lg:-right-16 lg:-bottom-16">
                <div className="relative overflow-hidden border border-foreground/10 shadow-[0_30px_80px_-30px_oklch(0.04_0_0/0.9)]">
                  <div className="absolute -top-3 left-0 z-10 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60">
                    Plate 03 · Laboratory
                  </div>
                  <img
                    src={founderLab}
                    alt="Inventor at the laboratory bench with instrumentation, shallow depth of field, industrial grading."
                    width={1024}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                    className="mt-3 aspect-square w-full object-cover grayscale-[0.15] contrast-[1.05] [filter:brightness(0.9)_saturate(0.8)]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,oklch(0.04_0_0/0.6)_100%)]" />
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* Editorial quote — pushed right + down for cinematic asymmetry */}
          <MotionReveal delay={0.12} className="md:col-span-5 md:col-start-8 md:pt-32 lg:pt-48">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">
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
          </MotionReveal>
        </div>
      </section>


      {/* Chapter 07 — The Future System */}
      <section id="future" className="relative min-h-[135vh] px-6 text-center">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
          <div className="max-w-3xl pointer-events-auto">
            <MotionReveal>
              <p className="mb-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
                07 — The Future System / Open to founders, scientists, funds & climate operators
              </p>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <h2 className="mb-12 font-display text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.045em] font-medium text-gradient">
                Cleaner materials. Faster systems. Smarter infrastructure.
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.16}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:me@sushanthpaatnaik.com?subject=Collaborate"
                  className="glass rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
                >
                  Collaborate
                </a>
                <a
                  href="mailto:me@sushanthpaatnaik.com?subject=Invest"
                  className="glass rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
                >
                  Invest
                </a>
                <a
                  href="mailto:me@sushanthpaatnaik.com?subject=Build%20with%20me"
                  className="rounded-full px-8 py-4 text-sm tracking-wide text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  Build with me →
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
