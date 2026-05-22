import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ----- 8-chapter narrative ----- */
const chapters = [
  {
    id: "vision",
    eyebrow: "Chapter 02 — Vision",
    title: "We build the surface of the future.",
    body:
      "Nova is a real-time interface studio engineering the next decade of digital experience. Software that feels like light. Products that feel like cinema.",
    align: "right" as const,
  },
  {
    id: "depth",
    eyebrow: "Chapter 03 — Depth",
    title: "Worlds within worlds.",
    body:
      "Layered geometry, volumetric atmosphere and physically-based light. Focus moves with you, naturally, frame by frame — a quiet architecture for attention.",
    align: "left" as const,
  },
  {
    id: "motion",
    eyebrow: "Chapter 04 — Motion",
    title: "Motion you can feel.",
    body:
      "GPU-accelerated choreography at 120fps. Inertia, easing and cinematic timing — every transition tuned by hand, every frame intentional.",
    align: "right" as const,
  },
  {
    id: "tech",
    eyebrow: "Chapter 05 — Technology",
    title: "A new rendering stack.",
    body:
      "WebGL, WebGPU and ray-marched shaders running edge-side. Streaming geometry, sub-millisecond input latency, real-time global illumination — in the browser.",
    align: "left" as const,
  },
  {
    id: "process",
    eyebrow: "Chapter 06 — Process",
    title: "From script to scene.",
    body:
      "We work like a film studio. Direction, choreography, lighting and edit — translated into production-ready React, Three.js and shader code your team can ship.",
    align: "right" as const,
  },
];

/* ----- Services ----- */
const services = [
  {
    n: "01",
    title: "Cinematic interfaces",
    body: "Story-driven product surfaces for launches, brand films and immersive marketing sites.",
  },
  {
    n: "02",
    title: "Real-time 3D systems",
    body: "Custom WebGL pipelines, shader systems and configurator tools built to scale.",
  },
  {
    n: "03",
    title: "Motion direction",
    body: "End-to-end motion language — timing, easing, choreography, transitions, micro-interaction.",
  },
  {
    n: "04",
    title: "Engineering partnership",
    body: "Embed with your team to ship performant React, R3F and shader code into production.",
  },
];

/* ----- Process ----- */
const processSteps = [
  { n: "01", t: "Discover", b: "Audit, strategy, narrative direction." },
  { n: "02", t: "Direct", b: "Storyboard, mood, motion language, art direction." },
  { n: "03", t: "Render", b: "3D scenes, shaders, choreography, prototyping." },
  { n: "04", t: "Ship", b: "Production engineering, performance, handover." },
];

/* ----- Testimonials ----- */
const quotes = [
  {
    q: "Nova rebuilt our launch experience from the ground up. Conversion lifted 38% in week one. It looks like a film and ships like software.",
    a: "Aria Chen — Head of Brand, Atlas",
  },
  {
    q: "The most cinematic browser experience I've ever shipped. The motion language is now part of our product DNA.",
    a: "Marcus Vance — VP Design, Helio",
  },
];

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
            Nova Studio / Volume 01 — 2026
          </p>
          <h1 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.92] tracking-[-0.045em] font-medium">
            <span className="hero-line block text-gradient">Beyond</span>
            <span className="hero-line block text-glow text-foreground">the surface.</span>
          </h1>
          <p className="hero-meta mt-12 text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            A cinematic real-time studio designing the next decade of digital experience.
          </p>
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

      {/* SERVICES GRID — sticky title, scrolling list */}
      <section className="min-h-screen px-6 md:px-20 py-32 pointer-events-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4 md:sticky md:top-32 self-start reveal">
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">Services</p>
            <h3 className="font-display text-4xl md:text-5xl tracking-[-0.03em] text-gradient leading-[1.05]">
              What we make.
            </h3>
            <p className="mt-6 text-sm text-muted-foreground max-w-xs leading-relaxed">
              A small senior team for studios, founders and brands building the next surface of the web.
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

      {/* TECH SPECS STRIP */}
      <section className="min-h-screen flex items-center px-6 md:px-20">
        <div className="w-full max-w-6xl mx-auto pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4 text-center">
            Technology
          </p>
          <h3 className="reveal font-display text-4xl md:text-6xl tracking-[-0.035em] text-gradient text-center mb-16 leading-[1.0]">
            Performance, measured.
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10">
            {[
              { k: "120", u: "fps", l: "Render" },
              { k: "0.4", u: "ms", l: "Input latency" },
              { k: "8K", u: "px", l: "Resolution" },
              { k: "∞", u: "", l: "Depth" },
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
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">Process</p>
          <h3 className="reveal font-display text-4xl md:text-6xl tracking-[-0.035em] text-gradient mb-20 max-w-2xl leading-[1.0]">
            Four acts. One continuous take.
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

      {/* CASE / IMPACT */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-32">
        <div className="max-w-6xl mx-auto w-full pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">Impact</p>
          <h3 className="reveal font-display text-4xl md:text-6xl tracking-[-0.035em] text-gradient mb-20 max-w-3xl leading-[1.0]">
            Measured in attention.
          </h3>
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
            {[
              { k: "+38%", l: "Conversion uplift", s: "Atlas launch — week one" },
              { k: "4.6×", l: "Avg. session time", s: "Helio product page" },
              { k: "98", l: "Lighthouse perf", s: "Across published work" },
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

      {/* TESTIMONIALS */}
      <section className="min-h-screen flex items-center px-6 md:px-20 py-32">
        <div className="max-w-5xl mx-auto w-full pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-4">Trusted by directors of brand & product</p>
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            {quotes.map((q, i) => (
              <figure key={i} className="reveal">
                <blockquote className="font-display text-xl md:text-2xl tracking-[-0.015em] text-foreground/90 leading-[1.35]">
                  "{q.q}"
                </blockquote>
                <figcaption className="mt-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  — {q.a}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / OUTRO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl pointer-events-auto">
          <p className="reveal text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-10">
            Now accepting two engagements for Q3 2026
          </p>
          <h2 className="reveal font-display text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.045em] font-medium text-gradient mb-12">
            Let's build the surface.
          </h2>
          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@nova.studio"
              className="glass px-8 py-4 rounded-full text-sm tracking-wide hover:bg-foreground/10 transition-all duration-500 hover:scale-[1.03]"
            >
              hello@nova.studio
            </a>
            <a
              href="#"
              className="px-8 py-4 rounded-full text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Watch the film →
            </a>
          </div>
          <div className="reveal mt-24 flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-mono">
            <span>San Francisco</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>London</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>Tokyo</span>
          </div>
          <p className="reveal mt-12 text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase">
            © Nova Studio — Built for the next decade of motion.
          </p>
        </div>
      </section>
    </div>
  );
}
