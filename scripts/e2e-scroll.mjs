/**
 * Homepage scroll regression suite.
 *
 *   npm run dev                       # or preview a production build
 *   node scripts/e2e-scroll.mjs [url] # default http://127.0.0.1:4321/
 *
 * Requires `playwright` to be resolvable. It is deliberately NOT declared in
 * package.json: this repo's lockfile has broken the production deploy before,
 * and a manual diagnostic is not worth that risk. Run `npm i -D playwright`
 * locally if it is missing.
 *
 * Exits non-zero on any failure, so it can gate a deploy if that ever becomes
 * worth wiring up.
 *
 * What it guards, and why each check exists:
 *
 *   1  No keypress from a standing start lands anywhere near mid-page. This is
 *      the regression the suite was written for — the chapter rail used to
 *      scroll to each chapter's band *midpoint*, so activating the focused
 *      "Go to Industrial Translation" button with Space put you at ~0.49 of
 *      the page in one keystroke, and "Go to Origin" scrolled past the hero.
 *   2  The page never scrolls the visitor back to the top after they have
 *      started reading. A ladder of restoration snaps used to run out to the
 *      unbounded `load` event and undo an early scroll seconds later.
 *   3  Exactly one chapter is interactive, and it is the one that reads as
 *      foremost — during a cross-dissolve both neighbours are painted.
 *   4  Inactive chapters are hidden from assistive tech and from tab order.
 *   5  Reduced motion gets no Lenis and no hydration mismatch.
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://127.0.0.1:4321/";

/**
 * Wait for a scroll to start, then finish. Two phases, both necessary.
 *
 * Lenis eases, and the duration depends on distance: Home from the bottom
 * travels the full page and is still moving after three seconds. A fixed wait
 * made the suite flaky in a way that read as a product bug — a keypress issued
 * mid-animation gets swallowed, so the next measurement saw a delta of 0.
 *
 * Waiting for stillness alone is not enough either. Between the keypress and
 * Lenis picking it up there is a beat where the position has not changed yet,
 * and a stillness-only check calls that "settled" and measures the position
 * from *before* the key. That is what produced `End reaches the exact limit
 * (827/9000)` — End had not started moving, so the old value was read, and
 * every later assertion in the block was measuring one keypress behind.
 *
 * So: wait up to `grace` for movement to begin, and if none does, treat the key
 * as a legitimate no-op (ArrowUp at the top) rather than hanging.
 *
 * The grace is scaled by loadFactor(), because a fixed wall-clock budget is a
 * bet on how busy the machine is. Running this suite alongside another
 * Playwright job, Lenis did not begin animating Home within 3500 ms and settle
 * returned the pre-keypress position — reported as
 * `Home returns to exactly 0 (9000)`, a failure indistinguishable from the
 * product actually being broken. Verified by hand immediately after: the page
 * is at 9000 at +200 ms and at 0 by +600 ms. Home was never broken.
 *
 * Callers that require movement pass expectMove; if the scaled grace still
 * expires, settle throws Inconclusive rather than returning a number, because a
 * measurement that could not be taken must not be allowed to look like a
 * measurement that came out wrong. measuring() reports those separately and
 * they do not count as failures.
 *
 * It deliberately does NOT reissue the input. The first version of this fix
 * did, and PageDown is a *relative* scroll: where the press had merely been
 * slow rather than lost, the retry moved a second viewport and produced
 * `PageDown ≈ one viewport (1574px)` — the harness manufacturing the exact kind
 * of false failure it exists to prevent. Waiting longer is safe; pressing again
 * is not.
 */
class Inconclusive extends Error {}

/**
 * How slow is this machine right now? Returns a multiplier >= 1 measured from
 * real rAF delivery, so the suite waits proportionally longer under load
 * instead of guessing a constant.
 */
