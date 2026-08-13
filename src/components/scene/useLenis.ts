import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis(onScroll?: (progress: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ── Touch devices (phones/tablets): NO Lenis ──────────────────────────────
    // Lenis syncTouch hijacks native touch scrolling and re-drives it via RAF.
    // Combined with touchMultiplier it amplified finger swipes ~2× — the page
    // flew past content and felt broken/uncontrollable.  Native touch scrolling
    // has correct momentum, deceleration, and overscroll behavior for free, and
    // the canvas RAF loop already falls back to window.scrollY when no Lenis is
    // present, so the cinematic image-sequence still animates in lock-step.
    // We only attach a passive scroll listener so HUD progress keeps updating.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    // Reduced motion takes the same path. Lenis's whole job is to interpolate
    // between where the visitor scrolled to and where the page is drawn — that
    // easing *is* motion, applied to the entire page, and someone who has asked
    // the OS for less of it should get the browser's own scrolling. Native
    // scroll is also the more accessible target: no virtual position to fall
    // out of sync with assistive tech or with the browser's find-on-page.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || reduceMotion) {
      const onNativeScroll = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        const progress = limit > 0 ? Math.min(Math.max(window.scrollY / limit, 0), 1) : 0;
        onScroll?.(progress);
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      onNativeScroll();
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        lenisRef.current = null;
      };
    }

    // ── Pointer devices (desktop): Lenis smooth-wheel, unchanged ──────────────
    const lenis = new Lenis({
      // lerp=0.12: slightly snappier than 0.1 — content reaches 89% of target
      // in 10 frames (167ms at 60fps) vs 0.1's 65%. Still smooth, not jerky.
      // Canvas reads lenis.targetScroll (raw) so canvas updates are immediate.
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.2,  // was 1.4 — tighter to native feel, less overshoot
      touchMultiplier: 0,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      onScroll?.(progress);
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Recompute layout-dependent scroll math once images, fonts, and late layout settle.
    const resize = () => lenis.resize();

    // snapState re-seats Lenis's virtual position on the document's real one
    // after a layout shift. Two guards, both load-bearing:
    //
    //   isScrolling — `scrollTo(..., immediate, force)` cancels whatever
    //     animation is in flight. Firing it mid-gesture kills the visitor's
    //     momentum and yanks Lenis back onto window.scrollY, which lags the
    //     animated position by up to a lerp's worth of travel. That reads as
    //     a backwards jump.
    //   dead zone — after the scroll settles, Lenis and the document already
    //     agree to within a pixel. Re-seating on a delta of 0 is a no-op that
    //     can still stomp a gesture starting in the same frame.
    const snapState = () => {
      if (lenis.isScrolling) return;
      const current = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(current - lenis.scroll) < 2) return;
      lenis.scrollTo(current, { immediate: true, force: true });
    };
    const onLoad = () => {
      lenis.resize();
      snapState();
    };
    window.addEventListener("load", onLoad);
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(() => {
      resize();
      snapState();
    }).catch(() => {});
    // Catch async image decode / hydration shifts.
    const t1 = window.setTimeout(() => {
      resize();
      snapState();
    }, 180);
    const t2 = window.setTimeout(() => {
      resize();
      snapState();
    }, 700);
    const t3 = window.setTimeout(() => {
      resize();
      snapState();
    }, 1400);

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          resize();
        })
      : null;
    if (ro) {
      ro.observe(document.documentElement);
      ro.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onLoad);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      ro?.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      // Belt-and-suspenders: guarantee no Lenis class survives teardown. A
      // stale `.lenis.lenis-stopped { overflow: hidden }` on <html> would block
      // scrolling on every page navigated to after leaving the homepage.
      const html = document.documentElement;
      html.classList.remove("lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling");
    };
  }, [onScroll]);

  return lenisRef;
}
