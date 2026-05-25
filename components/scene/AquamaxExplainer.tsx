"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";

type Size = "S" | "M" | "L";

const sizeMeta: Record<Size, { label: string; chimneyW: number; collarW: number; note: string }> = {
  S: { label: "DN-600", chimneyW: 78, collarW: 96, note: "Light industrial · ≤ 600 mm flue" },
  M: { label: "DN-1200", chimneyW: 120, collarW: 142, note: "Heavy industrial · ≤ 1200 mm flue" },
  L: { label: "DN-2400", chimneyW: 180, collarW: 206, note: "Thermal-grade · ≤ 2400 mm flue" },
};

const phases = [
  {
    code: "01",
    tag: "Vapor capture",
    title: "High-Voltage Intake Hood",
    body:
      "Detachable flanged hood seals over the chimney mouth via a quick-release collar, gasket ring, and aligned bolt-clamp set — capturing exhaust plume before it dissipates.",
    bullets: ["Quick-release flange", "Insulated HV routing", "Aligned bolt-clamp set"],
  },
  {
    code: "02",
    tag: "Routing",
    title: "Corrugated Stainless Conduit",
    body:
      "Pressure-rated 316L corrugated stainless conduit, flex-jacketed, routes captured vapor from the chimney head to the ground-level recovery unit without thermal loss.",
    bullets: ["316L stainless corrugation", "Thermal-jacketed flex", "Field-deployable"],
  },
  {
    code: "03",
    tag: "Recovery",
    title: "HV Low-Current Condenser",
    body:
      "Inside the Aquamax cabinet, a high-voltage / ultra-low-current condensation array collapses vapor into liquid through dielectric phase-change — engineered for continuous duty.",
    bullets: ["HV · low-current architecture", "Protected service access", "Dielectric phase-change"],
  },
  {
    code: "04",
    tag: "Reclaim",
    title: "Condensate · Recycle Loop",
    body:
      "Recovered condensate is filtered, mineralised, and re-injected into plant process water — closing the loop on emissions-side moisture that would otherwise be lost to atmosphere.",
    bullets: ["Closed recycle loop", "Inline filtration stage", "Reusable process water"],
  },
];

