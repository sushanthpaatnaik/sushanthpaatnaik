import { createFileRoute } from "@tanstack/react-router";
import CinematicPageShell, {
  EditorialList,
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/scene-early-workshop.jpg";

import enabler from "@/assets/early/enabler.webp";
import rectofit from "@/assets/early/rectofit.webp";
import shewatch from "@/assets/early/shewatch.webp";
import solka from "@/assets/early/solka.webp";
import supersense from "@/assets/early/supersense.webp";
import powergen from "@/assets/early/powergen.webp";

export const Route = createFileRoute("/early-works")({
  component: EarlyWorksPage,
  head: () => ({
    meta: [
      { title: "Early Works — Six Presidential-Awarded Origin Inventions" },
      {
        name: "description",
        content:
          "Between 2008 and 2013, still in his teens, Sushanth designed six original devices — each tackling a real human problem. The teenage inventions that earned six Presidential Awards.",
      },
      { property: "og:title", content: "Early Works — Origin Archive" },
      {
        property: "og:description",
        content:
          "Enabler · Rectofit · She Watch · Sol-Ka · Super Sense · Power Gen Kit — six origin inventions, in the inventor's own hand.",
      },
      { property: "og:url", content: "/early-works" },
    ],
    links: [{ rel: "canonical", href: "/early-works" }],
  }),
});

type Work = {
  code: string;
  category: string;
  title: string;
  tagline: string;
  body: string;
  img: string;
  year: string;
  video?: string;
  videoSource?: "youtube" | "vimeo";
};

const works: Work[] = [
  {
    code: "01",
    category: "Off-grid Energy · 2008",
    title: "High-Eff Power Generation Kit",
    tagline: "Off-grid electricity for rural India",
    body: "A high-efficiency, low-cost power generation kit conceived to bring reliable electricity to remote rural communities.",
    img: powergen,
    year: "2008",
    video: "57665099",
    videoSource: "vimeo",
  },
  {
    code: "02",
    category: "Assistive Tech · 2010",
    title: "Enabler",
    tagline: "Breath-operated wheelchair",
    body: "A wheelchair operated entirely through breath patterns — built to empower individuals with severe paralysis to regain independent mobility.",
    img: enabler,
    year: "2010",
    video: "n-JiX6vmwOI",
  },
  {
    code: "03",
    category: "Mobility Safety · 2011",
    title: "Accident-Proof Rectofit Kit",
    tagline: "Universal vehicle safety retrofit",
    body: "A retrofittable safety kit designed to transform any existing vehicle into a safer machine — without redesign of the host platform.",
    img: rectofit,
    year: "2011",
  },
  {
    code: "04",
    category: "Wearables · 2012",
    title: "She Watch",
    tagline: "Women's safety wearable",
    body: "A discreet, smart-watch form-factor wearable engineered to alert and locate — designed long before the category became mainstream.",
    img: shewatch,
    year: "2012",
    video: "o8nir3oFzXg",
  },
  {
    code: "05",
    category: "Energy Harvesting · 2012",
    title: "Sol-Ka",
    tagline: "Ambient-light charging power bank",
    body: "A power bank case that harvests ambient indoor light to keep devices topped up — a quietly self-sufficient piece of everyday hardware.",
    img: solka,
    year: "2012",
    video: "LDdIsTrE_Uw",
  },
  {
    code: "06",
    category: "HCI · 2013",
    title: "Super Sense Technology",
    tagline: "Gesture-controlled computing",
    body: "A system enabling computers to be operated through hand gestures alone — exploring a more natural human–machine interface.",
    img: supersense,
    year: "2013",
    video: "YuNwD71F3tA",
  },
];

function EarlyWorksPage() {
  return (
    <CinematicPageShell
      eyebrow="Early Works · 2008–2013 · Origin Innovations"
      title={<>The teenage inventions that<br className="hidden md:inline" /> earned six Presidential Awards.</>}
      lead="Between 2008 and 2013 — still in his teens — Sushanth designed and built six original devices, each tackling a real human problem with hardware that worked."
      backdrop={backdrop}
      overlay={0.74}
    >
      <div className="not-prose mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {works.map((w) => (
          <article
            key={w.title}
            className="group relative overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.02]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={w.img}
                alt={`${w.title} — ${w.tagline}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-75 grayscale-[0.3] transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>
            <div className="p-5 md:p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-primary/75">
                {w.code} · {w.category}
              </p>
              <h3 className="mt-3 font-display text-xl md:text-2xl tracking-[-0.015em] text-foreground/95">
                {w.title}
              </h3>
              <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-accent/80">
                {w.tagline}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground/70">
                {w.body}
              </p>
              {w.video && (
                <a
                  href={
                    w.videoSource === "vimeo"
                      ? `https://vimeo.com/${w.video}`
                      : `https://www.youtube.com/watch?v=${w.video}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/75 hover:text-foreground transition-colors"
                >
                  Watch demo <span className="opacity-70">↗</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <EditorialSection number="07 · Continuity" heading="A through-line, in retrospect.">
        <p>
          Each early invention had the same shape: an unmet human need, a
          material constraint nobody else found interesting, and a weekend in
          a borrowed workshop. The companies built later are the same
          instinct — with a longer fuse.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
