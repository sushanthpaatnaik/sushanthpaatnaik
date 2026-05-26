import AnimatedBackground, { type BackgroundScene } from "./AnimatedBackground";
import ParticleField from "./ParticleField";
import EarthGlobe from "./EarthGlobe";
import EarthLivingScene from "./EarthLivingScene";
import RecognitionAmbient from "./RecognitionAmbient";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";

import sceneSpark from "@/assets/story-01-spark.webp";

import sceneMaterial from "@/assets/story-03-material.webp";
import sceneIndustrial from "@/assets/story-04-industrial.webp";
import sceneFuture from "@/assets/story-07-future.webp";
import sceneFounder from "@/assets/founder-presence.webp";
import sceneRecognition from "@/assets/honor-index-rail.webp";

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
    alt: "Recognition · awards and honours — institutional archive",
    // Soft-light tint: warm museum gold concentrated over the trophy midline.
    // mix-blend-mode:soft-light amplifies warm highlights on reflective trophy surfaces
    // while leaving the already-dark surround untouched.
    tint: "radial-gradient(ellipse 55% 44% at 50% 60%, oklch(0.60 0.028 52 / 0.13) 0%, oklch(0.28 0.012 44 / 0.04) 58%, transparent 80%)",
    // Two-gradient overlay stack:
    //   [1] Aperture vignette — deep elliptical falloff opens toward trophy line
    //   [2] Column lighting — dark ceiling + dark floor, open center window
    overlay: [
      "radial-gradient(ellipse 52% 44% at 50% 60%, oklch(0.022 0.005 52 / 0.18) 0%, oklch(0.012 0.002 260 / 0.82) 92%)",
      "linear-gradient(180deg, oklch(0.006 0.002 260 / 0.80) 0%, oklch(0.015 0.003 260 / 0.26) 30%, transparent 50%, oklch(0.015 0.003 260 / 0.36) 78%, oklch(0.006 0.002 260 / 0.78) 100%)",
    ].join(", "),
    parallax: 0.30,
    // Higher contrast sharpens trophy detail; reduced saturation + faint sepia
    // push toward archival institutional tone rather than commercial photoshoot.
    filter: "brightness(0.58) contrast(1.18) saturate(0.60) sepia(0.07)",
    objectPosition: "center 58%",
  },
  {
    // No image — pure atmospheric depth composition.
    // Spatial presence through layered gradients: luminous column, side recession,
    // horizon band, structural black. No polygon geometry, no network diagram.
    alt: "Ecosystem · atmospheric systems depth · distributed planetary intelligence",
    overlay: [
      // Luminous atmospheric column — central depth corridor, barely perceptible
      "radial-gradient(ellipse 40% 70% at 52% 40%, oklch(0.050 0.014 234 / 0.38) 0%, oklch(0.018 0.006 242 / 0.0) 72%)",
      // Side atmospheric recession — infinite lateral depth
      "radial-gradient(ellipse 65% 80% at 20% 50%, oklch(0.028 0.008 244 / 0.28) 0%, transparent 62%)",
      "radial-gradient(ellipse 55% 72% at 80% 54%, oklch(0.024 0.006 238 / 0.22) 0%, transparent 56%)",
      // Horizon luminescence — faint systems activity at planetary scale
      "radial-gradient(ellipse 100% 24% at 50% 72%, oklch(0.042 0.012 232 / 0.24) 0%, transparent 62%)",
      // Structural black — ceiling/floor compression
      "linear-gradient(180deg, oklch(0.005 0.002 250 / 0.92) 0%, transparent 30%, transparent 65%, oklch(0.005 0.002 250 / 0.82) 100%)",
    ].join(", "),
    parallax: 0.18,
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
  0.16, // Recognition — reduced: per-scene filter is darker; less global dim needed
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
