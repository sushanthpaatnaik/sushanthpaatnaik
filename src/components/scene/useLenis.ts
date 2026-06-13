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

    if (isTouch) {
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
      // lerp=0.1: each frame closes 10% of remaining gap — snappier than 0.171,
      // instant direction reversal, ~16ms latency at 60fps vs ~35ms before.
      // Canvas reads lenis.targetScroll (raw) so frame updates are decoupled.
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.4,
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
