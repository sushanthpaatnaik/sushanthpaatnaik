import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

const chapters = [
  { id: "spark", label: "Origin" },
  { id: "founder", label: "Founder" },
  { id: "carbon-intelligence", label: "Material Intelligence" },
  { id: "industrial", label: "Industrial Translation" },
  { id: "recognition", label: "Recognition" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "future", label: "Future Systems" },
];

export default function HUD({
  scrollProgress: _scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const [idx, setIdx] = useState(0);
  const lastIdx = useRef(0);
  const phase = useChapterPhase(HOME_CHAPTER_IDS);

  useMotionValueEvent(phase, "change", (v) => {
    const next = Math.min(
      chapters.length - 1,
      Math.max(0, Math.round(v)),
    );
    if (next !== lastIdx.current) {
      lastIdx.current = next;
      setIdx(next);
    }
  });

  useEffect(() => {
    // Initial sync (motion value may already be at a non-zero value on mount
    // when navigating back to the page mid-scroll).
    const next = Math.min(
      chapters.length - 1,
      Math.max(0, Math.round(phase.get())),
    );
    if (next !== lastIdx.current) {
      lastIdx.current = next;
      setIdx(next);
    }
  }, [phase]);



  return (
    <>
      {/* ─── Left rail: documentary chapter markers ─────────────────────── */}
      <div className="fixed left-0 top-0 z-40 hidden h-full lg:flex flex-col justify-center pointer-events-none">
        {/* Translucent backing panel — dissolves into darkness at edges */}
        <div
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-[400px]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.025 0.006 245 / 0.72) 0%, oklch(0.025 0.006 245 / 0.42) 50%, transparent 100%)",
            WebkitBackdropFilter: "blur(10px) saturate(120%)",
            backdropFilter: "blur(10px) saturate(120%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          }}
        />

        {/* Chapter ladder */}
        <nav className="relative z-10 flex flex-col items-start gap-5 pl-7">
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
              />
            );
          })}

          {/* Vertical spine connecting markers */}
          <div
            aria-hidden
            className="absolute left-[11px] top-[10px] bottom-[10px] w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.967 0 0 / 0.12) 15%, oklch(0.967 0 0 / 0.14) 85%, transparent 100%)",
            }}
          />
          {/* Ultra-slow energy propagation — a faint pulse traveling down
              the spine that signals the rail is a living instrument.
              ~14s loop, almost subliminal. */}
          <motion.div
            aria-hidden
            className="absolute left-[10.5px] w-[2px] rounded-full pointer-events-none"
            style={{
              top: 0,
              height: 26,
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.78 0.06 232 / 0.55) 50%, transparent 100%)",
              filter: "blur(1.2px)",
              mixBlendMode: "screen",
            }}
            animate={{ y: ["8%", "92%"], opacity: [0, 0.85, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
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
}: {
  chapter: { id: string; label: string };
  active: boolean;
  distance: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const showLabel = active || hovered;

  return (
    <div
      className="relative flex items-center gap-3 pointer-events-auto cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Active backdrop glow — soft documentary spotlight, breathes when active */}
      <motion.div
        className="absolute -inset-x-4 -inset-y-3 rounded-md pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 28% 50%, oklch(0.71 0.06 232 / 0.16), transparent 75%)",
          filter: "blur(2px)",
        }}
        initial={false}
        animate={{
          opacity: active ? [0.85, 1, 0.85] : 0,
        }}
        transition={{
          opacity: active
            ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
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
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
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
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
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
        transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
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
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          {chapter.label}
        </motion.span>
      </motion.div>
    </div>
  );
}
