# Site — FROZEN

The whole site is frozen as of `db801e43` — the last commit that changed site
code. Date it to that, never to the commit that writes this file: a record-only
commit would always describe code one commit older than itself, which is how the
previous freeze came to read `4de2efac` while that same commit changed the icons
and `__root.tsx`. Two subsystems carry their own
detailed records below — the homepage motion system and the /innovations
product panel — and everything in this first section applies site-wide.

**Last verified against production: 2026-08-19.** Re-freezing when nothing has
changed does not need a new anchor — it needs this line re-dated and the claims
below re-checked. What was checked that day: 13 routes pass desktop 1440 and
phones 430/390/375/360, with the nav opening, listing 11 links and closing on
Escape at each; 25 cards, 25 unique titles, JSON-LD ItemList agreeing at 25;
all three favicons serving 200 at 13,912 / 9,540 / 45,025 bytes with alpha 0 at
the corners; the three newest videos at their exact encoded sizes; both venture
one-liners live; `--background: oklch(0.06 0 0)` — the site is dark and stays
dark, a light theme having been previewed and declined.

Change nothing here without a specific, reproducible defect and a measurement
of it. Every rule below was written after something shipped broken, and most of
them were broken by a well-meant edit that looked obviously correct.

## The routes

13: `/`, `/about`, `/early-works`, `/innovations`, `/ventures`, `/recognitions`,
`/voices`, `/essays`, `/news`, `/engage`, `/contact`, `/evidence-standards`,
`/services`. `/services` is a deliberate `<Navigate>` to `/engage` carrying
noindex plus a canonical, so it serves byte-identical HTML on purpose — that is
not duplicate content to "fix".

## Text must survive without CSS

`block` spans, `<br>` and flex/grid items look right on screen while their
`textContent` runs together, so anything that does not execute CSS reads the
words joined. This shipped on the site's primary H1 — three block spans reading
"I buildwhat does notyet exist." — and on ten other runs across five routes.

Put an explicit space at each join. It collapses at a line end and beside a
block, and both flex and grid drop a whitespace-only text node from layout, so
it is free. A decorative glyph that sits beside real copy also takes
`aria-hidden`, but note that `aria-hidden` does **not** remove it from
`textContent`; the space is still required.

Detect it by comparing an element's `innerText` against its `textContent` and
flagging gaps that are whitespace in one and absent in the other. Scope that to
prose — `p`, headings, `li`, `blockquote`, `figcaption`. A first version walked
every adjacent text node in `<body>` and reported 502 welds on /recognitions
whose top hits were "About|Early Works": two separate nav links, which
concatenate in `body.textContent` too but are not a defect.

## The /about opening spread

Order is film → founder dossier → founder portrait, and it is deliberate. With
the two set-pieces adjacent the column stepped 896 → 520 → 640 through three
consecutive blocks and left a 160px gap between them at 1440, against a 56px
section rhythm. Interleaved, the widths taper 896 → 640 → 520 before the
numbered sections reset to 896, and the three opening gaps are 96px each.

The portrait passes `margin="my-20 md:my-24"`. `FounderPortrait`'s default
`my-28 md:my-40` was tuned for a plate the dossier was pulled up into with
`-mt-12 md:-mt-16`; that negative margin is gone and the default alone opened
~3x the section rhythm on both sides. The prop **replaces** the default rather
than being appended to it — two competing `my-*` utilities resolve by
stylesheet order, not by the order they appear in the class attribute, so an
appended override wins or loses unpredictably per breakpoint.

The film is graded — `grayscale(0.15) contrast(1.06) saturate(0.78)
brightness(0.82)` plus a multiply gradient and a vignette. Ungraded it read as
the one bright object on a graphite page: its frames average a luminance of
70-83 against 38 for the portrait's source, and the portrait then takes
`brightness(0.9)` and a multiply layer on top of that. Held at 0.82 rather than
lower because the burnt-in title cards have to stay legible — 0.74 flattened
them. Every other visual on the site carries a grade in this family.

Judge a change to it on extracted frames in a styled page, not in this
container's browser: no H.264 decoder means the video paints black, so a
screenshot of `/about` tells you nothing about the grade.