export default function AquamaxExplainer() {
  const [detached, setDetached] = useState(false);
  const [size, setSize] = useState<Size>("M");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const flow = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);
  const dashOffset = useTransform(flow, (v) => 1 - v);
  const activePhase = useTransform(flow, (v) =>
    Math.min(phases.length - 1, Math.max(0, Math.floor(v * phases.length))),
  );

  const [phaseIdx, setPhaseIdx] = useState(0);
  useMotionValueEvent(activePhase, "change", (v) => setPhaseIdx(v));

  const sm = sizeMeta[size];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="aquamax-explainer-title"
      className="not-prose relative mt-24 overflow-hidden rounded-sm border border-foreground/[0.07] bg-[oklch(0.04_0.005_245)]"
    >
      <div className="relative z-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-foreground/[0.06] px-6 py-5 md:px-9">
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/80">
          Inspection · System Schematic
        </span>
        <h3
          id="aquamax-explainer-title"
          className="font-display text-xl tracking-[-0.02em] text-foreground/95 md:text-2xl"
        >
          Aquamax — Industrial Vapor Recovery Deployment
        </h3>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
          HV · Low-Current · Closed-Loop
        </span>
      </div>

      <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="relative">
          <div className="sticky top-16 px-4 pb-6 pt-6 md:px-8 md:pt-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setDetached((d) => !d)}
                className="group inline-flex items-center gap-3 rounded-sm border border-accent/40 bg-[oklch(0.06_0.01_245)] px-3.5 py-2 transition-colors hover:border-accent/70"
                aria-pressed={detached}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    detached ? "bg-accent/90" : "bg-foreground/40"
                  }`}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/80">
                  {detached ? "Attach Hood" : "Detach Hood"}
                </span>
              </button>

              <div className="flex divide-x divide-foreground/[0.08] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]">
                {(Object.keys(sizeMeta) as Size[]).map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      aria-pressed={active}
                      className={`px-3 py-2 text-left transition-colors ${
                        active ? "bg-foreground/[0.05]" : "hover:bg-foreground/[0.03]"
                      }`}
                    >
                      <span
                        className={`block font-mono text-[9px] uppercase tracking-[0.32em] ${
                          active ? "text-accent/85" : "text-foreground/50"
                        }`}
                      >
                        {sizeMeta[s].label}
                      </span>
                      <span
                        className={`block font-mono text-[8.5px] uppercase tracking-[0.28em] ${
                          active ? "text-foreground/75" : "text-foreground/40"
                        }`}
                      >
                        {s === "S" ? "Small" : s === "M" ? "Medium" : "Large"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/45">
                {sm.note}
              </span>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[radial-gradient(ellipse_at_top,oklch(0.08_0.012_245)_0%,oklch(0.03_0.005_245)_70%)]">
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full opacity-[0.08]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="aq-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#aq-grid)" />
              </svg>

              <Scene detached={detached} size={size} dashOffset={dashOffset} />

              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.008_245/0.7)] px-2.5 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
                <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/65">
                  Live · Schematic
                </span>
              </div>
              <div className="absolute right-3 top-3 rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.008_245/0.7)] px-2.5 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/65">
                  {detached ? "Hood · Released" : "Hood · Engaged"}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/45">
                  Flow · Cycle {String(phaseIdx + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-accent/70">
                  {phases[phaseIdx].tag}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-foreground/[0.06] lg:border-l lg:border-t-0">
          <div className="space-y-0">
            {phases.map((p, i) => (
              <PhaseCallout key={p.code} phase={p} index={i} active={i === phaseIdx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Scene({
  detached,
  size,
  dashOffset,
}: {
  detached: boolean;
  size: Size;
  dashOffset: ReturnType<typeof useTransform<number, number>>;
}) {
  const sm = sizeMeta[size];

  const chimneyX = 95;
  const chimneyTopY = 70;
  const chimneyBottomY = 280;
  const chimneyHalf = sm.chimneyW / 2;
  const collarHalf = sm.collarW / 2;

  const hoodAttachedY = chimneyTopY - 6;
  const hoodOffsetY = detached ? -34 : 0;

  return (
    <svg
      viewBox="0 0 400 300"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Aquamax deployment schematic with detachable chimney hood, corrugated piping and HV recovery unit"
    >
      <defs>
        <linearGradient id="steel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.32 0.01 235)" />
          <stop offset="50%" stopColor="oklch(0.48 0.012 235)" />
          <stop offset="100%" stopColor="oklch(0.22 0.008 235)" />
        </linearGradient>
        <linearGradient id="cabinet" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.18 0.008 245)" />
          <stop offset="100%" stopColor="oklch(0.08 0.006 245)" />
        </linearGradient>
        <linearGradient id="vapor" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.85 0.02 235)" stopOpacity="0" />
          <stop offset="60%" stopColor="oklch(0.85 0.02 235)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.92 0.02 235)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hoodInner" cx="0.5" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="oklch(0.62 0.08 45)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.2 0.02 45)" stopOpacity="0" />
        </radialGradient>
        <pattern id="corrugated" width="6" height="20" patternUnits="userSpaceOnUse">
          <rect width="6" height="20" fill="url(#steel)" />
          <line x1="0" y1="2" x2="6" y2="2" stroke="oklch(0.12 0.005 235)" strokeWidth="0.8" />
          <line x1="0" y1="6" x2="6" y2="6" stroke="oklch(0.12 0.005 235)" strokeWidth="0.8" />
          <line x1="0" y1="10" x2="6" y2="10" stroke="oklch(0.12 0.005 235)" strokeWidth="0.8" />
          <line x1="0" y1="14" x2="6" y2="14" stroke="oklch(0.12 0.005 235)" strokeWidth="0.8" />
          <line x1="0" y1="18" x2="6" y2="18" stroke="oklch(0.12 0.005 235)" strokeWidth="0.8" />
        </pattern>
      </defs>

      <line
        x1="0"
        y1={chimneyBottomY}
        x2="400"
        y2={chimneyBottomY}
        stroke="oklch(0.25 0.008 235)"
        strokeWidth="0.5"
      />

      <rect
        x={chimneyX - chimneyHalf}
        y={chimneyTopY}
        width={sm.chimneyW}
        height={chimneyBottomY - chimneyTopY}
        fill="oklch(0.16 0.006 235)"
        stroke="oklch(0.28 0.008 235)"
        strokeWidth="0.6"
      />
      {[110, 160, 210, 260].map((y) => (
        <line
          key={y}
          x1={chimneyX - chimneyHalf}
          y1={y}
          x2={chimneyX + chimneyHalf}
          y2={y}
          stroke="oklch(0.24 0.008 235)"
          strokeWidth="0.5"
        />
      ))}
      <ellipse
        cx={chimneyX}
        cy={chimneyTopY}
        rx={chimneyHalf}
        ry={6}
        fill="oklch(0.08 0.005 235)"
        stroke="oklch(0.32 0.008 235)"
        strokeWidth="0.6"
      />
      <g stroke="oklch(0.55 0.12 45)" strokeWidth="0.6">
        <line x1={chimneyX - chimneyHalf - 3} y1={chimneyTopY + 4} x2={chimneyX - chimneyHalf + 2} y2={chimneyTopY + 4} />
        <line x1={chimneyX + chimneyHalf - 2} y1={chimneyTopY + 4} x2={chimneyX + chimneyHalf + 3} y2={chimneyTopY + 4} />
      </g>

      <AnimatePresence>
        {detached && (
          <motion.g
            key="plume"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <motion.ellipse
              cx={chimneyX}
              cy={chimneyTopY - 24}
              rx={chimneyHalf - 4}
              ry={30}
              fill="url(#vapor)"
              animate={{ ry: [28, 34, 28], opacity: [0.7, 0.95, 0.7] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.ellipse
              cx={chimneyX - 6}
              cy={chimneyTopY - 44}
              rx={chimneyHalf + 4}
              ry={22}
              fill="url(#vapor)"
              animate={{ cy: [chimneyTopY - 44, chimneyTopY - 56, chimneyTopY - 44], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      <motion.g
        animate={{ y: hoodOffsetY }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      >
        <path
          d={`
            M ${chimneyX - collarHalf} ${hoodAttachedY}
            L ${chimneyX - collarHalf - 8} ${hoodAttachedY - 22}
            L ${chimneyX - collarHalf - 26} ${hoodAttachedY - 44}
            L ${chimneyX + collarHalf + 26} ${hoodAttachedY - 44}
            L ${chimneyX + collarHalf + 8} ${hoodAttachedY - 22}
            L ${chimneyX + collarHalf} ${hoodAttachedY}
            Z
          `}
          fill="url(#cabinet)"
          stroke="oklch(0.36 0.01 235)"
          strokeWidth="0.7"
        />
        <ellipse
          cx={chimneyX}
          cy={hoodAttachedY - 42}
          rx={collarHalf + 18}
          ry={3.5}
          fill="oklch(0.05 0.005 235)"
          stroke="oklch(0.4 0.01 235)"
          strokeWidth="0.5"
        />
        <ellipse
          cx={chimneyX}
          cy={hoodAttachedY - 22}
          rx={collarHalf + 8}
          ry={4}
          fill="url(#hoodInner)"
        />

        <rect
          x={chimneyX + collarHalf + 4}
          y={hoodAttachedY - 38}
          width="22"
          height="10"
          fill="url(#steel)"
          stroke="oklch(0.36 0.01 235)"
          strokeWidth="0.5"
        />

        <g>
          <rect
            x={chimneyX - collarHalf - 3}
            y={hoodAttachedY - 2}
            width={collarHalf * 2 + 6}
            height={6}
            fill="oklch(0.36 0.012 235)"
            stroke="oklch(0.5 0.012 235)"
            strokeWidth="0.5"
          />
          {Array.from({ length: 8 }).map((_, i) => {
            const x = chimneyX - collarHalf + (i + 0.5) * ((collarHalf * 2) / 8);
            return (
              <circle
                key={i}
                cx={x}
                cy={hoodAttachedY + 1}
                r="1.1"
                fill="oklch(0.62 0.1 45)"
              />
            );
          })}
          <line
            x1={chimneyX - collarHalf - 4}
            y1={hoodAttachedY + 4}
            x2={chimneyX + collarHalf + 4}
            y2={hoodAttachedY + 4}
            stroke="oklch(0.55 0.1 45)"
            strokeWidth="0.6"
          />
        </g>

        <g>
          <circle cx={chimneyX - 14} cy={hoodAttachedY - 48} r="2.4" fill="oklch(0.18 0.04 30)" stroke="oklch(0.4 0.08 30)" strokeWidth="0.5" />
          <circle cx={chimneyX + 14} cy={hoodAttachedY - 48} r="2.4" fill="oklch(0.18 0.04 30)" stroke="oklch(0.4 0.08 30)" strokeWidth="0.5" />
          <line x1={chimneyX - 14} y1={hoodAttachedY - 50} x2={chimneyX - 14} y2={hoodAttachedY - 54} stroke="oklch(0.6 0.12 45)" strokeWidth="0.7" />
          <line x1={chimneyX + 14} y1={hoodAttachedY - 50} x2={chimneyX + 14} y2={hoodAttachedY - 54} stroke="oklch(0.6 0.12 45)" strokeWidth="0.7" />
        </g>
      </motion.g>

      {(() => {
        const startX = chimneyX + collarHalf + 26;
        const startY = hoodAttachedY - 33 + hoodOffsetY;
        const endX = 300;
        const endY = 200;
        const path = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 60} ${endY - 30}, ${endX} ${endY}`;
        return (
          <g>
            <path d={path} stroke="url(#corrugated)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d={path} stroke="oklch(0.12 0.005 235)" strokeWidth="0.6" fill="none" />
            <motion.path
              d={path}
              stroke="oklch(0.78 0.1 45)"
              strokeWidth="1.4"
              fill="none"
              strokeDasharray="5 8"
              pathLength={1}
              style={{ strokeDashoffset: dashOffset }}
              opacity={0.85}
            />
          </g>
        );
      })()}

      <g>
        <rect x={290} y={195} width={92} height={75} fill="url(#cabinet)" stroke="oklch(0.36 0.01 235)" strokeWidth="0.7" />
        <rect x={286} y={200} width={6} height={10} fill="url(#steel)" />
        <g stroke="oklch(0.55 0.12 45)" strokeWidth="0.9" fill="none">
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d={`M ${300} ${220 + i * 7} Q ${336} ${214 + i * 7}, ${372} ${220 + i * 7}`} />
          ))}
        </g>
        <g>
          <circle cx={302} cy={208} r="2.4" fill="oklch(0.08 0.005 235)" stroke="oklch(0.5 0.01 235)" strokeWidth="0.5" />
          <circle cx={312} cy={208} r="2.4" fill="oklch(0.08 0.005 235)" stroke="oklch(0.5 0.01 235)" strokeWidth="0.5" />
        </g>
        <rect x={290} y={262} width={92} height={4} fill="oklch(0.06 0.005 235)" />
        <text x={295} y={265.4} fill="oklch(0.62 0.08 45)" fontSize="3" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
          AQUAMAX · HV-LC
        </text>
        <rect x={344} y={270} width={6} height={6} fill="url(#steel)" />
      </g>

      <g>
        <motion.path
          d={`M 347 276 L 347 286 L 60 286 L 60 272`}
          stroke="oklch(0.62 0.08 195)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="3 6"
          pathLength={1}
          style={{ strokeDashoffset: dashOffset }}
          opacity={0.7}
        />
        <text x={170} y={282} fill="oklch(0.62 0.08 195)" fontSize="3.4" fontFamily="ui-monospace, monospace" letterSpacing="0.5">
          RECYCLED · CONDENSATE → PROCESS WATER
        </text>
      </g>

      <g fill="oklch(0.65 0.005 235)" fontFamily="ui-monospace, monospace" fontSize="3.4" letterSpacing="0.4">
        <text x={chimneyX - chimneyHalf - 38} y={chimneyTopY + 10}>INTAKE HOOD</text>
        <text x={215} y={170}>CORRUGATED 316L</text>
        <text x={296} y={188}>HV · LOW-CURRENT UNIT</text>
        <text x={chimneyX - 12} y={chimneyBottomY - 6} fill="oklch(0.5 0.005 235)">
          STACK · {sm.label}
        </text>
      </g>
    </svg>
  );
}

