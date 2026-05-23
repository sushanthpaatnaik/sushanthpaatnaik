import { useRef } from "react";
import { motion, type MotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import mediaWall from "@/assets/scene-media-wall.jpg";

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

/**
 * Cinematic archival media wall — a parallax background layer for the
 * News & Media section. The collage sits inside darkness and atmosphere,
 * revealing itself only as the section enters the viewport. Heavy
 * graphite/blue-black grading, soft haze, depth blur, vignette and a slow
 * light sweep keep it editorial rather than scrapbook.
 *
 * The component is absolutely positioned and pointer-events: none, so it
 * never competes with the typography layered on top.
 */
export default function MediaWallBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.6 });

  // Slow vertical drift + tiny scale breathing for parallax depth.
  const y = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-8%"]);
  const scale = useTransform(p, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1.02, 1.08]);

  // Image fades up from darkness, sits at low opacity at peak, then fades back.
  const imageOpacity = useTransform(p, [0, 0.35, 0.6, 1], [0, 0.32, 0.28, 0]);
  // Light sweep travels diagonally as the section scrolls past.
  const sweepX = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-40%", "140%"]);
  const sweepOpacity = useTransform(p, [0, 0.25, 0.55, 0.85, 1], [0, 0.06, 0.10, 0.04, 0]);

  // Floating headline fragments — faded publication textures.
  const fragments = [
    { t: "Serial entrepreneur at 20", x: "8%",  y: "14%", size: "text-xs md:text-sm",  delay: 0.0, depth: 0.6 },
    { t: "Whizkid · 3 patents",       x: "70%", y: "22%", size: "text-[10px] md:text-xs", delay: 0.15, depth: 0.8 },
    { t: "Teenaged inventor of breathing apparatus", x: "62%", y: "70%", size: "text-[10px] md:text-xs", delay: 0.3, depth: 0.5 },
    { t: "Inspired to help",          x: "14%", y: "62%", size: "text-[11px] md:text-sm",  delay: 0.45, depth: 0.7 },
    { t: "Real-life innovation champ",x: "44%", y: "44%", size: "text-[10px] md:text-xs", delay: 0.6, depth: 0.4 },
  ] as const;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* The collage — graded, blurred, drifting, low-opacity. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ y, scale, opacity: imageOpacity }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${mediaWall})`,
            filter: "blur(2px) saturate(0.55) brightness(0.55) contrast(1.05)",
          }}
        />
        {/* Cool graphite/blue tone wash on top of the imagery. */}
        <div className="absolute inset-0 mix-blend-color bg-[oklch(0.18_0.04_245)]" />
        {/* Depth haze pulling the upper and lower edges into darkness. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.04_0_0/0.85),transparent_28%,transparent_72%,oklch(0.04_0_0/0.92))]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_30%,oklch(0.03_0_0/0.85)_100%)]" />
        {/* Restrained copper edge highlight, top-right. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_22%_at_82%_18%,oklch(0.68_0.12_55/0.10),transparent_70%)]" />
        {/* Atmospheric grain via SVG noise. */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")",
          }}
        />
      </motion.div>

      {/* Light sweep — minimal cinematic accent. */}
      <motion.div
        aria-hidden
        className="absolute -inset-y-10 w-[40%] -skew-x-12 bg-[linear-gradient(90deg,transparent,oklch(0.92_0.02_245/0.5),transparent)] blur-2xl"
        style={{ x: sweepX, opacity: sweepOpacity }}
      />

      {/* Floating publication-headline fragments. */}
      {fragments.map((f) => (
        <motion.span
          key={f.t}
          aria-hidden
          className={`absolute font-display ${f.size} tracking-[-0.01em] text-foreground/30 italic select-none whitespace-nowrap`}
          style={{
            left: f.x,
            top: f.y,
            opacity: useTransform(p, [0, 0.3 + f.delay * 0.1, 0.7, 1], [0, 0.55, 0.45, 0]),
            y: useTransform(p, [0, 1], reduce ? ["0%", "0%"] : [`${f.depth * 30}px`, `${-f.depth * 30}px`]),
            filter: "blur(0.4px)",
            textShadow: "0 0 18px oklch(0.04 0 0 / 0.9)",
          }}
        >
          {f.t}
        </motion.span>
      ))}

      {/* Final darkness scrim — guarantees foreground typography wins. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,oklch(0.04_0_0/0.55),oklch(0.03_0_0/0.78))]" />
    </div>
  );
}
