import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";
import EarthGlobe from "./EarthGlobe";
import RecognitionAmbient from "./RecognitionAmbient";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

import sceneSpark from "@/assets/story-01-spark.webp";
import sceneMaterial from "@/assets/story-03-material.webp";
import sceneIndustrial from "@/assets/story-04.1-industrial.webp";
import sceneEcosystem from "@/assets/story-06-india.webp";
import sceneFuture from "@/assets/story-07-future.webp";
import sceneFounder from "@/assets/founder-presence.webp";
import sceneRecognition from "@/assets/honor-awards-cinematic.webp";

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
 *   Recognition         → honors / awards photoshoot
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
    alt: "SPI Industries · advanced materials industrial operations",
    tint: "linear-gradient(180deg, transparent 55%, oklch(0.48 0.06 55 / 0.06) 100%)",
    overlay: [
      "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.78) 100%)",
      "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 28%, rgba(0,0,0,0.38) 100%)",
    ].join(", "),
    parallax: 0.80,
    filter: "brightness(0.84) contrast(1.06) saturate(0.82)",
    objectPosition: "center center",
  },
  {
    src: sceneRecognition,
    alt: "Recognition · awards and trophies · cinematic institutional archive",
    // Faint cool-silver tint — enhances the atmospheric haze and glass/metal reflections.
    // The image already has the right tonal foundation so this is a very light touch.
    tint: "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.50 0.008 218 / 0.07) 0%, transparent 78%)",
    // Minimal overlay — the image already has a black studio background and
    // dramatic lighting. We only need a soft perimeter vignette and a thin
    // ceiling/floor frame to blend it into the scroll system.
    overlay: [
      // Soft edge vignette — pulls the scroll system's dark border around the image
      "radial-gradient(ellipse 72% 66% at 50% 58%, transparent 0%, transparent 38%, oklch(0.005 0.001 260 / 0.62) 95%)",
      // Ceiling bleed — merges the top of the image into the section above
      "linear-gradient(180deg, oklch(0.005 0.001 260 / 0.78) 0%, transparent 28%)",
      // Floor black-out — deep crush eliminates conference banners at image base.
      // Covers 55% of height from bottom; near-opaque through the bottom third.
      "linear-gradient(0deg, oklch(0.003 0 0 / 0.99) 0%, oklch(0.003 0 0 / 0.98) 20%, oklch(0.004 0.001 260 / 0.90) 34%, oklch(0.004 0.001 260 / 0.60) 46%, transparent 58%)",
    ].join(", "),
    parallax: 0.20,
    filter: "brightness(0.84) contrast(1.12) saturate(0.72) sepia(0.00)",
    // Revert to 50% vertical center so the trophy group stays well-framed;
    // the floor black-out overlay handles the STARTUP banner below.
    objectPosition: "46% 50%",
  },
  {
    src: sceneEcosystem,
    alt: "Ecosystem · operating ecosystem at scale · distributed industrial intelligence",
    tint: "linear-gradient(160deg, oklch(0.18 0.022 240 / 0.10), transparent 52%, oklch(0.08 0.012 232 / 0.14))",
    overlay: [
      // Radial vignette — lighter center so the landscape reads through, darker perimeter
      "radial-gradient(ellipse 68% 76% at 50% 52%, oklch(0.018 0.005 240 / 0.22) 0%, oklch(0.010 0.003 250 / 0.62) 92%)",
      // Ceiling / floor frame — moderate crush, not black
      "linear-gradient(180deg, oklch(0.006 0.002 250 / 0.60) 0%, oklch(0.012 0.004 245 / 0.16) 32%, transparent 52%, oklch(0.010 0.003 250 / 0.44) 100%)",
    ].join(", "),
    parallax: 0.20,
    filter: "brightness(0.68) contrast(1.08) saturate(0.55) sepia(0.04)",
  },
  {
    src: sceneFuture,
    alt: "Future systems · planetary-scale industrial intelligence",
    // Near-black — acts as deep-space fallback while the WebGL canvas fades in.
    // The WebGL scene renders its own cosmic background so this plate is only
    // visible during the chapter transition (opacity < 1).
    tint: undefined,
    overlay:
      "linear-gradient(180deg, oklch(0.010 0.002 250 / 0.96) 0%, oklch(0.008 0.002 250 / 0.98) 100%)",
    parallax: 0.2,
    filter: "brightness(0.22) contrast(1.03) saturate(0.25)",
  },
];

// Per-chapter baseline dim — 7 stops, one per section.
const OVERLAY_STOPS = [
  0.24, // Origin
  0.20, // Founder
  0.16, // Material
  0.15, // Industrial — new SPI exterior has its own cinematic darkness
  0.14, // Recognition — light: cinematic image has its own darkness; global dim completes blend
  0.12, // Ecosystem  — light: overlay stack is now softer; global dim completes the grounding
  0.23, // Future
];

export default function AtmosphereLayer() {
  const phase = useChapterPhase(HOME_CHAPTER_IDS);
  return (
    <AnimatedBackground
      scenes={SCENES}
      overlayStops={OVERLAY_STOPS}
      phaseSource={phase}
      globalVideoSrc="/videos/cinematic-homepage.mp4"
    >
      {({ progress, phase }) => (
        <>
          <RecognitionAmbient phase={phase} />
          <ParticleField progress={progress} phase={phase} />
          <EarthGlobe phase={phase} src={sceneFuture} />
        </>
      )}
    </AnimatedBackground>
  );
}
