import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CinematicPageShell from "@/components/scene/CinematicPageShell";
import FounderPortrait from "@/components/scene/FounderPortrait";
import LatticeField from "@/components/scene/LatticeField";
import { Tilt3DSurface, Product3DModal, type Product3DModalData } from "@/components/scene/Product3DView";
import backdrop from "@/assets/story-03-material.webp";

import imgGraphacrete from "@/assets/innovations/graphacrete.webp";
import imgGraffisol from "@/assets/innovations/graffisol.webp";
import imgCeraphene from "@/assets/innovations/ceraphene.webp";
import imgHdgpe from "@/assets/innovations/hdgpe.webp";
import imgGraphenodes from "@/assets/innovations/graphenodes.webp";
import imgCoalorix from "@/assets/innovations/coalorix.webp";
import imgAquamax from "@/assets/innovations/aquamax.webp";
import imgIgnitronD from "@/assets/innovations/ignitron-d.webp";
import imgIgnitronP from "@/assets/innovations/ignitron-p.webp";
import imgLubritron from "@/assets/innovations/lubritron.webp";
import imgBitumax from "@/assets/innovations/bitumax.webp";
import imgRustene from "@/assets/innovations/rustene.webp";
import imgPyronex from "@/assets/innovations/pyronex.webp";
import imgGraphyre from "@/assets/innovations/graphyre.webp";
import imgGraphosite from "@/assets/innovations/graphosite.webp";
import imgThermaphene from "@/assets/innovations/thermaphene.webp";
import imgArmophene from "@/assets/innovations/armophene.webp";
import imgGryogen from "@/assets/innovations/gryogen.webp";
import imgHydrocell from "@/assets/innovations/hydrocell.webp";
import imgMariphene from "@/assets/innovations/mariphene.webp";
import imgAerophenter from "@/assets/innovations/aerophenter.webp";
import imgFibrasphene from "@/assets/innovations/fibrasphene.webp";
import imgVoltaphene from "@/assets/innovations/voltaphene.webp";

// Transparent product cut-outs — identity-preserved studio product staging
import cutGraphacrete from "@/assets/innovations/cutouts/graphacrete.png";
import cutGraffisol from "@/assets/innovations/cutouts/graffisol.png";
import cutCeraphene from "@/assets/innovations/cutouts/ceraphene.png";
import cutHdgpe from "@/assets/innovations/cutouts/hdgpe.png";
import cutGraphenodes from "@/assets/innovations/cutouts/graphenodes.png";
import cutCoalorix from "@/assets/innovations/cutouts/coalorix.png";
import cutAquamax from "@/assets/innovations/cutouts/aquamax.png";
import cutIgnitronD from "@/assets/innovations/cutouts/ignitron-d.png";
import cutIgnitronP from "@/assets/innovations/cutouts/ignitron-p.png";
import cutLubritron from "@/assets/innovations/cutouts/lubritron.png";
import cutBitumax from "@/assets/innovations/cutouts/bitumax.png";
import cutRustene from "@/assets/innovations/cutouts/rustene.png";
import cutPyronex from "@/assets/innovations/cutouts/pyronex.png";
import cutGraphyre from "@/assets/innovations/cutouts/graphyre.png";
import cutGraphosite from "@/assets/innovations/cutouts/graphosite.png";
import cutThermaphene from "@/assets/innovations/cutouts/thermaphene.png";
import cutArmophene from "@/assets/innovations/cutouts/armophene.png";
import cutGryogen from "@/assets/innovations/cutouts/gryogen.png";
import cutHydrocell from "@/assets/innovations/cutouts/hydrocell.png";
import cutMariphene from "@/assets/innovations/cutouts/mariphene.png";
import cutAerophenter from "@/assets/innovations/cutouts/aerophenter.png";
import cutFibrasphene from "@/assets/innovations/cutouts/fibrasphene.png";
import cutVoltaphene from "@/assets/innovations/cutouts/voltaphene.png";

