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
        <span key={i} className={i === 0 ? "text-foreground/80" : ""}>
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

/* ── Evidence Badge ───────────────────────────────────────────────────
   Small, restrained tag that signals how far a claim has been proven —
   not a "TESTED" stamp, a quiet confidence tier. Tier and label are
   DERIVED from the item's own stage/status text, never invented: the
   label is the founder-authored status string verbatim, and only the
   colour/icon tier is inferred from stage. Commercial reads with a
   touch of accent (most proven); Pilot is neutral; R&D recedes
   (least proven) — a hierarchy of confidence, not a badge farm. */
export type EvidenceStage = "Commercial" | "Pilot" | "R&D";

const EVIDENCE_TIER: Record<EvidenceStage, { icon: string; cls: string }> = {
  Commercial: { icon: "◆", cls: "border-accent/20 bg-accent/[0.06] text-accent/75" },
  Pilot: { icon: "◈", cls: "border-foreground/[0.14] bg-transparent text-foreground/60" },
  "R&D": { icon: "◇", cls: "border-foreground/[0.08] bg-transparent text-foreground/40" },
};

export function EvidenceBadge({
  stage,
  label,
  className = "",
}: {
  stage: EvidenceStage;
  /** The evidence text shown — pass the item's own status string verbatim. */
  label: string;
  className?: string;
}) {
  const tier = EVIDENCE_TIER[stage];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.28em] ${tier.cls} ${className}`}
    >
      <span className="opacity-70">{tier.icon}</span>
      {label}
    </span>
  );
}

/* ── Ecosystem Map ────────────────────────────────────────────────────
   Visualises how a set of ventures relate — sequential (feeds into),
   or supporting (runs across / underneath). Deliberately a plain
   vertical stack, not an SVG diagram with connector lines: stays
   readable at any width, never overflows on mobile, and every relation
   is a short, literal phrase rather than a drawn arrow that has to be
   traced. Content is caller-supplied — this component draws nothing
   it wasn't given. */
export type EcosystemRelation = "feeds" | "across" | "underneath" | "deploys";

const RELATION_LABEL: Record<EcosystemRelation, string> = {
  feeds: "feeds",
  across: "runs across all three",
  underneath: "sits underneath, as capital",
  deploys: "field-deploys the thinking",
};

export interface EcosystemNode {
  code: string;
  name: string;
  /** Short phrase for this venture's role in the flow — reuse existing copy verbatim. */
  role: string;
  domain: string;
  /** How this node connects to the next one. Omit on the final node. */
  relation?: EcosystemRelation;
}

export function EcosystemMap({ nodes, className = "" }: { nodes: EcosystemNode[]; className?: string }) {
  return (
    <div className={`not-prose overflow-hidden rounded-sm border border-foreground/[0.08] ${className}`}>
      {nodes.map((node, i) => (
        <div key={node.code}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: i * 0.07, ease: EASE_CINEMATIC }}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-[oklch(0.05_0.006_245)] px-5 py-4 md:px-6 md:py-5"
          >
            <span className="font-mono text-[10px] text-muted-foreground/50">{node.code}</span>
            <span className="font-display text-[16px] md:text-[17px] tracking-[-0.01em] text-foreground/95">
              {node.name}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/45">
              {node.role}
            </span>
            <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-accent/60">
              {node.domain}
            </span>
          </motion.div>
          {node.relation && (
            <div className="flex items-center gap-3 border-y border-foreground/[0.06] bg-[oklch(0.035_0_0)] px-5 py-2 md:px-6">
              <span aria-hidden className="text-foreground/25">↓</span>
              <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-muted-foreground/45">
                {RELATION_LABEL[node.relation]}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
