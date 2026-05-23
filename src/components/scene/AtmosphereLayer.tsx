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
    alt: "01 — Spark · a single glowing particle in dark space",
    tint: "radial-gradient(ellipse at 50% 50%, oklch(0.36 0.032 230 / 0.18), oklch(0.05 0.010 232 / 0.16) 70%)",
    overlay:
      "radial-gradient(ellipse 72% 64% at 50% 52%, oklch(0.030 0.005 232 / 0.72) 0%, oklch(0.020 0.004 232 / 0.96) 75%)",
    parallax: 0.5,
    filter: "brightness(0.48) contrast(1.05) saturate(0.60)",
  },
  {
    src: sceneFounder,
    alt: "02 — Founder · portrait dissolving into industrial darkness",
    tint: "linear-gradient(120deg, oklch(0.42 0.045 50 / 0.12), transparent 55%, oklch(0.10 0.018 232 / 0.30))",
    overlay:
      "radial-gradient(ellipse 55% 65% at 38% 50%, oklch(0.030 0.006 40 / 0.36) 0%, oklch(0.022 0.004 232 / 0.86) 85%)",
    parallax: 0.4,
    filter: "brightness(0.62) contrast(1.08) saturate(0.68) sepia(0.05)",
  },
  {
    src: sceneMaterial,
    alt: "03 — Carbon intelligence · graphene lattice and nano-materials",
    tint: "linear-gradient(180deg, oklch(0.50 0.09 200 / 0.18), oklch(0.18 0.05 230 / 0.20))",
    overlay:
      "linear-gradient(180deg, oklch(0.028 0.006 260 / 0.70) 0%, oklch(0.035 0.01 230 / 0.38) 45%, oklch(0.028 0.006 260 / 0.76) 100%)",
    parallax: 1.1,
    filter: "brightness(0.72) contrast(1.06) saturate(0.90) hue-rotate(-6deg)",
  },
  {
    src: sceneIndustrial,
    alt: "04 — Industrial future · solar, battery, polymer, climate",
    tint: "linear-gradient(135deg, oklch(0.28 0.07 240 / 0.26) 0%, oklch(0.50 0.10 55 / 0.10) 100%)",
    overlay:
      "linear-gradient(165deg, oklch(0.028 0.006 260 / 0.76) 0%, oklch(0.045 0.018 240 / 0.40) 45%, oklch(0.028 0.006 260 / 0.74) 100%)",
    parallax: 1.2,
    filter: "brightness(0.70) contrast(1.10) saturate(0.92)",
  },
  {
    src: sceneRecognition,
    alt: "05 — Recognition signal · archival ink, blueprints, public memory",
    tint: "linear-gradient(180deg, oklch(0.45 0.05 60 / 0.14), oklch(0.13 0.025 40 / 0.30))",
    overlay:
      "radial-gradient(ellipse 75% 65% at 50% 50%, oklch(0.035 0.01 40 / 0.62) 0%, oklch(0.025 0.006 260 / 0.88) 78%)",
    parallax: 0.5,
    filter: "brightness(0.60) contrast(1.06) saturate(0.52) sepia(0.18)",
  },
  {
    src: sceneVentures,
    alt: "06 — Ecosystem · a constellation of operating worlds",
    tint: "radial-gradient(ellipse at 50% 40%, oklch(0.38 0.045 235 / 0.20), oklch(0.07 0.016 232 / 0.24) 70%)",
    overlay:
      "radial-gradient(ellipse 80% 70% at 50% 45%, oklch(0.030 0.006 232 / 0.58) 0%, oklch(0.022 0.004 232 / 0.86) 85%)",
    parallax: 0.9,
    filter: "brightness(0.66) contrast(1.06) saturate(0.74)",
  },
  {
    src: sceneFuture,
    alt: "07 — India → World · Earth at night, global industrial network scaling from an Indian origin",
    tint: "radial-gradient(ellipse 70% 60% at 62% 52%, oklch(0.34 0.04 232 / 0.11), oklch(0.04 0.010 245 / 0.36) 70%)",
    overlay:
      "radial-gradient(ellipse 95% 80% at 50% 55%, oklch(0.022 0.006 245 / 0.62) 0%, oklch(0.018 0.005 250 / 0.88) 75%, oklch(0.014 0.004 250 / 0.96) 100%)",
    parallax: 0.7,
    filter: "brightness(0.60) contrast(1.08) saturate(0.70) hue-rotate(-4deg)",
  },
];

// Soft baseline dim — normalized across chapters so typography always reads
// as the primary layer. Trimmed ~10% to reduce muddiness while preserving
// cinematic depth and chapter-to-chapter cohesion.
const OVERLAY_STOPS = [
  0.36, // Spark
  0.29, // Founder
  0.25, // Material
  0.29, // Industrial
  0.32, // Recognition
  0.29, // Ecosystem
  0.32, // India → World — deepened so molecular plate sits behind typography
];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress, phase }) => <ParticleField progress={progress} phase={phase} />}
    </AnimatedBackground>
  );
}
