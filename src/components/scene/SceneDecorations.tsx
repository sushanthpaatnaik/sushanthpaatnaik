import { useScroll } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";
import RecognitionAmbient from "./RecognitionAmbient";
import ParticleField from "./ParticleField";

export default function SceneDecorations() {
  const { scrollYProgress } = useScroll();
  const phase = useChapterPhase(HOME_CHAPTER_IDS);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      <RecognitionAmbient phase={phase} />
      <ParticleField progress={scrollYProgress} phase={phase} />
    </div>
  );
}
