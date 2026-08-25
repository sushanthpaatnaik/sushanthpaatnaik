import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import CinematicPageShell from "@/components/scene/CinematicPageShell";
import FounderPortrait from "@/components/scene/FounderPortrait";
import LatticeField from "@/components/scene/LatticeField";
import { Tilt3DSurface, Product3DModal, type Product3DModalData } from "@/components/scene/Product3DView";
import { EvidenceBadge } from "@/components/scene/cinematic";
import { type Stage, stageMeta } from "@/lib/evidenceStandards";
import { breadcrumbSchema, ldJsonScript, webPageSchema, SITE_URL } from "@/lib/seo";
import { track } from "@/lib/analytics";
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
import imgVitraphene from "@/assets/innovations/vitraphene.webp";
import imgVoltaphene from "@/assets/innovations/voltaphene.webp";

// Transparent product cut-outs — identity-preserved studio product staging
import cutGraphacrete from "@/assets/innovations/cutouts/graphacrete.webp";
import cutThermalPaste from "@/assets/innovations/cutouts/thermal-paste.webp";
import cutGrapheneFabric from "@/assets/innovations/cutouts/graphene-fabric.webp";
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
import cutVitraphene from "@/assets/innovations/cutouts/vitraphene.webp";
import cutVoltaphene from "@/assets/innovations/cutouts/voltaphene.webp";

// Application / use-case imagery — shown as the secondary still in the
// inspection modal. Each one depicts the product's real-world context.
import appGraphacrete from "@/assets/innovations/applications/graphacrete.webp";
import sceneGraphacrete from "@/assets/innovations/scenes/graphacrete.webp";
import sceneGraffisol from "@/assets/innovations/scenes/graffisol.webp";
import sceneCeraphene from "@/assets/innovations/scenes/ceraphene.webp";
import sceneHdgpe from "@/assets/innovations/scenes/hdgpe.webp";
import sceneGraphenodes from "@/assets/innovations/scenes/graphenodes.webp";
import sceneThermene from "@/assets/innovations/scenes/thermal-paste.webp";
import sceneTexaphene from "@/assets/innovations/scenes/graphene-fabric.webp";
import sceneIgnitronD from "@/assets/innovations/scenes/ignitron-d.webp";
import sceneCoalorix from "@/assets/innovations/scenes/coalorix.webp";
import sceneAquamax from "@/assets/innovations/scenes/aquamax.webp";
import sceneIgnitronP from "@/assets/innovations/scenes/ignitron-p.webp";
import sceneLubritron from "@/assets/innovations/scenes/lubritron.webp";
import sceneRustene from "@/assets/innovations/scenes/rustene.webp";
import sceneGryogen from "@/assets/innovations/scenes/gryogen.webp";
import sceneMariphene from "@/assets/innovations/scenes/mariphene.webp";
import sceneAerophenter from "@/assets/innovations/scenes/aerophenter.webp";
import sceneVitraphene from "@/assets/innovations/scenes/vitraphene.webp";
import sceneVoltaphene from "@/assets/innovations/scenes/voltaphene.webp";
import sceneArmophene from "@/assets/innovations/scenes/armophene.webp";
import sceneHydrocell from "@/assets/innovations/scenes/hydrocell.webp";
import sceneGraphyre from "@/assets/innovations/scenes/graphyre.webp";
import sceneGraphosite from "@/assets/innovations/scenes/graphosite.webp";
import sceneThermaphene from "@/assets/innovations/scenes/thermaphene.webp";
import scenePyronex from "@/assets/innovations/scenes/pyronex.webp";
import appThermalPaste from "@/assets/innovations/applications/thermal-paste.webp";
import appGrapheneFabric from "@/assets/innovations/applications/graphene-fabric.webp";
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
import sceneBitumax from "@/assets/innovations/scenes/bitumax.webp";
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
import appVitraphene from "@/assets/innovations/applications/vitraphene.webp";
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
  /** Field-context frame for the application slot. Omit when none exists —
      the panel then states the documentation is pending rather than
      re-showing the studio photograph under an "Application" label. */
  application?: string;
  /** A finished photograph of the artifact already standing in its own
      environment, used as the catalogue card in place of the cut-out stage.
      Only for products actually shot that way — a cut-out composited onto a
      backdrop is the stage treatment and belongs in `cutout`, not here. The
      panel is unaffected: it keeps the studio artifact frame and, where one
      exists, the application film. */
  scene?: string;
  /** How the scene photograph meets its frame. "contain" (the default) is for
      a source taller than the frame — it is shown whole over a blurred copy of
      itself, because cropping would cut the artifact. "cover" is for a source
      already close to the frame's own aspect, where filling it edge to edge
      costs nothing: a 4:3 scene loses 8% top and bottom in the 16/10 hero and
      nothing at all in the 4/3 card. */
  sceneFit?: "cover" | "contain";
  domain: string;
  status: string;
  featured?: boolean;
  specs?: Spec[];
  positioning?: string;
  applicationContext?: string[];
};