// Application / use-case imagery — shown as the secondary still in the
// inspection modal. Each one depicts the product's real-world context.
import appGraphacrete from "@/assets/innovations/applications/graphacrete.webp";
import appGraffisol from "@/assets/innovations/applications/graffisol.webp";
import appCeraphene from "@/assets/innovations/applications/ceraphene.webp";
import appHdgpe from "@/assets/innovations/applications/hdgpe.webp";
import appGraphenodes from "@/assets/innovations/applications/graphenodes.webp";
import appCoalorix from "@/assets/innovations/applications/coalorix.webp";
import appAquamax from "@/assets/innovations/applications/aquamax.webp";
import appIgnitronD from "@/assets/innovations/applications/ignitron-d.webp";
import appIgnitronP from "@/assets/innovations/applications/ignitron-p.webp";
import appLubritron from "@/assets/innovations/applications/lubritron.webp";
import appBitumax from "@/assets/innovations/applications/bitumax.webp";
import appRustene from "@/assets/innovations/applications/rustene.webp";
import appPyronex from "@/assets/innovations/applications/pyronex.webp";
import appGraphyre from "@/assets/innovations/applications/graphyre.webp";
import appGraphosite from "@/assets/innovations/applications/graphosite.webp";
import appThermaphene from "@/assets/innovations/applications/thermaphene.webp";
import appArmophene from "@/assets/innovations/applications/armophene.webp";
import appGryogen from "@/assets/innovations/applications/gryogen.webp";
import appHydrocell from "@/assets/innovations/applications/hydrocell.webp";
import appMariphene from "@/assets/innovations/applications/mariphene.webp";
import appAerophenter from "@/assets/innovations/applications/aerophenter.webp";
import appFibrasphene from "@/assets/innovations/applications/fibrasphene.webp";
import appVoltaphene from "@/assets/innovations/applications/voltaphene.webp";

export const Route = createFileRoute("/innovations")({
  component: InnovationsPage,
  head: () => ({
    meta: [
      { title: "Innovations — 23 Graphene Products · Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "23 deep-tech graphene innovations across construction, energy, water, hydrogen, mobility, storage and armour — from commercial to pilot to R&D.",
      },
      { property: "og:title", content: "Innovations — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "From Graphacrete and Graffisol to Voltaphene and Armophene — 23 graphene innovations across commercial, pilot, and R&D stages.",
      },
      { property: "og:url", content: "/innovations" },
    ],
    links: [{ rel: "canonical", href: "/innovations" }],
  }),
});

type Stage = "Commercial" | "Pilot" | "R&D";

type Spec = { k: string; v: string; note: string };

type Item = {
  title: string;
  stage: Stage;
  metric: string;
  body: string;
  img: string;
  cutout: string;
  application: string;
  domain: string;
  status: string;
  featured?: boolean;
  specs?: Spec[];
  positioning?: string;
  applicationContext?: string[];
};

