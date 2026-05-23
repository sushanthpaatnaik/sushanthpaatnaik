import { motion } from "framer-motion";
import editorial from "@/assets/founder-editorial.png";
import lab from "@/assets/founder-lab-portrait.png";

type Variant = "editorial" | "documentary";

interface FounderPortraitProps {
  variant?: Variant;
  caption?: string;
  meta?: string;
  eyebrow?: string;
  narrative?: string[];
  plate?: boolean;
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
  eyebrow,
  narrative,
  plate,
}: FounderPortraitProps) {
  const src = variant === "documentary" ? lab : editorial;
  const isDoc = variant === "documentary";

  return (
    <motion.figure
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 1.0 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mx-auto my-32 md:my-44 max-w-[540px] md:max-w-[600px]"
    >
      <div className="relative overflow-hidden rounded-sm border border-foreground/[0.04] bg-[oklch(0.04_0_0)] shadow-[0_24px_64px_-24px_oklch(0_0_0/0.72)]">
        {/* Founder plate — subtle editorial identity */}
        {plate && (
          <div className="flex items-center justify-between border-b border-foreground/[0.04] px-6 py-3 md:px-8 md:py-3.5">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[12px] tracking-[-0.01em] text-foreground/70">
                Sushanth Paatnaik
              </span>
              <span className="hidden sm:inline h-2 w-px bg-foreground/[0.08]" />
              <span className="hidden sm:inline font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/35">
                Founder & Inventor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-foreground/[0.06]" />
              <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-muted-foreground/30">
                India
              </span>
            </div>
          </div>
        )}

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
                : "absolute inset-0 h-full w-full object-contain object-[center_top] [filter:grayscale(0.22)_contrast(1.06)_saturate(0.68)_brightness(0.88)]"
            }
          />

          {/* Cinematic grading overlays — more restrained */}
          <div
            aria-hidden
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full mix-blend-multiply"
            style={{
              background: isDoc
                ? "linear-gradient(180deg, oklch(0.05 0.01 240 / 0.32) 0%, oklch(0.04 0.005 240 / 0.16) 50%, oklch(0.03 0 0 / 0.50) 100%)"
                : "linear-gradient(180deg, oklch(0.05 0.01 260 / 0.42) 0%, oklch(0.04 0.005 260 / 0.24) 45%, oklch(0.02 0 0 / 0.62) 100%)",
            }}
          />
          {/* Cool key-light wash — softer */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 38%, oklch(0.58 0.05 240 / 0.18), transparent 70%)",
            }}
          />
          {/* Restrained copper rim accent — top-right, quieter */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 28% 36% at 84% 20%, oklch(0.62 0.10 55 / 0.08), transparent 65%)",
            }}
          />
          {/* Balancing cool rim — bottom-left */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 30% 36% at 16% 80%, oklch(0.52 0.04 232 / 0.06), transparent 68%)",
            }}
          />
          {/* Edge vignette — dissolves into atmosphere */}
          <div
            aria-hidden
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
            style={{
              background:
                "radial-gradient(115% 85% at 50% 50%, transparent 50%, oklch(0.02 0 0 / 0.60) 100%)",
            }}
          />
        </div>

        {/* Editorial caption strip — restrained, cinematic, archival */}
        {(caption || meta || eyebrow || narrative?.length) && (
          <figcaption className="border-t border-foreground/[0.04] px-6 py-6 md:px-8 md:py-7">
            {(eyebrow || narrative?.length) && (
              <div className="mb-6 md:mb-7 flex flex-col gap-3">
                {eyebrow && (
                  <div className="flex items-center gap-3">
                    <span className="h-px w-4 bg-foreground/[0.10]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.48em] text-muted-foreground/45">
                      {eyebrow}
                    </span>
                  </div>
                )}
                {narrative?.length ? (
                  <div className="mt-2 space-y-2">
                    {narrative.map((line) => (
                      <p
                        key={line}
                        className="font-display text-[14px] md:text-[16px] leading-[1.5] tracking-[-0.008em] text-foreground/70"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
            {(caption || meta) && (
              <div className="flex flex-wrap items-baseline justify-between gap-3 pt-5 border-t border-foreground/[0.03]">
                {caption && (
                  <p className="text-[11.5px] md:text-[12.5px] leading-relaxed text-foreground/55 max-w-[85%]">
                    {caption}
                  </p>
                )}
                {meta && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.38em] text-muted-foreground/40">
                    {meta}
                  </p>
                )}
              </div>
            )}
          </figcaption>
        )}
      </div>
    </motion.figure>
  );
}
