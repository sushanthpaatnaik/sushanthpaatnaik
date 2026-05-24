import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";

import sceneSpark from "@/assets/story-01-spark.webp";
import sceneMaterial from "@/assets/story-03-material.webp";
import sceneIndustrial from "@/assets/story-04-industrial.webp";
import sceneVentures from "@/assets/story-05-ventures.webp";
import sceneFuture from "@/assets/story-07-future.webp";
import sceneFounder from "@/assets/founder-presence.webp";
import sceneRecognition from "@/assets/story-02-recognition.webp";

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
    tint: "radial-gradient(ellipse at 50% 52%, oklch(0.40 0.038 232 / 0.14), oklch(0.05 0.010 232 / 0.10) 72%)",
    overlay:
      "radial-gradient(ellipse 74% 66% at 50% 52%, oklch(0.028 0.005 232 / 0.50) 0%, oklch(0.020 0.004 232 / 0.78) 82%)",
    parallax: 0.5,
    filter: "brightness(0.62) contrast(1.06) saturate(0.68)",
  },
  {
    src: sceneFounder,
    alt: "02 — Founder · portrait dissolving into industrial darkness",
    tint: "linear-gradient(120deg, oklch(0.42 0.040 50 / 0.09), transparent 58%, oklch(0.10 0.018 232 / 0.22))",
    overlay:
      "radial-gradient(ellipse 56% 66% at 38% 50%, oklch(0.030 0.006 40 / 0.22) 0%, oklch(0.022 0.004 232 / 0.66) 90%)",
    parallax: 0.4,
    filter: "brightness(0.78) contrast(1.08) saturate(0.76) sepia(0.04)",
  },
  {
    src: sceneMaterial,
    alt: "03 — Carbon intelligence · graphene lattice and nano-materials",
    tint: "linear-gradient(180deg, oklch(0.54 0.10 200 / 0.16), oklch(0.18 0.05 230 / 0.14))",
    overlay:
      "linear-gradient(180deg, oklch(0.028 0.006 260 / 0.50) 0%, oklch(0.035 0.012 220 / 0.22) 45%, oklch(0.028 0.006 260 / 0.56) 100%)",
    parallax: 1.05,
    filter: "brightness(0.90) contrast(1.08) saturate(1.06) hue-rotate(-8deg)",
  },
  {
    src: sceneIndustrial,
    alt: "04 — Industrial future · infrastructure, manufacturing, energy",
    tint: "linear-gradient(135deg, oklch(0.32 0.07 240 / 0.18) 0%, oklch(0.52 0.10 55 / 0.07) 100%)",
    overlay:
      "linear-gradient(165deg, oklch(0.028 0.006 260 / 0.54) 0%, oklch(0.045 0.018 240 / 0.24) 45%, oklch(0.028 0.006 260 / 0.54) 100%)",
    parallax: 1.15,
    filter: "brightness(0.88) contrast(1.10) saturate(1.00)",
  },
  {
    src: sceneRecognition,
    alt: "05 — Recognition signal · archival ink, blueprints, public memory",
    tint: "linear-gradient(180deg, oklch(0.46 0.045 60 / 0.10), oklch(0.13 0.022 40 / 0.22))",
    overlay:
      "radial-gradient(ellipse 76% 66% at 50% 50%, oklch(0.035 0.010 40 / 0.42) 0%, oklch(0.025 0.006 260 / 0.70) 82%)",
    parallax: 0.5,
    filter: "brightness(0.74) contrast(1.06) saturate(0.62) sepia(0.18)",
  },
  {
    src: sceneVentures,
    alt: "06 — Ecosystem · interconnected industrial ventures · India → World",
    tint: "radial-gradient(ellipse 70% 60% at 56% 46%, oklch(0.40 0.048 240 / 0.16), oklch(0.07 0.016 232 / 0.18) 72%)",
    overlay:
      "radial-gradient(ellipse 82% 72% at 50% 46%, oklch(0.030 0.006 232 / 0.40) 0%, oklch(0.022 0.004 232 / 0.68) 90%)",
    parallax: 0.85,
    filter: "brightness(0.82) contrast(1.06) saturate(0.84)",
  },
  {
    src: sceneFuture,
    alt: "07 — Future · planetary-scale industrial intelligence, energy grids",
    tint: "radial-gradient(ellipse 72% 60% at 60% 52%, oklch(0.36 0.042 232 / 0.10), oklch(0.04 0.010 245 / 0.26) 72%)",
    overlay:
      "radial-gradient(ellipse 96% 82% at 50% 55%, oklch(0.022 0.006 245 / 0.44) 0%, oklch(0.018 0.005 250 / 0.70) 80%, oklch(0.014 0.004 250 / 0.82) 100%)",
    parallax: 0.7,
    filter: "brightness(0.76) contrast(1.08) saturate(0.82) hue-rotate(-4deg)",
  },
];

// Reduced baseline dim ~15% — backgrounds now read as story environments
// while typography still owns the foreground via per-chapter overlays.
const OVERLAY_STOPS = [
  0.24, // 01 Spark
  0.20, // 02 Founder
  0.16, // 03 Carbon Intelligence
  0.19, // 04 Industrial
  0.23, // 05 Recognition
  0.20, // 06 Ecosystem
  0.23, // 07 Future
];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress, phase }) => <ParticleField progress={progress} phase={phase} />}
    </AnimatedBackground>
  );
}
