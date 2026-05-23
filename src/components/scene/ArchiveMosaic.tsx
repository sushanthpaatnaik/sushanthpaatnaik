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
  const span =
    item.shape === "wide"
      ? "sm:col-span-2"
      : item.shape === "tall"
        ? "row-span-2"
        : "";
  const aspect =
    item.shape === "tall"
      ? "aspect-[3/4]"
      : item.shape === "wide"
        ? "aspect-[16/10]"
        : "aspect-square";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay: (index % 6) * 0.05, ease: [0.19, 1, 0.22, 1] }}
      className={`group relative overflow-hidden bg-[oklch(0.05_0.006_245)] ring-1 ring-foreground/[0.06] ${span} ${aspect}`}
    >
      <img
        src={item.src}
        alt={`${item.caption} — ${item.meta}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-[1400ms] ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
        style={{
          objectPosition: item.focus ?? "center",
          filter: "grayscale(0.18) contrast(1.04) saturate(0.85) brightness(0.92)",
        }}
      />
      {/* Atmospheric base wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 35%, oklch(0.03 0.006 245 / 0.55) 78%, oklch(0.02 0.006 245 / 0.92) 100%)",
        }}
      />
      {/* Copper rim on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 0%, oklch(0.62 0.10 55 / 0.18), transparent 65%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
        <span className="block font-mono text-[9px] uppercase tracking-[0.38em] text-accent/75">
          {item.category}
        </span>
        <span className="mt-2 block font-display text-[13px] md:text-sm leading-snug text-foreground/95 tracking-[-0.005em]">
          {item.caption}
        </span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
          {item.meta}
        </span>
      </div>
    </motion.div>
  );
}

export default function ArchiveMosaic({ items }: { items: ArchiveItem[] }) {
  return (
    <div className="not-prose mt-10 grid auto-rows-[clamp(140px,18vw,220px)] grid-cols-2 gap-px bg-foreground/[0.05] sm:grid-cols-3 md:grid-cols-4 rounded-sm overflow-hidden ring-1 ring-foreground/[0.05]">
      {items.map((item, i) => (
        <ArchiveTile key={item.src} item={item} index={i} />
      ))}
    </div>
  );
}
