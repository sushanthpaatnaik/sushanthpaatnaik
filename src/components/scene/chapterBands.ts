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
