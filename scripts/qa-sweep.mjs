/**
 * Whole-site QA sweep: every route at every target viewport.
 *
 *   node scripts/qa-sweep.mjs [baseUrl]     # default http://127.0.0.1:4399
 *
 * Companion to e2e-scroll.mjs, which covers the homepage's scroll machinery in
 * depth. This one is broad rather than deep: it walks each page top to bottom
 * and reports mechanical defects that are cheap to miss by eye —
 *
 *   · horizontal overflow, with the widest offending element named
 *   · images with no alt attribute, and images that failed to load
 *   · buttons with neither text nor aria-label
 *   · links with no href or href="#"
 *   · pages with zero or multiple <h1>, and heading levels that skip
 *   · touch targets under 24px (mobile viewports only)
 *   · text rendered below 9.5px
 *   · console errors and uncaught exceptions
 *
 * It needs the same `playwright` as e2e-scroll.mjs, deliberately not declared
 * in package.json — see the note there.
 *
 * Against a local mirror rather than the live domain: this container's proxy
 * resets Playwright's connections to public hosts, so the working method is to
 * curl each route's SSR HTML into a directory tree and serve it alongside the
 * built assets. Point baseUrl at the real origin anywhere that isn't true.
 *
 * Caveat worth knowing: if the mirrored HTML references asset hashes that no
 * longer exist, the page 404s its chunks and never hydrates — the static
 * checks still hold but overflow numbers become meaningless. Re-fetch the HTML
 * after every deploy.
 */
import { chromium } from "playwright";
const BASE = process.argv[2] ?? "http://127.0.0.1:4399";
const PAGES = [
  "/",
  "/about/",
  "/early-works/",
  "/innovations/",
  "/ventures/",
  "/recognitions/",
  "/voices/",
  "/essays/",
  "/news/",
  "/engage/",
  "/contact/",
];
const VIEWS = [
  { n: "1920x1080", w: 1920, h: 1080, touch: false },
  { n: "1440x900", w: 1440, h: 900, touch: false },
  { n: "1366x768", w: 1366, h: 768, touch: false },
  { n: "430x932", w: 430, h: 932, touch: true },
  { n: "390x844", w: 390, h: 844, touch: true },
  { n: "375x812", w: 375, h: 812, touch: true },
  { n: "360x800", w: 360, h: 800, touch: true },
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const findings = [];

for (const vp of VIEWS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    isMobile: vp.touch,
    hasTouch: vp.touch,
    ...(vp.touch
      ? {
          userAgent:
            "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36",
        }
      : {}),
  });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push("pageerror: " + String(e).slice(0, 80)));
    page.on("console", (m) => {
      if (m.type() === "error") errs.push("console: " + m.text().slice(0, 80));
    });
    try {
      await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 45000 });
    } catch {
      await page.close();
      continue;
    }
    await page.waitForTimeout(path === "/" ? 5000 : 2600);

    // Walk the page so lazy content mounts and scroll-triggered sections fire.
    const r = await page.evaluate(async () => {
      const vis = (e) => {
        const cs = getComputedStyle(e);
        if (cs.visibility === "hidden" || cs.display === "none") return 0;
        let n = e,
          o = 1;
        while (n && n !== document.body) {
          o *= parseFloat(getComputedStyle(n).opacity);
          n = n.parentElement;
        }
        return o;
      };
      const H = document.body.scrollHeight;
      let maxOverflow = 0;
      const offenders = new Map();
      for (let y = 0; y <= H; y += Math.max(300, innerHeight * 0.6)) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const of = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        if (of > maxOverflow) maxOverflow = of;
        document.querySelectorAll("body *").forEach((e) => {
          const b = e.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) return;
          if (vis(e) < 0.5) return;
          if (b.right > innerWidth + 2 || b.left < -2) {
            const cs = getComputedStyle(e);
            if (cs.position === "fixed") return;
            const key = e.tagName + "." + String(e.className || "").slice(0, 30);
            const over = Math.round(Math.max(b.right - innerWidth, -b.left));
            if (!offenders.has(key) || offenders.get(key) < over) offenders.set(key, over);
          }
        });
      }
      window.scrollTo(0, 0);
      await new Promise((r) => requestAnimationFrame(r));

      // Static checks
      const imgs = [...document.querySelectorAll("img")];
      const btns = [...document.querySelectorAll("button")];
      const links = [...document.querySelectorAll("a")];
      const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
        .filter((h) => vis(h) > 0.05)
        .map((h) => +h.tagName[1]);
      let headJump = null;
      for (let i = 1; i < heads.length; i++)
        if (heads[i] - heads[i - 1] > 1) {
          headJump = `h${heads[i - 1]}→h${heads[i]}`;
          break;
        }

      const smallTouch = btns.concat(links).filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && vis(e) > 0.5 && (b.height < 24 || b.width < 24);
      }).length;

      const tiny = [...document.querySelectorAll("p,span,li,a,div")].filter((e) => {
        if (
          !e.childNodes.length ||
          ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
        )
          return false;
        if (vis(e) < 0.5) return false;
        return parseFloat(getComputedStyle(e).fontSize) < 9.5;
      }).length;

      return {
        pageH: H,
        maxOverflow,
        offenders: [...offenders.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
        imgNoAlt: imgs.filter((i) => i.getAttribute("alt") === null).length,
        imgBrokenLoad: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        btnNoLabel: btns.filter((b) => !b.textContent.trim() && !b.getAttribute("aria-label"))
          .length,
        emptyLinks: links.filter((a) => {
          const h = a.getAttribute("href");
          return !h || h === "#";
        }).length,
        h1Count: document.querySelectorAll("h1").length,
        headJump,
        smallTouch,
        tiny,
        title: document.title,
      };
    });

    const f = [];
    if (r.maxOverflow > 0)
      f.push(`horizontal overflow ${r.maxOverflow}px ${JSON.stringify(r.offenders)}`);
    if (r.imgNoAlt) f.push(`${r.imgNoAlt} img without alt`);
    if (r.imgBrokenLoad) f.push(`${r.imgBrokenLoad} img failed to load`);
    if (r.btnNoLabel) f.push(`${r.btnNoLabel} unlabelled button`);
    if (r.emptyLinks) f.push(`${r.emptyLinks} empty/# link`);
    if (r.h1Count !== 1) f.push(`${r.h1Count} h1`);
    if (r.headJump) f.push(`heading level jump ${r.headJump}`);
    if (vp.touch && r.smallTouch) f.push(`${r.smallTouch} touch target <24px`);
    if (r.tiny) f.push(`${r.tiny} text node <9.5px`);
    if (errs.length) f.push(`console: ${[...new Set(errs)].slice(0, 2).join(" | ")}`);
    if (f.length) findings.push(`${vp.n} ${path}  →  ${f.join("; ")}`);
    if (vp.n === "390x844" || vp.n === "1440x900") {
      console.log(`${vp.n} ${path.padEnd(16)} h=${r.pageH}px  "${r.title.slice(0, 44)}"`);
    }
    await page.close();
  }
  await ctx.close();
}

console.log("\n================ FINDINGS ================");
console.log(findings.length ? findings.join("\n") : "none");
await browser.close();