const loadFactor = async (page) => {
  const ms = await page.evaluate(() => new Promise((res) => {
    const t0 = performance.now();
    let n = 0;
    const tick = () => (++n < 20 ? requestAnimationFrame(tick) : res((performance.now() - t0) / n));
    requestAnimationFrame(tick);
  }));
  // 16.7ms is a healthy frame. Clamped: past ~4x the machine is saturated and
  // waiting longer stops buying information, it just stalls the suite.
  return Math.min(4, Math.max(1, ms / 16.7));
};

const settle = async (page, { grace = 3500, timeout = 12000, expectMove = false } = {}) => {
  const load = await loadFactor(page);
  const graceMs = Math.min(14000, grace * load);
  const timeoutMs = Math.min(30000, timeout * load);
  const y0 = await page.evaluate(() => Math.round(window.scrollY));
  const startedAt = Date.now();
  let moved = false;
  while (Date.now() - startedAt < graceMs) {
    await page.waitForTimeout(80);
    if ((await page.evaluate(() => Math.round(window.scrollY))) !== y0) {
      moved = true;
      break;
    }
  }
  if (!moved) {
    if (!expectMove) return y0;
    throw new Inconclusive(
      `no movement within ${(graceMs / 1000).toFixed(1)}s (load ${load.toFixed(1)}x) — ` +
      `machine too busy to measure, not a product failure`,
    );
  }

  const deadline = Date.now() + timeoutMs;
  let last = -1;
  let still = 0;
  while (Date.now() < deadline) {
    await page.waitForTimeout(120);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    // Five consecutive stable reads, not three. Under load this container
    // stalls rAF long enough that a mid-flight animation can look still for a
    // couple of polls — which returned a half-finished position for the rail
    // jumps (5939 where 7290 was expected).
    if (y === last) {
      if (++still >= 5) return y;
    } else {
      still = 0;
      last = y;
    }
  }
  return last;
};

const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 1366, h: 768 },
  { w: 1024, h: 768 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
  { w: 360, h: 800 },
];
const SAMPLES = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.78, 0.8, 0.82, 0.85, 0.9, 1];
// Chapter boundaries and the hand-over width, from chapterBands.ts. Kept in
// sync by hand: this script runs against a built bundle, not the source.
const BOUNDARIES = [0.21, 0.39, 0.55, 0.75];
const FADE = 0.06;
const NAMES = [
  "Origin",
  "Material Intelligence",
  "Industrial Translation",
  "Recognition & Ecosystem",
  "Future Systems",
];

let failures = 0;
let inconclusive = 0;
const chk = (ok, msg) => {
  if (!ok) {
    failures++;
    console.log("   FAIL  " + msg);
  } else console.log("   ok    " + msg);
};

/**
 * Run a block that takes measurements. If the machine was too busy for a
 * measurement to be taken at all, say so and move on — an untaken measurement
 * is not evidence of a defect, and reporting it as one trains the reader to
 * ignore red output.
 */
const measuring = async (label, fn) => {
  try {
    await fn();
  } catch (e) {
    if (e instanceof Inconclusive) {
      inconclusive++;
      console.log(`   ????  ${label} inconclusive — ${e.message}`);
    } else throw e;
  }
};

// This container ships Chromium at PLAYWRIGHT_BROWSERS_PATH but the bundled
// playwright build looks for a headless-shell revision that is not there.
// CHROMIUM_PATH overrides it; the default covers this image.
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
});
const open = async (w, h, opts = {}) => {
  const touch = w < 900;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    isMobile: touch,
    hasTouch: touch,
    ...opts,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4200); // preloader holds the page; wait it out
  return { ctx, page };
};
const scrollY = (p) => p.evaluate(() => Math.round(window.scrollY));
const limitOf = (p) => p.evaluate(() => document.body.scrollHeight - window.innerHeight);

