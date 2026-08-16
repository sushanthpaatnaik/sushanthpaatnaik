# Homepage motion system — FROZEN

The cinematic scroll system on `/` is frozen as of `17d221c8`. Do not retune
easing, smoothing, transition overlap, retention or prefetch behaviour without
first reproducing a specific, measurable defect.

This is not a style preference. Three separate tuning attempts were measured
against the live build and all three were reverted because none produced an
improvement distinguishable from run-to-run variance. Changing these values
again without evidence is more likely to regress the site than improve it.

## What is frozen

| Setting | Value | File |
|---|---|---|
| Lenis lerp | 0.12 | `useLenis.ts` |
| Lenis wheelMultiplier | 1.0 | `useLenis.ts` |
| Lenis on touch / reduced motion | never constructed | `useLenis.ts` |
| `HANDOVER_OUT` / `HANDOVER_IN` | 0.50 / 0.50 | `chapterBands.ts` |
| `CHAPTER_BANDS` | 0 / .21 / .39 / .55 / .75 | `chapterBands.ts` |
| `FRAME_COUNT` | 381 | `CanvasLayer.tsx` |
| `RETAIN_RADIUS` | 40 desktop, 55 touch | `CanvasLayer.tsx` |
| `FALLBACK_RADIUS` | 14 | `CanvasLayer.tsx` |
| `BLEND_STEPS` | 12, desktop only | `CanvasLayer.tsx` |
| `MAX_INFLIGHT` / `START_INFLIGHT` | 12 / 4 desktop, 6 / 3 touch | `CanvasLayer.tsx` |
| `INITIAL_AHEAD` | 32 desktop, 24 touch | `CanvasLayer.tsx` |
| DPR cap | `min(rawDpr, 2, fit)`, floored at 1 | `CanvasLayer.tsx` |

There is exactly ONE smoothing layer: Lenis, desktop only. `scroll-behavior:
auto !important` disables the browser's own, and no `useSpring` is applied to
any scroll value the homepage mounts. Do not add a second one.

## Measured baselines

Re-measure against these before claiming an improvement.

- Determinism: five positions (2700/4050/5400/6750/7920) approached from above
  and below give identical desired frame, selected frame, chapter and canvas
  pixel hash. This is the strongest invariant on the page — do not break it.
- Shot boundaries: never draws a frame from a non-adjacent chapter, forward or
  reverse. The ±1 frame seen exactly at a seam is the cross-dissolve.
- Arbitrary stops: 6 desktop and 4 mobile viewports, max 1 chapter readable at
  a time, 0 coexistence, 0 overflow, 0 blanks, 0 film/copy mismatch.
- Main thread during scroll: 81.2% idle at 1920x1080. All site JS under 2% of
  samples. React and framer-motion ~0%.
- Loading: 33 frames requested initially of 381, 71 resident at rest, peak 12
  concurrent, CLS 0. LCP ~800ms serving the deployed build locally; the figure
  measured through a proxy mirror is inflated by the proxy, not the site.
- Decoded memory: ~1.36 GB parked mid-film desktop, ~402 MB portrait mobile.
  Scales at 8.29 MB per retained frame (1920x1080x4).
- Draw scale: 1.00x on every desktop and mobile viewport. No upscaling.

## Known, deliberate, NOT defects

- **~70px of fully-faded copy at each chapter seam.** Measured 70px below 5%
  opacity, 50-60px below 2%, out of 9000px of travel. This is the 0.50/0.50
  handover: the outgoing chapter reaches zero as the incoming one starts, so
  the two are never painted together. Both alternatives were tried and were
  worse — 0.46/0.54 opened a readable dead zone, 0.68/0.32 put 27 text nodes
  above 25% opacity simultaneously. Do not "fix" this.
