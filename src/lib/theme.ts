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
 * Does the operating system actually express a preference?
 *
 * Not the same question as "is it dark". A machine that has been told
 * nothing matches neither query, and that is the only case where guessing
 * from the room or the clock is appropriate — everywhere else the visitor
 * has already answered.
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
 *   1. The system preference. `prefers-color-scheme` is the primary signal
 *      because it is the one the visitor set deliberately. Someone who puts
 *      their OS in dark mode at noon has answered the question, and neither
 *      a bright room nor a clock should overrule them. This is the ordering
 *      chosen over "ambient light first" precisely because the alternative
 *      lets an invisible sensor fight a visible choice.
 *
 *   2. Ambient light, when the system expresses no preference at all. That
 *      is the case the sensor is actually useful for, and it is also the
 *      only case where nothing is being overridden. See ambient-light.ts
 *      for why this is nearly always unavailable in practice.
 *
 *   3. The local clock: light through the day, dark from 19:00 to 07:00
 *      local. An explicit stated window, not a guess at sunrise — real
 *      sunrise needs a latitude, the only way to get one is a geolocation
 *      prompt, and that is not a fair price for a colour. Timezone alone
 *      gives longitude, which moves sunrise by minutes while the seasons
 *      move it by hours, so a rough solar model would be less honest than
 *      a stated window rather than more accurate.
 *
 *   4. Dark, as the site's own default.
 *
 * Nothing here reads the network, requests geolocation, or touches a camera.
 */
export function resolveAuto(now: Date = new Date(), ambient?: EffectiveTheme | null): EffectiveTheme {
  const sys = systemPreference();
  if (sys) return sys;
  if (ambient) return ambient;
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

export function effectiveTheme(
  pref: ThemePreference,
  pathname: string,
  ambient?: EffectiveTheme | null,
): EffectiveTheme {
  if (isForcedDarkRoute(pathname)) return "dark";
  return pref === "auto" ? resolveAuto(new Date(), ambient) : pref;
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
else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches){t="light"}
else{var h=new Date().getHours();t=(h>=${DAY_STARTS}&&h<${DAY_ENDS})?"light":"dark"}
d.setAttribute("data-theme",t);
d.style.colorScheme=t;
var m=document.querySelector('meta[name="theme-color"]');
if(m)m.setAttribute("content",t==="dark"?${JSON.stringify(THEME_COLOR.dark)}:${JSON.stringify(THEME_COLOR.light)});
}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`;
