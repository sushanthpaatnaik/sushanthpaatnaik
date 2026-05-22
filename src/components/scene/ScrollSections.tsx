import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ----- 8-chapter founder narrative ----- */
const chapters = [
  {
    id: "vision",
    eyebrow: "Chapter 02 — Vision",
    title: "Engineering the next material era.",
    body:
      "I build ventures at the frontier of graphene, nano-materials and artificial intelligence — designing the substrates, systems and intelligence that will define the next century of energy, climate and computation.",
    align: "right" as const,
  },
  {
    id: "graphene",
    eyebrow: "Chapter 03 — Graphene",
    title: "Graphene as a foundation, not a feature.",
    body:
      "From atomically-thin lattices to engineered nano-composites — materials that conduct, sense and adapt. A new physical substrate for energy storage, filtration, sensing and structural intelligence.",
    align: "left" as const,
  },
  {
    id: "intelligence",
    eyebrow: "Chapter 04 — Intelligence",
    title: "AI woven into matter itself.",
    body:
      "Machine learning fused with material science. Models that design molecules, simulate lattices, and accelerate discovery — turning years of lab cycles into weeks of intentional iteration.",
    align: "right" as const,
  },
  {
    id: "ventures",
    eyebrow: "Chapter 05 — Ventures",
    title: "Building companies, not papers.",
    body:
      "Deep-tech venture creation across graphene energy systems, nano-material platforms, climate infrastructure and intelligent sensing — translating frontier research into companies that ship.",
    align: "left" as const,
  },
  {
    id: "process",
    eyebrow: "Chapter 06 — Process",
    title: "From atom to architecture.",
    body:
      "Hypothesis, synthesis, simulation, scale. I move between the lab bench and the cap table — pairing scientific rigor with founder velocity to compress the distance between breakthrough and deployment.",
    align: "right" as const,
  },
];

/* ----- Focus areas ----- */
const services = [
  {
    n: "01",
    title: "Graphene & nano-materials",
    body: "Synthesis, characterization and applied research turning 2D materials into energy, sensing and structural platforms.",
  },
  {
    n: "02",
    title: "AI for materials & climate",
    body: "ML systems for molecular design, lattice simulation and climate modeling — accelerating discovery cycles by orders of magnitude.",
  },
  {
    n: "03",
    title: "Deep-tech venture building",
    body: "Founding and operating companies at the intersection of advanced materials, energy and intelligent systems.",
  },
  {
    n: "04",
    title: "Frontier advisory",
    body: "Strategic partnership with founders, labs and funds navigating the early arc of nano-material and climate-tech ventures.",
  },
];

/* ----- Process ----- */
const processSteps = [
  { n: "01", t: "Hypothesize", b: "Identify a material-level lever with civilizational impact." },
  { n: "02", t: "Synthesize", b: "Build the lattice, the model, the prototype, the team." },
  { n: "03", t: "Simulate", b: "AI-driven iteration across structure, function and economics." },
  { n: "04", t: "Scale", b: "Found, capitalize and deploy — from lab cell to industrial system." },
];

/* Fictional testimonials removed for founder-led identity */

