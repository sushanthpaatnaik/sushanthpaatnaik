"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * SignatureMotif
 * --------------
 * The site's recurring identity object — a slow-rotating orbital lattice
 * glyph that becomes the visual signature of the brand. Used as a faint
 * watermark across chapters and interstitial moments. Pure SVG, no
 * imagery, deliberately under-saturated so typography always dominates.
 *
 * Variants:
 *   "watermark" — large, ultra-low opacity, used behind interstitials.
 *   "node"      — small, used as inline punctuation in interstitial lines.
 */
export default function SignatureMotif({
  variant = "watermark",
  className = "",
}: {
  variant?: "watermark" | "node";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const size = variant === "watermark" ? 360 : 22;
  const baseOpacity = variant === "watermark" ? 0.07 : 0.55;

  return (
    <motion.svg
      aria-hidden
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      className={className}
      style={{ opacity: baseOpacity }}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={
        reduce
          ? undefined
          : { duration: variant === "watermark" ? 240 : 90, repeat: Infinity, ease: "linear" }
      }
    >
      <defs>
        <radialGradient id={`sig-fade-${variant}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`sig-mask-${variant}`}>
          <rect x="-50" y="-50" width="100" height="100" fill={`url(#sig-fade-${variant})`} />
        </mask>
      </defs>
      <g
        mask={`url(#sig-mask-${variant})`}
        fill="none"
        stroke="oklch(0.82 0.03 232 / 0.55)"
        strokeWidth={variant === "watermark" ? 0.16 : 0.6}
      >
        {/* Three concentric orbital ellipses at different tilts — the signature. */}
        <ellipse cx="0" cy="0" rx="44" ry="18" />
        <g transform="rotate(60)">
          <ellipse cx="0" cy="0" rx="44" ry="18" />
        </g>
        <g transform="rotate(-60)">
          <ellipse cx="0" cy="0" rx="44" ry="18" />
        </g>
        <circle cx="0" cy="0" r="2.2" fill="oklch(0.86 0.02 232 / 0.55)" stroke="none" />
      </g>
    </motion.svg>
  );
}
