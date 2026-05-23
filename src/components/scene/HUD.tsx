import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const chapters = [
  { id: "spark", label: "Spark", n: "01" },
  { id: "founder", label: "Founder", n: "02" },
  { id: "carbon-intelligence", label: "Carbon Intelligence", n: "03" },
  { id: "industrial", label: "Industrial", n: "04" },
  { id: "recognition", label: "Recognition", n: "05" },
  { id: "ecosystem", label: "Ecosystem", n: "06" },
  { id: "future", label: "Future", n: "07" },
];

export default function HUD({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const [p, setP] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const loop = () => {
      setP(scrollProgress.current);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [scrollProgress]);

  const idx = Math.min(chapters.length - 1, Math.floor(p * chapters.length));

  return (
    <>
      {/* ─── Left rail: documentary chapter markers ─────────────────────── */}
      <div className="fixed left-0 top-0 z-40 hidden h-full lg:flex flex-col justify-center pointer-events-none">
        {/* Translucent backing panel — dissolves into darkness at edges */}
        <div
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-[420px]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.025 0.006 245 / 0.88) 0%, oklch(0.025 0.006 245 / 0.62) 55%, transparent 100%)",
            WebkitBackdropFilter: "blur(18px) saturate(125%)",
            backdropFilter: "blur(18px) saturate(125%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
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
  chapter: { id: string; label: string; n: string };
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
      {/* Active backdrop glow — soft documentary spotlight */}
      <motion.div
        className="absolute -inset-x-3 -inset-y-2 rounded-md pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 30% 50%, oklch(0.71 0.06 232 / 0.14), transparent 72%)",
        }}
        initial={false}
        animate={{
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      />

      {/* Dot indicator with animated active state */}
      <div className="relative z-10 flex items-center justify-center w-[23px] h-[23px]">
        {/* Glow ring (active only) */}
        <motion.div
          className="absolute inset-1.5 rounded-full"
          style={{
            background: "oklch(0.71 0.06 232 / 0.18)",
            boxShadow: "0 0 18px oklch(0.71 0.06 232 / 0.28)",
          }}
          initial={false}
          animate={{
            opacity: active ? 1 : 1,
            scale: active ? 1 : 0.5,
          }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        />

        {/* Core dot */}
        <motion.div
          className="relative z-10 rounded-full"
          style={{
            background: active
              ? "oklch(0.95 0.0 0)"
              : "oklch(0.55 0.0 0 / 0.38)",
            boxShadow: active
              ? "0 0 1.0px 0px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.40)"
              : "none",
          }}
          initial={false}
          animate={{
            width: active ? 7 : 4,
            height: active ? 7 : 4,
            background: active
              ? "oklch(0.95 0.0 0)"
              : "oklch(0.55 0.0 0 / 0.38)",
          }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      {/* Label — chapter number + name */}
      <motion.div
        className="relative z-10 flex items-baseline gap-2"
        initial={false}
        animate={{
          opacity: active ? 0.92 : visible ? (hovered ? 0.72 : 0.45) : 0.22,
          x: active ? 0 : 0,
        }}
        transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Chapter number — always visible, very quiet */}
        <span
          className="font-mono text-[9px] uppercase tracking-[0.35em] select-none"
          style={{
            color: active
              ? "oklch(0.71 0.06 232 / 0.95)"
              : "oklch(0.62 0.0 0 / 0.42)",
            transition: "color 0.9s cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        >
          {chapter.n}
        </span>

        {/* Chapter label — reveals on active / hover */}
        <motion.span
          className="text-[10px] uppercase tracking-[0.32em] font-light select-none whitespace-nowrap"
          style={{
            color: active
              ? "oklch(0.967 0.0 0 / 0.92)"
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
