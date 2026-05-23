import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import StorySection, { type StoryChapter } from "./StorySection";
import founderPresence from "@/assets/founder-editorial.webp";
import inHisWordsBackdrop from "@/assets/scene-in-his-words.webp";
import HeroAtmosphere from "./HeroAtmosphere";

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
  eyebrow: "03 — Carbon Intelligence",
  title: "Engineering intelligent matter.",
  body: "Graphene, nano-materials, coatings, additives, composites. A single sheet of carbon, manufactured cleanly and at scale, is the most under-priced strategic asset on the table this decade.",
  align: "right",
};

const industrialChapter: StoryChapter = {
  id: "industrial",
  eyebrow: "04 — Industrial Future",
  title: "One lattice. Many industries.",
  body: "Solar coatings, batteries that charge in minutes, polymer additives, climate infrastructure — each a downstream of the same material platform.",
  align: "left",
};

const gateways = [
  { to: "/about", n: "I", label: "About", line: "Founder, philosophy, journey." },
  { to: "/innovations", n: "II", label: "Innovations", line: "Graphene, materials, systems." },
  { to: "/ventures", n: "III", label: "Ventures", line: "Five operating companies. One stack." },
  { to: "/recognitions", n: "IV", label: "Recognitions", line: "Six Presidential awards. TED. MIT TR." },
  { to: "/early-works", n: "V", label: "Early Works", line: "The workshop years." },
  { to: "/essays", n: "VI", label: "Essays", line: "Notes from the workshop." },
  { to: "/engage", n: "VII", label: "Engage", line: "Partnerships and advisory." },
  { to: "/news", n: "VIII", label: "News", line: "Editorial archive." },
] as const;

function HeroSection() {
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
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.55, 0.78, 0.55] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 42% 58% at 50% 38%, oklch(0.62 0.04 232 / 0.10), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
          animate={{ x: [-12, 14, -12], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 18% 70% at 50% 50%, oklch(0.72 0.05 232 / 0.07), transparent 75%)",
            filter: "blur(8px)",
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

        <div className="relative z-10 max-w-4xl pointer-events-auto">
          {/* Eyebrow — archival corner mark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-10 md:mb-12 flex items-center justify-center gap-3"
          >
            <span className="h-px w-8 bg-foreground/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground/80">
              01 — Spark
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
            <div className="mt-10 flex items-center justify-center gap-4 font-mono text-[9.5px] uppercase tracking-[0.45em] text-muted-foreground/50">
              <span className="h-px w-8 bg-foreground/12" />
              <span>Six-time Presidential awardee</span>
              <span className="h-px w-1 bg-foreground/20" />
              <span>TED · MIT TR-35</span>
              <span className="h-px w-8 bg-foreground/12" />
            </div>
          </motion.div>
        </div>

        <ScrollCue />
      </div>
    </section>
  );
}

/* ───────────── Scroll cue — cinematic, restrained, accessible ───────────── */
function ScrollCue() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
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


function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 32, mass: 0.5 });
  return (
    <div className="fixed left-0 right-0 top-0 z-[55] h-px bg-foreground/[0.04]">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
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
  const inView = useInView(ref, { amount: 0.2, once: false });
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
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
          className="absolute inset-y-[2%] left-[-3%] w-[72%] md:w-[54%] lg:w-[46%] bg-center bg-no-repeat bg-cover opacity-[0.24] md:opacity-[0.27] [filter:grayscale(1)_contrast(1.04)_brightness(0.58)_saturate(1)_blur(2.2px)] [mask-image:radial-gradient(ellipse_52%_62%_at_38%_40%,#000_18%,rgba(0,0,0,0.82)_44%,rgba(0,0,0,0.32)_68%,transparent_92%)] [-webkit-mask-image:radial-gradient(ellipse_52%_62%_at_38%_40%,#000_18%,rgba(0,0,0,0.82)_44%,rgba(0,0,0,0.32)_68%,transparent_92%)]"
          style={{ backgroundImage: `url(${founderPresence})`, backgroundPosition: "center 28%" }}
        />

        {/* Softened lower torso — reduces clothing fold visibility, preserves face */}
        <div
          aria-hidden
          className="absolute left-[-3%] bottom-0 w-[72%] md:w-[54%] lg:w-[46%] h-[55%] [mask-image:linear-gradient(180deg,transparent_0%,#000_55%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,#000_55%)] bg-center bg-no-repeat bg-cover opacity-[0.28] md:opacity-[0.30] [filter:grayscale(1)_contrast(0.90)_brightness(0.56)_saturate(0)_blur(3.2px)]"
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
        02 — Founder
      </p>

      <div className="relative mx-auto grid w-full max-w-6xl md:grid-cols-12 pointer-events-auto">
        <MotionReveal delay={0.12} className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Founder · Voice
          </p>
          <blockquote className="font-display text-2xl leading-[1.19] tracking-[-0.025em] text-gradient md:text-3xl lg:text-[2.4rem]">
            "The most important specification on any drawing I make is the human being it is meant for."
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
      <div className="relative mx-auto w-full max-w-4xl text-center pointer-events-auto">
        <MotionReveal>
          <p className="mb-8 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            05 — Recognition Signal
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,oklch(0.18_0.012_232/0.10),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.5),transparent_18%,transparent_82%,oklch(0.03_0_0/0.55))]" />
      <div className="relative mx-auto w-full max-w-6xl pointer-events-auto">
        <MotionReveal className="max-w-3xl">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            06 — Enter the Ecosystem
          </p>
          <h2 className="font-display text-[clamp(2.2rem,7.5vw,4.75rem)] leading-[1] tracking-[-0.04em] text-gradient">
            Eight thresholds into the work.
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

