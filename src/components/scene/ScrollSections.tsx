import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import VentureConstellation, { type Venture } from "./VentureConstellation";
import StorySection, { type StoryChapter } from "./StorySection";
import founderPresence from "@/assets/founder-presence.jpg";
import founderLab from "@/assets/founder-lab.jpg";
import mediaWall from "@/assets/scene-media-wall.jpg";


// 7-chapter cinematic storyline.
// Chapter 01 (Spark) is rendered by HeroSection.
// Chapter 07 (Future) is rendered by the closing CTA section.
// ScrollStory covers chapters 02–06.
const chapters: readonly StoryChapter[] = [
  {
    id: "spark",
    eyebrow: "01 — Spark",
    title: "I build what does not yet exist.",
    body: "It began at fourteen, in a borrowed workshop, with a breath-powered wheelchair for a man who could no longer speak. Curiosity, since then, has turned into inventions, patents, companies, and industrial technologies.",
    align: "center",
  },
  {
    id: "recognition",
    eyebrow: "02 — Recognition",
    title: "Awarded early. Responsible forever.",
    body: "Six-time Indian Presidential awardee between 2008 and 2013. NIF-India IGNITE awardee. One of the youngest speakers invited to TED-India. Featured by MIT Technology Review, India Today, Times of India, Business Standard, and Global Indian. Recognition is a lagging indicator — the work remains in the next prototype.",
    align: "left",
  },
  {
    id: "carbon-intelligence",
    eyebrow: "03 — Carbon Intelligence",
    title: "Engineering intelligent matter.",
    body: "Graphene, nano-materials, coatings, additives, composites, and AI-assisted material systems. A single sheet of carbon, manufactured cleanly and at scale, is the most under-priced strategic asset on the table this decade.",
    align: "right",
  },
  {
    id: "industrial",
    eyebrow: "04 — Industrial Applications",
    title: "One material platform. Many industries.",
    body: "Solar coatings, batteries that charge in minutes, structural composites, polymer additives, coal-moisture reduction, water and air filtration, climate infrastructure — each a downstream of the same lattice.",
    align: "left",
  },
  {
    id: "ventures",
    eyebrow: "05 — Venture Builder",
    title: "I do not only invent. I build companies.",
    body: "Five operating ventures across advanced materials, industrial products, AI systems, and capital architecture — plus a CIO seat at Magppie. The vehicles that carry frontier science from the lab into the industrial world.",
    align: "right",
  },
  {
    id: "india",
    eyebrow: "06 — India to World",
    title: "Built in India. Designed for the world.",
    body: "India has the talent, the demand, and the urgency. What remains is the patience. Translating Indian invention into global industrial deployment is the strategic question of this decade.",
    align: "left",
  },
];

const ventures: Venture[] = [
  { n: "01", title: "Monoatom Labs", body: "Frontier graphene and 2D-material synthesis — the research engine behind every downstream industrial platform." },
  { n: "02", title: "Grafillium", body: "Graphene-enabled advanced materials engineered for solar, batteries, polymers, and industrial-scale deployment." },
  { n: "03", title: "SPI Industries", body: "Operating arm translating advanced materials into production-grade industrial products and supply chains." },
  { n: "04", title: "InThinks", body: "AI systems applied to materials discovery, process intelligence, and the commercialization layer beneath every venture." },
  { n: "05", title: "Starunico Capital", body: "Capital architecture for deep-tech — the patient vehicle carrying frontier science from lab through industrial scale." },
  { n: "06", title: "Magppie · CIO", body: "Chief Innovation Officer — embedding advanced materials thinking into an established industrial design house." },
];

const processSteps = [
  { n: "01", t: "Hypothesize", b: "Identify a material-level lever with world-scale consequence." },
  { n: "02", t: "Model", b: "Simulate matter, systems, and economics before they reach deployment." },
  { n: "03", t: "Prototype", b: "Build the lattice, module, and operating pathway into physical form." },
  { n: "04", t: "Deploy", b: "Scale from scientific validity to industrial adoption." },
];

