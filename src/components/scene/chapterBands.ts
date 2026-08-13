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
 *  1  Material Intelligence  0.240 – 0.390  (0.150)
 *  2  Industrial Translation 0.390 – 0.580  (0.190)
 *  3  Recognition & Ecosystem 0.580 – 0.810 (0.230 — record, then the directory)
 *  4  Future Systems         0.810 – 1.000  (0.190 — extended close)
 *
 * Sum = 0.240 + 0.150 + 0.190 + 0.230 + 0.190 = 1.000 ✓
 *
 * The Material/Industrial boundary moved 0.360 → 0.390. Once the cross-fade
 * was widened to a readable length, Material was the one chapter whose band
 * could not absorb it: at 0.120 it spent half its span dissolving (23 % in,
 * 52 % hold, 25 % out) while every other chapter held for ~70 %. Industrial
 * was the widest, so it lends the 0.030. Nothing else shifts, and the footage
 * runs continuous through that boundary — it is one unbroken shot of the
 * founder over the lattice from ~0.32 to ~0.43 — so no text/frame pairing is
 * disturbed by moving it.
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
  [0.240, 0.390],
  [0.390, 0.580],
  [0.580, 0.810],
  [0.810, 1.000],
];

/**
 * Width of the content cross-fade, in absolute scroll progress.
 *
 * 0.043 of a 1520vh page ≈ 65vh — roughly two thirds of a screen of scrolling
 * for one chapter to hand over to the next.
 *
 * This used to be a *fraction of the band* (0.057), which made the dissolve
 * 0.057 × band wide: 10vh for Material, 19vh for Recognition. At 10vh a single
 * wheel notch completed an entire chapter transition, so chapters snapped
 * rather than dissolved even though each one then held for 180–350vh. The
 * complaint that "transitions happen too fast" was about these windows, not
 * about the holds.
 *
 * Absolute rather than band-relative matters for correctness, not just length:
 * because bOut of chapter n equals bIn of chapter n+1, a constant width makes
 * the outgoing chapter's fade-out window and the incoming chapter's fade-in
 * window the *same interval*. Band-relative widths differ per chapter, so at
 * this length they would drift apart and leave a stretch where one chapter has
 * started fading and the next has not begun — a visible dip to no text.
 */
export const CONTENT_FADE = 0.043;

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
    const [bIn] = CHAPTER_BANDS[i];
    const threshold = i === 0 ? 0 : bIn - CONTENT_FADE / 2;
    if (sp >= threshold) return i;
  }
  return 0;
}
