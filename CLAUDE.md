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