`/about` carries exactly one video, `identity-film.mp4`, and one image, the
editorial portrait. `/innovations` carries no video outside the product panels
— its founder plate is a still. A report of "the video on the About page" that
arrives with an `/innovations` screenshot is about two different pages.

## HeroVideo bottom row

Everything at the bottom of a video frame is **one stack**: the sound hint on
top, then a wrapping row holding the frame caption and the control cluster.
Nothing there is independently positioned, and adding a fourth box that is
would reopen the defect this replaced.

As three separate boxes — caption `bottom-5 left-5`, cluster `bottom-4 right-4`,
hint `bottom-16 right-4` — they ran through each other. The 304px application
caption on an `/innovations` panel was overlapped by 124px at 1024, 15px at 768
and 113/153/169px at 430/390/360; only 1440 was clear. Sharing a row they wrap
instead, and the measured overlap is 0px at 1440/1024/768/430/390/360.

The caption is a **prop on HeroVideo**, not markup beside it. The panel still
renders its own caption box for the still hero, where there is no cluster to
collide with.

Control labels are `hidden @[26rem]:inline` — a **container query on the row**,
not a viewport breakpoint. With labels the cluster wants 362px; icon-only it is
169px. What squeezes it is the frame, not the viewport: the frame is 350/335/320
at 390/375/360 where it broke mid-word into PAUS/E, SOUN/D and FULL/VIEW, and
the product-film slot is 240px wide inside a full-width desktop panel, where any
`sm:`-style breakpoint would show the labels and overflow. The buttons carry
`aria-label` either way.

Measure the labels with a `Range` over the text node: they are spans inside a
flex button, which blockifies them, and `getClientRects().length` on a block
returns 1 however many lines it paints. And when measuring the cluster, select
the **innermost** div holding the buttons — the caption now shares a wrapper
with it, and selecting the wrapper made the caption a descendant of "the
cluster", so an overlap check read 100% at every width by construction.

## Mobile navigation

The overlay in `Nav.tsx` closes on Escape, via a `keydown` listener attached
only while it is open. Keep that condition: `/innovations` binds its own Escape
for the product panel, and an always-on listener here would take the key from
it. `aria-expanded` and the `aria-label` ("Open menu" / "Close menu") both
track state.

The menu does not lock body scroll and does not need to — a touch swipe over
the open overlay leaves the page behind it unmoved. Do not "fix" that on the
basis of `window.scrollTo()` appearing to scroll through: programmatic
scrolling bypasses touch handling entirely and says nothing about a finger.

## No-JS rendering

framer-motion serialises every `initial` prop into an inline style, so the
server HTML ships copy already faded out — 21 elements on /early-works, 92 on
/innovations, 63 on /recognitions, 26 on the homepage. The `<noscript>` block in
`__root.tsx` overrides them. Its `:not([style*="opacity:0."])` guard is
load-bearing: the attribute selector matches substrings, so a bare `opacity:0`
test would also catch `opacity:0.07` and `opacity:0.85`, which are real
decorative values.

## Contact form

Five visible labels once had no `htmlFor`/`id` pair — labelled to the eye,
unlabelled to everything else. Keep the pairs and the autocomplete tokens.
`track("contact_submit")` fires with `outcome: sent | rejected | network_error`.

When asserting on the error state, match the literal rendered copy
`"Couldn't send"`. A regex for `try` matched the word "industry" elsewhere on
the page and reported a pass that had not happened.

## /recognitions image loading

136 images on a 16,930px page. Everything below the fold is `loading="lazy"`,
and the one thing that must stay that way is the **decorative blurred backdrop**
in `ArchiveMosaic`: it renders only for `fit === "contain"` cards, and it points
at the **same `src`** as the real image beside it. Without its own `loading`
attribute it fetched eagerly and the lazy sibling then read the cache — so the
card downloaded its full asset however far down the page it sat, and its lazy
attribute did nothing. Fourteen images 1,800-12,000px down loaded on first
paint because of that pair plus two eager call sites in `recognitions.tsx`.

