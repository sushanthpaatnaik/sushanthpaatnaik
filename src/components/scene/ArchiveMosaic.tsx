import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export type ArchiveItem = {
  src: string;
  caption: string;
  meta: string;
  category: "Award" | "Keynote" | "Honor" | "Fellowship";
  shape?: "wide" | "tall" | "square";
  focus?: string;
};

function ArchiveTile({ item, index }: { item: ArchiveItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.18, once: true });
  // Span the tile across grid tracks. Heights come from grid auto-rows so
  // every cell aligns to the same baseline — no aspect-ratio holes.
  const span =
    item.shape === "wide"
      ? "sm:col-span-2 row-span-1"
      : item.shape === "tall"
        ? "row-span-2"
        : "row-span-1";

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
        alt={`${item.caption} — ${item.meta}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-[1400ms] ease-out group-hover:opacity-100 group-hover:scale-[1.035]"
        style={{
          objectPosition: item.focus ?? "center 30%",
          filter: "grayscale(0.12) contrast(1.05) saturate(0.88) brightness(0.94)",
        }}
      />
      {/* Atmospheric caption wash — uniform editorial gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.30) 0%, transparent 22%, transparent 52%, oklch(0.025 0.006 245 / 0.72) 84%, oklch(0.018 0.006 245 / 0.94) 100%)",
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
      {/* Editorial caption — consistent block at the bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 md:p-4">
        <span className="block font-mono text-[9px] uppercase tracking-[0.38em] text-accent/80">
          {item.category}
        </span>
        <span className="mt-1.5 block font-display text-[12.5px] md:text-[13.5px] leading-snug text-foreground/95 tracking-[-0.005em] line-clamp-2">
          {item.caption}
        </span>
        <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/55 line-clamp-1">
          {item.meta}
        </span>
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
