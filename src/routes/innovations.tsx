import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import CinematicPageShell from "@/components/scene/CinematicPageShell";
import FounderPortrait from "@/components/scene/FounderPortrait";
import backdrop from "@/assets/story-03-material.jpg";

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
type Item = { title: string; stage: Stage; metric: string; body: string; img: string };

const items: Item[] = [
  { title: "Graphacrete", stage: "Commercial", metric: "49.5 MPa · −40 kg/m³ cement", body: "Graphene nano-platelet admixture transforming standard concrete into a high-performance material.", img: imgGraphacrete },
  { title: "Graffisol", stage: "Commercial", metric: "+10–12% annual yield", body: "Solar coating delivering higher annual yield, panel cooling and superhydrophobic self-cleaning.", img: imgGraffisol },
  { title: "Ceraphene", stage: "Commercial", metric: "9H+ · ₹5,000", body: "Graphene-enhanced ceramic coating with 9H+ hardness at one-third the price of premium options.", img: imgCeraphene },
  { title: "HD-G-PE", stage: "Commercial", metric: "+30% tensile · 100× barrier", body: "Graphene masterbatch — drop-in dosage for stronger, longer-lasting polymers.", img: imgHdgpe },
  { title: "Graphenodes", stage: "Commercial", metric: "Higher density · longer cycles", body: "Next-gen graphene polymer cathode and anode materials for high-density batteries.", img: imgGraphenodes },
  { title: "Ignitron D", stage: "Commercial", metric: "+15% economy · −15% emissions", body: "Nano-catalytic diesel additive improving fuel economy and slashing emissions.", img: imgIgnitronD },
  { title: "Coalorix", stage: "Pilot", metric: "+15% efficiency · −35% emissions", body: "Nano-combustion improver enhancing coal efficiency while cutting emissions.", img: imgCoalorix },
  { title: "Aquamax", stage: "Pilot", metric: "95%+ recovery · 12–24 mo ROI", body: "World-first hybrid HAMR + HGMC system recovering 95%+ of cooling tower plume water.", img: imgAquamax },
  { title: "Ignitron P", stage: "Pilot", metric: "+10% economy · −12% emissions", body: "Molecular combustion enhancer for petrol engines.", img: imgIgnitronP },
  { title: "Lubritron", stage: "Pilot", metric: "+6% savings · −40% wear", body: "Nano-enabled oil additive lowering wear and saving fuel.", img: imgLubritron },
  { title: "Rustene", stage: "Pilot", metric: "Multi-year corrosion shield", body: "Graphene-based anti-corrosion shield for steel, marine and industrial assets.", img: imgRustene },
  { title: "Gryogen", stage: "Pilot", metric: "Selective H₂ separation", body: "Graphene-based hydrogen selection membrane for clean fuel production.", img: imgGryogen },
  { title: "Mariphene", stage: "Pilot", metric: "Low-energy desalination", body: "Graphene desalination membrane for high-throughput, low-energy water production.", img: imgMariphene },
  { title: "Aerophenter", stage: "Pilot", metric: "Water from air", body: "Atmospheric water harvesting using graphene-engineered surfaces.", img: imgAerophenter },
  { title: "Fibrasphene", stage: "Pilot", metric: "Stronger glass fibres", body: "Reinforced graphene glass fibres for stronger composites and structures.", img: imgFibrasphene },
  { title: "Voltaphene", stage: "Pilot", metric: "Grid-scale storage", body: "Graphene-enabled energy storage systems for grid and mobility applications.", img: imgVoltaphene },
  { title: "Bitumax", stage: "R&D", metric: "1.5–2× pavement life", body: "Bitumen additive extending pavement life with major fatigue reduction.", img: imgBitumax },
  { title: "Pyronex", stage: "R&D", metric: "Fire · Heat · UV · Microbe shield", body: "Multi-functional paint additive — fire retardant, thermal barrier, UV insulation, anti-algae and anti-microbial in one coat.", img: imgPyronex },
  { title: "Graphyre", stage: "R&D", metric: "Longer life · better grip", body: "Reinforced performance tyres with graphene for grip, mileage and rolling efficiency.", img: imgGraphyre },
  { title: "Graphosite", stage: "R&D", metric: "Ultra-light · ultra-strong", body: "Structural graphene composites for ultra-light, ultra-strong applications.", img: imgGraphosite },
  { title: "Thermaphene", stage: "R&D", metric: "Active thermal regulation", body: "Smart thermal fabrics that regulate body temperature using graphene.", img: imgThermaphene },
  { title: "Armophene", stage: "R&D", metric: "Lighter than steel armour", body: "Next-generation graphene ballistics — lighter, stronger personal and vehicle armour.", img: imgArmophene },
  { title: "Hydrocell", stage: "R&D", metric: "Zero-emission · high power density", body: "Graphene-enhanced hydrogen fuel cell stack for clean mobility and stationary power.", img: imgHydrocell },
];

const filters = ["All", "Commercial", "Pilot", "R&D"] as const;
type Filter = (typeof filters)[number];

function InnovationsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((it) => it.stage === filter)),
    [filter],
  );

  return (
    <CinematicPageShell
      eyebrow={`Innovations · Catalogue · ${items.length} of ${items.length}`}
      title={<>One material platform.<br className="hidden md:inline" /> Twenty-three industrial expressions.</>}
      lead="Graphene engineered for concrete, solar, batteries, ceramics, polymers, water, hydrogen, mobility, storage, and armour — across commercial, pilot, and R&D stages."
      backdrop={backdrop}
      overlay={0.74}
    >
      <FounderPortrait
        variant="documentary"
        caption="Calibrating instrumentation in the R&D lab — graphene formulations under bench-scale validation."
        meta="Field · R&D Bench"
      />

      <div className="not-prose">
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const isActive = f === filter;
            const count = f === "All" ? items.length : items.filter((i) => i.stage === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] border transition-all ${
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {f} · {String(count).padStart(2, "0")}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {visible.map((it) => (
            <article
              key={it.title}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.02]"
            >
              <img
                src={it.img}
                alt={`${it.title} — ${it.body}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[0.4] contrast-[1.05] brightness-[0.85] transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary/80">{it.stage}</p>
                <h3 className="mt-1 font-display text-base md:text-lg tracking-[-0.01em] text-foreground/95 leading-tight">{it.title}</h3>
                <p className="mt-1 text-[10px] md:text-[11px] text-foreground/65 line-clamp-1">{it.metric}</p>
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/85 px-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="text-center">
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary/80">{it.stage}</p>
                  <h3 className="mt-1 font-display text-lg text-gradient">{it.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-foreground/80 line-clamp-4">{it.body}</p>
                  <p className="mt-2 text-[10px] text-foreground/70">{it.metric}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </CinematicPageShell>
  );
}
