"use client";

import { useRef } from "react";
import { motion, type MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import mediaWallImg from "@/assets/scene-media-wall.webp";

const mediaWallSrc = typeof mediaWallImg === "string" ? mediaWallImg : mediaWallImg.src;

type Fragment = {
  t: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  depth: number;
};

function HeadlineFragment({ f, p, reduce }: { f: Fragment; p: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(p, [0, 0.3 + f.delay * 0.1, 0.7, 1], [0, 0.55, 0.45, 0]);
  const y = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : [`${f.depth * 30}px`, `${-f.depth * 30}px`]);
  return (
    <motion.span
      aria-hidden
      className={`absolute font-display ${f.size} tracking-[-0.01em] text-foreground/30 italic select-none whitespace-nowrap`}
      style={{
        left: f.x,
        top: f.y,
        opacity,
        y,
        filter: "blur(0.4px)",
        textShadow: "0 0 18px oklch(0.04 0 0 / 0.9)",
      }}
    >
      {f.t}
    </motion.span>
  );
}

export default function MediaWallBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.6 });

  const y = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-8%"]);
  const scale = useTransform(p, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1.02, 1.08]);
  const imageOpacity = useTransform(p, [0, 0.35, 0.6, 1], [0, 0.32, 0.28, 0]);
  const sweepX = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-40%", "140%"]);
  const sweepOpacity = useTransform(p, [0, 0.25, 0.55, 0.85, 1], [0, 0.06, 0.10, 0.04, 0]);

  const fragments = [
    { t: "Serial entrepreneur at 20", x: "8%",  y: "14%", size: "text-xs md:text-sm",  delay: 0.0, depth: 0.6 },
    { t: "Whizkid · 3 patents",       x: "70%", y: "22%", size: "text-[10px] md:text-xs", delay: 0.15, depth: 0.8 },
    { t: "Teenaged inventor of breathing apparatus", x: "62%", y: "70%", size: "text-[10px] md:text-xs", delay: 0.3, depth: 0.5 },
    { t: "Inspired to help",          x: "14%", y: "62%", size: "text-[11px] md:text-sm",  delay: 0.45, depth: 0.7 },
    { t: "Real-life innovation champ",x: "44%", y: "44%", size: "text-[10px] md:text-xs", delay: 0.6, depth: 0.4 },
  ] as const;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ y, scale, opacity: imageOpacity }}
      >
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${mediaWallSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "60% center",
            filter: "blur(2.4px) saturate(0.45) brightness(0.48) contrast(1.08)",
            transform: "scale(1.12)",
            transformOrigin: "60% center",
          }}
        />
        <div className="absolute inset-0 mix-blend-color bg-[oklch(0.16_0.045_245)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.03_0.005_260/0.92)_0%,oklch(0.03_0.005_260/0.55)_32%,transparent_60%,oklch(0.03_0.005_260/0.4)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.03_0_0/0.92),transparent_22%,transparent_72%,oklch(0.03_0_0/0.95))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_55%_50%,transparent_18%,oklch(0.03_0_0/0.55)_65%,oklch(0.02_0_0/0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_28%_20%_at_85%_15%,oklch(0.65_0.11_55/0.09),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute -inset-y-10 w-[40%] -skew-x-12 bg-[linear-gradient(90deg,transparent,oklch(0.92_0.02_245/0.5),transparent)] blur-2xl"
        style={{ x: sweepX, opacity: sweepOpacity }}
      />

      {fragments.map((f) => (
        <HeadlineFragment key={f.t} f={f} p={p} reduce={!!reduce} />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,oklch(0.04_0_0/0.55),oklch(0.03_0_0/0.78))]" />
    </div>
  );
}
