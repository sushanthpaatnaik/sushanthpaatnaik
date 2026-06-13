import { createFileRoute } from "@tanstack/react-router";
import { useRef, useCallback, useEffect, useState, lazy, Suspense } from "react";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import Loader from "@/components/scene/Loader";
import HUD from "@/components/scene/HUD";
import { useLenis } from "@/components/scene/useLenis";

// Heavy decorative scene layers — code-split so they don't block first paint.
const AtmosphereLayer = lazy(() => import("@/components/scene/AtmosphereLayer"));
const AmbientAtmosphere = lazy(() => import("@/components/scene/AmbientAtmosphere"));
const ChapterAtmosphere = lazy(() => import("@/components/scene/ChapterAtmosphere"));
const GrapheneVolumetric = lazy(() => import("@/components/scene/GrapheneVolumetric"));
const CursorAura = lazy(() => import("@/components/scene/CursorAura"));

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
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [scenesReady, setScenesReady] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  const handleScroll = useCallback((p: number) => {
    scrollProgress.current = p;
  }, []);

  const lenisRef = useLenis(handleScroll);

  // Detect low-power / reduced-motion clients — skip the heaviest layers.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const lowMem = (nav.deviceMemory ?? 8) <= 4;
    const slowNet = nav.connection?.saveData ||
      ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
    // Touch devices: skip the WebGL graphene lattice + cursor aura regardless
    // of RAM or width. GPU headroom on iOS/Android isn't reflected by
    // deviceMemory, and a width-only check lets large phones and FOLDABLES
    // (Samsung Fold 6 inner display ≥768px) slip through and run the full
    // three.js + postprocessing stack on a phone GPU — the "ecosystem hang".
    // Any coarse pointer = no WebGL.
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
    const mobileViewport = window.innerWidth < 768;
    setIsLowPower(Boolean(reduce || lowMem || slowNet || coarsePointer || mobileViewport));
  }, []);

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
      const onLoad = () => snapTop();
      window.addEventListener("load", onLoad, { once: true });

      const onPageShow = (e: PageTransitionEvent) => {
        if (e.persisted && !window.location.hash) snapTop();
      };
      window.addEventListener("pageshow", onPageShow);

      return () => {
        cancelAnimationFrame(r1);
        clearTimeout(t1);
        clearTimeout(t2);
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

  // Reveal main content quickly; defer heavy scene layers until idle.
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300);
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    let idleId = 0;
    let fallback = 0;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => setScenesReady(true), { timeout: 1500 });
    } else {
      fallback = window.setTimeout(() => setScenesReady(true), 900);
    }
    return () => {
      clearTimeout(t);
      if (idleId) w.cancelIdleCallback?.(idleId);
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let targetX = 0;
    let targetY = 0;
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
      }
    };
    let raf = 0;
    const loop = () => {
      mouse.current.x += (targetX - mouse.current.x) * 0.06;
      mouse.current.y += (targetY - mouse.current.y) * 0.06;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative bg-background text-foreground noise">
      <Loader />

      {/* Sitewide cinematic atmosphere — deferred until idle. */}
      {scenesReady && (
        <Suspense fallback={null}>
          <div className="fixed inset-0 z-0 opacity-100 transition-opacity duration-[1800ms] ease-out">
            <AtmosphereLayer />
          </div>
        </Suspense>
      )}

      {/* Volumetric graphene lattice */}
      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <GrapheneVolumetric scrollProgress={scrollProgress} mouse={mouse} />
        </Suspense>
      )}

      {/* Sitewide ambient atmosphere */}
      {scenesReady && entered && (
        <Suspense fallback={null}>
          <AmbientAtmosphere />
        </Suspense>
      )}

      {/* Per-chapter atmospheric identity — image-free, scroll-synced */}
      {scenesReady && entered && (
        <Suspense fallback={null}>
          <ChapterAtmosphere />
        </Suspense>
      )}

      {/* Cursor aura — desktop, non-low-power only */}
      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <CursorAura />
        </Suspense>
      )}

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[60] w-6 h-6 rounded-full border border-foreground/40 mix-blend-difference hidden md:block"
      />

      <Nav />
      <HUD scrollProgress={scrollProgress} />
      <main id="main">
        <ScrollSections />
      </main>
    </div>
  );
}
