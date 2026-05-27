import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";
import EarthGlobe from "./EarthGlobe";
import RecognitionAmbient from "./RecognitionAmbient";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

import sceneSpark from "@/assets/story-01-spark.webp";
import sceneMaterial from "@/assets/story-03-material.webp";
import sceneIndustrial from "@/assets/story-04-industrial.webp";
import sceneEcosystem from "@/assets/story-06-india.webp";
import sceneFuture from "@/assets/story-07-future.webp";
import sceneFounder from "@/assets/founder-presence.webp";
import sceneRecognition from "@/assets/scene-recognition-archive.webp";

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
    alt: "Industrial translation · infrastructure, manufacturing, energy",
    tint: "linear-gradient(135deg, oklch(0.32 0.07 240 / 0.18) 0%, oklch(0.52 0.10 55 / 0.07) 100%)",
    overlay:
      "linear-gradient(165deg, oklch(0.028 0.006 260 / 0.54) 0%, oklch(0.045 0.018 240 / 0.24) 45%, oklch(0.028 0.006 260 / 0.54) 100%)",
    parallax: 1.15,
    filter: "brightness(0.88) contrast(1.10) saturate(1.00)",
  },
  {
    src: sceneRecognition,
    alt: "Recognition · cinematic institutional archive · awards in darkness",
    // Ultra-restrained cool-silver tint — adds metallic sheen only on highlight peaks.
    // mix-blend-mode:soft-light lets trophy metal catch the light while dark surround stays void.
    tint: "radial-gradient(ellipse 38% 30% at 50% 58%, oklch(0.52 0.008 218 / 0.06) 0%, transparent 72%)",
    // Three-gradient overlay stack:
    //   [1] Deep aperture vignette — near-black perimeter, narrow center window over trophies
    //   [2] Column light window — ceiling/floor crush, open midband for trophy visibility
    //   [3] Cool atmospheric bloom — faint silver over the focal zone
    overlay: [
      "radial-gradient(ellipse 38% 32% at 50% 60%, oklch(0.018 0.004 240 / 0.06) 0%, oklch(0.005 0.001 260 / 0.94) 95%)",
      "linear-gradient(180deg, oklch(0.004 0.001 260 / 0.95) 0%, oklch(0.010 0.002 250 / 0.28) 26%, oklch(0.010 0.002 250 / 0.16) 52%, oklch(0.010 0.002 250 / 0.36) 80%, oklch(0.004 0.001 260 / 0.92) 100%)",
      "radial-gradient(ellipse 44% 28% at 50% 60%, oklch(0.38 0.010 222 / 0.05), transparent 78%)",
    ].join(", "),
    parallax: 0.18,
    // Very low brightness collapses ambient environment to void;
    // high contrast lets trophy highlights emerge; near-zero saturation → silver-graphite tones.
    filter: "brightness(0.34) contrast(1.38) saturate(0.20) sepia(0.00)",
    objectPosition: "center 54%",
  },
  {
    src: sceneEcosystem,
    alt: "Ecosystem · operating ecosystem at scale · distributed industrial intelligence",
    tint: "linear-gradient(160deg, oklch(0.18 0.022 240 / 0.10), transparent 52%, oklch(0.08 0.012 232 / 0.14))",
    overlay: [
      "radial-gradient(ellipse 62% 72% at 50% 52%, oklch(0.018 0.005 240 / 0.52) 0%, oklch(0.010 0.003 250 / 0.86) 92%)",
      "linear-gradient(180deg, oklch(0.006 0.002 250 / 0.82) 0%, oklch(0.012 0.004 245 / 0.28) 34%, transparent 54%, oklch(0.010 0.003 250 / 0.62) 100%)",
    ].join(", "),
    parallax: 0.20,
    filter: "brightness(0.60) contrast(1.10) saturate(0.52) sepia(0.05)",
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
  0.19, // Industrial
  0.10, // Recognition — very low: filter is now extremely dark; near-zero global dim to avoid double-crush
  0.14, // Ecosystem  — reduced: heavy blur+darken filter; avoid double-dimming
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
          <RecognitionAmbient phase={phase} />
          <ParticleField progress={progress} phase={phase} />
          <EarthGlobe phase={phase} src={sceneFuture} />
        </>
      )}
    </AnimatedBackground>
  );
}
