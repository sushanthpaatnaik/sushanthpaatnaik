import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export type ArchiveItem = {
  src: string;
  /** Generic fallback caption when institutional fields aren't supplied. */
  caption: string;
  meta: string;
  category: "Award" | "Keynote" | "Honor" | "Fellowship";
  shape?: "hero" | "wide" | "tall" | "square";
  focus?: string;
  /** Force object-fit on triptych/large frames. Defaults to "cover". */
  fit?: "cover" | "contain";
  /** Issuing institution, e.g. "National Innovation Foundation". */
  institution?: string;
  /** Recognition + year, e.g. "Presidential Recognition · 2008". */
  recognition?: string;
  /** Presenter, e.g. "Presented by Dr. A.P.J. Abdul Kalam". */
  presenter?: string;
  /** Venue, e.g. "Rashtrapati Bhavan · New Delhi". */
  venue?: string;
};

function ArchiveTile({ item, index }: { item: ArchiveItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.18, once: true });
  const isHero = item.shape === "hero";

  // Grid spans for editorial rhythm. Hero tiles dominate two columns and
  // two rows on tablet+ — the rest fall into a measured cadence.
  const span = isHero
    ? "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2"
    : item.shape === "wide"
      ? "sm:col-span-2 row-span-1"
      : item.shape === "tall"
        ? "row-span-2"
        : "row-span-1";

  // Use the rich institutional caption when available, else fall back.
  const hasInstitutional =
    item.institution || item.recognition || item.presenter || item.venue;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay: (index % 6) * 0.05, ease: [0.19, 1, 0.22, 1] }}
      className={`group relative overflow-hidden bg-[oklch(0.05_0.006_245)] ring-1 ring-foreground/[0.05] ${span}`}
    >
      <img
        src={item.src}
        alt={`${item.institution ?? item.caption} — ${item.recognition ?? item.meta}`}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-[1.035] ${
          isHero ? "opacity-95 group-hover:opacity-100" : "opacity-90 group-hover:opacity-100"
        }`}
        style={{
          objectPosition: item.focus ?? "center 30%",
          filter: isHero
            ? "grayscale(0.06) contrast(1.06) saturate(0.94) brightness(0.96)"
            : "grayscale(0.12) contrast(1.05) saturate(0.88) brightness(0.94)",
        }}
      />
      {/* Cinematic dark wash — slightly deeper on hero for caption legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: isHero
            ? "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.34) 0%, transparent 28%, transparent 44%, oklch(0.02 0.006 245 / 0.80) 80%, oklch(0.014 0.006 245 / 0.97) 100%)"
            : "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.30) 0%, transparent 22%, transparent 52%, oklch(0.025 0.006 245 / 0.72) 84%, oklch(0.018 0.006 245 / 0.94) 100%)",
        }}
      />
      {/* Soft copper rim on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 0%, oklch(0.62 0.08 55 / 0.14), transparent 65%)",
        }}
      />
      {/* Hero badge — archival corner mark */}
      {isHero && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span className="h-px w-6 bg-accent/70" />
          <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-accent/85">
            Hallmark
          </span>
        </div>
      )}

      {/* Editorial caption block */}
      <div className={`absolute inset-x-0 bottom-0 z-10 ${isHero ? "p-5 md:p-7" : "p-3.5 md:p-4"}`}>
        <span
          className={`block font-mono uppercase text-accent/80 ${
            isHero
              ? "text-[10px] tracking-[0.42em]"
              : "text-[9px] tracking-[0.38em]"
          }`}
        >
          {item.category}
        </span>

        {hasInstitutional ? (
          <div className={isHero ? "mt-2.5" : "mt-1.5"}>
            {item.institution && (
              <span
                className={`block font-display text-foreground/95 tracking-[-0.01em] ${
                  isHero
                    ? "text-[20px] md:text-[24px] leading-[1.15]"
                    : "text-[13px] md:text-[14px] leading-snug line-clamp-2"
                }`}
              >
                {item.institution}
              </span>
            )}
            {item.recognition && (
              <span
                className={`mt-1 block font-mono uppercase text-foreground/65 ${
                  isHero ? "text-[10px] tracking-[0.26em]" : "text-[9.5px] tracking-[0.22em] line-clamp-1"
                }`}
              >
                {item.recognition}
              </span>
            )}
            {item.presenter && (
              <span
                className={`mt-2 block text-foreground/75 tracking-[-0.005em] ${
                  isHero ? "text-[13.5px] md:text-[14.5px] leading-snug" : "text-[11.5px] leading-snug line-clamp-1"
                } font-display italic`}
              >
                {item.presenter}
              </span>
            )}
            {item.venue && (
              <span
                className={`mt-1 block font-mono uppercase text-foreground/50 ${
                  isHero ? "text-[9.5px] tracking-[0.28em]" : "text-[9px] tracking-[0.24em] line-clamp-1"
                }`}
              >
                {item.venue}
              </span>
            )}
          </div>
        ) : (
          <>
            <span className="mt-1.5 block font-display text-[12.5px] md:text-[13.5px] leading-snug text-foreground/95 tracking-[-0.005em] line-clamp-2">
              {item.caption}
            </span>
            <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/55 line-clamp-1">
              {item.meta}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function ArchiveMosaic({ items }: { items: ArchiveItem[] }) {
  return (
    <div
      className="not-prose mt-10 grid auto-rows-[clamp(150px,17vw,210px)] grid-cols-2 gap-px bg-foreground/[0.04] sm:grid-cols-3 md:grid-cols-4 rounded-sm overflow-hidden ring-1 ring-foreground/[0.04]"
      style={{ gridAutoFlow: "dense" }}
    >
      {items.map((item, i) => (
        <ArchiveTile key={item.src} item={item} index={i} />
      ))}
    </div>
  );
}

/**
 * Hall of Fame ribbon — a horizontal cinematic strip for media coverage,
 * stage moments, honorary moments and public demonstrations. Designed
 * to read like a single continuous archival reel.
 */
export function HallOfFameRibbon({
  items,
  eyebrow = "Hall of Fame · Reel",
}: {
  items: ArchiveItem[];
  eyebrow?: string;
}) {
  return (
    <div className="not-prose mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-foreground/[0.08]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-foreground/[0.08]" />
      </div>
      <div
        className="flex gap-px overflow-x-auto bg-foreground/[0.04] ring-1 ring-foreground/[0.05] rounded-sm
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <motion.figure
            key={item.src + i}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: (i % 8) * 0.04, ease: [0.19, 1, 0.22, 1] }}
            className="group relative h-[230px] md:h-[260px] w-[300px] md:w-[340px] flex-shrink-0 overflow-hidden bg-[oklch(0.05_0.006_245)]"
          >
            <img
              src={item.src}
              alt={item.caption}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-[1200ms] ease-out group-hover:scale-[1.04] group-hover:opacity-100"
              style={{
                objectPosition: item.focus ?? "center 30%",
                filter: "grayscale(0.14) contrast(1.05) saturate(0.85) brightness(0.92)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.28) 0%, transparent 35%, oklch(0.02 0.006 245 / 0.78) 86%, oklch(0.014 0.006 245 / 0.96) 100%)",
              }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 z-10 p-3.5">
              <span className="block font-mono text-[9px] uppercase tracking-[0.38em] text-accent/80">
                {item.category}
              </span>
              <span className="mt-1.5 block font-display text-[12.5px] leading-snug text-foreground/95 tracking-[-0.005em] line-clamp-2">
                {item.caption}
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/55 line-clamp-1">
                {item.meta}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

/**
 * LegacyTimeline — chronological prestige flow. A horizontal museum-style
 * timeline that anchors the archive in a single legible arc of years and
 * defining institutional moments.
 */
export function LegacyTimeline({
  items,
  eyebrow = "Legacy · Chronological Prestige",
}: {
  items: { year: string; title: string; institution: string }[];
  eyebrow?: string;
}) {
  return (
    <div className="not-prose mt-12">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-foreground/[0.08]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-foreground/[0.08]" />
      </div>
      <div
        className="relative flex gap-px overflow-x-auto bg-foreground/[0.04] ring-1 ring-foreground/[0.05] rounded-sm
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it, i) => (
          <motion.div
            key={it.year + i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75, delay: (i % 8) * 0.05, ease: [0.19, 1, 0.22, 1] }}
            className="relative flex w-[200px] md:w-[220px] flex-shrink-0 flex-col gap-2 bg-[oklch(0.05_0.006_245)] px-5 py-6"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/80">
              {it.year}
            </span>
            <span className="font-display text-[14px] md:text-[15px] leading-snug text-foreground/95 tracking-[-0.005em]">
              {it.title}
            </span>
            <span className="mt-auto font-mono text-[9.5px] uppercase tracking-[0.24em] text-foreground/55 line-clamp-2">
              {it.institution}
            </span>
            <span className="absolute left-0 right-0 top-1/2 h-px bg-foreground/[0.04]" aria-hidden />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * StatsAuthorityBlock — institutional statistics with a museum-style
 * eyebrow header. Replaces the bare counters strip.
 */
export function StatsAuthorityBlock({
  items,
  eyebrow = "Archive · Register of Record",
}: {
  items: { value: string; label: string }[];
  eyebrow?: string;
}) {
  return (
    <div className="not-prose mt-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-foreground/[0.08]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-foreground/[0.08]" />
      </div>
      <div className="grid grid-cols-2 gap-px bg-foreground/[0.05] sm:grid-cols-4 rounded-sm overflow-hidden ring-1 ring-foreground/[0.05]">
        {items.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-center justify-center gap-2 bg-[oklch(0.05_0.006_245)] px-4 py-10"
          >
            <span className="font-display text-4xl md:text-6xl tracking-[-0.035em] text-foreground/95">
              {c.value}
            </span>
            <span className="h-px w-6 bg-accent/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/60 text-center">
              {c.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * ArchivePlate — single museum-style plate. One image, one rich editorial
 * caption block. Alternates left/right at md+. Replaces the dense masonry
 * grid for a deliberate, institutional reading rhythm.
 */
export function ArchivePlate({
  item,
  index,
  plateNumber,
}: {
  item: ArchiveItem;
  index: number;
  plateNumber: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });
  const flip = index % 2 === 1;

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.05, ease: [0.19, 1, 0.22, 1] }}
      className={`group grid grid-cols-1 gap-px bg-foreground/[0.05] ring-1 ring-foreground/[0.05] md:grid-cols-12 ${
        flip ? "md:[&>figcaption]:order-first" : ""
      }`}
    >
      <div className="relative col-span-1 aspect-[4/3] overflow-hidden bg-[oklch(0.05_0.006_245)] md:col-span-8 md:aspect-auto md:min-h-[420px]">
        <img
          src={item.src}
          alt={`${item.institution ?? item.caption} — ${item.recognition ?? item.meta}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-95 transition-all duration-[1500ms] ease-out group-hover:scale-[1.025] group-hover:opacity-100"
          style={{
            objectPosition: item.focus ?? "center 30%",
            filter: "grayscale(0.08) contrast(1.07) saturate(0.92) brightness(0.96)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.30) 0%, transparent 35%, oklch(0.02 0.006 245 / 0.45) 100%)",
          }}
        />
        {/* Archival corner mark */}
        <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
          <span className="h-px w-6 bg-accent/70" />
          <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-accent/85">
            Plate {plateNumber}
          </span>
        </div>
      </div>

      <figcaption className="relative col-span-1 flex flex-col justify-between gap-8 bg-[oklch(0.045_0.006_245)] p-7 md:col-span-4 md:p-9">
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.42em] text-accent/80">
            {item.category}
          </span>
          <span className="mt-5 block font-display text-[22px] leading-[1.18] tracking-[-0.012em] text-foreground/95 md:text-[26px]">
            {item.institution ?? item.caption}
          </span>
          {item.recognition && (
            <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/65">
              {item.recognition}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {item.presenter && (
            <p className="font-display text-[14px] italic leading-snug text-foreground/75">
              {item.presenter}
            </p>
          )}
          {item.venue && (
            <p className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-foreground/55">
              {item.venue}
            </p>
          )}
          {!item.presenter && !item.venue && (
            <p className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-foreground/55">
              {item.meta}
            </p>
          )}
        </div>

        <span
          aria-hidden
          className="absolute inset-y-7 left-0 hidden w-px bg-foreground/[0.06] md:block"
        />
      </figcaption>
    </motion.figure>
  );
}

