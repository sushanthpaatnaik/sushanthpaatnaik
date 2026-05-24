import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ArchetypeScene, archetypeFor } from "./archetypes";
import type { InnovationItem } from "./InnovationCard3D";

interface Props {
  item: InnovationItem | null;
  onClose: () => void;
}

export default function InnovationModal({ item, onClose }: Props) {
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    if (!item) return;
    setExploded(false);
    const t = window.setTimeout(() => setExploded(true), 600);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  const meta = item ? archetypeFor(item.title) : null;

  return (
    <AnimatePresence>
      {item && meta && (
        <motion.div
          key="innovation-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[100] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} immersive view`}
        >
          {/* Cinematic backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[oklch(0.018_0.006_245)]"
            onClick={onClose}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(70% 60% at 35% 45%, ${meta.accent}1c 0%, transparent 60%)`,
            }}
          />
          {/* Hairline grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Top chrome */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="relative z-10 flex items-center justify-between border-b border-foreground/[0.06] px-6 py-5 md:px-10"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8" style={{ background: `${meta.accent}cc` }} />
              <span
                className="font-mono text-[9.5px] uppercase tracking-[0.42em]"
                style={{ color: `${meta.accent}d0` }}
              >
                Immersive · Engineering View
              </span>
            </div>
            <button
              onClick={onClose}
              className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/60 transition-colors hover:text-foreground/95"
              aria-label="Close immersive view"
            >
              Close
              <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            </button>
          </motion.header>

          {/* Main grid: 3D stage + annotations */}
          <div className="relative z-10 flex flex-1 flex-col overflow-hidden lg:flex-row">
            {/* 3D stage */}
            <div className="relative flex-1 min-h-[55vh] lg:min-h-0">
              <Suspense fallback={null}>
                <Canvas
                  dpr={[1, 1.8]}
                  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                  style={{ background: "transparent" }}
                >
                  <PerspectiveCamera makeDefault position={[0, 0.2, 3.6]} fov={32} />
                  <ambientLight intensity={0.45} />
                  <directionalLight position={[5, 6, 7]} intensity={1.1} color="#dfe6f0" />
                  <pointLight position={[-6, -3, -2]} intensity={0.7} distance={20} color={meta.accent} />
                  <pointLight position={[4, 5, 2]} intensity={0.5} distance={16} color="#e8c878" />
                  <ArchetypeScene
                    id={meta.id}
                    accent={meta.accent}
                    exploded={exploded}
                    intensity={0.8}
                    seed={item.title.length * 7}
                  />
                  <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.6}
                    rotateSpeed={0.55}
                  />
                  <EffectComposer multisampling={0}>
                    <Bloom intensity={0.42} luminanceThreshold={0.5} luminanceSmoothing={0.92} />
                  </EffectComposer>
                </Canvas>
              </Suspense>

              {/* Annotations — corner ticks */}
              <AnnotationTick className="left-6 top-6" label="Geometry · Parametric" />
              <AnnotationTick className="right-6 top-6" label={`Archetype · ${meta.id.toUpperCase()}`} />
              <AnnotationTick className="left-6 bottom-6" label={item.status} />
              <AnnotationTick
                className="right-6 bottom-6"
                label={exploded ? "Exploded · Layered" : "Resting · Assembled"}
              />

              {/* Exploded toggle */}
              <button
                onClick={() => setExploded((v) => !v)}
                className="absolute left-1/2 bottom-5 z-10 -translate-x-1/2 rounded-sm border border-foreground/[0.12] bg-[oklch(0.04_0.006_245/0.7)] px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/75 backdrop-blur transition-colors hover:border-foreground/30 hover:text-foreground/95"
              >
                {exploded ? "Assemble" : "Exploded View"}
              </button>
            </div>

            {/* Annotation panel */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="relative w-full max-w-full overflow-y-auto border-t border-foreground/[0.06] bg-[oklch(0.03_0.006_245/0.7)] px-6 py-8 backdrop-blur-md lg:max-w-[420px] lg:border-l lg:border-t-0 lg:px-9 lg:py-12"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
                {item.domain}
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.025em] text-foreground/98 md:text-4xl">
                {item.title}
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-6" style={{ background: `${meta.accent}aa` }} />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: `${meta.accent}cc` }}
                >
                  {item.metric}
                </span>
              </div>
              <p className="mt-6 text-[14px] leading-relaxed text-foreground/78">
                {item.body}
              </p>

              {/* System Architecture */}
              <Block title="System Architecture">
                {systemArchitecture(meta.id).map((row) => (
                  <Row key={row.k} k={row.k} v={row.v} />
                ))}
              </Block>

              {/* Material Composition */}
              <Block title="Material Composition">
                {materialComposition(meta.id).map((row) => (
                  <Row key={row.k} k={row.k} v={row.v} />
                ))}
              </Block>

              {/* Environmental Integration */}
              <Block title="Environmental Integration">
                <p className="text-[12.5px] leading-relaxed text-foreground/70">
                  {environmentalIntegration(item)}
                </p>
              </Block>

              <div className="mt-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.32em] text-foreground/40">
                <span>Drag to orbit</span>
                <span>·</span>
                <span>Esc to close</span>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnnotationTick({ className, label }: { className: string; label: string }) {
  return (
    <div className={`pointer-events-none absolute z-10 flex items-center gap-2 ${className}`}>
      <span className="h-px w-5 bg-foreground/30" />
      <span className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-foreground/55">
        {label}
      </span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border-t border-foreground/[0.06] pt-5">
      <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.4em] text-foreground/50">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-foreground/[0.04] pb-1.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-foreground/55">{k}</span>
      <span className="text-right text-[12.5px] text-foreground/85">{v}</span>
    </div>
  );
}

/* ---------------------------- copy generators ---------------------------- */

function systemArchitecture(id: string): { k: string; v: string }[] {
  const map: Record<string, { k: string; v: string }[]> = {
    lattice: [
      { k: "Topology", v: "Hexagonal sp² monolayer" },
      { k: "Stacking", v: "AB · Bernal · 2–4 sheets" },
      { k: "Interface", v: "Functionalised edge bonds" },
    ],
    membrane: [
      { k: "Topology", v: "Stacked porous discs" },
      { k: "Pore Size", v: "0.34–1.2 nm engineered" },
      { k: "Flow Regime", v: "Selective · pressure-driven" },
    ],
    cellstack: [
      { k: "Architecture", v: "Bipolar plate · MEA stack" },
      { k: "Layer Count", v: "6 unit cells" },
      { k: "Bus", v: "Twin terminal posts" },
    ],
    panel: [
      { k: "Architecture", v: "Substrate · functional layer" },
      { k: "Grid", v: "Conductive busbar matrix" },
      { k: "Encapsulation", v: "Sealed environmental barrier" },
    ],
    orb: [
      { k: "Core", v: "Catalytic icosahedral particle" },
      { k: "Carrier", v: "Suspension · molecular dispersion" },
      { k: "Field", v: "Activation halo · orbital" },
    ],
    shield: [
      { k: "Architecture", v: "Curved laminate plate" },
      { k: "Layer Count", v: "4 graphene-composite plies" },
      { k: "Geometry", v: "Energy-dispersing curvature" },
    ],
    fiber: [
      { k: "Topology", v: "Multi-axis twisted strand" },
      { k: "Reinforcement", v: "Continuous graphene weave" },
      { k: "Matrix", v: "Polymer · composite-bonded" },
    ],
    halo: [
      { k: "Architecture", v: "Multi-ring functional shell" },
      { k: "Layers", v: "Thermal · UV · microbial" },
      { k: "Core", v: "Active graphene nucleus" },
    ],
  };
  return map[id] ?? map.lattice;
}

function materialComposition(id: string): { k: string; v: string }[] {
  const base = [
    { k: "Active Phase", v: "Graphene · few-layer" },
    { k: "Purity", v: "≥ 99.2% sp² carbon" },
  ];
  const extra: Record<string, { k: string; v: string }[]> = {
    lattice: [{ k: "Carrier", v: "Cementitious / polymer matrix" }],
    membrane: [{ k: "Substrate", v: "PES / ceramic support" }],
    cellstack: [{ k: "Binder", v: "PVDF · aqueous dispersion" }],
    panel: [{ k: "Encapsulant", v: "Fluoropolymer barrier" }],
    orb: [{ k: "Carrier Fluid", v: "Hydrocarbon dispersion" }],
    shield: [{ k: "Matrix", v: "Aramid · ceramic composite" }],
    fiber: [{ k: "Matrix", v: "Thermoset / elastomer" }],
    halo: [{ k: "Carrier", v: "Acrylic / silicone vehicle" }],
  };
  return [...base, ...(extra[id] ?? [])];
}

function environmentalIntegration(item: InnovationItem): string {
  return `Deployed across ${item.domain.toLowerCase()} systems, ${item.title} integrates into existing industrial infrastructure with minimal process disruption — engineered for long-cycle field operation and measurable improvement in ${item.metric.split("·")[0].trim().toLowerCase()}.`;
}
