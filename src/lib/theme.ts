/**
 * Auto / Light / Dark.
 *
 * Two values are kept deliberately separate, because conflating them is how
 * a theme system loses the visitor's choice:
 *
 *   PREFERENCE  what the visitor picked — "auto", "light" or "dark". Stored,
 *               and changed only when they pick something.
 *   EFFECTIVE   what the document actually renders. Derived from the
 *               preference, the route and the environment on every render.
 *
 * The homepage is always dark. That is an effective-theme rule, not a
 * preference one: a visitor on Light who passes through `/` still finds Light
 * waiting on the next internal page, because nothing wrote to storage on the
 * way through.
 */

import { isSunUp, msUntilSunBoundary, SOLAR_INLINE } from "./solar";

export type ThemePreference = "auto" | "light" | "dark";
export type EffectiveTheme = "light" | "dark";

export const THEME_KEY = "sp-theme";

/** Routes that ignore the preference entirely. */
export const isForcedDarkRoute = (pathname: string) => pathname === "/";

/**
 * The fixed window, kept only as the fallback for a timezone the solar table
 * does not carry — see resolveAuto and src/lib/solar.ts.
 */
const DAY_STARTS = 7;
const DAY_ENDS = 19;

/**
 * Does the operating system express a preference? Retained for diagnostics;
 * auto no longer consults it — daylight decides, by the site's stated rule
 * that the sun wins over the device setting.
 */
export function systemPreference(): EffectiveTheme | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  try {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  } catch {
    // matchMedia can throw in exotic embeddings. Treat it as "no signal".
  }
  return null;
}

/**
 * Auto, in full, in priority order:
 *
 *   1. Daylight at the visitor's location: light while the sun is up, dark
 *      after sunset. src/lib/solar.ts computes real sunrise and sunset from
 *      the device's clock and timezone — latitude from an IANA zone table,
 *      longitude from the standard offset — with no permission prompt and no
 *      network. The sun wins over the device's own colour-scheme setting:
 *      that is the stated rule for this site, chosen so an OS left in dark
 *      mode does not keep the page dark through the afternoon.
 *
 *   2. The fixed window above, only when the zone is not in the solar table
 *      and real sunrise cannot be worked out. It exists so an unknown zone
 *      degrades to something reasonable rather than to a guess.
 *
 * Ambient light stays out of the chain on purpose: the sensor is available
 * in practice nowhere by default, and a signal that almost never fires is
 * not worth overruling the sun for. Nothing here reads the network or
 * requests geolocation.
 */
export function resolveAuto(now: Date = new Date()): EffectiveTheme {
  const up = isSunUp(now);
  if (up !== null) return up ? "light" : "dark";
  const h = now.getHours();
  return h >= DAY_STARTS && h < DAY_ENDS ? "light" : "dark";
}

export function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "auto") return v;
  } catch {
    // Private mode, or storage disabled. Auto is a fine place to land.
  }
  return "auto";
}

export function writePreference(pref: ThemePreference) {
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {
    // Not being able to remember the choice must not stop us applying it.
  }
}

export function effectiveTheme(pref: ThemePreference, pathname: string): EffectiveTheme {
  if (isForcedDarkRoute(pathname)) return "dark";
  return pref === "auto" ? resolveAuto(new Date()) : pref;
}

/** Matches --page-ground so the browser's own chrome agrees with the page. */
const THEME_COLOR: Record<EffectiveTheme, string> = {
  dark: "#070708",
  light: "#f7f4ef",
};

export function applyTheme(theme: EffectiveTheme) {
  const root = document.documentElement;
  if (root.getAttribute("data-theme") === theme) return;
  root.setAttribute("data-theme", theme);
  // Tells the browser how to paint form controls, scrollbars and the
  // rubber-band area — without it a light page keeps dark native widgets.
  root.style.colorScheme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

/**
 * Runs in <head> before the first paint, inlined as a string so it is not a
 * separate request. It has to duplicate the logic above rather than import
 * it: a module would be deferred, and deferred means the page paints in the
 * fallback theme first, which is the flash this exists to prevent.
 *
 * Wrapped in try/catch and falling back to dark, because the one outcome
 * worse than the wrong theme is an exception in <head> on every page.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,p=null;
try{p=localStorage.getItem(${JSON.stringify(THEME_KEY)})}catch(e){}
if(p!=="light"&&p!=="dark"&&p!=="auto")p="auto";
var t;
if(location.pathname==="/"){t="dark"}
else if(p!=="auto"){t=p}
else{
${SOLAR_INLINE}
var up=__sunUp();
if(up===null){var h=new Date().getHours();up=h>=${DAY_STARTS}&&h<${DAY_ENDS}}
t=up?"light":"dark"}
d.setAttribute("data-theme",t);
d.style.colorScheme=t;
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",t==="dark"?${JSON.stringify(THEME_COLOR.dark)}:${JSON.stringify(THEME_COLOR.light)});
}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`;
