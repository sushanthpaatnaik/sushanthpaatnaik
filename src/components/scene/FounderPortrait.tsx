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
  /**
   * Replaces the default vertical rhythm around the figure. Given as a full
   * utility string rather than merged with the default, because two competing
   * `my-*` classes resolve by stylesheet order, not by the order they appear
   * in the class attribute — appending an override would win or lose
   * unpredictably per breakpoint.
   */
  margin?: string;
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
  margin,
}: FounderPortraitProps) {
  const src = srcOverride ?? (variant === "documentary" ? lab : editorial);
  const isDoc = variant === "documentary";

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
      className={`not-prose relative mx-auto ${margin ?? "my-28 md:my-40"} max-w-[460px] md:max-w-[520px]`}
    >
      {/* Cinematic edge diffusion — dissolves the plate into the room.
          Softened texture so the portrait integrates with the page atmosphere
          rather than reading as a discrete object. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-20 -inset-y-24 md:-inset-x-32 md:-inset-y-36"
        style={{
          background: "var(--photo-halo)",
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

      {/* Not a dark island — that was the first answer and it just moved the
          problem: a black module laid on paper still reads as dark-theme
          imagery pasted in. The photograph is genuinely dark and cannot be
          bleached, so instead every layer that used to terminate in black
          now terminates in the PAGE GROUND. The edge dissolve, the foot
          fade and the grading pass are tokens; on paper they resolve to
          --canvas-solid and the frame melts into the sheet instead of
          being cut out of it. --photo-veil then lifts the blacks about 30
          levels so the picture reads as a graphite plate rather than a
          hole. */}
      <div
        className="relative overflow-hidden rounded-sm border border-foreground/[0.05]"
        style={{ background: "var(--photo-plate)", boxShadow: "var(--photo-frame-shadow)" }}
      >
        {/* Founder plate — strengthened editorial identity */}
        {plate && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/[0.06] px-6 py-4 md:px-8 md:py-5">
            <div className="flex items-center gap-4 md:gap-5">
              <span className="font-display text-[15px] md:text-[16px] tracking-[-0.012em] text-foreground/90">
                Sushanth Paatnaik
              </span>{" "}
              {/* The divider between them is an empty span, so it contributes
                  no text — without this space the plate reads back as
                  "Sushanth PaatnaikFounder & Inventor". */}
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
              ? "group relative aspect-[5/6] sm:aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden bg-[var(--surface-sunken)]"
              : "group relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/4.6] w-full overflow-hidden bg-[var(--surface-sunken)]"
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
                ? "absolute inset-0 h-full w-full object-cover object-[32%_center] md:object-[center_center] transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform motion-safe:md:group-hover:scale-[1.04] [filter:grayscale(0.3)_contrast(1.05)_saturate(0.55)_brightness(0.78)_var(--photo-filter)]"
                : "absolute inset-0 h-full w-full object-cover object-[center_top] transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform motion-safe:md:group-hover:scale-[1.03] [filter:grayscale(0.22)_contrast(1.03)_saturate(0.68)_brightness(0.9)_var(--photo-filter)]"
            }
          />

          {/* Lifts the blacks so a dark photograph reads as a plate on paper
              rather than a hole in it. Transparent in the dark theme, where
              `screen` with a fully transparent colour is the identity. */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{ background: "var(--photo-veil)" }}
          />
          {/* Cinematic grading overlays */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background: isDoc ? "var(--photo-grade-doc)" : "var(--photo-grade)",
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
              background: "var(--photo-dissolve)",
            }}
          />
          {/* Soft cinematic vignette — deepens edges, preserves center */}
          {isDoc && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(125% 100% at 50% 50%, transparent 52%, oklch(0.015 0.004 240 / 0.42) 100%)",
              }}
            />
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background: "var(--photo-foot)",
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
                  <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45">
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
