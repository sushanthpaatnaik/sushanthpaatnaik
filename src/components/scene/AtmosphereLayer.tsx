import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";

import sceneSpark from "@/assets/story-01-spark.jpg";
import sceneRecognition from "@/assets/story-02-recognition.jpg";
import sceneMaterial from "@/assets/story-03-material.jpg";
import sceneIndustrial from "@/assets/story-04-industrial.jpg";
import sceneVentures from "@/assets/story-05-ventures.jpg";
import sceneIndia from "@/assets/story-06-india.jpg";
import sceneFuture from "@/assets/story-07-future.jpg";

import sceneAbout from "@/assets/scene-about-notebook.jpg";
import sceneNumbers from "@/assets/scene-numbers-field.jpg";
import sceneEarly from "@/assets/scene-early-workshop.jpg";
import sceneManifesto from "@/assets/scene-manifesto-paper.jpg";
import sceneNews from "@/assets/scene-media-wall.jpg";

/**
 * Scroll-synchronized cinematic background — one plate per migrated chapter,
 * crossfaded across the full scroll. Each plate is tonally graded into the
 * same graphite + cool-blue + restrained-copper palette, so the background
 * evolves as a living archive of the work rather than a slideshow.
 *
 * The order mirrors the section order in ScrollSections so the plate beneath
 * a section actually relates to the content on top of it.
 */
const SCENES: BackgroundScene[] = [
  { src: sceneSpark,       alt: "Spark — a single glowing particle in dark space" },
  { src: sceneRecognition, alt: "Recognition — blueprints and award-light silhouettes" },
  { src: sceneMaterial,    alt: "Carbon Intelligence — graphene lattice and nano-materials" },
  { src: sceneIndustrial,  alt: "Industrial Applications — solar, battery, concrete, polymer, fuel" },
  { src: sceneVentures,    alt: "Venture Builder — a constellation of operating companies" },
  { src: sceneIndia,       alt: "India to the World — India radiating into a global network" },
  { src: sceneAbout,       alt: "About — open patent notebook, hand-drawn invention schematics" },
  { src: sceneNumbers,     alt: "Numbers — abstract data field of industrial coordinates" },
  { src: sceneEarly,       alt: "Early Works — young inventor's workshop bench under tungsten light" },
  { src: sceneManifesto,   alt: "In His Words — graphite paper with faint handwritten principles" },
  { src: sceneNews,        alt: "News & Media — dim editorial archive wall of clippings" },
  { src: sceneFuture,      alt: "Future — a living industrial ecosystem at dawn" },
];

// Per-plate dark overlay opacity. Heavier under typography-dense sections
// (About, Numbers, Early Works, Manifesto, News) so text always wins;
// lighter through the visual chapters where the imagery should breathe.
const OVERLAY_STOPS = [
  0.70, // Spark        — pull text forward
  0.55, // Recognition
  0.46, // Material
  0.50, // Industrial
  0.52, // Ventures
  0.54, // India
  0.66, // About        — single-column reading
  0.60, // Numbers      — metrics need contrast
  0.58, // Early Works
  0.68, // Manifesto    — long-form principles
  0.62, // News         — list density
  0.55, // Future
];

export default function AtmosphereLayer() {
  return (
    <AnimatedBackground scenes={SCENES} overlayStops={OVERLAY_STOPS}>
      {({ progress }) => <ParticleField progress={progress} />}
    </AnimatedBackground>
  );
}
