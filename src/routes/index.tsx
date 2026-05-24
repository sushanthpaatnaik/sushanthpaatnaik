import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useRef, useCallback, useEffect, useState } from "react";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import Loader from "@/components/scene/Loader";
import HUD from "@/components/scene/HUD";
import { useLenis } from "@/components/scene/useLenis";
import founderPresence from "@/assets/founder-editorial.webp";

// Heavy cinematic background layers — code-split so the initial JS bundle
// only ships text/nav/scroll logic. These mount after first paint via
// requestIdleCallback so the hero copy is interactive immediately.
const AtmosphereLayer    = lazy(() => import("@/components/scene/AtmosphereLayer"));
const AmbientAtmosphere  = lazy(() => import("@/components/scene/AmbientAtmosphere"));
const OrbitalTelemetry   = lazy(() => import("@/components/scene/OrbitalTelemetry"));
const GrapheneVolumetric = lazy(() => import("@/components/scene/GrapheneVolumetric"));
const CursorAura         = lazy(() => import("@/components/scene/CursorAura"));

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sushanth Paatnaik — Inventor & Deep-Tech Founder" },
      {
        name: "description",
        content:
          "Inventor and six-time Indian Presidential awardee building graphene, nano-materials, and industrial deep-tech ventures from India.",
      },
      { property: "og:title", content: "Sushanth Paatnaik — Inventor · Graphene & Deep-Tech Founder" },
      {
        property: "og:description",
        content:
          "Six-time Indian Presidential awardee engineering matter, capital, and scale — graphene, nano-materials, AI, and industrial commercialization.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      // Preload the above-the-fold founder portrait used in Hero + Founder scenes
      { rel: "preload", as: "image", href: founderPresence, fetchPriority: "high" },
    ],
  }),

});

