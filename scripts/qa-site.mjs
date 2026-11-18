#!/usr/bin/env node
/**
 * Sushanth Paatnaik website quality gate.
 *
 *   node scripts/qa-site.mjs           # local source contracts
 *   node scripts/qa-site.mjs --remote  # deployed Cloudflare pages
 *
 * The remote mode checks rendered HTTP responses, not motion quality or
 * real-device behavior. It cannot establish that a contact email arrived.
 * Set QA_SEND_SERVER_API_TEST=true only for an explicitly requested one-off
 * Web3Forms API test; it sends one clearly labelled message.
 *
 * No extra dependencies or private credentials are required.
 */
import { existsSync, readFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const read = (path) => readFileSync(ROOT + "/" + path, "utf8");
let errors = 0;

function assertCheck(name, condition) {
  if (condition) {
    console.log("PASS  " + name);
  } else {
    errors += 1;
    console.error("FAIL  " + name);
  }
}

function staticChecks() {
  const about = read("src/routes/about.tsx");
  const ventures = read("src/routes/ventures.tsx");
  const early = read("src/routes/early-works.tsx");
  const contact = read("src/routes/contact.tsx");
  const root = read("src/routes/__root.tsx");
  const recognition = read("src/routes/recognitions.tsx");
  const sitemap = read("src/routes/sitemap[.]xml.ts");
  const robots = read("public/robots.txt");
  const essayData = read("src/routes/essays_.$slug.tsx");
  const canonicalRoutes = [
    "index", "about", "early-works", "innovations", "ventures",
    "recognitions", "voices", "essays", "news", "engage",
    "contact", "evidence-standards",
  ];

  assertCheck("Grafillium uses confirmed Co-Founder & CIO title",
    ventures.includes('name: "Grafillium"') &&
    ventures.includes('role: "Co-Founder & CIO"'));
  assertCheck("About says Cuttack, not Bhubaneswar, as birthplace",
    about.includes("Born in Cuttack, Odisha") &&
    !about.includes("Born in Bhubaneswar, Odisha"));
  assertCheck("Person JSON-LD birthplace is Cuttack",
    root.includes('birthPlace: "Cuttack, Odisha, India"'));
  assertCheck("Rectofit award wording avoids an unverified age",
    early.includes("Recognized by the President of India for a school-era invention.") &&
    !early.includes("Recognized by the President of India at age 14"));
  assertCheck("Presidential page identifies three Presidents accurately",
    recognition.includes('heading="Three Presidents of India. Six citations."'));
  assertCheck("Contact sends Web3Forms reply-to and message fields",
    contact.includes("email: email.trim()") &&
    contact.includes("message: context.trim()") &&
    contact.includes("name: name.trim()") &&
    contact.includes("res.ok && data?.success"));
  assertCheck("Contact retains an email fallback and error state",
    contact.includes("window.location.href = mailto") &&
    contact.includes('status === "error"'));
  assertCheck("All indexable top-level routes declare canonicals",
    canonicalRoutes.every((route) =>
      read("src/routes/" + route + ".tsx").includes('rel: "canonical"')));
  const slugs = [...essayData.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  assertCheck("All known essay slugs appear in the sitemap",
    slugs.length >= 3 &&
    [...new Set(slugs)].every((slug) => sitemap.includes("/essays/" + slug)));
  assertCheck("Redirect-only services page is omitted from sitemap",
    !sitemap.includes('{ path: "/services"'));
  assertCheck("robots.txt points to the sitemap",
    robots.includes("Sitemap: https://sushanthpaatnaik.com/sitemap.xml"));
  assertCheck("Social preview asset exists",
    existsSync(ROOT + "/public/social-preview.webp"));
}

const BASE = (process.env.QA_BASE_URL || "https://sushanthpaatnaik.com").replace(/\/$/, "");
const targets = [
  ["/", "Sushanth", "homepage"],
  ["/about", "Born in Cuttack, Odisha", "About biography"],
  ["/early-works", "school-era invention", "Rectofit archive"],
  ["/ventures", "Co-Founder & CIO", "Grafillium role"],
  ["/contact", "processed by Web3Forms", "contact notice"],
  ["/recognitions", "Three Presidents of India", "recognitions"],
  ["/innovations", "Graphacrete", "innovations"],
  ["/engage", "Engage", "engagement"],
  ["/robots.txt", "Sitemap:", "robots.txt"],
  ["/sitemap.xml", "<urlset", "sitemap.xml"],
];

async function probe([path, expected, label]) {
  try {
    const request = new URL(BASE + path);
    request.searchParams.set("_qa", process.env.GITHUB_SHA?.slice(0, 12) || "source");
    const response = await fetch(request, {
      signal: AbortSignal.timeout(20000),
      headers: { "Cache-Control": "no-cache", "User-Agent": "SushanthWebsiteQA/1.0" },
      redirect: "follow",
    });
    const html = await response.text();
    const normalized = html.replace(/&amp;/g, "&").replace(/&#x27;/gi, "'");
    if (!response.ok) return label + ": HTTP " + response.status;
    if (!normalized.includes(expected)) return label + ": expected content not yet present";
    return null;
  } catch (error) {
    return label + ": " + (error?.message || String(error));
  }
}

async function remoteChecks() {
  const attempts = Math.max(1, Number(process.env.QA_ATTEMPTS || "1"));
  const interval = Math.max(1000, Number(process.env.QA_INTERVAL_MS || "25000"));
  let problems = [];
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    console.log("Public website check " + attempt + "/" + attempts);
    problems = (await Promise.all(targets.map(probe))).filter(Boolean);
    if (problems.length === 0) {
      console.log("PASS  Public pages and current text verified over HTTP");
      return true;
    }
    console.log("Pending: " + problems.join("; "));
    if (attempt < attempts) await delay(interval);
  }
  problems.forEach((problem) => console.error("FAIL  " + problem));
  errors += problems.length;
  return false;
}

async function oneContactTest() {
  const source = read("src/routes/contact.tsx");
  const match = source.match(/const WEB3FORMS_ACCESS_KEY\s*=\s*["']([^"']+)["']/);
  if (!match) {
    console.error("FAIL  No contact access key found in source");
    errors += 1;
    return;
  }
  // Never print the access key. This is a public form integration key,
  // not a GitHub secret; it is used only for a single QA submission.
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      signal: AbortSignal.timeout(20000),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: match[1],
        subject: "[SITE QA TEST - IGNORE] Website contact form delivery",
        from_name: "Website QA",
        name: "Website QA",
        email: "me@sushanthpaatnaik.com",
        message: "Automated website QA test from GitHub Actions. Please ignore. This is not a real inquiry.",
        Intent: "Quality assurance",
      }),
    });
    const result = await response.json();
    assertCheck("Web3Forms accepted one synthetic QA submission",
      response.ok && result?.success === true);
    if (response.ok && result?.success === true)
      console.log("NOTE  API acceptance does not prove inbox delivery; verify the QA email manually.");
  } catch (error) {
    console.error("FAIL  Form API could not be reached: " + (error?.message || String(error)));
    errors += 1;
  }
}

const remote = process.argv.includes("--remote");
if (remote) {
  const ok = await remoteChecks();
  if (ok && process.env.QA_SEND_SERVER_API_TEST === "true") await oneContactTest();
} else {
  staticChecks();
}
console.log(errors ? "QA FAILED: " + errors + " issue(s)" : "QA PASSED");
if (errors) process.exitCode = 1;
