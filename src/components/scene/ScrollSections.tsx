import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import StorySection, { type StoryChapter } from "./StorySection";
import founderPresence from "@/assets/founder-editorial.webp";
import HeroAtmosphere from "./HeroAtmosphere";
import Interstitial from "./Interstitial";

/* ──────────────────────────────────────────────────────────────────
   Homepage = cinematic opening sequence into the larger world.
   Seven scenes. No archives. No tables. No long-form content.
   Each detailed surface lives on its own dedicated route.

   01 — Opening thesis      (HeroSection)
   02 — Founder presence    (quote + dissolved portrait)
   03 — Innovation          (StorySection · carbon intelligence)
   04 — Industrial future   (StorySection · industrial applications)
   05 — Recognition signal  (single line + link to /recognitions)
   06 — Ecosystem gateway   (constellation of routes)
   07 — Closing invitation  (Future CTA)
   ────────────────────────────────────────────────────────────────── */

const carbonChapter: StoryChapter = {
  id: "carbon-intelligence",
  eyebrow: "Material Intelligence",
  title: "Engineering intelligent matter.",
  body: "Graphene, nano-materials, coatings, additives, composites. A single sheet of carbon, manufactured cleanly and at scale, is the most under-priced strategic asset on the table this decade.",
  align: "right",
};

const industrialChapter: StoryChapter = {
  id: "industrial",
  eyebrow: "Industrial Translation",
  title: "One lattice. Many industries.",
  body: "Solar coatings, batteries that charge in minutes, polymer additives, climate infrastructure — each a downstream of the same material platform.",
  align: "left",
};

const gateways = [
  { to: "/about", n: "I", label: "About", line: "Founder, philosophy, journey." },
  { to: "/innovations", n: "II", label: "Innovations", line: "Graphene, materials, systems." },
  { to: "/ventures", n: "III", label: "Ventures", line: "Five operating companies. One stack." },
  { to: "/recognitions", n: "IV", label: "Recognitions", line: "Six Presidential awards. TED. MIT TR." },
  { to: "/essays", n: "V", label: "Essays", line: "Notes from the workshop." },
  { to: "/engage", n: "VI", label: "Engage", line: "Partnerships, advisory, and origin archive." },
  { to: "/news", n: "VII", label: "News", line: "Editorial archive." },
] as const;

function HeroSection({ scrollY, scrollYProgress }: { scrollY: ReturnType<typeof useScroll>["scrollY"]; scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  return (
    <section
      id="spark"
      className="relative min-h-[calc(var(--viewport-height)*1.12)] px-5 sm:px-6 lg:pl-32 xl:pl-36"
    >
      <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center overflow-clip text-center pt-32 md:pt-28 pb-16 render-stable">
        <HeroAtmosphere />

        {/* Restrained volumetric key — a single cool beam, very low opacity,
            drifting almost imperceptibly. Adds cinematic depth without
            gradient noise or glow. */}
        {/* Restrained volumetric key — opacity-only to stay GPU-composited */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 42% 58% at 50% 38%, oklch(0.62 0.04 232 / 0.12), transparent 70%)",
            willChange: "opacity",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
          animate={{ opacity: [0.28, 0.48, 0.28] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 18% 70% at 50% 50%, oklch(0.72 0.05 232 / 0.07), transparent 75%)",
            willChange: "opacity",
          }}
        />

        {/* Atmospheric vignette — deep ink falloff on all edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.025 0 0) 0%, transparent 30%, transparent 62%, oklch(0.022 0.004 232 / 0.94) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 74% 64% at 50% 48%, transparent 46%, oklch(0.022 0 0 / 0.80) 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl pointer-events-auto" style={{ transform: "translateX(-2vw)" }}>
          {/* Eyebrow — archival corner mark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-10 md:mb-12 flex items-center justify-center gap-3"
          >
            <span className="h-px w-8 bg-foreground/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground/80">
              Origin
            </span>
            <span className="h-px w-8 bg-foreground/20" />
          </motion.div>

          <motion.h1 className="font-display text-[clamp(2.2rem,7.8vw,6.5rem)] leading-[1.02] md:leading-[0.98] tracking-[-0.035em] md:tracking-[-0.04em] font-medium">
            {[
              { text: "I build", delay: 0.2 },
              { text: "what does not", delay: 0.36 },
              { text: "yet exist.", delay: 0.52 },
            ].map((line, index) => (
              <motion.span
                key={line.text}
                initial={{ opacity: 0, y: 56, filter: "blur(16px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: line.delay, ease: [0.19, 1, 0.22, 1] }}
                className={`block py-1 ${index < 2 ? "text-gradient" : "text-foreground/95"}`}
              >
                {line.text}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle hierarchy — primary line, then a quieted credential register */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.05, delay: 0.78, ease: [0.19, 1, 0.22, 1] }}
            className="mx-auto mt-14 md:mt-20 max-w-xl"
          >
            <p className="font-display text-[14.5px] md:text-[16px] leading-[1.6] tracking-[-0.005em] text-foreground/80">
              Inventor and deep-tech founder.<br className="hidden md:inline" />
              <span className="text-foreground/55">Building from India — for the world.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-muted-foreground/50">
              <span className="hidden sm:block h-px w-8 bg-foreground/12" />
              <span>Six-time Presidential awardee</span>
              <span className="h-px w-1 bg-foreground/20" />
              <span>TED · MIT TR-35</span>
              <span className="hidden sm:block h-px w-8 bg-foreground/12" />
            </div>
          </motion.div>
        </div>

        <ScrollCue scrollY={scrollY} />
      </div>
    </section>
  );
}

