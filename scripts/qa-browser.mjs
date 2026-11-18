#!/usr/bin/env node
/**
 * Browser QA against the deployed website. Run:
 *   npm install --no-save --package-lock=false playwright
 *   npx playwright install chromium
 *   node scripts/qa-browser.mjs
 *
 * Checks contact form with the API mocked, mobile layout on live pages, and
 * optionally sends ONE real browser form submission when
 * QA_SEND_CONTACT_TEST=true. It does not certify scroll-frame smoothness.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const BASE = (process.env.QA_BASE_URL || "https://sushanthpaatnaik.com").replace(/\/$/, "");
const browser = await chromium.launch({ headless: true });

function failInfo(error) {
  return error?.message || String(error);
}

async function openPage(context, path) {
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200);
  return page;
}

async function layoutCheck(width, height, mobile) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  try {
    for (const path of ["/about", "/ventures", "/contact"]) {
      const page = await openPage(context, path);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      assert.ok(overflow <= 2, path + " has " + overflow + "px horizontal overflow at " + width);
      if (path === "/contact") {
        assert.equal(await page.locator("#contact-name").count(), 1);
        assert.equal(await page.locator("#contact-email").count(), 1);
        assert.equal(await page.locator("#contact-context").count(), 1);
      }
      console.log("PASS  " + path + " responsive layout at " + width + "px");
      await page.close();
    }
  } finally {
    await context.close();
  }
}

async function fillContact(page) {
  await page.locator("#contact-name").fill("Website QA");
  await page.locator("#contact-email").fill("me@sushanthpaatnaik.com");
  await page.locator("#contact-context").fill(
    "Automated contact form QA test. Please ignore; not a real business inquiry."
  );
  await page.waitForFunction(() => {
    const button = document.querySelector('button[type="submit"]');
    return button && !button.disabled;
  }, null, { timeout: 15000 });
}

async function mockFormCheck() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await openPage(context, "/contact");
  let submission;
  try {
    await page.route("https://api.web3forms.com/**", async (route) => {
      const request = route.request();
      const headers = {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "Content-Type, Accept",
      };
      if (request.method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers });
        return;
      }
      if (request.method() !== "POST") {
        await route.abort();
        return;
      }
      submission = request.postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers,
        body: JSON.stringify({ success: true, message: "QA mock accepted" }),
      });
    });
    await fillContact(page);
    await page.locator('button[type="submit"]').click();
    await page.getByText("Message sent.", { exact: true }).waitFor({ timeout: 20000 });
    assert.ok(submission, "No Web3Forms API submission captured");
    assert.equal(submission.name, "Website QA");
    assert.equal(submission.email, "me@sushanthpaatnaik.com");
    assert.ok(submission.message?.startsWith("Automated contact form QA test"));
    assert.ok(typeof submission.access_key === "string" && submission.access_key.length === 36);
    console.log("PASS  Browser contact form success path with mocked Web3Forms response");
  } finally {
    await context.close();
  }
}

async function realFormCheck() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await openPage(context, "/contact");
  let responseStatus = "no response";
  let responseType = "unknown";
  try {
    page.on("response", (response) => {
      if (response.url().startsWith("https://api.web3forms.com/submit")) {
        responseStatus = response.status();
        responseType = response.headers()["content-type"] || "unknown";
      }
    });
    await fillContact(page);
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes("Message sent.") || text.includes("Couldn't send.");
    }, null, { timeout: 25000 });
    const delivered = await page.getByText("Message sent.", { exact: true }).count();
    console.log("Browser form API response: HTTP " + responseStatus + ", content-type " + responseType);
    assert.ok(delivered > 0,
      "Browser form did not report success; check Web3Forms origin restrictions and API response");
    console.log("PASS  Browser contact form reports success");
    console.log("NOTE  Still verify arrival in the configured recipient inbox and its Reply-To header.");
  } finally {
    await context.close();
  }
}

try {
  await layoutCheck(1440, 900, false);
  await layoutCheck(390, 844, true);
  await mockFormCheck();
  if (process.env.QA_SEND_CONTACT_TEST === "true") {
    await realFormCheck();
  } else {
    console.log("SKIP  Real email submission (not explicitly enabled)");
  }
  console.log("BROWSER QA PASSED");
} catch (error) {
  console.error("BROWSER QA FAILED: " + failInfo(error));
  process.exitCode = 1;
} finally {
  await browser.close();
}
