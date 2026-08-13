/**
 * Single source of truth for homepage chapter scroll boundaries.
 *
 * Each entry is [bIn, bOut] in scroll-progress space (0 → 1).
 * Content (ScrollSections), atmosphere (ChapterAtmosphere), the canvas
 * sequence (CanvasLayer) and the chapter rail (HUD) all import this, so
 * their bands are always identical.
 *
 *  0  Origin                 0.000 – 0.210  (0.210 — opens on Earth, dissolves
 *                                            into the founder's lab; carries
 *                                            the hero and the founder voice)
 *  1  Material Intelligence  0.210 – 0.390  (0.180)
 *  2  Industrial Translation 0.390 – 0.550  (0.160)
 *  3  Recognition & Ecosystem 0.550 – 0.750 (0.200 — record, then the directory)
 *  4  Future Systems         0.750 – 1.000  (0.250 — five staged phone states)
 *
 * Sum = 0.210 + 0.180 + 0.160 + 0.200 + 0.250 = 1.000 ✓
 *
 * Bands are sized by how many *states* a chapter renders on a phone, not by
 * how much desktop copy it holds. Counting mobile states — Origin has two
 * beats, Recognition two, Material and Industrial one each, Future five — the
 * old split gave Industrial 190vh for a single composition while Future had
 * 190vh to divide five ways, 38vh apiece.
 *
 * Future's 0.060 comes half from Industrial and half from Origin. Taking the
 * whole of it from Industrial was measured first and over-corrected: at 0.130
 * Industrial's desktop hold fell to 70vh — 0.7 of a screen for a heading, a
 * paragraph, a venture line and two links, tighter than Material had been
 * before it was widened. Origin, holding 1.8 screens, was the chapter with
 * slack to give.
 *
 * Material widened twice for the same reason — a fixed-length hand-over costs
 * a narrow band proportionally more than a wide one. 0.120 → 0.150 when the
 * hand-over was first widened to a readable length (at 0.120 it spent half its
 * span in transition while every other chapter held for ~70 %), then 0.150 →
 * 0.180 after the page was shortened to 1100vh, where it was still holding for
 * only 0.96 of a phone screen against Origin's 1.83. It is now 1.26 screens.
 *
 * Every boundary moved so far sits inside continuous footage — the founder
 * over the lattice runs unbroken from ~0.32 to ~0.46, and the interior
 * sequence carries the Industrial → Recognition → Future hand-overs — so no
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
  [0.000, 0.210],
  [0.210, 0.390],
  [0.390, 0.550],
  [0.550, 0.750],
  [0.750, 1.000],
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
