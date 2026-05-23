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
 *   07 Future       — dawn gold over slate, an industrial horizon
 */
const SCENES: BackgroundScene[] = [
  {
    src: sceneSpark,
    alt: "01 — Spark · a single glowing particle in dark space",
    tint: "radial-gradient(ellipse at 50% 50%, oklch(0.42 0.12 245 / 0.32), oklch(0.08 0.03 260 / 0.14) 70%)",
    overlay:
      "radial-gradient(ellipse 72% 64% at 50% 52%, oklch(0.04 0.01 260 / 0.62) 0%, oklch(0.03 0.006 260 / 0.92) 75%)",
    parallax: 0.5,
    filter: "brightness(0.58) contrast(1.06) saturate(0.78)",
  },
  {
    src: sceneFounder,
    alt: "02 — Founder · portrait dissolving into industrial darkness",
    tint: "linear-gradient(120deg, oklch(0.55 0.10 55 / 0.22), transparent 55%, oklch(0.15 0.05 260 / 0.35))",
    overlay:
      "radial-gradient(ellipse 55% 65% at 38% 50%, oklch(0.04 0.01 40 / 0.30) 0%, oklch(0.03 0.006 260 / 0.78) 85%)",
    parallax: 0.4,
    filter: "brightness(0.74) contrast(1.10) saturate(0.85) sepia(0.08)",
  },
  {
    src: sceneMaterial,
    alt: "03 — Carbon intelligence · graphene lattice and nano-materials",
    tint: "linear-gradient(180deg, oklch(0.55 0.10 200 / 0.22), oklch(0.20 0.06 230 / 0.18))",
    overlay:
      "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.62) 0%, oklch(0.04 0.01 230 / 0.30) 45%, oklch(0.03 0.006 260 / 0.70) 100%)",
    parallax: 1.1,
    filter: "brightness(0.82) contrast(1.06) saturate(0.95) hue-rotate(-6deg)",
  },
  {
    src: sceneIndustrial,
    alt: "04 — Industrial future · solar, battery, polymer, climate",
    tint: "linear-gradient(135deg, oklch(0.30 0.08 240 / 0.28) 0%, oklch(0.55 0.11 55 / 0.14) 100%)",
    overlay:
      "linear-gradient(165deg, oklch(0.03 0.006 260 / 0.70) 0%, oklch(0.05 0.02 240 / 0.32) 45%, oklch(0.03 0.006 260 / 0.68) 100%)",
    parallax: 1.2,
    filter: "brightness(0.80) contrast(1.12) saturate(1.0)",
  },
  {
    src: sceneRecognition,
    alt: "05 — Recognition signal · archival ink, blueprints, public memory",
    tint: "linear-gradient(180deg, oklch(0.50 0.06 60 / 0.18), oklch(0.15 0.03 40 / 0.30))",
    overlay:
      "radial-gradient(ellipse 75% 65% at 50% 50%, oklch(0.04 0.01 40 / 0.55) 0%, oklch(0.03 0.006 260 / 0.85) 78%)",
    parallax: 0.5,
    filter: "brightness(0.68) contrast(1.06) saturate(0.55) sepia(0.18)",
  },
  {
    src: sceneVentures,
    alt: "06 — Ecosystem · a constellation of operating worlds",
    tint: "radial-gradient(ellipse at 50% 40%, oklch(0.45 0.13 270 / 0.30), oklch(0.10 0.05 250 / 0.25) 70%)",
    overlay:
      "radial-gradient(ellipse 80% 70% at 50% 45%, oklch(0.04 0.01 260 / 0.45) 0%, oklch(0.03 0.006 260 / 0.78) 85%)",
    parallax: 0.9,
    filter: "brightness(0.78) contrast(1.08) saturate(0.95) hue-rotate(-4deg)",
  },
  {
    src: sceneFuture,
    alt: "07 — Future · a living industrial ecosystem at dawn",
    tint: "linear-gradient(180deg, oklch(0.60 0.12 60 / 0.22) 0%, oklch(0.25 0.06 240 / 0.28) 100%)",
    overlay:
      "linear-gradient(180deg, oklch(0.04 0.01 240 / 0.55) 0%, oklch(0.05 0.02 60 / 0.20) 55%, oklch(0.03 0.006 260 / 0.72) 100%)",
    parallax: 1.0,
    filter: "brightness(0.82) contrast(1.08) saturate(1.02)",
  },
];

// Soft baseline dim — each scene's own overlay already carries readability,
// so this just whispers a touch of darkness for the long reads.
const OVERLAY_STOPS = [
  0.34, // Spark
  0.26, // Founder
  0.20, // Material
  0.24, // Industrial
  0.30, // Recognition
  0.26, // Ecosystem
  0.22, // Future
];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress, phase }) => <ParticleField progress={progress} phase={phase} />}
    </AnimatedBackground>
  );
}
