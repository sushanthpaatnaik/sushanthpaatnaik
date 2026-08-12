import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type Lenis from "lenis";
import { N_CHAPTERS, CHAPTER_BANDS } from "./chapterBands";

// Order and length must match CHAPTER_BANDS.
const chapters = [
  { id: "spark", label: "Origin" },
  { id: "carbon-intelligence", label: "Material Intelligence" },
  { id: "industrial", label: "Industrial Translation" },
  { id: "recognition", label: "Recognition & Ecosystem" },
  { id: "future", label: "Future Systems" },
];

function getChapterFromProgress(sp: number): number {
  // Use band midpoints as chapter centers — chapter is active once scroll
  // crosses 55 % of its band start (earlier = feels laggy, later = snappy).
  for (let i = N_CHAPTERS - 1; i >= 0; i--) {
    const [bIn, bOut] = CHAPTER_BANDS[i];
    const threshold = i === 0 ? 0 : bIn + (bOut - bIn) * 0.05;
    if (sp >= threshold) return i;
  }
  return 0;
}

export default function HUD({
  scrollProgress: _scrollProgress,
  lenisRef,
}: {
  scrollProgress: React.MutableRefObject<number>;
  lenisRef?: React.MutableRefObject<Lenis | null>;
}) {
  const [idx, setIdx] = useState(0);
  const lastIdx = useRef(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (sp) => {
    const next = getChapterFromProgress(sp);
    if (next !== lastIdx.current) {
      lastIdx.current = next;
      setIdx(next);
    }
  });

  // Jump to a chapter's band midpoint. Routed through Lenis when it is
  // driving the page: the canvas sequence reads lenis.targetScroll, and a
  // bare window.scrollTo moves the document without updating that, which
  // would leave the background frozen on the old frame after a rail click.
  // Native scroll (touch devices, reduced-motion) has no Lenis instance and
  // falls through to window.scrollTo.
  const goToChapter = (i: number) => {
    if (typeof window === "undefined") return;
    const [bIn, bOut] = CHAPTER_BANDS[i];
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.round(((bIn + bOut) / 2) * limit);
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <>
      {/* ─── Left rail: documentary chapter markers ─────────────────────── */}
      <div className="fixed left-0 top-0 z-40 hidden h-full lg:flex flex-col justify-center pointer-events-none">
        {/* Translucent backing panel — dissolves into darkness at edges */}
        <div
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[68px] h-[min(400px,60vh)]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.018 0.006 245 / 0.75) 0%, oklch(0.022 0.006 245 / 0.38) 55%, transparent 100%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        />

        {/* Chapter ladder */}
        <nav className="relative z-10 flex flex-col items-start gap-[18px] pl-5">
          {chapters.map((chapter, i) => {
            const active = i === idx;
            const distance = Math.abs(i - idx);
            const isNear = distance <= 1;

            return (
              <ChapterMarker
                key={chapter.id}
                chapter={chapter}
                active={active}
                distance={distance}
                visible={isNear}
                onSelect={() => goToChapter(i)}
              />
            );
          })}

          {/* Vertical spine connecting markers */}
          <div
            aria-hidden
            className="absolute left-[9px] top-[10px] bottom-[10px] w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.967 0 0 / 0.11) 15%, oklch(0.967 0 0 / 0.13) 85%, transparent 100%)",
            }}
          />
          <motion.div
            aria-hidden
            className="absolute left-[8.5px] w-[2px] rounded-full pointer-events-none"
            style={{
              top: 0,
              height: 26,
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.78 0.06 232 / 0.55) 50%, transparent 100%)",
              mixBlendMode: "screen",
            }}
            animate={{ y: ["8%", "92%"], opacity: [0, 0.85, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </nav>
      </div>
    </>
  );
}

function ChapterMarker({
  chapter,
  active,
  visible,
  onSelect,
}: {
  chapter: { id: string; label: string };
  active: boolean;
  distance: number;
  visible: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Reveal the label on keyboard focus too, otherwise a keyboard user tabbing
  // the rail sees only an unlabelled dot.
  const showLabel = active || hovered || focused;

  return (
    <button
      type="button"
      aria-label={`Go to ${chapter.label}`}
      aria-current={active ? "true" : undefined}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="relative flex items-center gap-3 pointer-events-auto cursor-pointer bg-transparent border-0 p-0 text-left rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {/* Active backdrop glow — soft documentary spotlight, breathes when active */}
      <motion.div
        className="absolute -inset-x-4 -inset-y-3 rounded-md pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 28% 50%, oklch(0.71 0.06 232 / 0.12), transparent 78%)",
          filter: "blur(2px)",
        }}
        initial={false}
        animate={{
          opacity: active ? [0.85, 1, 0.85] : 0,
        }}
        transition={{
          opacity: active
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
        }}
      />

      {/* Dot indicator with animated active state */}
      <div className="relative z-10 flex items-center justify-center w-[23px] h-[23px]">
        {/* Glow ring (active only) */}
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{
            background: "oklch(0.74 0.06 232 / 0.18)",
            boxShadow: "0 0 10px oklch(0.74 0.06 232 / 0.22), 0 0 22px oklch(0.74 0.06 232 / 0.09)",
          }}
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1 : 1.5,
          }}
          transition={{ duration: 0.72, ease: [0.19, 1, 0.22, 1] }}
        />

        {/* Core dot */}
        <motion.div
          className="relative z-10 rounded-full"
          style={{
            background: active
              ? "oklch(0.97 0.0 0)"
              : "oklch(0.55 0.0 0 / 0.38)",
            boxShadow: active
              ? "0 1px 4px rgba(0,0,0,0.55), 1px 2px 3px rgba(0,0,0,0.38)"
              : "none",
          }}
          initial={false}
          animate={{
            width: active ? 7 : 4,
            height: active ? 7 : 4,
            background: active
              ? "oklch(0.97 0.0 0)"
              : "oklch(0.55 0.0 0 / 0.38)",
          }}
          transition={{ duration: 0.72, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      {/* Label — chapter name only (no numbering) */}
      <motion.div
        className="relative z-10 flex items-baseline gap-2"
        initial={false}
        animate={{
          opacity: active ? 0.98 : visible ? (hovered ? 0.9 : 0.62) : 0.36,
          x: active ? 1 : 0,
        }}
        transition={{ duration: 0.76, ease: [0.19, 1, 0.22, 1] }}
      >

        {/* Chapter label — reveals on active / hover */}
        <motion.span
          className="text-[10px] uppercase tracking-[0.32em] font-light select-none whitespace-nowrap"
          style={{
            color: active
              ? "oklch(0.967 0.0 0 / 0.96)"
              : "oklch(0.62 0.0 0 / 0.48)",
          }}
          initial={false}
          animate={{
            opacity: showLabel ? 1 : 0,
            x: showLabel ? 0 : -6,
          }}
          transition={{ duration: 0.63, ease: [0.19, 1, 0.22, 1] }}
        >
          {chapter.label}
        </motion.span>
      </motion.div>
    </button>
  );
}
