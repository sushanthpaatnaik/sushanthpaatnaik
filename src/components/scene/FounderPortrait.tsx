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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mx-auto my-28 md:my-40 max-w-[640px] md:max-w-[680px]"
    >
      <div className="relative overflow-hidden rounded-sm border border-foreground/[0.05] bg-[oklch(0.04_0_0)] shadow-[0_30px_80px_-30px_oklch(0_0_0/0.85)]">
        {/* Founder plate — minimal editorial identity */}
        {plate && (
          <div className="flex items-center justify-between border-b border-foreground/[0.05] px-6 py-3.5 md:px-8 md:py-4">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[13px] tracking-[-0.01em] text-foreground/80">
                Sushanth Paatnaik
              </span>
              <span className="hidden sm:inline h-2.5 w-px bg-foreground/[0.10]" />
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
                Founder & Inventor
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-foreground/[0.08]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/35">
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
          {/* Restrained copper rim accent — top-right */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 30% 40% at 82% 22%, oklch(0.62 0.10 55 / 0.10), transparent 65%)",
            }}
          />
          {/* Balancing cool rim — bottom-left, prevents right-heavy lighting */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 32% 38% at 14% 78%, oklch(0.55 0.04 232 / 0.08), transparent 68%)",
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
        {(caption || meta || eyebrow || narrative?.length) && (
          <figcaption className="border-t border-foreground/[0.06] px-5 py-5 md:px-7 md:py-6">
            {(eyebrow || narrative?.length) && (
              <div className="mb-4 md:mb-5 flex flex-col gap-2">
                {eyebrow && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                    {eyebrow}
                  </span>
                )}
                {narrative?.length ? (
                  <div className="mt-1 space-y-1">
                    {narrative.map((line) => (
                      <p
                        key={line}
                        className="font-display text-[13px] md:text-[14px] leading-[1.5] tracking-[-0.005em] text-foreground/70"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
            {(caption || meta) && (
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                {caption && (
                  <p className="text-[12px] md:text-[13px] leading-relaxed text-foreground/60">
                    {caption}
                  </p>
                )}
                {meta && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-muted-foreground/55">
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
