import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";

import sceneSpark from "@/assets/story-01-spark.jpg";
import sceneMaterial from "@/assets/story-03-material.jpg";
import sceneIndustrial from "@/assets/story-04-industrial.jpg";
import sceneVentures from "@/assets/story-05-ventures.jpg";
import sceneFuture from "@/assets/story-07-future.jpg";
import sceneFounder from "@/assets/founder-presence.jpg";
import sceneRecognition from "@/assets/story-02-recognition.jpg";

/**
 * Homepage scroll-synchronized cinematic background.
 *
 * Each of the seven chapters carries its own:
 *   · chroma tint        — the emotional color of the scene
 *   · overlay gradient   — the lighting language (radial vault, top-dusk, side-lit archive…)
 *   · parallax depth     — how much the plate drifts relative to scroll
 *   · grade              — per-scene contrast / brightness / saturation
 *
 * Chapter palette (cinematic progression):
 *   01 Spark        — pre-dawn cobalt, signal in deep space
 *   02 Founder      — warm graphite + ember, intimate vault
 *   03 Material     — cool cyan-graphite, laboratory hush
 *   04 Industrial   — steel-blue + restrained copper, machine-room
 *   05 Recognition  — archival sepia + ink, paper-and-ink memory
 *   06 Ecosystem    — twilight indigo, constellation depth
 *   07 Future       — Earth at night, India-origin glow scaling to global network
 */
const SCENES: BackgroundScene[] = [
  {
    src: sceneSpark,
    alt: "01 — Spark · blueprint origin · systems emergence",
    // Pre-dawn cobalt with a faint blueprint-grade wash — the beginning of
    // systems thinking, not a generic glow.
    tint: "radial-gradient(ellipse at 50% 52%, oklch(0.40 0.038 232 / 0.16), oklch(0.05 0.010 232 / 0.12) 72%)",
    overlay:
      "radial-gradient(ellipse 74% 66% at 50% 52%, oklch(0.028 0.005 232 / 0.62) 0%, oklch(0.020 0.004 232 / 0.90) 78%)",
    parallax: 0.5,
    filter: "brightness(0.52) contrast(1.08) saturate(0.62)",
  },
  {
    src: sceneFounder,
    alt: "02 — Founder · portrait dissolving into industrial darkness",
    // Restrained warm graphite + ember vault — intimate, archival.
    tint: "linear-gradient(120deg, oklch(0.42 0.040 50 / 0.10), transparent 58%, oklch(0.10 0.018 232 / 0.26))",
    overlay:
      "radial-gradient(ellipse 56% 66% at 38% 50%, oklch(0.030 0.006 40 / 0.30) 0%, oklch(0.022 0.004 232 / 0.78) 88%)",
    parallax: 0.4,
    filter: "brightness(0.66) contrast(1.10) saturate(0.70) sepia(0.04)",
  },
  {
    src: sceneMaterial,
    alt: "03 — Carbon intelligence · graphene lattice and nano-materials",
    // Stronger material-science chroma: cool cyan-graphene with a slight
    // hex-lattice atmosphere reading.
    tint: "linear-gradient(180deg, oklch(0.54 0.10 200 / 0.20), oklch(0.18 0.05 230 / 0.18))",
    overlay:
      "linear-gradient(180deg, oklch(0.028 0.006 260 / 0.62) 0%, oklch(0.035 0.012 220 / 0.30) 45%, oklch(0.028 0.006 260 / 0.68) 100%)",
    parallax: 1.05,
    filter: "brightness(0.78) contrast(1.10) saturate(1.02) hue-rotate(-8deg)",
  },
  {
    src: sceneIndustrial,
    alt: "04 — Industrial future · infrastructure, manufacturing, energy",
    // Steel-blue + restrained copper — manufacturing scale, less fog so
    // industrial forms register more clearly.
    tint: "linear-gradient(135deg, oklch(0.32 0.07 240 / 0.22) 0%, oklch(0.52 0.10 55 / 0.09) 100%)",
    overlay:
      "linear-gradient(165deg, oklch(0.028 0.006 260 / 0.66) 0%, oklch(0.045 0.018 240 / 0.32) 45%, oklch(0.028 0.006 260 / 0.66) 100%)",
    parallax: 1.15,
    filter: "brightness(0.76) contrast(1.12) saturate(0.96)",
  },
  {
    src: sceneRecognition,
    alt: "05 — Recognition signal · archival ink, blueprints, public memory",
    // Archival sepia + ink — paper-and-ink institutional memory.
    tint: "linear-gradient(180deg, oklch(0.46 0.045 60 / 0.12), oklch(0.13 0.022 40 / 0.26))",
    overlay:
      "radial-gradient(ellipse 76% 66% at 50% 50%, oklch(0.035 0.010 40 / 0.54) 0%, oklch(0.025 0.006 260 / 0.82) 80%)",
    parallax: 0.5,
    filter: "brightness(0.62) contrast(1.08) saturate(0.54) sepia(0.18)",
  },
  {
    src: sceneVentures,
    alt: "06 — Ecosystem · interconnected industrial ventures · India → World",
    // Twilight indigo with faint corridor-glow on the right — logistics
    // and industrial network continuity, not a startup globalization wash.
    tint: "radial-gradient(ellipse 70% 60% at 56% 46%, oklch(0.40 0.048 240 / 0.20), oklch(0.07 0.016 232 / 0.22) 72%)",
    overlay:
      "radial-gradient(ellipse 82% 72% at 50% 46%, oklch(0.030 0.006 232 / 0.52) 0%, oklch(0.022 0.004 232 / 0.80) 88%)",
    parallax: 0.85,
    filter: "brightness(0.70) contrast(1.08) saturate(0.78)",
  },
  {
    src: sceneFuture,
    alt: "07 — Future · planetary-scale industrial intelligence, energy grids",
    // Earth-at-night origin glow scaling outward — realistic futurism,
    // not neon sci-fi.
    tint: "radial-gradient(ellipse 72% 60% at 60% 52%, oklch(0.36 0.042 232 / 0.12), oklch(0.04 0.010 245 / 0.32) 72%)",
    overlay:
      "radial-gradient(ellipse 96% 82% at 50% 55%, oklch(0.022 0.006 245 / 0.56) 0%, oklch(0.018 0.005 250 / 0.82) 78%, oklch(0.014 0.004 250 / 0.92) 100%)",
    parallax: 0.7,
    filter: "brightness(0.64) contrast(1.10) saturate(0.74) hue-rotate(-4deg)",
  },
];

// Soft baseline dim — reduced ~12% from the prior pass to improve clarity
// and breathing room without losing cinematic depth. Each value is the
// floor below the chapter's own overlay, never the dominant layer.
const OVERLAY_STOPS = [
  0.30, // 01 Spark
  0.25, // 02 Founder
  0.21, // 03 Carbon Intelligence
  0.24, // 04 Industrial
  0.28, // 05 Recognition
  0.25, // 06 Ecosystem
  0.28, // 07 Future
];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress, phase }) => <ParticleField progress={progress} phase={phase} />}
    </AnimatedBackground>
  );
}