const items: Item[] = [
  { title: "Graphacrete", stage: "Commercial", domain: "Construction · Cement", status: "Patent · Field-deployed", metric: "49.5 MPa · −40 kg/m³ cement", body: "Graphene nano-platelet admixture transforming standard concrete into a high-performance material.", img: imgGraphacrete, cutout: cutGraphacrete, application: appGraphacrete, featured: true },
  { title: "Graffisol", stage: "Commercial", domain: "Solar · Coatings", status: "Patent · Field-deployed", metric: "+10–12% annual yield", body: "Solar coating delivering higher annual yield, panel cooling and superhydrophobic self-cleaning.", img: imgGraffisol, cutout: cutGraffisol, application: appGraffisol, featured: true },
  { title: "Ceraphene", stage: "Commercial", domain: "Ceramics · Coatings", status: "Patent · Retail", metric: "9H+ · ₹5,000", body: "Graphene-enhanced ceramic coating with 9H+ hardness at one-third the price of premium options.", img: imgCeraphene, cutout: cutCeraphene, application: appCeraphene },
  { title: "HD-G-PE", stage: "Commercial", domain: "Polymers · Masterbatch", status: "Patent · Industrial", metric: "+30% tensile · 100× barrier", body: "Graphene masterbatch — drop-in dosage for stronger, longer-lasting polymers.", img: imgHdgpe, cutout: cutHdgpe, application: appHdgpe },
  { title: "Graphenodes", stage: "Commercial", domain: "Energy Storage · Electrodes", status: "Patent · Cell trials", metric: "Higher density · longer cycles", body: "Next-gen graphene polymer cathode and anode materials for high-density batteries.", img: imgGraphenodes, cutout: cutGraphenodes, application: appGraphenodes },
  { title: "Ignitron D", stage: "Commercial", domain: "Mobility · Combustion", status: "Patent · Fleet trial", metric: "25% optimized diesel efficiency", body: "Graphene-enhanced diesel combustion optimization technology for industrial fleets, logistics systems, and heavy-duty engines.", img: imgIgnitronD, cutout: cutIgnitronD, application: appIgnitronD, specs: [
    { k: "Fuel Savings", v: "25%", note: "Optimized diesel efficiency" },
    { k: "Emissions", v: "20%", note: "Reduced emissions output" },
    { k: "Dose", v: "0.05%", note: "Optimized additive integration" },
  ], positioning: "Graphene-enhanced diesel combustion optimization technology for industrial fleets, logistics systems, and heavy-duty engines.", applicationContext: ["Heavy commercial vehicles", "Logistics infrastructure", "Mining / fleet systems", "Industrial diesel engines"] },
  { title: "Coalorix", stage: "Pilot", domain: "Thermal Power · Combustion", status: "Plant pilot", metric: "15% optimized coal utilization", body: "Nano-engineered coal combustion optimization technology for thermal plants, industrial furnaces, and energy infrastructure.", img: imgCoalorix, cutout: cutCoalorix, application: appCoalorix, featured: true, specs: [
    { k: "Coal Savings", v: "15%", note: "Optimized coal utilization" },
    { k: "Emissions", v: "35%", note: "Reduced emissions output" },
    { k: "Dose", v: "0.01%", note: "Combustion optimization integration" },
  ], positioning: "Nano-engineered coal combustion optimization technology for thermal plants, industrial furnaces, and energy infrastructure.", applicationContext: ["Thermal power plants", "Industrial combustion systems", "Boiler / furnace optimization", "Energy-efficiency infrastructure"] },
  { title: "Aquamax", stage: "Pilot", domain: "Water · Recovery", status: "World-first system", metric: "95%+ recovery · 12–24 mo ROI", body: "World-first hybrid HAMR + HGMC system recovering 95%+ of cooling tower plume water.", img: imgAquamax, cutout: cutAquamax, application: appAquamax, featured: true },
  { title: "Ignitron P", stage: "Pilot", domain: "Mobility · Combustion", status: "Field pilot", metric: "15% combustion efficiency improvement", body: "Advanced petrol-engine fuel optimization technology engineered for cleaner ignition and enhanced combustion stability.", img: imgIgnitronP, cutout: cutIgnitronP, application: appIgnitronP, specs: [
    { k: "Fuel Savings", v: "15%", note: "Combustion efficiency improvement" },
    { k: "Emissions", v: "10%", note: "Reduced emissions output" },
    { k: "Dose", v: "0.2%", note: "Optimized additive integration" },
  ], positioning: "Advanced petrol-engine fuel optimization technology engineered for cleaner ignition and enhanced combustion stability.", applicationContext: ["Automotive systems", "Petrol-engine optimization", "Mobility platforms", "Fuel-performance enhancement"] },
  { title: "Lubritron", stage: "Pilot", domain: "Tribology · Lubricants", status: "Industrial pilot", metric: "6% fuel savings · 40% wear reduction", body: "Nano-enabled molecular engine oil additive for all engine types — improving fuel efficiency, reducing engine wear, and extending oil life.", img: imgLubritron, cutout: cutLubritron, application: appLubritron, specs: [
    { k: "Fuel Savings", v: "Up to 6%", note: "Optimized fuel efficiency" },
    { k: "Wear Reduction", v: "Up to 40%", note: "Engine friction reduction" },
    { k: "Oil Life", v: "Up to 50%", note: "Extended drain interval" },
    { k: "Dose", v: "0.2%", note: "Optimized lubricant additive integration" },
  ], positioning: "Molecular engine oil additive for all engine types, designed to improve fuel efficiency, reduce engine wear, and extend oil life.", applicationContext: ["All engine types", "Petrol engines", "Diesel engines", "Two-stroke engines"] },
  { title: "Rustene", stage: "Pilot", domain: "Coatings · Corrosion", status: "Industrial pilot", metric: "Multi-year corrosion shield", body: "Graphene-based anti-corrosion shield for steel, marine and industrial assets.", img: imgRustene, cutout: cutRustene, application: appRustene },
  { title: "Gryogen", stage: "Pilot", domain: "Hydrogen · Membranes", status: "Membrane trial", metric: "Selective H₂ separation", body: "Graphene-based hydrogen selection membrane for clean fuel production.", img: imgGryogen, cutout: cutGryogen, application: appGryogen },
  { title: "Mariphene", stage: "Pilot", domain: "Water · Desalination", status: "Membrane trial", metric: "Low-energy desalination", body: "Graphene desalination membrane for high-throughput, low-energy water production.", img: imgMariphene, cutout: cutMariphene, application: appMariphene },
  { title: "Aerophenter", stage: "Pilot", domain: "Atmospheric Water", status: "Prototype field-trial", metric: "Water from air", body: "Atmospheric water harvesting using graphene-engineered surfaces.", img: imgAerophenter, cutout: cutAerophenter, application: appAerophenter },
  { title: "Fibrasphene", stage: "Pilot", domain: "Composites · Fibres", status: "Composite pilot", metric: "Stronger glass fibres", body: "Reinforced graphene glass fibres for stronger composites and structures.", img: imgFibrasphene, cutout: cutFibrasphene, application: appFibrasphene },
  { title: "Voltaphene", stage: "Pilot", domain: "Grid Storage", status: "Stack pilot", metric: "Grid-scale storage", body: "Graphene-enabled energy storage systems for grid and mobility applications.", img: imgVoltaphene, cutout: cutVoltaphene, application: appVoltaphene },
  { title: "Armophene", stage: "R&D", domain: "Defence · Ballistics", status: "R&D · Bench", metric: "Lighter than steel armour", body: "Next-generation graphene ballistics — lighter, stronger personal and vehicle armour.", img: imgArmophene, cutout: cutArmophene, application: appArmophene, featured: true },
  { title: "Hydrocell", stage: "R&D", domain: "Hydrogen · Fuel Cell", status: "R&D · Bench", metric: "Zero-emission · high power density", body: "Graphene-enhanced hydrogen fuel cell stack for clean mobility and stationary power.", img: imgHydrocell, cutout: cutHydrocell, application: appHydrocell, featured: true },
  { title: "Bitumax", stage: "R&D", domain: "Infrastructure · Bitumen", status: "R&D · Bench", metric: "1.5–2× pavement life", body: "Bitumen additive extending pavement life with major fatigue reduction.", img: imgBitumax, cutout: cutBitumax, application: appBitumax },
  { title: "Pyronex", stage: "R&D", domain: "Coatings · Multifunctional", status: "R&D · Bench", metric: "Fire · Heat · UV · Microbe shield", body: "Multi-functional paint additive — fire retardant, thermal barrier, UV insulation, anti-algae and anti-microbial in one coat.", img: imgPyronex, cutout: cutPyronex, application: appPyronex },
  { title: "Graphyre", stage: "R&D", domain: "Mobility · Tyres", status: "R&D · Compound", metric: "Longer life · better grip", body: "Reinforced performance tyres with graphene for grip, mileage and rolling efficiency.", img: imgGraphyre, cutout: cutGraphyre, application: appGraphyre },
  { title: "Graphosite", stage: "R&D", domain: "Composites · Structural", status: "R&D · Bench", metric: "Ultra-light · ultra-strong", body: "Structural graphene composites for ultra-light, ultra-strong applications.", img: imgGraphosite, cutout: cutGraphosite, application: appGraphosite },
  { title: "Thermaphene", stage: "R&D", domain: "Smart Textiles", status: "R&D · Bench", metric: "Active thermal regulation", body: "Smart thermal fabrics that regulate body temperature using graphene.", img: imgThermaphene, cutout: cutThermaphene, application: appThermaphene },
];