export default function ScrollSections() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic hero — split into per-word reveal
      document.querySelectorAll<HTMLElement>(".hero-line").forEach((el) => {
        const text = el.textContent || "";
        el.innerHTML = text
          .split(" ")
          .map(
            (w) =>
              `<span class="inline-block overflow-hidden align-top"><span class="inline-block will-change-transform" data-word>${w}&nbsp;</span></span>`,
          )
          .join("");
      });

      gsap.fromTo(
        "[data-word]",
        { yPercent: 110, opacity: 0, filter: "blur(14px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.25,
        },
      );

      gsap.fromTo(
        ".hero-meta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.1, ease: "power2.out" },
      );

      // Story panels
      gsap.utils.toArray<HTMLElement>(".story-panel").forEach((panel) => {
        const eyebrow = panel.querySelector(".s-eyebrow");
        const title = panel.querySelector(".s-title");
        const body = panel.querySelector(".s-body");
        const line = panel.querySelector(".s-line");

        gsap.fromTo(
          [eyebrow, title, body],
          { y: 70, opacity: 0, filter: "blur(14px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: panel, start: "top 75%", end: "top 30%", toggleActions: "play none none reverse" },
          },
        );

        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: panel, start: "top 70%" } },
          );
        }

        gsap.to(panel.querySelector(".s-inner"), {
          y: -100,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Reveal generic .reveal blocks
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          },
        );
      });

      // Scroll progress bar
      gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative z-10 pointer-events-none">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[55] bg-foreground/5">
        <div className="scroll-progress origin-left scale-x-0 h-full bg-gradient-to-r from-primary via-accent to-primary" />
      </div>

      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center relative">
        <div className="max-w-5xl">
          <p className="hero-meta text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-10">
            01 — Origin / Deep-Tech Founder · Graphene · Nano-Materials · AI · Climate Innovation
          </p>
          <h1 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.92] tracking-[-0.045em] font-medium">
            <span className="hero-line block text-gradient">Sushanth.</span>
            <span className="hero-line block text-gradient">Engineering</span>
            <span className="hero-line block text-glow text-foreground">Intelligent Matter.</span>
          </h1>
          <p className="hero-meta mt-12 text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            A deep-tech founder building future-facing ventures across graphene, nano-materials, AI, energy, climate, and intelligent systems.
          </p>
          <div className="hero-meta mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#ventures"
              className="glass px-8 py-4 rounded-full text-sm tracking-wide hover:bg-foreground/10 transition-all duration-500 hover:scale-[1.03]"
            >
              Explore the Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Connect
            </a>
          </div>
        </div>
        <div className="hero-meta absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span>Scroll to enter</span>
          <div className="w-px h-14 bg-gradient-to-b from-foreground/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* STORY CHAPTERS */}
      {chapters.map((s, i) => (
        <section key={s.id} className="story-panel min-h-[120vh] flex items-center px-6 md:px-20 relative">
          <div className={`s-inner max-w-xl pointer-events-auto ${s.align === "right" ? "ml-auto text-right" : "mr-auto"}`}>
            <div className={`s-line h-px w-24 bg-gradient-to-r from-primary to-transparent mb-8 ${s.align === "right" ? "ml-auto bg-gradient-to-l" : ""}`} />
            <p className="s-eyebrow text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6">{s.eyebrow}</p>
            <h2 className="s-title font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[1.0] tracking-[-0.035em] font-medium text-gradient mb-8">{s.title}</h2>
            <p className="s-body text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md">{s.body}</p>
          </div>
          <div className={`absolute top-10 ${s.align === "right" ? "left-10" : "right-10"} text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 hidden md:block font-mono`}>
            0{i + 2} / 08
          </div>
        </section>
      ))}

      {/* FOCUS AREAS — sticky title, scrolling list */}
      <section className="min-h-screen px-6 md:px-20 py-32 pointer-events-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4 md:sticky md:top-32 self-start reveal">
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">05 — Ventures</p>
            <h3 className="font-display text-4xl md:text-5xl tracking-[-0.03em] text-gradient leading-[1.05]">
              Where I build.
            </h3>
            <p className="mt-6 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Founding and operating across graphene, nano-materials, AI and climate infrastructure — research translated into companies.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-col">
            {services.map((s) => (
              <div
                key={s.n}
                className="reveal group border-t border-foreground/10 py-10 grid grid-cols-[auto_1fr] gap-8 items-start hover:border-foreground/30 transition-colors duration-500"
              >
                <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground/60 mt-2">{s.n}</span>
                <div>
                  <h4 className="font-display text-2xl md:text-3xl tracking-[-0.02em] mb-3 group-hover:text-glow transition-all duration-500">
                    {s.title}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH / MATERIALS STRIP */}
      <section className="min-h-screen flex items-center px-6 md:px-20">
        <div className="w-full max-w-6xl mx-auto pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4 text-center">
            03 — Graphene
          </p>
          <h3 className="reveal font-display text-4xl md:text-6xl tracking-[-0.035em] text-gradient text-center mb-16 leading-[1.0]">
            Matter, measured.
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10">
            {[
              { k: "1", u: "atom", l: "Lattice thickness" },
              { k: "200×", u: "", l: "Stronger than steel" },
              { k: "10⁶", u: "S/m", l: "Conductivity" },
              { k: "∞", u: "", l: "Application surface" },
            ].map((m, i) => (
              <div
                key={i}
                className="reveal bg-background/60 backdrop-blur-xl p-8 md:p-12 group hover:bg-background/80 transition-all duration-700"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl md:text-7xl font-medium text-gradient">{m.k}</span>
                  <span className="text-sm text-muted-foreground">{m.u}</span>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{m.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-32">
        <div className="max-w-6xl mx-auto w-full pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">06 — Process</p>
          <h3 className="reveal font-display text-4xl md:text-6xl tracking-[-0.035em] text-gradient mb-20 max-w-2xl leading-[1.0]">
            From atom to industry.
          </h3>
          <div className="grid md:grid-cols-4 gap-10">
            {processSteps.map((s) => (
              <div key={s.n} className="reveal border-t border-foreground/15 pt-6">
                <span className="font-mono text-xs tracking-[0.3em] text-primary/80">{s.n}</span>
                <h4 className="font-display text-2xl mt-4 mb-3 tracking-[-0.02em]">{s.t}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-32">
        <div className="max-w-6xl mx-auto w-full pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">07 — Impact</p>
          <h3 className="reveal font-display text-4xl md:text-6xl tracking-[-0.035em] text-gradient mb-20 max-w-3xl leading-[1.0]">
            Measured in tons of carbon, joules of energy, years of life.
          </h3>
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
            {[
              { k: "GW", l: "Energy systems", s: "Graphene-enabled storage & transmission" },
              { k: "Gt CO₂", l: "Climate trajectory", s: "Material pathways for decarbonization" },
              { k: "10⁹", l: "Lives downstream", s: "Filtration, sensing, intelligent infrastructure" },
            ].map((m, i) => (
              <div key={i} className="reveal bg-background/60 backdrop-blur-xl p-10 md:p-14">
                <div className="font-display text-5xl md:text-6xl font-medium text-gradient">{m.k}</div>
                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-foreground/80">{m.l}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{m.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER VOICE */}
      <section className="min-h-[60vh] flex items-center px-6 md:px-20 py-24">
        <div className="max-w-4xl mx-auto pointer-events-auto reveal">
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-8">Voice</p>
          <blockquote className="font-display text-2xl md:text-4xl lg:text-5xl tracking-[-0.025em] text-gradient leading-[1.2]">
            “Collaborating with founders, scientists, funds, and climate operators to move frontier science from lab-scale possibility to industrial reality.”
          </blockquote>
        </div>
      </section>

      {/* CONTACT / OUTRO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-10">
            08 — Contact / Open to founders, scientists, funds & climate operators
          </p>
          <h2 className="reveal font-display text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.045em] font-medium text-gradient mb-12">
            Let's build the next material era.
          </h2>
          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:sushanth@intelligentmatter.com"
              className="glass px-8 py-4 rounded-full text-sm tracking-wide hover:bg-foreground/10 transition-all duration-500 hover:scale-[1.03]"
            >
              sushanth@intelligentmatter.com
            </a>
            <a
              href="#"
              className="px-8 py-4 rounded-full text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Read the thesis →
            </a>
          </div>
          <div className="reveal mt-24 flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-mono">
            <span>Graphene</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>Nano-Materials</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>AI · Climate</span>
          </div>
          <p className="reveal mt-12 text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase">
            © Sushanth — Building at the frontier of intelligent matter.
          </p>
        </div>
      </section>
    </div>
  );
}
