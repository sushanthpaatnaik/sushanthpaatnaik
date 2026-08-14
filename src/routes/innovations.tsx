import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CinematicPageShell from "@/components/scene/CinematicPageShell";
import FounderPortrait from "@/components/scene/FounderPortrait";
import LatticeField from "@/components/scene/LatticeField";
import { Tilt3DSurface, Product3DModal, type Product3DModalData } from "@/components/scene/Product3DView";
import { EvidenceBadge } from "@/components/scene/cinematic";
import { type Stage, stageMeta } from "@/lib/evidenceStandards";
import { breadcrumbSchema, ldJsonScript, webPageSchema, SITE_URL } from "@/lib/seo";
import backdrop from "@/assets/story-03-material.webp";
import founderShowroom from "@/assets/founder-showroom.webp";

import imgGraphacrete from "@/assets/innovations/graphacrete.webp";
import imgThermalPaste from "@/assets/innovations/thermal-paste.webp";
import imgGrapheneFabric from "@/assets/innovations/graphene-fabric.webp";
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
import cutGraphacrete from "@/assets/innovations/cutouts/graphacrete.webp";
import cutGraffisol from "@/assets/innovations/cutouts/graffisol.webp";
import cutCeraphene from "@/assets/innovations/cutouts/ceraphene.webp";
import cutHdgpe from "@/assets/innovations/cutouts/hdgpe.webp";
import cutGraphenodes from "@/assets/innovations/cutouts/graphenodes.webp";
import cutCoalorix from "@/assets/innovations/cutouts/coalorix.webp";
import cutAquamax from "@/assets/innovations/cutouts/aquamax.webp";
import cutIgnitronD from "@/assets/innovations/cutouts/ignitron-d.webp";
import cutIgnitronP from "@/assets/innovations/cutouts/ignitron-p.webp";
import cutLubritron from "@/assets/innovations/cutouts/lubritron.webp";
import cutBitumax from "@/assets/innovations/cutouts/bitumax.webp";
import cutRustene from "@/assets/innovations/cutouts/rustene.webp";
import cutPyronex from "@/assets/innovations/cutouts/pyronex.webp";
import cutGraphyre from "@/assets/innovations/cutouts/graphyre.webp";
import cutGraphosite from "@/assets/innovations/cutouts/graphosite.webp";
import cutThermaphene from "@/assets/innovations/cutouts/thermaphene.webp";
import cutArmophene from "@/assets/innovations/cutouts/armophene.webp";
import cutGryogen from "@/assets/innovations/cutouts/gryogen.webp";
import cutHydrocell from "@/assets/innovations/cutouts/hydrocell.webp";
import cutMariphene from "@/assets/innovations/cutouts/mariphene.webp";
import cutAerophenter from "@/assets/innovations/cutouts/aerophenter.webp";
import cutFibrasphene from "@/assets/innovations/cutouts/fibrasphene.webp";
import cutVoltaphene from "@/assets/innovations/cutouts/voltaphene.webp";

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

const description =
  "25 deep-tech graphene innovations across construction, energy, water, hydrogen, mobility, storage and armour — from commercial to pilot to R&D.";

export const Route = createFileRoute("/innovations")({
  component: InnovationsPage,
  head: () => ({
    meta: [
      { title: "Innovations — 25 Graphene Products · Sushanth Paatnaik" },
      { name: "description", content: description },
      { property: "og:title", content: "Innovations — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "From Graphacrete and Graffisol to Voltaphene and Armophene — 25 graphene innovations across commercial, pilot, and R&D stages.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/innovations" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/innovations" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ type: "CollectionPage", name: "Innovations — Sushanth Paatnaik", description, path: "/innovations" }),
      ),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Innovations", path: "/innovations" }])),
      ldJsonScript({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Innovations Catalogue",
        url: `${SITE_URL}/innovations`,
        numberOfItems: items.length,
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Thing", name: it.title, description: `${it.domain} — ${it.body}` },
        })),
      }),
    ],
  }),
});

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
  /* Both co-developed with Monoatom Labs and published on the SPI Industries
     portfolio. One photograph each — SPI has a single image per programme, so
     img/cutout/application share it rather than inventing a cutout or a
     context shot that does not exist. Replace the latter two when real assets
     are shot. */
  { title: "Graphene Thermal Paste", stage: "Commercial", domain: "Thermal · Interface Materials", status: "Co-developed · Monoatom Labs", metric: "Copper-class conductivity", body: "Graphene-loaded thermal interface compound. Pulls heat out of the contact area and spreads it laterally rather than letting it pool, at a bond line thin enough to keep interface resistance low — so an aluminium heat sink carries a duty specified for copper.", img: imgThermalPaste, cutout: imgThermalPaste, application: imgThermalPaste },
  { title: "Graphene-Infused Fabric", stage: "Commercial", domain: "Textiles · Functional Materials", status: "Co-developed · Monoatom Labs", metric: "Function survives the wash", body: "Graphene-infused technical cotton. Graphene oxide and reduced graphene oxide are bonded directly into 100% cotton, so antimicrobial, anti-odour, antistatic and ESD protection are built into the cloth rather than coated onto it.", img: imgGrapheneFabric, cutout: imgGrapheneFabric, application: imgGrapheneFabric },
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

