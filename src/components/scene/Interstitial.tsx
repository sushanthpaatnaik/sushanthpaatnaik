import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SignatureMotif from "./SignatureMotif";

export default function Interstitial({
  line,
  pause = false,
}: {
  line: React.ReactNode;
  pause?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45, once: true });
  const reduce = useReducedMotion();

  return (
    <section
      aria-hidden={false}
      className={`relative flex items-center justify-center overflow-hidden px-6 ${
        pause ? "min-h-[55vh] md:min-h-[var(--viewport-height)] py-20 md:py-44" : "min-h-[32vh] md:min-h-[44vh] py-16 md:py-32"
      }`}
    >
      {!pause && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <SignatureMotif variant="watermark" />
        </div>
      )}

      {/* Soft readability vignette — transparent, video shows through */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.04 0.005 260 / 0.36), transparent 85%)",
        }}
      />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: reduce ? 0 : 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
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
          style={{ textShadow: "0 1px 18px oklch(0.04 0.005 260 / 0.85), 0 0 1px oklch(0.04 0.005 260 / 0.6)" }}
        >
          <span className="whitespace-pre-line">{line}</span>
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