function Index() {
  const pageScrollProgress = useRef(0);
  const scrollYRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const [scenesReady, setScenesReady] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  const handleScroll = useCallback((p: number, scrollY: number) => {
    pageScrollProgress.current = p;
    scrollYRef.current = scrollY;
  }, []);

  const lenisRef = useLenis(handleScroll);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const setViewportVars = () => {
      root.style.setProperty("--viewport-height", `${window.innerHeight}px`);
      root.style.setProperty("--viewport-width", `${window.innerWidth}px`);
      lenisRef.current?.resize();
    };

    setViewportVars();
    window.addEventListener("resize", setViewportVars, { passive: true });
    window.addEventListener("orientationchange", setViewportVars);

    return () => {
      window.removeEventListener("resize", setViewportVars);
      window.removeEventListener("orientationchange", setViewportVars);
    };
  }, [lenisRef]);

  // Disable browser scroll restoration and force hero on first paint
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.history.scrollRestoration;
    try {
      window.history.scrollRestoration = "manual";
    } catch {}

    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const hasIntentionalHash = Boolean(window.location.hash && window.location.hash.length > 1);
    const shouldForceTop = !hasIntentionalHash || navEntry?.type === "reload";

    const snapTop = () => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true, lock: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    if (shouldForceTop) {
      snapTop();
      const r1 = requestAnimationFrame(snapTop);
      const t1 = window.setTimeout(snapTop, 60);
      const t2 = window.setTimeout(snapTop, 300);
      const t3 = window.setTimeout(snapTop, 900);
      const t4 = window.setTimeout(snapTop, 1600);
      const onLoad = () => snapTop();
      window.addEventListener("load", onLoad, { once: true });
      const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
      fonts?.ready.then(snapTop).catch(() => {});

      const onPageShow = (e: PageTransitionEvent) => {
        if (e.persisted && !window.location.hash) snapTop();
      };
      window.addEventListener("pageshow", onPageShow);

      return () => {
        cancelAnimationFrame(r1);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        window.removeEventListener("load", onLoad);
        window.removeEventListener("pageshow", onPageShow);
        try {
          window.history.scrollRestoration = prev;
        } catch {}
      };
    }
    return () => {
      try {
        window.history.scrollRestoration = prev;
      } catch {}
    };
  }, [lenisRef]);

  // Detect low-power / mobile clients once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const narrow = window.innerWidth < 768;
    const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
    setIsLowPower(coarse || narrow || cores <= 4);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let chapterElements: HTMLElement[] = [];
    let resizeObserver: ResizeObserver | null = null;
    let measureRaf = 0;
    let syncRaf = 0;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const collect = () => {
      chapterElements = HOME_CHAPTER_IDS
        .map((id) => document.getElementById(id))
        .filter((node): node is HTMLElement => Boolean(node));

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver.observe(document.documentElement);
        resizeObserver.observe(document.body);
        chapterElements.forEach((element) => resizeObserver?.observe(element));
      }
    };

    const updateSceneProgress = (scrollY: number) => {
      if (!chapterElements.length) return;

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const starts = chapterElements.map((element) => element.offsetTop);
      const lastIndex = chapterElements.length - 1;

      let activeIndex = lastIndex;
      for (let index = 0; index < chapterElements.length; index += 1) {
        const nextStart = starts[index + 1] ?? Number.POSITIVE_INFINITY;
        if (scrollY < nextStart) {
          activeIndex = index;
          break;
        }
      }

      const start = starts[activeIndex] ?? 0;
      const end = activeIndex < lastIndex ? starts[activeIndex + 1] : maxScroll;
      const segment = Math.max(1, end - start);
      const local = activeIndex < lastIndex ? clamp((scrollY - start) / segment, 0, 1) : 0;
      const phase = clamp(activeIndex + local, 0, lastIndex);
      const progress = lastIndex > 0 ? phase / lastIndex : 0;

      chapterScrollProgress.current = progress;
      scenePhase.set(phase);
      sceneProgress.set(progress);
    };

    const measure = () => {
      collect();
      updateSceneProgress(scrollYRef.current || window.scrollY || window.pageYOffset || 0);
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(measureRaf);
      measureRaf = requestAnimationFrame(measure);
    };

    measure();
    const onResize = () => scheduleMeasure();
    const onLoad = () => scheduleMeasure();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", onLoad);

    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(scheduleMeasure).catch(() => {});

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => scheduleMeasure());
      collect();
    }

    const syncLoop = () => {
      updateSceneProgress(scrollYRef.current || window.scrollY || window.pageYOffset || 0);
      syncRaf = requestAnimationFrame(syncLoop);
    };
    syncRaf = requestAnimationFrame(syncLoop);

    return () => {
      cancelAnimationFrame(measureRaf);
      cancelAnimationFrame(syncRaf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("load", onLoad);
      resizeObserver?.disconnect();
    };
  }, [scenePhase, sceneProgress]);

  // Mount heavy background scenes after first paint — uses requestIdleCallback
  // when available so hero typography is interactive immediately.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle =
      (window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;
    let handle: number | ReturnType<typeof setTimeout>;
    if (idle) {
      handle = idle(() => setScenesReady(true), { timeout: 600 });
    } else {
      handle = setTimeout(() => setScenesReady(true), 240);
    }
    return () => {
      const cancel =
        (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (typeof handle === "number" && cancel) cancel(handle);
      else clearTimeout(handle as ReturnType<typeof setTimeout>);
    };
  }, []);

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
        cursorRef.current.style.opacity = "1";
      }
    };
    let raf = 0;
    const loop = () => {
      mouse.current.x += (targetX - mouse.current.x) * 0.06;
      mouse.current.y += (targetY - mouse.current.y) * 0.06;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative bg-background text-foreground noise">
      {/* Non-blocking cinematic reveal — wipes away on first paint */}
      <Loader />

      {/* Heavy cinematic background — lazy + deferred to idle */}
      <Suspense fallback={null}>
        {scenesReady && (
          <>
            <div className="fixed inset-0 z-0 opacity-100 transition-opacity duration-[1800ms] ease-out">
              <AtmosphereLayer progress={sceneProgress} phase={scenePhase} />
            </div>
            <GrapheneVolumetric scrollProgress={pageScrollProgress} mouse={mouse} />
            <AmbientAtmosphere />
            <OrbitalTelemetry />
            {/* CursorAura is a desktop-only luxury — skip on coarse/mobile clients */}
            {!isLowPower && <CursorAura />}
          </>
        )}
      </Suspense>

      {/* Custom cursor — hidden until first pointer movement to avoid stray top-left dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[60] w-6 h-6 rounded-full border border-foreground/40 mix-blend-difference hidden md:block opacity-0 transition-opacity duration-300"
      />

      {/* Primary content renders immediately — no longer gated on heavy scene load */}
      <Nav />
      <HUD scrollProgress={chapterScrollProgress} />
      <main id="main">
        <ScrollSections />
      </main>
    </div>
  );
}
