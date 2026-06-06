import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenis(onScroll?: (progress: number) => void) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Touch devices (phones/tablets): enable syncTouch so Lenis tracks finger
    // position and fires scroll events on every touch-move frame.  The canvas
    // reads lenis.targetScroll / lenis.limit on every RAF tick, so the image
    // sequence advances in lock-step with the finger — no lag, no jank.
    // lerp=1 on touch means no additional smoothing beyond what the browser
    // already provides via momentum / deceleration.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      // lerp=0.1: each frame closes 10% of remaining gap — snappier than 0.171,
      // instant direction reversal, ~16ms latency at 60fps vs ~35ms before.
      // Canvas reads lenis.targetScroll (raw) so frame updates are decoupled.
      lerp: isTouch ? 1 : 0.1,
      smoothWheel: !isTouch,
      wheelMultiplier: 1.4,
      // touchMultiplier: positive value (default 2) lets Lenis track finger
      // position and emit scroll events — required for canvas to animate.
      touchMultiplier: isTouch ? 2 : 0,
      syncTouch: isTouch,
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
    };
  }, [onScroll]);

  return lenisRef;
}
