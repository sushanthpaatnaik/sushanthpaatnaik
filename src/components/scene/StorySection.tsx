import { motion } from "framer-motion";

export interface StoryChapter {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
}

function SectionCopy({
  eyebrow,
  title,
  body,
  align,
  index,
  total,
}: {
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
  index: number;
  total: number;
}) {
  const textAlign =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
        ? "mr-auto md:ml-auto md:mr-0 text-left md:text-right"
        : "mr-auto text-left";



  return (
    <div className={`max-w-2xl pointer-events-auto ${textAlign}`}>
      <motion.div
        initial={{ opacity: 0, scaleX: 0.2, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.32 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className={`h-px w-20 md:w-24 mb-7 md:mb-8 origin-left bg-gradient-to-r from-primary via-accent to-transparent ${align === "right" ? "md:ml-auto md:origin-right md:bg-gradient-to-l" : ""} ${align === "center" ? "mx-auto" : ""}`}
      />
      <motion.p
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.32 }}
        transition={{ duration: 1.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 44, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.32 }}
        transition={{ duration: 1.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[clamp(1.9rem,6.2vw,4.4rem)] leading-[1.04] md:leading-[1.02] tracking-[-0.025em] md:tracking-[-0.032em] font-medium text-gradient mb-7 md:mb-8 [text-wrap:balance] break-words hyphens-auto"
        style={{ overflowWrap: "break-word" }}
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 1.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md"
      >
        {body}
      </motion.p>

    </div>
  );
}

interface StorySectionProps {
  chapter: StoryChapter;
  index: number;
  total: number;
}

/** Sticky-pinned narrative panel for one chapter of the scroll story. */
export default function StorySection({ chapter, index, total }: StorySectionProps) {
  return (
    <section id={chapter.id} className="story-panel relative min-h-[calc(var(--viewport-height)*1.24)] px-6 sm:px-8 md:px-20 lg:pl-32 lg:pr-16 xl:pl-36 xl:pr-20">
      <div className="viewport-stage sticky top-0 flex items-center overflow-x-clip pt-28 md:pt-24 pb-12 render-stable">
        <motion.div
          initial={{ opacity: 0.55, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full render-stable"
        >
          <SectionCopy
            eyebrow={chapter.eyebrow}
            title={chapter.title}
            body={chapter.body}
            align={chapter.align}
            index={index}
            total={total}
          />
        </motion.div>
      </div>
    </section>
  );
}