const domainOptions = Array.from(new Set(items.map((it) => it.domain))).sort();

const materialSpec = [
  { k: "Atomic Layers", v: "1", note: "Monolayer carbon" },
  { k: "Tensile Strength", v: "130 GPa", note: "≈ 200× steel" },
  { k: "Surface Area", v: "2,630 m²/g", note: "Per gram" },
  { k: "Thermal Conductivity", v: "5,000 W/mK", note: "≈ 13× copper" },
];

const grantedPatents = [
  {
    title: "Production of graphene oxide from graphite",
    number: "564322",
    jurisdiction: undefined as string | undefined,
    issued: "March 28, 2025",
  },
  {
    title: "Process for producing graphene from graphite",
    number: "559803",
    jurisdiction: "India",
    issued: "February 10, 2025",
  },
];

type SortableKey = "title" | "domain" | "stage" | "metric" | "status";
const STAGE_RANK: Record<Stage, number> = { Commercial: 0, Pilot: 1, "R&D": 2 };

function InnovationsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [domainFilter, setDomainFilter] = useState<string>("All");
  const [patentOnly, setPatentOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [view, setView] = useState<"gallery" | "table">("gallery");
  const [sortKey, setSortKey] = useState<SortableKey>("stage");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [active, setActive] = useState<Product3DModalData | null>(null);
  const [showPatents, setShowPatents] = useState(false);

  const matchesFilters = (it: Item, opts: { stage?: Filter } = {}) => {
    const stage = opts.stage ?? filter;
    if (stage !== "All" && it.stage !== stage) return false;
    if (domainFilter !== "All" && it.domain !== domainFilter) return false;
    if (patentOnly && !it.status.includes("Patent")) return false;
    if (featuredOnly && !it.featured) return false;
    return true;
  };

  const visible = useMemo(
    () => items.filter((it) => matchesFilters(it)),
    [filter, domainFilter, patentOnly, featuredOnly],
  );
  const refinementActive = domainFilter !== "All" || patentOnly || featuredOnly;
  const resetRefinements = () => {
    setDomainFilter("All");
    setPatentOnly(false);
    setFeaturedOnly(false);
  };
  const sortedVisible = useMemo(() => {
    const list = [...visible];
    list.sort((a, b) => {
      const cmp =
        sortKey === "stage"
          ? STAGE_RANK[a.stage] - STAGE_RANK[b.stage]
          : a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [visible, sortKey, sortDir]);
  const toggleSort = (key: SortableKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
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
      applicationVideo: ({
        Graphacrete: "/videos/graphacrete.mp4",
        Graffisol: "/videos/graffisol.mp4",
        Ceraphene: "/videos/ceraphene.mp4",
      } as Record<string, string>)[it.title],
      stage: it.stage,
      specs: it.specs,
      positioning: it.positioning,
      applicationContext: it.applicationContext,
      largeApplicationFrame: largeFrameTitles.has(it.title),
      applicationCaption: captions[it.title],
      aquamaxSimulation: it.title === "Aquamax",
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
        src={founderShowroom}
        alt="Sushanth Paatnaik in the R&D showroom — instrumentation and engineering context"
        caption="Calibrating instrumentation in the R&D showroom — graphene formulations under bench-scale validation."
        meta="Field · R&D Facility"
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
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
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
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/50">
                  {s.k}
                </span>
                <span className="font-display text-3xl md:text-4xl tracking-[-0.03em] text-foreground/95">
                  {s.v}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
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
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/40">
            TRL · I — III
          </span>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:divide-x sm:divide-foreground/[0.08] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]">
          {filters.map((f) => {
            const isActive = f === filter;
            const count = items.filter((it) => matchesFilters(it, { stage: f })).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`group relative sm:flex-1 px-4 py-4 text-left transition-colors duration-500 border-foreground/[0.08] [&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-t-0 [&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-l-0 ${
                  isActive ? "bg-foreground/[0.04]" : "hover:bg-foreground/[0.02]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute left-0 right-0 top-0 h-px transition-colors duration-500 ${
                    isActive ? "bg-accent/70" : "bg-transparent group-hover:bg-foreground/15"
                  }`}
                />
                <span className={`block font-mono text-[10px] uppercase tracking-[0.38em] transition-colors duration-500 ${isActive ? "text-accent/85" : "text-foreground/45"}`}>
                  {f === "All" ? "All Stages" : f === "R&D" ? "Stage III" : f === "Pilot" ? "Stage II" : "Stage I"}
                </span>
                <span className={`mt-2 block font-display text-[15px] tracking-[-0.01em] transition-colors duration-500 ${isActive ? "text-foreground/95" : "text-foreground/70"}`}>
                  {f}
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/40">
                  {String(count).padStart(2, "0")} · Programs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Refine bar — domain, patent-association, and featured facets. All
          combine with the stage filter above; every control updates the
          catalogue instantly, no page reload. */}
      <div className="not-prose mt-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-foreground/[0.12]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/45">
            Refine · Domain · Patent Status · Featured
          </span>
          <span className="h-px flex-1 bg-foreground/[0.08]" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
        <label className="group relative inline-flex cursor-pointer items-center gap-2.5 rounded-sm border border-foreground/20 bg-[oklch(0.07_0.006_245)] py-2.5 pl-4 pr-9 shadow-[0_1px_0_0_oklch(1_0_0/0.03)] transition-colors duration-300 hover:border-accent/50 focus-within:border-accent/60">
          <span className="pointer-events-none font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/45">
            Domain
          </span>
          <span className="pointer-events-none h-3 w-px bg-foreground/[0.14]" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            aria-label="Filter by domain — click to choose an industry category"
            className={`appearance-none bg-transparent font-mono text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 focus:outline-none ${
              domainFilter === "All" ? "text-foreground/80" : "text-accent/90"
            }`}
          >
            <option value="All">All Domains</option>
            {domainOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-3.5 font-mono text-[12px] text-accent/75 transition-colors duration-300 group-hover:text-accent"
          >
            ▾
          </span>
        </label>

        <button
          onClick={() => setPatentOnly((v) => !v)}
          aria-pressed={patentOnly}
          className={`inline-flex items-center gap-2.5 rounded-sm border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
            patentOnly
              ? "border-accent/50 bg-accent/[0.08] text-accent/90"
              : "border-foreground/20 bg-[oklch(0.07_0.006_245)] text-foreground/70 hover:border-accent/40 hover:text-foreground/90"
          }`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full border transition-colors duration-300 ${
              patentOnly ? "border-accent bg-accent" : "border-foreground/40 bg-transparent"
            }`}
          />
          Patent-associated only
        </button>

        <button
          onClick={() => setFeaturedOnly((v) => !v)}
          aria-pressed={featuredOnly}
          className={`inline-flex items-center gap-2.5 rounded-sm border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
            featuredOnly
              ? "border-accent/50 bg-accent/[0.08] text-accent/90"
              : "border-foreground/20 bg-[oklch(0.07_0.006_245)] text-foreground/70 hover:border-accent/40 hover:text-foreground/90"
          }`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full border transition-colors duration-300 ${
              featuredOnly ? "border-accent bg-accent" : "border-foreground/40 bg-transparent"
            }`}
          />
          Featured only
        </button>

        {refinementActive && (
          <button
            onClick={resetRefinements}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 underline-offset-4 transition-colors duration-500 hover:text-accent/85 hover:underline"
          >
            Reset refinements
          </button>
        )}
        </div>
      </div>

      {/* Glossary link + view toggle — gallery for browsing, table for comparison */}
      <div className="not-prose mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/evidence-standards"
          className="inline-flex min-h-6 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45 transition-colors duration-500 hover:text-accent/85"
        >
          What do these labels mean? <span aria-hidden>→</span>
        </Link>
        <div
          role="group"
          aria-label="Catalogue view — click to switch between a visual gallery and a sortable table"
          className="inline-flex items-center overflow-hidden rounded-sm border border-foreground/20 bg-[oklch(0.07_0.006_245)] pl-4"
        >
          <span className="pointer-events-none font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/45">
            View
          </span>
          <span className="mx-3 h-3 w-px bg-foreground/[0.14]" />
          <button
            onClick={() => setView("gallery")}
            aria-pressed={view === "gallery"}
            title="Browse as a visual gallery of cards"
            className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-300 ${
              view === "gallery"
                ? "bg-accent/[0.1] text-accent/90"
                : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground/85"
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            title="Switch to a sortable side-by-side comparison table"
            className={`border-l border-foreground/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-300 ${
              view === "table"
                ? "bg-accent/[0.1] text-accent/90"
                : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground/85"
            }`}
          >
            Compare Table
          </button>
        </div>
      </div>

      {/* Stage-grouped catalogue — hierarchical, hero + supporting */}
      {visible.length === 0 ? (
        <div className="not-prose mt-12 flex flex-col items-center gap-4 rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)] px-6 py-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/50">
            No programs match this combination
          </p>
          <button
            onClick={resetRefinements}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/75 underline-offset-4 hover:underline"
          >
            Reset refinements
          </button>
        </div>
      ) : view === "table" ? (
        <InnovationsTable
          items={sortedVisible}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={toggleSort}
          onOpen={openProduct}
        />
      ) : (
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                  {rest.map((it) => (
                    <CompactCard key={it.title} item={it} onOpen={() => openProduct(it)} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
      )}

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
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
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
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/50">
                  {s.k}
                </span>
                <span className="font-display text-3xl md:text-4xl tracking-[-0.03em] text-foreground/95">
                  {s.v}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                  {s.note}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Granted patents — verified per-patent detail, disclosed on demand */}
          <div className="mt-9 border-t border-foreground/[0.06] pt-7">
            <button
              onClick={() => setShowPatents((v) => !v)}
              aria-expanded={showPatents}
              className="inline-flex min-h-6 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55 transition-colors duration-500 hover:text-accent/85"
            >
              <span>{showPatents ? "Hide" : "Show"} granted patents</span>
              <span
                aria-hidden
                className={`transition-transform duration-300 ${showPatents ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {showPatents && (
              <div className="mt-6 space-y-6">
                {grantedPatents.map((p) => (
                  <div key={p.number} className="border-t border-foreground/[0.06] pt-6 first:border-t-0 first:pt-0">
                    <p className="font-display text-base md:text-lg text-foreground/95">{p.title}</p>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">
                      {p.jurisdiction ? `${p.jurisdiction} Patent · ` : ""}No. {p.number} · Issued {p.issued}
                    </p>
                  </div>
                ))}
                <p className="pt-1 text-[12.5px] leading-relaxed text-foreground/50">
                  Foundational process patents underlying the graphene production platform — not tied to a single catalogued product. Full records available via Engage.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ── Page-ending CTA ── */}
      <div className="not-prose mt-24 mb-4 flex flex-col items-center gap-10 border-t border-foreground/[0.06] pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/40">Continue</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <Link
            to="/engage"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[oklch(0.07_0.005_245)] border border-foreground/[0.10] rounded-sm transition-all duration-700 hover:border-foreground/25 hover:bg-[oklch(0.09_0.005_245)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
              style={{ background: "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--foreground) 3%, transparent) 0%, transparent 55%)" }}
            />
            <span className="relative font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/75 group-hover:text-foreground/90 transition-colors duration-700">
              Discuss an Industrial Application
            </span>
            <span className="relative font-mono text-[10px] text-foreground/40 group-hover:text-foreground/60 transition-colors duration-700">→</span>
          </Link>
          <Link
            to="/ventures"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 border border-transparent rounded-sm transition-all duration-700 hover:border-foreground/[0.08] hover:bg-[oklch(0.06_0.004_245)]/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/50 group-hover:text-foreground/75 transition-colors duration-700">
              Explore the Ventures
            </span>
            <span className="font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-700">→</span>
          </Link>
        </motion.div>
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
        <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/85">
          Archive entry
        </span>
      </div>
      <div className="absolute right-4 top-4 z-10 hidden md:flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[oklch(0.06_0.008_245/0.62)] px-2.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-accent/75" />
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
          Studio still
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7 md:pr-[5.5rem]">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
          {item.domain}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-foreground/98 md:text-3xl">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <span className="h-px w-5 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">
            {item.metric}
          </span>
        </div>
        <div className="mt-2.5">
          <EvidenceBadge stage={item.stage} label={item.status} />
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
      /* aspect-[3/2] on mobile keeps a full-width card from becoming very tall
         now that these stack in a single column; 4/3 returns from sm up where
         two or three sit side by side. */
      className="group relative aspect-[3/2] sm:aspect-[4/3] cursor-pointer overflow-hidden rounded-sm border border-foreground/[0.07] bg-[oklch(0.05_0.006_245)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70"
    >
      {/* -translate-y on mobile lifts the product clear of the caption block.
          In a single-column card the product sits dead-centre and used to
          overlap the domain and metric lines; from sm up the cards are
          narrower and the default centring is correct again. */}
      <Tilt3DSurface
        src={item.cutout}
        alt={`${item.title} — ${item.body}`}
        imgClassName="-translate-y-[11%] sm:translate-y-0 opacity-[0.98] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100"
        imgStyle={{ filter: "drop-shadow(0 22px 34px oklch(0 0 0 / 0.72)) drop-shadow(0 10px 18px oklch(0 0 0 / 0.34))" }}
      />
      {/* Reading scrim. Ramps to near-opaque higher up the card (~55% rather
          than ~84%) so the product still reads as a lit object in the upper
          two-thirds while the caption block below always sits on a solid
          base — previously the centred product bled through the domain and
          metric lines and both fought each other. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.10) 0%, transparent 28%, oklch(0.02 0.006 245 / 0.55) 55%, oklch(0.015 0.006 245 / 0.93) 76%, oklch(0.012 0.006 245 / 0.98) 100%)",
        }}
      />
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
        <span className="h-px w-5 bg-accent/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/75">
          Still
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 md:p-4">
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          {item.domain}
        </p>
        <h3 className="mt-1 font-display text-base leading-tight tracking-[-0.01em] text-foreground/95 md:text-lg">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
          {item.metric}
        </p>
        <div className="mt-1.5">
          <EvidenceBadge
            stage={item.stage}
            label={item.status}
            className="whitespace-nowrap text-[10px] px-1.5 py-0.5"
          />
        </div>
      </div>
    </motion.article>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th scope="col" className="whitespace-nowrap px-4 py-3 text-left md:px-5">
      <button
        onClick={onClick}
        aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
        className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-500 ${
          active ? "text-accent/85" : "text-foreground/45 hover:text-foreground/70"
        }`}
      >
        {label}
        <span aria-hidden className={`transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
          {dir === "asc" ? "↑" : "↓"}
        </span>
      </button>
    </th>
  );
}

/**
 * Comparison table — an alternative to the gallery cards for scanning the
 * full filtered catalogue at once (e.g. "which items are Commercial in
 * Water") rather than opening cards one at a time. Wrapped in its own
 * horizontal scroll container so a wide table never forces the page itself
 * to scroll sideways on mobile.
 */
function InnovationsTable({
  items,
  sortKey,
  sortDir,
  onSort,
  onOpen,
}: {
  items: Item[];
  sortKey: SortableKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortableKey) => void;
  onOpen: (item: Item) => void;
}) {
  return (
    <div className="not-prose mt-12 overflow-hidden rounded-sm border border-foreground/[0.08]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]">
              <SortHeader label="Technology" active={sortKey === "title"} dir={sortDir} onClick={() => onSort("title")} />
              <SortHeader label="Domain" active={sortKey === "domain"} dir={sortDir} onClick={() => onSort("domain")} />
              <SortHeader label="Stage" active={sortKey === "stage"} dir={sortDir} onClick={() => onSort("stage")} />
              <SortHeader label="Metric" active={sortKey === "metric"} dir={sortDir} onClick={() => onSort("metric")} />
              <SortHeader label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => onSort("status")} />
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr
                key={it.title}
                role="button"
                tabIndex={0}
                onClick={() => onOpen(it)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(it);
                  }
                }}
                aria-label={`Open product inspection for ${it.title}`}
                className={`cursor-pointer transition-colors duration-300 hover:bg-foreground/[0.03] focus:outline-none focus-visible:bg-foreground/[0.04] ${
                  i !== items.length - 1 ? "border-b border-foreground/[0.06]" : ""
                }`}
              >
                <td className="whitespace-nowrap px-4 py-4 md:px-5">
                  <span className="font-display text-[15px] tracking-[-0.01em] text-foreground/95">{it.title}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60 md:px-5">
                  {it.domain}
                </td>
                <td className="whitespace-nowrap px-4 py-4 md:px-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/70">{it.stage}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/60 md:px-5">
                  {it.metric}
                </td>
                <td className="whitespace-nowrap px-4 py-4 md:px-5">
                  <EvidenceBadge stage={it.stage} label={it.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

