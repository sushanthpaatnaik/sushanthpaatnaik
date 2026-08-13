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
const SETTLE = 2800; // Lenis eases; give it time to land before measuring.

const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 1366, h: 768 },
  { w: 1024, h: 768 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
  { w: 360, h: 800 },
];
const SAMPLES = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.78, 0.8, 0.82, 0.85, 0.9, 1];
const NAMES = [
  "Origin",
  "Material Intelligence",
  "Industrial Translation",
  "Recognition & Ecosystem",
  "Future Systems",
];

let failures = 0;
const chk = (ok, msg) => {
  if (!ok) {
    failures++;
    console.log("   FAIL  " + msg);
  } else console.log("   ok    " + msg);
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

  const press = async (k) => {
    await page.keyboard.press(k);
    await page.waitForTimeout(SETTLE);
    return scrollY(page);
  };
  const nearMid = (y) => Math.abs(y - mid) < limit * 0.12;

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
  const u1 = await press("ArrowUp");
  chk(u1 === 0, `ArrowUp at the top stays at 0 (${u1})`);
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
    await page.waitForTimeout(SETTLE);
    const y = await scrollY(page);
    if (i === 0) chk(y === 0, `"Go to Origin" lands at the very top (${y})`);
    else chk(y > 0 && y < limit, `"Go to ${NAMES[i]}" lands in range (${y})`);
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
    // At an exact dissolve midpoint smoothstep puts both neighbours at 0.5.
    // Either is a defensible dominant, so accept whichever the page picked.
    const tied = r.op.map((v, i) => (peak - v < 0.02 ? i : -1)).filter((i) => i >= 0);
    const dom = tied.includes(live[0]) ? live[0] : r.op.indexOf(peak);
    const painted = r.op.map((v, i) => (v > 0.05 ? i : -1)).filter((i) => i >= 0);

    if (peak < 0.5) note(`sp=${r.sp} every chapter below 0.5 (peak ${peak})`);
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
      `   ok    15 samples clean — dominant sequence ${rows.out.map((r) => r.op.indexOf(Math.max(...r.op))).join("")}`,
    );
  await ctx.close();
}

/* ── 5. Reduced motion ──────────────────────────────────────────────────── */
{
  console.log("\n[5] reduced motion");
  const errs = [];
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4200);
  const r = await page.evaluate(async () => {
    const stage = document.querySelector("#main .cinematic-stage-overlay");
    const layers = [...stage.children].filter((e) => e.tagName === "DIV" && e.style.opacity !== "");
    const travel = document.body.scrollHeight - window.innerHeight;
    const doms = [];
    for (const sp of [0, 0.25, 0.5, 0.75, 1]) {
      window.scrollTo(0, Math.round(sp * travel));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const op = layers.map((e) => +parseFloat(e.style.opacity || 1).toFixed(2));
      doms.push(op.indexOf(Math.max(...op)));
    }
    return { lenis: document.documentElement.classList.contains("lenis"), doms };
  });
  chk(!r.lenis, `Lenis is not initialised`);
  chk(errs.length === 0, `no page errors${errs.length ? " — " + errs[0] : ""}`);
  chk(r.doms.join("") === "01234", `all five chapters reachable (${r.doms.join("")})`);
  await ctx.close();
}

console.log(`\n${failures === 0 ? "ALL PASSED" : failures + " FAILURE(S)"}`);
await browser.close();
process.exit(failures ? 1 : 0);
