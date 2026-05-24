export const HOME_CHAPTERS = [
  { id: "spark", label: "Spark", n: "01" },
  { id: "founder", label: "Founder", n: "02" },
  { id: "carbon-intelligence", label: "Carbon Intelligence", n: "03" },
  { id: "industrial", label: "Industrial", n: "04" },
  { id: "recognition", label: "Recognition", n: "05" },
  { id: "ecosystem", label: "Ecosystem", n: "06" },
  { id: "scale-validation", label: "Scale", n: "07" },
  { id: "future", label: "Future", n: "08" },
] as const;

export const HOME_CHAPTER_IDS = HOME_CHAPTERS.map((chapter) => chapter.id);
export const HOME_CHAPTER_COUNT = HOME_CHAPTERS.length;

export type HomeChapter = (typeof HOME_CHAPTERS)[number];