Measured, medians of three runs on one local server: first-load image bytes
1707 KB → 1012 KB on phone and 1584 KB → 833 KB at 1440, image requests 25 → 16
and 22 → 11, eager-below-fold 14 → 0.

**LCP and TBT did not move** and were never going to — LCP here is a text node
(a `<p>` at 390, the `<h1>` at 1440), and TBT is JS. Do not sell a lazy-loading
change as a blocking-time win.

`i < 2 ? "eager" : "lazy"` is the right heuristic for a list at the top of a
page and the wrong one here: that list starts at y=11126.

**Not a defect:** 42 of the 136 never decode even after a full scroll, on both
this build and the one before it. They sit in a collapsed section and are
already lazy. Use the live build as the control before treating that as a
regression.

## Analytics

`lib/analytics.ts` fans out to Plausible, umami, PostHog and dataLayer, and
swallows every error — analytics must never break a click or a submission.
Five events:

| Event | Fired from | Properties |
|---|---|---|
| `contact_submit` | /contact | `intent`, `outcome` |
| `engage_click` | one delegated listener in the root | `from`, `label` |
| `innovation_open` | `openProduct` | `product`, `stage`, `domain` |
| `innovation_close` | the modal's single `onClose` | `product` |
| `innovation_filter` | one effect on the filter tuple | `stage`, `domain`, `patent_only`, `featured_only`, `results` |

Two of these are deliberately not wired per control. `engage_click` is one
delegated listener because seven links point at /engage across the nav and five
routes and the nav builds its own from a list. `innovation_filter` is one
effect because four controls narrow the same list and `resetRefinements` clears
three at once — per-control handlers would be five call sites a sixth filter
would silently miss, and each would report a stale count from state that has
not committed yet. Its `filtersReady` ref skips the mount pass; without it every
page load reports a filter change nobody made.

`innovation_close` sits on the modal's one `onClose`, which Escape, the
backdrop and the close button all funnel through — verified that all three
paths emit, at 1440 and 390. There is no backdrop to click on a phone: the
panel is full-width and stops propagation, so that path is desktop-only.

The Plausible queue stub in `__root.tsx` is not boilerplate. `script.js` is
deferred, so `window.plausible` does not exist until the document parses, and
an engage click before that would be lost. The stub queues to
`window.plausible.q` and the real script drains it.

## Favicons

All three are **transparent**: `favicon.svg`, `favicon.png` (512², 13.9 KB) and
`favicon.ico` (16/32/48/64, 9.5 KB). A phone fetches only the SVG — Chrome,
Firefox and Safari 16+ prefer it — so the raster pair exists for link-preview
crawlers and older browsers.

The history is worth keeping, because two plausible fixes both failed:

1. The PNG shipped 180² and **fully opaque on 253,253,253**, so a WhatsApp card
   drew a white tile around the gold mark. Made transparent — card unchanged.
2. `/favicon.ico` was a **404**, which can push a crawler to a third-party
   favicon service that composites on white. Added, transparent — card
   unchanged.
3. Raster pair made **opaque graphite** on the theory that preview thumbnails
   are JPEG and flatten alpha onto white. That did remove the white tile on a
   dark-theme card — and produced a **black tile on a light-theme card**. Same
   defect, colours swapped.

An opaque icon cannot suit both WhatsApp themes, so all three are transparent
again and the tile a client paints is that client's compositing, not this file.

Two things to hold on to before touching this again. `spiindustries.co` 404s on
every icon path and its card shows **no icon at all** — that is the control
proving a crawler does fetch ours and render it. And preview cards are cached
**per url**, so a card that has not changed proves nothing unless it was
scraped fresh; test on a new query string, and on light **and** dark themes.

## SEO

Every route carries an absolute canonical on `https://sushanthpaatnaik.com`. A
relative one shipped on /services. JSON-LD: Person in the root, plus WebPage,
BreadcrumbList and an ItemList on /innovations that must agree with the
rendered grid.

## Facts that were wrong once

Starunico Capital is at **starunicocapital.com**, not starunico.com. The bare
name does not resolve, and /ventures shipped pointing at it — with a source
comment recording it as an unreachable site rather than the wrong domain. The
visible label is derived from `href`, so the link and the text it prints move
together.

