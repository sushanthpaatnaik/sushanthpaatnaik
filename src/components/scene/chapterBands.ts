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

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * smoothstep — symmetric S-curve. t=0.25 → 16 %, t=0.5 → 50 %, t=0.75 → 84 %.
 *
 * Replaced easeOutQuint, which reached 97 % by t=0.50: fine for a 10vh snap,
 * wrong once the hand-over is long enough to read.
 */
export const smoothstep = (t: number): number => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * Sequenced hand-over: leave across the first half of a window, arrive across
 * the second, meeting at a point.
 *
 * Both halves read the same `t`, so wherever an outgoing element's window and
 * an incoming element's window are the same interval, the two are never both
 * painted — not at 50 %, not at 5 %. See the long note in ScrollSections for
 * why chapters sequence rather than cross-dissolve.
 */
/* 0.50/0.50 — the outgoing chapter reaches zero at exactly the instant the
   incoming one starts to rise. No overlap, and no gap either.

   These were 0.46/0.54, which put an 8 % dead zone between them: measured on a
   1440x900 desktop, ~90px of scrolling at the Recognition -> Future edge with
   no text on screen at all. That was deliberate — it guarantees two chapters
   can never be painted at once — but it is also what Sushanth kept reporting
   as a glitch at that exact position, through four unrelated fixes. Watching
   it as a reader rather than as a test: the copy vanishes, the bare film runs
   for a beat, then different copy appears. That reads as a fault, not a cut,
   and the denser the two compositions either side, the more it reads that way.
   Recognition and Future are the two densest on the page.

   Touching at 0.50 keeps the property the gap existed to protect. fadeOutAt
   hits 0 at t=0.50 and fadeInAt leaves 0 at t=0.50, so the two are still never
   simultaneously painted — the overlap is a single point of zero width rather
   than an 8 % window. The hand-over becomes continuous instead of punctuated. */
export const HANDOVER_OUT = 0.50;
export const HANDOVER_IN = 0.50;
export const fadeOutAt = (t: number) => smoothstep(1 - clamp01(t / HANDOVER_OUT));
export const fadeInAt = (t: number) => smoothstep(clamp01((t - HANDOVER_IN) / (1 - HANDOVER_IN)));

/**
 * Width of the colour-grade hand-over, in absolute scroll progress, centred on
 * the band edge.
 *
 * Deliberately wider than CONTENT_FADE and centred differently. The text
 * hand-over sits entirely in the 60vh *before* an edge; the grade straddles it,
 * ±50vh. Two reasons:
 *
 *  - The tint change no longer peaks inside the image-only beat. That beat is
 *    the one moment on the page with no text on it, so anything that changes
 *    there changes in full view with nothing to mask it. Recognition is
 *    white-gold (hue ~85°) and Future is electric blue (hue 242°) — the largest
 *    hue step in the sequence, and it was landing exactly there.
 *  - Spread over ~100vh at opacities of 0.07–0.105, the per-frame delta is
 *    below the noise floor of the footage, so the grade reads as a property of
 *    the image rather than as an event.
 *
 * This used to be a CSS `transition: opacity 1.4s ease` fired by the discrete
 * `getChapterFromProgress` step — a wall-clock tween on a scroll-driven page.
 * Measured: jump the scroll across the Recognition → Future edge and hold
 * perfectly still, and the whole frame kept changing colour for two more
 * seconds (0.07/0 → 0.053/0.026 at 900 ms → 0.006/0.096 at 1400 ms → 0/0.105
 * at 2000 ms). Scrubbing dragged the tint up to 1.4s behind the frame it was
 * grading. Everything else on this page is a pure function of scroll position;
 * the grade is now too.
 */
export const GRADE_FADE = 0.10;

/**
 * Opacity multiplier for chapter `n`'s colour grade at scroll progress `sp`,
 * as a fraction of that grade's own peak opacity (0 → 1).
 *
 * Sequenced rather than cross-dissolved, like the text — but here the reason is
 * compositing, not legibility. The grades are `mix-blend-mode: color` layers
 * stacked in the same parent, so while two are simultaneously non-zero the
 * upper one re-tints the already-tinted result. That is not a point on the path
 * between the two colours, and it was visible as a muddy ~1s intermediate every
 * time the chapter changed. Sequencing means only ever one is on.
 */
export function gradeOpacityAt(sp: number, n: number): number {
  const [bIn, bOut] = CHAPTER_BANDS[n];
  const half = GRADE_FADE / 2;

  // Arrive across [bIn - half, bIn + half]; the first chapter has nothing to
  // arrive from and is pinned on from the top of the page.
  const arrive = n === 0 ? 1 : fadeInAt((sp - (bIn - half)) / GRADE_FADE);
  // Leave across [bOut - half, bOut + half]; the last chapter never leaves.
  const leave = n === N_CHAPTERS - 1 ? 1 : fadeOutAt((sp - (bOut - half)) / GRADE_FADE);

  return Math.min(arrive, leave);
}
