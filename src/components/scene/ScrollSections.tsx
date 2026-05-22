import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";

const chapters = [
  {
    id: "origin",
    eyebrow: "Chapter 01 — Origin",
    title: "Where intelligent matter begins as possibility.",
    body:
      "Abstract particles, atmospheric darkness, and a first pulse of energy. The journey opens in conceptual space — where future industry exists only as a scientific signal.",
    align: "center" as const,
  },
  {
    id: "discovery",
    eyebrow: "Chapter 02 — Discovery",
    title: "The substrate starts to reveal structure.",
    body:
      "Graphene lattices, molecular systems, and material emergence sharpen into view. Scientific curiosity condenses into a tangible basis for the next industrial era.",
    align: "right" as const,
  },
  {
    id: "engineering",
    eyebrow: "Chapter 03 — Engineering",
    title: "Designing systems that conduct, sense, and endure.",
    body:
      "Conductive pathways, structural precision, and engineered intelligence translate frontier physics into manufacturable material systems.",
    align: "left" as const,
  },
  {
    id: "prototype",
    eyebrow: "Chapter 04 — Prototype",
    title: "The first industrial forms take shape.",
    body:
      "Sensors, cells, membranes, and modules move beyond the lab bench. Matter becomes device, mechanism, and applied performance.",
    align: "right" as const,
  },
  {
    id: "scale",
    eyebrow: "Chapter 05 — Scale",
    title: "Infrastructure expands around the material breakthrough.",
    body:
      "Pilot lines become production lines. Energy, filtration, and intelligent sensing start to inhabit real industrial networks and supply chains.",
    align: "left" as const,
  },
  {
    id: "impact",
    eyebrow: "Chapter 06 — Impact",
    title: "Frontier science becomes climate-grade deployment.",
    body:
      "Advanced materials move into energy systems, decarbonization platforms, and resilient infrastructure — industrial reality replacing lab-scale promise.",
    align: "right" as const,
  },
  {
    id: "future",
    eyebrow: "Chapter 07 — Future",
    title: "A calmer horizon, built from intelligent matter.",
    body:
      "The final state is not spectacle, but direction: a world-scale industrial future shaped by deep-tech systems that began at the atomic edge.",
    align: "center" as const,
  },
];

const services = [
  {
    n: "01",
    title: "Graphene & nano-materials",
    body: "Synthesis, characterization, and applied research turning 2D materials into platforms for energy, sensing, and resilient infrastructure.",
  },
  {
    n: "02",
    title: "AI for materials & climate",
    body: "Machine intelligence for molecular design, system optimization, and climate-scale modeling that compresses discovery cycles.",
  },
  {
    n: "03",
    title: "Deep-tech venture building",
    body: "Founding and operating companies where advanced materials, intelligent systems, and climate deployment intersect.",
  },
  {
    n: "04",
    title: "Frontier advisory",
    body: "Collaborating with founders, labs, and funds navigating the early-to-industrial arc of deep-tech ventures.",
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
}: {
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
  index: number;
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
        className={`h-px w-24 mb-8 origin-left bg-gradient-to-r from-primary to-transparent ${align === "right" ? "ml-auto origin-right bg-gradient-to-l" : ""} ${align === "center" ? "mx-auto" : ""}`}
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
        {String(index + 1).padStart(2, "0")} / 07
      </div>
    </div>
  );
}

function StoryPanel({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number];
  index: number;
}) {
  return (
    <section id={chapter.id} className="story-panel relative min-h-[130vh] px-6 md:px-20">
      <div className="sticky top-0 flex h-screen items-center">
        <motion.div
          initial={{ opacity: 0.65, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="w-full"
        >
          <SectionCopy
            eyebrow={chapter.eyebrow}
            title={chapter.title}
            body={chapter.body}
            align={chapter.align}
            index={index}
          />
        </motion.div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[150vh] px-6">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center text-center">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            01 — Origin / Deep-Tech Founder · Graphene · Nano-Materials · AI · Climate Innovation
          </motion.p>
          <motion.h1 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.92] tracking-[-0.045em] font-medium">
            {[
              { text: "Sushanth.", delay: 0.2 },
              { text: "Engineering", delay: 0.34 },
              { text: "Intelligent Matter.", delay: 0.48 },
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
            Deep-tech founder building future-facing ventures across graphene, nano-materials, AI, energy, climate, and intelligent systems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.05, delay: 0.88, ease: [0.19, 1, 0.22, 1] }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#scale"
              className="glass pointer-events-auto rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
            >
              Explore the Work
            </a>
            <a
              href="#future"
              className="pointer-events-auto rounded-full px-8 py-4 text-sm tracking-wide text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Connect
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

  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar />

      <motion.div style={{ y: drift }}>
        <HeroSection />
      </motion.div>

      {chapters.slice(1, 6).map((chapter, index) => (
        <StoryPanel key={chapter.id} chapter={chapter} index={index + 1} />
      ))}

      <section className="min-h-screen px-6 py-32 md:px-20 pointer-events-auto">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
          <MotionReveal className="self-start md:col-span-4 md:sticky md:top-32">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/80">Ventures</p>
            <h3 className="font-display text-4xl leading-[1.05] tracking-[-0.03em] text-gradient md:text-5xl">Where I build.</h3>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Founding and operating across graphene, nano-materials, AI, and climate infrastructure — research translated into companies.
            </p>
          </MotionReveal>

          <div className="flex flex-col md:col-span-8">
            {services.map((service, index) => (
              <MotionReveal
                key={service.n}
                delay={index * 0.06}
                className="group grid grid-cols-[auto_1fr] items-start gap-8 border-t border-foreground/10 py-10 transition-colors duration-500 hover:border-foreground/30"
              >
                <span className="mt-2 font-mono text-xs tracking-[0.3em] text-muted-foreground/60">{service.n}</span>
                <div>
                  <h4 className="mb-3 font-display text-2xl tracking-[-0.02em] transition-all duration-500 group-hover:text-glow md:text-3xl">
                    {service.title}
                  </h4>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">{service.body}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

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
            “Collaborating with founders, scientists, funds, and climate operators to move frontier science from lab-scale possibility to industrial reality.”
          </blockquote>
        </MotionReveal>
      </section>

      <section id="future" className="relative min-h-[135vh] px-6 text-center">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
          <div className="max-w-3xl pointer-events-auto">
            <MotionReveal>
              <p className="mb-10 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
                07 — Future / Open to founders, scientists, funds & climate operators
              </p>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <h2 className="mb-12 font-display text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.045em] font-medium text-gradient">
                Let&apos;s build the next material era.
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.16}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:sushanth@intelligentmatter.com"
                  className="glass rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:scale-[1.03] hover:bg-foreground/10"
                >
                  sushanth@intelligentmatter.com
                </a>
                <a
                  href="#"
                  className="rounded-full px-8 py-4 text-sm tracking-wide text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  Read the thesis →
                </a>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.24}>
              <div className="mt-24 flex items-center justify-center gap-8 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
                <span>Graphene</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span>Nano-Materials</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span>AI · Climate</span>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.32}>
              <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                © Sushanth — Building at the frontier of intelligent matter.
              </p>
            </MotionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}