import { useCallback, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  applyTheme,
  effectiveTheme,
  isForcedDarkRoute,
  readPreference,
  writePreference,
  type EffectiveTheme,
  type ThemePreference,
} from "./theme";

/**
 * Keeps <html data-theme> in step with the stored preference, the route and
 * the environment.
 *
 * The preference lives in localStorage rather than React state alone so that
 * the boot script in <head> can read it before the first paint. This hook is
 * the runtime half: it re-resolves whenever anything the resolution depends
 * on changes, and it is the only place that writes the preference.
 *
 * Mounted once, in the root. Every consumer of the control reads through it.
 */
export function useTheme() {
  // Server render and first client render must agree, so both start from the
  // same value; the effect below immediately corrects it from storage. The
  // document is already correct by then — the boot script set it — so this
  // is state catching up to the DOM, not the other way round.
  const [pref, setPref] = useState<ThemePreference>("auto");
  const [resolved, setResolved] = useState<EffectiveTheme>("dark");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setPref(readPreference());
  }, []);

  // One place decides what the document shows: preference × route × clock.
  useEffect(() => {
    const sync = () => {
      const next = effectiveTheme(pref, pathname);
      applyTheme(next);
      setResolved(next);
    };
    sync();

    // Auto has to react to the world changing under it. A visitor who flips
    // their OS to dark while the page is open should see it here, and a
    // visitor sitting on a page at 18:59 should see the evening arrive.
    if (pref !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);

    // A timer to the next threshold, not a poll. Two wakeups a day at most,
    // and none at all if the system already asks for dark.
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(0, 0, 0);
    next.setHours(now.getHours() < 7 ? 7 : now.getHours() < 19 ? 19 : 24 + 7);
    const timer = window.setTimeout(sync, next.getTime() - now.getTime() + 1000);

    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(timer);
    };
  }, [pref, pathname]);

  const choose = useCallback((next: ThemePreference) => {
    writePreference(next);
    setPref(next);
    // Only a deliberate switch animates. Route changes and system changes
    // arrive alongside other work and should land instantly.
    const root = document.documentElement;
    root.setAttribute("data-theme-anim", "");
    window.setTimeout(() => root.removeAttribute("data-theme-anim"), 260);
  }, []);

  return {
    /** What the visitor chose. Unchanged by visiting the homepage. */
    preference: pref,
    /** What the document is currently painting. */
    resolved,
    /** True where the route overrides the preference, so the UI can say so. */
    forcedDark: isForcedDarkRoute(pathname),
    choose,
  };
}
