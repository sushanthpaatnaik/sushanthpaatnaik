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
