import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis(onScroll?: (progress: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
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

    // Recompute pin/sticky math once images, fonts, and late layout settle.
    const resize = () => lenis.resize();
    const onLoad = () => {
      lenis.resize();
    };
    window.addEventListener("load", onLoad);
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(resize).catch(() => {});
    // Catch async image decode / hydration shifts.
    const t1 = window.setTimeout(resize, 400);
    const t2 = window.setTimeout(resize, 1200);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onLoad);
      clearTimeout(t1);
      clearTimeout(t2);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [onScroll]);

  return lenisRef;
}
