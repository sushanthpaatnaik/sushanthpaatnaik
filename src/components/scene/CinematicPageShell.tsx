import { type ReactNode } from "react";
import { motion } from "framer-motion";
import Nav from "./Nav";
import AmbientAtmosphere from "./AmbientAtmosphere";
import CursorAura from "./CursorAura";

interface CinematicPageShellProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  backdrop: string;
  /** 0..1 — base darkening over the backdrop. Default 0.78 for reading-heavy pages. */
  overlay?: number;
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
  children,
}: CinematicPageShellProps) {
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
            filter: "blur(4px) saturate(0.38) brightness(0.46) contrast(1.05)",
            transform: "scale(1.10)",
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
            filter: "blur(28px) saturate(0.32) brightness(0.42)",
            transform: "scale(1.16)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #000 85%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, #000 85%)",
            opacity: 0.85,
          }}
        />
        {/* Graphite/blue-black wash */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, oklch(0.04 0.006 260 / ${overlay + 0.06}) 0%, oklch(0.03 0.005 260 / ${overlay}) 45%, oklch(0.03 0.005 260 / ${overlay + 0.04}) 100%)`,
          }}
        />
        {/* Restrained copper rim, off-axis */}
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(60% 50% at 82% 18%, oklch(0.62 0.10 55 / 0.07), transparent 60%)",
          }}
        />
        {/* Cool depth glow */}
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(70% 55% at 18% 78%, oklch(0.42 0.07 240 / 0.10), transparent 65%)",
          }}
        />
        {/* Slow breathing center luminance — keeps the page alive even when
            scrolling stalls. */}
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 50%, oklch(0.55 0.05 235 / 0.05), transparent 70%)",
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Full vignette — deepened so the archival plate falls off
            cinematically toward the corners. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 78% at 50% 50%, transparent 38%, oklch(0.02 0 0 / 0.72) 100%)",
          }}
        />
      </div>

      {/* Ambient micro-life + cursor aura, matching the homepage */}
      <AmbientAtmosphere />
      <CursorAura />

      <Nav />

      <main className="relative z-10">
        {/* Hero block */}
        <section className="px-5 sm:px-6 pt-36 md:pt-44 pb-14 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
              className="text-[10px] uppercase tracking-[0.45em] text-primary/75"
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
        <div className="px-5 sm:px-6 pb-32 md:pb-40">
          <div className="mx-auto max-w-4xl">{children}</div>
        </div>

        {/* Footer trace */}
        <footer className="relative z-10 border-t border-foreground/[0.06] px-5 sm:px-6 py-10">
          <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
            <span>Sushanth Paatnaik · India → World</span>
            <a
              href="mailto:info@sushanthpaatnaik.com"
              className="hover:text-foreground/80 transition-colors"
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
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.07] pt-10 md:pt-14 mt-16 md:mt-24 first:mt-0 first:border-t-0 first:pt-0"
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