/* ───────────── Scene 07 — Scale & Validation (cinematic proof layer) ─────────────
 * The Numbers ledger reimagined as a narrative validation checkpoint inside
 * the storyline rail. Not a KPI dashboard — oversized editorial numerals,
 * blueprint overlays, restrained kinetic counters, deep industrial dark.
 * The scale of the work becoming measurable, mid-journey.
 * ─────────────────────────────────────────────────────────────────────── */
const proofSignals: { n: string; v: string; suffix?: string; l: string; note: string }[] = [
  { n: "i.",   v: "06",  l: "Presidential Recognitions",   note: "Honored across three Presidents of India — IGNITE, NIF, National Inspire." },
  { n: "ii.",  v: "18",  l: "Publications of Record",      note: "India Today, Times of India, MIT Tech Review, The Telegraph, Deccan Chronicle, Global Indian." },
  { n: "iii.", v: "15", suffix: "+", l: "Years of Research",    note: "From a teenage IGNITE awardee to deep-tech operating-group architect." },
  { n: "iv.",  v: "30", suffix: "+", l: "Innovations",          note: "Patented and in-process — coatings, energy, water, defense, mobility, construction." },
  { n: "v.",   v: "10", suffix: "+", l: "Industrial Sectors",   note: "Graphene-anchored materials shipped into operating ventures across the stack." },
  { n: "vi.",  v: "12", suffix: "+", l: "Deep-Tech Ventures",   note: "MonoAtom, DRIIV, and partner industrial vehicles carrying frontier matter to product." },
  { n: "vii.", v: "60", suffix: "+", l: "Institutional Talks",  note: "TED-India · MIT · IITs · British High Commission · BRICS · Silicon Valley." },
  { n: "viii.",v: "40", suffix: "+", l: "Global Media Features",note: "An editorial record across two decades of invention." },
];

