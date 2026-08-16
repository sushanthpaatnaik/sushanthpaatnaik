/**
 * Event tracking — vendor-neutral by design.
 *
 * The site already has Cloudflare Web Analytics, injected at the edge rather
 * than in this bundle, which gives pageviews and Core Web Vitals for free and
 * costs nothing in JS. What it cannot do is custom events, which is the whole
 * point of `contact_submit` and `engage_click`.
 *
 * Rather than commit the site to one vendor, `track` dispatches to whichever
 * of the common ones happens to be on the page and does nothing at all when
 * none is. So the call sites are correct today and start reporting the moment
 * a provider is added — no rework, no second pass through the components.
 *
 * To turn events on, add ONE of these to the document (nothing here changes):
 *
 *   Plausible  <script defer data-domain="sushanthpaatnaik.com"
 *                src="https://plausible.io/js/script.js"></script>
 *   Umami      <script defer src="https://…/script.js"
 *                data-website-id="…"></script>
 *   GA4/GTM    the usual snippet — this pushes to window.dataLayer
 *
 * A CustomEvent is always dispatched too, so anything can listen without a
 * third party involved:
 *
 *   window.addEventListener("sp:track", (e) => console.log(e.detail));
 *
 * Deliberately tiny and deliberately silent on failure. The homepage measures
 * 81% main-thread idle during scroll and CLS 0.0000; analytics is not allowed
 * to be the thing that changes that, and a tracking error must never surface
 * as a broken interaction.
 */

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    plausible?: (event: string, opts?: { props?: Props }) => void;
    umami?: { track?: (event: string, props?: Props) => void };
    posthog?: { capture?: (event: string, props?: Props) => void };
  }
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, { props });
    window.umami?.track?.(event, props);
    window.posthog?.capture?.(event, props);
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...props });
    window.dispatchEvent(new CustomEvent("sp:track", { detail: { event, ...props } }));
  } catch {
    // Analytics must never break a click or a form submission.
  }
}

/**
 * `engage_click` for every link to /engage, via one delegated listener.
 *
 * There are seven such links across the nav and five routes, and the nav
 * builds its own from a list. Wiring each call site would mean seven edits
 * that a future eighth link would silently miss; one listener on the document
 * covers them all, including any added later.
 *
 * Uses `closest("a")` because the clickable target is usually a child — the
 * Future Systems CTA is a span and an arrow inside the anchor.
 *
 * Returns a teardown so the caller can remove it on unmount.
 */
export function installEngageTracking(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    // Same-origin /engage only — not the word "engage" appearing elsewhere.
    if (!/^\/engage(?:[/?#]|$)/.test(href)) return;
    track("engage_click", {
      from: window.location.pathname,
      label: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
    });
  };
  document.addEventListener("click", onClick, { capture: true, passive: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
