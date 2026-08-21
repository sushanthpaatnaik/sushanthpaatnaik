import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  applyTheme,
  effectiveTheme,
  isForcedDarkRoute,
  readPreference,
  systemPreference,
  writePreference,
  type EffectiveTheme,
  type ThemePreference,
} from "./theme";
import { watchAmbientLight } from "./ambient-light";

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
  const [ambient, setAmbient] = useState<EffectiveTheme | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Read inside sync() without making it a dependency — a new ambient reading
  // should re-resolve, not re-subscribe every listener on the page.
  const ambientRef = useRef<EffectiveTheme | null>(null);
  ambientRef.current = ambient;

  useEffect(() => {
    setPref(readPreference());
  }, []);

  // One place decides what the document shows: preference × route × clock.
  useEffect(() => {
    const sync = () => {
      const next = effectiveTheme(pref, pathname, ambientRef.current);
      applyTheme(next);
      setResolved(next);
    };
    sync();

    // Auto has to react to the world changing under it. A visitor who flips
    // their OS to dark while the page is open should see it here, and a
    // visitor sitting on a page at 18:59 should see the evening arrive.
    if (pref !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqLight = window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener("change", sync);
    // Both queries, because a system going from "no preference" to light
    // fires only on the light one, and that is a real change of answer.
    mqLight.addEventListener("change", sync);
    // Coming back to a tab that has been in the background for hours: the
    // clock may have crossed a threshold and the timer below was throttled.
    const onVisible = () => { if (document.visibilityState === "visible") sync(); };
    document.addEventListener("visibilitychange", onVisible);

    // A timer to the next threshold, not a poll. Two wakeups a day at most,
    // and none at all if the system already asks for dark.
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(0, 0, 0);
    next.setHours(now.getHours() < 7 ? 7 : now.getHours() < 19 ? 19 : 24 + 7);
    const timer = window.setTimeout(sync, next.getTime() - now.getTime() + 1000);

    return () => {
      mq.removeEventListener("change", sync);
      mqLight.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearTimeout(timer);
    };
  }, [pref, pathname, ambient]);

  /**
   * Ambient light, gated four ways. It runs only when the preference is Auto,
   * only when the system expresses no preference of its own — otherwise it
   * would be overruling a deliberate choice with an invisible one — only
   * while the tab is visible, and only if the platform has the API at all,
   * which in practice means almost never. Every one of those is also a
   * reason to stop, so the sensor is never left running for nothing.
   *
   * The reading itself never leaves this file: it becomes one of two words.
   */
  useEffect(() => {
    if (pref !== "auto") { setAmbient(null); return; }

    let handle: { stop: () => void } | null = null;
    let cancelled = false;

    const stop = () => { handle?.stop(); handle = null; };
    const start = async () => {
      if (cancelled || handle) return;
      if (document.visibilityState !== "visible") return;
      // A system preference outranks the room, so there is nothing to add.
      if (systemPreference() !== null) return;
      handle = await watchAmbientLight((state) => {
        if (!cancelled) setAmbient(state);
      });
      if (cancelled) stop();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") void start();
      else stop();
    };
    // The OS preference can appear or disappear while the page is open, and
    // that changes whether the sensor is wanted at all.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => { stop(); setAmbient(null); void start(); };

    void start();
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", onSystem);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onSystem);
    };
  }, [pref]);

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
