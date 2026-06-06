/**
 * Single source of truth for homepage chapter scroll boundaries.
 *
 * Each entry is [bIn, bOut] in scroll-progress space (0 → 1).
 * Both content (ScrollSections) and atmosphere (ChapterAtmosphere)
 * import this so their chapter bands are always identical.
 *
 *  0  Origin                0.000 – 0.120  (0.120)
 *  1  Founder               0.120 – 0.240  (0.120)
 *  2  Material Intelligence 0.240 – 0.360  (0.120)
 *  3  Industrial Translation 0.360 – 0.580 (0.220 — largest narrative weight)
 *  4  Recognition           0.580 – 0.690  (0.110)
 *  5  Ecosystem             0.690 – 0.810  (0.120)
 *  6  Future Systems        0.810 – 1.000  (0.190 — extended close)
 *
 * Sum = 0.120×4 + 0.110 + 0.220 + 0.190 = 1.000 ✓
 */
export const N_CHAPTERS = 7;

export const CHAPTER_BANDS: ReadonlyArray<readonly [number, number]> = [
  [0.000, 0.120],
  [0.120, 0.240],
  [0.240, 0.360],
  [0.360, 0.580],
  [0.580, 0.690],
  [0.690, 0.810],
  [0.810, 1.000],
];