const filters = ["All", "Commercial", "Pilot", "R&D"] as const;
type Filter = (typeof filters)[number];

const materialSpec = [
  { k: "Atomic Layers", v: "1", note: "Monolayer carbon" },
  { k: "Tensile Strength", v: "130 GPa", note: "≈ 200× steel" },
  { k: "Surface Area", v: "2,630 m²/g", note: "Per gram" },
  { k: "Thermal Conductivity", v: "5,000 W/mK", note: "≈ 13× copper" },
];

const stageMeta: Record<Stage, { label: string; sub: string; tone: string }> = {
  Commercial: { label: "Field-Deployed", sub: "Manufacturing · Market", tone: "Stage I" },
  Pilot: { label: "Plant & Field Pilots", sub: "Validation · Scale-up", tone: "Stage II" },
  "R&D": { label: "R&D · Bench", sub: "Formulation · Prototyping", tone: "Stage III" },
};

function InnovationsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [active, setActive] = useState<Product3DModalData | null>(null);
  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((it) => it.stage === filter)),
    [filter],
  );
  const openProduct = (it: Item) => {
    const largeFrameTitles = new Set([
      "Graphacrete",
      "Graffisol",
      "Ceraphene",
      "Ignitron D",
      "Lubritron",
    ]);
    const captions: Record<string, string> = {
      Graphacrete: "Infrastructure · Concrete deployment",
      Graffisol: "Solar array · Coating application",
      Ceraphene: "Automotive surface · Hydrophobic ceramic",
      "Ignitron D": "Diesel fleet · Combustion systems",
      Lubritron: "Engine internals · Friction-reduction",
    };
    setActive({
      title: it.title,
      domain: it.domain,
      status: it.status,
      metric: it.metric,
      body: it.body,
      img: it.cutout,
      detailImg: it.application,
      applicationVideo: it.title === "Graphacrete" ? "/videos/graphacrete.mp4" : undefined,
      stage: it.stage,
      specs: it.specs,
      positioning: it.positioning,
      applicationContext: it.applicationContext,
      largeApplicationFrame: largeFrameTitles.has(it.title),
      applicationCaption: captions[it.title],
    });
  };

  const grouped = useMemo(() => {
    const stages: Stage[] = ["Commercial", "Pilot", "R&D"];
    return stages
      .map((s) => ({ stage: s, list: visible.filter((it) => it.stage === s) }))
      .filter((g) => g.list.length > 0);
  }, [visible]);

  return (
    <CinematicPageShell
      eyebrow={`Innovations · Catalogue · ${items.length} of ${items.length}`}
      title={<>One material platform.<br className="hidden md:inline" /> Twenty-three industrial expressions.</>}
      lead="A private R&D archive of advanced materials engineering — graphene calibrated for concrete, solar, batteries, ceramics, polymers, water, hydrogen, mobility, storage and armour, traced from bench formulation through plant pilot to field deployment."
      backdrop={backdrop}
      overlay={0.78}
    >
      <FounderPortrait
        variant="documentary"
        caption="Calibrating instrumentation in the R&D lab — graphene formulations under bench-scale validation."
        meta="Field · R&D Bench"
      />

      {/* Material Spec Sheet — the substrate behind everything */}
      <div className="not-prose relative mt-12 overflow-hidden rounded-sm border border-foreground/[0.06] bg-[oklch(0.05_0.006_245)]">
        <LatticeField intensity={0.05} />
        <div className="relative z-10 px-6 py-9 md:px-9 md:py-12">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
              Material · Substrate Specification
            </span>
            <span className="h-px flex-1 bg-foreground/[0.08]" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
              C · sp² · 0.142 nm
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {materialSpec.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] }}
                className="flex flex-col gap-1.5"
              >
                <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/50">
                  {s.k}
                </span>
                <span className="font-display text-3xl md:text-4xl tracking-[-0.03em] text-foreground/95">
                  {s.v}
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/45">
                  {s.note}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Instrument bar — readiness-stage selector */}
      <div className="not-prose mt-14">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-foreground/[0.12]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
            Catalogue · Filter by readiness stage
          </span>
          <span className="h-px flex-1 bg-foreground/[0.08]" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/40">
            TRL · I — III
          </span>
        </div>
        <div className="flex divide-x divide-foreground/[0.08] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]">
          {filters.map((f) => {
            const isActive = f === filter;
            const count = f === "All" ? items.length : items.filter((i) => i.stage === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`group relative flex-1 px-4 py-4 text-left transition-colors duration-500 ${
                  isActive ? "bg-foreground/[0.04]" : "hover:bg-foreground/[0.02]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute left-0 right-0 top-0 h-px transition-colors duration-500 ${
                    isActive ? "bg-accent/70" : "bg-transparent group-hover:bg-foreground/15"
                  }`}
                />
                <span className={`block font-mono text-[9px] uppercase tracking-[0.38em] transition-colors duration-500 ${isActive ? "text-accent/85" : "text-foreground/45"}`}>
                  {f === "All" ? "All Stages" : f === "R&D" ? "Stage III" : f === "Pilot" ? "Stage II" : "Stage I"}
                </span>
                <span className={`mt-2 block font-display text-[15px] tracking-[-0.01em] transition-colors duration-500 ${isActive ? "text-foreground/95" : "text-foreground/70"}`}>
                  {f}
                </span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.28em] text-foreground/40">
                  {String(count).padStart(2, "0")} · Programs
                </span>
              </button>
            );
          })}
        </div>
      </div>


      {/* Stage-grouped catalogue — hierarchical, hero + supporting */}
      <div className="not-prose mt-12 space-y-20">
        {grouped.map((group) => {
          const meta = stageMeta[group.stage];
          const heroes = group.list.filter((i) => i.featured);
          const rest = group.list.filter((i) => !i.featured);
          return (
            <section key={group.stage} className="relative">
              <header className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-foreground/[0.08] pt-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/80">
                  {meta.tone}
                </span>
                <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground/95">
                  {meta.label}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/50">
                  {meta.sub}
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/40">
                  {String(group.list.length).padStart(2, "0")} · Programs
                </span>
              </header>

              {/* Hero cards — large, with lattice */}
              {heroes.length > 0 && (
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {heroes.map((it) => (
                    <HeroCard key={it.title} item={it} onOpen={() => openProduct(it)} />
                  ))}
                </div>
              )}

              {/* Supporting cards */}
              {rest.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                  {rest.map((it) => (
                    <CompactCard key={it.title} item={it} onOpen={() => openProduct(it)} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Patent · IP Register — closing institutional ledger */}
      <div className="not-prose relative mt-24 overflow-hidden rounded-sm border border-foreground/[0.06] bg-[oklch(0.05_0.006_245)]">
        <LatticeField intensity={0.04} />
        <div className="relative z-10 px-6 py-9 md:px-9 md:py-12">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
              Patent · IP Register
            </span>
            <span className="h-px flex-1 bg-foreground/[0.08]" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/45">
              Filed · Pending · In-Drafting
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {[
              { k: "Patents Filed", v: items.filter(i => i.status.includes("Patent")).length.toString().padStart(2,"0"), note: "Across stages" },
              { k: "Application Domains", v: "10+", note: "Industrial verticals" },
              { k: "Programs of Record", v: items.length.toString().padStart(2,"0"), note: "Catalogued formulations" },
              { k: "Research Years", v: "14+", note: "Continuous bench → field" },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.19, 1, 0.22, 1] }}
                className="flex flex-col gap-1.5"
              >
                <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/50">
                  {s.k}
                </span>
                <span className="font-display text-3xl md:text-4xl tracking-[-0.03em] text-foreground/95">
                  {s.v}
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/45">
                  {s.note}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Product3DModal item={active} onClose={() => setActive(null)} />
    </CinematicPageShell>

  );
}

function HeroCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.95, ease: [0.19, 1, 0.22, 1] }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      aria-label={`Open product inspection for ${item.title}`}
      className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70"
    >
      <Tilt3DSurface
        src={item.cutout}
        alt={`${item.title} — ${item.body}`}
        hero
        imgClassName="opacity-[0.98] transition-opacity duration-[1400ms] ease-out group-hover:opacity-100"
        imgStyle={{ filter: "drop-shadow(0 34px 48px oklch(0 0 0 / 0.78)) drop-shadow(0 18px 28px oklch(0 0 0 / 0.38)) drop-shadow(0 0 28px oklch(0.85 0.02 235 / 0.08))" }}
      />
      <div
        aria-hidden
        className="absolute right-0 top-0 h-full w-[46%] opacity-45"
        style={{
          background:
            "linear-gradient(270deg, oklch(0.86 0.02 235 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.02 0.006 245 / 0.16) 0%, transparent 28%, transparent 56%, oklch(0.015 0.006 245 / 0.9) 100%)",
        }}
      />
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <span className="h-px w-6 bg-accent/70" />
        <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-accent/85">
          Archive entry
        </span>
      </div>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[oklch(0.06_0.008_245/0.62)] px-2.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-accent/75" />
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/55">
          Studio still
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-1 border-l border-accent/30 pl-3">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-accent/75">
          {item.stage}
        </span>
        <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-foreground/50">
          {item.status}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-foreground/55">
          {item.domain}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-foreground/98 md:text-3xl">
          {item.title}
        </h3>
        <p className="mt-2.5 max-w-xl text-[13px] leading-snug text-foreground/75 md:text-[14px]">
          {item.body}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="h-px w-5 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">
            {item.metric}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function CompactCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      aria-label={`Open product inspection for ${item.title}`}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-sm border border-foreground/[0.07] bg-[oklch(0.05_0.006_245)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70"
    >
      <Tilt3DSurface
        src={item.cutout}
        alt={`${item.title} — ${item.body}`}
        imgClassName="opacity-[0.98] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100"
        imgStyle={{ filter: "drop-shadow(0 22px 34px oklch(0 0 0 / 0.72)) drop-shadow(0 10px 18px oklch(0 0 0 / 0.34))" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.12) 0%, transparent 34%, oklch(0.02 0.006 245 / 0.78) 84%, oklch(0.014 0.006 245 / 0.94) 100%)",
        }}
      />
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
        <span className="h-px w-5 bg-accent/60" />
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-accent/75">
          Still
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 md:p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/55">
          {item.domain}
        </p>
        <h3 className="mt-1 font-display text-base leading-tight tracking-[-0.01em] text-foreground/95 md:text-lg">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-foreground/55">
          {item.metric}
        </p>
      </div>
    </motion.article>
  );
}

