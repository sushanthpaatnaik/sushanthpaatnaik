import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SignatureMotif from "./SignatureMotif";

/**
 * Interstitial
 * ------------
 * A cinematic micro-storytelling beat that lives between major chapters.
 * One italic line, generous space, the signature orbital motif as a faint
 * watermark. Fades in/out as it enters and leaves the viewport. Never
 * carries CTAs, never breaks the scroll rhythm — it is pure narrative
 * punctuation, the cinematic equivalent of a slow dissolve.
 */
export default function Interstitial({
  line,
  pause = false,
}: {
  line: React.ReactNode;
  /**
   * When true, renders the "breathing pause" — taller, quieter, no motif,
   * for the single intentional rest section before the closing chapter.
   */
  pause?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45, once: false });
  const reduce = useReducedMotion();

  return (
    <section
      aria-hidden={false}
      className={`relative flex items-center justify-center overflow-hidden px-6 ${
        pause ? "min-h-[68vh] py-32 md:py-44" : "min-h-[44vh] py-24 md:py-32"
      }`}
    >
      {/* Faint signature watermark — only on standard interstitials. */}
      {!pause && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SignatureMotif variant="watermark" />
        </div>
      )}

      {/* Soft central glow so the line lifts off the dark plate. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 50% 50%, oklch(0.10 0.012 232 / 0.45), transparent 70%)",
        }}
      />

      <motion.div
        ref={ref}
        initial={false}
        animate={
          inView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 14, filter: reduce ? "blur(0px)" : "blur(4px)" }
        }
        transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 mx-auto max-w-2xl text-center pointer-events-auto"
      >
        {!pause && (
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-foreground/15" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.5em] text-muted-foreground/45">
              Interlude
            </span>
            <span className="h-px w-8 bg-foreground/15" />
          </div>
        )}
        <p
          className={`font-display italic leading-[1.35] text-foreground/72 [text-wrap:balance] ${
            pause
              ? "text-[clamp(1.15rem,2.4vw,1.75rem)] tracking-[-0.005em]"
              : "text-[clamp(1rem,1.9vw,1.45rem)] tracking-[-0.005em]"
          }`}
        >
          {line}
        </p>
        {pause && (
          <div className="mt-12 flex items-center justify-center gap-4 font-mono text-[9.5px] uppercase tracking-[0.5em] text-muted-foreground/35">
            <span className="h-px w-10 bg-foreground/10" />
            <span>Pause</span>
            <span className="h-px w-10 bg-foreground/10" />
          </div>
        )}
      </motion.div>
    </section>
  );
}