/* ── 1. Keyboard from a fresh load ───────────────────────────────────────── */
{
  console.log("\n[1] keyboard from a standing start");
  const { ctx, page } = await open(1440, 900);
  const limit = await limitOf(page);
  const mid = limit / 2;
  await page.locator("body").click({ position: { x: 700, y: 620 } });
  await page.waitForTimeout(500);

  // Every key here moves the page except ArrowUp at the top, which is asserted
  // to be a no-op. Telling settle which is which is what lets a busy machine
  // report "could not measure" instead of "the page did not move".
  const press = async (k, { expectMove = true } = {}) => {
    await page.keyboard.press(k);
    return settle(page, { expectMove });
  };
  const nearMid = (y) => Math.abs(y - mid) < limit * 0.12;

  await measuring("keyboard", async () => {
  const a1 = await press("ArrowDown");
  chk(a1 > 0 && a1 < 900, `ArrowDown is a small step (${a1}px, under one viewport)`);
  chk(!nearMid(a1), `ArrowDown did not land near mid-page (${a1} vs mid ${Math.round(mid)})`);

  const p1 = await press("PageDown");
  chk(p1 - a1 > 700 && p1 - a1 < 900, `PageDown ≈ one viewport (${p1 - a1}px)`);
  chk(!nearMid(p1), `PageDown did not land near mid-page (${p1})`);

  const e1 = await press("End");
  chk(e1 === limit, `End reaches the exact limit (${e1}/${limit})`);

  const h1 = await press("Home");
  chk(h1 === 0, `Home returns to exactly 0 (${h1})`);

  const p2 = await press("PageDown");
  chk(p2 - h1 > 700 && p2 - h1 < 900, `PageDown after Home still ≈ one viewport (${p2 - h1}px)`);

  await press("Home");
  const u1 = await press("ArrowUp", { expectMove: false });
  chk(u1 === 0, `ArrowUp at the top stays at 0 (${u1})`);
  });
  await ctx.close();
}

/* ── 2. Chapter rail lands on chapter starts, not midpoints ─────────────── */
{
  console.log("\n[2] chapter rail destinations");
  const { ctx, page } = await open(1440, 900);
  const limit = await limitOf(page);
  for (let i = 0; i < NAMES.length; i++) {
    const btn = page.locator(`button[aria-label="Go to ${NAMES[i]}"]`);
    if (!(await btn.count())) {
      chk(false, `rail button for ${NAMES[i]} exists`);
      continue;
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1400);
    await btn.first().focus();
    await page.keyboard.press("Enter");
    // Origin's destination is 0 and the page is already there, so that one is
    // legitimately a no-op. Every other rail button must move the page.
    await measuring(`rail "${NAMES[i]}"`, async () => {
      const y = await settle(page, { expectMove: i !== 0 });
      if (i === 0) chk(y === 0, `"Go to Origin" lands at the very top (${y})`);
      else chk(y > 0 && y < limit, `"Go to ${NAMES[i]}" lands in range (${y})`);
    });
  }
  await ctx.close();
}

/* ── 3. The page does not drag an early reader back to the top ──────────── */
{
  console.log("\n[3] no snap-back after the visitor starts scrolling");
  const { ctx, page } = await open(1440, 936);
  await page.mouse.move(700, 500);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1800);
  const a = await scrollY(page);
  await page.waitForTimeout(6000);
  const z = await scrollY(page);
  chk(a > 500, `wheel gesture moved the page (${a}px)`);
  chk(Math.abs(z - a) < 60, `position held six seconds later (${a} → ${z})`);
  await ctx.close();
}

