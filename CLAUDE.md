# Site — FROZEN

The whole site is frozen as of `beed88de` — the last commit that changed site
code. Date it to that, never to the commit that writes this file: a record-only
commit would always describe code one commit older than itself, which is how the
previous freeze came to read `4de2efac` while that same commit changed the icons
and `__root.tsx`. `beed88de` itself only corrects three comments. The commit
before it, `ced0de38`, is the last that changed what the site does — a merge,
see **The fourth pass** — and the two build to the same files, byte for byte.
Four subsystems carry their own detailed records below — the homepage motion
system, the film it plays, the seven-chapter story set to that film and the
/innovations product panel — and everything in this first section applies
site-wide.

This anchor sat at `f0c46557` through a run of later commits that did change
site code — a portrait, a scroll fix, several passes over the copy, the
advisory roster — because none of them touched this file. An anchor nobody
moves is worse than none: it says the code is older than it is. Move it in the
record commit that follows any code change, every time.

**Last verified against production: 2026-08-20.** Re-freezing when nothing has
changed does not need a new anchor — it needs this line re-dated and the claims
below re-checked. What was checked that day: 13 routes pass desktop 1440 and
phones 430/390/375/360, with the nav opening, listing 11 links and closing on
Escape at each; 25 cards, 25 unique titles, JSON-LD ItemList agreeing at 25;
all three favicons serving 200 at 13,912 / 9,540 / 45,025 bytes with alpha 0 at
the corners; the three newest videos at their exact encoded sizes; both venture
one-liners live. Added that day and verified on the deployed build at 1440
and at 390 with a touch profile: the product-detail CTA on all 25 panels,
15 external / 9 engage / 1 none, with `target` and `rel` correct on every
external one and `product_site_click` carrying the right payload.

The homepage alone has been verified on production four times since, twice
on 2026-11-17 and twice on 2026-11-18: see **Measured** in the film's section,
and **Measured, second pass**, **Measured, third pass** and **Measured,
fourth pass** in the story's. The third also changed the header and the menu,
which are on every route: on production the menu was opened and closed on all
13 at three sizes, and the header measured on `/` and on `/about`, which
stands for the internal routes because they share it. Nothing else in the list
above was re-checked on production on either day, so this line keeps its date.

**The site is no longer dark-only.** A whole-site light theme was previewed
and declined earlier; what shipped is a narrower thing that was asked for
afterwards — Auto/Light/Dark on the eleven internal routes, with `/`
permanently dark. If an older note anywhere says the site "is dark and stays
dark", it is describing the declined proposal, not this one. See **The theme
system** below.

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

The link row is in the header from 1280px up and in this overlay below that —
see **The header row**. So the overlay is no longer a phone's menu only: a
tablet held sideways and a narrow laptop window get it too, and on an internal
route it is where the theme control is at those widths.

The list is centred by auto margins on its first and last child, not by
`justify-center`. Where the list fits, the two are the same thing: 0 pixels
differ from the build before at 390x844 on `/` and on `/about`, and at
768x1024. Where it does not fit, `justify-center` overflows equally above and
below, and a scroll container cannot scroll to what lies above its own start.
This was live until 2026-11-18:

| | first link's top, before | after |
|---|---|---|
| `/`, a phone held sideways, 844x390 | -75px: off the screen and unreachable | 96px |
| `/about`, 844x390 | -154px: three links unreachable, the fourth under the wordmark | 96px |
| `/about`, 375x667 | 24px, under a header that ends at 76 | 96px |
| `/about`, 360x640 | 11px | 96px |
| `/about`, 320x568 | -25px | 96px |
| `/`, 320x568 | 52px | 96px |

Internal routes were worse than the homepage because their list is about
160px longer: it ends with the theme control. Auto margins fall to zero when
there is no room, so the list starts under the header and the rest is a
scroll away. Every destination is reachable in all 32 page-and-viewport
states tested between 568x320 and 1279x720, with the first and the last link
both answering a hit test.

A list that scrolls passes under the header, whose wordmark and buttons are
painted above this layer with nothing behind them. The `nav` carries a mask
that fades a link out across the 36px under the header. Where the list fits,
nothing is painted in that band — it is the element's own top padding — which
is why the mask costs no pixel there.

**The check that opened this menu on every route counted its links.** It never
asked where the first one was, and it passed on every profile while "About"
lay under the wordmark on a 375px phone. Reachability is a hit test: scroll
the list to each end and ask `elementFromPoint` what is under a point inside
the first link and inside the last. And name the button when reading its
state: `header button[aria-expanded]` matches the theme menu's trigger first
on an internal route — it is in the DOM while hidden — and reported an open
menu as closed.

## The header row

The wordmark, nine links, and on the right the theme control on internal
routes, Contact and — below 1280px — the menu button.

How wide the row is depends on the face, and the stack is `"Inter", "SF Pro
Display", system-ui` with no webfont: a machine that has Inter installed gets
Inter, which is the wider. This container has it. The owner's Mac does not,
and there the row has 71px either side of it at 1280, read off their
recording. So measure this header in Inter: a row that fits in Inter fits.

Measured on the text, at the top of the page, where the wordmark is at its
larger size. A negative number is text running through text.

| Inter | wordmark to "About" | "Engage" to the first button | between links |
|---|---|---|---|
| 1024, `/`, until 2026-11-18 | -32px | -194px | 20px |
| 1180, `/`, until 2026-11-18 | -18px | -52px | 20px |
| 1280, `/`, until 2026-11-18 | -4px | -12px | 24px |
| 1280, internal, until 2026-11-18 | -15px | -45px | 24px |
| 1024 to 1279, now | in the menu | | |
| 1280, `/`, now | 16px | 16px | 18px |
| 1280, internal, now | 16px | 16px | 12.5px |
| 1280, internal, beside a classic scrollbar, now | 16px | 16px | 10.6px |
| 1366, internal: before, now | 13px, 16px | 13px, 16px | 24px, 23px |
| 1440 and 1920, any route: before and now | 50 to 312px | the same | 24px |

At 1440 and 1920 the header strip is the build before it to the pixel: 0
pixels differ on three internal routes in both themes, at the top and
scrolled, against a noise floor of 0. On `/` nothing moved and the 1,382 to
1,392 pixels that differ are the links' own ink.

Three things hold the row, each for a measured reason.

- **It starts at `xl`.** It used to start at `lg`, with a tighter gap and
  tracking from 1024 to 1279 that were an earlier attempt to make it fit
  there. It did not, in either face — the Mac's needs about 1150px — so a
  tablet held sideways got the wordmark through "About" and the last links
  under Contact, on every route.
- **The space between links is a spacer that can give**, `w-6 min-w-2.5
  shrink`, where it was `gap-x-6`. The header's own `gap-x-4` keeps 16px
  between its three groups, and the links are `shrink-0`. With room to spare
  that is `gap-x-6` exactly; without it the row tightens instead of running
  into its neighbours. In Inter it is at 24px from about 1340 on `/` and 1375
  on an internal route.
- **The wordmark and the button cluster are `shrink-0`.** Left to the default
  they shrink too: the logo is an `img` with a percentage `max-width`, so its
  minimum contribution to its parent's width is zero, the wordmark's box gave
  up 20px, and its text ran out of the box into the gap the spacers had just
  made.

On the homepage the links are 90% of `muted-foreground`; every other route
keeps 70%. Over the film they measured 3.18 to 3.23:1 on all seven chapters,
72 of 72 readings under 4.5:1, and at 90% they measure 4.70 to 4.81. The
internal routes' grounds are the theme's, and 70% there is part of the
approved design. Hover takes a link to `foreground` and keyboard focus draws
the site's 2px outline, on each of the nine: hovered one by one and tabbed
through, not sampled.

Two instruments, both wrong first.

- **A box is not the ink in it.** The first check measured the gap between
  the wordmark's box and the row's box. It read 0px for a header that a
  screenshot showed as "PAATNAIKBOUT", and 16px for a first version of the
  fix that still had the K touching the A. A box can be narrower than its
  text. Measure a `Range` over the text node.
- **A layout measured in one face is measured for that face.** Every check of
  this header on the owner's own screen would have passed. Find out which
  face the stack resolves to where you are measuring, and whether it is the
  widest one it can resolve to.

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
delegated listener because eight links point at /engage across the nav and five
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
says studio. The `category` carried the same error and is now "Technology
Transfer" — its own nav item, and a sector name like the siblings (Materials,
Industrial Systems, Deep-Tech Capital, Design + Living). The domain moved with
it to the company's H2, "Research to industrial readiness", so the eyebrow no
longer echoes it.

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
- Both re-run on 2026-11-17 with two profiles added, 320x568 and a 768x1024
  tablet: 78 route-and-viewport checks, all passing — 200,
  0px overflow, one `h1`, lock released, absolute canonical, 0 console errors,
  and the menu opening to 11 links and closing on Escape on every one. The
  homepage's character count is not the same at every width, and that is not a
  reflow: 1749 at 430/390/375/360, 1603 at 320x568 where two optional lines of
  chapter 3 step back under 700px of height, 1954 on the tablet, which gets the
  laptop compositions.
- Re-run on 2026-11-18 on ten touch profiles — those six, 1024x768 and
  1180x820 for a tablet held sideways, 844x390 and 667x375 for a phone held
  sideways: 130 route-and-viewport checks, all passing. The tablet's count is
  1910 now, 44 fewer: the line the owner had removed from chapter 3. A phone held sideways reads 1505, and the menu check counts
  7 links on screen there where the others count 11. That is correct: the
  rest are a scroll away, and whether they can be reached is the hit test
  under **Mobile navigation**, not this count.
- Re-run after the fourth pass on the same ten profiles: 130 checks, all
  passing. The homepage's counts rose by the four descriptors and "Mentor":
  1848 at 430/390/375/360, 1702 at 320x568, 2009 on the tablets and 1604 on a
  phone held sideways, each exactly 99 more than before.
- Homepage determinism: five positions (2700/4050/5400/6750/7920) approached
  from above and below give an identical canvas pixel hash. The positions are
  kept from the five-chapter page so the series stays comparable. On the
  seven-chapter page they are 0.30 (Presidential Recognition), 0.45 (still
  Presidential, its last frames before the hand-over), 0.60 (the hand-over into
  Advanced Materials), 0.75 (the hand-over into Industrial Impact) and 0.88
  (the hand-over into the close). The check is about the canvas, not the copy.
- Reduced motion, phone: lock released, 9284px document, scrolls freely, 1848
  characters of copy in `main.innerText` (1749 before the fourth pass, 1633
  before the second pass on the seven-chapter page, 1707 on the five-chapter
  page by the same measure; an older figure here, 1881, predates copy edits
  that never re-measured it), 6 engage/contact links in the document.
- Canvas, both themes, ten internal pages × four scroll depths, sampled in the
  left gutter which carries no content at 1440: light **223.6 .. 225.6**
  (span 2, warmth +4.5..5.2), dark **2.2 .. 8.2** (span 6). `/essays` is the
  low outlier in the dark and always has been; in the light it is inside the
  band. A light span above ~5 means the plate wash floor has been broken.
- Text painted on a photograph, light theme, outside a dark island, with a
  resolved ink lightness below 0.5: **10 site-wide**, all of them known false
  positives (see the theme section). Any real hit here is invisible copy.

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

# The theme system

Three settings — **Auto, Light, Dark** — on the eleven internal routes. `/`
is always dark.

Read this before touching a colour anywhere on the site, because almost every
colour is now a token and the ones that are not are deliberate.

## Preference is not the same thing as theme

Two values, kept apart on purpose:

| | |
|---|---|
| **Preference** | What the visitor picked. `localStorage["sp-theme"]`, one of `auto`/`light`/`dark`. Written only when they pick something. |
| **Effective** | What the document paints. Derived on every render from preference × route × environment, and stamped on `<html data-theme>`. |

`/` forces dark by returning `"dark"` from `effectiveTheme` — it never writes
to storage. A visitor on Light who passes through the homepage finds Light
still waiting on the next internal page. If you ever find yourself writing the
preference from a route, that is the bug.

## Auto, exactly

**The default.** Nothing stored resolves to Auto, in `readPreference` and in
the boot script alike. A first-time visitor gets Auto, and storage stays empty
until they pick something.

Four layers, in order:

1. **The system preference.** `prefers-color-scheme`, and note this is three
   states not two: dark, light, and *nothing said*. A machine that has been
   told nothing matches neither query.
2. **Ambient light** — but only where the system said nothing. See below.
3. **The local clock**: light 07:00–19:00, dark the rest.
4. **Dark.**

The clock is the stated fallback, not an attempt at sunrise. Real sunrise
needs a latitude and the only way to get one is a geolocation prompt, which is
not a fair price for a colour; timezone alone gives longitude, which moves
sunrise by minutes while the seasons move it by hours. A rough solar model
would be less honest than a stated window, not more accurate.

Auto re-resolves on a `matchMedia` change — on **both** queries, because a
system going from "nothing said" to light fires only on the light one — on
`visibilitychange`, because a tab backgrounded for hours has a throttled
timer and may have crossed a threshold, and on a **timer set to the next
threshold** rather than a poll. At most two wakeups a day.

## Ambient light is second, and that is the whole argument

The obvious design puts the room at the top: a bright room means a light
page. It is wrong, and the brief asked the question directly. **Someone who
sets their OS to dark at noon has answered it.** Letting a sensor they cannot
see overrule a choice they made deliberately is worse than ignoring the room
entirely. So ambient light is consulted only where the system expresses no
preference at all — which is both the case it is useful for and the only case
where nothing is being overridden.

**It is also almost never available.** `AmbientLightSensor` exists in
Chromium but behind `#enable-generic-sensor-extra-classes`, so
`'AmbientLightSensor' in window` is false in a stock browser; it needs a
secure context, a permissions-policy grant and the `ambient-light-sensor`
permission, and it never shipped in Safari or Firefox. The old
`ondevicelight` event was a Firefox feature removed in 62. Measured in this
container: both absent. **Do not claim ambient support anywhere.** The module
reports unsupported and Auto falls to the system preference, which is the
expected outcome rather than a failure.

When it *is* there: hysteresis at **120 lux up / 40 lux down** — a single cut
point flips the page whenever a hand passes over a laptop — a reading must
hold for **4 seconds**, and the sensor runs at 1 Hz and only while the
preference is Auto, the system is silent and the tab is visible. Every one of
those is also a reason to stop.

Nothing is stored, nothing is sent, no history is kept, and the only thing
that leaves the module is one of two words. No camera, ever: brightness from a
video stream is not an acceptable price for a colour.

## The anti-flash script is load-bearing

