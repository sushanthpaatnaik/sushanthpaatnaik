import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    eyebrow: "Chapter 01",
    title: "Engineered in light.",
    body: "A surface so seamless it disappears. Every pixel calibrated, every transition orchestrated — built for the way you move.",
  },
  {
    eyebrow: "Chapter 02",
    title: "Depth, redefined.",
    body: "Layered geometry and parallax silence the noise. Focus moves with you, naturally, frame by frame.",
  },
  {
    eyebrow: "Chapter 03",
    title: "Motion you can feel.",
    body: "GPU-accelerated choreography at 120fps. Inertia, easing, and cinematic timing — nothing rushed, nothing rigid.",
  },
  {
    eyebrow: "Chapter 04",
    title: "The future, in focus.",
    body: "A new dimension of storytelling for a new generation of products. Step in.",
  },
];

export default function ScrollSections() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-panel").forEach((panel) => {
        const eyebrow = panel.querySelector(".s-eyebrow");
        const title = panel.querySelector(".s-title");
        const body = panel.querySelector(".s-body");

        gsap.fromTo(
          [eyebrow, title, body],
          { y: 60, opacity: 0, filter: "blur(12px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: panel,
              start: "top 70%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          },
        );

        gsap.to(panel.querySelector(".s-inner"), {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Hero intro
      gsap.fromTo(
        ".hero-line",
        { y: 80, opacity: 0, filter: "blur(20px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.6,
          ease: "expo.out",
          stagger: 0.15,
          delay: 0.2,
        },
      );

      gsap.fromTo(
        ".hero-meta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: "power2.out" },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative z-10 pointer-events-none">
      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-5xl">
          <p className="hero-meta text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8">
            Nova / Volume 01
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.95] tracking-[-0.04em] font-medium">
            <span className="hero-line block text-gradient">Beyond</span>
            <span className="hero-line block text-glow text-foreground">the surface.</span>
          </h1>
          <p className="hero-meta mt-10 text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            A cinematic experience engineered in three dimensions.
          </p>
        </div>
        <div className="hero-meta absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* STORY PANELS */}
      {sections.map((s, i) => (
        <section
          key={i}
          className="story-panel min-h-screen flex items-center px-6 md:px-16"
        >
          <div
            className={`s-inner max-w-xl pointer-events-auto ${
              i % 2 === 0 ? "ml-auto text-right" : "mr-auto"
            }`}
          >
            <p className="s-eyebrow text-xs uppercase tracking-[0.4em] text-primary/80 mb-6">
              {s.eyebrow}
            </p>
            <h2 className="s-title font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em] font-medium text-gradient mb-6">
              {s.title}
            </h2>
            <p className="s-body text-base md:text-lg text-muted-foreground leading-relaxed">
              {s.body}
            </p>
          </div>
        </section>
      ))}

      {/* OUTRO */}
      <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl pointer-events-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8">
            Available 2026
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.04em] font-medium text-gradient mb-10">
            Step into Nova.
          </h2>
          <div className="flex items-center justify-center gap-4">
            <button className="glass px-8 py-4 rounded-full text-sm tracking-wide hover:bg-foreground/10 transition-all duration-500 hover:scale-[1.02]">
              Request access
            </button>
            <button className="px-8 py-4 rounded-full text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300">
              Watch film →
            </button>
          </div>
          <p className="mt-20 text-xs text-muted-foreground/60 tracking-wider">
            © Nova Studios — Built for the next decade of motion.
          </p>
        </div>
      </section>
    </div>
  );
}