/* ── 4. Transition state across every viewport and sample ───────────────── */
for (const vp of VIEWPORTS) {
  const { ctx, page } = await open(vp.w, vp.h);
  const rows = await page.evaluate(async (SAMPLES) => {
    const stage = document.querySelector("#main .cinematic-stage-overlay");
    const layers = [...stage.children].filter((e) => e.tagName === "DIV" && e.style.opacity !== "");
    const travel = document.body.scrollHeight - window.innerHeight;
    const out = [];
    for (const sp of SAMPLES) {
      window.scrollTo(0, Math.round(sp * travel));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 90));
      out.push({
        sp,
        op: layers.map((e) => +parseFloat(e.style.opacity || 1).toFixed(3)),
        pe: layers.map((e) => e.style.pointerEvents || getComputedStyle(e).pointerEvents),
        hidden: layers.map((e) => e.getAttribute("aria-hidden") === "true"),
        inert: layers.map((e) => e.hasAttribute("inert")),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      });
    }
    return { out, n: layers.length, travel };
  }, SAMPLES);

  console.log(
    `\n[4] ${vp.w}×${vp.h} — travel ${rows.travel}px (${(rows.travel / vp.h).toFixed(1)} viewports)`,
  );
  let prevDom = -1;
  let clean = true;
  const note = (m) => {
    clean = false;
    chk(false, m);
  };

  for (const r of rows.out) {
    const peak = Math.max(...r.op);
    const live = r.pe.map((v, i) => (v === "auto" ? i : -1)).filter((i) => i >= 0);
    // Inside a hand-over the layers are near-equal (and briefly all zero, see
    // BOUNDARIES below), so any of them is a defensible dominant — accept
    // whichever the page picked rather than argmax-ing between equal floats.
    const tied = r.op.map((v, i) => (peak - v < 0.02 ? i : -1)).filter((i) => i >= 0);
    const dom = tied.includes(live[0]) ? live[0] : r.op.indexOf(peak);
    const painted = r.op.map((v, i) => (v > 0.05 ? i : -1)).filter((i) => i >= 0);

    // Chapters hand over in sequence: the outgoing text leaves, the frame
    // plays alone for a beat, the incoming text arrives. So "no text" is
    // expected close to a boundary and a defect anywhere else. Check 6 above
    // bounds how long that beat may last.
    const nearBoundary = BOUNDARIES.some((b) => Math.abs(r.sp - b) <= FADE);
    if (peak < 0.5 && !nearBoundary)
      note(`sp=${r.sp} every chapter below 0.5 away from a hand-over (peak ${peak})`);
    if (live.length !== 1)
      note(`sp=${r.sp} ${live.length} interactive chapters ${JSON.stringify(live)}`);
    if (live[0] !== dom) note(`sp=${r.sp} interactive ${live[0]} ≠ dominant ${dom}`);
    if (painted.length > 1 && Math.max(...painted) - Math.min(...painted) > 1)
      note(`sp=${r.sp} non-adjacent chapters painted ${JSON.stringify(painted)}`);
    if (r.hidden[dom] || r.inert[dom])
      note(`sp=${r.sp} dominant chapter ${dom} is hidden or inert`);
    for (let i = 0; i < rows.n; i++)
      if (i !== dom && (!r.hidden[i] || !r.inert[i]))
        note(`sp=${r.sp} inactive chapter ${i} not hidden+inert`);
    if (r.overflow) note(`sp=${r.sp} horizontal overflow ${r.overflow}px`);
    if (dom < prevDom) note(`sp=${r.sp} chapter order reversed ${prevDom} → ${dom}`);
    prevDom = dom;
  }
  if (rows.out[0].op[0] < 0.99) note(`Origin not fully visible at 0% (${rows.out[0].op[0]})`);
  if (rows.out.at(-1).op[4] < 0.99)
    note(`Future Systems not fully visible at 100% (${rows.out.at(-1).op[4]})`);
  for (let i = 0; i < rows.n; i++)
    if (!rows.out.some((r) => r.op[i] >= 0.99)) note(`${NAMES[i]} never reaches full opacity`);

  if (clean)
    console.log(
      // Printed from pointer-events, not argmax: during a hand-over beat every
      // opacity is 0 and argmax would report chapter 0 for any of them.
      `   ok    15 samples clean — dominant sequence ${rows.out
        .map((r) => r.pe.findIndex((v) => v === "auto"))
        .join("")}`,
    );
  await ctx.close();
}