/**
 * ArchivePlateSeries — stacks plates with a hairline separator and an
 * archival series header. Museum-exhibit reading rhythm.
 */
export function ArchivePlateSeries({
  items,
  eyebrow,
  startIndex = 1,
}: {
  items: ArchiveItem[];
  eyebrow?: string;
  startIndex?: number;
}) {
  return (
    <div className="not-prose mt-10">
      {eyebrow && (
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-foreground/[0.08]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
            {eyebrow}
          </span>
          <span className="h-px flex-1 bg-foreground/[0.08]" />
        </div>
      )}
      <div className="flex flex-col gap-px bg-foreground/[0.04]">
        {items.map((item, i) => (
          <ArchivePlate
            key={item.src + i}
            item={item}
            index={i}
            plateNumber={String(startIndex + i).padStart(2, "0")}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * PresidentialTriptych — three monumental columns for the three Presidents
 * of India. The centerpiece of the archive.
 */
export function PresidentialTriptych({
  items,
  eyebrow = "Presidential Recognitions · Three Sitting Presidents of India",
}: {
  items: ArchiveItem[];
  eyebrow?: string;
}) {
  return (
    <div className="not-prose mt-12">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-foreground/[0.08]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-foreground/[0.08]" />
      </div>
      <div className="grid grid-cols-1 gap-px bg-foreground/[0.05] ring-1 ring-foreground/[0.05] md:grid-cols-3">
        {items.map((item, i) => (
          <motion.figure
            key={item.src + i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, delay: i * 0.12, ease: [0.19, 1, 0.22, 1] }}
            className="group relative flex flex-col bg-[oklch(0.05_0.006_245)]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={item.src}
                alt={item.presenter ?? item.caption}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-92 transition-all duration-[1600ms] ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                style={{
                  objectPosition: item.focus ?? "center 28%",
                  filter: "grayscale(0.10) contrast(1.08) saturate(0.90) brightness(0.95)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.32) 0%, transparent 40%, oklch(0.02 0.006 245 / 0.78) 88%, oklch(0.014 0.006 245 / 0.96) 100%)",
                }}
              />
              <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.42em] text-accent/85">
                № {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <figcaption className="flex flex-col gap-2 p-6">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-accent/75">
                {item.recognition ?? item.meta}
              </span>
              <span className="font-display text-[18px] leading-[1.18] tracking-[-0.01em] text-foreground/95">
                {item.presenter ?? item.caption}
              </span>
              <span className="mt-1 h-px w-8 bg-accent/40" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-foreground/55">
                {item.venue ?? item.institution}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
