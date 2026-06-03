/**
 * Single source of truth for homepage chapter scroll boundaries.
 *
 * Each entry is [bIn, bOut] in scroll-progress space (0 → 1).
 * Both content (ScrollSections) and atmosphere (ChapterAtmosphere)
 * import this so their chapter bands are always identical.
 *
 *  0  Origin                0.000 – 0.130  (0.130)
 *  1  Founder               0.130 – 0.260  (0.130)
 *  2  Material Intelligence 0.260 – 0.390  (0.130)
 *  3  Industrial Translation 0.390 – 0.580 (0.190 — 46 % wider)
 *  4  Recognition           0.580 – 0.700  (0.120)
 *  5  Ecosystem             0.700 – 0.830  (0.130)
 *  6  Future Systems        0.830 – 1.000  (0.170)
 *
 * Sum = 0.130×5 + 0.190 + 0.120 + 0.170 = 1.000 ✓
 */
export const N_CHAPTERS = 7;

export const CHAPTER_BANDS: ReadonlyArray<readonly [number, number]> = [
  [0.000, 0.130],
  [0.130, 0.260],
  [0.260, 0.390],
  [0.390, 0.580],
  [0.580, 0.700],
  [0.700, 0.830],
  [0.830, 1.000],
];
