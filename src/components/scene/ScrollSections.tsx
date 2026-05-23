import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import StorySection, { type StoryChapter } from "./StorySection";
import founderPresence from "@/assets/founder-editorial.png";
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
      className="relative min-h-[calc(var(--viewport-height)*1.28)] px-5 sm:px-6"
    >
      <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center overflow-clip text-center pt-28 md:pt-24 pb-12 render-stable">
        <HeroAtmosphere />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.03 0 0) 0%, transparent 22%, transparent 70%, oklch(0.03 0 0) 100%)",
          }}
        />

        <div className="relative z-10 max-w-5xl pointer-events-auto">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-8 md:mb-10 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground"
          >
            01 — Spark
          </motion.p>
          <motion.h1 className="font-display text-[clamp(2.6rem,11vw,10rem)] leading-[0.94] md:leading-[0.92] tracking-[-0.04em] md:tracking-[-0.045em] font-medium">
            {[
              { text: "I build", delay: 0.2 },
              { text: "what does not", delay: 0.34 },
              { text: "yet exist.", delay: 0.48 },
            ].map((line, index) => (
              <motion.span
                key={line.text}
                initial={{ opacity: 0, y: 72, filter: "blur(18px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: line.delay, ease: [0.19, 1, 0.22, 1] }}
                className={`block ${index < 2 ? "text-gradient" : "text-glow text-foreground"}`}
              >
                {line.text}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.05, delay: 0.72, ease: [0.19, 1, 0.22, 1] }}
            className="mx-auto mt-10 md:mt-12 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            Inventor and deep-tech founder. Six-time Indian Presidential awardee. Building from India — for the world.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4 text-[10px] font-extralight uppercase tracking-[0.45em] text-muted-foreground/55"
          style={{ mixBlendMode: "soft-light" }}
        >
          <span className="blur-[0.3px]">Scroll to enter</span>
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2], scaleY: [1, 1.12, 1] }}
            transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="h-16 w-px origin-top bg-gradient-to-b from-foreground/30 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 32, mass: 0.5 });
  return (
    <div className="fixed left-0 right-0 top-0 z-[55] h-[2px] bg-foreground/5">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-primary via-accent to-primary"
        style={{ scaleX }}
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
      className="relative isolate min-h-[calc(var(--viewport-height)*1.1)] flex items-center overflow-hidden px-5 sm:px-6 py-32 md:py-44"
    >
      {/* Editorial founder presence — readable face, cinematic grade, soft environmental darkness */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Graphite-black base atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_34%_50%,oklch(0.09_0_0)_0%,oklch(0.04_0_0)_60%,oklch(0.02_0_0)_100%)]" />

        {/* The portrait — clearly visible face, cinematically graded, soft elliptical reveal */}
        <div
          aria-hidden
          className="absolute inset-y-[-4%] left-[-2%] w-[78%] md:w-[58%] lg:w-[48%] bg-center bg-no-repeat bg-cover opacity-[0.92] md:opacity-[0.95] [filter:grayscale(0.18)_contrast(1.08)_brightness(0.86)_saturate(0.78)] [mask-image:radial-gradient(ellipse_62%_72%_at_44%_44%,#000_42%,rgba(0,0,0,0.92)_62%,rgba(0,0,0,0.45)_82%,transparent_98%)] [-webkit-mask-image:radial-gradient(ellipse_62%_72%_at_44%_44%,#000_42%,rgba(0,0,0,0.92)_62%,rgba(0,0,0,0.45)_82%,transparent_98%)]"
          style={{ backgroundImage: `url(${founderPresence})` }}
        />

        {/* Soft cool key-light grading on the face */}
        <div className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_24%_32%_at_28%_36%,oklch(0.65_0.06_240/0.28),transparent_70%)]" />
        {/* Warm copper rim from the right — premium editorial accent */}
        <div className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_18%_28%_at_42%_38%,oklch(0.62_0.10_55/0.10),transparent_72%)]" />

        {/* Cinematic falloff — right ink wash holds the quote */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,oklch(0.02_0_0)_88%)]" />
        <div className="absolute inset-y-0 right-0 w-[62%] bg-[linear-gradient(270deg,oklch(0.02_0_0)_22%,oklch(0.03_0_0/0.55)_55%,transparent_92%)]" />
        <div className="absolute inset-y-0 left-0 w-[10%] bg-[linear-gradient(90deg,oklch(0.02_0_0)_8%,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-1/5 bg-[linear-gradient(180deg,oklch(0.02_0_0)_6%,transparent)]" />
      </div>

      <p className="pointer-events-none absolute top-10 left-[8%] z-10 font-mono text-[10px] uppercase tracking-[0.55em] text-muted-foreground/25 blur-[0.3px]">
        02 — Founder
      </p>

      <div className="relative mx-auto grid w-full max-w-6xl md:grid-cols-12 pointer-events-auto">
        <MotionReveal delay={0.12} className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
            Founder · Voice
          </p>
          <blockquote className="font-display text-2xl leading-[1.15] tracking-[-0.025em] text-gradient md:text-3xl lg:text-[2.4rem]">
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
      className="relative min-h-[calc(var(--viewport-height)*0.95)] flex items-center px-5 sm:px-6 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.10_0.03_245/0.10),transparent_72%)]" />
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
      className="relative min-h-[calc(var(--viewport-height)*1.1)] flex items-center px-5 sm:px-6 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,oklch(0.10_0.03_245/0.10),transparent_72%)]" />
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

/* ───────────── Scene 07 — Closing invitation ───────────── */
function ClosingInvitation() {
  return (
    <section
      id="future"
      className="relative min-h-[calc(var(--viewport-height)*1.2)] px-5 sm:px-6 text-center"
    >
      <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center pt-28 md:pt-24 pb-12 render-stable">
        <div className="max-w-3xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-8 md:mb-10 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground">
              07 — The Future System
            </p>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <h2 className="mb-10 md:mb-12 font-display text-[clamp(2.2rem,9vw,7rem)] leading-[0.98] md:leading-[0.95] tracking-[-0.04em] md:tracking-[-0.045em] font-medium text-gradient">
              Cleaner materials.<br /> Faster systems.<br /> Smarter infrastructure.
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.18}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link to="/contact" className="btn-cinematic">
                Begin a conversation
              </Link>
              <Link to="/engage" className="btn-cinematic-secondary">
                Engage <span className="text-[10px] opacity-60">→</span>
              </Link>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.3}>
            <div className="mt-20 md:mt-28 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-9 font-mono text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/45">
              <span>Graphene</span>
              <span className="h-[3px] w-[3px] rounded-full bg-primary/60" />
              <span>Nano-Materials</span>
              <span className="h-[3px] w-[3px] rounded-full bg-accent/60" />
              <span>AI · Climate</span>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.38}>
            <p className="mt-14 text-[10px] font-extralight uppercase tracking-[0.4em] text-muted-foreground/35 blur-[0.3px]">
              © Sushanth Paatnaik — Engineering matter, capital, and scale.
            </p>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

export default function ScrollSections() {
  const totalChapters = 7;
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

      {/* 07 — Closing invitation */}
      <ClosingInvitation />
    </div>
  );
}
