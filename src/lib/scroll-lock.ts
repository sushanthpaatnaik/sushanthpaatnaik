/**
 * Safety net against orphaned scroll locks.
 *
 * Overlays that legitimately lock scroll (the homepage preloader, a future
 * modal/menu) do so by writing inline `overflow`/`position`/`touch-action`
 * onto <html>/<body> or by adding a lock class. Each owns its own cleanup, but
 * a lock that survives an unmount or a client-side route change freezes the
 * whole page. This clears any such residue so no page can inherit a lock it
 * never set. It only *removes* locks — it never adds one — so it cannot
 * interfere with an overlay that is currently open (that overlay re-applies
 * its lock on its own effect).
 */
export function clearGlobalScrollLock() {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;

  for (const prop of [
    "overflow",
    "overflow-x",
    "overflow-y",
    "position",
    "height",
    "max-height",
    "top",
    "left",
    "right",
    "width",
    "touch-action",
  ]) {
    html.style.removeProperty(prop);
    body.style.removeProperty(prop);
  }

  for (const cls of [
    "overflow-hidden",
    "no-scroll",
    "scroll-locked",
    "is-loading",
    "menu-open",
    // Lenis leaves these on <html>; a stale `.lenis.lenis-stopped` rule
    // (overflow: hidden) blocks scroll globally after leaving the homepage.
    "lenis-stopped",
  ]) {
    html.classList.remove(cls);
    body.classList.remove(cls);
  }
}