/* ───────────── Scroll cue — cinematic, restrained, accessible ───────────── */
function ScrollCue({ scrollY }: { scrollY: ReturnType<typeof useScroll>["scrollY"] }) {
  const prefersReducedMotion = useReducedMotion();
  // Fade out within the first ~40% of the hero viewport.
  const opacity = useTransform(scrollY, [0, 220, 420], [1, 0.45, 0]);
  const pointerEvents = useTransform(scrollY, (v) => (v > 380 ? "none" : "auto"));

  const handleClick = () => {
    const target = document.getElementById("founder");
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to next section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 1.6 }}
      style={{ opacity, pointerEvents, mixBlendMode: "soft-light" }}
      className="group absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-5 bg-transparent p-2 text-[9.5px] font-extralight uppercase tracking-[0.5em] text-muted-foreground/45 transition-colors duration-700 hover:text-foreground/70 focus-visible:outline-none focus-visible:text-foreground/75"
    >
      <span className="blur-[0.3px]">Scroll</span>
      <motion.span
        aria-hidden
        className="block h-16 w-px origin-top bg-gradient-to-b from-foreground/22 via-foreground/12 to-transparent"
        animate={
          prefersReducedMotion
            ? { opacity: 0.22 }
            : { opacity: [0.12, 0.38, 0.12], scaleY: [1, 1.12, 1] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
        }
      />
      <motion.span
        aria-hidden
        className="-mt-3 block h-1.5 w-1.5 rotate-45 border-b border-r border-foreground/35"
        animate={
          prefersReducedMotion
            ? { opacity: 0.45 }
            : { y: [0, 6, 0], opacity: [0.35, 0.65, 0.35] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
        }
      />
    </motion.button>
  );
}


function ScrollProgressBar({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 32, mass: 0.5 });
  return (
    <div className="fixed left-0 right-0 top-0 z-[55] h-px bg-foreground/[0.04]" style={{ willChange: "transform" }}>
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          willChange: "transform",
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.02 232 / 0.55) 35%, oklch(0.86 0.02 232 / 0.72) 65%, transparent)",
        }}
      />
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
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2, once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 26 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: prefersReducedMotion ? 0.01 : 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────── Scene 02 — Founder presence (mystery atmospheric layer) ─────────────
 * The portrait is NOT a plate, card, or rectangular image. It dissolves
 * into the industrial darkness as an environmental presence — faintly
 * legible, edge-lit, masked to a soft elliptical halo, heavily vignetted
 * and blurred at the margins. The Voice quote sits on top as the only
 * resolved foreground element.
 * ─────────────────────────────────────────────────────────────────────── */
