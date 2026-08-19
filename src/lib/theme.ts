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

export type ThemePreference = "auto" | "light" | "dark";
export type EffectiveTheme = "light" | "dark";

export const THEME_KEY = "sp-theme";

/** Routes that ignore the preference entirely. */
export const isForcedDarkRoute = (pathname: string) => pathname === "/";

/** Local clock, used only as the documented fallback — see resolveAuto. */
const DAY_STARTS = 7;
const DAY_ENDS = 19;

/**
 * Auto, in full:
 *
 *   1. The system preference is the primary signal. `prefers-color-scheme:
 *      dark` means dark, always — a visitor who has told their OS they want
 *      dark has already answered this question, and no clock should overrule
 *      them.
 *   2. Otherwise the local clock decides: light through the day, dark from
 *      19:00 to 07:00 local. This is the explicit fallback, not a guess at
 *      sunrise. Real sunrise needs a latitude, and the only way to get one
 *      is a geolocation prompt, which is not a fair price for a colour.
 *      Timezone alone gives longitude, which moves sunrise by minutes and
 *      the seasons move it by hours — so a rough solar model would be less
 *      honest than a stated window, not more accurate.
 *
 * Nothing here reads the network, and no permission is requested.
 */
export function resolveAuto(now: Date = new Date()): EffectiveTheme {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }
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
  return pref === "auto" ? resolveAuto() : pref;
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
else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){t="dark"}
else{var h=new Date().getHours();t=(h>=${DAY_STARTS}&&h<${DAY_ENDS})?"light":"dark"}
d.setAttribute("data-theme",t);
d.style.colorScheme=t;
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",t==="dark"?${JSON.stringify(THEME_COLOR.dark)}:${JSON.stringify(THEME_COLOR.light)});
}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`;
