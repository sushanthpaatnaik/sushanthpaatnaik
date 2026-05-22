import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

// 7-chapter cinematic storyline.
// Chapter 01 (Spark) is rendered by HeroSection.
// Chapter 07 (Future) is rendered by the closing CTA section.
// The sticky StoryPanels cover chapters 02–06.
const chapters = [
  {
    id: "spark",
    eyebrow: "01 — The Spark",
    title: "I build what does not yet exist.",
    body:
      "From curiosity to carbon intelligence — engineering the materials behind a cleaner century.",
    align: "center" as const,
  },
  {
    id: "origin",
    eyebrow: "02 — Origin",
    title: "Curiosity became a discipline. Recognition became responsibility.",
    body:
      "A young inventor's bench. Dismantled gadgets, blueprint fragments, quiet awards. Where the instinct to take things apart became the discipline to engineer what comes next.",
    align: "left" as const,
  },
  {
    id: "material",
    eyebrow: "03 — The Material Layer",
    title: "At the atomic scale, small changes rewrite industries.",
    body:
      "Graphene. 2D materials. Nano-composites. The honeycomb lattice that bends into roads, panels, batteries, polymers. A single layer of carbon — engineered into a century of leverage.",
    align: "right" as const,
  },
  {
    id: "stack",
    eyebrow: "04 — The Innovation Stack",
    title: "One platform. Many industries. One objective: performance with less waste.",
    body:
      "Solar. Battery. Concrete. Polymer. Fuel. Coal efficiency. Each industry rebuilt from the material upward — measured in joules, tons of CO₂, and decades of service life.",
    align: "left" as const,
  },
  {
    id: "founder",
    eyebrow: "05 — The Founder Layer",
    title: "I don't only invent technologies. I build vehicles that carry them to the world.",
    body:
      "Monoatom Labs. Grafillium. SPI Industries. InThinks. Starunico Capital. A constellation of companies — research translated into operating ventures, and ventures translated into industrial reality.",
    align: "right" as const,
  },
  {
    id: "india",
    eyebrow: "06 — India to the World",
    title: "Built in India. Designed for global industrial transformation.",
    body:
      "Frontier materials engineered at home, deployed across continents. India as the launchpad — global energy, mobility, and climate infrastructure as the destination.",
    align: "left" as const,
  },
] as const;

const ventures = [
  {
    n: "01",
    title: "Monoatom Labs",
    body: "Frontier graphene and 2D-material synthesis — the research engine behind every downstream platform.",
  },
  {
    n: "02",
    title: "Grafillium",
    body: "Graphene-enabled materials engineered for energy, mobility, and industrial-scale deployment.",
  },
  {
    n: "03",
    title: "SPI Industries",
    body: "Operating arm translating advanced materials into production-grade infrastructure and supply.",
  },
  {
    n: "04",
    title: "InThinks · Starunico Capital",
    body: "Intelligent systems and capital architecture — the vehicles that carry deep-tech from lab to ledger.",
  },
];

const processSteps = [
  { n: "01", t: "Hypothesize", b: "Identify a material-level lever with world-scale consequence." },
  { n: "02", t: "Model", b: "Simulate matter, systems, and economics before they reach deployment." },
  { n: "03", t: "Prototype", b: "Build the lattice, module, and operating pathway into physical form." },
  { n: "04", t: "Deploy", b: "Scale from scientific validity to industrial adoption." },
];

function SectionCopy({
  eyebrow,
  title,
  body,
  align,
  index,
  total,
}: {
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
  index: number;
  total: number;
}) {
  const textAlign = align === "center" ? "text-center mx-auto" : align === "right" ? "ml-auto text-right" : "mr-auto text-left";
  const counterPosition = align === "right" ? "left-10" : align === "left" ? "right-10" : "right-10";

  return (
    <div className={`max-w-xl pointer-events-auto ${textAlign}`}>
      <motion.div
        initial={{ opacity: 0, scaleX: 0, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ duration: 1.15, ease: [0.19, 1, 0.22, 1] }}
        className={`h-px w-24 mb-8 origin-left bg-gradient-to-r from-primary via-accent to-transparent ${align === "right" ? "ml-auto origin-right bg-gradient-to-l" : ""} ${align === "center" ? "mx-auto" : ""}`}
      />
      <motion.p
        initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ duration: 1.05, delay: 0.04, ease: [0.19, 1, 0.22, 1] }}
        className="text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 64, filter: "blur(16px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ duration: 1.15, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        className="font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[1] tracking-[-0.035em] font-medium text-gradient mb-8"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 56, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.05, delay: 0.18, ease: [0.19, 1, 0.22, 1] }}
        className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md"
      >
        {body}
      </motion.p>

      <div className={`absolute top-10 hidden md:block font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 ${counterPosition}`}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