function FounderScene() {
  return (
    <section
      id="founder"
      className="relative isolate min-h-[calc(var(--viewport-height)*1.1)] flex items-center overflow-hidden px-5 sm:px-6 lg:pl-32 xl:pl-36 py-32 md:py-44"
    >
      {/* Founder presence — dissolved into industrial darkness. Silhouette,
          glasses, and jawline barely legible; edge-lit by a cool key from
          the upper-left and a faint copper rim from the right. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Graphite-black base atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_30%_48%,oklch(0.07_0_0)_0%,oklch(0.035_0_0)_55%,oklch(0.015_0_0)_100%)]" />

        {/* The portrait — concealed but cinematically intelligent: eyes,
            glasses, facial contour and blazer edge selectively legible.
            Mystery preserved through deep crush + edge fade. */}
        <div
          aria-hidden
          className="absolute inset-y-[2%] left-0 w-[68%] md:w-[54%] lg:w-[46%] bg-center bg-no-repeat bg-cover opacity-[0.24] md:opacity-[0.27] [filter:grayscale(1)_contrast(1.04)_brightness(0.58)_saturate(1)_blur(2.2px)] [mask-image:radial-gradient(ellipse_52%_62%_at_38%_40%,#000_18%,rgba(0,0,0,0.82)_44%,rgba(0,0,0,0.32)_68%,transparent_92%)] [-webkit-mask-image:radial-gradient(ellipse_52%_62%_at_38%_40%,#000_18%,rgba(0,0,0,0.82)_44%,rgba(0,0,0,0.32)_68%,transparent_92%)]"
          style={{ backgroundImage: `url(${founderPresence})`, backgroundPosition: "center 28%" }}
        />

        {/* Softened lower torso — reduces clothing fold visibility, preserves face */}
        <div
          aria-hidden
          className="absolute left-0 bottom-0 w-[68%] md:w-[54%] lg:w-[46%] h-[55%] [mask-image:linear-gradient(180deg,transparent_0%,#000_55%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_55%)] bg-center bg-no-repeat bg-cover opacity-[0.28] md:opacity-[0.30] [filter:grayscale(1)_contrast(0.90)_brightness(0.56)_saturate(0)_blur(3.2px)]"
          style={{ backgroundImage: `url(${founderPresence})`, backgroundPosition: "center 78%" }}
        />

        {/* Subtle cool blue-grey rim — jawline / shoulders / glasses edges */}
        <div className="absolute inset-1 mix-blend-screen bg-[radial-gradient(ellipse_6%_5%_at_25%_31%,oklch(0.80_0.015_232/0.12),transparent_78%)]" />
        <div className="absolute inset-1 mix-blend-soft-light bg-[radial-gradient(ellipse_18%_24%_at_28%_36%,oklch(0.70_0.015_232/0.15),transparent_75%)]" />
        <div className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_20%_22%_at_21%_59%,oklch(0.58_0.015_232/0.09),transparent_78%)]" />
        <div className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_10%_14%_at_30%_22%,oklch(0.76_0.02_232/0.066),transparent_82%)]" />

        {/* Atmospheric haze — softens shoulders and body into the black */}
        <div className="absolute inset-y-[8%] left-[-2%] w-[52%] mix-blend-multiply bg-[radial-gradient(ellipse_70%_60%_at_38%_60%,transparent_30%,oklch(0.02_0_0/0.46)_72%,oklch(0.015_0_0)_100%)]" />

        {/* Center atmospheric depth — graphite haze + restrained warm/cool bloom */}
        <div className="absolute inset-y-[14%] left-[34%] w-[40%] mix-blend-screen bg-[radial-gradient(ellipse_70%_62%_at_50%_50%,oklch(0.38_0.018_232/0.14),transparent_78%)] blur-3xl" />
        <div className="absolute inset-y-[22%] left-[42%] w-[26%] mix-blend-soft-light bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,oklch(0.58_0.04_232/0.12),transparent_75%)] blur-2xl" />
        <div className="absolute inset-y-[30%] left-[46%] w-[22%] mix-blend-screen bg-[radial-gradient(ellipse_55%_50%_at_55%_55%,oklch(0.52_0.06_55/0.07),transparent_78%)] blur-3xl" />

        {/* Right-side lift — restores a faint structural presence on the
            right (atmospheric, not portrait) so the frame stops feeling
            left-heavy. Very low opacity, soft-light blend. */}
        <div className="absolute inset-y-[18%] right-[6%] w-[34%] mix-blend-soft-light bg-[radial-gradient(ellipse_60%_55%_at_60%_50%,oklch(0.50_0.02_232/0.12),transparent_78%)] blur-3xl" />
        <div className="absolute inset-y-[28%] right-[10%] w-[22%] mix-blend-screen bg-[radial-gradient(ellipse_50%_45%_at_55%_50%,oklch(0.58_0.03_232/0.06),transparent_80%)] blur-2xl" />

        {/* Faint molecular texture across the center void */}
        <div
          aria-hidden
          className="absolute inset-y-[10%] left-[32%] w-[44%] opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0.5px, transparent 1.2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.5) 0.5px, transparent 1.2px), radial-gradient(circle at 45% 80%, rgba(255,255,255,0.5) 0.5px, transparent 1.2px)",
            backgroundSize: "120px 120px, 180px 180px, 90px 90px",
            filter: "blur(0.4px)",
          }}
        />


        {/* Cinematic falloff — smoothed, less left-weighted */}
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,oklch(0.018_0_0)_88%)]" />
        <div className="absolute inset-y-0 right-0 w-[58%] bg-[linear-gradient(270deg,oklch(0.018_0_0)_14%,oklch(0.025_0_0/0.42)_54%,transparent_96%)]" />
        <div className="absolute inset-y-0 left-0 w-[8%] bg-[linear-gradient(90deg,oklch(0.018_0_0)_6%,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-[18%] bg-[linear-gradient(180deg,oklch(0.018_0_0)_8%,transparent)]" />
      </div>

      {/* Faint lattice particles — extremely low opacity, drifting motes
          between portrait and quote, reinforcing the material atmosphere. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        {[
          { x: "32%", y: "28%", d: 32, delay: 0 },
          { x: "44%", y: "52%", d: 38, delay: 5 },
          { x: "38%", y: "70%", d: 30, delay: 9 },
          { x: "52%", y: "38%", d: 36, delay: 2 },
          { x: "28%", y: "62%", d: 34, delay: 7 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-foreground/40"
            style={{ left: p.x, top: p.y, filter: "blur(0.7px)" }}
            animate={{
              opacity: [0, 0.4, 0.18, 0.35, 0],
              y: [0, -14, -28, -44, -60],
              x: [0, 3, -2, 4, 0],
            }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>

      <p className="pointer-events-none absolute top-10 left-[8%] z-10 font-mono text-[10px] uppercase tracking-[0.55em] text-muted-foreground/25 blur-[0.3px]">
        Founder
      </p>

      <div className="relative mx-auto grid w-full max-w-6xl md:grid-cols-12 pointer-events-auto">
        <MotionReveal delay={0.12} className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Founder · Voice
          </p>
          <blockquote className="font-display text-2xl leading-[1.19] tracking-[-0.025em] text-gradient md:text-3xl lg:text-[2.4rem] whitespace-pre-line">
            {"The future is not imagined.\nIt is engineered quietly."}
          </blockquote>
          <div className="mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45">
            <span className="h-px w-10 bg-gradient-to-r from-foreground/25 to-transparent" />
            <span>Sushanth Paatnaik</span>
          </div>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-foreground/70 hover:text-foreground transition-colors"
          >
            Read the journey
            <span className="text-[10px] opacity-70">→</span>
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}

/* ───────────── Scene 05 — Recognition signal ───────────── */
function RecognitionSignal() {
  return (
    <section
      id="recognition"
      className="relative min-h-[calc(var(--viewport-height)*0.95)] flex items-center px-5 sm:px-6 lg:pl-32 xl:pl-36 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.18_0.012_232/0.10),transparent_72%)]" />
      <div className="relative mx-auto w-full max-w-4xl text-center pointer-events-auto" style={{ transform: "translateX(-1vw)" }}>
        <MotionReveal>
          <p className="mb-8 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Recognition
          </p>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.035em] text-gradient">
            Recognised early.<br className="hidden md:inline" /> Responsible forever.
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.18}>
          <p className="mx-auto mt-10 max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
            Six Indian Presidential awards. NIF-India IGNITE. TED-India. MIT Technology Review. India Today. The record exists. The next prototype matters more.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.28}>
          <Link
            to="/recognitions"
            className="mt-12 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-foreground/75 hover:text-foreground transition-colors"
          >
            Open the archive
            <span className="text-[10px] opacity-70">→</span>
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}

