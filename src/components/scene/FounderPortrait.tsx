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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mx-auto my-32 md:my-44 max-w-[520px] md:max-w-[580px]"
    >
      {/* Cinematic edge diffusion — dissolves the plate into the room */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-16 -inset-y-20 md:-inset-x-24 md:-inset-y-28"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 50%, oklch(0.18 0.02 245 / 0.32), transparent 72%)",
          filter: "blur(28px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-8 -inset-y-10"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 35%, oklch(0.52 0.04 232 / 0.10), transparent 78%)",
          filter: "blur(18px)",
        }}
      />

      <div className="relative overflow-hidden rounded-sm border border-foreground/[0.05] bg-[oklch(0.04_0_0)] shadow-[0_36px_88px_-36px_oklch(0_0_0/0.78)]">
        {/* Founder plate — strengthened editorial identity */}
        {plate && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/[0.06] px-6 py-4 md:px-8 md:py-5">
            <div className="flex items-center gap-4 md:gap-5">
              <span className="font-display text-[15px] md:text-[16px] tracking-[-0.012em] text-foreground/90">
                Sushanth Paatnaik
              </span>
              <span className="h-3 w-px bg-foreground/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/60">
                Founder &amp; Inventor
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-foreground/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                India
              </span>
            </div>
          </div>
        )}

        {/* Portrait — reduced height (~15% shorter), more breathing room */}
        <div
          className={
            isDoc
              ? "relative aspect-[4/4.3] md:aspect-[16/8.5] w-full overflow-hidden"
              : "relative aspect-[5/6] md:aspect-[4/4.6] w-full overflow-hidden bg-[oklch(0.04_0_0)]"
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
                ? "absolute inset-0 h-full w-full object-cover object-center [filter:contrast(1.06)_saturate(0.74)_brightness(0.85)_blur(0.3px)]"
                : "absolute inset-0 h-full w-full object-contain object-[center_top] [filter:grayscale(0.22)_contrast(1.06)_saturate(0.68)_brightness(0.88)]"
            }
          />

          {/* Cinematic grading overlays */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: isDoc
                ? "linear-gradient(180deg, oklch(0.05 0.01 240 / 0.32) 0%, oklch(0.04 0.005 240 / 0.16) 50%, oklch(0.03 0 0 / 0.50) 100%)"
                : "linear-gradient(180deg, oklch(0.05 0.01 260 / 0.42) 0%, oklch(0.04 0.005 260 / 0.22) 45%, oklch(0.02 0 0 / 0.60) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 38%, oklch(0.58 0.05 240 / 0.18), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 28% 36% at 84% 20%, oklch(0.62 0.10 55 / 0.08), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 30% 36% at 16% 80%, oklch(0.52 0.04 232 / 0.06), transparent 68%)",
            }}
          />
          {/* Inner edge dissolve — image bleeds into the plate */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 50%, transparent 48%, oklch(0.02 0 0 / 0.72) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(to top, oklch(0.04 0 0) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Editorial caption strip */}
        {(caption || meta || eyebrow || narrative?.length) && (
          <figcaption className="border-t border-foreground/[0.06] px-6 py-7 md:px-8 md:py-8">
            {(eyebrow || narrative?.length) && (
              <div className="mb-6 md:mb-7 flex flex-col gap-4">
                {eyebrow && (
                  <div className="flex items-center gap-3">
                    <span className="h-px w-5 bg-foreground/15" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                      {eyebrow}
                    </span>
                  </div>
                )}
                {narrative?.length ? (
                  <div className="mt-1 space-y-2">
                    {narrative.map((line) => (
                      <p
                        key={line}
                        className="font-display text-[15px] md:text-[17px] leading-[1.5] tracking-[-0.01em] text-foreground/75"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
            {(caption || meta) && (
              <div className="flex flex-wrap items-baseline justify-between gap-3 pt-5 border-t border-foreground/[0.05]">
                {caption && (
                  <p className="text-[12px] md:text-[13px] leading-relaxed text-foreground/55 max-w-[85%]">
                    {caption}
                  </p>
                )}
                {meta && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-muted-foreground/45">
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
