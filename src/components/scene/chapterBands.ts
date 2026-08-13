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
 *  1  Material Intelligence  0.240 – 0.420  (0.180)
 *  2  Industrial Translation 0.420 – 0.610  (0.190)
 *  3  Recognition & Ecosystem 0.610 – 0.810 (0.200 — record, then the directory)
 *  4  Future Systems         0.810 – 1.000  (0.190 — extended close)
 *
 * Sum = 0.240 + 0.180 + 0.190 + 0.200 + 0.190 = 1.000 ✓
 *
 * Material has been widened twice, both times because a fixed-length dissolve
 * costs a narrow band proportionally more than a wide one.
 *
 * First 0.120 → 0.150, when the cross-fade was widened to a readable length:
 * at 0.120 Material spent half its span dissolving (23 % in, 52 % hold, 25 %
 * out) while every other chapter held for ~70 %, and Industrial — then the
 * widest — lent the 0.030.
 *
 * Then 0.150 → 0.180, after the page was shortened to 1100vh. Even at 0.150,
 * Material held at full opacity for only 0.96 of a phone screen — one thumb
 * flick end to end, against Origin's 1.83. Recognition lends this 0.030: it
 * was the longest hold at 1.75 screens and drops to ~1.5, which it can carry.
 * Industrial keeps its width and simply starts 0.030 later.
 *
 * Both boundaries this moves sit inside continuous footage — the founder over
 * the lattice runs unbroken from ~0.32 to ~0.46, and the Industrial/
 * Recognition hand-over stays inside the same interior sequence — so no
 * text/frame pairing is disturbed. Verify that before moving them again.
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
  [0.240, 0.420],
  [0.420, 0.610],
  [0.610, 0.810],
  [0.810, 1.000],
];

/**
 * Width of the content cross-fade, in absolute scroll progress.
 *
 * 0.060 of a 1000vh page ≈ 60vh — roughly two thirds of a screen of scrolling
 * for one chapter to hand over to the next. It was 0.043 while travel was
 * 1520vh; both numbers describe the same ~60–65vh dissolve, because this is a
 * fraction of total progress and the page got shorter (see TOTAL_VH).
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
export const CONTENT_FADE = 0.060;

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