- **Reverse scroll trails the benchmark.** At 960x540: ~36 fps and 4-5 long
  tasks per run, against grafillium.com's locked ~60 fps and zero. Forward
  scroll *beats* it — ~34 fps against their 24-32. The asymmetry is
  architectural: a scroll-driven image sequence must decode a new frame per
  position, while a video-and-DOM page has nothing to produce on the way back
  up. The only lever that moves it is a larger retention window, which costs
  memory at 8.29 MB a frame.

## Measuring this page in a container without a GPU

Frame rate here is fill-rate bound: it scales inversely with canvas area at a
near-constant ~10 Mpx/s, which is software rasterisation. A real GPU does
billions. So per-viewport fps measures canvas size, not motion quality, and a
full-size head-to-head against a DOM-and-video site is meaningless — it charges
this page's full-screen canvas enormously and the other site almost nothing.
Measure at 960x540 or smaller, where fill rate is not the ceiling, or on real
hardware. Prefer main-thread metrics (long tasks, blocking time, idle share)
which are portable.

## Unfreeze rule

Change the motion system only when you can state: the defect, the viewport and
input that reproduces it, the measurement showing it, and the measurement
showing the fix — with enough runs that the effect exceeds run-to-run variance.
Reverse-scroll blocking time varies by ±30ms on a mean of ~70ms; three samples
cannot resolve a real change there.

# /innovations product panel — FROZEN

The 25-product catalogue and its inspection panel are frozen as of `cfe49eba`.
Do not change the imagery contract, the title type scale, the header layout or
the caption row without first reproducing a specific, measurable defect.

Everything below was fixed in response to a reported defect and verified on the
deployed build. Three of the four fixes exist because an earlier pass changed
one of these things without measuring.

## The imagery contract

Every product carries exactly three images. This is the whole point of the page
and the thing that broke:

| Slot | Directory | Renders as |
|---|---|---|
| `img` | `assets/innovations/` | card thumbnail |
| `cutout` | `assets/innovations/cutouts/` | panel hero, "Archive · Studio capture" |
| `application` | `assets/innovations/applications/` | second frame, "Application · Field" |

25 files in each directory, no gaps. `application` is **optional in the type on
purpose**: an entry without a genuine field frame must leave it off, and the
panel drops the slot and lets the capture note take the row.

**Never fall back to `img` for the application slot.** A `detailImg ?? img`
fallback is exactly what shipped the product photograph twice, the second time
captioned "Application", and it is the defect this whole section exists to
prevent. A re-crop or regrade of the product photo is the same defect wearing a
different filename — `applications/thermal-paste.webp` was a 1024² re-encode of
its own bench macro and `applications/graphene-fabric.webp` was a 16 KB
near-featureless crop, and both were deleted rather than kept.

New application frames: 1024px on the long edge, quality 84, native aspect. Do
not square them — the slot is `aspect-[1.15/1]` with `object-cover`, so it trims
the sides and the subject stays centred. Aquamax is 1264×848, so non-square
already matches the set. The two most recent are 72 KB and 58 KB.

## Asset filenames follow the product, unless they are descriptive

A file named after a product moves when the product is renamed —
`fibrasphene.webp` → `vitraphene.webp`, all three directories, plus the import
identifiers. A descriptive filename stays: `thermal-paste.webp` and
`graphene-fabric.webp` belong to Thermene and Texaphene and did not move,
because the name still describes the photograph.

This rule is not cosmetic. Leaving `thermaphene.webp` bound to a product no
longer called that, while a *different* product on the same page was called
Thermaphene, is how a future edit picks the wrong file.

## Names

25 products, 25 unique titles, verified against both the rendered grid and the
JSON-LD `ItemList`. Two pairs used to collide or near-collide and no longer do:
Thermene / Thermaphene are different programmes (thermal interface compound,
Commercial · Thermal · Interfaces; smart thermal fabric, R&D · Smart Textiles),
and Texaphene / Vitraphene replaced Fibraphene / Fibrasphene, which sat one
letter apart in the same catalogue.