const items: Item[] = [
  { title: "Graphacrete", stage: "Commercial", domain: "Construction · Cement", status: "Patent · Field-deployed", metric: "49.5 MPa · −40 kg/m³ cement", body: "Graphene nano-platelet admixture transforming standard concrete into a high-performance material.", img: imgGraphacrete, cutout: cutGraphacrete, application: appGraphacrete, scene: sceneGraphacrete, sceneFit: "cover", featured: true },
  { title: "Graffisol", stage: "Commercial", domain: "Solar · Coatings", status: "Patent · Field-deployed", metric: "+10–12% annual yield", body: "Solar coating delivering higher annual yield, panel cooling and superhydrophobic self-cleaning.", img: imgGraffisol, cutout: cutGraffisol, application: appGraffisol, scene: sceneGraffisol, sceneFit: "cover", featured: true },
  { title: "Ceraphene", stage: "Commercial", domain: "Ceramics · Coatings", status: "Patent · Retail", metric: "9H+ · ₹5,000", body: "Graphene-enhanced ceramic coating with 9H+ hardness at one-third the price of premium options.", img: imgCeraphene, cutout: cutCeraphene, application: appCeraphene, scene: sceneCeraphene, sceneFit: "cover" },
  { title: "HD-G-PE", stage: "Commercial", domain: "Polymers · Masterbatch", status: "Patent · Industrial", metric: "+30% tensile · 100× barrier", body: "Graphene masterbatch — drop-in dosage for stronger, longer-lasting polymers.", img: imgHdgpe, cutout: cutHdgpe, application: appHdgpe, scene: sceneHdgpe, sceneFit: "cover" },
  { title: "Graphenodes", stage: "Commercial", domain: "Energy Storage · Electrodes", status: "Patent · Cell trials", metric: "Higher density · longer cycles", body: "Next-gen graphene polymer cathode and anode materials for high-density batteries.", img: imgGraphenodes, cutout: cutGraphenodes, application: appGraphenodes, scene: sceneGraphenodes, sceneFit: "cover" },
  /* Both co-developed with Monoatom Labs, and the only two programmes here that
     arrived with a single photograph instead of three. An earlier pass filled
     their application slot by re-cropping and regrading that one bench macro,
     so the panel showed the product photograph twice, the second time
     mislabelled "Application". Both fakes were deleted and the slot left empty
     rather than papered over.

     Both now have a real field frame — Thermene's compound spread on a cold
     plate as it is seated onto a power-module assembly, Texaphene's treated
     cloth running the rollers on a textile finishing line — so the slot is back
     on each. (Thermene, not Thermaphene: the names were swapped after this
     comment was first written, and Thermaphene is now the R&D smart textile
     further down.) If a future entry arrives without one, leave `application` off and
     let the panel drop the frame. Do not reach for `img`: that is what produced
     the duplicate. */
  { title: "Thermene", stage: "Commercial", domain: "Thermal · Interfaces", status: "Co-developed · Monoatom", metric: "Copper-class conductivity", body: "Graphene-loaded thermal interface compound. Pulls heat out of the contact area and spreads it laterally rather than letting it pool, at a bond line thin enough to keep interface resistance low — so an aluminium heat sink carries a duty specified for copper.", img: imgThermalPaste, cutout: cutThermalPaste, application: appThermalPaste, scene: sceneThermene, sceneFit: "cover" },
  { title: "Texaphene", stage: "Commercial", domain: "Textiles · Functional", status: "Co-developed · Monoatom", metric: "Function survives the wash", body: "Graphene-infused technical cotton. Graphene oxide and reduced graphene oxide are bonded directly into 100% cotton, so antimicrobial, anti-odour, antistatic and ESD protection are built into the cloth rather than coated onto it.", img: imgGrapheneFabric, cutout: cutGrapheneFabric, application: appGrapheneFabric, scene: sceneTexaphene, sceneFit: "cover" },
  { title: "Ignitron D", stage: "Commercial", domain: "Mobility · Combustion", status: "Patent · Fleet trial", metric: "25% optimized diesel efficiency", body: "Graphene-enhanced diesel combustion optimization technology for industrial fleets, logistics systems, and heavy-duty engines.", img: imgIgnitronD, cutout: cutIgnitronD, application: appIgnitronD, scene: sceneIgnitronD, sceneFit: "cover", specs: [
    { k: "Fuel Savings", v: "25%", note: "Optimized diesel efficiency" },
    { k: "Emissions", v: "20%", note: "Reduced emissions output" },
    { k: "Dose", v: "0.05%", note: "Optimized additive integration" },
  ], positioning: "Graphene-enhanced diesel combustion optimization technology for industrial fleets, logistics systems, and heavy-duty engines.", applicationContext: ["Heavy commercial vehicles", "Logistics infrastructure", "Mining / fleet systems", "Industrial diesel engines"] },
  { title: "Coalorix", stage: "Pilot", domain: "Thermal Power · Combustion", status: "Plant pilot", metric: "15% optimized coal utilization", body: "Nano-engineered coal combustion optimization technology for thermal plants, industrial furnaces, and energy infrastructure.", img: imgCoalorix, cutout: cutCoalorix, application: appCoalorix, scene: sceneCoalorix, sceneFit: "cover", featured: true, specs: [
    { k: "Coal Savings", v: "15%", note: "Optimized coal utilization" },
    { k: "Emissions", v: "35%", note: "Reduced emissions output" },
    { k: "Dose", v: "0.01%", note: "Combustion optimization integration" },
  ], positioning: "Nano-engineered coal combustion optimization technology for thermal plants, industrial furnaces, and energy infrastructure.", applicationContext: ["Thermal power plants", "Industrial combustion systems", "Boiler / furnace optimization", "Energy-efficiency infrastructure"] },
  { title: "Aquamax", stage: "Pilot", domain: "Water · Recovery", status: "World-first system", metric: "95%+ recovery · 12–24 mo ROI", body: "World-first hybrid HAMR + HGMC system recovering 95%+ of cooling tower plume water.", img: imgAquamax, cutout: cutAquamax, application: appAquamax, scene: sceneAquamax, sceneFit: "cover", featured: true },
  { title: "Ignitron P", stage: "Pilot", domain: "Mobility · Combustion", status: "Field pilot", metric: "15% combustion efficiency improvement", body: "Advanced petrol-engine fuel optimization technology engineered for cleaner ignition and enhanced combustion stability.", img: imgIgnitronP, cutout: cutIgnitronP, application: appIgnitronP, scene: sceneIgnitronP, sceneFit: "cover", specs: [
    { k: "Fuel Savings", v: "15%", note: "Combustion efficiency improvement" },
    { k: "Emissions", v: "10%", note: "Reduced emissions output" },
    { k: "Dose", v: "0.2%", note: "Optimized additive integration" },
  ], positioning: "Advanced petrol-engine fuel optimization technology engineered for cleaner ignition and enhanced combustion stability.", applicationContext: ["Automotive systems", "Petrol-engine optimization", "Mobility platforms", "Fuel-performance enhancement"] },
  { title: "Lubritron", stage: "Pilot", domain: "Tribology · Lubricants", status: "Industrial pilot", metric: "6% fuel savings · 40% wear reduction", body: "Nano-enabled molecular engine oil additive for all engine types — improving fuel efficiency, reducing engine wear, and extending oil life.", img: imgLubritron, cutout: cutLubritron, application: appLubritron, scene: sceneLubritron, sceneFit: "cover", specs: [
    { k: "Fuel Savings", v: "Up to 6%", note: "Optimized fuel efficiency" },
    { k: "Wear Reduction", v: "Up to 40%", note: "Engine friction reduction" },
    { k: "Oil Life", v: "Up to 50%", note: "Extended drain interval" },
    { k: "Dose", v: "0.2%", note: "Optimized lubricant additive integration" },
  ], positioning: "Molecular engine oil additive for all engine types, designed to improve fuel efficiency, reduce engine wear, and extend oil life.", applicationContext: ["All engine types", "Petrol engines", "Diesel engines", "Two-stroke engines"] },
  { title: "Rustene", stage: "Pilot", domain: "Coatings · Corrosion", status: "Industrial pilot", metric: "Multi-year corrosion shield", body: "Graphene-based anti-corrosion shield for steel, marine and industrial assets.", img: imgRustene, cutout: cutRustene, application: appRustene, scene: sceneRustene, sceneFit: "cover" },
  { title: "Gryogen", stage: "Pilot", domain: "Hydrogen · Membranes", status: "Membrane trial", metric: "Selective H₂ separation", body: "Graphene-based hydrogen selection membrane for clean fuel production.", img: imgGryogen, cutout: cutGryogen, application: appGryogen, scene: sceneGryogen, sceneFit: "cover" },
  { title: "Mariphene", stage: "Pilot", domain: "Water · Desalination", status: "Membrane trial", metric: "Low-energy desalination", body: "Graphene desalination membrane for high-throughput, low-energy water production.", img: imgMariphene, cutout: cutMariphene, application: appMariphene, scene: sceneMariphene, sceneFit: "cover" },
  { title: "Aerophenter", stage: "Pilot", domain: "Atmospheric Water", status: "Prototype field-trial", metric: "Water from air", body: "Atmospheric water harvesting using graphene-engineered surfaces.", img: imgAerophenter, cutout: cutAerophenter, application: appAerophenter, scene: sceneAerophenter, sceneFit: "cover" },
  { title: "Vitraphene", stage: "Pilot", domain: "Composites · Fibres", status: "Composite pilot", metric: "Stronger glass fibres", body: "Reinforced graphene glass fibres for stronger composites and structures.", img: imgVitraphene, cutout: cutVitraphene, application: appVitraphene, scene: sceneVitraphene, sceneFit: "cover" },
  { title: "Voltaphene", stage: "Commercial", domain: "Grid Storage", status: "Commercial stage", metric: "Grid-scale storage", body: "Graphene-enabled energy storage systems for grid and mobility applications.", img: imgVoltaphene, cutout: cutVoltaphene, application: appVoltaphene, scene: sceneVoltaphene, sceneFit: "cover" },
  { title: "Armophene", stage: "R&D", domain: "Defence · Ballistics", status: "R&D · Bench", metric: "Lighter than steel armour", body: "Next-generation graphene ballistics — lighter, stronger personal and vehicle armour.", img: imgArmophene, cutout: cutArmophene, application: appArmophene, scene: sceneArmophene, sceneFit: "cover", featured: true },
  { title: "Hydrocell", stage: "R&D", domain: "Hydrogen · Fuel Cell", status: "R&D · Bench", metric: "Zero-emission · high power density", body: "Graphene-enhanced hydrogen fuel cell stack for clean mobility and stationary power.", img: imgHydrocell, cutout: cutHydrocell, application: appHydrocell, scene: sceneHydrocell, sceneFit: "cover", featured: true },
  { title: "Bitumax", stage: "Pilot", domain: "Infrastructure · Bitumen", status: "Pilot stage", metric: "1.5–2× pavement life", body: "Bitumen additive extending pavement life with major fatigue reduction.", img: imgBitumax, cutout: cutBitumax, application: appBitumax, scene: sceneBitumax },
  { title: "Pyronex", stage: "Pilot", domain: "Coatings · Multifunctional", status: "Pilot stage", metric: "Fire · Heat · UV · Microbe shield", body: "Multi-functional paint additive — fire retardant, thermal barrier, UV insulation, anti-algae and anti-microbial in one coat.", img: imgPyronex, cutout: cutPyronex, application: appPyronex, scene: scenePyronex, sceneFit: "cover" },
  { title: "Graphyre", stage: "R&D", domain: "Mobility · Tyres", status: "R&D · Compound", metric: "Longer life · better grip", body: "Reinforced performance tyres with graphene for grip, mileage and rolling efficiency.", img: imgGraphyre, cutout: cutGraphyre, application: appGraphyre, scene: sceneGraphyre, sceneFit: "cover" },
  { title: "Graphosite", stage: "R&D", domain: "Composites · Structural", status: "R&D · Bench", metric: "Ultra-light · ultra-strong", body: "Structural graphene composites for ultra-light, ultra-strong applications.", img: imgGraphosite, cutout: cutGraphosite, application: appGraphosite, scene: sceneGraphosite, sceneFit: "cover" },
  { title: "Thermaphene", stage: "R&D", domain: "Smart Textiles", status: "R&D · Bench", metric: "Active thermal regulation", body: "Smart thermal fabrics that regulate body temperature using graphene.", img: imgThermaphene, cutout: cutThermaphene, application: appThermaphene, scene: sceneThermaphene, sceneFit: "cover" },
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

  /**
   * `innovation_filter` from one effect rather than a handler on each control.
   * Stage, domain, patent-only and featured-only all narrow the same list, and
   * `resetRefinements` clears three of them in one click — wiring each control
   * would mean five call sites that a sixth filter would silently miss, and it
   * would report a stale count because the state has not committed yet. Same
   * reasoning as the delegated /engage listener.
   *
   * The ref skips the mount pass: without it every page load reports a filter
   * change that nobody made.
   */
  const filtersReady = useRef(false);
  useEffect(() => {
    if (!filtersReady.current) {
      filtersReady.current = true;
      return;
    }
    track("innovation_filter", {
      stage: filter,
      domain: domainFilter,
      patent_only: patentOnly,
      featured_only: featuredOnly,
      results: visible.length,
    });
  }, [filter, domainFilter, patentOnly, featuredOnly, visible.length]);
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
    track("innovation_open", { product: it.title, stage: it.stage, domain: it.domain });
    const largeFrameTitles = new Set([
      "Graphacrete",
      "Graffisol",
      "Ceraphene",
      "Ignitron D",
      "Lubritron",
      // Added with its film. The secondary slot is aspect-1.15/1, so a 16:9
      // video there loses about a third of its width to object-cover; the hero
      // is 16/10 and shows it nearly whole.
      "Coalorix",
      "Pyronex",
      "Bitumax",
    ]);
    /**
     * Verified company product pages. Built by rendering every candidate url
     * rather than trusting a status code: both sites are hash-routed SPAs that
     * return the same HTML for any path, so a 200 proves nothing and a mistyped
     * slug would silently show the homepage. Monoatom's eight are dedicated
     * pages with their own H1; Grafillium's seven open the named product panel,
     * confirmed by its breadcrumb reading GRAFILLIUM / PRODUCTS / <NAME>.
     *
     * Ten products are deliberately absent — Graphenodes, Thermene, Texaphene,
     * Rustene, Gryogen, Mariphene, Aerophenter, Vitraphene, Voltaphene and
     * Hydrocell have no product page on any company site. Do not point them at
     * a company homepage to fill the gap: the panel falls back to /engage,
     * which is an honest destination, and /ventures already links the homepages.
     */
    const productUrls: Record<string, string> = {
      Graphacrete: "https://monoatomlabs.com/#/products/graphacrete",
      Graffisol: "https://monoatomlabs.com/#/products/graffisol",
      Ceraphene: "https://monoatomlabs.com/#/products/ceraphene",
      "HD-G-PE": "https://monoatomlabs.com/#/products/hd-g-pe",
      Graphyre: "https://monoatomlabs.com/#/products/pipeline/graphyre",
      Graphosite: "https://monoatomlabs.com/#/products/pipeline/graphosite",
      Thermaphene: "https://monoatomlabs.com/#/products/pipeline/thermaphene",
      Armophene: "https://monoatomlabs.com/#/products/pipeline/armophene",
      "Ignitron D": "https://grafillium.com/#/products/ignitron-d",
      "Ignitron P": "https://grafillium.com/#/products/ignitron-p",
      Lubritron: "https://grafillium.com/#/products/lubritron",
      Coalorix: "https://grafillium.com/#/products/coalorix",
      Bitumax: "https://grafillium.com/#/products/bitumax",
      Aquamax: "https://grafillium.com/#/products/aquamax",
      Pyronex: "https://grafillium.com/#/products/pyronex",
    };
    const productFilms: Record<string, string> = {
      "Ignitron D": "/videos/ignitron-d-film.mp4",
    };
    const productFilmNotes: Record<string, string> = {
      "Ignitron D":
        "Where the energy in diesel combustion is lost, and the point in the burn at which the catalyst acts. Narrated, with on-screen captions.",
    };
    const captions: Record<string, string> = {
      Graphacrete: "Infrastructure · Concrete deployment",
      Graffisol: "Solar array · Coating application",
      Ceraphene: "Automotive surface · Hydrophobic ceramic",
      "Ignitron D": "Diesel fleet · Combustion systems",
      Lubritron: "Engine internals · Friction-reduction",
      Coalorix: "Thermal plant · Boiler combustion",
      Pyronex: "Timber siding · Direct flame test",
      Bitumax: "Bitumen binder · Drop-in dosing",
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
        // Ignitron D and Lubritron are already in largeFrameTitles, so these
        // videos take the hero slot and the studio still drops below, same as
        // the other three. Unlike the application stills, both are genuine
        // first-party product footage rather than illustrative renders.
        "Ignitron D": "/videos/ignitron-d.mp4",
        Lubritron: "/videos/lubritron.mp4",
        Coalorix: "/videos/coalorix.mp4",
        Pyronex: "/videos/pyronex.mp4",
        Bitumax: "/videos/bitumax.mp4",
      } as Record<string, string>)[it.title],
      stage: it.stage,
      specs: it.specs,
      positioning: it.positioning,
      applicationContext: it.applicationContext,
      largeApplicationFrame: largeFrameTitles.has(it.title),
      applicationCaption: captions[it.title],
      // Vertical narrated explainer, in its own slot below the application
      // row. It does not replace the landscape film above it — the two are
      // different assets: 1440x810 deployment footage against a 480x854
      // captioned product film.
      productUrl: productUrls[it.title],
      productFilm: productFilms[it.title],
      productFilmNote: productFilmNotes[it.title],
      aquamaxSimulation: it.title === "Aquamax",
    });
  };

  const grouped = useMemo(() => {
    const stages: Stage[] = ["Commercial", "Pilot", "R&D"];
    return stages
      .map((s) => ({ stage: s, list: visible.filter((it) => it.stage === s) }))
      .filter((g) => g.list.length > 0);
  }, [visible]);

  // The title spells the count out rather than deriving it from items.length,
  // so it has to be updated by hand when the catalogue changes. It read
  // twenty-three against a catalogue of 25, while the eyebrow beside it —
  // which is derived — read "25 of 25".
  return (
    <CinematicPageShell
      eyebrow={`Innovations · Catalogue · ${items.length} of ${items.length}`}
      title={<>One material platform.<br className="hidden md:inline" /> Twenty-five industrial expressions.</>}
      lead="A curated R&D archive of advanced materials engineering — graphene calibrated for concrete, solar, batteries, ceramics, polymers, water, hydrogen, mobility, storage and armour, traced from bench formulation through plant pilot to field deployment."
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
      <div className="not-prose relative mt-12 overflow-hidden rounded-sm border border-foreground/[0.06] bg-[var(--surface-plate)]">
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
                {/* div, not span. Flex blockifies these so the layout is
                    identical, but as spans the three lines extracted with no
                    word boundaries: "Atomic Layers1Monolayer carbon",
                    "Programs of Record25Catalogued formulations". */}
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/50">
                  {s.k}
                </div>
                <div className="font-display text-3xl md:text-4xl tracking-[-0.03em] text-foreground/95">
                  {s.v}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                  {s.note}
                </div>
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
        <div className="grid grid-cols-2 sm:flex sm:divide-x sm:divide-foreground/[0.08] overflow-hidden rounded-sm border border-foreground/[0.08] bg-[var(--surface-plate)]">
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
                </span>{" "}
                {/* `block` stacks these three on screen; the spaces are what
                    keep them apart for anything reading the text stream, which
                    otherwise gets "All StagesAll25 · Programs". */}
                <span className={`mt-2 block font-display text-[15px] tracking-[-0.01em] transition-colors duration-500 ${isActive ? "text-foreground/95" : "text-foreground/70"}`}>
                  {f}
                </span>{" "}
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
        <label className="group relative inline-flex cursor-pointer items-center gap-2.5 rounded-sm border border-foreground/20 bg-[var(--surface-raised)] py-2.5 pl-4 pr-9 shadow-[0_1px_0_0_oklch(1_0_0/0.03)] transition-colors duration-300 hover:border-accent/50 focus-within:border-accent/60">
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
              : "border-foreground/20 bg-[var(--surface-raised)] text-foreground/70 hover:border-accent/40 hover:text-foreground/90"
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
              : "border-foreground/20 bg-[var(--surface-raised)] text-foreground/70 hover:border-accent/40 hover:text-foreground/90"
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
          className="inline-flex items-center overflow-hidden rounded-sm border border-foreground/20 bg-[var(--surface-raised)] pl-4"
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
        <div className="not-prose mt-12 flex flex-col items-center gap-4 rounded-sm border border-foreground/[0.08] bg-[var(--surface-plate)] px-6 py-16 text-center">
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
      <div className="not-prose relative mt-24 overflow-hidden rounded-sm border border-foreground/[0.06] bg-[var(--surface-plate)]">
        <LatticeField intensity={0.04} />
        <div className="relative z-10 px-6 py-9 md:px-9 md:py-12">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/55">
              Patent · IP Register
            </span>{" "}
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
                {/* div, not span. Flex blockifies these so the layout is
                    identical, but as spans the three lines extracted with no
                    word boundaries: "Atomic Layers1Monolayer carbon",
                    "Programs of Record25Catalogued formulations". */}
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/50">
                  {s.k}
                </div>
                <div className="font-display text-3xl md:text-4xl tracking-[-0.03em] text-foreground/95">
                  {s.v}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                  {s.note}
                </div>
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
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[var(--surface-raised)] border border-foreground/[0.10] rounded-sm transition-all duration-700 hover:border-foreground/25 hover:bg-[var(--surface-high)]"
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
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 border border-transparent rounded-sm transition-all duration-700 hover:border-foreground/[0.08] hover:bg-[var(--surface-level)]/60"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/50 group-hover:text-foreground/75 transition-colors duration-700">
              Explore the Ventures
            </span>
            <span className="font-mono text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-700">→</span>
          </Link>
        </motion.div>
      </div>

      {/* Escape, the backdrop and the close button all funnel through this one
          handler, so tracking here covers every way out of the panel. */}
      <Product3DModal
        item={active}
        onClose={() => {
          if (active) track("innovation_close", { product: active.title });
          setActive(null);
        }}
      />
    </CinematicPageShell>

  );
}

function HeroCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  /* A scene hero stacks, exactly like CompactCard: media on top, copy below on
     the card's own plate. It does NOT print the copy over the photograph the
     way a cut-out hero does, and the reason is geometric rather than stylistic.
     Cover fits a 4:3 scene into this 16/10 frame by cropping vertically only —
     there is no horizontal slack — so the artifact stays wherever the
     photograph put it, and across the supplied set that is 43-56% of the
     width: precisely where the copy column ends. Copy and subject then contend
     for the same band and no amount of scrim tuning settles it. Darkening the
     ground far enough to carry a title is darkening it far enough to swallow
     the bottle, which is what happened. Stacked, the whole frame is visible,
     the copy is on plate, and the hero reads like a larger version of the
     cards around it instead of a different component. */
  if (item.scene) {
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
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border border-[var(--product-border)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70"
        style={{ background: "var(--product-plate)" }}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <SceneMedia item={item} position="inset-x-0 w-full" />
          {/* Chipped for the same reason as the label opposite: this sits on a
              photograph now, not on a cyclorama this component controls. */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[var(--surface-chip)] backdrop-blur-sm px-2.5 py-1.5">
            <span className="h-px w-6 bg-accent/70" />
            <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/85">
              Archive entry
            </span>
          </div>
          <div className="absolute right-4 top-4 z-10 hidden md:flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[var(--surface-chip)] px-2.5 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent/75" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
              Scene still
            </span>
          </div>
        </div>
        <div className="border-t border-[var(--product-border)] p-5 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
            {item.domain}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-foreground/98 md:text-3xl">
            {item.title}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
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
      className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-sm border border-[var(--product-border)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70"
      style={{ background: "var(--product-plate)" }}
    >
      <>
      <Tilt3DSurface
        src={item.cutout}
        alt={`${item.title} — ${item.body}`}
        hero
        tintHue={domainHue(item.domain)}
        bgSrc={item.application}
        bgExposure={CONTEXT_EXPOSURE[item.title]}
        contextual
        imgClassName="opacity-[0.98] transition-opacity duration-[1400ms] ease-out group-hover:opacity-100"
        imgStyle={{ filter: "var(--product-shadow-hero) var(--product-lift)" }}
      />
      <div
        aria-hidden
        className="absolute right-0 top-0 h-full w-[46%] opacity-45"
        style={{ background: "var(--product-sheen)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--product-scrim-ctx-hero)" }}
      />
      </>
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[var(--surface-chip)] backdrop-blur-sm px-2.5 py-1.5">
        <span className="h-px w-6 bg-accent/70" />
        <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-accent/85">
          Archive entry
        </span>
      </div>
      <div className="absolute right-4 top-4 z-10 hidden md:flex items-center gap-2 rounded-sm border border-foreground/[0.08] bg-[var(--surface-chip)] px-2.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-accent/75" />
        {/* A scene card is not a studio capture, and this site does not put a
            provenance label on an image that does not have it — the same rule
            that took "Field" off the application slot. "Scene still" is
            descriptive and claims neither a cyclorama nor a real deployment. */}
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
          Studio still
        </span>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7 md:pr-[5.5rem]"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/55">
          {item.domain}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-[1.1] tracking-[-0.02em] text-foreground/98 md:text-3xl">
          {item.title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
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

/**
 * Domain light — an oklch hue per sector, keyed off the domain's leading
 * segment so a new product inherits its family's light automatically and only
 * a genuinely new sector needs a line here. Hues are grouped, not unique per
 * product: the grid should read as a catalogue with sectors in it, not as 25
 * differently-coloured cards. Anything unmapped falls through to the neutral
 * stage, which is the current look.
 */
/**
 * Per-card exposure compensation for the contextual ground.
 *
 * The application photographs were never shot as a set: measured over their
 * own pixels their mean luminance runs 21 (Ignitron P) to 124 (Pyronex), a
 * six-fold spread. One global brightness filter cannot serve both ends — it
 * either blows the bright frames out or leaves the dark ones as a black
 * rectangle, which is the "some cards nearly white while others heavily grey"
 * failure. This multiplies the shared filter per product to bring every
 * ground to a common target of 48, clamped to 0.55-1.75 so no single frame is
 * pushed far enough to band or posterise. Anything already within 6% of
 * target is absent and simply inherits the shared filter.
 *
 * Scoped to the decorative background layer only: the same photographs are
 * shown at full strength in the inspection panel, where they are documentary
 * and must not be re-graded.
 */
const CONTEXT_EXPOSURE: Record<string, number> = {
  "Aerophenter": 0.49,
  "Aquamax": 1.17,
  "Armophene": 1.23,
  "Bitumax": 0.91,
  "Ceraphene": 1.17,
  "Coalorix": 1.23,
  "Graphenodes": 1.26,
  "Graphosite": 1.26,
  "Graphyre": 1.78,
  "HD-G-PE": 1.09,
  "Hydrocell": 1.55,
  "Ignitron P": 2.1,
  "Lubritron": 1.14,
  "Mariphene": 0.7,
  "Pyronex": 0.4,
  "Rustene": 1.17,
  "Thermaphene": 0.92,
  "Thermene": 0.75,
  "Vitraphene": 0.59,
  "Voltaphene": 0.77,
};

const DOMAIN_HUE: Record<string, number> = {
  Construction: 250,      // cool mineral — cement, aggregate
  Infrastructure: 250,
  Solar: 65,              // amber
  Ceramics: 70,           // warm stone
  Coatings: 70,
  Polymers: 300,
  "Energy Storage": 255,  // deep blue
  "Grid Storage": 255,
  Hydrogen: 220,          // cyan
  Thermal: 45,            // copper
  "Thermal Power": 45,
  Tribology: 45,
  Textiles: 85,           // warm sand
  "Smart Textiles": 85,
  Mobility: 235,          // steel
  Defence: 235,
  Water: 205,             // teal
  "Atmospheric Water": 205,
  Composites: 265,        // graphite
};

function domainHue(domain: string): number | undefined {
  return DOMAIN_HUE[domain.split("·")[0].trim()];
}

/**
 * A scene photograph as the media of a card — no cyclorama, floor or contact
 * shadow, all of which exist to seat a cut-out that has no ground of its own.
 * A "contain" scene rides over a blurred, scaled copy of the same file so a
 * source taller than its frame is shown whole; both layers carry loading="lazy"
 * explicitly, since they share a src and an eager backdrop would warm the cache
 * for the contained image and silently defeat its lazy attribute.
 */
function SceneMedia({ item, position = "" }: { item: Item; position?: string }) {
  const cover = item.sceneFit === "cover";
  return (
    <>
      {!cover && (
        <img
          src={item.scene}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover"
          style={{ filter: "var(--scene-backdrop-filter)" }}
        />
      )}
      <img
        src={item.scene}
        alt={`${item.title} — ${item.body}`}
        loading="lazy"
        decoding="async"
        className={`absolute inset-y-0 h-full transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03] ${
          cover ? "inset-x-0 w-full object-cover" : `object-contain ${position}`
        }`}
        style={{ filter: "var(--scene-img-filter)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "var(--scene-vignette)",
          opacity: "var(--scene-vignette-opacity)" as unknown as number,
        }}
      />
    </>
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
      /* Stacked geometry rather than an aspect-ratio box with the caption
         floated over it. The overlay version had to spend ~42% of the card
         on an opaque chip to keep the text legible, which is exactly the
         space the product itself needed — the tallest cutouts were sliced
         in half by it. Here the media keeps a full 4/3 frame to
         itself and the caption sits below it in normal flow, on the card's
         own plate, so the text needs no chip, no blur and no scrim to be
         legible whatever the product behind it is doing. */
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border border-[var(--product-border)] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70"
      style={{ background: "var(--product-plate)" }}
    >
      {/* 3/2 on mobile, 4/3 from sm up. In a single-column card the caption
          now adds its own height BELOW the media, so a 4/3 frame at 390 made
          each card ~292px of media plus caption — barely one and a half cards
          on screen across a 25-product catalogue. The shorter mobile frame
          buys that back without costing the product any room it needs. */}
      <div className="relative aspect-[3/2] w-full overflow-hidden sm:aspect-[4/3]">
      {/* No -translate-y / extra padding here any more: both existed purely
          to lift the product clear of the overlaid caption chip, and with the
          caption moved below there is nothing to dodge. The product gets the
          centre of its own frame back. */}
      {item.scene ? (
        /* Photographed as a finished scene, so it is shown as one: no
           cyclorama, no floor, no contact shadow — those exist to seat a
           cut-out that has no ground of its own, and this frame already has
           asphalt in it.

           The source is square and the frame is landscape, so object-cover
           would slice the subject: at 4/3 only 940 of 1254 source rows
           survive and the tube spans 1138 of them. It is contained instead,
           over a blurred, scaled copy of the same file that fills the frame
           edge to edge — the technique ArchiveMosaic uses for its
           `fit === "contain"` cards. Both layers carry `loading="lazy"`
           explicitly: they share a src, and an eager backdrop would warm the
           cache for the contained image and silently defeat its lazy
           attribute (see the /recognitions note). */
        <SceneMedia item={item} position="inset-x-0 w-full" />
      ) : (
      <Tilt3DSurface
        src={item.cutout}
        alt={`${item.title} — ${item.body}`}
        tintHue={domainHue(item.domain)}
        bgSrc={item.application}
        bgExposure={CONTEXT_EXPOSURE[item.title]}
        contextual
        imgClassName="opacity-[0.98] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100"
        imgStyle={{ filter: "var(--product-shadow) var(--product-lift)" }}
      />
      )}
        {/* The eyebrow sits directly on the media. That was fine over a
            cyclorama this component controlled; over a photograph it has no
            ground of its own and washes out on a bright frame. It takes the
            same chip as the label opposite it, so both read on any image. */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-sm border border-foreground/[0.08] bg-[var(--surface-chip)] backdrop-blur-sm px-2 py-1">
        <span className="h-px w-5 bg-accent/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/75">
          Still
        </span>
      </div>
      </div>

      {/* In flow, on the card's own plate — so it needs no chip, no blur and
          no scrim to be legible, whatever the photograph behind the media
          happens to be doing. */}
      <div className="border-t border-[var(--product-border)] p-3.5 md:p-4">
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
            <tr className="border-b border-foreground/[0.08] bg-[var(--surface-plate)]">
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