/* ───────────── Scene 06 — Ecosystem gateway ───────────── */
function EcosystemGateway() {
  return (
    <section
      id="ecosystem"
      className="relative min-h-[calc(var(--viewport-height)*1.1)] flex items-center px-5 sm:px-6 lg:pl-32 xl:pl-36 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_65%_45%,oklch(0.18_0.012_232/0.10),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.5),transparent_18%,transparent_82%,oklch(0.03_0_0/0.55))]" />
      {/* Bottom vignette — fades the section smoothly into the space transition below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(to_bottom,transparent,oklch(0.02_0.008_232/0.72))]" />
      <div className="relative mx-auto w-full max-w-6xl pointer-events-auto mt-7">
        <MotionReveal className="max-w-3xl">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Ecosystem
          </p>
          <h2 className="font-display text-[clamp(2.2rem,7.5vw,4.75rem)] leading-[1] tracking-[-0.04em] text-gradient">
            Seven thresholds into the work.
          </h2>
          <p className="mt-8 max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground/85">
            The homepage is the opening sequence. The ecosystem lives behind these doors — each one its own cinematic world.
          </p>
        </MotionReveal>

        <ul className="mt-16 md:mt-24 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {gateways.map((g, i) => (
            <MotionReveal key={g.to} delay={i * 0.04}>
              <Link
                to={g.to}
                className="group block border-t border-foreground/[0.08] py-6 transition-colors duration-500 hover:border-foreground/30"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 w-6">
                    {g.n}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl md:text-2xl tracking-[-0.015em] text-foreground/90 transition-colors duration-500 group-hover:text-gradient">
                      {g.label}
                    </h3>
                    <p className="mt-1.5 text-[13px] text-muted-foreground/70">
                      {g.line}
                    </p>
                  </div>
                  <span className="text-foreground/40 transition-all duration-500 group-hover:text-foreground/80 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </MotionReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Scene 07 — Closing invitation ───────────── */
function ClosingInvitation() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      id="future"
      className="relative h-[var(--viewport-height)] min-h-[540px] px-5 sm:px-6 text-center pt-24 pb-8 md:pt-28 md:pb-10 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: prefersReducedMotion ? 1 : 0.88 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Architectural system node — restrained, integrated, atmospheric. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >

        {/* Volumetric atmospheric diffusion — GPU-promoted, opacity-only animation */}
        <motion.div
          className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[120%] h-[44%]"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, oklch(0.50 0.022 232 / 0.10), transparent 72%)",
            filter: "blur(40px)",
            mixBlendMode: "screen",
            willChange: "opacity",
            contain: "paint layout",
          }}
          animate={{ opacity: [0.45, 0.62, 0.45] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />



        {/* Planetary shimmer — static, GPU-isolated */}
        <div
          className="absolute left-1/2 top-1/2 h-[72vh] w-[72vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, oklch(0.62 0.04 232 / 0.022), transparent 60%), radial-gradient(ellipse at 70% 60%, oklch(0.62 0.04 232 / 0.018), transparent 60%)",
            filter: "blur(36px)",
            mixBlendMode: "screen",
            contain: "paint layout",
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.018 0.005 250 / 0.42) 55%, oklch(0.014 0.004 250 / 0.86) 100%)",
          }}
        />

        {/* Atmospheric horizon glow — traces planetary limb, no blue saturation */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0"
          style={{
            bottom: "19%",
            height: "72px",
            background:
              "radial-gradient(ellipse 65% 100% at 50% 100%, oklch(0.50 0.038 232 / 0.22), transparent 80%)",
            filter: "blur(18px)",
          }}
        />

      </div>
      <div className="relative z-10 max-w-3xl pointer-events-auto" style={{ transform: "translateX(-1.5vw)" }}>
        <MotionReveal delay={0.35}>
          <p className="mb-4 md:mb-5 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground">
            Future Systems
          </p>
        </MotionReveal>
        <MotionReveal delay={0.44}>
          <p className="mx-auto mb-8 md:mb-10 max-w-xl font-display italic text-[14px] md:text-[15px] leading-[1.65] text-foreground/55">
            Not a forecast. A working hypothesis — built one industrial system at a time.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.54}>
          <h2
            className="mb-5 md:mb-7 font-display text-[clamp(1.75rem,5.4vw,4.2rem)] leading-[1.05] md:leading-[1.02] tracking-[-0.03em] md:tracking-[-0.035em] font-medium text-gradient [text-wrap:balance]"
            style={{
              textRendering: "geometricPrecision",
              WebkitFontSmoothing: "antialiased",
              textShadow:
                "0 1px 14px oklch(0.05 0.012 240 / 0.45), 0 0 0.5px oklch(0.98 0.008 232 / 0.32)",
            }}
          >
            Energy as infrastructure.<br /> Industry at planetary scale.
          </h2>

        </MotionReveal>
        <MotionReveal delay={0.66}>
          <p className="mx-auto mb-8 md:mb-10 max-w-[540px] text-[14px] md:text-[15.5px] leading-[1.7] text-foreground/75">
            The next century is not science fiction. It is calibrated alloys, intelligent grids, water systems, hydrogen logistics, and quietly engineered materials shaping the floor of every industry. The work is restrained, technical, and inevitable.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.78}>
          <div className="closing-cta-row flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link to="/contact" className="btn-cinematic btn-cinematic-atmospheric">
              Begin a conversation
            </Link>
            <Link to="/engage" className="btn-cinematic-secondary">
              Engage <span className="text-[10px] opacity-60">→</span>
            </Link>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.88}>
          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-9 font-mono text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/45">
            <span>Advanced Materials</span>
            <span className="h-[3px] w-[3px] rounded-full bg-primary/60" />
            <span>Energy Systems</span>
            <span className="h-[3px] w-[3px] rounded-full bg-accent/60" />
            <span>Planetary Infrastructure</span>
          </div>
        </MotionReveal>
        <MotionReveal delay={1.0}>
          <div className="relative mt-4 md:mt-6 inline-block">
            {/* Faint atmospheric backlight behind the archival signature */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-x-12 -inset-y-3 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 70% 100% at 50% 50%, oklch(0.46 0.018 232 / 0.24), transparent 76%)",
                filter: "blur(22px)",
              }}
            />
            <p
              className="text-[10.5px] font-extralight uppercase tracking-[0.4em] text-foreground/70"
              style={{
                textShadow: "0 1px 14px oklch(0.04 0.008 240 / 0.7)",
              }}
            >
              © Sushanth Paatnaik — Building systems for industrial futures and material intelligence.
            </p>
          </div>
        </MotionReveal>
      </div>
    </motion.section>
  );
}

