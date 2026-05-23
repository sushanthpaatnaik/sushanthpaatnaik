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
 * Homepage scroll-synchronized cinematic background — one plate per scene.
 * Seven plates, mapped 1:1 to the seven homepage scenes. Each plate is
 * tonally graded into the same graphite + cool-blue + restrained-copper
 * palette, so the environment evolves as one continuous opening sequence
 * rather than a slideshow.
 */
const SCENES: BackgroundScene[] = [
  { src: sceneSpark,       alt: "01 — Spark · a single glowing particle in dark space" },
  { src: sceneFounder,     alt: "02 — Founder · portrait dissolving into industrial darkness" },
  { src: sceneMaterial,    alt: "03 — Carbon intelligence · graphene lattice and nano-materials" },
  { src: sceneIndustrial,  alt: "04 — Industrial future · solar, battery, polymer, climate" },
  { src: sceneRecognition, alt: "05 — Recognition signal · blueprints and award-light silhouettes" },
  { src: sceneVentures,    alt: "06 — Ecosystem · a constellation of operating worlds" },
  { src: sceneFuture,      alt: "07 — Future · a living industrial ecosystem at dawn" },
];

// Heavier overlay where typography must dominate; lighter through the
// visual chapters where imagery can breathe.
const OVERLAY_STOPS = [
  0.70, // Spark
  0.58, // Founder
  0.48, // Material
  0.52, // Industrial
  0.68, // Recognition
  0.60, // Ecosystem
  0.56, // Future
];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress }) => <ParticleField progress={progress} />}
    </AnimatedBackground>
  );
}