function PhaseCallout({
  phase,
  index,
  active,
}: {
  phase: (typeof phases)[number];
  index: number;
  active: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.04, ease: [0.19, 1, 0.22, 1] }}
      className={`relative min-h-[80vh] border-b border-foreground/[0.06] px-6 py-10 transition-colors duration-700 md:px-9 ${
        active ? "bg-[oklch(0.055_0.008_245)]" : "bg-transparent"
      }`}
    >
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-full w-px transition-colors duration-700 ${
          active ? "bg-accent/70" : "bg-foreground/[0.06]"
        }`}
      />
      <div className="flex items-center gap-3">
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.4em] transition-colors duration-700 ${
            active ? "text-accent/85" : "text-foreground/45"
          }`}
        >
          {phase.code} · {phase.tag}
        </span>
        <span className="h-px flex-1 bg-foreground/[0.08]" />
      </div>
      <h4 className="mt-4 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-foreground/95 md:text-3xl">
        {phase.title}
      </h4>
      <p className="mt-4 max-w-[44ch] font-sans text-[14.5px] leading-[1.7] text-foreground/65">
        {phase.body}
      </p>
      <ul className="mt-6 space-y-2">
        {phase.bullets.map((b) => (
          <li
            key={b}
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/60"
          >
            <span className={`h-1 w-1 rounded-full ${active ? "bg-accent/85" : "bg-foreground/30"}`} />
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