Its one-liner was wrong twice over and now comes from the company's own site: it
invests **its own capital** rather than acting as a *strategic* investor, and
its six stated frontiers run well past "industrial systems" — semiconductors,
aerospace and life sciences among them. Stage is what it leads with, so
/ventures says early-stage. The site names no people and carries no
"co-founder" wording, so `role` there is owner-supplied and not verifiable from
the source.

InThinks had the same class of error, found the same way. Its one-liner read
"an ideation and innovation studio that shapes early-stage thinking into
products" — but it does not originate ideas: step one of its own engine is
identifying technologies already emerging from academic and research
ecosystems, which it acquires through IP arrangements and develops from TRL 1-3
to TRL 7-9. It badges itself **technology development & transfer** and never
says studio. Its `category` still reads "Innovation Studio", which carries the
old error — that is the card's eyebrow and the owner's label to pick, so it was
flagged rather than changed.

**Check a venture one-liner against that venture's own site before trusting
it.** Two of six were wrong about what the company does, and both read
plausibly. These sites are SPAs, so the rendered page is the source, not the
served HTML: mirror the origin on a local port and read it in the browser —
this container's Chromium has no direct internet, only the local mirror.

NASA is Huntsville, Alabama — not Kennedy Space Center. Four recognitions carry
evidence links (The Global Indian, NIF/nif.org.in, Golden Book of World
Records, INK Talks) and the renderer emits nothing when a source is absent, so
do not invent one to fill the slot.

**Open, unresolved:** the Presidential ledger itemises four citations (Kalam
2008, Kalam 2009, Patil 2010, Mukherjee 2013) against a stated six. The two
missing rows need source documents before the claim is safe.

## Measured baselines

- All 13 routes, desktop 1440x900 and phones 430x932/390x844/375x812/360x800
  with a touch profile: HTTP 200, 0px horizontal overflow, scroll lock
  released, absolute canonical, 0 welds, 0 console errors. Per-route character
  counts are identical across all four phone widths — a drop at one width means
  something reflowed away, not that the phone is narrower.
- Mobile nav at each of those four widths: 11 links, 0px overflow, opens on
  tap with `aria-expanded=true`, closes on Escape back to `false`.
- Homepage determinism: five positions (2700/4050/5400/6750/7920) approached
  from above and below give an identical canvas pixel hash. 6750 and 7920 share
  a chapter heading and that is correct — with a 9000px scroll range they are
  0.75 and 0.88, both inside the last band.
- Reduced motion, phone: lock released, 9284px document, scrolls freely, 1881
  characters of copy, 6 engage/contact links.

## Verifying a change to any of this

Screenshot as well as measure. Numeric instruments returned confident wrong
answers four separate times in this work — `getClientRects()` on a block always
returns 1, `h2s[0]` matched a heading behind a portal, a naive weld walker
counted nav links, and an error-state regex matched a substring of unrelated
copy. Each passed a control check.

For an edit that should be invisible, prove it: screenshot the same scroll
positions before and after and compare pixels. Run the comparison against the
*same* build first to learn the noise floor — the homepage scroll cue is
animated and differs by ~1000 pixels in a 30x104 box between any two loads.

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

The 25-product catalogue and its inspection panel are frozen as of `b9c15ff1`.
Do not change the imagery contract, the provenance labelling, the title type
scale, the header layout or the caption row without first reproducing a
specific, measurable defect.

Everything below was fixed in response to a reported defect and verified on the
deployed build. Most of these fixes exist because an earlier pass changed one of
these things without measuring.

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

New application frames: export at the source's native size and aspect, quality
84. Do not square them — the slot is `aspect-[1.15/1]` with `object-cover`, so
it trims the sides and the subject stays centred, and Aquamax is already
1264×848. Do not downscale to 1024 either: the panel paints this frame up to
459 CSS px wide, which is ~1380 device px on a DPR-3 phone, so a 1024 source was
upscaling 1.21× at 390 and 1.34× at 430. The two most recent are 1448×1086 at
114 KB and 109 KB, measuring 0.85× and 0.95× — no upscaling at any tested
viewport.

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
JSON-LD `ItemList`. The thermal/fibre group went through several renames and
one swap; the settled assignment is:

