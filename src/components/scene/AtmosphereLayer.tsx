import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";
import EarthLivingScene from "./EarthLivingScene";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

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
 * Seven scenes — one per chapter section. The active scene is driven by the
 * **measured center** of each chapter `<section id="…">` in the DOM (see
 * useChapterPhase) so the background NEVER drifts ahead of the content the
 * reader is currently on.
 *
 *   Origin              → spark
 *   Founder             → founder
 *   Material            → material
 *   Industrial          → industrial
 *   Recognition         → recognition (archival)
 *   Ecosystem           → ventures
 *   Future Systems      → future
 */
const SCENES: BackgroundScene[] = [
  {
    src: sceneSpark,
    alt: "Origin · blueprint genesis · systems emergence",
    tint: "radial-gradient(ellipse at 50% 72%, oklch(0.40 0.038 232 / 0.12), oklch(0.05 0.010 232 / 0.10) 72%)",
    // Strong central crush so the plate's bright spark crystal can never
    // bleed into the typography column behind the hero headline.
    overlay:
      "radial-gradient(ellipse 60% 70% at 50% 50%, oklch(0.018 0.004 232 / 0.94) 0%, oklch(0.020 0.004 232 / 0.82) 38%, oklch(0.022 0.004 232 / 0.62) 72%, oklch(0.022 0.004 232 / 0.72) 100%)",
    parallax: 0.5,
    filter: "brightness(0.46) contrast(1.04) saturate(0.58)",
    // Push the bright focal crystal well below the typography centerline.
    objectPosition: "center 88%",
  },
  {
    src: sceneFounder,
    alt: "Founder · portrait dissolving into industrial darkness",
    tint: "linear-gradient(120deg, oklch(0.42 0.040 50 / 0.09), transparent 58%, oklch(0.10 0.018 232 / 0.22))",
    overlay:
      "radial-gradient(ellipse 56% 66% at 38% 50%, oklch(0.030 0.006 40 / 0.22) 0%, oklch(0.022 0.004 232 / 0.66) 90%)",
    parallax: 0.4,
    filter: "brightness(0.78) contrast(1.08) saturate(0.76) sepia(0.04)",
  },
  {
    src: sceneMaterial,
    alt: "Material intelligence · graphene lattice and nano-materials",
    tint: "linear-gradient(180deg, oklch(0.54 0.10 200 / 0.16), oklch(0.18 0.05 230 / 0.14))",
    overlay:
      "linear-gradient(180deg, oklch(0.028 0.006 260 / 0.50) 0%, oklch(0.035 0.012 220 / 0.22) 45%, oklch(0.028 0.006 260 / 0.56) 100%)",
    parallax: 1.05,
    filter: "brightness(0.90) contrast(1.08) saturate(1.06) hue-rotate(-8deg)",
  },
  {
    src: sceneIndustrial,
    alt: "Industrial translation · infrastructure, manufacturing, energy",
    tint: "linear-gradient(135deg, oklch(0.32 0.07 240 / 0.18) 0%, oklch(0.52 0.10 55 / 0.07) 100%)",
    overlay:
      "linear-gradient(165deg, oklch(0.028 0.006 260 / 0.54) 0%, oklch(0.045 0.018 240 / 0.24) 45%, oklch(0.028 0.006 260 / 0.54) 100%)",
    parallax: 1.15,
    filter: "brightness(0.88) contrast(1.10) saturate(1.00)",
  },
  {
    src: sceneRecognition,
    alt: "Recognition · archival ink, blueprints, public memory",
    tint: "linear-gradient(180deg, oklch(0.46 0.045 60 / 0.10), oklch(0.13 0.022 40 / 0.22))",
    overlay:
      "radial-gradient(ellipse 76% 66% at 50% 50%, oklch(0.035 0.010 40 / 0.42) 0%, oklch(0.025 0.006 260 / 0.70) 82%)",
    parallax: 0.5,
    filter: "brightness(0.74) contrast(1.06) saturate(0.62) sepia(0.18)",
  },
  {
    src: sceneVentures,
    alt: "Ecosystem · interconnected industrial ventures · India → World",
    tint: "radial-gradient(ellipse 70% 60% at 56% 46%, oklch(0.40 0.048 240 / 0.16), oklch(0.07 0.016 232 / 0.18) 72%)",
    overlay:
      "radial-gradient(ellipse 82% 72% at 50% 46%, oklch(0.030 0.006 232 / 0.40) 0%, oklch(0.022 0.004 232 / 0.68) 90%)",
    parallax: 0.85,
    filter: "brightness(0.82) contrast(1.06) saturate(0.84)",
  },
  {
    src: sceneFuture,
    alt: "Future systems · planetary-scale industrial intelligence",
    tint: "radial-gradient(ellipse 72% 60% at 60% 52%, oklch(0.36 0.042 232 / 0.10), oklch(0.04 0.010 245 / 0.26) 72%)",
    overlay:
      "radial-gradient(ellipse 96% 82% at 50% 55%, oklch(0.022 0.006 245 / 0.44) 0%, oklch(0.018 0.005 250 / 0.70) 80%, oklch(0.014 0.004 250 / 0.82) 100%)",
    parallax: 0.7,
    filter: "brightness(0.76) contrast(1.08) saturate(0.82) hue-rotate(-4deg)",
  },
];

// Per-chapter baseline dim — 7 stops, one per section.
const OVERLAY_STOPS = [
  0.24, // Origin
  0.20, // Founder
  0.16, // Material
  0.19, // Industrial
  0.23, // Recognition
  0.20, // Ecosystem
  0.23, // Future
];

export default function AtmosphereLayer() {
  const phase = useChapterPhase(HOME_CHAPTER_IDS);
  return (
    <AnimatedBackground
      scenes={SCENES}
      overlayStops={OVERLAY_STOPS}
      phaseSource={phase}
    >
      {({ progress, phase }) => (
        <>
          <ParticleField progress={progress} phase={phase} />
          <EarthLivingScene phase={phase} />
        </>
      )}
    </AnimatedBackground>
  );
}
