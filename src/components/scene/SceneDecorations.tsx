import { useScroll } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";
import ParticleField from "./ParticleField";

// RecognitionAmbient used to render here as well: a ceiling crush, a floor
// crush, three spotlight columns and a shimmer, all placed for the trophy
// tableau in the film before last. Over the inventor film's hall they lit
// nothing that is there and took the top half of the frame to 97% black, on
// top of the veil the Presidential chapter already carries — and only on
// machines capable enough to mount this layer, so the same chapter looked one
// way on a laptop and another on a phone. The chapter's own veil does the work
// everywhere now, and the layer is no longer mounted. (The component file is
// still in the tree: AtmosphereLayer imports it, and AtmosphereLayer itself is
// not mounted by any route.)
export default function SceneDecorations() {
  const { scrollYProgress } = useScroll();
  const phase = useChapterPhase(HOME_CHAPTER_IDS);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[2] overflow-clip pointer-events-none"
      style={{ contain: "layout paint style", touchAction: "pan-y" }}
    >
      <ParticleField progress={scrollYProgress} phase={phase} />
    </div>
  );
}