function ScaleValidationScene() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const latticeRot = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <section
      ref={sectionRef}
      id="scale-validation"
      className="relative min-h-[calc(var(--viewport-height)*1.5)] px-5 sm:px-6 lg:pl-32 xl:pl-36 py-32 md:py-44 overflow-hidden"
    >
      {/* ─── Atmospheric backdrop — industrial blueprint mood ─────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[oklch(0.014_0_0)]" />

        {/* Faint blueprint grid — measurement / evidence architecture */}
        <motion.div
          className="absolute inset-0 opacity-[0.055] mix-blend-screen"
          style={{
            y: prefersReducedMotion ? 0 : bgY,
            backgroundImage:
              "linear-gradient(oklch(0.62 0.02 232 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.02 232 / 0.5) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 88%)",
          }}
        />

        {/* Hex lattice — slow rotation reinforces material substrate */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] opacity-[0.04] mix-blend-screen"
          style={{
            rotate: prefersReducedMotion ? 0 : latticeRot,
            backgroundImage:
              "radial-gradient(circle at center, oklch(0.78 0.02 232 / 0.5) 0.6px, transparent 1.4px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 55% 50% at 50% 50%, #000 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 50% at 50% 50%, #000 25%, transparent 78%)",
          }}
        />

        {/* Cool industrial key from above */}
        <div className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_45%_40%_at_50%_0%,oklch(0.58_0.04_232/0.18),transparent_72%)]" />

        {/* Deep base shadow */}
        <div className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,oklch(0.04_0.006_232/0.85),transparent_78%)]" />

        {/* Cinematic grain */}
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0.5px, transparent 1.2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.5) 0.5px, transparent 1.2px), radial-gradient(circle at 45% 80%, rgba(255,255,255,0.5) 0.5px, transparent 1.2px)",
            backgroundSize: "140px 140px, 200px 200px, 110px 110px",
            filter: "blur(0.4px)",
          }}
        />

        {/* Top/bottom continuity falloff into adjacent scenes */}
        <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,oklch(0.014_0_0)_14%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,transparent,oklch(0.014_0_0)_94%)]" />
      </div>

      {/* Chapter mark */}
      <div className="relative mx-auto w-full max-w-6xl pointer-events-auto">
        <MotionReveal>
          <div className="mb-14 md:mb-20 flex items-center gap-4">
            <span className="h-px w-10 bg-foreground/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-primary/80">
              07 — Scale &amp; Validation
            </span>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.06}>
          <h2 className="max-w-4xl font-display text-[clamp(1.9rem,5.8vw,3.6rem)] leading-[1.05] tracking-[-0.035em] text-gradient [text-wrap:balance]">
            The arc, measured.
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.14}>
          <p className="mt-8 max-w-xl text-[13px] md:text-[14.5px] leading-[1.7] text-foreground/65">
            Two decades of invention and industrial reach, distilled into eight signals of record. Not metrics. Evidence.
          </p>
        </MotionReveal>

        {/* Proof grid — oversized numerals, restrained editorial cadence */}
        <ul className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-x-14 lg:gap-x-20 gap-y-0">
          {proofSignals.map((s, i) => (
            <MotionReveal key={s.l} delay={0.04 + (i % 2) * 0.05}>
              <li className="group grid grid-cols-[auto_1fr] items-baseline gap-x-8 border-t border-foreground/[0.08] py-10 md:py-12 transition-colors duration-700 hover:border-foreground/25">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45 pt-3 w-10">
                  {s.n}
                </span>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extralight text-[clamp(3rem,8vw,5.4rem)] leading-[0.92] tracking-[-0.05em] text-gradient">
                      {s.v}
                    </span>
                    {s.suffix && (
                      <span className="font-display font-extralight text-[clamp(1.4rem,3vw,2rem)] leading-none tracking-[-0.04em] text-foreground/55">
                        {s.suffix}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-[15px] md:text-[16px] uppercase tracking-[0.22em] text-foreground/85">
                    {s.l}
                  </h3>
                  <p className="mt-3 max-w-md text-[13px] leading-[1.7] text-foreground/55">
                    {s.note}
                  </p>
                </div>
              </li>
            </MotionReveal>
          ))}
        </ul>

        {/* Footer — handoff into In His Words */}
        <MotionReveal delay={0.16}>
          <div className="mt-24 md:mt-32 flex items-center gap-4">
            <span className="h-px flex-1 bg-foreground/[0.08]" />
            <Link
              to="/numbers"
              className="font-mono text-[10px] uppercase tracking-[0.45em] text-foreground/65 hover:text-foreground transition-colors"
            >
              Open the full ledger →
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

/* ───────────── Scene 08 — In His Words (reflective philosophical chapter) ─────────────
 * A cinematic pause before the closing Future scene. Founder voice as
 * philosophical fragments, not articles — oversized editorial typography,
 * generous negative space, slow reveal pacing, restrained atmosphere.
 * ─────────────────────────────────────────────────────────────────────── */
const fragments = [
  {
    n: "i.",
    line: "A material is a decision compressed into atoms.",
    note: "On engineering as moral act.",
  },
  {
    n: "ii.",
    line: "The grid is not infrastructure. It is the country's nervous system.",
    note: "On energy as civic architecture.",
  },
  {
    n: "iii.",
    line: "Patience is the rarest input in any industrial supply chain.",
    note: "On the discipline of long horizons.",
  },
  {
    n: "iv.",
    line: "We do not build for the demo. We build for the decade after it.",
    note: "On systems thinking.",
  },
  {
    n: "v.",
    line: "Sovereignty begins in a lab — long before it reaches a podium.",
    note: "On India's deep-tech century.",
  },
];

function InHisWordsScene() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Slow parallax drift on the backdrop plate.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0, 0.62, 0.62, 0],
  );
  const latticeRot = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section
      ref={sectionRef}
      id="in-his-words"
      className="relative min-h-[calc(var(--viewport-height)*1.4)] px-5 sm:px-6 lg:pl-32 xl:pl-36 py-32 md:py-44 overflow-hidden"
    >
      {/* ─── Scroll-synced cinematic backdrop ─────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Black base */}
        <div className="absolute inset-0 bg-[oklch(0.014_0_0)]" />

        {/* Backdrop plate — blueprint schematics + dissolved silhouette,
            slow parallax + breathing scale, fades in/out with the section. */}
        <motion.div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${inHisWordsBackdrop})`,
            y: prefersReducedMotion ? 0 : bgY,
            scale: prefersReducedMotion ? 1.04 : bgScale,
            opacity: prefersReducedMotion ? 0.55 : bgOpacity,
            filter: "contrast(1.05) brightness(0.92) saturate(0.85)",
          }}
        />

        {/* Edge vignette — crush the borders into pure black so the plate
            never reads as a rectangular image. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 78% 70% at 50% 50%, transparent 38%, oklch(0.014 0 0 / 0.72) 78%, oklch(0.012 0 0) 100%)",
          }}
        />

        {/* Stage atmosphere — warm spotlight diffusion from above replaces
            the cool industrial wash. Reads as a speaking environment. */}
        <div className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_55%_45%_at_50%_8%,oklch(0.62_0.09_55/0.28),transparent_72%)]" />

        {/* Deep stage shadow base — pulls the lower frame into theatre dark */}
        <div className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_70%_60%_at_50%_95%,oklch(0.06_0.012_55/0.85),transparent_78%)]" />

        {/* Volumetric haze — soft horizontal stage fog, slow breathing */}
        <motion.div
          className="absolute inset-x-0 top-[18%] h-[55%] mix-blend-screen"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.42 0.04 55 / 0.10) 30%, oklch(0.38 0.03 55 / 0.08) 60%, transparent 100%)",
            filter: "blur(14px)",
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : { opacity: [0.55, 0.85, 0.6], y: [0, -6, 0] }
          }
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle graphene hex lattice — slow rotational drift behind quotes */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vh] h-[140vh] opacity-[0.045] mix-blend-screen"
          style={{
            rotate: prefersReducedMotion ? 0 : latticeRot,
            backgroundImage:
              "radial-gradient(circle at center, oklch(0.78 0.04 55 / 0.5) 0.6px, transparent 1.4px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 55% 50% at 50% 50%, #000 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 50% at 50% 50%, #000 25%, transparent 78%)",
          }}
        />

        {/* Warm key spotlight — slowly drifts, simulates stage lighting */}
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 28% 50% at 50% 0%, oklch(0.72 0.10 55 / 0.20), transparent 72%)",
            filter: "blur(3px)",
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : { opacity: [0.65, 0.95, 0.65], x: [-4, 4, -4] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Faint cool counter-light — keeps cinematic depth, lower-left */}
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 18% 22% at 12% 88%, oklch(0.55 0.05 232 / 0.08), transparent 72%)",
            filter: "blur(4px)",
          }}
          animate={
            prefersReducedMotion ? undefined : { opacity: [0.4, 0.65, 0.4] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cinematic grain */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0.5px, transparent 1.2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.5) 0.5px, transparent 1.2px), radial-gradient(circle at 45% 80%, rgba(255,255,255,0.5) 0.5px, transparent 1.2px)",
            backgroundSize: "140px 140px, 200px 200px, 110px 110px",
            filter: "blur(0.4px)",
          }}
        />

        {/* Readability overlay — warmer tint protects typography */}
        <div className="absolute inset-0 bg-[oklch(0.018_0.004_55/0.46)]" />

        {/* Top/bottom continuity falloff into adjacent scenes */}
        <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,oklch(0.014_0_0)_12%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(180deg,transparent,oklch(0.014_0_0)_94%)]" />
      </div>

      {/* Drifting motes — material atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
        {[
          { x: "18%", y: "32%", d: 30, delay: 0 },
          { x: "72%", y: "44%", d: 36, delay: 4 },
          { x: "34%", y: "68%", d: 32, delay: 8 },
          { x: "58%", y: "22%", d: 34, delay: 2 },
          { x: "82%", y: "72%", d: 28, delay: 6 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-foreground/35"
            style={{ left: p.x, top: p.y, filter: "blur(0.7px)" }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.18 }
                : {
                    opacity: [0, 0.35, 0.15, 0.3, 0],
                    y: [0, -14, -28, -44, -60],
                    x: [0, 3, -2, 4, 0],
                  }
            }
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>


      {/* Header — chapter mark */}
      <div className="relative mx-auto w-full max-w-6xl pointer-events-auto">
        <MotionReveal>
          <div className="mb-16 md:mb-24 flex items-center gap-4">
            <span className="h-px w-10 bg-foreground/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-primary/80">
              07 — In His Words
            </span>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <p className="max-w-xl text-[11px] uppercase tracking-[0.42em] text-muted-foreground/55 mb-20 md:mb-28">
            Notes from the founder's operating philosophy. Read slowly.
          </p>
        </MotionReveal>

        {/* Fragments — oversized editorial cadence, alternating alignment */}
        <div className="flex flex-col gap-32 md:gap-48">
          {fragments.map((f, i) => {
            const alignRight = i % 2 === 1;
            return (
              <MotionReveal key={f.n} delay={0.04 + i * 0.04}>
                <figure
                  className={`grid md:grid-cols-12 gap-y-7 ${
                    alignRight ? "md:text-right" : ""
                  }`}
                >
                  <div
                    className={`md:col-span-9 ${
                      alignRight ? "md:col-start-4" : "md:col-start-1"
                    }`}
                  >
                    <span className="block mb-7 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/40">
                      {f.n}
                    </span>
                    <blockquote className="font-display font-extralight italic text-[clamp(1.45rem,4.2vw,2.85rem)] leading-[1.22] tracking-[-0.018em] text-foreground/92 [text-wrap:balance]">
                      &ldquo;{f.line}&rdquo;
                    </blockquote>
                    <figcaption
                      className={`mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/50 ${
                        alignRight ? "md:justify-end" : ""
                      }`}
                    >
                      {!alignRight && (
                        <span className="h-px w-12 bg-gradient-to-r from-[oklch(0.62_0.10_55/0.5)] to-transparent" />
                      )}
                      <span>{f.note}</span>
                      {alignRight && (
                        <span className="h-px w-12 bg-gradient-to-l from-[oklch(0.62_0.10_55/0.5)] to-transparent" />
                      )}
                    </figcaption>
                  </div>
                </figure>
              </MotionReveal>
            );
          })}
        </div>

        {/* Soft handoff to Future */}
        <MotionReveal delay={0.2}>
          <div className="mt-32 md:mt-44 flex items-center gap-4">
            <span className="h-px flex-1 bg-foreground/[0.08]" />
            <Link
              to="/essays"
              className="font-mono text-[10px] uppercase tracking-[0.45em] text-foreground/65 hover:text-foreground transition-colors"
            >
              Read the essays →
            </Link>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

/* ───────────── Scene 08 — Closing invitation ───────────── */
function ClosingInvitation() {
  return (
    <section
      id="future"
      className="relative min-h-[calc(var(--viewport-height)*1.2)] px-5 sm:px-6 lg:pl-32 xl:pl-36 text-center"
    >
      {/* Architectural system node — restrained, integrated, atmospheric.
          Replaces the disconnected floating ring with a faint intelligent
          node that breathes with the scene rather than overlaying it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[68vh] w-[68vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 58%, oklch(0.58 0.03 232 / 0.06) 62%, transparent 66%)",
            boxShadow:
              "inset 0 0 120px oklch(0.04 0.008 245 / 0.85)",
          }}
          animate={{ opacity: [0.55, 0.78, 0.55], scale: [1, 1.012, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Atmospheric continuity — extends the scene lower in the frame */}
        <div
          className="absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.018 0.005 250 / 0.55) 55%, oklch(0.014 0.004 250 / 0.92) 100%)",
          }}
        />
      </div>
      <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center pt-36 md:pt-40 pb-12 render-stable">
        <div className="max-w-3xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-7 md:mb-9 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground">
              08 — The Future System
            </p>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <p className="mx-auto mb-8 md:mb-10 max-w-xl font-display italic text-[14px] md:text-[15px] leading-[1.65] text-foreground/55">
              Not a forecast. A working hypothesis — built one industrial system at a time.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <h2 className="mb-8 md:mb-10 font-display text-[clamp(1.85rem,7.2vw,5.6rem)] leading-[1.04] md:leading-[1.0] tracking-[-0.035em] md:tracking-[-0.04em] font-medium text-gradient [text-wrap:balance]">
              Energy as infrastructure.<br /> Industry at planetary scale.
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="mx-auto mb-10 md:mb-12 max-w-2xl text-[14px] md:text-[15.5px] leading-[1.7] text-foreground/75">
              The next century is not science fiction. It is calibrated alloys, intelligent grids, water systems, hydrogen logistics, and quietly engineered materials shaping the floor of every industry. The work is restrained, technical, and inevitable.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.28}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link to="/contact" className="btn-cinematic">
                Begin a conversation
              </Link>
              <Link to="/engage" className="btn-cinematic-secondary">
                Engage <span className="text-[10px] opacity-60">→</span>
              </Link>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.34}>
            <div className="mt-20 md:mt-28 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-9 font-mono text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/45">
              <span>Advanced Materials</span>
              <span className="h-[3px] w-[3px] rounded-full bg-primary/60" />
              <span>Energy Systems</span>
              <span className="h-[3px] w-[3px] rounded-full bg-accent/60" />
              <span>Planetary Infrastructure</span>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.42}>
            <p className="mt-14 text-[10px] font-extralight uppercase tracking-[0.4em] text-muted-foreground/35 blur-[0.3px]">
              © Sushanth Paatnaik — Building systems for industrial futures and material intelligence.
            </p>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

export default function ScrollSections() {
  const totalChapters = 8;
  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar />

      {/* 01 — Opening thesis */}
      <HeroSection />

      {/* 02 — Founder presence */}
      <FounderScene />

      {/* 03 — Innovation philosophy */}
      <StorySection chapter={carbonChapter} index={3} total={totalChapters} />

      {/* 04 — Industrial future vision */}
      <StorySection chapter={industrialChapter} index={4} total={totalChapters} />

      {/* 05 — Recognition signal */}
      <RecognitionSignal />

      {/* 06 — Ecosystem gateway */}
      <EcosystemGateway />

      {/* 07 — In His Words (reflective philosophical chapter) */}
      <InHisWordsScene />

      {/* 08 — Closing invitation */}
      <ClosingInvitation />
    </div>
  );
}
