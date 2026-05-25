"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

export interface Venture {
  n: string;
  title: string;
  body: string;
}

function MotionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface VentureConstellationProps {
  ventures: Venture[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

/** Founder-layer venture list — operating companies as a constellation. */
export default function VentureConstellation({
  ventures,
  eyebrow = "Ventures",
  title = "The vehicles.",
  subtitle = "Operating companies carrying frontier science from lab into the industrial world.",
}: VentureConstellationProps) {
  return (
    <section className="viewport-section px-5 sm:px-6 pt-32 pb-20 md:px-20 md:py-24 pointer-events-auto">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12 md:gap-12">
        <MotionReveal className="self-start md:col-span-4 md:sticky md:top-32 render-stable">
          <p className="mb-4 text-[10px] uppercase tracking-[0.42em] md:tracking-[0.5em] text-primary/80">{eyebrow}</p>
          <h3 className="font-display text-[clamp(2rem,8vw,3.25rem)] leading-[1.05] tracking-[-0.03em] text-gradient md:text-5xl">
            {title}
          </h3>
          <p className="mt-5 md:mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        </MotionReveal>

        <div className="flex flex-col md:col-span-8">
          {ventures.map((venture, index) => (
            <MotionReveal
              key={venture.n}
              delay={index * 0.06}
              className="group grid grid-cols-[auto_1fr] items-start gap-5 sm:gap-8 border-t border-foreground/10 py-8 md:py-10 transition-colors duration-500 hover:border-foreground/30"
            >
              <span className="mt-2 font-mono text-xs tracking-[0.3em] text-muted-foreground/60">
                {venture.n}
              </span>
              <div>
                <h4 className="mb-3 font-display text-xl tracking-[-0.02em] transition-all duration-500 group-hover:text-glow md:text-3xl">
                  {venture.title}
                </h4>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                  {venture.body}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