`THEME_BOOT_SCRIPT` in `lib/theme.ts` is inlined into `<head>` and runs before
the first paint. It duplicates the resolution logic on purpose: a module would
be deferred, and deferred means the page paints in the fallback theme first —
which is the flash it exists to prevent. It also sets `color-scheme` and the
`theme-color` meta.

The server cannot know the preference, so it renders the dark defaults that
sit on `:root`. **Keep the dark values on `:root` and light in
`:root[data-theme="light"]`, never the other way round** — that ordering is
what makes a JS failure land on today's site rather than a white page.

React never renders `data-theme`, so there is no hydration mismatch.

## One canvas, and the floor that gives it one

Every internal page passes its own alpha to the plate wash — 0.68 on `/news`
through 0.82 on `/about`, and `/early-works` carries its own copy of the
stack at 0.78. Against the dark theme's near-black ink that whole spread
resolves to the same black, which is why the numbers were never tuned.

On paper it does not. The backdrops are dark cinematic photographs;
`brightness(1.34)` left them around luminance 55, and at 0.68 wash a third of
the ground was that. Measured in the left gutter at four scroll depths on all
ten internal pages, the light canvas ran **183 to 240 — a span of 57, against
6 in the dark**, and `/essays`, which has no plate at all, sat at the top of
it painting raw `--background`. Every image on the site was therefore sitting
on a different, muddy, cool-grey surface depending on which page it was on.
That is what "the images do not match the background" was.

Two tokens fix it and neither can touch the dark theme:

| token | dark | light |
|---|---|---|
| `--plate-wash-min` | `0%` | `91%` |
| `--wash-ground` | `transparent` | `oklch(0.917 0.006 85)` |

The wash takes `max(overlay, var(--plate-wash-min))`, and `max(x, 0%)` is `x`.
`--wash-ground` is the same tone flat, as the last layer of
`.atmosphere-wash`, for `/essays` and the essay reader which have no plate to
floor. The light grade goes well past mid on brightness and then collapses on
contrast — `brightness(2.10) contrast(0.40)` — so the photograph survives as a
watermark in the paper rather than as a grey card.

Re-measured: **223.6 to 225.6 across all ten, a span of 2.** The paper family
also carries roughly twice the chroma it did (`0.004` → `0.008` at hue 85,
applied across the whole light block in one pass), which is the difference
between ivory and cool grey. Warmth, as R−B in the gutter, went from +0.8..3.5
to a uniform +4.5..5.2.

`--canvas-solid` is that 224 as a solid colour, for the few things that have
to punch a hole in a rule and match the ground exactly — the timeline dots on
`/recognitions`, which had the dark value hard-coded. It is **not**
`--background`: `--background` is 246, the token before the plate stack
paints, and a punch-out at that value reads as a pale halo.

## Text on a photograph is always light

Every image overlay on the site scrims its photograph with a fixed near-black
gradient. That gradient is what makes the caption legible and it cannot invert
without inverting the photograph — so the caption's ink has to stay light in
both themes, which means the tile has to be a dark island.

It was not. **363 caption elements on `/recognitions` alone** painted
`--foreground` graphite on that black scrim on the light theme: every archive
tile, every hall-of-fame card, every era preview plate. Add sections 06 and
07, which are whole plates of the same kind, and the two `/early-works` cases.
All invisible, and every one of them a screenshot away from obvious.

Detect it structurally, not by contrast maths: a text box geometrically inside
an `<img>`, not inside a `.theme-dark-island`, with a resolved ink lightness
below 0.5. A light-theme token over a fixed dark scrim is wrong whatever the
ratio comes out at. Down from 373 site-wide to 10, and those ten are false
positives worth knowing about — an element whose box happens to fall inside a
large decorative `<img>`, a pale disc with a dark glyph on it, and a year chip
that sits on paper with a decorative image behind the row.

## Browser autofill

Chrome paints an autofilled field `#E8F0FE` with near-black text, from the UA
sheet, and neither `background` nor `color` overrides it — both lose to
`-internal-light-dark` on the pseudo-class. The two properties that do win are
an inset `box-shadow`, which paints over the UA background, and
`-webkit-text-fill-color`. Both are set on `.field-underline:-webkit-autofill`,
with `transition: background-color 0s 600000s` as a belt to that braces since
Chrome animates the fill in and a shadow alone can flash first.

The shadow colour is `--canvas-solid`, not `--background`. These are underline
fields with no box of their own, so the slab has to be the colour the canvas
actually resolves to: on the light theme `--background` is 246 and the canvas
under the form is 224, and a 246 rectangle behind three of six fields is as
conspicuous as the blue was.

**This container cannot trigger a real autofill.** What is testable here is
that the rule reaches the served stylesheet and is well-formed, which the auto
check asserts. The appearance needs one real Chrome and one real Safari.

## The light media system

The first answer to "the images do not match the light theme" was to keep the
media dark and seat it — a dark island everywhere. **That was wrong and it
shipped.** A black rectangle laid deliberately on ivory is still dark imagery
pasted onto a bright canvas. What the light theme needed was for the pictures
to be *re-lit*, and almost all of them could be.

### /innovations needed no new assets at all

All 25 cut-outs carry a real alpha channel — 89% of `graphacrete.webp` is
fully transparent. The products already float. Two things made the grid read
as 25 black rectangles:

1. a hard-coded `bg-[oklch(0.05 0.006 245)]` on the card, and
2. **`Tilt3DSurface`**, which is an entire photographic set built in CSS —
   cyclorama, key light, floor, horizon line, two contact shadows, a mirrored
   reflection, a rim and a lens vignette — every layer a graphite literal.

(2) is why the first attempt appeared to change nothing: the set was painting
over the plate. All eleven layers are `--stage-*` tokens now and the light
theme re-lights the same set as a high-key product cyclorama. Notes worth
keeping:

- Contact shadows go warm grey, not black. A black contact shadow under a
  product on paper is a smudge, not a shadow.
- The mirrored reflection drops from 0.16 to 0.06 and loses its brightness
  cut. On a dark floor a mirrored product reads as sheen; on a light floor
  the same opacity reads as a second, dirtier product.
- `--stage-pad` gives the subject more room at the foot on paper. The caption
  covers the bottom ~40% of a card, which is invisible when a dark product
  fades into a dark floor and is a bottle crossing the title when it does not.

`coalorix.webp` and `ignitron-p.webp` were the only two cut-outs shipped
without alpha. Keyed by flooding inward from the border and keeping the
largest connected component — a luminance threshold eats both, since one is a
black bottle and the other a dark vial, and the flood alone left a detached
shadow puddle under Ignitron P that the border could not reach.

### Photography that cannot be re-grounded

The founder portrait, the identity film and the `/early-works` plates are
genuinely dark pictures. They keep their grade and stop **terminating in
black**: the edge dissolve, the foot fade and the grading pass are `--photo-*`
tokens that resolve to the page ground, so a picture ends on the sheet instead
of being cut through it, and `--photo-veil` screens 10% paper over it to lift
the blacks.

The first foot ramp bleached `/early-works` to nothing — it covered three
quarters of the plate, where the dark original only ever reached 0.85 alpha.
It is a band under the title now, not a wash.

### /news had the opposite defect and the same cause

Its press photographs ran at `opacity-80` with a black vignette in `overlay`
and a `from-background/85` foot. On graphite that grades a picture; on paper
it lets the page through and washes it out. Full opacity, a real grade, and a
vignette that darkens.

### Three ways a filter silently broke the dark theme

- **`filter: <chain> none` is invalid.** `none` is only legal as the sole
  value, so appending a `none`-valued token drops the entire declaration —
  320,738 differing pixels on one `/early-works` slice, with every archival
  grade simply gone. The identity is **`brightness(1)`**.
