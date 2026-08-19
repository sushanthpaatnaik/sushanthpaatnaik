import { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Nav from "./Nav";
import AmbientAtmosphere from "./AmbientAtmosphere";
import CursorAura from "./CursorAura";
import SignatureMotif from "./SignatureMotif";

interface CinematicPageShellProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  backdrop: string;
  /** 0..1 — base darkening over the backdrop. Default 0.78 for reading-heavy pages. */
  overlay?: number;
  /**
   * Tailwind class(es) controlling the bottom padding of the content wrapper.
   * Defaults to "pb-32 md:pb-40" for pages ending with EditorialSection.
   * Pass "pb-0" for pages whose last section manages its own vertical close
   * (e.g. cinematic full-bleed sections with their own padding rhythm).
   */
  contentPb?: string;
  children: ReactNode;
}

/**
 * Shared cinematic page shell. Inherits the homepage's dark industrial
 * language: graphite/blue-black backdrop, ambient haze + grain, restrained
 * copper rim, full vignette, and editorial typography. Each section page
 * gets its own graded plate to feel like entering a focused world inside
 * the larger ecosystem — without competing with the homepage gateway.
 */
export default function CinematicPageShell({
  eyebrow,
  title,
  lead,
  backdrop,
  overlay = 0.78,
  contentPb = "pb-32 md:pb-40",
  children,
}: CinematicPageShellProps) {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground noise overflow-x-clip">
      {/* Fixed cinematic backdrop — single graded plate, heavily atmospheric */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "var(--plate-filter)",
            transform: "scale(1.10) translateZ(0)",
            willChange: "transform",
          }}
        />
        {/* Edge-haze mask — heavier blur on the image perimeter so the
            archival plate dissolves into atmosphere rather than sitting
            cleanly framed behind the typography. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "var(--plate-haze-filter)",
            transform: "scale(1.16)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #000 85%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #000 85%)",
            opacity: "var(--plate-haze-opacity)",
          }}
        />
        {/* The wash that turns the photograph into a ground. Its colour is a
            token and its alpha stays the caller's `overlay`, so a page that
            asked for 0.78 gets 0.78 of whichever ink the theme uses —
            graphite in the dark, paper in the light. color-mix rather than a
            second alpha token, because the two have to stay one number. */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, color-mix(in oklab, var(--plate-ink-top) ${(overlay + 0.06) * 100}%, transparent) 0%, color-mix(in oklab, var(--plate-ink) ${overlay * 100}%, transparent) 45%, color-mix(in oklab, var(--plate-ink) ${(overlay + 0.04) * 100}%, transparent) 100%)`,
          }}
        />
        {/* Restrained copper rim, off-axis */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--plate-rim)", mixBlendMode: "var(--plate-blend)" as never }}
        />
        {/* Cool depth glow */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--plate-depth)", mixBlendMode: "var(--plate-blend)" as never }}
        />
        {/* Slow breathing center luminance — desktop only (mobile has no room
            for the extra compositor layer + RAF). */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "var(--plate-breath)", mixBlendMode: "var(--plate-blend)" as never }}
          animate={isTouch ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={isTouch ? undefined : { duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Full vignette — deepened so the archival plate falls off
            cinematically toward the corners. */}
        <div className="absolute inset-0" style={{ background: "var(--plate-vignette)" }} />
        {/* Proprietary signature watermark — slow orbital lattice anchored
            off-axis, ultra-low opacity. Becomes the brand's recurring
            atmospheric identity object across every page. */}
        <div className="absolute right-[-90px] bottom-[-80px] hidden md:block">
          <SignatureMotif variant="watermark" />
        </div>
      </div>

      {/* Ambient micro-life + cursor aura — desktop/fine-pointer only.
          On touch these are expensive GPU compositor layers with no UX value. */}
      {!isTouch && <AmbientAtmosphere />}
      {!isTouch && <CursorAura />}

      <Nav />

      <main id="main" className="relative z-10">
        {/* Hero block */}
        <section className="px-5 sm:px-6 pt-36 md:pt-44 pb-14 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
              className="text-[10px] uppercase tracking-[0.45em] text-foreground/55"
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.3, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6 font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.98] tracking-[-0.04em] text-gradient"
            >
              {title}
            </motion.h1>
            {lead && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.28, ease: [0.19, 1, 0.22, 1] }}
                className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-foreground/75"
              >
                {lead}
              </motion.p>
            )}
          </div>
        </section>

        {/* Page content */}
        <div className={`px-5 sm:px-6 ${contentPb}`}>
          <div className="mx-auto max-w-4xl">{children}</div>
        </div>

        {/* Footer trace */}
        <footer className="relative z-10 border-t border-foreground/[0.06] px-5 sm:px-6 py-10">
          <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
            <span>Sushanth Paatnaik · India → World</span>
            {/* min-h-6 = 24px, WCAG 2.2 SC 2.5.8. The type is 10px, so the
                anchor's own box was 16px tall on every page of the site. */}
            <a
              href="mailto:info@sushanthpaatnaik.com"
              className="inline-flex min-h-6 items-center hover:text-foreground/80 transition-colors"
            >
              info@sushanthpaatnaik.com
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------- Reusable editorial primitives ---------- */

export function EditorialSection({
  number,
  heading,
  children,
}: {
  number?: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px -80px 0px" }}
      transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.07] pt-7 md:pt-10 mt-10 md:mt-14 first:mt-0 first:border-t-0 first:pt-0"
    >
      {number && (
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
          {number}
        </p>
      )}
      <h2 className="mt-4 font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
        {heading}
      </h2>
      <div className="mt-6 space-y-5 text-[15px] md:text-base leading-relaxed text-foreground/75">
        {children}
      </div>
    </motion.section>
  );
}

export function EditorialList({
  items,
}: {
  items: { n?: string; title: string; body: string }[];
}) {
  return (
    <ul className="mt-10 md:mt-14 flex flex-col gap-10 md:gap-12">
      {items.map((it, i) => (
        <motion.li
          key={`${it.title}-${i}`}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
          className="border-t border-foreground/[0.07] pt-8"
        >
          {it.n && (
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
              {it.n}
            </p>
          )}
          <h3 className="mt-4 font-display text-xl md:text-2xl tracking-[-0.015em] text-foreground/95">
            {it.title}
          </h3>
          <p className="mt-3 max-w-2xl text-[15px] md:text-base leading-relaxed text-foreground/70">
            {it.body}
          </p>
        </motion.li>
      ))}
    </ul>
  );
}