function StoryPanel({
  chapter,
  index,
  total,
}: {
  chapter: (typeof chapters)[number];
  index: number;
  total: number;
}) {
  return (
    <section id={chapter.id} className="story-panel relative min-h-[130vh] px-6 md:px-20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0.65, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="relative z-10 w-full"
        >
          <SectionCopy
            eyebrow={chapter.eyebrow}
            title={chapter.title}
            body={chapter.body}
            align={chapter.align}
            index={index}
            total={total}
          />
        </motion.div>
      </div>
    </section>
  );
}

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
            01 — The Spark · Deep-Tech Founder · Graphene · Advanced Materials · AI · Energy · Climate
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
            From curiosity to carbon intelligence — engineering the materials behind a cleaner century.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.05, delay: 0.88, ease: [0.19, 1, 0.22, 1] }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#material"
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

  // Chapters 02–06 render as sticky story panels (chapter 01 is the hero,
  // chapter 07 is the closing CTA below).
  const storyChapters = chapters.slice(1);
  const totalChapters = 7;

  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar />

      <motion.div style={{ y: drift }}>
        <HeroSection />
      </motion.div>

      {storyChapters.map((chapter, index) => (
        <StoryPanel
          key={chapter.id}
          chapter={chapter}
          index={index + 1}
          total={totalChapters}
        />
      ))}

      {/* Ventures — supports chapter 05 (Founder Layer) */}
      <section className="min-h-screen px-6 py-32 md:px-20 pointer-events-auto">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
          <MotionReveal className="self-start md:col-span-4 md:sticky md:top-32">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">Ventures</p>
            <h3 className="font-display text-4xl leading-[1.05] tracking-[-0.03em] text-gradient md:text-5xl">The vehicles.</h3>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Operating companies carrying frontier science from lab into the industrial world.
            </p>
          </MotionReveal>

          <div className="flex flex-col md:col-span-8">
            {ventures.map((venture, index) => (
              <MotionReveal
                key={venture.n}
                delay={index * 0.06}
                className="group grid grid-cols-[auto_1fr] items-start gap-8 border-t border-foreground/10 py-10 transition-colors duration-500 hover:border-foreground/30"
              >
                <span className="mt-2 font-mono text-xs tracking-[0.3em] text-muted-foreground/60">{venture.n}</span>
                <div>
                  <h4 className="mb-3 font-display text-2xl tracking-[-0.02em] transition-all duration-500 group-hover:text-glow md:text-3xl">
                    {venture.title}
                  </h4>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">{venture.body}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Substrate metrics — supports chapter 03 (Material Layer) */}
      <section className="min-h-screen flex items-center px-6 md:px-20">
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal className="text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">The Substrate</p>
            <h3 className="mb-16 font-display text-4xl leading-[1] tracking-[-0.035em] text-gradient md:text-6xl">Matter, measured.</h3>
          </MotionReveal>
          <div className="grid grid-cols-2 gap-px bg-foreground/10 md:grid-cols-4">
            {[
              { k: "1", u: "atom", l: "Lattice thickness" },
              { k: "200×", u: "", l: "Stronger than steel" },
              { k: "10⁶", u: "S/m", l: "Conductivity" },
              { k: "∞", u: "", l: "Application surface" },
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

      {/* Method — supports chapter 04 (Innovation Stack) */}
      <section className="min-h-screen flex items-center px-6 py-32 md:px-20">
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">Method</p>
            <h3 className="mb-20 max-w-2xl font-display text-4xl leading-[1] tracking-[-0.035em] text-gradient md:text-6xl">
              From atom to industry.
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

      <section className="min-h-[60vh] flex items-center px-6 py-24 md:px-20">
        <MotionReveal className="mx-auto max-w-4xl pointer-events-auto">
          <p className="mb-8 text-[10px] uppercase tracking-[0.5em] text-primary/80">Voice</p>
          <blockquote className="font-display text-2xl leading-[1.2] tracking-[-0.025em] text-gradient md:text-4xl lg:text-5xl">
            “Cleaner materials. Faster systems. Smarter infrastructure. Built in India — designed for the world.”
          </blockquote>
        </MotionReveal>
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
                  href="mailto:sushanth@intelligentmatter.com"
                  className="glass rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
                >
                  Collaborate
                </a>
                <a
                  href="mailto:invest@intelligentmatter.com"
                  className="glass rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
                >
                  Invest
                </a>
                <a
                  href="mailto:build@intelligentmatter.com"
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
                © Sushanth — Engineering the materials behind a cleaner century.
              </p>
            </MotionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
