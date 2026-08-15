import { chromium } from "playwright";
const URL = process.env.URL || "http://127.0.0.1:4321/";
const PROFILE = process.env.PROFILE || "none";
const VP = (process.env.VP || "1440x900").split("x").map(Number);
const SCROLL = process.env.SCROLL !== "0";
const T = {
  none: null,
  "4g": { downloadThroughput: 9e6 / 8, uploadThroughput: 1.5e6 / 8, latency: 60 },
  slow4g: { downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8, latency: 300 },
};
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const ctx = await b.newContext({
  viewport: { width: VP[0], height: VP[1] }, deviceScaleFactor: 1,
  isMobile: VP[0] < 900, hasTouch: VP[0] < 900,
});
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Network.enable");
if (T[PROFILE]) await cdp.send("Network.emulateNetworkConditions", { offline: false, ...T[PROFILE] });

const t0 = Date.now();
const frames = []; let others = 0, inflight = 0, peak = 0;
p.on("request", (r) => { if (r.url().includes("/sequences/")) { inflight++; peak = Math.max(peak, inflight); } });
p.on("requestfinished", (r) => {
  if (r.url().includes("/sequences/")) {
    inflight--;
    const m = r.url().match(/frame_(\d+)\.webp/);
    frames.push({ n: m ? +m[1] : -1, at: Date.now() - t0 });
  } else others++;
});
p.on("requestfailed", () => { if (inflight > 0) inflight--; });

await p.goto(URL, { waitUntil: "domcontentloaded", timeout: 180000 });
const dom = Date.now() - t0;
const vitals = await p.evaluate(() => new Promise((res) => {
  const o = { lcp: 0, cls: 0, fcp: 0 };
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) o.lcp = Math.round(e.startTime); })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) o.cls += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    const f = performance.getEntriesByName("first-contentful-paint")[0];
    if (f) o.fcp = Math.round(f.startTime);
  } catch {}
  setTimeout(() => res({ ...o, cls: +o.cls.toFixed(4) }), 2500);
}));

let gate = -1;
if (process.env.GATE === "1") {
  // Same shape as the pre-change measurement: 120px notches, threshold 40px.
  await p.mouse.move(VP[0] / 2, VP[1] / 2);
  for (let i = 0; i < 160; i++) {
    await p.mouse.wheel(0, 120);
    await p.waitForTimeout(150);
    if (await p.evaluate(() => scrollY > 40)) { gate = Date.now() - t0; break; }
  }
  await b.close();
  console.log(`  ${VP.join("x")} ${PROFILE}: wheel first moves the page at ${gate < 0 ? ">24s" : gate + "ms"}`);
  process.exit(0);
}
await p.waitForTimeout(7000);   // pure idle — no gesture, nothing to trigger the window
const atRest = frames.length;
const order = frames.slice(0, 20).map((f) => f.n).join(",");

let total = atRest, uniq = new Set(frames.map((f) => f.n)).size;
if (SCROLL) {
  const travel = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await p.mouse.move(VP[0] / 2, VP[1] / 2);
  for (let i = 0; i < 60; i++) { await p.mouse.wheel(0, travel / 60); await p.waitForTimeout(70); }
  await p.waitForTimeout(5000);
  total = frames.length; uniq = new Set(frames.map((f) => f.n)).size;
}

const KB = VP[0] < 900 ? 54 : 176;
console.log(`\n── ${VP.join("x")} · ${PROFILE} ──`);
console.log(`  DOM ${dom}ms  FCP ${vitals.fcp}ms  LCP ${vitals.lcp}ms  CLS ${vitals.cls}   non-frame reqs ${others}`);
console.log(`  wheel moves the page at  ${gate < 0 ? ">15s" : gate + "ms"}`);
const crit = VP[0] < 900 ? 2 : 4;
console.log(`  critical frames ready    ${frames.length >= crit ? frames[crit - 1].at + "ms" : "n/a"}   (loader floor is 2000ms regardless)`);
console.log(`  frames before scrolling  ${atRest}   (~${((atRest * KB) / 1024).toFixed(1)} MB)`);
console.log(`  first 20 in load order   ${order}`);
console.log(`  PEAK CONCURRENT          ${peak}`);
if (SCROLL) console.log(`  full traversal           ${total} reqs / ${uniq} distinct  (${(total / Math.max(1, uniq)).toFixed(2)}x)`);
await b.close();