function HeroSection() {
  const { scrollYProgress } = useScroll();
  // Progressive founder reveal: starts deeply hidden, subtly emerges as user scrolls into journey
  const silhouetteOpacity = useTransform(scrollYProgress, [0, 0.04, 0.1], [0.08, 0.18, 0.32]);
  const silhouetteBlur = useTransform(scrollYProgress, [0, 0.1], [18, 10]);
  const silhouetteFilter = useTransform(silhouetteBlur, (b) => `blur(${b}px) grayscale(0.4) contrast(1.05)`);
  const silhouetteScale = useTransform(scrollYProgress, [0, 0.1], [1.04, 1]);

  return (
    <section id="spark" className="relative min-h-[calc(var(--viewport-height)*1.32)] px-5 sm:px-6">
      <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center overflow-clip text-center pt-28 md:pt-24 pb-12 render-stable">
        {/* Atmospheric founder silhouette — subtle, environmental, behind typography */}
        <motion.div
          aria-hidden
          style={{ opacity: silhouetteOpacity, filter: silhouetteFilter, scale: silhouetteScale }}
          className="pointer-events-none absolute inset-0 z-0 render-stable"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${founderPresence})`,
              backgroundPosition: "center 30%",
              backgroundSize: "auto 95%",
              backgroundRepeat: "no-repeat",
              WebkitMaskImage:
                "radial-gradient(ellipse 42% 58% at 50% 48%, #000 18%, rgba(0,0,0,0.55) 48%, transparent 82%)",
              maskImage:
                "radial-gradient(ellipse 42% 58% at 50% 48%, #000 18%, rgba(0,0,0,0.55) 48%, transparent 82%)",
            }}
          />
          {/* Volumetric haze wash across silhouette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, oklch(0.04 0 0 / 0.55) 70%, oklch(0.03 0 0) 95%)",
            }}
          />
          {/* Single cool rim breath — replaces 3 drift layers + dust grid */}
          <motion.div
            className="absolute inset-0 mix-blend-screen render-stable"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse 42% 48% at 60% 44%, oklch(0.5 0.08 240 / 0.09) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        {/* Cinematic top + bottom fade so silhouette dissolves into page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.03 0 0) 0%, transparent 22%, transparent 70%, oklch(0.03 0 0) 100%)",
          }}
        />
        <div className="relative z-10 max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
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
            className="mx-auto mt-10 md:mt-12 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            Inventor and deep-tech founder. Six-time Indian Presidential awardee. Building graphene, nano-materials, and industrial systems from Bhubaneswar — for the world.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 1.05, delay: 0.88, ease: [0.19, 1, 0.22, 1] }}
            className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <a href="#carbon-intelligence" className="btn-cinematic pointer-events-auto">
              Enter the Journey
            </a>
            <a href="/essays" className="btn-cinematic-secondary pointer-events-auto">
              Read the essays
            </a>
          </motion.div>
        </div>
        {/* Atmospheric founder identity — right side, minimal, cinematic */}
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 1 }}
          transition={{ duration: 0 }}
          className="pointer-events-none absolute right-6 top-1/2 z-[15] hidden -translate-y-1/2 flex-col items-end md:right-10 md:flex lg:right-16"
          style={{ mixBlendMode: "soft-light" }}
        >
          <div className="flex flex-col items-end gap-5 opacity-40">
            <span className="text-[10px] font-extralight uppercase tracking-[0.3em] text-foreground/35 blur-[0.3px]">
              Inventor
            </span>
            <span className="h-px w-3 bg-gradient-to-l from-foreground/15 to-transparent" />
            <span className="text-[10px] font-extralight uppercase tracking-[0.3em] text-foreground/35 blur-[0.3px]">
              Advanced Materials
            </span>
            <span className="h-px w-3 bg-gradient-to-l from-foreground/15 to-transparent" />
            <span className="text-[10px] font-extralight uppercase tracking-[0.3em] text-foreground/35 blur-[0.3px]">
              Deep-Tech Systems
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.8 }}
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
  // Calmer, longer settle — the bar should drift, not snap with the cursor.
  const scaleX = useSpring(scrollYProgress, { stiffness: 60, damping: 32, mass: 0.5 });

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
  // Reveal earlier in the viewport, with a longer film-grade ease, so panels
  // breathe in rather than pop. Tightly paired with section scroll pacing.
  const inView = useInView(ref, { amount: 0.18, once: false });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollSections() {
  // 7-act cinematic arc. Chapter 01 = hero, 07 = closing CTA.
  // Editorial layers (recognitions, technologies, ventures, news, manifesto…)
  // are absorbed INTO their parent chapter, not appended as separate sections.
  const totalChapters = 7;
  const recognitionChapter = chapters[1];
  const carbonChapter = chapters[2];
  const industrialChapter = chapters[3];
  const venturesChapter = chapters[4];
  const indiaChapter = chapters[5];

  return (
    <div className="relative z-10 pointer-events-none">
      <ScrollProgressBar />

      {/* ░░ Chapter 01 — Spark ░░ */}
      <HeroSection />

      {/* ░░ Chapter 01 — Spark · subtle origin layer ░░ */}

      {/* About / Journey — quiet biographical panel. Single column, editorial,
          not a CV. Bhubaneswar origin → IISER → current operating seats. */}
      <section id="about" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.10_0.03_245/0.09),transparent_72%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.5),transparent_22%,transparent_78%,oklch(0.03_0_0/0.6))]" />
        <div className="mx-auto w-full max-w-3xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-6 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">About · Journey</p>
            <h3 className="mb-14 md:mb-16 font-display text-[clamp(2rem,6.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-gradient">
              An inventor formed in Bhubaneswar.
            </h3>
          </MotionReveal>

          <div className="space-y-10 md:space-y-12 text-[15px] md:text-[17px] leading-[1.75] text-muted-foreground/85 font-light tracking-[-0.005em]">
            <MotionReveal delay={0.05}>
              <p>
                Born in <span className="text-foreground/95">Bhubaneswar, Odisha</span>. The first invention arrived at fourteen — a breath-powered wheelchair for a paralysed elderly neighbour who could no longer speak. That encounter set the working hypothesis of every system since: empathy is the first specification, and engineering is its long second sentence.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.1}>
              <p>
                Between <span className="text-foreground/95">2008 and 2013</span>, the Government of India conferred six Presidential awards for invention and design. The Republic noticed; the workshop continued unchanged. The next prototype was started the same week each honour was filed.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.15}>
              <p>
                Formal science followed at <span className="text-foreground/95">IISER Bhopal</span> under the KVPY-SP scholarship — a BSc that taught the inventor the second discipline: rigor. A subsequent BEd in ETE from OCT Bhopal, under the Special Achiever category, closed the loop between making and teaching.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.2}>
              <p>
                Today the work is held across five operating ventures — <span className="text-foreground/95">Monoatom Labs, Grafillium, SPI Industries, InThinks, Starunico Capital</span> — and a Chief Innovation Officer seat at Magppie. Graphene, nano-materials, AI-assisted discovery, and industrial commercialization, treated as a single continuous lattice.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.25}>
              <p className="text-foreground/85 italic">
                The mission has not changed since the workshop: engineer matter at the level where it matters, and translate the result into systems the world can actually deploy.
              </p>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.3} className="mt-16 md:mt-20 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/45">
            <span>Bhubaneswar</span>
            <span className="h-[3px] w-[3px] rounded-full bg-primary/50" />
            <span>IISER Bhopal · KVPY-SP</span>
            <span className="h-[3px] w-[3px] rounded-full bg-accent/50" />
            <span>OCT Bhopal · BEd</span>
            <span className="h-[3px] w-[3px] rounded-full bg-primary/50" />
            <span>Six-time Presidential Awardee</span>
          </MotionReveal>
        </div>
      </section>

      {/* Early Works — atmospheric origin archive.
          Emotionally authentic, not nostalgic. */}
      <section id="early-works" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,oklch(0.08_0.02_245/0.12),transparent_72%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.5),transparent_18%,transparent_82%,oklch(0.03_0_0/0.6))]" />
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          <MotionReveal className="md:col-span-5 md:sticky md:top-32 self-start">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Origin Archive</p>
            <h3 className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-gradient">
              Before the lattice, the workshop.
            </h3>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The early years — borrowed tools, school benches, an inheritance of curiosity. The inventor as he was, before the institutions arrived.
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/40 blur-[0.3px]">
              Bhubaneswar · 2007 — 2013
            </p>
          </MotionReveal>
          <div className="md:col-span-7">
            {[
              { y: "Age 14", t: "The breath-powered wheelchair", b: "A neighbour, paralysed, could no longer speak. The first design — mobility controlled by inhalation cadence. Empathy as the first specification." },
              { y: "Age 15", t: "The school bench prototypes", b: "Salvaged motors, scavenged circuit boards, a desk lamp for soldering. A pattern emerges: invention as a private discipline, before it becomes a public claim." },
              { y: "Age 16", t: "First Presidential recognition", b: "The Republic notices. The work continues unchanged. The award is filed; the next prototype is started the same week." },
              { y: "Age 17", t: "TED India · the youngest voice", b: "An invitation to speak on a national stage. The talk is short; the workshop is long. Public recognition redirected back into private practice." },
              { y: "Age 18–20", t: "KVPY · IISER Bhopal", b: "Formal science under the KVPY-SP scholarship. The intuition of the workshop meets the rigor of the laboratory — and survives the encounter." },
              { y: "Age 21+", t: "From bench to industrial pilot", b: "The slow migration of early prototypes into the language of materials, supply chains, and patents. The inventor learns the second discipline: commercialization." },
            ].map((e, i) => (
              <MotionReveal key={e.t} delay={i * 0.05} className="grid grid-cols-[auto_1fr] items-start gap-5 sm:gap-8 border-t border-foreground/[0.07] py-6 md:py-7">
                <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/55 min-w-[4rem]">{e.y}</span>
                <div>
                  <h4 className="mb-2 font-display text-base md:text-lg tracking-[-0.015em] text-foreground/90">{e.t}</h4>
                  <p className="max-w-lg text-[13px] leading-relaxed text-muted-foreground/75">{e.b}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ Chapter 02 — Recognition ░░ */}

      <StorySection chapter={recognitionChapter} index={2} total={totalChapters} />

      {/* Dossier — honors of record. Editorial, not corporate. */}
      <section className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_50%,oklch(0.10_0.03_245/0.10),transparent_72%)]" />
        <div className="mx-auto w-full max-w-5xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Dossier · Honors of Record</p>
            <h3 className="mb-14 md:mb-20 max-w-3xl font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-gradient">
              A quiet record.
            </h3>
          </MotionReveal>
          <div className="grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4 md:gap-x-14">
            {[
              { k: "27", u: "", l: "Honors of record", s: "National + international" },
              { k: "21", u: "", l: "Patents & awards", s: "Times of India · profiled" },
              { k: "50", u: "+", l: "Media imprints", s: "Print · broadcast · digital" },
              { k: "10", u: "+", l: "Working prototypes", s: "Bench to industrial pilot" },
            ].map((m, i) => (
              <MotionReveal key={m.l} delay={i * 0.08} className="border-t border-foreground/[0.08] pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70">{m.l}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-medium text-gradient md:text-6xl">{m.k}</span>
                  <span className="font-display text-2xl text-muted-foreground/60">{m.u}</span>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">{m.s}</p>
              </MotionReveal>
            ))}
          </div>

          {/* Featured imprints — single restrained editorial line */}
          <MotionReveal delay={0.22} className="mt-20 md:mt-28">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45 leading-loose blur-[0.3px]">
              MIT Technology Review &middot; TED India &middot; Times of India &middot; India Today &middot; Business Standard &middot; Global Indian &middot; NIF-India IGNITE
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Recognitions — chronological honors as an editorial ledger.
          Not a trophy wall: a quiet timeline of national record. */}
      <section id="recognitions" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,oklch(0.10_0.03_245/0.08),transparent_72%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          <MotionReveal className="md:col-span-4 md:sticky md:top-32 self-start">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Recognitions</p>
            <h3 className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-gradient">
              An institutional ledger.
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Honors recorded by the Republic, the academy, and the press. Read as record, not as résumé.
            </p>
          </MotionReveal>
          <div className="md:col-span-8">
            {[
              { y: "2008–2013", t: "Indian Presidential Awardee", b: "Six awards conferred by the President of India between 2008 and 2013 — for invention, design, and engineering at school and college age." },
              { y: "2010", t: "NIF-India · IGNITE", b: "National Innovation Foundation honor for grassroots-engineered prototypes addressing real-world systems gaps." },
              { y: "2010", t: "TED India · Speaker", b: "Among the youngest speakers invited to the inaugural Indian programme — a national platform for original thought." },
              { y: "—", t: "MIT Technology Review · Featured", b: "Profiled as a featured innovator within the global advanced-materials and deep-tech track." },
              { y: "—", t: "Global Indian · Cover", b: "Editorial cover feature framing the long-arc inventor narrative for an international Indian readership." },
              { y: "—", t: "Times of India · 21 Patents", b: "Profiled at the milestone of twenty-one filed patents — a published institutional acknowledgement." },
              { y: "—", t: "Business Standard · Battery", b: "Editorial coverage of an early battery-systems breakthrough originating in independent research." },
              { y: "—", t: "India Today · Profile", b: "Long-form national-press profile examining the trajectory from school inventor to deep-tech founder." },
            ].map((r, i) => (
              <MotionReveal key={r.t} delay={i * 0.04} className="grid grid-cols-[auto_1fr] items-start gap-5 sm:gap-8 border-t border-foreground/[0.08] py-6 md:py-7 transition-colors duration-500 hover:border-foreground/20">
                <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/55 min-w-[5rem]">{r.y}</span>
                <div>
                  <h4 className="mb-2 font-display text-base md:text-xl tracking-[-0.015em]">{r.t}</h4>
                  <p className="max-w-lg text-[13px] leading-relaxed text-muted-foreground/80">{r.b}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>




      {/* Voices — restrained editorial pull-quotes from external observers.
          Three quiet attestations, not a testimonial wall. */}
      <section id="voices" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_40%_50%,oklch(0.10_0.03_245/0.08),transparent_72%)]" />
        <div className="mx-auto w-full max-w-5xl pointer-events-auto">
          <MotionReveal className="mb-16 md:mb-24 text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Voices</p>
            <h3 className="font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-gradient">
              On record, in other words.
            </h3>
          </MotionReveal>
          <div className="space-y-20 md:space-y-28">
            {[
              { q: "A rare instance where original invention, scientific discipline, and industrial intent appear in the same person — and persist past adolescence into deployable systems.", s: "Editorial · National Innovation Foundation", a: "left" },
              { q: "The graphene work is technically credible; what is harder to find is the operating discipline beneath it — the willingness to carry the science through to the supply chain.", s: "Industry observer · Advanced materials", a: "right" },
              { q: "He represents a class of Indian inventor the country has rarely produced at scale: empirical, patient, and unwilling to mistake recognition for the work itself.", s: "Cover essay · Global Indian", a: "left" },
            ].map((v, i) => (
              <MotionReveal key={v.s} delay={i * 0.08} className={v.a === "right" ? "md:ml-auto md:text-right max-w-2xl" : "max-w-2xl"}>
                <span className={`block h-px w-12 mb-7 bg-gradient-to-r from-primary/40 via-accent/30 to-transparent ${v.a === "right" ? "md:ml-auto md:bg-gradient-to-l" : ""}`} />
                <blockquote className="font-display text-xl md:text-2xl lg:text-[1.7rem] leading-[1.35] tracking-[-0.015em] text-foreground/90">
                  &ldquo;{v.q}&rdquo;
                </blockquote>
                <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55">
                  — {v.s}
                </p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ Chapter 03 — Carbon Intelligence ░░ */}

      <StorySection chapter={carbonChapter} index={3} total={totalChapters} />

      {/* Carbon Intelligence metrics — supports chapter 03 */}
      <section className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,oklch(0.12_0.04_240/0.10),transparent_70%)]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal className="text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Carbon Intelligence</p>
            <h3 className="mb-12 md:mb-16 font-display text-[clamp(2rem,8vw,4rem)] leading-[1] tracking-[-0.03em] md:tracking-[-0.035em] text-gradient md:text-6xl">Intelligent matter, measured.</h3>
          </MotionReveal>
          <div className="grid grid-cols-2 gap-px bg-foreground/[0.06] md:grid-cols-4">
            {[
              { k: "1", u: "atom", l: "Graphene lattice thickness" },
              { k: "200×", u: "", l: "Stronger than steel" },
              { k: "10⁶", u: "S/m", l: "Electrical conductivity" },
              { k: "∞", u: "", l: "Industrial application surface" },
            ].map((metric, index) => (
              <MotionReveal
                key={metric.l}
                delay={index * 0.08}
                className="panel-surface p-6 sm:p-8 transition-all duration-700 hover:bg-background/80 md:p-12"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-medium text-gradient sm:text-5xl md:text-7xl">{metric.k}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{metric.u}</span>
                </div>
                <p className="mt-3 md:mt-4 text-[10px] uppercase tracking-[0.32em] md:tracking-[0.4em] text-muted-foreground">{metric.l}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Portfolio — editorial archive of material & systems domains.
          Restrained list, not a card grid. */}
      <section className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,oklch(0.11_0.03_245/0.10),transparent_72%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          <MotionReveal className="self-start md:col-span-4 md:sticky md:top-32">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Portfolio</p>
            <h3 className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-gradient">
              The lattice, downstream.
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Nine material and systems domains where graphene, nano-additives, and intelligent process design converge into industrial outcomes.
            </p>
          </MotionReveal>

          <div className="md:col-span-8">
            {[
              { n: "01", t: "Graphene Systems", b: "Atomic-thin carbon — synthesized, functionalized, and integrated as the substrate of next-generation industrial platforms." },
              { n: "02", t: "Nano-Materials", b: "Engineered 2D and quantum-confined structures, designed for conductivity, strength, and catalytic surface area." },
              { n: "03", t: "Industrial Coatings", b: "Anti-corrosion, thermal, and photonic coatings for solar, marine, aerospace, and heavy infrastructure." },
              { n: "04", t: "Polymer Additives", b: "Carbon dispersions that lift mechanical, electrical, and barrier properties in mainstream polymers." },
              { n: "05", t: "Concrete Technologies", b: "Carbon-augmented binders reducing cement intensity while extending the lifespan of structural systems." },
              { n: "06", t: "Battery & Energy Storage", b: "Electrode architectures shortening charge cycles and lifting energy density at industrial scale." },
              { n: "07", t: "Fuel & Coal Systems", b: "Moisture, sulphur, and combustion-efficiency interventions for legacy fuel infrastructure in transition." },
              { n: "08", t: "Filtration & Water", b: "Membrane and adsorbent systems for industrial effluent, potable water, and air-quality recovery." },
              { n: "09", t: "Climate Infrastructure", b: "Carbon-capture surfaces, sensing networks, and decarbonization pathways for industrial corridors." },
            ].map((d, i) => (
              <MotionReveal key={d.n} delay={i * 0.04} className="grid grid-cols-[auto_1fr] items-start gap-5 sm:gap-8 border-t border-foreground/10 py-7 md:py-8 transition-colors duration-500 hover:border-foreground/25">
                <span className="mt-2 font-mono text-xs tracking-[0.3em] text-muted-foreground/60">{d.n}</span>
                <div>
                  <h4 className="mb-2 font-display text-lg tracking-[-0.02em] md:text-2xl">{d.t}</h4>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/85">{d.b}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Inventions — cinematic innovation archive.
          Named breakthroughs, not generic domains. Industrial future systems. */}
      <section id="innovations" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_60%_45%,oklch(0.12_0.04_245/0.10),transparent_72%)]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal className="max-w-3xl">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Selected Inventions</p>
            <h3 className="mb-5 font-display text-[clamp(2rem,7vw,3.75rem)] leading-[1.02] tracking-[-0.03em] text-gradient">
              An archive of working systems.
            </h3>
            <p className="mb-16 md:mb-20 max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
              A non-exhaustive index of prototypes, processes, and patented systems engineered between the workshop bench and the industrial pilot floor.
            </p>
          </MotionReveal>
          <div className="grid gap-px bg-foreground/[0.06] md:grid-cols-2">
            {[
              { n: "I", t: "Breath-Powered Mobility", y: "2007", b: "The first invention. A wheelchair controlled by breath cadence, engineered at fourteen for a man who could no longer speak. The empathic origin of every system that followed." },
              { n: "II", t: "Single-Atom Graphene Synthesis", y: "Ongoing", b: "Clean, scalable manufacture of one-atom-thick carbon — the substrate beneath every downstream platform from solar to storage." },
              { n: "III", t: "Rapid-Charge Battery Architecture", y: "Published", b: "Electrode geometries reducing charge cycles to minutes at industrial energy density. Covered in the national press as an early breakthrough." },
              { n: "IV", t: "Coal-Moisture Reduction System", y: "Patent", b: "An industrial process intervention reducing in-stream moisture in thermal-grade coal — extracting efficiency from legacy fuel infrastructure in transition." },
              { n: "V", t: "Carbon-Augmented Concrete", y: "Pilot", b: "Cement binders engineered with carbon additives — less clinker, longer service life, lower embodied emissions per cubic metre placed." },
              { n: "VI", t: "Photonic Solar Coatings", y: "Lab", b: "Thin-film coatings lifting the spectral capture window of conventional photovoltaic surfaces under real-world deployment conditions." },
              { n: "VII", t: "Polymer Conductivity Additives", y: "Industrial", b: "Carbon dispersions transforming insulating polymers into conductive, EMI-shielding, structural-grade engineering materials." },
              { n: "VIII", t: "Membrane Water Recovery", y: "Field", b: "Adsorbent and membrane systems for industrial effluent recovery and potable water in resource-constrained corridors." },
              { n: "IX", t: "Carbon-Capture Surfaces", y: "Research", b: "Functionalised surface chemistries for passive atmospheric CO₂ adsorption integrated into industrial cladding and infrastructure." },
              { n: "X", t: "AI · Materials Discovery Loop", y: "Internal", b: "A closed loop where AI proposes lattice configurations, simulation prunes them, and the lab returns failure data — compressing the discovery cycle." },
            ].map((inv, i) => (
              <MotionReveal key={inv.t} delay={i * 0.04} className="panel-surface p-6 sm:p-8 md:p-10">
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70">{inv.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/45">{inv.y}</span>
                </div>
                <h4 className="mb-3 font-display text-xl md:text-2xl tracking-[-0.02em] text-foreground/95">{inv.t}</h4>
                <p className="text-[13px] leading-relaxed text-muted-foreground/80">{inv.b}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ Chapter 04 — Industrial Applications ░░ */}

      <StorySection chapter={industrialChapter} index={4} total={totalChapters} />

      {/* Method — supports chapter 04 (Industrial Applications) */}
      <section className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_30%_50%,oklch(0.10_0.03_250/0.09),transparent_72%)]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Method</p>
            <h3 className="mb-14 md:mb-20 max-w-2xl font-display text-[clamp(2rem,8vw,4rem)] leading-[1] tracking-[-0.03em] md:tracking-[-0.035em] text-gradient md:text-6xl">
              From invention to industrial scale.
            </h3>
          </MotionReveal>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
            {processSteps.map((step, index) => (
              <MotionReveal key={step.n} delay={index * 0.08} className="border-t border-foreground/[0.08] pt-5 md:pt-6">
                <span className="font-mono text-xs tracking-[0.3em] text-primary/80">{step.n}</span>
                <h4 className="mt-4 mb-3 font-display text-xl md:text-2xl tracking-[-0.02em]">{step.t}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.b}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ Chapter 05 — Venture Builder ░░ */}

      <StorySection chapter={venturesChapter} index={5} total={totalChapters} />

      {/* Ventures — supports chapter 05 (Founder Layer) */}
      <VentureConstellation ventures={ventures} />

      {/* ░░ Chapter 06 — India to World ░░ */}

      <StorySection chapter={indiaChapter} index={6} total={totalChapters} />

      {/* News — editorial media archive. A quiet chronological list. */}
      <section id="news" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,oklch(0.10_0.03_245/0.08),transparent_72%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          <MotionReveal className="md:col-span-4 md:sticky md:top-32 self-start">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">News &amp; Media</p>
            <h3 className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-gradient">
              An editorial archive.
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Selected imprints across print, broadcast, and digital — fifty plus over the long arc of the work.
            </p>
          </MotionReveal>
          <div className="md:col-span-8">
            {[
              { o: "MIT Technology Review", h: "Featured innovator · advanced materials and deep-tech", k: "Feature" },
              { o: "TED India", h: "Among the youngest invited speakers at the inaugural programme", k: "Talk" },
              { o: "Times of India", h: "Profiled at the milestone of twenty-one filed patents", k: "Profile" },
              { o: "India Today", h: "Long-form national-press profile of the inventor trajectory", k: "Profile" },
              { o: "Business Standard", h: "Editorial coverage of an early battery-systems breakthrough", k: "Report" },
              { o: "Global Indian", h: "Cover essay framing the long-arc inventor narrative", k: "Cover" },
              { o: "NIF-India · IGNITE", h: "National Innovation Foundation editorial recognition", k: "Citation" },
              { o: "Doordarshan · National Broadcast", h: "Television feature on Presidential-honoured invention", k: "Broadcast" },
              { o: "Regional Press · Odisha", h: "Sustained local coverage of the Bhubaneswar workshop years", k: "Archive" },
            ].map((n, i) => (
              <MotionReveal key={n.o + n.h} delay={i * 0.04} className="grid grid-cols-[1fr_auto] items-start gap-5 sm:gap-8 border-t border-foreground/[0.07] py-6 md:py-7 transition-colors duration-500 hover:border-foreground/20">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-primary/70">{n.o}</p>
                  <h4 className="font-display text-base md:text-lg tracking-[-0.015em] text-foreground/90 leading-snug max-w-xl">{n.h}</h4>
                </div>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/45">{n.k}</span>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>





      {/* Founder Voice — cinematic editorial frame.
          Portrait dissolves into atmospheric darkness; India map is pushed deep. */}
      <section className="relative min-h-[calc(var(--viewport-height)*1.1)] overflow-hidden px-5 sm:px-6 pt-28 pb-20 md:px-20 md:py-24">
        
        {/* Heavy atmospheric scrim that pushes the India network bg deep into the scene */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,oklch(0.04_0_0/0.84),oklch(0.03_0_0/0.97))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.6),transparent_25%,transparent_70%,oklch(0.03_0_0/0.85))]" />

        {/* Ambient volumetric wash — single blended layer */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-1/2 h-[72vh] w-[65vw] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.16_0.05_240/0.2),transparent_62%)] blur-2xl render-stable" />
          <div className="absolute right-[-12%] top-[18%] h-[54vh] w-[42vw] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.09_0.02_260/0.28),transparent_70%)] blur-2xl render-stable" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          {/* Asymmetric portrait — enlarged, fully dissolved into the scene */}
          <MotionReveal className="relative md:col-span-8 md:col-start-1 md:-ml-[6%] lg:-ml-[10%]">
            <div className="relative">
              <p className="absolute top-4 left-[12%] z-10 font-mono text-[10px] uppercase tracking-[0.55em] text-muted-foreground/25 blur-[0.3px]">
                Plate 02 · Founder
              </p>
              <img
                src={founderPresence}
                alt="Sushanth Paatnaik — founder portrait dissolving into industrial darkness."
                width={1100}
                height={1450}
                loading="lazy"
                decoding="async"
                className="relative w-full grayscale-[0.22] contrast-[1.1] [filter:brightness(0.82)_saturate(0.7)] [mask-image:radial-gradient(ellipse_55%_62%_at_50%_42%,#000_28%,rgba(0,0,0,0.55)_55%,transparent_88%)] [-webkit-mask-image:radial-gradient(ellipse_55%_62%_at_50%_42%,#000_28%,rgba(0,0,0,0.55)_55%,transparent_88%)]"
              />
              {/* Deep cinematic shadow integration */}
              <div className="pointer-events-none absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_65%_75%_at_50%_48%,transparent_22%,oklch(0.02_0_0/0.98)_92%)]" />
              {/* Subtle volumetric rim light from the right */}
              <div className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_28%_45%_at_70%_36%,oklch(0.45_0.1_240/0.16),transparent_60%)]" />
              {/* Atmospheric haze drift across the figure */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,oklch(0.1_0.02_240/0.18)_60%,transparent_85%)]" />
              {/* Top + bottom fade into darkness */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-[linear-gradient(180deg,oklch(0.03_0_0)_8%,transparent)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,oklch(0.03_0_0)_88%)]" />
              {/* Side vignettes */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-[linear-gradient(90deg,oklch(0.03_0_0)_12%,transparent)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-[linear-gradient(270deg,oklch(0.03_0_0)_12%,transparent)]" />
            </div>
          </MotionReveal>

          {/* Editorial quote — offset down-right for cinematic asymmetry */}
          <MotionReveal delay={0.14} className="md:col-span-5 md:col-start-8 md:pt-56 lg:pt-72">
            <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-primary/80">
              Founder · Voice
            </p>
            <blockquote className="font-display text-2xl leading-[1.15] tracking-[-0.025em] text-gradient md:text-3xl lg:text-4xl">
              "The most important specification on any drawing I make is the human being it is meant for."
            </blockquote>
            <p className="mt-10 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Inventor. Founder. Working at the intersection of graphene, advanced materials, AI, and industrial commercialization. BSc · IISER Bhopal (KVPY-SP).
            </p>
            <div className="mt-12 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/40">
              <span className="h-px w-10 bg-gradient-to-r from-foreground/25 to-transparent" />
              <span>Sushanth Paatnaik</span>
            </div>

            {/* Plate 03 · R&D — atmospheric inventor-documentary inset.
                Small, asymmetric, edge-blended, emerging from darkness. */}
            <div className="relative mt-20 -ml-[20%] hidden md:block lg:-ml-[30%]">
              <p className="absolute -top-5 left-2 z-10 font-mono text-[10px] uppercase tracking-[0.55em] text-muted-foreground/25 blur-[0.3px]">
                Plate 03 · R&amp;D · Inventor at work
              </p>
              <div className="relative aspect-square w-[78%]">
                <img
                  src={founderLab}
                  alt="Sushanth Paatnaik inside an advanced materials research environment, instrument in hand."
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.3] contrast-[1.08] [filter:brightness(0.72)_saturate(0.65)] [mask-image:radial-gradient(ellipse_70%_75%_at_45%_50%,#000_25%,rgba(0,0,0,0.5)_60%,transparent_92%)] [-webkit-mask-image:radial-gradient(ellipse_70%_75%_at_45%_50%,#000_25%,rgba(0,0,0,0.5)_60%,transparent_92%)]"
                />
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_70%_75%_at_45%_50%,transparent_25%,oklch(0.02_0_0/0.97)_92%)]" />
                <div className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_25%_45%_at_82%_42%,oklch(0.45_0.1_240/0.18),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_45%,oklch(0.1_0.02_240/0.16)_65%,transparent_88%)]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,oklch(0.03_0_0)_5%,transparent)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,oklch(0.03_0_0)_88%)]" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-[linear-gradient(90deg,oklch(0.03_0_0)_8%,transparent)]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-[linear-gradient(270deg,oklch(0.03_0_0)_8%,transparent)]" />
              </div>
              <p className="mt-4 max-w-[18rem] font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/35">
                R&amp;D bench · Instrumentation · Graphene · Nano-materials
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ░░ Chapter 07 — Future · philosophy + engagement ░░ */}

      {/* In His Words — manifesto. Six principles, cinematically restrained. */}
      <section id="manifesto" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_60%_at_50%_50%,oklch(0.10_0.03_245/0.10),transparent_72%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.55),transparent_20%,transparent_80%,oklch(0.03_0_0/0.65))]" />
        <div className="mx-auto w-full max-w-6xl pointer-events-auto">
          <MotionReveal className="mb-20 md:mb-28 max-w-3xl">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">In His Words</p>
            <h3 className="font-display text-[clamp(2.2rem,8vw,4.5rem)] leading-[1] tracking-[-0.035em] text-gradient">
              Six working principles.
            </h3>
          </MotionReveal>
          <div className="grid gap-x-14 gap-y-16 md:grid-cols-2 md:gap-y-20">
            {[
              { n: "I", p: "Begin with the human", b: "The most important specification on any drawing is the human being it is meant for. Everything else is engineering downstream of that decision." },
              { n: "II", p: "Engineer matter, not features", b: "Lasting industrial change is decided at the level of materials. The shape of the product is a consequence; the lattice is the cause." },
              { n: "III", p: "Treat recognition as a lagging indicator", b: "Awards arrive after the work is already obsolete in your own hands. The next prototype is the only honest answer to the last one." },
              { n: "IV", p: "Build the company, not only the invention", b: "An unbuilt company is a half-finished invention. Capital, supply chain, and operating discipline are the second half of the lattice." },
              { n: "V", p: "Patience is the strategic asset", b: "Frontier science compounds on a decade clock, not a quarter. The country, the venture, and the inventor all need the same temperament." },
              { n: "VI", p: "From India, for the world", b: "Indian invention is no longer regional. The translation from local breakthrough to global industrial deployment is the strategic question of this decade." },
            ].map((m, i) => (
              <MotionReveal key={m.n} delay={i * 0.06} className="border-t border-foreground/[0.08] pt-6">
                <div className="flex items-baseline gap-5 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary/70">{m.n}</span>
                  <span className="h-px flex-1 bg-foreground/[0.06]" />
                </div>
                <h4 className="mb-4 font-display text-2xl md:text-[1.65rem] leading-[1.2] tracking-[-0.02em] text-foreground/95">
                  {m.p}.
                </h4>
                <p className="max-w-md text-[13px] md:text-sm leading-relaxed text-muted-foreground/80">{m.b}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement — collaboration architecture. Not a services page;
          a quiet statement of the four ways the work travels outward. */}
      <section id="engagement" className="relative viewport-section flex items-center px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,oklch(0.10_0.03_245/0.09),transparent_72%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12 md:gap-16 pointer-events-auto">
          <MotionReveal className="md:col-span-5 md:sticky md:top-32 self-start">
            <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">Engagement</p>
            <h3 className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-gradient">
              Four ways the work travels.
            </h3>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The collaboration architecture for industrial partners, capital, institutions, and operators carrying frontier materials into deployment.
            </p>
          </MotionReveal>
          <div className="md:col-span-7">
            {[
              { n: "01", t: "Strategic Advisory", b: "Long-arc counsel for industrial groups, family offices, and institutions positioning around advanced materials, energy systems, and climate infrastructure." },
              { n: "02", t: "Deep-Tech Partnership", b: "Co-development of graphene, nano-material, and process-intelligence platforms with corporate R&D, public laboratories, and downstream manufacturers." },
              { n: "03", t: "Commercialization Support", b: "Translating lab-validated science into supply chains, patent architecture, and industrial pilots — the unglamorous second half of every invention." },
              { n: "04", t: "Innovation Systems", b: "Designing the operating discipline beneath a deep-tech portfolio: research cadence, capital sequencing, and the patient compounding that frontier science requires." },
            ].map((s, i) => (
              <MotionReveal key={s.n} delay={i * 0.06} className="grid grid-cols-[auto_1fr] items-start gap-5 sm:gap-8 border-t border-foreground/[0.08] py-7 md:py-8">
                <span className="mt-2 font-mono text-xs tracking-[0.3em] text-muted-foreground/60">{s.n}</span>
                <div>
                  <h4 className="mb-3 font-display text-lg md:text-2xl tracking-[-0.02em] text-foreground/95">{s.t}</h4>
                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/80">{s.b}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>





      {/* Chapter 07 — The Future System */}
      <section id="future" className="relative min-h-[calc(var(--viewport-height)*1.24)] px-5 sm:px-6 text-center">
        <div className="viewport-stage sticky top-0 flex flex-col items-center justify-center pt-28 md:pt-24 pb-12 render-stable">
          <div className="max-w-3xl pointer-events-auto">
            <MotionReveal>
              <p className="mb-8 md:mb-10 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-muted-foreground">
                07 — The Future System
              </p>
            </MotionReveal>
            <MotionReveal delay={0.08}>
              <h2 className="mb-10 md:mb-12 font-display text-[clamp(2.2rem,9vw,7rem)] leading-[0.98] md:leading-[0.95] tracking-[-0.04em] md:tracking-[-0.045em] font-medium text-gradient">
                Cleaner materials. Faster systems. Smarter infrastructure.
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.16}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <a href="mailto:me@sushanthpaatnaik.com?subject=Connect" className="btn-cinematic">
                  Connect
                </a>
                <a href="mailto:me@sushanthpaatnaik.com?subject=Invest" className="btn-cinematic">
                  Invest
                </a>
                <a href="mailto:me@sushanthpaatnaik.com?subject=Build%20with%20me" className="btn-cinematic-secondary">
                  Build with me <span className="text-[10px] opacity-60">→</span>
                </a>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.24}>
              <div className="mt-20 md:mt-28 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-9 font-mono text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground/45">
                <span>Graphene</span>
                <span className="h-[3px] w-[3px] rounded-full bg-primary/60" />
                <span>Nano-Materials</span>
                <span className="h-[3px] w-[3px] rounded-full bg-accent/60" />
                <span>AI · Climate</span>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.32}>
              <p className="mt-14 text-[10px] font-extralight uppercase tracking-[0.4em] text-muted-foreground/35 blur-[0.3px]">
                © Sushanth Paatnaik — Engineering matter, capital, and scale.
              </p>
            </MotionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}

