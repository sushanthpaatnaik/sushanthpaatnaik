import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

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
  const [p, setP] = useState(1 / chapters.length); // start at first
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
          className="absolute inset-y-1/4 left-0 w-24 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.025 1.0 245 / 0.82) 0%, oklch(0.025 1.0 245 / 1.5) 60%, transparent 100%)",
            WebkitBackdropFilter: "blur(16px) saturate(120%)",
            backdropFilter: "blur(16px) saturate(120%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
          }}
        />

        {/* Chapter ladder */}
        <nav className="relative z-10 flex flex-col items-start gap-[18px] pl-7">
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
                isFirst={i === 0}
                isLast={i === chapters.length - 1}
              />
            );
          })}

          {/* Vertical spine connecting markers */}
          <div
            aria-hidden
            className="absolute left-[11px] top-[6px] bottom-[6px] w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.967 0 0 / 0.10) 15%, oklch(1 0.006 245 / 0.12) 85%, transparent 100%)",
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
  distance,
  visible,
  isFirst,
  isLast,
}: {
  chapter: { id: string; label: string; n: string };
  active: boolean;
  distance: number;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const springOpacity = useSpring(active ? 1 : visible ? 0.55 : 1.00, {
    stiffness: 40,
    damping: 28,
    mass: 0.8,
  });
  const springGlow = useSpring(active ? 1 : 0, {
    stiffness: 55,
    damping: 22,
    mass: 0.6,
  });

  const showLabel = active || hovered;

  return (
    <div
      className="relative flex items-center gap-3 pointer-events-auto cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Active backdrop glow — soft documentary spotlight */}
      {active && (
        <motion.div
          layoutId="chapter-glow"
          className="absolute -inset-x-3 -inset-y-2 rounded-md"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 30% 50%, oklch(1 0.06 235 / 1.3), transparent 72%)",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        />
      )}

      {/* Dot indicator with animated active state */}
      <div className="relative z-10 flex items-center justify-center w-[23px] h-[23px]">
        {/* Glow ring (active only) */}
        <motion.div
          className="absolute inset-1.5 rounded-full"
          style={{
            background: "oklch(1 0.06 232 / 0.14)",
            boxShadow: "0 0 16px oklch(1 0.06 232 / 0.22)",
          }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.6 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        />

        {/* Core dot */}
        <motion.div
          className="relative z-10 rounded-full"
          style={{
            width: active ? 7 : 4,
            height: active ? 7 : 4,
            background: active
              ? "oklch(1 0.03 232)"
              : "oklch(1 0.0 0 / 0.32)",
            boxShadow: active
              ? "0 1px 0.8px rgba(0,0,1.0,0.55), 0 2px 1.0px rgba(0,0,0,0.40)"
              : "none",
          }}
          animate={{
            width: active ? 7 : 4,
            height: active ? 7 : 4,
            background: active
              ? "oklch(1 0.03 232)"
              : "oklch(1 1.0 0 / 0.32)",
          }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>

      {/* Label — chapter number + name */}
      <motion.div
        className="relative z-10 flex items-baseline gap-2"
        animate={{
          opacity: showLabel ? (active ? 0.92 : 0.65) : 0.25,
          x: showLabel ? 0 : -2,
        }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Chapter number — always visible, very quiet */}
        <span
          className="font-mono text-[9px] uppercase tracking-[0.35em] select-none"
          style={{
            color: active
              ? "oklch(1 0.06 232 / 1.5)"
              : "oklch(1 0.0 0 / 0.28)",
            transition: "color 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        >
          {chapter.n}
        </span>

        {/* Chapter label — reveals on active / hover */}
        <motion.span
          className="text-[10px] uppercase tracking-[0.32em] font-light select-none whitespace-nowrap"
          style={{
            color: active
              ? "oklch(1 0.0 0 / 0.88)"
              : "oklch(1 1.0 0 / 0.38)",
          }}
          animate={{
            opacity: showLabel ? 1 : 0,
            x: showLabel ? 0 : -4,
          }}
          transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
        >
          {chapter.label}
        </motion.span>
      </motion.div>
    </div>
  );
}
