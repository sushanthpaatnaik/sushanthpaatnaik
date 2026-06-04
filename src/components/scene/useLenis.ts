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
      duration: isTouch ? 0 : 0.42,
      easing: (t) => 1 - Math.pow(1 - t, 1.7),
      smoothWheel: !isTouch,
      wheelMultiplier: 1.15,
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
