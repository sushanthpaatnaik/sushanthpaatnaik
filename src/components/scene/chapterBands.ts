/**
 * Single source of truth for homepage chapter scroll boundaries.
 *
 * Each entry is [bIn, bOut] in scroll-progress space (0 → 1).
 * Content (ScrollSections), atmosphere (ChapterAtmosphere), the canvas
 * sequence (CanvasLayer) and the chapter rail (HUD) all import this, so
 * their bands are always identical.
 *
 *  0  Origin                 0.000 – 0.240  (0.240 — opens on Earth, dissolves
 *                                            into the founder's lab; carries
 *                                            the hero and the founder voice)
 *  1  Material Intelligence  0.240 – 0.360  (0.120)
 *  2  Industrial Translation 0.360 – 0.580  (0.220 — largest narrative weight)
 *  3  Recognition & Ecosystem 0.580 – 0.810 (0.230 — record, then the directory)
 *  4  Future Systems         0.810 – 1.000  (0.190 — extended close)
 *
 * Sum = 0.240 + 0.120 + 0.220 + 0.230 + 0.190 = 1.000 ✓
 *
 * Previously seven bands: Founder was its own chapter between Origin and
 * Material, and Ecosystem its own chapter after Recognition. Those merged
 * into their neighbours, so each merged band is exactly the sum of the two
 * it replaced and every other boundary is unchanged — the pacing of the
 * surviving chapters is identical to before.
 */
export const N_CHAPTERS = 5;

export const CHAPTER_BANDS: ReadonlyArray<readonly [number, number]> = [
  [0.000, 0.240],
  [0.240, 0.360],
  [0.360, 0.580],
  [0.580, 0.810],
  [0.810, 1.000],
];

/**
 * Width of the content cross-fade, as a fraction of a chapter's band.
 * ScrollSections fades chapter n in over [bIn - OV*width, bIn] while the
 * previous one fades out across the same span, so the two are equal at the
 * midpoint of that window.
 */
export const CONTENT_FADE = 0.057;

/**
 * Which chapter owns the frame at scroll progress `sp`.
 *
 * Shared by the chapter rail (HUD) and the canvas colour grade so the label,
 * the grade and the content can never disagree.
 *
 * The threshold is the cross-fade midpoint — the moment the incoming chapter
 * becomes the dominant thing on screen — not a point inside its band. An
 * earlier version used `bIn + 5% of band`, which switched roughly 2% of total
 * scroll *after* the new chapter had already reached full opacity: entering
 * Future Systems, the rail still read "Recognition & Ecosystem" for about
 * 30vh of scrolling, and the colour grade lagged with it.
 */
export function getChapterFromProgress(sp: number): number {
  for (let i = CHAPTER_BANDS.length - 1; i >= 0; i--) {
    const [bIn, bOut] = CHAPTER_BANDS[i];
    const threshold = i === 0 ? 0 : bIn - (CONTENT_FADE * (bOut - bIn)) / 2;
    if (sp >= threshold) return i;
  }
  return 0;
}
