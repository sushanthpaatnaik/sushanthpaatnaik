/**
 * Single source of truth for homepage chapter scroll boundaries.
 *
 * Each entry is [bIn, bOut] in scroll-progress space (0 → 1).
 * Content (ScrollSections), atmosphere (ChapterAtmosphere), the canvas
 * sequence (CanvasLayer) and the chapter rail (HUD) all import this, so
 * their bands are always identical.
 *
 *  0  Origin                    0.000 – 0.161  (0.161)  the workbench
 *  1  Early Works               0.161 – 0.287  (0.126)  the inventor at the bench
 *  2  Presidential Recognition  0.287 – 0.514  (0.227)  the hall
 *  3  Global Recognition        0.514 – 0.643  (0.129)  Earth
 *  4  Advanced Materials        0.643 – 0.769  (0.126)  the graphene lattice
 *  5  Industrial Impact         0.769 – 0.895  (0.126)  the viaduct, then the plant
 *  6  The Work Continues        0.895 – 1.000  (0.105)  the city
 *
 * Sum = 0.161 + 0.126 + 0.227 + 0.129 + 0.126 + 0.126 + 0.105 = 1.000 ✓
 *
 * The chapters are the film's seven scenes, and these edges are not chosen —
 * they are read off the film. The frame map is linear (frame = progress x 480),
 * so a scene change sits wherever its frames sit, and each edge is placed 0.030
 * after the midpoint of the transition that separates two scenes:
 *
 *     transition          midpoint, source frame   in the 481   progress   edge
 *     bloom               35.0                      63.0        0.1313     0.161
 *     dissolve to hall    60.7                     123.4        0.2571     0.287
 *     dissolve to Earth  116.2                     232.2        0.4838     0.514
 *     zoom to lattice    150.0                     294.0        0.6125     0.643
 *     iris to viaduct    180.3                     354.6        0.7388     0.769
 *     burst to city      209.4                     415.4        0.8654     0.895
 *
 * 0.030 is half of CONTENT_FADE. The text hand-over occupies the 0.060 before
 * an edge — the outgoing chapter leaves across the first half, the incoming one
 * arrives across the second — so its empty midpoint is exactly edge - 0.030,
 * and that is where the picture changes. The reader sees the old line leave,
 * the scene turn over with nothing written on it, and the new line arrive on
 * its own footage. Every transition in the cut is shorter than the hand-over
 * it sits in (17-42vh against 60vh), so none of them is ever under settled copy.
 *
 * The widths come from the cut, not the other way round: each scene of the
 * film is slowed by a whole number — see FRAME_COUNT in CanvasLayer and "The
 * story cut" in CLAUDE.md — and those multiples were picked so that every
 * chapter holds for a comfortable read and the hall holds longest. To move an
 * edge, change a multiple and re-export the film; moving the number here alone
 * would put the copy over the wrong scene, which is the defect this arrangement
 * replaced.
 *
 * Holds at full opacity are a band's width less the 0.060 hand-over at its far
 * end: 101, 66, 167, 69, 66, 66vh, and 105vh for the close, which never leaves.
 * That is tighter than the five-chapter page was (90-210vh), because seven
 * chapters share the same 1000vh and pay for six hand-overs instead of four.
 * Each chapter is written to that budget — one headline, a line or two, a link.
 *
 * History, for whoever reads the bands' older notes in git: there were seven
 * bands once before, then five (Founder merged into Origin, Ecosystem into
 * Recognition), in the page's own order — Origin, Material, Industrial,
 * Recognition, Future. The inventor film ran in a different order, so the hall
 * played behind Material and the lattice under Future. These seven are that
 * film's order.
 */
export const N_CHAPTERS = 7;

export const CHAPTER_BANDS: ReadonlyArray<readonly [number, number]> = [
  [0.000, 0.161],
  [0.161, 0.287],
  [0.287, 0.514],
  [0.514, 0.643],
  [0.643, 0.769],
  [0.769, 0.895],
  [0.895, 1.000],
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
 * Hand-over curves: the outgoing element leaves across [0, HANDOVER_OUT] and
 * the incoming one arrives across [HANDOVER_IN, 1] of the same window.
 *
 * Both halves read the same `t`. Where OUT > IN the windows overlap and the two
 * briefly coexist at low opacity; where OUT <= IN they never coexist but the
 * screen can empty between them. See the note on the constants for which of
 * those this page chooses and why.
 */
/* 0.50/0.50 — the outgoing chapter reaches zero at exactly the instant the
   incoming one starts to rise. No overlap, and no gap wide enough to read.

   The history is worth keeping, because two of these three settings were
   chosen for the wrong reason.

   0.46/0.54 put an 8 % dead zone between leaving and arriving — ~90px at
   1440x900 with no text on screen. Sushanth's recordings show it plainly:
   full copy, a completely bare frame, then the next chapter's copy.

   0.68/0.32 overlapped the windows by 36 % to remove that, on the theory that
   the empty beat was the "shake" being reported. It was not. The shake was a
   2.479x fractional resample of the source film baking a periodic step into
   the frames themselves, fixed by regenerating at an integer 2x — see
   FRAME_COUNT in CanvasLayer. With that resolved there is no reason to accept
   two chapters ghosting over each other, which is the defect sequencing exists
   to prevent: measured at 27 text nodes above 25 % opacity before it was
   introduced.

   So 0.50/0.50, the setting that needs neither compromise. fadeOutAt hits 0 at
   t=0.50 and fadeInAt leaves 0 at t=0.50, so the two are never simultaneously
   painted, and the gap is a point rather than a window. A ~54px stretch stays
   below 2 % opacity because smoothstep has flat tails — x^2(3-2x)=0.02 at
   x~0.083 — which is inherent to the curve, not to these offsets, and did not
   read as a fault once the frames were fixed. */
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