| Title | Stage · Domain | Assets |
|---|---|---|
| Thermene | Commercial · Thermal · Interfaces | `thermal-paste.webp` |
| Texaphene | Commercial · Textiles · Functional | `graphene-fabric.webp` |
| Thermaphene | R&D · Smart Textiles | `thermaphene.webp` |
| Vitraphene | Pilot · Composites · Fibres | `vitraphene.webp` |

Thermene and Thermaphene are one letter apart and are genuinely different
programmes — a thermal interface compound and a smart thermal fabric — so check
the domain, not just the name, before touching either. Texaphene and Vitraphene
replaced Fibraphene and Fibrasphene, which sat one letter apart in the same
catalogue.

The hero title spells the count out — "Twenty-five industrial expressions" —
rather than deriving it, so it must be updated by hand when the catalogue
changes. It read twenty-three against 25 products while the eyebrow beside it,
which is derived from `items.length`, already read "25 of 25". Everything else
that states a count is derived: the eyebrow, the JSON-LD `numberOfItems`, the
filter counts.

The source of truth for these names is the owner's instruction, not the asset
filenames and not an earlier draft. The chain that produced the table above:
the two Monoatom entries were first named Thermaphene and Fibraphene, which
collided with an existing Thermaphene; the smart textile was renamed Thermene;
Fibraphene became Texaphene and Fibrasphene became Vitraphene; and finally
Thermene and Thermaphene were swapped, putting Thermene on the interface
compound. An audit that reads only the filenames will conclude the opposite,
because `thermaphene.webp` belongs to the smart textile.

Titles are Title Case and carry no trademark symbol. The panel prints the title
verbatim, so one all-caps or one ™ among twenty-five reads as a typo.

## The application slot is illustrative — do not label it as documentary

The application imagery is illustrative. The two most recent frames were
generated rather than photographed on a site, and the rest of the set is
consistent with them. The panel used to say otherwise: the caption read
"Application · Field", the hero-frame variant was badged "Field Deployment", and
the note beside it asserted "material behaviour observed in situ within real
operating environments". A visitor reads that as evidence of a deployment that
happened.

The wording is now neutral and says what it is:

| Element | Text |
|---|---|
| Application frame caption | `Application · Deployment context` |
| Hero badge, `largeApplicationFrame` | `Deployment Context` |
| Note heading | `Application Note` (was "Deployment Note") |
| Note status line | `Application context · illustrative` |

Do not restore "field", "in-situ", "documentation" or "observed" to this slot
unless the image genuinely is documentary photography of a real deployment, and
do not name a customer, manufacturer or facility. The archive side is untouched
and is where genuine sample photography lives — keep the two distinct.

Note the JSX trap here: replacing an expression like
`{cond ? "A" : "B"}` with a bare `"A"` leaves the quotes as literal text, and
the caption shipped locally reading `"Application · Deployment context"` with
visible quote marks. Children are text, not a JS string.

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
  Lubritron, Coalorix. Field media takes the hero, studio photo moves below,
  and the decorative thumbnail was already absent.
- `applicationVideo`: all six of them, from `/videos/`. Every product with
  `largeApplicationFrame` now has one, so the two lists are currently
  identical — that is a coincidence of the catalogue, not a rule. The video
  takes the hero and the studio still drops below it.
- `aquamaxSimulation`: Aquamax only, replaces the right panel entirely.
- `productFilm`: Ignitron D only. A vertical narrated explainer in its own slot
  at the foot of the left column, paired with a note — **not** a replacement for
  the landscape application film above it. The two are different assets: 1440x810
  deployment footage against a 480x854 captioned product film, and `object-cover`
  would keep under half a 9:16 source in the 16:10 hero frame, cropping exactly
  the low-sitting captions.
- `specs`: 4 products.

The product-film frame is `240px` wide at `sm+`, which maps a 480px source 1:1
at DPR 2 with no upscaling. On a DPR-3 phone it paints 714 device px against a
480px source — 1.49x — and nothing short of a higher-resolution source fixes
that. The note beside it is content-height, not stretched: against the 425px
frame, three lines of copy left ~250px of empty panel.

