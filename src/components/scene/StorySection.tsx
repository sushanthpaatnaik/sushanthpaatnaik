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
  const counterPosition =
    align === "right" ? "left-10" : align === "left" ? "right-10" : "right-10";

  return (
    <div className={`max-w-xl pointer-events-auto ${textAlign}`}>
      <motion.div
        initial={{ opacity: 0, scaleX: 0, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ duration: 1.15, ease: [0.19, 1, 0.22, 1] }}
        className={`h-px w-20 md:w-24 mb-7 md:mb-8 origin-left bg-gradient-to-r from-primary via-accent to-transparent ${align === "right" ? "md:ml-auto md:origin-right md:bg-gradient-to-l" : ""} ${align === "center" ? "mx-auto" : ""}`}
      />
      <motion.p
        initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ duration: 1.05, delay: 0.04, ease: [0.19, 1, 0.22, 1] }}
        className="text-[10px] uppercase tracking-[0.5em] text-primary/90 mb-6"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 64, filter: "blur(16px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.55 }}
        transition={{ duration: 1.15, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        className="font-display text-[clamp(2rem,9vw,5rem)] leading-[1.02] md:leading-[1] tracking-[-0.03em] md:tracking-[-0.035em] font-medium text-gradient mb-7 md:mb-8"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 56, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.05, delay: 0.18, ease: [0.19, 1, 0.22, 1] }}
        className="text-base md:text-lg text-muted-foreground/90 leading-relaxed max-w-md"
      >
        {body}
      </motion.p>

      <div
        className={`absolute top-10 hidden md:block font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 ${counterPosition}`}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
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
    <section id={chapter.id} className="story-panel relative min-h-[calc(var(--viewport-height)*1.24)] px-5 sm:px-6 md:px-20">
      <div className="viewport-stage sticky top-0 flex items-center overflow-clip pt-28 md:pt-24 pb-12 render-stable">
        <motion.div
          initial={{ opacity: 0.65, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
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
