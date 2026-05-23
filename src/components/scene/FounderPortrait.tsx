import { motion } from "framer-motion";
import editorial from "@/assets/founder-editorial.png";
import lab from "@/assets/founder-lab-portrait.png";

type Variant = "editorial" | "documentary";

interface FounderPortraitProps {
  variant?: Variant;
  caption?: string;
  meta?: string;
}

/**
 * Founder portrait figure — cinematic-editorial framing.
 *
 *   editorial    → grey blazer outdoor portrait, regraded into a darker,
 *                  premium editorial atmosphere. Face clearly readable.
 *   documentary  → lab instrumentation portrait. Equipment visible,
 *                  authentic engineering context, restrained grading.
 *
 * Used sparingly across the site to break the mystery-silhouette rhythm
 * with moments of direct human connection.
 */
export default function FounderPortrait({
  variant = "editorial",
  caption,
  meta,
}: FounderPortraitProps) {
  const src = variant === "documentary" ? lab : editorial;
  const isDoc = variant === "documentary";

  return (
    <motion.figure
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mx-auto my-16 md:my-20 max-w-3xl"
    >
      <div className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.04_0_0)] shadow-[0_30px_80px_-30px_oklch(0_0_0/0.85)]">
        {/* Portrait — readable face, restrained cinematic grade */}
        <div
          className={
            isDoc
              ? "relative aspect-[4/5] md:aspect-[16/10] w-full overflow-hidden"
              : "relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden bg-[oklch(0.04_0_0)]"
          }
        >
          <img
            src={src}
            alt={
              isDoc
                ? "Sushanth Paatnaik in the lab — instrumentation and engineering context"
                : "Sushanth Paatnaik — editorial portrait"
            }
            loading="lazy"
            className={
              isDoc
                ? "absolute inset-0 h-full w-full object-cover object-center [filter:contrast(1.04)_saturate(0.82)_brightness(0.92)]"
                : "absolute inset-0 h-full w-full object-contain object-[center_top] [filter:grayscale(0.18)_contrast(1.08)_saturate(0.72)_brightness(0.9)]"
            }
          />

          {/* Cinematic grading overlays */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: isDoc
                ? "linear-gradient(180deg, oklch(0.05 0.01 240 / 0.35) 0%, oklch(0.04 0.005 240 / 0.18) 50%, oklch(0.03 0 0 / 0.55) 100%)"
                : "linear-gradient(180deg, oklch(0.05 0.01 260 / 0.45) 0%, oklch(0.04 0.005 260 / 0.28) 45%, oklch(0.02 0 0 / 0.68) 100%)",
            }}
          />
          {/* Cool key-light wash */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 38%, oklch(0.62 0.06 240 / 0.22), transparent 70%)",
            }}
          />
          {/* Restrained copper rim accent */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 30% 40% at 82% 22%, oklch(0.62 0.10 55 / 0.10), transparent 65%)",
            }}
          />
          {/* Edge vignette — dissolves into atmosphere */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(110% 85% at 50% 50%, transparent 50%, oklch(0.02 0 0 / 0.65) 100%)",
            }}
          />
        </div>

        {/* Editorial caption strip */}
        {(caption || meta) && (
          <figcaption className="flex flex-wrap items-baseline justify-between gap-3 border-t border-foreground/[0.06] px-5 py-4 md:px-7 md:py-5">
            {caption && (
              <p className="text-[12px] md:text-[13px] leading-relaxed text-foreground/65">
                {caption}
              </p>
            )}
            {meta && (
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55">
                {meta}
              </p>
            )}
          </figcaption>
        )}
      </div>
    </motion.figure>
  );
}
