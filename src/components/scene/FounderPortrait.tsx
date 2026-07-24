import { motion } from "framer-motion";
import editorial from "@/assets/founder-editorial.webp";
import lab from "@/assets/founder-lab-portrait.webp";

type Variant = "editorial" | "documentary";

interface FounderPortraitProps {
  variant?: Variant;
  /** Overrides the variant's default image while keeping its aspect ratio + grading treatment. */
  src?: string;
  alt?: string;
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
  src: srcOverride,
  alt,
  caption,
  meta,
  eyebrow,
  narrative,
  plate,
}: FounderPortraitProps) {
  const src = srcOverride ?? (variant === "documentary" ? lab : editorial);
  const isDoc = variant === "documentary";

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mx-auto my-28 md:my-40 max-w-[460px] md:max-w-[520px]"
    >
      {/* Cinematic edge diffusion — dissolves the plate into the room.
          Softened texture so the portrait integrates with the page atmosphere
          rather than reading as a discrete object. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-20 -inset-y-24 md:-inset-x-32 md:-inset-y-36"
        style={{
          background:
            "radial-gradient(58% 52% at 50% 50%, oklch(0.16 0.018 245 / 0.26), transparent 76%)",
          filter: "blur(34px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -inset-y-12"
        style={{
          background:
            "radial-gradient(42% 38% at 50% 32%, oklch(0.50 0.035 232 / 0.07), transparent 80%)",
          filter: "blur(22px)",
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

        {/* Portrait — full image visible, cinematic letterboxing rather
            than aggressive crop. Aspect ratios sized so the entire subject
            and environmental context fit naturally on every breakpoint. */}
        <div
          className={
            isDoc
              ? "group relative aspect-[5/6] sm:aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden bg-[oklch(0.035_0_0)]"
              : "group relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/4.6] w-full overflow-hidden bg-[oklch(0.04_0_0)]"
          }
        >
          <img
            src={src}
            alt={
              alt ??
              (isDoc
                ? "Sushanth Paatnaik in the lab — instrumentation and engineering context"
                : "Sushanth Paatnaik — editorial portrait")
            }
            loading="lazy"
            decoding="async"
            className={
              isDoc
                ? "absolute inset-0 h-full w-full object-cover object-[32%_center] md:object-[center_center] transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform motion-safe:md:group-hover:scale-[1.04] [filter:contrast(1.06)_saturate(0.82)_brightness(0.92)]"
                : "absolute inset-0 h-full w-full object-cover object-[center_top] transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform motion-safe:md:group-hover:scale-[1.03] [filter:grayscale(0.22)_contrast(1.03)_saturate(0.68)_brightness(0.9)]"
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
          {/* Soft cinematic vignette — deepens edges, preserves center */}
          {isDoc && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(125% 100% at 50% 50%, transparent 55%, oklch(0.015 0.004 240 / 0.55) 100%)",
              }}
            />
          )}
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
