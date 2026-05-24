/**
 * Cinematic Design System — shared primitives.
 *
 * Every page should import from here for stats strips, atmospheric washes,
 * and editorial mastheads. Local re-implementations are forbidden — they
 * drift the system. New shared shapes go here, not in route files.
 */
import { motion } from "framer-motion";
import { type ReactNode } from "react";

/** Unified cinematic easing + reveal duration. Use everywhere. */
export const EASE_CINEMATIC = [0.19, 1, 0.22, 1] as const;
export const DUR_REVEAL = 1.15;

/* ── Atmospheric Wash ─────────────────────────────────────────────────
   Fixed background wash for pages that don't use CinematicPageShell
   (essays index, essay reader, etc.). Matches the shell's gradient
   language so every page reads as the same world. */
export function AtmosphericWash() {
  return (
    <div
      aria-hidden
      className="atmosphere-wash pointer-events-none fixed inset-0 z-0"
    />
  );
}

/* ── Stats Strip ──────────────────────────────────────────────────────
   The horizontal authority block used across recognitions, news,
   early-works, contact, engage, ventures. Same paddings, same hairlines,
   same reveal cadence. */
export interface StatItem {
  v: ReactNode;
  l: string;
}

export function StatsStrip({
  items,
  eyebrow,
  className = "",
}: {
  items: StatItem[];
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={`not-prose ${className}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: DUR_REVEAL, ease: EASE_CINEMATIC }}
          className="mb-5 font-mono text-[10px] uppercase tracking-[0.4em] text-accent/80"
        >
          {eyebrow}
        </motion.p>
      )}
      <div
        className="grid grid-cols-2 gap-px overflow-hidden rounded-sm hairline md:grid-cols-4"
        style={{ background: "var(--surface-hairline)" }}
      >
        {items.map((s, i) => (
          <motion.div
            key={`${i}-${s.l}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: DUR_REVEAL,
              delay: i * 0.06,
              ease: EASE_CINEMATIC,
            }}
            className="surface-plate px-5 py-7 md:px-7 md:py-9"
          >
            <p className="font-display text-xl md:text-2xl tracking-[-0.02em] text-foreground/95">
              {s.v}
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground/60">
              {s.l}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Masthead Rule ────────────────────────────────────────────────────
   A two- or three-slot hairline-bordered rule for publication-style
   section openers (news folio, essays archive, recognitions register). */
export function MastheadRule({ slots }: { slots: ReactNode[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: DUR_REVEAL, ease: EASE_CINEMATIC }}
      className="flex flex-wrap items-baseline justify-between gap-3 hairline-t hairline-b py-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/55"
    >
      {slots.map((s, i) => (
        <span key={i} className={i === 0 ? "text-primary/80" : ""}>
          {s}
        </span>
      ))}
    </motion.div>
  );
}

/* ── Cinematic Image ──────────────────────────────────────────────────
   Drop-in <img> wrapper that applies unified grading (filter + transition)
   and an optional cinematic overlay. Pages should prefer this over
   hand-rolling filter classes. */
export function CinematicImage({
  src,
  alt,
  objectPosition,
  overlay = true,
  cornerMarks = false,
  className = "",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  overlay?: boolean;
  cornerMarks?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${overlay ? "cinematic-overlay" : ""} ${
        cornerMarks ? "corner-marks" : ""
      } ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="cinematic-image absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: objectPosition ?? "center" }}
      />
    </div>
  );
}
