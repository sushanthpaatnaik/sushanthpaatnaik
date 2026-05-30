import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis(onScroll?: (progress: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Touch devices (phones/tablets) use native hardware-accelerated scroll.
    // Lenis syncTouch intercepts native touch and moves scroll computation to
    // the main thread, causing jank. On coarse-pointer devices, disable all
    // Lenis touch handling and let the browser own it entirely.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      // Smooth wheel glide on desktop; instant on touch (native handles it).
      duration: isTouch ? 0 : 1.45,
      easing: (t) => 1 - Math.pow(1 - t, 3.2),
      smoothWheel: !isTouch,
      wheelMultiplier: 0.82,
      touchMultiplier: 0,     // 0 = Lenis does not process touch events
      syncTouch: false,        // never intercept native touch scroll
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
    const snapState = () => {
      const current = window.scrollY || window.pageYOffset || 0;
      lenis.scrollTo(current, { immediate: true, force: true, lock: true });
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
    };
  }, [onScroll]);

  return lenisRef;
}
