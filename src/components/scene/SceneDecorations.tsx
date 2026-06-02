import { useScroll, useSpring } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";
import RecognitionAmbient from "./RecognitionAmbient";
import ParticleField from "./ParticleField";
import EarthGlobe from "./EarthGlobe";
import sceneFuture from "@/assets/story-07-future.webp";

/**
 * Decorative scene elements that previously lived inside AtmosphereLayer's
 * children prop. Extracted here so they can survive the background-system
 * replacement and keep rendering above the CinematicLayer overlays.
 */
export default function SceneDecorations() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 14,
    damping: 58,
    mass: 1.45,
  });
  const phase = useChapterPhase(HOME_CHAPTER_IDS);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      <RecognitionAmbient phase={phase} />
      <ParticleField progress={progress} phase={phase} />
      <EarthGlobe phase={phase} src={sceneFuture} />
    </div>
  );
}