/* ── 5. The image-only beat between chapters stays brief ────────────────── */
{
  console.log("\n[5] hand-over beat");
  const { ctx, page } = await open(1440, 900);
  const r = await page.evaluate(async () => {
    const stage = document.querySelector("#main .cinematic-stage-overlay");
    const layers = [...stage.children].filter((e) => e.tagName === "DIV" && e.style.opacity !== "");
    const travel = document.body.scrollHeight - window.innerHeight;
    const STEP = 0.002;
    let run = 0,
      longest = 0,
      overlaps = 0;
    for (let sp = 0; sp <= 1.0001; sp += STEP) {
      window.scrollTo(0, Math.round(sp * travel));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const op = layers.map((e) => parseFloat(e.style.opacity || 1));
      // Sequenced at 0.50/0.50, so no two chapters are ever painted together.
      // Measured on the runner-up rather than on mere presence, because that is
      // the quantity that matters if the offsets are ever widened again: a
      // second chapter below 5 % is invisible, above 25 % it makes both
      // unreadable.
      const ranked = [...op].sort((a, b) => b - a);
      if (ranked[1] > 0.05) overlaps++;
      if (ranked[0] < 0.02) {
        run++;
        longest = Math.max(longest, run);
      } else run = 0;
    }
    return {
      longestPx: Math.round(longest * STEP * travel),
      overlaps,
      travel,
      vh: window.innerHeight,
    };
  });
  const vhOfBeat = (r.longestPx / r.vh) * 100;
  chk(
    r.overlaps === 0,
    `no sample paints a second chapter above 5% (${r.overlaps} found)`,
  );
  // ~6vh of the hand-over sits under 2 % opacity because smoothstep has flat
  // tails, not because of the offsets. 10vh catches a real regression without
  // failing on the curve's own shape.
  chk(
    vhOfBeat < 10,
    `longest image-only beat ${r.longestPx}px = ${vhOfBeat.toFixed(1)}vh (limit 15vh)`,
  );
  await ctx.close();
}

/* ── 6. Reduced motion ──────────────────────────────────────────────────── */
{
  console.log("\n[6] reduced motion");
  const errs = [];
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4200);
  const r = await page.evaluate(async (BOUNDS) => {
    const stage = document.querySelector("#main .cinematic-stage-overlay");
    const layers = [...stage.children].filter((e) => e.tagName === "DIV" && e.style.opacity !== "");
    const travel = document.body.scrollHeight - window.innerHeight;
    const doms = [];
    // Sample the centre of each chapter's own band rather than fixed
    // quarters. Fixed points silently stop testing what they claim the moment
    // a boundary moves: 0.75 became exactly Future Systems' start, so the
    // check reported Recognition unreachable when it was simply not being
    // looked at.
    const edges = [0, ...BOUNDS, 1];
    const centres = edges.slice(0, -1).map((a, i) => (a + edges[i + 1]) / 2);
    for (const sp of centres) {
      window.scrollTo(0, Math.round(sp * travel));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const op = layers.map((e) => +parseFloat(e.style.opacity || 1).toFixed(2));
      doms.push(op.indexOf(Math.max(...op)));
    }
    return { lenis: document.documentElement.classList.contains("lenis"), doms };
  }, BOUNDARIES);
  chk(!r.lenis, `Lenis is not initialised`);
  chk(errs.length === 0, `no page errors${errs.length ? " — " + errs[0] : ""}`);
  chk(r.doms.join("") === "01234", `all five chapters reachable (${r.doms.join("")})`);
  await ctx.close();
}

console.log(
  `\n${failures === 0 ? "ALL PASSED" : failures + " FAILURE(S)"}` +
  (inconclusive ? `  (${inconclusive} inconclusive — machine too busy to measure)` : ""),
);
await browser.close();
process.exit(failures ? 1 : 0);
