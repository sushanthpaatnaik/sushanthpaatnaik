import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";
import RecognitionAmbient from "./RecognitionAmbient";
import ParticleField from "./ParticleField";
import EarthGlobe from "./EarthGlobe";
import sceneFuture from "@/assets/story-07-future.webp";

// Industrial chapter index — matches HOME_CHAPTER_IDS position for "industrial"
const INDUSTRIAL_IDX = 3;

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

  // SPI facility video fades in during the Industrial chapter and out again.
  // Span 0.75 is tighter than the chapter atmosphere span so it never fully
  // competes with adjacent chapters. The loop restart is invisible because the
  // video is near-transparent at chapter boundaries.
  const industrialOpacity = useTransform(phase, (p) => {
    const d = Math.abs(p - INDUSTRIAL_IDX);
    if (d >= 0.75) return 0;
    const t = 1 - d / 0.75;
    return t * t * (3 - 2 * t);
  });

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      {/* SPI Industries facility — cinematic operational overlay for Industrial chapter */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: industrialOpacity }}
      >
        <video
          src="/videos/spi-industry-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>

      <RecognitionAmbient phase={phase} />
      <ParticleField progress={progress} phase={phase} />
      <EarthGlobe phase={phase} src={sceneFuture} />
    </div>
  );
}
