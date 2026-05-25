import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      "Detachable flanged hood seals over the chimney mouth via a quick-release collar and aligned bolt-clamp set — capturing exhaust plume before it dissipates.",
  },
  {
    code: "02",
    tag: "Routing",
    title: "Corrugated 316L Conduit",
    body:
      "Pressure-rated, thermal-jacketed stainless corrugation routes captured vapor from the chimney head down to the ground-level recovery cabinet.",
  },
  {
    code: "03",
    tag: "Recovery",
    title: "HV · Low-Current Condenser",
    body:
      "Inside the Aquamax cabinet, a high-voltage / ultra-low-current array collapses vapor into liquid through dielectric phase-change — continuous duty.",
  },
  {
    code: "04",
    tag: "Reclaim",
    title: "Condensate Recycle Loop",
    body:
      "Recovered condensate is filtered, mineralised and re-injected into plant process water — closing the loop on emissions-side moisture.",
  },
];

export default function AquamaxSimulationCompact() {
  const [detached, setDetached] = useState(false);
  const [size, setSize] = useState<Size>("M");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const sm = sizeMeta[size];
  const phase = phases[phaseIdx];

  return (
    <section
      aria-labelledby="aquamax-compact-title"
      className="relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.045_0.008_245)]"
    >
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-b border-foreground/[0.07] px-5 py-3.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.4em] text-accent/85">
          Inspection · System Schematic
        </span>
        <h3
          id="aquamax-compact-title"
          className="font-display text-[15px] tracking-[-0.015em] text-foreground/95"
        >
          Aquamax — Vapor Recovery
        </h3>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">
          HV · LC · Closed-loop
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-foreground/[0.06] px-5 py-3">
        <button
          type="button"
          onClick={() => setDetached((d) => !d)}
          aria-pressed={detached}
          className="inline-flex items-center gap-2.5 rounded-sm border border-accent/40 bg-[oklch(0.06_0.01_245)] px-3 py-1.5 transition-colors hover:border-accent/70"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors ${detached ? "bg-accent/90" : "bg-foreground/40"}`}
          />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/85">
            {detached ? "Attach Hood" : "Detach Hood"}
          </span>
        </button>

        <div className="flex divide-x divide-foreground/[0.08] overflow-hidden rounded-sm border border-foreground/[0.08]">
          {(Object.keys(sizeMeta) as Size[]).map((s) => {
            const active = s === size;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={active}
                className={`px-2.5 py-1.5 transition-colors ${active ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.03]"}`}
              >
                <span
                  className={`block font-mono text-[8.5px] uppercase tracking-[0.32em] ${active ? "text-accent/90" : "text-foreground/55"}`}
                >
                  {sizeMeta[s].label}
                </span>
              </button>
            );
          })}
        </div>

        <span className="ml-auto font-mono text-[8.5px] uppercase tracking-[0.3em] text-foreground/50">
          {sm.note}
        </span>
      </div>

      {/* Scene */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-foreground/[0.06] bg-[radial-gradient(ellipse_at_top,oklch(0.08_0.012_245)_0%,oklch(0.03_0.005_245)_70%)]">
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="aqc-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aqc-grid)" />
        </svg>

        <CompactScene detached={detached} size={size} active={phaseIdx} />

        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.008_245/0.7)] px-2.5 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent/85" />
          <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/70">
            Live · Schematic
          </span>
        </div>
        <div className="absolute right-3 top-3 rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.008_245/0.7)] px-2.5 py-1 backdrop-blur-sm">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/70">
            {detached ? "Hood · Released" : "Hood · Engaged"}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/45">
            Cycle {String(phaseIdx + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-accent/75">
            {phase.tag}
          </span>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="grid grid-cols-4 divide-x divide-foreground/[0.06] border-b border-foreground/[0.06]">
        {phases.map((p, i) => {
          const active = i === phaseIdx;
          return (
            <button
              key={p.code}
              type="button"
              onClick={() => setPhaseIdx(i)}
              aria-pressed={active}
              className={`group relative px-3 py-2.5 text-left transition-colors ${active ? "bg-[oklch(0.06_0.01_245)]" : "hover:bg-foreground/[0.025]"}`}
            >
              <span
                aria-hidden
                className={`absolute left-0 top-0 h-full w-px transition-colors ${active ? "bg-accent/80" : "bg-transparent"}`}
              />
              <span
                className={`block font-mono text-[8.5px] uppercase tracking-[0.32em] ${active ? "text-accent/90" : "text-foreground/45"}`}
              >
                {p.code}
              </span>
              <span
                className={`mt-1 block font-mono text-[9px] uppercase tracking-[0.26em] ${active ? "text-foreground/85" : "text-foreground/55"}`}
              >
                {p.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase detail */}
      <div className="relative px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          >
            <h4 className="font-display text-[17px] leading-[1.2] tracking-[-0.015em] text-foreground/95">
              {phase.title}
            </h4>
            <p className="mt-1.5 text-[12.5px] leading-[1.65] text-foreground/70">
              {phase.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function CompactScene({ detached, size, active }: { detached: boolean; size: Size; active: number }) {
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
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Aquamax deployment schematic"
    >
      <defs>
        <linearGradient id="aqc-steel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.32 0.01 235)" />
          <stop offset="50%" stopColor="oklch(0.48 0.012 235)" />
          <stop offset="100%" stopColor="oklch(0.22 0.008 235)" />
        </linearGradient>
        <linearGradient id="aqc-cabinet" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.18 0.008 245)" />
          <stop offset="100%" stopColor="oklch(0.08 0.006 245)" />
        </linearGradient>
        <linearGradient id="aqc-vapor" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.85 0.02 235)" stopOpacity="0" />
          <stop offset="60%" stopColor="oklch(0.85 0.02 235)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="oklch(0.92 0.02 235)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="aqc-hoodInner" cx="0.5" cy="0.2" r="0.8">
          <stop offset="0%" stopColor="oklch(0.62 0.08 45)" stopOpacity="0.55" />
          