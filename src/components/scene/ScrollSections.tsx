import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    eyebrow: "Chapter 01 — Genesis",
    title: "Engineered in light.",
    body: "A surface so seamless it disappears. Every pixel calibrated, every transition orchestrated — built for the way you move through space.",
    align: "right" as const,
  },
  {
    eyebrow: "Chapter 02 — Depth",
    title: "Worlds within worlds.",
    body: "Layered geometry and parallax silence the noise. Focus moves with you, naturally, frame by frame.",
    align: "left" as const,
  },
  {
    eyebrow: "Chapter 03 — Motion",
    title: "Motion you can feel.",
    body: "GPU-accelerated choreography at 120fps. Inertia, easing, and cinematic timing — nothing rushed, nothing rigid.",
    align: "right" as const,
  },
  {
    eyebrow: "Chapter 04 — Horizon",
    title: "The future, in focus.",
    body: "A new dimension of storytelling for a new generation of products. Step in.",
    align: "left" as const,
  },
];

export default function ScrollSections() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Word-level hero reveal (kinetic typography)
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
            scrollTrigger: {
              trigger: panel,
              start: "top 75%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          },
        );

        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: panel, start: "top 70%" },
            },
          );
        }

        gsap.to(panel.querySelector(".s-inner"), {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Progress bar
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
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[55] bg-foreground/5">
        <div className="scroll-progress origin-left scale-x-0 h-full bg-gradient-to-r from-primary via-accent to-primary" />
      </div>

      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center relative">
        <div className="max-w-5xl">
          <p className="hero-meta text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-10">
            Nova / Volume 01
          </p>
          <h1 className="font-display text-[clamp(3rem,10vw,10rem)] leading-[0.92] tracking-[-0.045em] font-medium">
            <span className="hero-line block text-gradient">Beyond</span>
            <span className="hero-line block text-glow text-foreground">the surface.</span>
          </h1>
          <p className="hero-meta mt-12 text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            A cinematic experience engineered in three dimensions.
          </p>
        </div>
        <div className="hero-meta absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span>Scroll to enter</span>
          <div className="w-px h-14 bg-gradient-to-b from-foreground/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* STORY PANELS */}
      {sections.map((s, i) => (
        <section
          key={i}
          className="story-panel min-h-[120vh] flex items-center px-6 md:px-20 relative"
        >
          <div
            className={`s-inner max-w-xl pointer-events-auto ${
              s.align === "right" ? "ml-auto text-right" : "mr-auto"
            }`}
          >
            <div
              className={`s-line h-px w-24 bg-gradient-to-r from-primary to-transparent mb-8 ${
                s.align === "right" ? "ml-auto bg-gradient-to-l" : ""
              }`}
            />
            <p className="s-eyebrow text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6">
              {s.eyebrow}
            </p>
            <h2 className="s-title font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[1.0] tracking-[-0.035em] font-medium text-gradient mb-8">
              {s.title}
            </h2>
            <p className="s-body text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md">
              {s.body}
            </p>
          </div>
          <div
            className={`absolute top-10 ${
              s.align === "right" ? "left-10" : "right-10"
            } text-[10px] tracking-[0.4em] uppercase text-muted-foreground/50 hidden md:block`}
          >
            0{i + 1} / 0{sections.length}
          </div>
        </section>
      ))}

      {/* SPECS STRIP */}
      <section className="min-h-screen flex items-center px-6 md:px-20">
        <div className="w-full max-w-6xl mx-auto pointer-events-auto">
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary/80 mb-10 text-center">
            Specifications
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10">
            {[
              { k: "120", u: "fps", l: "Render" },
              { k: "0.4", u: "ms", l: "Latency" },
              { k: "8K", u: "px", l: "Resolution" },
              { k: "∞", u: "", l: "Depth" },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-background/60 backdrop-blur-xl p-8 md:p-12 group hover:bg-background/80 transition-all duration-700"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl md:text-7xl font-medium text-gradient">
                    {m.k}
                  </span>
                  <span className="text-sm text-muted-foreground">{m.u}</span>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  {m.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTRO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl pointer-events-auto">
          <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-10">
            Available 2026
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7.5vw,7rem)] leading-[0.95] tracking-[-0.045em] font-medium text-gradient mb-12">
            Step into Nova.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="glass px-8 py-4 rounded-full text-sm tracking-wide hover:bg-foreground/10 transition-all duration-500 hover:scale-[1.03]">
              Request access
            </button>
            <button className="px-8 py-4 rounded-full text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300">
              Watch film →
            </button>
          </div>
          <p className="mt-24 text-[10px] text-muted-foreground/60 tracking-[0.3em] uppercase">
            © Nova Studios — Built for the next decade of motion.
          </p>
        </div>
      </section>
    </div>
  );
}
