import StorySection, { type StoryChapter } from "./StorySection";

interface ScrollStoryProps {
  chapters: readonly StoryChapter[];
  /** Total chapter count (including chapters rendered outside this list, e.g. hero / closing). */
  total?: number;
  /** Offset to apply to the visible chapter index (default 1 — assumes hero is chapter 01). */
  startIndex?: number;
}

/**
 * Renders an ordered list of sticky StorySection panels. The hero (chapter 01)
 * and closing CTA (chapter N) are rendered outside; pass the middle chapters here.
 */
export default function ScrollStory({
  chapters,
  total,
  startIndex = 1,
}: ScrollStoryProps) {
  const resolvedTotal = total ?? chapters.length + startIndex;
  return (
    <>
      {chapters.map((chapter, i) => (
        <StorySection
          key={chapter.id}
          chapter={chapter}
          index={i + startIndex}
          total={resolvedTotal}
        />
      ))}
    </>
  );
}