Titles are Title Case and carry no trademark symbol. The panel prints the title
verbatim, so one all-caps or one ™ among twenty-five reads as a typo.

## Title type scale — do not restore `md:text-5xl`

`text-3xl sm:text-4xl xl:text-5xl`, and the header is a plain block, not
`grid-cols-[1fr_auto]` with a thumbnail beside it.

`styles.css` sets `overflow-wrap: anywhere` on every heading. That does more
than permit a break — it collapses a heading's min-content width to one
character, so the `1fr` title track shrank to whatever was left and Chrome split
the word. "Thermaphene" rendered as "Thermaphe / ne" from 1024px up, and nine of
eleven sampled titles broke at 1024–1100.

Measured at 48px in the display face: Thermaphene 335px, Graphenodes 322px,
Graphacrete 300px, Aerophenter 299px, Fibrasphene 292px. Track was 280px at 1440
and 204px at 1024, because a 96px thumbnail and a 16px gap sat beside it.

Both changes are load-bearing; neither closes the gap alone. Dropping the
aria-hidden thumbnail (which repeated the hero image, and which the five
hero-frame products never rendered) gives 316px at 1024 and 392px at 1280.
Moving 48px from `md` to `xl` sets the 1024–1279 band at 36px, where the longest
title is 251px. Re-measured at 768/900/1024/1100/1280/1440: every title clears
its track, tightest 251px in 316px.

## Studio-frame captions are one flex row

`absolute inset-x-5 bottom-5 flex flex-wrap justify-between`. As an independent
bottom-left and bottom-right box they ran through each other below ~430px — on a
390px phone "ARCHIVE · STUDIO CAPTURE" and "ƒ/2.0 · 85MM · CINEMA" interleaved
into one unreadable line. Sharing a row they wrap instead of collide.

## Panel variants — leave the routing alone

- `largeApplicationFrame`: Graphacrete, Graffisol, Ceraphene, Ignitron D,
  Lubritron. Field media takes the hero, studio photo moves below, and the
  decorative thumbnail was already absent.
- `applicationVideo`: Graphacrete, Graffisol, Ceraphene, from `/videos/`.
  Caption becomes "Application · Field capture".
- `aquamaxSimulation`: Aquamax only, replaces the right panel entirely.
- `specs`: 4 products.

## Measured baselines

Re-measure against these before claiming an improvement.

- Names: 25 cards, 25 unique, 0 duplicates, and the JSON-LD ItemList agrees.
- Imagery: for all 25, the application frame's resolved asset hash differs from
  the hero's. This is the duplicate defect measured directly rather than
  eyeballed — assert on hashes, not on appearance.
- Mobile, live build, touch profile (`isMobile`, `hasTouch`, DPR 3, tap): 430×932,
  390×844, 375×812, 360×800 — page overflow 0px, panel-open overflow 0px, titles
  single-line, captions non-overlapping, 0 console errors.
- Desktop: horizontal overflow 0px at 390, 1024 and 1440, panel open and closed.

## Measuring this panel without tripping over it

The modal is a portal with **no `role="dialog"`**, and the page behind it keeps
its own visible `<h2>`s. Two instruments gave confident wrong answers here:

- `[...document.querySelectorAll('h2')].filter(visible)[0]` returned a 30px
  heading on the page underneath, not the 48px panel title, and reported "all
  single-line" for a defect visible in any screenshot. Match the title by name
  inside a `position: fixed` ancestor, and assert its font-size.
- `element.getClientRects().length` returns 1 for a block whatever it does.
  Count rendered lines with a `Range` over the text node instead.

Assert the expected font-size and abort rather than report a pass. Both of the
above passed a naive control check.

## Unfreeze rule

Change this page only when you can state: the defect, the viewport that
reproduces it, the measurement showing it, and the measurement showing the fix.
Screenshot the panel as well — twice in this work a numeric instrument reported
a clean pass for something plainly visible on screen.