## Application video — encode before shipping, and check it on real hardware

All six hero-frame products carry one. `HeroVideo` exposes an unmute control,
so keep the audio track; the element is muted on load and loops.

**`HeroVideo` is no longer private to this panel.** It is exported from
`Product3DView` and `/about` uses it for the identity film, because it takes
only a src and styling and references no product state. Changing it now changes
two pages — check /about before and after, not just a product panel.

Encode rather than shipping the delivered file. Ignitron D arrived 1920x1080 at
14.5 Mbps — 18.2 MB for ten seconds. The hero frame paints 718 CSS px wide,
which is 1436 device px at DPR 2, so 1440x810 covers it exactly with nothing
wasted: H.264 high, CRF 23, AAC 96k, `-movflags +faststart`. That gave 4.05 MB
at 35.4 dB against the source, and Lubritron 3.88 MB at 36.5 dB from a near
identical 17.9 MB source. For scale, `graphacrete.mp4` has been live at 25.8 MB,
and the three older files are 480x854 portrait at ~2 Mbps — the two newest are
the lightest on the page despite being the highest resolution.

`faststart` matters — `moov` must precede `mdat` or the browser buffers the
whole file before the first frame. Check with a top-level atom dump rather than
trusting the flag was applied.

A newly added video 404s on production for a few minutes after the push — the
page bundle and the static asset do not land together. Lubritron returned 404
for about three minutes before appearing. Poll for it rather than concluding the
deploy failed.

**Playback cannot be verified in this container.** Its Chromium is built
without an H.264 decoder: `canPlayType('video/mp4; codecs="avc1.42E01E"')`
returns empty and every video on the page fails with
`MEDIA_ERR_SRC_NOT_SUPPORTED` — including files that have been live for months.
Do not read that as a broken asset. Confirm with an existing video as a control,
verify the file with ffprobe, and get one tap on real hardware before calling a
video done. Note also that the CDN answered a `Range` request with a full 200
rather than a 206, which is worth watching on iOS Safari.

## Measured baselines

Re-measure against these before claiming an improvement.

- Names: 25 cards, 25 unique, 0 duplicates, and the JSON-LD ItemList agrees.
- Imagery: for all 25, the application frame's resolved asset hash differs from
  the hero's. This is the duplicate defect measured directly rather than
  eyeballed — assert on hashes, not on appearance.
- Mobile, live build, touch profile (`isMobile`, `hasTouch`, DPR 3, tap): 430×932,
  390×844, 375×812, 360×800 — page overflow 0px, panel-open overflow 0px, titles
  single-line, captions non-overlapping, 0 console errors.
- Caption vs control cluster inside a hero video frame: 0px overlap at frame
  widths 720/580/688/398/358/328 (viewports 1440/1024/768/430/390/360). 1024 is
  the width to check first — the panel goes two-column at `lg`, so its frame is
  narrower there than at 768.
- Ignitron D carries two videos and both resolve at all four phone widths:
  `ignitron-d.mp4` in the hero, `ignitron-d-film.mp4` in the product-film slot.
- Desktop: horizontal overflow 0px at 390, 1024 and 1440, panel open and closed.
- Image scale, measured against PAINTED pixels rather than the element box —
  `getBoundingClientRect()` returns the box, and with `object-contain` the
  painted area is smaller, which overstated the hero at 1.4× when it is 1.33×.
  Compute the painted size from `object-fit` and the natural aspect ratio.
  Application frames: 0.32× at 1920/1520/1366, 0.64× at 1440 DPR 2, 0.95× at
  430 DPR 3, 0.85× at 390 DPR 3. No upscaling anywhere.
- Zero layout shift when the panel opens; document height is unchanged.

**Known, not fixed:** the studio cutouts are 1024 square across all 25 products
and upscale 1.33× at 1440 DPR 2 and 1.10× at 430 DPR 3. Fixing that means
re-exporting the whole set from originals that are not in the repository. It is
mild and uniform, so do not fix it for one product and leave the rest.

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