- **An arbitrary `[filter:…]` overrides Tailwind's `grayscale-/contrast-/
  brightness-` utilities** rather than composing with them, so the whole chain
  has to move into the token.
- **Filter order is not commutative,** and Tailwind composes `--tw-filter` as
  blur → brightness → contrast → grayscale. Writing the same functions in
  source order changes the picture.

### The inspection panel

It stayed dark for a while on the argument that a lightbox is a dark room.
Sound for a lightbox, wrong for this one: it opens out of a card that is now
a paper plate. Every ground in it is a `--panel-*` token and it follows the
page. The **six media frames are the exception** and stay graphite in both
themes — the application photographs and films genuinely are dark, and a
paper frame behind a dark film is a halo round it rather than a mount.

The studio frame gained a foot scrim it never had. It renders `item.img`, the
studio *photograph* rather than the cut-out, and **16 of the 25 have a light
bottom strip while 9 are dark** — so its caption had no ground in *either*
theme. White on a 241-luminance photo is as invisible in the dark theme as
graphite is on paper.

## Dark islands

Some surfaces are dark because the *photograph* in them is dark: the product
cutouts are shot on a graphite cyclorama with the shadow baked in, the archive
plates are graded documentary stills, and the inspection panel is a lightbox.
Dropping those onto paper does not produce a light theme, it produces a light
theme with the pictures ruined.

`.theme-dark-island` re-declares the dark tokens for a subtree, so every
`text-foreground/60` and `border-foreground/[0.08]` inside keeps meaning what
it meant, in either theme, with no component knowing which theme is active. In
dark it is a no-op by construction.

**It re-declares the media family too** — `--product-*`, `--photo-*`,
`--archive-*`, `--press-*`, `--stage-*`, `--panel-*`. Without those an island
is only half dark: dark ink over pictures still lit for paper, which is how
white type ended up on a light cyclorama in the inspection panel. Those values
are copied from `:root`; change one there and change it here. In light it also gains a hairline and a
shallow warm shadow, because on paper an unseated dark plate reads as a hole.

Currently applied to:

| Surface | Why |
|---|---|
| both innovation card variants | cutouts shot on a graphite cyclorama |
| the whole product-inspection modal | a lightbox |
| `/early-works` full-bleed photograph blocks | year chip and its scrim are fixed dark values |
| `/early-works` split-layout image side | same, and it was missed the first time |
| `/early-works` demo lightbox | `bg-black/80` over a `bg-black` video frame |
| `FounderPortrait`'s plate | see below |
| `/about`'s identity-film frame | see below |
| every `ArchiveMosaic` tile, HoF card and era preview plate | caption sits on the photograph |
| the `ArchiveMosaic` spread and numbered plate — **frame only** | their captions are page copy beside/below the image, and belong on paper |
| `/recognitions` sections 06 and 07 | full plates painted from fixed near-black |

Brand-mark plates were briefly on this list and are deliberately **not**
any more — see the section below.

The rule for choosing the element: island the smallest box that contains
both the dark paint and the text sitting on it. Islanding a whole grid whose
caption is a sibling column turns page copy into reversed type; islanding
only the `<img>` leaves the caption on the scrim it was meant to sit on.

`FounderPortrait` and the `/about` film are on the list because their imagery
is graded to near-black at its edges — a multiply pass, an inner dissolve to
`oklch(0.02)`, a bottom fade to `oklch(0.04)` — and none of that can invert
without becoming a different picture. With the plate on paper, the identity
bar met the top of the photograph as a hard white-to-black rule and the
figcaption met the bottom fade the same way. Dark, both bars are continuous
with the frame and the whole thing reads as a cinematic plate laid on the
page. This is the shape brief `b6c5b998` calls a "cinematic media module".

**Reach for this before reaching for a hard-coded colour.** A component that
needs to stay dark should say so once, not carry a light value and a dark one.

## Brand marks: the plate is paper, the mark is itself

Each logo carries a per-logo flag saying what the SOURCE is, and the theme
decides the filter. On paper almost every mark then needs **no filter at
all**, which is the entire point: a logo in its own colours on a light card
is what a brand page looks like. Deloitte, NIF and MIT Technology Review are
colour marks that the dark theme inverts into colour negatives purely to
survive graphite — on paper they come back correct.

The polarity of all 35 assets was measured over their **opaque pixels only**;
averaging the transparent field makes every mark look identical. Three
outcomes:

| | treatment on paper |
|---|---|
| dark mark (Vinrox, Monoatom, Grafillium, Magppie, Deccan…) | none — already right |
| white mark (Sunroof, Greenomers, INK Talks) | invert |
| colour mark (VPRPL, Tileopedia, IOCL, TED, YourStory…) | none — never invert a colour mark |

**WeHear is the exception, and exceptions like it are why a measurement beats
a rule.** It is 45% near-white wordmark and 54% saturated icon: on paper the
wordmark vanishes, and inverting to rescue it turns the pink waveform green.
A genuinely two-tone mark cannot be solved by a filter, so it gets `darkChip`
— its own dark ground, the one it was drawn for. One card, not the whole row.

The first attempt at all this made every logo plate a dark island, which is
how you get black blocks stamped across a light page. It was expedient and it
looked it. Do not go back to it.

## Four flips, not one

The three places that flip a mark shipped three slightly different filters,
and the advisory row a fourth:

| context | dark filter |
|---|---|
| `/voices` | `invert(1) brightness(1.05) contrast(1.1) saturate(0)` |
| `/ventures` advisory | `invert(1) brightness(1.05) contrast(1.05) saturate(0)` |
| `/ventures` tiles | `invert(1) saturate(0) brightness(1.06) contrast(1.04)` |
| `/news` | `invert(1) brightness(0.96) contrast(1.08) saturate(0)` |

Collapsing them into one token is the obvious tidy-up and it is wrong: it
moved the news marks ~9% brighter and the advisory row by a stable 275
pixels. Each context keeps its own token — `--mark-flip`, `--mark-flip-adv`,
`--mark-flip-soft`, `--mark-flip-dim` — all `none` on paper. Likewise
`--mark-flip-lt` is **not** `none` in the dark theme: a white mark did not
get "no filter" before, it fell into the colour branch, so the dark value is
`brightness(1.08) contrast(1.06)`.

`/voices` also needs its own plate: it had a flat `--surface-raised` fill
where the venture tiles have a gradient. Sharing one `--logo-plate` moved
7,125 pixels.

## Two more ways the harness lied

**Pausing animations freezes them mid-flight.** A regression harness that
calls `animation.pause()` captures a reveal wherever it happens to be, so a
card mid-transform lands 20px low and the diff reports 25,433 changed pixels
on a page whose document height and element positions are *identical*. Call
`finish()` — it jumps to the settled end state, deterministically.

**One noise-floor sample is not a floor.** The advisory row read 279px
against a floor of 0px, which looked like noise until the control was
compared against itself four times: 0, 1, 4, 0 — while new-vs-live sat at
279, 279, 279, 279. Stable to the pixel means real. Then diff the *computed
styles* rather than bisecting screenshots, and check every card in a row, not
the first one — the culprit was a `contrast(1.05)` against a `contrast(1.1)`
on a single mark in a card the style diff was not looking at.

## What is a token and what is not

Tokens carry anything with an obvious counterpart in the other theme: the
surface ladder (`--surface-sunken` … `--surface-high`), the page ground, the
nav veils, the whole archival plate stack (`--plate-*`), the focus ring,
selection colours.

The surface ladder is **a ladder, not a palette**. What each rung means is its
position relative to `--background`; the light values reproduce that
relationship, not the numbers. Reading them as "the dark ones inverted" gets
the order backwards.

The compound treatments — the five button classes with their four
pseudo-elements and three-layer box-shadows — are **not** tokenised. They live
as a light-only override block at the foot of `styles.css`. That was a
deliberate trade: converting them in place would put every value in a system
tuned against a black ground one typo away from a dark regression, to make a
diff look tidier. The dark rules there cannot regress because they are not
edited.

## Measured

**Dark is unchanged.** Every route against the deployed build at 1440,
animations paused, differences counted above a threshold, split by whether
they fall in the top 100px — because the control is a deliberate addition to
the internal-page header, and a whole-frame count reports ~3,750px on every
internal route and tells you nothing.

Re-run after the canvas work, ten internal pages × four scroll depths, dark,
deployed build against the new one, with a control run of the new build
against **itself** first to learn the floor. Every cell landed inside its own
control. The only real difference anywhere was one 18px line of text on
`/innovations` — the word "curated" where the lead used to say "private".

Do not read a raw diff count as a regression on this site. `/recognitions`
carries a continuously scrolling hall-of-fame reel and the control run scored
6,176 differing pixels on its own first slice; `/early-works` parallax images
shift a pixel or two between loads; the ambient breathing layer moves under
everything. **Finish() animations, never pause()** — pausing freezes a reveal
mid-flight and reports the animation's own progress as a change. And when a
cell exceeds its control, crop the diff bounding box and look at it: both
outliers here turned out to be a sub-pixel parallax offset and a breathing
phase, visually identical side by side.

| | noise floor | header | below header |
|---|---|---|---|
| `/` | 35px | **0** | 160 |
| 9 internal routes | 0px | ~3,700 | **0** |
| `/contact` | 0px | 3,682 | 2 |
| `/early-works` | 46px | 3,789 | 137 |

Zero below the header on ten of twelve routes; the two exceptions sit inside
their own measured noise. The homepage header is byte-identical.

Do not use `getbbox()` for this. It is computed at a threshold of zero, so one
pixel differing by 1 stretches it to the whole frame — it did, and briefly
suggested a global change that was in fact 3,651 pixels in the top 50 rows.

- **The homepage carries no theme control**, in the header or the drawer. With
  one, 3,710 of the 3,881 pixels that differed from the deployed build were in
  the homepage header; without it that header measures 0. It is the one page
  whose header was asked to stay exactly as it is, and it ignores the setting
  anyway. The cost is real and deliberate: someone landing on `/` cannot set a
  preference until they open an internal page. That header has changed once
  since, on the owner's brief of 2026-11-18: its nine links went from 70% to
  90% of muted, because over the film they measured 3.2:1. Where the row had
  room nothing in it moved. See **The header row**.
- The control is a 32px glyph trigger, not the segmented control. The
  segmented version is ~190px wide and overlapped "Engage" at 1440, where the
  header already carries a wordmark, nine links and Contact. The drawer, which
  has room, gets the segmented version. Since 2026-11-18 the glyph is in the
  header from 1280px up, with the link row, and both are in the drawer below
  that.
- Full matrix: 11 routes × 2 themes × 9 viewports (1920/1728/1520/1440/1366
  and 430/390/375/360) — correct theme on every route, 0px horizontal
  overflow, 0 console errors. Persistence survives reload, navigation and a
  browser reopen, and is correct at first paint. Auto follows a live system
  flip, tested with the clock pinned to noon — at 21:00 both sides of the flip
  are dark, so "dark → dark" reads identically as a pass and as a total
  failure to react.
- Auto, 47 assertions, clock pinned to noon so the day/night fallback says
  *light* and a system preference of *dark* genuinely disagrees with it. A
  fresh visitor with empty storage lands on Auto and the control reads Auto;
  the system outranks the clock in both directions and live, without a
  reload; `no-preference` falls through to the clock; the homepage is dark
  under all six combinations of system state × stored preference and never
  rewrites storage; manual Light holds against system dark and manual Dark
  against system light; returning to Auto re-resolves at once; and
  localStorage holds exactly one key.
- Auto at runtime, clock pinned to noon so the time-of-day fallback says
  *light* and a system preference of *dark* genuinely disagrees with it: 24
  assertions, all passing. System light→dark and back again change `/about`
  **without a reload**; `/` stays dark through both; the stored preference is
  never rewritten, including by visiting `/`. Then the full persistence walk
  for each of the three settings — set, reload, navigate to another internal
  page, visit `/`, come back. **The resolved priority is: forced dark on `/`
  first, then the explicit stored preference, then `prefers-color-scheme`,
  then local time.** Time only decides when the system expresses no
  preference.

## A green matrix is not a look

The phone's header stayed graphite on light pages while desktop was correct,
and every automated check passed while it was broken: right `data-theme`,
right ground colour, zero overflow, no console errors. It took a screenshot at
390.

The cause is worth knowing, because the shape recurs: a mobile-only rule
replaces the header's blur with a flat gradient (iOS Safari re-composites a
blurred region on every scroll frame) and carries `!important` to beat the
inline style — so it beat the theme token too. **Any rule with `!important`
that paints a colour needs its own token**, or it silently outranks the theme
on exactly the viewport nobody screenshots.

## Contrast

Measured with the browser resolving the colours, not a parser, and scored
against the **approved dark theme** rather than against nothing:

| | pairs scored | below AA |
|---|---|---|
| Dark (shipped, approved) | 132 | 50 |
| Light (new) | 133 | 56 |

Near parity, and both fall short in the same one place: 10px mono eyebrow
labels at 30–60% alpha. That is a property of the design language, not of
either theme.

Re-run later with the ground taken from the screenshot instead of from an
ancestor walk, and with the canvas unified at 224, over six scroll depths per
page — a much wider net, so the counts are not comparable with the table
above, only with each other:

| | text runs sampled | distinct runs below AA |
|---|---|---|
| Dark (approved) | 1,697 | 176 |
| Light | 1,697 | 251 |

Same conclusion, more of it. The gap is arithmetic, not design: the `+0.05`
flare term in the WCAG ratio flatters a black ground, so identical alphas
score higher there. On a 228 paper ground **alpha 0.55 cannot reach 4.5:1
even with pure black ink** — the best possible composite is 102.6, which is
4.49. Closing it means raising alphas at a few hundred call sites, which is
the editorial type of both themes and not a light-mode fix. Deliberately not
done; say so rather than quietly shipping a harsher page.

**On paper it cannot be fixed by choosing a darker colour.** Text at 55%
alpha over the paper ground composites to `0.55·F + 0.45·243`; AA against
that ground needs a composited value of 117 or darker, which requires
`F ≤ 14` — essentially black, and then it is not a muted label any more.
Closing the remaining gap means changing the alphas in the markup, which
would change the approved dark theme too. Darkening the light base tokens
(`--muted-foreground` 0.505 → 0.33, `--accent` 0.505 → 0.435, `--foreground`
0.235 → 0.195) is what brought light from 49% failing to parity, and that
lever is now spent.

## Two instruments that lied here

Both passed a naive control check, both produced confident nonsense, and both
are the reason the numbers above are trustworthy.

**Colour parsing.** This site authors colours in oklch, and Chromium returns
them that way — `getComputedStyle().backgroundColor` is
`oklch(0.965 0.004 85)`, not `rgb(...)`. A digit-scraping parser reads those
three numbers as red, green and blue, turns the warm paper into
`rgb(1, 0, 85)`, and reports 293 of 307 pairs failing AA on pages that are
plainly legible in a screenshot. Resolve colour by painting onto a 1×1
canvas and reading the pixel — that also composites alpha for free, which
matters because most copy here is `text-foreground/70`.

**Stale dev server.** `wrangler dev` caches the server bundle, so after a
rebuild the HTML can keep referencing a stylesheet hash that no longer
exists. Every page then renders completely unstyled: routes resolve the
fallback theme, text is default-link blue, and a whole QA run reports
failures that are the harness, not the site. It corrupted two runs before a
guard existed. **Before any visual or contrast measurement, fetch the
stylesheet the HTML actually references and assert it returns 200** — the QA
script does this and refuses to run otherwise. Restarting wrangler clears it.

**A percentile is not a background.** Sampling the ground for a text run out
of the screenshot is right — `getComputedStyle` reports `transparent` for
nearly every element here, and the real ground is the plate wash over a
photograph under six blend layers. But taking it as a percentile band assumes
the glyphs are a small tail, and for 10px uppercase at 0.4em tracking they are
30–45% of the box: the band lands **on the ink**, reports the ink as the
ground, and the pair comes back near 1.0 whatever it actually is. Six runs
came back at 1.1:1 that way; cropping the boxes out of the screenshot showed
four were white-on-black inside an island and perfectly legible. Take the
**modal** value instead, and when a number says "invisible", go and look at
it before believing it.

## Unfreeze rule

Same as everywhere else on this site: a defect, the viewport and setting that
reproduce it, the measurement showing it, and the measurement showing the fix.
Plus one more for this system — **re-run the dark regression before and after**.
It is the only instrument that catches a light-theme edit quietly changing the
approved dark site.

# Homepage motion system — FROZEN

The cinematic scroll system on `/` is frozen as of `17d221c8`. Do not retune
easing, smoothing, transition overlap, retention or prefetch behaviour without
first reproducing a specific, measurable defect.

The film it plays and the copy laid over it are separate matters with their
own sections below, **The inventor film** and **The story**. Replacing the film
changed `FRAME_COUNT` and the sequence directory. Setting the copy to the film
changed those two again, and `N_CHAPTERS`, `CHAPTER_BANDS` and `CHAPTER_GRADES`
with them, because there are seven chapters now and their edges are read off
the film. Nothing else in the renderer moved: the frame map is still linear,
and every smoothing, hand-over, retention and prefetch value in the table is
exactly as it was.

Two lines of the draw have changed since, each with its defect and its
measurements: `cover()` now draws the film at its own proportions beside a
classic scrollbar, and on a phone whose toolbar has collapsed. See **The film
was drawn narrow beside a classic scrollbar** and **The film was drawn tall
on a phone with its toolbar collapsed**.

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
| `CHAPTER_BANDS` | 0 / .161 / .287 / .514 / .643 / .769 / .895 — seven, read off the film | `chapterBands.ts` |
| `FRAME_COUNT` | 481 — 227 real + 254 synthesised | `CanvasLayer.tsx` |
| `RETAIN_RADIUS` | 40 desktop, 55 touch | `CanvasLayer.tsx` |
| `FALLBACK_RADIUS` | 14 | `CanvasLayer.tsx` |
| `BLEND_STEPS` | 12, desktop only | `CanvasLayer.tsx` |
| `MAX_INFLIGHT` / `START_INFLIGHT` | 12 / 4 desktop, 6 / 3 touch | `CanvasLayer.tsx` |
| `INITIAL_AHEAD` | 32 desktop, 24 touch | `CanvasLayer.tsx` |
| DPR cap | `min(rawDpr, 2, fit)`, floored at 1 | `CanvasLayer.tsx` |
| Classic-scrollbar correction | `squeezeX` = innerWidth / clientWidth, desktop only, 1 when there is no bar | `CanvasLayer.tsx` |
| Phone-toolbar correction | `squeezeY` = sizedH / the canvas box's height, touch only, 1 when the box is the height the buffer was sized for | `CanvasLayer.tsx` |

There is exactly ONE smoothing layer: Lenis, desktop only. `scroll-behavior:
auto !important` disables the browser's own, and no `useSpring` is applied to
any scroll value the homepage mounts. Do not add a second one.

## Measured baselines

Re-measure against these before claiming an improvement. Each line says whether
it was re-measured on the story cut (2026-11-17) or carried over; carried-over
lines are the renderer's and were not expected to move, but they have not been
re-proved.

- Determinism: five positions (2700/4050/5400/6750/7920) approached from above
  and below give an identical canvas pixel hash. This is the strongest
  invariant on the page — do not break it. **Re-measured:** 5/5 at 1440, and
  3/3 at 390 on the portrait set.
- Frame selection: the picture at rest is the expected frame, `round(progress
  x 480)`. **Re-measured** by matching the live canvas against the exported
  frames: 144, 216, 288, 360 and 422 at the five positions, each the expected index, correlation
  0.997-0.9999.
- Arbitrary stops: 6 viewports, 15 samples each, one dominant chapter per
  sample; no sample paints a second chapter above 5%; longest image-only beat
  54px. **Re-measured** with `scripts/e2e-scroll.mjs`, whose samples and
  boundaries were moved to the seven chapters.
- Scroll tracking: at 960x540, wheel-driven, the picture on screen is within
  1vh of the picture the scroll position calls for on every draw — at ordinary
  speed and in a fast scroll, forward and back, three runs out of three, and
  the same on a 390 phone profile. **New**, and measured against the 2x cut on
  the same harness, which scores the same. How it is measured is under The
  story cut.
- Main thread during scroll: 81.2% idle at 1920x1080. All site JS under 2% of
  samples. React and framer-motion ~0%. *Carried over.*
- Loading: 41 frames fetched at rest before any scroll at 1440 and 56 on a 390
  phone; peak 12 and 6 concurrent; CLS 0. **Re-measured**, with the 2x cut's
  build on the same harness as control: 41 and 56 there too. Those are frames 0-40 and 0-55,
  which are the same files in both cuts, byte for byte: 3,513 KB and 1,424 KB on
  disk. Earlier records here gave 1,381 KB and 1,014 KB for those frames, and
  they were wrong. The harness sums `request.sizes()` as requests finish, and
  in one run it returned 1,795 KB for the control's 41 files and 1,198 KB for
  the identical 41 in the new build. Count the requests; take the bytes from
  the files.
- Decoded memory: ~1.36 GB parked mid-film desktop, ~402 MB portrait mobile.
  Scales at 8.29 MB per retained frame (1920x1080x4). *Carried over* — same
  window, same frame dimensions.
- Draw scale: never above 1.00x. No upscaling. **Re-measured** at 1440x900:
  0.83x. That is the vertical scale, and the horizontal one wherever there is
  no classic scrollbar. Beside one, the frame is drawn wider inside the buffer
  by `squeezeX` — 1.0105 at 1440 — and the box the buffer is shown in takes
  exactly that back, so on screen the two scales are equal.
- Real hardware, from recordings of the live site: three on a MacBook — at
  rest the picture is the frame the scroll position calls for, within
  0.05vh; while scrolling it follows 33ms behind on the first and 15ms on the
  two since — and one on an iPhone, about 23ms behind, a few frames more at
  the fastest flicks. See **Measured on real hardware**.

## Known, deliberate, NOT defects

- **~70px of fully-faded copy at each chapter seam.** Measured 70px below 5%
  opacity, 50-60px below 2%, out of 9000px of travel. This is the 0.50/0.50
  handover: the outgoing chapter reaches zero as the incoming one starts, so
  the two are never painted together. Both alternatives were tried and were
  worse — 0.46/0.54 opened a readable dead zone, 0.68/0.32 put 27 text nodes
  above 25% opacity simultaneously. Do not "fix" this. There are six seams now
  rather than four, and each is where the film changes scene, so the empty
  beat is the picture turning over with nothing written on it.
- **Reverse scroll trails the benchmark.** At 960x540: ~36 fps and 4-5 long
  tasks per run, against grafillium.com's locked ~60 fps and zero. Forward
  scroll *beats* it — ~34 fps against their 24-32. The asymmetry is
  architectural: a scroll-driven image sequence must decode a new frame per
  position, while a video-and-DOM page has nothing to produce on the way back
  up. The only lever that moves it is a larger retention window, which costs
  memory at 8.29 MB a frame.
- **After a scroll jump the canvas holds the previous picture until a frame
  near the new position is resident.** Time to the correct picture after a
  1500px jump at 1440, ten trials: 310-3877ms (median 799) on the previous
  film, 349-2272ms (median 618) on the inventor film's 2x cut. On a 390 phone
  profile both sit at 127-143ms. That is by design — the alternative is cutting
  to an unrelated frame — and it is not something the film changed. The ten
  trials were not repeated on the story cut; its determinism checks needed 4.5s
  of stillness where 3s had served, which is the same tail seen from the other
  side.
- **Reduced motion still fetches the opening window.** 56 frame requests on a
  390 phone with the preference set, on both films. `useReducedMotionSafe`
  reports "no preference" for the first render so hydration matches the
  server, and the loader's first pass goes out before the preference applies.
  The visitor is shown the still and never sees them. It is waste, not
  breakage, and it predates this film; fixing it means touching the loader.

## The film was drawn narrow beside a classic scrollbar

Found on 2026-11-17 in a screen recording the owner made of the live site.
Laying the exported frames over the recording needed a horizontal scale of
0.990 and a vertical one of 1.000; a single scale for both scored 0.59 on the
same frame where the pair scored 0.82. The buffer is sized from
`window.innerWidth`, which includes a scrollbar that takes space. The stage it
is shown in is `fixed inset-0`, which does not. So a 1440-wide buffer was
being shown in a 1425-wide box and the film came out about 1% narrow.

| | horizontal scale over vertical, before | after |
|---|---|---|
| 1440x900, classic scrollbar | 0.9896 | 1.0000 |
| 1280x800, classic scrollbar | 0.9883 | 1.0000 |
| 1920x1080, classic scrollbar | 0.9922 | 1.0000 |
| 1366x768, classic scrollbar | — | 1.0000 |
| any of them, no scrollbar | 1.0000 | 1.0000 |
| the owner's Mac, 1280x832, read off their recordings | 0.990 | 1.001 |

That is most Windows and Linux desktops — Chrome and Edge there draw a
scrollbar that takes space — and a Mac with a mouse attached or scrollbars set
to always show. A phone never has it. Headless Chromium hides
scrollbars by default, which is why no check here had ever seen it: launch with
`ignoreDefaultArgs: ["--hide-scrollbars"]` to reproduce it. "After" is read
from the renderer's own `drawImage` calls — destination size over source size,
times box over buffer, per axis — with the frame still covering the buffer and
still centred in it.

The correction is in `cover()`, not in the buffer size: the frame is drawn
wider by `squeezeX` and the box squeezes it back. Sizing the buffer to the box
is the obvious fix and the wrong one here — the scrollbar appears at the
moment the loader releases its scroll lock, a resize clears a canvas, and the
first sight of the film would have been a black frame.

With no scrollbar `squeezeX` is exactly 1 and every number in `cover()` is the
number it was. The control for that is the determinism check: the five canvas
hashes on this build are the five the previous build gave, character for
character — `c95be34d`, `98379bab`, `8e3ead53`, `37c2b0ce`, `b4f4cf74`.

Nobody would have seen 1%. It is fixed because it was measured, it is on most
desktops, and a circle that is 1% narrow is a wrong picture of the Earth.

## The film was drawn tall on a phone with its toolbar collapsed

Found on 2026-11-18 in a screen recording the owner made of the live site on
an iPhone, in Safari. The portrait frames registered over the recording with
the two scales fitted separately:

| | vertical scale over horizontal | match at those scales | match at one scale |
|---|---|---|---|
| toolbar showing, top of the page, frame 0 | 1.002 | 0.868 | 0.838 |
| toolbar collapsed, frame 109 | 1.050 | 0.723 | 0.445 |
| toolbar collapsed, frame 336 | 1.051 | 0.826 | 0.436 |
| toolbar collapsed, frame 480 | 1.057 | 0.810 | 0.366 |

Safari's toolbar collapses under the first downward scroll and stays down to
the end of the page, so for the whole of a scroll on an iPhone the film was
5% too tall: the Earth an upright ellipse, every face long.

The buffer's height is `innerHeight` when `syncSize` last ran, and `syncSize`
runs when `<html>` changes size. On a phone it does not. The page's height is
`TOTAL_VH` in `vh`, and iOS Safari holds `vh` at the large viewport, so a
collapsing toolbar leaves `<html>` the size it was while the `fixed inset-0`
stage, and the canvas box in it, grows. The browser stretched a buffer sized
for the shorter screen into the taller box. Android Chrome's address bar
collapses the same way and very likely did the same; only the iPhone has been
measured.

The correction is `squeezeY`, in `cover()`, the way `squeezeX` is. A second
`ResizeObserver` watches the canvas box and calls `syncBox` alone, which
compares the box with `sizedH`, the height the buffer was sized for, and the
frame is drawn shorter by the factor the box stretches it. The buffer is not
resized: that clears the canvas, and on a phone the toolbar moves at every
change of scroll direction. Touch only, and exactly 1 when the box is the
height the buffer was sized for, so a desktop draw is the arithmetic it was —
`x * 1` is `x`.

Reproduced here by doing what iOS does: on a touch profile, pin the page's
height in pixels so `<html>` cannot resize, then make the viewport taller,
664 to 720. Read from the renderer's own `drawImage` calls, vertical scale
over horizontal on screen:

| | build before | this build |
|---|---|---|
| toolbar showing | 1.0003 | 1.0003 |
| collapsed, at rest | 1.0847 | 1.0003 |
| collapsed, scrolled on | 1.0847 | 1.0003 |
| showing again | 1.0003 | 1.0003 |

1.0847 is 720/664, the reproduction's own toolbar; the iPhone's came to 1.05.
After, the frame is drawn 996px tall in an 851px buffer, the taller box takes
it back to its own proportions, and it still covers the screen. The control
is the desktop: the five determinism hashes are the five every build since the
story cut has given, character for character, and so are the three on the
portrait set.

Headless Chromium has no toolbar to collapse and resizes `vh` with its
viewport, so no check here could have seen this. It took a phone.

## Measured on real hardware

The first measurement of this page that was not made in this container. The
owner recorded the live site on a MacBook: Chrome, full screen, 1280x832, 15
frames a second, 33 seconds — down the whole page in 16.4 seconds, a pause at
the foot, back up in 9.4.

The scroll position in each frame is read off the browser's scrollbar thumb,
which travels 727px for the page's 1000vh: a quarter of a vh per reading. The
film frame on screen is found by matching the recording against all 481
exported frames, laid out the way `cover()` lays them, on local contrast so
that shields, grades and the vignette cancel; type, the header and chapter 3's
photographs are masked out. The search has no prior — it runs over the whole
film — and lands within three frames of the scrollbar's position in 462 of
466 frames.

| | captured frames | scroll speed, median | picture behind the scroll position: median | p90 | worst |
|---|---|---|---|---|---|
| at rest | 55 | 0 | 0.04vh | 0.36vh | 0.68vh |
| scrolling forward | 252 | 55vh/s | 1.74vh | 3.12vh | 4.47vh |
| scrolling back | 147 | 103vh/s | 3.60vh | 5.12vh | 5.99vh |

It is a delay, not a shortfall. The distance grows with speed and changes sign
with direction, and one number explains all 399 moving frames: **33ms**, two
display frames at 60Hz, with 0.48vh of scatter left over. At rest the picture
is the frame the position calls for. No capture shows the scroll moving on
while the picture stood still, and nothing resembles the 576-frame cut's
fallback, where the picture ran 25vh behind.

What a 15fps recording cannot resolve is pacing finer than 67ms, and what this
one does not cover is a phone: it is a laptop with a trackpad. A phone is under
**On an iPhone**, below. The copy's own timing was not measured separately;
it runs on the same scroll position, so it cannot be further from the film
than the film is from the scrollbar.

A second recording, of the build with the proportion fix, is under **The
second recording** in the story's section: 1.001 where this one read 0.990,
and a delay of 14.8ms where this one read 33. A third, of the build after
that, read 1.001 and 14.5ms: see **The fourth pass**.

Two things the instrument got wrong first, both worth keeping:

- **A registration that is 1% out is a finding, not an error bar.** The first
  fit used one scale for both axes, came back 0.9% small and 1.5px low, and
  would have been accepted as "close enough" for matching frames. Splitting
  the axes is what turned it into the defect above.
- **The last half-second is not the site.** To stop the recording the owner
  moved the pointer to the top of the screen, Chrome's toolbar slid down, the
  scrollbar's track moved with it and the thumb read as a 600vh/s jump with
  the picture 50vh "behind". Those frames are excluded; the table is the 454
  before them.

### On an iPhone

The first measurement on a phone, 2026-11-18: the owner's iPhone in Safari,
884x1920, 1,795 frames in 31 seconds at a varying rate around 60, down the
whole page in flicks, 17 seconds from the first chapter to the last.

Safari draws no scrollbar, but it draws a scroll indicator while the page
moves, and it showed in every frame of the scroll: 170px long, its top
travelling from 133px to 1620px. The film frame is found as on the laptop,
against the 481 portrait frames placed the way the phone drew them — with the
5% stretch above, since this was the build before its fix: x 0.886, y 0.930.
Of 535 frames sampled at 30 a second, 521 match at a median of 0.83; the 14
that do not are Safari's toolbar animating, at either end. The indicator is
calibrated against the film itself with the delay left free. The delay comes
to 23ms, and the indicator's end point to 1620.6px; it actually came to rest
at 1620.

| scroll speed | samples | picture behind the scroll position: median | worst |
|---|---|---|---|
| up to 50vh/s | 211 | 0.85vh | 5.3vh |
| 50 to 100vh/s | 238 | 1.07vh | 7.6vh |
| 100 to 150vh/s | 68 | 2.86vh | 10.9vh |
| 150 to 212vh/s | 4 | 5.87vh | 7.0vh |

A flick on glass is faster than a trackpad: 212vh/s at the top, against 144
on the laptop the same evening. Up to 100vh/s the picture follows as it does
on the laptop, a frame or two behind. Past that it falls a few frames behind
for a single 33ms sample and catches up; the worst, 10.9vh, is the very first
flick, inside the toolbar's collapse. There is no frozen picture: 13 times in
17 seconds the film held a frame for one sample while the position moved on
1.3 to 2.3 frames, and every one caught up on the next.

These numbers are coarser than the laptop's. Position read off an overlay
indicator, through a stretched registration, carries about a vh of error — at
rest at the foot of the page it reads -1.08vh, where the truth is 0 — so read
the medians as plus or minus 1vh. What it settles is that the phone keeps up,
and that every chapter's copy was on its own scene, which the recording shows
directly.

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

# The inventor film

The homepage film was replaced on 2026-11-17 with one the owner supplied: a
1920x1080, 24fps, ten-second clip, 240 frames, AI-generated — it arrived with
Gemini's sparkle in the corner. The instruction was to use that exact video as
the scroll background, in HD WebP, with the watermark removed. It plays in its
own order, linearly, through the unchanged renderer.

Read the scene table before touching anything here. The film's order is the
page's order now. The same day, the copy was reset to the film's seven scenes —
see **The story** — and the film was re-cut so that each scene lasts as long as
the chapter over it. That is **The story cut**, below.

## What was done to the source, and what was not

| | |
|---|---|
| Order | untouched |
| Frames used | 0-226 of 240 |
| Frames dropped | 227-239 |
| Watermark | un-blended from every frame |
| NASA insignia | painted out, frames 119-149 |
| Frame count | 481: every scene slowed by its own whole number |
| Exposure | 38 of the 227 real frames dimmed |

**The dropped tail.** From frame 228 a fake website fades in over the city: a
"MO.CH" logo, a nav reading "Contart Us / Pontact Us / Llogint Us / Login UP",
a headline "Our Tiolest Hounge du Innovations". Frame 227 is already dimming
toward it. The last frame of a scroll film is where the page comes to rest, so
that screen would have sat permanently under the real header and the closing
call to action — a second, garbled interface behind the first.

**The insignia.** A generated NASA insignia in a HUD bracket, upper left of the
Earth shot. It fades in at 119, holds, and leaves through the corner under
motion blur by 149. NASA's insignia is not free to use, a generated copy on a
personal homepage reads as an endorsement, and the owner's own brief for this
work ruled out generated logos. The bracket and its label went with it; the
arc from India now ends in open space, which reads as intended.

Colour cannot find it: the disc and the ocean beside it are the same blue
(HSV 105/165/149 against 106/164/135), and a colour mask returned the Earth.
What worked was tracking its red chevron for position, then taking every
bright or saturated feature left of the Earth — the Earth being the largest
bright region, kept 12px clear — closing and dilating that into one blob.
**Fill from a 25px-median copy of the frame, not from the frame.** Arcs and
stars touch the hole, and a fill seeded from them smears each one into a pale
wedge.

## The watermark

Static: the same position, centred on (1740, 900), 72px across, in 213 of 240
frames by template match, and confirmed two ways that do not depend on
matching — per-pixel temporal standard deviation shows the sparkle as a hole,
because a blend scales every change underneath it, and the per-pixel temporal
minimum shows it as a solid shape, because it never goes dark. It had looked
like it drifted. That was a downscaled montage, read by eye.

It is a blend, so it was un-blended rather than blurred or cloned over:
`background = (observed - alpha x overlay) / (1 - alpha)`, per channel. The
picture under the mark is recovered, not invented.

| | R | G | B |
|---|---|---|---|
| alpha at the plateau | 0.326 | 0.338 | 0.374 |
| overlay value | 227 | 221 | 203 |

Three stages, each there because the one before left something:

1. **Un-blend.** Accurate across the interior to under one level on smooth
   frames.
2. **Tone-match, smooth frames only.** Where the surround is featureless, the
   low-frequency offset between the un-blended patch and a fill from the
   surround is removed. Weighted by surround texture and gated: a discrepancy
   under 8 levels is corrected, one over 16 is left alone, because a large one
   is real picture, not calibration.
3. **Rebuild the contour.** The source carries encoder ringing round the mark:
   on smooth dark frames, +14.7 levels two pixels inside the edge and -3.7 one
   pixel outside it. No matte fixes that. Each contour pixel is rebuilt from
   nearby non-contour pixels that resemble its own un-blended value, so a
   picture edge crossing the contour survives — a plain inpaint smeared the
   edge of the wooden box into a notch. The rebuilt ribbon is 9px on smooth
   frames and 5px on textured ones, where texture hides the ringing.

Measured on the encoded result: the mark's own template correlates at 0.473
(median) at its position in the source and 0.049 after; above 0.5 in 87 frames
before and 0 after. Residual by distance from the edge, mean over smooth
frames: within 0.7 levels on dark ones, within 1.5 on bright ones.

Three fits were wrong before one was right, and each failed differently:

- Alpha from the single darkest frame came out at 0.52. It was the maximum of
  a patch with a star in it. Un-blending with it turned the white star black.
- A regression seeded with an inpainted background gave 0.35 with white
  assumed, and left a ghost 2-4 levels dark on black backgrounds.
- The ratio of temporal variance inside to outside gave 0.288 — assumption-free
  and biased low. It implied an overlay value of 280.

What settled it was a two-parameter fit per channel over the 39 frames whose
surround is smooth, spanning levels 9 to 160. The intercept is the
well-determined quantity: the mark adds 74-76 levels on black in every channel.

Any invisible provenance signal in the file was not looked for and was not
touched.

## In-between frames

The renderer wants whole-number multiples, and it wants density: 227 frames
over this page is 4.4vh a frame, which is the stepping a phone was once
measured complaining about at 4.2.

The first cut doubled every frame: 453, an exact 2x, 2.2vh a frame. The cut
that is live slows each scene by its own whole number — see The story cut —
and comes to 481.

In-betweens are motion-interpolated. Tested twice, by hiding real frames from
the interpolator and scoring what it makes of the gap against them — the job at
two and three times the real motion, so pessimistic:

| Held out | Interpolated | Plain blend | Interpolation better on |
|---|---|---|---|
| every 2nd frame | 31.1 dB | 24.1 dB | 106 of 112 |
| 2 of every 3 | 27.4 dB | 22.7 dB | 143 of 150 |

It lost in the same two places both times: inside the bloom-out into the
inventor shot and the dissolve into the hall, where brightness is changing and
there is no motion to follow. In this cut the bloom has no in-betweens at all,
and pair 42 and pairs 57-64 use a plain blend.

The source's own frames never pass through the interpolator. Where two real
frames agree, the in-between is taken from them rather than from the
interpolator, so static regions cannot be hallucinated. Within a scene every
in-between sits at an exact half, third or fifth of the way between two real
frames, which is the property that stops the sequence stepping unevenly.

## The story cut

Same footage, same order. Each scene is slowed by a whole number so that, under
the page's linear frame map, it lasts as long as the chapter that sits over it.

| Scene | Source frames | x | In the 481 | Scroll progress | Chapter |
|---|---|---|---|---|---|
| workbench | 0-28 | 2 | 0-56 | 0.000-0.117 | 01 Origin |
| bloom | 28-42 | 1 | 56-70 | 0.117-0.146 | hand-over |
| inventor at the bench | 42-58 | 3 | 70-118 | 0.146-0.246 | 02 Early Works |
| dissolve | 58-65 | 2 | 118-132 | 0.246-0.275 | hand-over |
| recognition hall | 65-114 | 2 | 132-230 | 0.275-0.479 | 03 Presidential Recognition |
| dissolve | 114-122 | 1 | 230-238 | 0.479-0.496 | hand-over |
| Earth | 122-147 | 2 | 238-288 | 0.496-0.600 | 04 Global Recognition |
| zoom | 147-156 | 2 | 288-306 | 0.600-0.637 | hand-over |
| graphene lattice | 156-174 | 2 | 306-342 | 0.637-0.713 | 05 Advanced Materials |
| iris | 174-184 | 2 | 342-362 | 0.713-0.754 | hand-over |
| solar viaduct | 184-191 | 3 | 362-383 | 0.754-0.798 | 06 Industrial Impact |
| dissolve | 191-196 | 2 | 383-393 | 0.798-0.819 | 06, mid-chapter |
| plant | 196-205 | 2 | 393-411 | 0.819-0.856 | 06 Industrial Impact |
| burst | 205-214 | 1 | 411-420 | 0.856-0.875 | hand-over |
| city | 214-226 | 5 | 420-480 | 0.875-1.000 | 07 The Work Continues |

The chapter edges in `CHAPTER_BANDS` are not chosen. Each is 0.030 after the
midpoint of the transition between two scenes — half of `CONTENT_FADE` — so the
picture turns over exactly where the text hand-over is empty: the old line
leaves, the scene changes with nothing written on it, the new line arrives on
its own footage. The midpoints were measured, by fitting every frame of a
transition as a mix of the clean frames either side: source frames 35.0, 60.7,
116.2, 150.0, 180.3 and 209.4. Every transition is shorter than the 60vh
hand-over it sits in — 17 to 42vh.

**To move a chapter edge, change a multiple and re-export.** Moving the number
in `chapterBands.ts` alone puts the copy over the wrong scene, which is the
defect this cut replaced.

**481, not 576.** A first cut used higher multiples — inventor and plant x4,
lattice x3, city x6 — and came to 576 frames. It gave the four short chapters
about 10vh more hold each and stepped finer. It was exported, deployed and
measured against the build that was live:

| 960x540, wheel-driven | 453-frame cut | 576-frame cut | 481-frame cut |
|---|---|---|---|
| ordinary scroll, median lag behind the scroll position | 0.5-0.6vh | 0.4vh | 0.5vh |
| fast scroll, median lag | 0.5-0.6vh | 12.7vh | 0.5-0.6vh |
| fast scroll, worst | 1vh | 25vh | 1vh |

More frames per screen is more to fetch and decode per screen. Past the
loader's throughput the film stops keeping up and the draw loop falls back to
the edge of `FALLBACK_RADIUS` — 14 frames, which is where the 25vh comes from.
481 over 1000vh is a frame every 2.08vh, the density this renderer has been
proven at. **If a chapter ever needs more hold, shorten its copy; do not buy it
with frames.** `inventor-story/`, the 576-frame directory, was served for 72
minutes — 20:14 to 21:26 UTC, by the polls that watched it arrive and leave —
was never referenced by a page, and is gone.

The lag is measured by logging every `drawImage` of a film frame together with
the scroll position it was drawn at. The frame number is carried from the fetch
through `createImageBitmap` to the draw by a `WeakMap` in an init script. It is
reported in vh, not in frames, so that cuts with different frame counts compare:
a frame behind on a denser cut is a smaller distance behind.

## The exposure ceiling

The previous film's per-frame mean luminance never exceeded 123.2, and every
text shield on the page was tuned against that. This film reaches 205 in a
ten-frame bloom between the workbench and the inventor, and 142-152 across the
closing city. A scroll film can be stopped anywhere, so a flash that lasts 0.4s
in the video is a place a reader can sit.

Frames above 105 are rolled off toward 124. 38 of 227 are affected; the lowest
gain is 0.647, at frame 36. The hall, at 113-118, is touched by 1.5%.

## Export

| Set | Size | Total | Average |
|---|---|---|---|
| desktop | 1920x1080, q86 | 58.1 MB | 118 KB |
| `/p/` portrait phones | 500x1080 centre crop, q84 | 17.6 MB | 36 KB |
| `/m/` landscape touch | 854x480, q84 | 20.5 MB | 42 KB |

96.2 MB, against 88.1 MB for the 2x cut and 109.9 MB for the film before it.
The centre crop was checked scene by scene: the board, the inventor's face and
hands, the hall's central cases, India on the globe, the lattice's centre atom,
the chip and the towers all sit inside it. No per-scene offset is needed.

It lives in `public/sequences/inventor-story-481/`. Every cut has had its own
directory, because frame URLs are not content-addressed and `/sequences/` is
cached for 30 days. The reduced-motion still is the film's own frame 14,
`film-still-origin.webp`.

## What is in the film that someone should know about

It is generated, start to finish. The man at the bench is a generated likeness.

The hall, frames 65-113, shows trophies and framed "ceremony" photographs that
are generated, on plinths carrying the State Emblem of India, whose use is
regulated by the State Emblem of India (Prohibition of Improper Use) Act, 2005.
It sits oddly beside a site whose `/recognitions` page will not print an
evidence link it cannot source, and whose Presidential ledger itemises four
citations against a stated six. It is in the film because the film was asked
for as supplied, and it has been raised with the owner.

It now plays behind the one chapter that is about the Presidential awards,
veiled to a dim room, with three real archive photographs standing in front of
it. That is closer to right than a generated hall behind the materials copy
was. The generated frames and the emblems are still in the footage. If the hall
has to come out, what replaces it is more of the real archive in
`src/assets/hof/`, not another generated room.

Since 2026-11-18 the veil is heaviest across the band the cases and plinths
stand in, where it used to be lightest. See **The hall's veil follows what is
in the room**.

## Shields follow the footage

The text shields in `ScrollSections.tsx` are tuned to what is behind them, and
all seven chapters have new footage behind them. What each one carries now:

| Chapter | Laptop | Phone |
|---|---|---|
| 01 Origin | centre 0.56 | the same |
| 02 Early Works | right 0.80 | a scrim rising from the foot, clear of the face |
| 03 Presidential | a veil over the whole frame: 0.80 under the header, 0.62 between the header and the copy, 0.76 by 46% of the height and 0.80 at the foot; and a band that travels with the headline and keeps its ground at 0.72 | 0.80 at the head, 0.72 at 30%, 0.76 at 56%, 0.80 at the foot |
| 04 Global | right 0.82 | centre 0.80 |
| 05 Materials | left 0.82 | a scrim rising from the foot, clear of the "C" atom |
| 06 Industrial | right 0.88 | right 0.88 plus left 0.70 |
| 07 The close | centre 0.84 | a scrim falling from the head, clear of the skyline |

The hall is the brightest sustained footage in the film and chapter 3's copy
runs the full width of it, so no side shield can cover the type. Its veil was
0.86 / 0.70 / 0.84 first, which measured well and showed a black room: the
film has to stay a film. Then 0.80 / 0.70 / 0.60 / 0.76 until 2026-11-18,
which was lightest across the generated display cases and heaviest on the
architecture.

Whole page, every line of fully-arrived copy at 25 scroll stops — the start,
middle and end of every chapter's hold. Contrast of the stroke cores against
the pixels actually behind the glyphs, at the weakest sixth of each line:

| | lines | below 3:1 | below AA |
|---|---|---|---|
| 390 phone, five chapters on the 2x cut | 212 | 18 | 43 |
| 390 phone, seven chapters | 268 | 0 | 9 |
| 1440 desktop, five chapters on the 2x cut | 328 | 128 | 167 |
| 1440 desktop, seven chapters | 348 | 0 | 53 |
| 390 phone, after the second pass | 287 | 0 | 0 |
| 1440 desktop, after the second pass | 367 | 0 | 0 |
| 390 phone, after the third pass | 287 | 0 | 0 |
| 1440 desktop, after the third pass | 362 | 0 | 0 |
| 390 phone, after the fourth pass | 305 | 0 | 0 |
| 1440 desktop, after the fourth pass | 382 | 0 | 0 |

The two rows of each pair are different pages measured at different stops, so
read them as a level, not as a line-for-line comparison. What moved the desktop
figure is mostly not the shields. The first measurement of the new page had
145 lines below AA with every background under control: the weak lines were
supporting sentences at `muted-foreground/90`, captions and register notes at
55-60% alpha — dim ink, not bright footage. Those went to `foreground` at
70-85%. After that: 53 and 9, every one of them a 10px label — chapter
eyebrows, the register's years, the closing index, "Back to top" — between 3.1
and 4.46.

The second pass took those to nothing. They were not far off: the eyebrow's
accent went from 90% to full, the numbers, years and index links from 70% to
85%, the photographs' second caption line from 75% to 85%, the closing
chapter's label to 95%. One of them was not dim at all. The phone's "07"
measured 3.12 at 80% ink on black, then 4.0 at 95%: at 10px the strokes of "0"
and "7" are under a pixel wide and their cores never reach the ink's colour.
It is a weight heavier than its label now and passes. **A low reading on white
type over black is the stroke, not the colour** — raising the alpha a third
time would have done nothing.

This is the homepage only. The site-wide contrast record further up, with its
10px eyebrows at 30-60% alpha, is about the internal pages and is unchanged.

## Measured

2026-11-17, local production build under `wrangler dev`, with the build that
was live — the 2x cut under five chapters — served beside it as control.

- **Sync, the check this change exists for.** At five points across every
  chapter's full-opacity hold: which chapter is painted, which exported frame
  the canvas is actually showing — matched against the files, not computed —
  and which scene that frame belongs to. 35 of 35 at 1440 and 35 of 35 on a
  390 phone: every chapter's copy is on its own scene for the whole of its
  hold. At the six hand-over midpoints the screen carries no copy and the film
  is mid-transition.
- 24 of 24 film checks: frames only from the new directory, every request 200, none
  to an older cut, `/p/` on a portrait phone and `/m/` in landscape,
  determinism and frame selection as above, 0 console errors, 0px overflow,
  loader releases, reduced motion shows the film's still and scrolls.
- `scripts/e2e-scroll.mjs`: all passed, 7 inconclusive. The seven are the keyboard start and the six rail jumps — "no movement within 14s" — which is this container's frame delivery, and the control build reports the same for its own rail. The rail was checked a second way, under reduced motion, where there is no Lenis to wait for: 7 of 7 buttons land on the first pixel of their chapter's hold, with that chapter at full opacity.
- Layout, ten compositions at each of twelve viewports from 1920x1080 to
  360x640: nothing outside its frame at the five laptop sizes, the tablet and the five portrait phones. On a phone held sideways (844x390) every composition sits between the header and the foot with nothing clipped; chapter 3's three photographs are about 80px tall there.
- 13 routes at 1440 and 390: 200, 0px overflow, one `h1`, absolute canonical,
  0 errors.

On production, the same day, after the two superseded directories were
removed: all 1,443 files of `inventor-story-481/` are byte-identical to the
repository by checksum; `inventor-film/` and `inventor-story/` answer 404; the
served HTML carries the seven headlines, one `h1` and none of the five retired
headlines; the deployed bundle names `inventor-story-481` and 481; 13 routes
answer 200. The sync check in a real browser, through a local mirror of the
origin: 35 of 35 at 1440 and 35 of 35 on a 390 phone, with screenshots at the
middle of the first six holds and at the end of the page on both. The two
console errors in those runs are the mirror's own: it answers GET only, so the
`/cdn-cgi/rum` beacon gets 501, and it returns 502 when its own request
upstream is cut short.

Three things about checking production from this container. `grep -o` printed
"binary file matches" for the served HTML and counted nothing, so every
headline read 0 — the retired ones included, whose check is that they read 0.
Use `grep -a`, and prove a check for absence can find something before
trusting it. Frame files are numbered from 0001 — index `i` is
`frame_{i+1}` — so `frame_0000` is a 404 by design. And about one request in
several hundred is cut short by the container's proxy while still reporting
200: a 27,472-byte frame came back as 7,958 bytes, and 4 of the 1,443 needed a
second attempt. Compare checksums, with a retry, not the size of one download.

Not verifiable here: how it feels on real hardware. This container rasterises
in software and has no H.264 decoder. A laptop and an iPhone have since been
measured, from recordings — see **Measured on real hardware** in the motion
system's section.

## Six more instruments that lied

- **Stepping through pixel data by a number that is not a multiple of four.**
  A "has the canvas painted yet" guard sampled every 4001st byte, landed on
  the alpha channel, read 255 and declared a black canvas painted.
- **A page opened straight after another browser context closes receives no
  animation frames for about fifteen seconds**, while reporting
  `visibilityState: "visible"`. The loader still exits — it runs on load
  callbacks — the page scrolls, and the canvas is an unpainted rectangle. It
  read as the renderer stalling after a jump, on the phone profile only, and
  only when that test ran second. Wait for frames to be delivered before
  measuring anything that is drawn.
- **A stable canvas is not a settled one.** Six identical reads with nothing in
  flight is not enough: see the jump note above. Three seconds of stillness
  was.
- **`vite preview` answers 500 for `/`.** Its preview plugin looks for
  `dist/server/server.js`; the build emits `index.js`. Static files still
  serve, so a frame URL returns 200 and suggests the server is fine. Serve the
  build with `npx wrangler dev -c dist/server/wrangler.json`.
- **A scroll measured at 1440x900 in this container measures the container.**
  The full-size canvas renders three to five frames a second in software, so
  Lenis takes ninety seconds to cross the page and every timing is the
  rasteriser's. The same harness at 960x540 runs at fifty. This file already
  said so, under "Measuring this page in a container without a GPU"; the first
  scroll comparison of the story cut was run at 1440 anyway and had to be
  thrown away.
- **Three seconds of stillness was not always enough either.** Two of the
  film checks failed on a canvas that was still showing the previous scene —
  correlation 0.04 with every frame near the playhead — after twenty identical
  reads with nothing in flight. Thirty reads, 4.5 seconds, passed. The same
  effect returned frame 517 at correlation 0.914 for a position that calls for
  527, which looked like a sync fault and was the harness reading early. A low
  correlation is the tell: a frame that is merely a neighbour scores 0.99.

And one about the tooling rather than the site: `/usr/local/bin/python3` here
has no numpy; `/usr/bin/python3` does. "The imaging stack is gone" was a
conclusion drawn from the first one on the path.

# The story — seven chapters set to the film

The homepage's copy was rewritten on 2026-11-17 to follow the film behind it.
The owner's complaint was exact: the content coming up during the scroll did
not match the picture, and "still old contents are there". They supplied a
seven-scene storyline with a caption for each scene, and then a longer brief
for the same change.

The page used to run five chapters in its own order — Origin, Material
Intelligence, Industrial Translation, Recognition & Ecosystem, Future Systems
— over a film that runs workbench, inventor, hall, Earth, lattice, industry,
city. So the hall played behind "Engineering intelligent matter." and the
lattice arrived under Future Systems. This file used to list two honest fixes
for that and call both the owner's decision. This is the second of them — the
chapters reordered to the film — together with a re-cut of the film so that
each scene lasts as long as its chapter. The re-cut is under **The story
cut**, in the film's section.

## The seven chapters

| | Film | Headline | With it | Link |
|---|---|---|---|---|
| 01 · Origin | workbench | Every invention begins with a problem worth solving. | A young inventor. A workbench. The beginning of a journey. | — |
| 02 · Early Works | inventor at the bench | Six years. Six inventions. One purpose. | 2008–2013 · From vehicle safety and assistive technology to energy and wearable safety. | Explore Early Works → `/early-works` |
| 03 · Presidential Recognition | hall | Six Presidential Awards. Three Presidents of India. | 2008–2013 · Six national recognitions. A journey of invention that continues today. · three archive photographs · Selected moments from the Presidential recognition archive · 2008–2013 | View Presidential Archive → `/recognitions` |
| 04 · Global Recognition | Earth | From India to the global stage. | a dated register, six rows | Explore Recognitions → `/recognitions` |
| 05 · Advanced Materials | graphene lattice | From inventions to intelligent materials. | Graphene and advanced materials became the next chapter of the work. | Explore Innovations → `/innovations` |
| 06 · Industrial Impact | viaduct, then plant | One material platform. Many industries. | Concrete. Solar. Batteries. Thermal management. Advanced composites. · four rows: Graphacrete, concrete admixture; Graffisol, solar coating; Graphenodes, battery electrode materials; Thermene, thermal interface compound · Six operating companies carry that platform into industry. | See the Work → `/innovations`, View Ventures → `/ventures` |
| 07 · The Work Continues | city | Sushanth Paatnaik · I build what does not yet exist. | The future is not imagined. It is engineered quietly. · Inventor · Entrepreneur · Speaker · Advisor · Mentor · 25 Innovations · 6 Ventures | Begin a conversation → `/contact`, Explore my journey → `/about`, and an index of the other eight sections |

The headlines are the owner's captions. Chapter 6 takes its headline from the
later brief, not the earlier storyline, which had "25 Innovations. 6 Ventures.
One Vision." there; the brief moved those two figures to the close, where they
sit under the name.

The site's signature line used to open the page as its `<h1>`. It closes it
now, because that is where the storyline puts it. The `<h1>` is the first
chapter's headline — one per page, and the first heading a reader, a crawler
or a screen reader meets — and the closing line is an `<h2>` like every other
chapter heading.

## Every claim in the copy is one the site already makes

Nothing was taken from the brief on trust. Each line was checked against the
page that owns it before it went in:

- **Six inventions, 2008–2013** — `/early-works`: "Six original inventions
  built between 2008 and 2013", one a year. The four fields named are its own
  categories: Mobility Safety, Assistive Technology, Off-Grid Energy and
  Energy Harvesting, Wearable Safety.
- **Six Presidential Awards, three Presidents** — `/recognitions`. The ledger
  there still itemises four citations against a stated six, and that item is
  still open; this chapter repeats the site's own count and adds nothing to
  it. It says "Three Presidents of India" and never "sitting Presidents":
  Dr. Kalam left office in 2007 and both his citations are titled "Former
  President of India Award".
- **The register** — six rows of the same ledger with its years: TR-35 from
  MIT Technology Review, Intel IRIS · Best Popular Invention and INK Fellow in
  2010, NASA in 2011, TED@Bangalore in 2012, MIT Fab-10 & Fab-11 in 2013–14.
  The INK row came in on the second pass; it is one of the four rows on
  `/recognitions` that carry an evidence link, to the organisation's own
  profile. The NASA row
  says where — Huntsville, Alabama — and nothing about what for. A satellite
  in the film's Earth shot is scenery, not a claim about a mission; the
  generated insignia that shot arrived with was painted out of the frames.
- **Four product names** — each is on `/innovations` in the industry beside
  it: Graphacrete in Construction · Cement, Graffisol in Solar · Coatings,
  Graphenodes in Energy Storage · Electrodes, Thermene in Thermal ·
  Interfaces. What each one is, since the fourth pass, is its own catalogue
  entry cut to a noun phrase — see **The fourth pass**.
- **25 and 6** — the catalogue on `/innovations` and the roster on
  `/ventures`.
- **Five roles** — four stated on the site: inventor throughout; "serial
  entrepreneur" in the press on `/news`; TED@Bangalore and sixty keynotes on
  `/recognitions`; six companies advised on `/ventures`. The fifth is not.

**"Mentor" is there on the owner's word.** The brief's role line had five
words, and the fifth is stated nowhere else on the site, so it was left out —
the brief's own rule was to change no biography fact the site does not already
carry — until the owner asked for it on 2026-11-18. `ROLES` in
`ScrollSections.tsx` is the one place it lives. On a phone the five are two
rows, the first two and then the other three, not two rows of two and a
third of one: that would strand a word, which is what the rows are there to
prevent.

## What the brief asked for that was not done

The brief was written without sight of the code, and four things in it do not
describe this site:

- It specifies a `<video>` scrubbed through `currentTime`. The film is a WebP
  frame sequence on a canvas — which is what the owner asked for when the film
  was installed — so its instructions about `muted`, `playsInline` and seeking
  have nothing to act on.
- It asks for a piecewise scroll-to-video mapping, so the hall can run longer
  than its share of the footage. A piecewise map over a fixed set of frames
  stretches some scenes and thins others, which is the 5.7:1 density spread
  `CanvasLayer.tsx` records as a visible stutter. The same allocation went
  into the frames instead, and the map stayed linear.
- It asks for the film to be clamped at 9.45s, short of a garbled website that
  fades in over the last frames. That was already so: frames 227–239 were
  never exported.
- It points "Begin a conversation" at `/engage`. It goes to `/contact`, as it
  does in the mobile action bar and did before; `/engage` is in the closing
  index.

Its scroll allocation gave the hall 27% of the page. It has 22.7%, the widest
band by a factor of 1.4 — any more comes out of chapters that are already
holding for about two thirds of a screen.

## The Presidential photographs

The hall is generated — its trophies, the framed "ceremony" pictures in its
cases, the emblems on its plinths. None of it is evidence and none of it is
counted. So in chapter 3 the film is not the picture: a veil takes the hall
down to a dim gold room, and three archive photographs stand in front of it.

They are `award-kalam.webp`, `award-pratibha-patil.webp` and
`award-pranab-mukherjee.webp` from `src/assets/hof/` — the files `/recognitions`
prints — with that page's captions, word for word, and its `archive-grade`
class. They are DOM laid over the canvas, never frames, so they can be changed
without touching the film. The captions sit under the photographs, not on
them.

Two things about how they load:

- They mount when the reader reaches chapter 2, not on first paint. The stage
  is `position: fixed`, so to the browser every image in it is in the viewport
  from the first frame and `loading="lazy"` would fetch all three at once.
  Mounting late is what defers the 197 KB.
- Each calls `decode()` as it mounts, so the first paint of a plate does not
  land inside the dissolve that reveals it.

On a laptop the three share a row, capped by viewport height as well as by the
column so the block still fits a 720px screen. They arrive left to right as
the chapter does — see **The Presidential entrance**. On a phone they cannot: at a
third of 390px each is too small to look at. The statement holds and the
photographs turn over beneath it one at a time, 2009, 2010, 2013, about 47vh
of scrolling each.

## Phone compositions

Two chapters are staged on a phone held upright, chapter 3 as above and
chapter 7 in two states: the founder's line alone, then the name, the headline, the roles and
the buttons, which is also where the page ends.

**A staged chapter has to finish inside its hold, not inside its band.** The
last 0.060 of every band is the hand-over to the next chapter. A first version
timed the third photograph to arrive at 0.775 of chapter 3's local progress;
the chapter starts leaving at 0.736, so the 2013 plate never once appeared at
full opacity. It passed every automated check, because nothing was checking
that a state reaches 1. `PresidentialMobile` now derives its timings from
`CHAPTER_BANDS` and `CONTENT_FADE`, so they move with the bands.

Three chapters are lower thirds on a phone rather than centred, each for what
is in the middle of its frame: the inventor's face (chapter 2), the lattice's
labelled "C" atom (chapter 5), which showed through the middle of a centred
headline. On a laptop chapter 5's headline is three short lines for the same
reason — as two long ones, "materials." ended on the atom.

Below 560px of height the laptop compositions drop their optional rows and
size their type by height as well as width, so a phone held sideways clips
nothing and no chapter scrolls internally.

## The second pass

Later the same day the owner sent a screen recording of the live page, a
screenshot of chapter 3 with "is it fine?", two more briefs — one for the
whole homepage, one for the Presidential chapter, the second cut off
mid-sentence after its third section — and "make sure the website works well
on mobile phones too". The recording is under **Measured on real hardware**,
and what it found in the renderer under **The film was drawn narrow beside a
classic scrollbar**, both in the motion system's section. The rest is here.

**Copy.** The Presidential brief's two lines went in as written. "Six national
recognitions. A journey of invention that continues today." replaces "The
record exists. The next prototype matters more."; "Selected moments from the
Presidential recognition archive · 2008–2013" sits under the gallery, on the
archive link's row on a laptop. Neither is a new claim: six is the headline's
count, and the three photographs are dated 2009, 2010 and 2013. The new
sentence stood directly under "National recognition for early inventions."
and echoed it. That was raised with the owner, not edited, and the next day
they had the older line removed: see **The third pass**.

The captions were asked to "distinguish former and sitting Presidents". They
already did, and are unchanged: "With Dr. A.P.J. Abdul Kalam" carries no
title, and the other two say "President".

### The Presidential entrance

On a laptop the chapter's parts arrive in reading order: the headline with the
wrapper, the note just behind it, the three photographs left to right, then
the line under them. Each is an opacity ramp and a 12px rise, scroll-linked,
inside the wrapper's own 30vh fade-in — the note across 0.05–0.50 of it, the
photographs across 0.10–0.55, 0.30–0.75 and 0.50–0.95, the line across
0.55–0.95. The photographs start 6vh apart, a tenth of a second at the pace
the owner's recording scrolls. Reduced motion keeps the order and drops the
rise.

**It has to be complete at the band's first pixel, not shortly after it.** The
chapter rail jumps to exactly that pixel. The first design, caught on paper
before it was built, let the photographs run 24vh into the hold: that reads
well while scrolling and leaves a visitor who clicked "Presidential
Recognition" looking at a gallery with its third photograph at 2%, at rest.
This is the same rule as "a staged chapter has to finish inside its hold",
from the other end.

Measured at 1280x800, 1440x900 and 1024x768: left to right; every part at
1.000 at the rail's landing pixel; at 1 through the hold; whole when entered
from below; and scrolled back to the middle of the window the three
photographs read 0.97 / 0.42 / 0.00, the values they had on the way in.

### What a 320px phone showed

The briefs name 320px and nothing here had been run that small. On the build
that was live, at 320x568:

- Chapter 3's eyebrow wrapped to two lines at 0.42em tracking, and the
  photograph — whose box is placed at 27.5% of the height, not flowed — sat on
  top of "Three Presidents of India." **The layout audit passed it**: it
  checks a composition against the header and the foot, not its parts against
  each other. It took a screenshot.
- "View Presidential Archive →" wrapped with the arrow alone on its own line.
- Chapter 4 stood 8px under the header with five rows, and would not have
  held a sixth.
- The `h1` ran to four lines and chapter 6's headline to three.

The eyebrow and the chapter links step their tracking in below 340px of
width; the photograph's box starts at 30% under 600px of height; the
register's year column and row padding step in; the two headlines take a
fixed size below 340px that keeps their designed line counts.

### A phone held sideways

Tested at 844x390 before, where the laptop compositions apply, and never
below 768px of width — 667x375, 740x360 — where the gate said "mobile" and
the portrait compositions were laid into a frame half their height. Chapter
3's photograph came out 500px tall in a 375px viewport, its caption and link
off the bottom; the closing chapter's bands landed on top of each other;
three more chapters ran under the header. All of that was live.

The phone compositions are portrait-only now, and the short-viewport rules
are orientation-aware: `stage-ls` is landscape under 560px of height at any
width, where it used to be written `[@media(max-height:560px)]:md:`;
`stage-ps` is portrait under 600px. **Height alone cannot tell them apart** —
a 375x667 phone with its browser toolbars showing is about 553px tall and
still portrait, and an un-gated 560px rule would have recentred chapter 2's
copy onto the inventor's face.

Every composition is inside its frame at 896x414, 844x390 and 667x375, and
to within a pixel at 740x360. At 568x320, a ten-year-old phone on its side,
chapters 3 and 4 run 2px and 7px into the header's band and that is where it
was left.

### What the two later briefs asked for that was not done

- A `<video>`, seek throttling, ScrollTrigger: there is no video element and
  no GSAP, as before. "Clamp to the last clean frame" was already so.
- **Product descriptors in chapter 6** — "Graphacrete — Graphene Concrete
  Admixture" and three more. Not added. The catalogue's own words would be
  concrete admixture, solar coating, cathode and anode materials, thermal
  interface compound, which is not the brief's wording; and this is the
  shortest hold on the page, where the rule is to shorten copy, not add it.
  Offered to the owner in the catalogue's words, and taken up the next day:
  see **The fourth pass**.
- Photographs or certificates in chapter 4, and rows that arrive one at a
  time. The Earth is that chapter's picture, six rows of a register are not
  clutter, and a 69vh hold is too short to stage them through.
- "INK Fellowship" went in as the ledger words it, INK Fellow.
- Performance work. None was done because nothing measured slow: no new
  listener, no new React state; ten motion values that change only inside
  chapter 3's entrance.

### Measured, second pass

2026-11-17, local production build under `wrangler dev`.

- Sync: 35 of 35 at 1440 and 35 of 35 on a 390 phone.
- Film checks: 24 of 24, run alone. Run beside another browser the same
  script gave 22 of 24, one position read "from below" at correlation 0.16 —
  the stale-canvas tell this file already describes, not a neighbour's 0.99.
  Determinism hashes identical to the previous build's.
- Layout, ten compositions at each of nineteen viewports from 1920x1080 to
  320x568: nothing outside its frame on any desktop, tablet or portrait
  phone; sideways as above.
- Contrast: 0 lines below 3:1 and 0 below AA, 367 lines at 1440 and 287 at
  390.
- Routes: 13 at 1440 and 390, and 78 route-and-viewport checks on six
  touch profiles with the menu opened and closed on each.
- Chapter rail: 7 of 7 land on their chapter's first pixel at full opacity.
- `scripts/e2e-scroll.mjs`: all passed, 7 inconclusive — the keyboard start
  and the six rail jumps, as before, which is this container's frame delivery.
  The rail is the 7 of 7 above.
- Scroll tracking at 960x540, wheel-driven: three fast runs, a steady
  run and a phone run. The picture is a median 0.5-0.6vh behind the scroll
  position and within 1vh on every draw, except one reverse fast run whose
  worst draw was 3vh; 0-1 long tasks a run. The previous build gave 0.5-0.6vh
  and 1vh on the same harness the same evening.

On production, live at 23:41 UTC the same day. The deployed script and
stylesheet are the files that were tested, by name — `index-B47C0F5X.js`,
`styles-Bo8WeNTM.css`; 24 frames sampled across the three sets match the
repository by checksum; 13 routes answer 200, and nothing answered anything
else while the deploy landed. In a real browser through the local mirror:
sync 35 of 35 at 1440 and 35 of 35 on a 390 phone; the entrance checks at
1280x800; the film's proportions beside a classic scrollbar, 1.0000 at
1440x900 and 1280x800; layout clean at 1280x800, 390x844, 320x568 and
667x375, with screenshots of every chapter at the first two.

The first 390x844 layout pass through the mirror printed Origin's box for the
first four stops. The loader had not released on the slow link, the page had
not moved, and the harness's own "did not scroll" guard caught one of the
four. Re-run, clean. **A row that repeats the row above it is the page not
having moved**, whatever the flags column says.

## The third pass

2026-11-18. The owner sent a screenshot of the Presidential chapter with "Is
it fine now?", a second recording of the live page, "yes do it" to the one
change proposed in answer to the screenshot, and a third brief — "Final
Cinematic Website Polish", a restrained pass over captions, the hall, the
register, the header's contrast and the transitions, with a list of things to
leave alone.

**Copy.** One line went, on the owner's word: "National recognition for early
inventions.", which the sentence added the day before said again. What is
left is set one statement to a line on a laptop, the way the headline beside
it is; as a single run it broke after "…invention that" and left "continues
today." alone. On a phone it is `text-wrap: balance`.

### The second recording

The same Mac, 1280x832, 15 frames a second, the build with the proportion
fix, down the page once in 12.2 seconds. Read the way the first one was.

| | first recording | second |
|---|---|---|
| the film's horizontal scale over its vertical | 0.990 | 1.001 |
| frames matched to the film | 454 | 215 |
| at rest, picture behind the scroll position, median | 0.04vh | 0.05vh |
| scrolling forward: median, p90, worst | 1.74, 3.12, 4.47vh at 55vh/s | 1.09, 2.09, 3.86vh at 76vh/s |
| the delay that explains the moving frames | 33ms | 14.8ms |
| captures with the scroll moving and the picture standing still | 0 | 0 |

The correction recorded under **The film was drawn narrow beside a classic
scrollbar** is confirmed on the machine it was found on. The delay is one
display frame where it was two; two recordings are two observations, not a
trend. Neither shows a flash at chapter 3's hand-overs: the frame's mean
level runs 22, 39, 22 through one, smoothly.

The recording carries a `CAM.ON` mark in a corner. It is the owner's screen
recorder. It is not in the site and nothing was done about it.

### What the brief named, and what was found

Measured on the live build before anything was changed.

- **The header's links over the film: 3.2:1**, on every chapter. Fixed, and
  recorded with the header under **The header row** in the first section —
  which also records two defects this audit found that the brief had not
  named, in the header from 1024 to 1279px and in the menu on short screens.
  Both were on every route: the first on a tablet held sideways or a narrow
  laptop window, the second on a small phone or any phone held sideways.
- **The hall's veil was upside down.** In the hall's frame the top third is
  architecture: arches, a chandelier, the ceiling. From about 43% of the
  height to 88% it is display cases, their trophies and framed pictures, and
  plinths carrying the State Emblem — generated, all of it. The veil was 0.80
  at the head and lightest, 0.60, at 56%: heaviest on the architecture and
  lightest on the cases.
- **Captions, labels and the register were legible already**, from 4.7:1
  upward with nothing under AA. They were lifted because the brief asked,
  not because they failed.
- **Nothing reproducible in the scroll.** See the recording above and
  **Measured on real hardware**. Nothing in the motion system was touched.

### The hall's veil follows what is in the room

The brief asked for a little more of the hall's architecture without
lightening the page or weakening the type. On a laptop the veil is now 0.80
under the header, 0.62 from 13% to 30% of the height, 0.76 by 46% and 0.80 at
the foot.

The headline does not stand on 0.62. Its block starts anywhere from 17% of
the height, on a 1280x720 laptop, to 27% on a 1080p screen, so no stop in a
frame-sized gradient can be "just above the headline" on all of them.
`HeadScrim` is a band inside the block, bleeding past both edges of the
frame, that brings its own ground back to 0.72 — the level the eyebrow stood
on before — and fades in over 36px above the block and out over 32px below
the headline, so there is no line across the hall where it starts or stops.
What is left lighter is whatever lies between the header and the copy: a wide
band on a tall screen, nothing on a phone held sideways. A phone held upright
keeps a plain veil, 0.80 / 0.72 / 0.76 / 0.80, because its headline starts
straight under the header and there is no band to open.

Mean level of the frame at 1280x800 with chapter 3 at rest:

| band | before | after |
|---|---|---|
| under the header | 4.6 | 5.0 |
| between the header and the copy | 9.2 | 13.2 |
| the margin left of the photographs | 16.4 | 10.0 |
| the margin right of them | 6.1 | 3.4 |
| the rows under the captions | 8.5 | 6.5 |

The architecture is 43% brighter and the generated cases are darker than they
were. **For two thirds of the frame that is the opposite of "reveal more of
the hall", and it is deliberate**: see **What is in the film that someone
should know about**. If more of the room is ever wanted, it is wanted above
the copy.

### Small type in chapters 3 and 4

Contrast of the stroke cores at the weakest sixth of each line, 1440x900,
each chapter at rest, the live build and then this one:

| | before | after |
|---|---|---|
| photograph captions | 6.5 to 7.4 | 7.2 to 8.3 |
| their second line, "Presidential Award · …" | 5.4 to 5.9 | 7.9 to 8.8 |
| the archive note under the gallery | 7.1 | 9.0 |
| "View Presidential Archive →" | 7.2 | 9.2 |
| the supporting sentence | 8.2 | 10.2 and 11.4, a line each |
| "Presidential Recognition", the eyebrow | 4.73 | 4.72 |
| the headline's two lines | 15.4 and 11.0 | 15.5 and 11.4 |
| the register's years | 6.0 to 8.2 | 7.9 to 8.8 |
| the register's names | 9.6 to 11.9 | 10.6 to 13.3 |
| what each was for: "TR-35", "Speaker" | 5.9 to 7.1 | 7.8 to 9.5 |
| "Explore Recognitions →" | 6.9 | 8.9 |

One of the four years, 2012, read 8.2 before and 8.0 after, with more ink
and on the same ground. At 10.5px a thin digit's stroke lands across two
pixels where at 10px it landed on one, and this instrument reads the core of
the stroke. It is the note about the phone's "07" again: the stroke, not the
colour.

Ink went from 90% to 95% on the captions and the register's names, 85% to 95%
on the captions' second line and the register's years, and 75% to 85% on the
archive note, the register's notes and `CHAPTER_LINK` — which is one
constant, so every chapter's link took the same step. Three sizes moved by
half a pixel: the register's years and the captions' second line to 10.5px,
the register's notes to 14px.

The captions' second line takes its half pixel from 1280px up and no sooner.
"Presidential Award · NIF · 2009" is 31 monospace characters at 0.2em
tracking: 248px at 10px and 260px at 10.5px, whatever the face. A plate is
265px wide at 1024, 260px there beside a classic scrollbar, and 251px on an
834px tablet. From `md` the half pixel would have wrapped the first caption
on those and left the other two on one line. It was written that way first
and caught on paper.

### What the brief asked for that was not done

- **Anything in the scroll.** Step 6 asks for flicker, jerks, abrupt fades
  and seeking conflicts to be removed "if found". None was found: two
  recordings of real hardware show the picture one to two display frames
  behind the scroll with no stall, and the sync check is 35 of 35 twice.
- **"No brief blank screens" between the hall and the Earth.** The 70px in
  which neither chapter's copy is painted is the 0.50/0.50 hand-over under
  **Known, deliberate, NOT defects**. Closing it puts two headlines on screen
  at once, which the same sentence of the brief rules out.
- **A backdrop behind the nav.** The links needed ink, not a panel; the
  header's veil is what it was.
- **More of the hall where the cases are.** Above.
- **A `<video>`, a clamp at the last clean frame, a reduced-motion fallback.**
  There is no video element, frames 227-239 were never exported, and reduced
  motion has shown the film's own still since the film was installed.

### Measured, third pass

2026-11-18, local production build under `wrangler dev`, with the live build
served beside it through the mirror as control.

- Sync: 35 of 35 at 1440 and 35 of 35 on a 390 phone. An earlier run of the
  same check gave 34 of 35 at 1440: one sample in the close read frame 432
  for 442, at correlation 0.958, while a numpy job ran beside the browser.
  Alone, 35. It is the stale-canvas tell again, from a smaller cause than the
  last one: not a second browser, one analysis script.
- Film checks: 24 of 24, with the five determinism hashes identical to the
  previous build's. Film proportions: 1.0000 at four sizes beside a classic
  scrollbar and at the same four without one.
- Layout, ten compositions at each of twenty-one viewports from 1920x1080 to
  320x568: nothing outside its frame on any desktop, tablet or portrait
  phone. On a phone held sideways the audit flags the seventeen rows it
  flagged on the build before — a composition that starts within 6px of the
  header — each where it was to the pixel, but one that is a pixel lower. The
  834x1194 tablet printed one box for its first six stops and was re-run
  alone: clean.
- Contrast: 0 lines below 3:1 and 0 below AA, 362 lines at 1440 and 287 at
  390. Five fewer at 1440 than the pass before, which is the removed line at
  five stops.
- The header and the menu: as under **The header row** and **Mobile
  navigation**.
- Entrance at 1280x800 and 1024x768, all checks; chapter rail 7 of 7; reduced
  motion 9284px and 1749 characters on a phone, both unchanged.
- Routes: 13 at 1440 and 390, and 130 route-and-viewport checks on ten touch
  profiles with the menu opened and closed on each.
- `scripts/e2e-scroll.mjs`: all passed, 7 inconclusive — the keyboard start
  and the six rail jumps, as before. The rail is the 7 of 7 above.
- Scroll tracking at 960x540, wheel-driven: three fast runs, a steady
  run and a phone run. The picture is a median 0.5-0.6vh behind the scroll
  position and within 1vh on every draw, forward and back; no long task in
  four of the runs and one of 53ms in the fifth. The build before gave the
  same medians, with one reverse run whose worst draw was 3vh.
- `tsc --noEmit` is clean. `eslint` on the two files reports the formatter and
  nothing else: 6 findings in `Nav.tsx` and 46 in `ScrollSections.tsx`, which
  is what they had before this pass. `eb1c9e65` had added two, on lines it
  wrote; `1be9000b` is those two lines reformatted.

On production, live at 10:34:48 UTC the same day, 3m54s after the push of
`eb1c9e65`. The four files a page loads — `Nav-Dckh8EMC.js`,
`index-CBHhycHj.js`, `index-D5cCgcqP.js`, `styles-Cmnci6Wg.css` — are the
files that were tested, by checksum, and `1be9000b` builds to the same four.
13 routes answer 200, each with an absolute canonical. The served HTML
carries the sentence and not the removed line; twenty seconds earlier the
same check had found that line on the old build, so it can find it. In a
real browser through the local mirror: the header's gaps are the local
build's to the decimal at 1024, 1180, 1280, 1366 and 1440, and beside a
classic scrollbar at 1280 and 1440; 16 of 16 menu states reachable; sync 35
of 35 at 1440 and 35 of 35 on a 390 phone; the header's links 4.70 to 4.81:1
over all seven chapters; the entrance checks at 1280x800; layout clean at
1280x800, 1024x768, 390x844 and 320x568, with screenshots of chapters 3 and
4.

The route check printed FAIL for all 39 of its production rows. Every one is
the mirror's own: it answers GET only, so the `/cdn-cgi/rum` beacon gets 501,
which that check counts as a console error and a failed request. With that
one request set aside, 39 of 39 — 200, 0px overflow, one `h1`, lock
released, the menu opening and closing on Escape. And the 390x844 layout pass
printed Origin's box twice through the slow mirror; alone, clean.

## The fourth pass

2026-11-18, evening. The owner asked for the two things the third pass had
left as their call — "add the product descriptors and Mentor" — and, while
that was being done, sent two screen recordings of the live site: one on an
iPhone, one on the laptop.

Seven commits reached `main` from another session while this pass was being
verified, `c4392c5` to `88fd95c`: a timeout and corrected fields for the
contact form, the birthplace in the root's JSON-LD and on `/about`, age
wording on `/about` and `/early-works`, and new QA scripts and a CI
workflow. The push of this pass was refused as a non-fast-forward; they were
merged, not overwritten, in `ced0de38`. They touch no file this pass touches.
They are that session's to record — this file has checked them only so far as
the 13 routes answering 200 with an absolute canonical, no horizontal overflow
and no console error, at 1440 and on a 390 phone.

**Product descriptors.** Chapter 6's four names are four rows, each name
followed by what it is, in its own catalogue entry's words rather than the
brief's:

| Product | On the page | From its catalogue entry |
|---|---|---|
| Graphacrete | Concrete admixture | "Graphene nano-platelet admixture transforming standard concrete…" |
| Graffisol | Solar coating | "Solar coating delivering higher annual yield…" |
| Graphenodes | Battery electrode materials | "…cathode and anode materials for high-density batteries", in Energy Storage · Electrodes |
| Thermene | Thermal interface compound | "Graphene-loaded thermal interface compound…" |

The brief had "Graphene Thermal Management" and "Advanced Battery Materials",
and neither is how the catalogue describes those products. Graphenodes' joins
the entry's own "batteries" to its domain, Electrodes, so that each row names
the industry the sentence above it lists, in the same order. None is a
performance claim.

Every row is one line at all eighteen sizes measured, 320 to 1920 wide; the
longest, Graphenodes', is 272px at 320 where the column is 280. As the rows
first went in, a phone held sideways could not hold the chapter: at all five
landscape sizes it ran into the header and off the foot, at 568x320 by 28px
and 36px. Two things put it back. The row's type size is set on the `li`, not
only on its spans: left at the inherited 16px, the line height set the four
rows 28px apart instead of 22. And on a phone held sideways the industries
sentence takes the column's width, one line instead of two, with the list's
top margin halved; under 340px of height it steps back, because the four rows
under it name four of its five industries. After: no composition outside its
frame that was not outside it before, at twenty-one sizes.

**Mentor.** Last of five, where the storyline put it. One row on a laptop,
516px at 11px. On a phone two rows — the first two, then the other three,
213px and 258px — inside the 272px a 320px phone has for them.

### What the iPhone recording showed

A single pass down the page in Safari: seven chapters, each over its own
scene; the Presidential plates turning over; the close settling as Safari's
toolbar came back at the foot. Four things were not right, and none could be
seen from here: the first needs a collapsing toolbar, the other three the
phone's own face.

- **The film was 5% too tall** for the whole of the scroll. See **The film
  was drawn tall on a phone with its toolbar collapsed** in the motion
  system's section.
- **Origin's supporting line ran edge to edge.** Below `md` its `<br>` was
  hidden and the line left to `text-wrap: balance`. In Inter, the face this
  container has, that wraps it, at 216 and 186px on every phone. In the
  iPhone's face it fits on one line, so it sat as a single line from margin
  to margin under a headline two thirds that width. The `<br>` is
  unconditional now: two lines everywhere, as a laptop sets them.
- **Chapter 2's sentence left "wearable safety." on a line of its own**
  under one that ran to the margin, on the iPhone, and "and wearable safety."
  in the laptop's recording. Balanced now: 227 and 292px on phones, and at
  320, where Inter left "safety." alone on a third line of 46px, three even
  lines.
- **Chapter 6's decorative rule stayed at the right edge** below `md`, over
  copy that starts at the left. It follows the copy: flush left below `md`,
  as chapter 5 sets its rule, flush right from `md` up.

The grey disc at the right of every frame is the phone's own AssistiveTouch
button, not the site.

### The third laptop recording

The same Mac, the build before this pass, three minutes after the phone's.
283 of the 283 frames that show the site land within three frames of the
scrollbar's position, with no prior. The film's proportions read 1.001
again. At rest the picture is 0.05vh from the frame the position calls for;
scrolling, a median 0.98vh behind at a median 63vh/s, the worst 2.52vh at
144vh/s. One delay, 14.5ms, explains the moving frames with 0.35vh of
scatter. No stall; down the page in 13.9 seconds.

### Two more instruments that lied

- **`text-transform` is in `innerText` and not in `textContent`.** A weld
  check that compares the two, whitespace stripped, and skips an element
  where they differ — on the theory that the difference is hidden text —
  skips every uppercase label. On this page that is every eyebrow, every
  role and every product name: the four new rows and the role line were
  never compared, and the check said 0. Compare without case, print what was
  skipped, and plant a weld to prove the check can find one.
- **`ffmpeg` pads a variable-rate recording to its nominal rate.** The
  iPhone's file says 60 frames a second and holds 1,795. Extracted plainly it
  came out as 1,864, the 69 extra duplicates filling the stream's own gaps,
  and every timing read from them would have been wrong. `-fps_mode
  passthrough` keeps the frames the phone recorded, one per timestamp.

### Measured, fourth pass

2026-11-18, local production build under `wrangler dev`, with the live build
through the mirror as control.

- Sync: 35 of 35 at 1440 and 35 of 35 on a 390 phone.
- Film checks: 24 of 24. The five determinism hashes, and the three on the
  portrait set, are those of every build since the story cut. Film
  proportions beside a classic scrollbar: 1.0000, unchanged.
- The toolbar, reproduced: as under **The film was drawn tall on a phone with
  its toolbar collapsed**.
- Layout, ten compositions at each of twenty-one viewports from 1920x1080 to
  320x568: the seventeen rows flagged on the build before, each where it was,
  and no other. One row, chapter 4 on the 834x1194 tablet, is the harness
  reading a page that had not moved.
- Rows and roles: every product row on one line and the role line whole, at
  eighteen sizes.
- Contrast: 0 lines below 3:1 and 0 below AA, 382 at 1440 and 305 at 390. The
  first run gave 2 below AA, both the role line at the start of the close,
  4.14 and 4.46: with Mentor it is 516px wide and its ends reach past the
  shield. At 90% ink, from 80, they read 4.75 and 5.34. The phone's role
  line passes at 80% and keeps it.
- Welds: none, across 39 prose elements on a laptop and 40 on a phone, at ten
  stops each, the new rows and the role line among them. A planted weld is
  found.
- Routes: 13 at 1440 and 390, and 130 route-and-viewport checks on ten touch
  profiles with the menu opened and closed on each. Entrance at 1280x800, all
  checks; chapter rail 7 of 7; reduced motion 9284px and 1848 characters.
- `scripts/e2e-scroll.mjs`: all passed, 7 inconclusive, as before.
- Scroll tracking at 960x540, wheel-driven: a median 0.5-0.6vh behind and
  within 1vh on every draw, forward and back, in all five runs; no long task.
- `tsc --noEmit` is clean. `eslint` on the two files reports what it reported
  before, at the same counts: the formatter, and in `CanvasLayer.tsx` three
  `exhaustive-deps` warnings. Two new formatter findings, the new ternaries,
  were reformatted before commit.
- After the merge: routes 26 of 26, film checks 24 of 24, no welds, the
  toolbar reproduction 1.0003.

On production, live at 21:57:06 UTC the same day, 4m34s after the push of the
merge. The four files a page loads — `Nav-Csyur1pJ.js`, `index-0UQK5FUF.js`,
`index-DjIBOEJh.js`, `styles-D9lpp2GS.css` — are the merged build's, by
checksum, and the comment-only commit after it builds to the same four. 13
routes answer 200, each with an absolute canonical. The served HTML carries
the four descriptors, "Mentor", Origin's two-line supporting line and one
`h1`; twenty seconds earlier the same check found no "Mentor" on the build
before. In a real browser through the local mirror: the toolbar reproduction
reads 1.0003 in every state, which is the fix running on the live site; every
row and the role line whole at six sizes; no welds; sync 35 of 35 at 1440 and
on a 390 phone; layout clean at 1280x800, 390x844 and 320x568, and at 844x390
the six rows flagged there before, unchanged.

## What was retired

- The five old headlines and their paragraphs: "Engineering intelligent
  matter.", "One lattice. Many industries.", "Recognised early. Building
  continuously.", "Energy, water, materials. Built to industrial scale." and
  the phone-only "The next century will be engineered."
- The credential strip under the old hero. Every figure in it is still on the
  page, each in the chapter that is about it.
- The six-row directory. The homepage has no footer and the stage is fixed, so
  the closing chapter carries an index instead: one row, eight links, with
  About and Contact as the two buttons above it.
- **`RecognitionAmbient` is no longer mounted.** It was a ceiling crush, a
  floor crush and three spotlight columns placed for a trophy tableau two
  films ago. Over this hall it lit nothing that is there and took the top of
  the frame to 97% black — on top of the chapter's own veil, and only on
  machines capable enough to mount it, so the chapter looked one way on a
  laptop and another on a phone. The file is still in the tree because
  `AtmosphereLayer` imports it; `AtmosphereLayer` is mounted by no route.
- **`GrapheneVolumetric` shows across chapter 5 only.** It used to run from
  0.14 to 0.68 of the page, which was Material, Industrial and Recognition
  while those were the middle chapters. In the film's order that span is the
  inventor, the hall and Earth, and a molecular mesh over archive photographs
  of a ceremony is clutter. Its window is derived from `CHAPTER_BANDS[4]`.

The founder's line — "The future is not imagined. It is engineered quietly."
— was Origin's second beat and appears nowhere else on the site, so it moved
to the close rather than going.

## One more way a style lied

`text-shadow` on `.text-gradient` greys the letters. The fill is transparent
and the gradient is the element's background, which paints before the shadow
does — so a dark shadow lands on top of the gradient it was meant to sit
behind. The closing headline's two gradient lines came out visibly duller than
the plain line under them. The shadow is on the plain last line only.

## Unfreeze rule

The copy is the owner's, so a change of wording is theirs to ask for. Anything
else here — a band, a shield, a stage timing, which chapter a decoration shows
in — changes only with the defect, the viewport that reproduces it, the
measurement showing it and the measurement showing the fix. Re-run the sync
check after any change to the film or to `CHAPTER_BANDS`: it is the only
instrument that says whether a caption is still on its own scene.

# /innovations product panel — FROZEN

The 25-product catalogue and its inspection panel are frozen as of `682c01e7`.
Do not change the imagery contract, the provenance labelling, the title type
scale, the header layout, the caption row or the product-detail handoff without
first reproducing a specific, measurable defect.

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

## The product-detail handoff — one CTA, only where a page was verified

This site is the discovery layer: name, one-line description, domain, stage,
one outcome, application imagery. Specifications, performance data, validation,
certifications and enquiry live on the company product site. The panel's foot
carries exactly one CTA, and which one depends on what actually exists:

| Case | CTA | Destination |
|---|---|---|
| Verified company product page | `Explore Product Details ↗` | that page, new tab |
| No page, Commercial or Pilot | `Engage on this Innovation →` | `/engage` |
| No page, R&D | none | — |

15 external, 9 engage, 1 none. The R&D exception is Hydrocell alone: a
bench-stage programme has no product to enquire about, and offering to "engage"
on one invites a conversation there is nothing to have.

**Every url was verified by rendering it, not by a status code.** Both
destination sites are hash-routed SPAs and return byte-identical HTML for any
path, so a 200 proves nothing and a mistyped slug would have silently linked
the homepage. Monoatom's eight are dedicated pages with their own H1 and
2.1–3.3k characters; Grafillium's seven open the named product panel, confirmed
by its breadcrumb reading `GRAFILLIUM / PRODUCTS / <NAME>`. Re-verify the same
way before adding one.

Ten products are deliberately unmapped — Graphenodes, Thermene, Texaphene,
Rustene, Gryogen, Mariphene, Aerophenter, Vitraphene, Voltaphene, Hydrocell.
**Do not point them at a company homepage to fill the gap.** `/ventures`
already links the homepages, and a CTA promising product details that lands on
a marketing front page is the same defect as the duplicated application image:
a promise the destination does not keep.

`ProductCta` is one component rendered by **both** panel variants. Written
inline in the standard branch it misses Aquamax, whose `aquamaxSimulation`
variant replaces the right column entirely — and Aquamax has a verified page.
That was caught mid-work, after the audit had already reported a clean pass on
the other 24.

The focus ring here is the site's own: `focus:outline-none focus-visible:ring-1
focus-visible:ring-accent/70`, the same pattern the cards use. It resolves to a
1px copper ring, `oklab(0.63 0.026 0.097 / 0.7) 0 0 0 1px`, and it is visible —
3,536 pixels differ between the focused and blurred screenshot of the same clip.
An earlier pass read that computed value through a log line truncated at 80
characters, saw two transparent shadow layers, and reported a site-wide
accessibility defect that does not exist. Print the whole `box-shadow`, and
difference a screenshot.

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