export default function ScrollSections() {
  const totalChapters = 7;
  const { scrollY, scrollYProgress } = useScroll();
  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar scrollYProgress={scrollYProgress} />

      {/* 01 — Opening thesis */}
      <HeroSection scrollY={scrollY} scrollYProgress={scrollYProgress} />

      {/* 02 — Founder presence */}
      <FounderScene />

      {/* Interlude — material thesis */}
      <Interstitial line="Ideas entered industry." />

      {/* 03 — Innovation philosophy */}
      <StorySection chapter={carbonChapter} index={3} total={totalChapters} />

      {/* 04 — Industrial future vision */}
      <StorySection chapter={industrialChapter} index={4} total={totalChapters} />

      {/* Interlude — research evolved */}
      <Interstitial line="Research evolved into infrastructure." />

      {/* 05 — Recognition signal */}
      <RecognitionSignal />

      {/* Interlude — recognition followed */}
      <Interstitial line="Recognition followed the prototypes." />

      {/* 06 — Ecosystem gateway */}
      <EcosystemGateway />

      {/* Breathing pause — one intentional moment of stillness */}
      <Interstitial
        pause
        line={"The future is not imagined.\nIt is engineered quietly."}
      />

      {/* 07 — Closing invitation */}
      <ClosingInvitation />
    </div>
  );
}
