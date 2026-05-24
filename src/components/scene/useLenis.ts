import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis(onScroll?: (progress: number, scrollY: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: prefersReduced ? 0.001 : 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 2.6),
      smoothWheel: !prefersReduced,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.0,
      syncTouch: true,
    });

    lenisRef.current = lenis;

    let lastProgress = -1;
    let lastScroll = -1;
    lenis.on("scroll", ({ progress, scroll }: { progress: number; scroll: number }) => {
      // De-dupe frame-identical notifications so consumers can skip work.
      if (progress === lastProgress && scroll === lastScroll) return;
      lastProgress = progress;
      lastScroll = scroll;
      onScroll?.(progress, scroll);
    });

    let rafId = 0;
    let running = false;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(raf);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
    start();

    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

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
    const t1 = window.setTimeout(() => { resize(); snapState(); }, 180);
    const t2 = window.setTimeout(() => { resize(); snapState(); }, 700);
    const t3 = window.setTimeout(() => { resize(); snapState(); }, 1400);

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => { resize(); })
      : null;
    if (ro) {
      ro.observe(document.documentElement);
      ro.observe(document.body);
    }

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
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
