import { createFileRoute } from "@tanstack/react-router";
import { ldJsonScript, webPageSchema } from "@/lib/seo";
import { useRef, useCallback, useEffect, useState, lazy, Suspense } from "react";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import Loader, { LOADER_SESSION_KEY } from "@/components/scene/Loader";
import HUD from "@/components/scene/HUD";
import MobileCTABar from "@/components/scene/MobileCTABar";
import { useLenis } from "@/components/scene/useLenis";

// CanvasLayer is imported directly (not lazy) so sequence preloading starts
// on the very first render — the Loader overlay holds the screen until ready.
import CanvasLayer from "@/components/scene/CanvasLayer";
const SceneDecorations = lazy(() => import("@/components/scene/SceneDecorations"));
const AmbientAtmosphere = lazy(() => import("@/components/scene/AmbientAtmosphere"));
const ChapterAtmosphere = lazy(() => import("@/components/scene/ChapterAtmosphere"));
const GrapheneVolumetric = lazy(() => import("@/components/scene/GrapheneVolumetric"));
const CursorAura = lazy(() => import("@/components/scene/CursorAura"));

const description =
  "Inventor and six-time Indian Presidential awardee building graphene, nano-materials, and industrial deep-tech ventures from India.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sushanth Paatnaik — Inventor & Deep-Tech Founder" },
      { name: "description", content: description },
      { property: "og:title", content: "Sushanth Paatnaik — Inventor · Graphene & Deep-Tech Founder" },
      {
        property: "og:description",
        content:
          "Six-time Indian Presidential awardee engineering matter, capital, and scale — graphene, nano-materials, AI, and industrial commercialization.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ type: "WebSite", name: "Sushanth Paatnaik", description, path: "/" }),
      ),
    ],
  }),
});

function Index() {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [entered, setEntered] = useState(false);
  const [scenesReady, setScenesReady] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  // contentVisible drives the 500 ms homepage fade-in after the loader exits.
  // Pre-set to true on SPA navigations (no loader shown, content instant).
  const [contentVisible, setContentVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const isReload = performance.getEntriesByType?.("navigation")[0]?.type === "reload";
    if (isReload) return false;
    return window.sessionStorage?.getItem(LOADER_SESSION_KEY) === "1";
  });

  // videoReady starts true only for same-session SPA navigations (sequences
  // are browser-cached and the loader is skipped). On first visit or refresh
  // it stays false until CanvasLayer fires onReady().
  const [videoReady, setVideoReady] = useState(() => {
    if (typeof window === "undefined") return false;
    const isReload = performance.getEntriesByType?.("navigation")[0]?.type === "reload";
    if (isReload) return false;
    return window.sessionStorage?.getItem(LOADER_SESSION_KEY) === "1";
  });

  // frameProgress (0–100) reflects how many critical group-0 frames have decoded.
  // SSR must return 0. Reloads also start at 0 even though sessionStorage has
  // the seen flag — the loader must show again and fill from scratch.
  const [frameProgress, setFrameProgress] = useState(() => {
    if (typeof window === "undefined") return 0;
    const isReload = performance.getEntriesByType?.("navigation")[0]?.type === "reload";
    if (isReload) return 0;
    return window.sessionStorage?.getItem(LOADER_SESSION_KEY) === "1" ? 100 : 0;
  });

  const handleScroll = useCallback((p: number) => {
    scrollProgress.current = p;
  }, []);

  // Called by Loader after its fade-out completes — starts the 500 ms content
  // fade-in and ensures scroll is unlocked (Lenis is already running via
  // videoReady; CSS lock is released by Loader's cleanup).
  const handleLoaderDone = useCallback(() => {
    setContentVisible(true);
  }, []);

  // Progress only moves forward. On repeat visits frameProgress starts at 100;
  // without this guard CanvasLayer's first onProgress(25) call would overwrite
  // it and flash "25%" briefly even though the session gate should skip the loader.
  const handleProgress = useCallback((pct: number) => {
    setFrameProgress(prev => Math.max(prev, pct));
  }, []);

  const handleVideoReady = useCallback(() => setVideoReady(true), []);

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
    // Touch devices: disable WebGL/heavy layers regardless of RAM or width.
    // GPU headroom on iOS/Android isn't reflected by deviceMemory, and a
    // width-only check lets large phones and FOLDABLES (Samsung Fold 6 inner
    // display ≥768px) slip through and run the full three.js graphene lattice
    // on a phone GPU — the "ecosystem hang". Any coarse pointer = no WebGL.
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
    // < 1024 catches Z Fold 6 unfolded (≈768 px) and other large-screen phones
    // that slip through the old < 768 threshold.
    const mobileViewport = window.innerWidth < 1024;
    setIsLowPower(Boolean(reduce || lowMem || slowNet || mobileViewport || coarsePointer));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // --viewport-height is driven by CSS (100dvh / 100svh fallback) so the
    // browser handles it natively without JS layout recalculation on each
    // mobile chrome show/hide event.  Only Lenis needs to know about resizes.
    const onResize = () => { lenisRef.current?.resize(); };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
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

  // Pause Lenis while the preloader is active; resume once canvas is ready.
  // Event prevention in Loader handles wheel/touch/keyboard lock — this
  // stops Lenis's internal RAF from advancing the virtual scroll position.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!videoReady) {
      const stop = () => lenisRef.current?.stop();
      stop();
      // Retry after a tick in case Lenis initialises after this effect fires.
      const t = window.setTimeout(stop, 80);
      return () => clearTimeout(t);
    }
    lenisRef.current?.start();
  }, [videoReady, lenisRef]);

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
    <div className="relative bg-transparent text-foreground noise">
      {/* Loader holds the screen until critical frames are decoded */}
      <Loader progress={frameProgress} onDone={handleLoaderDone} />

      {/*
       * ── Background layer stack (all fixed, z-index 1–5) ──────────────────
       *
       *  z-[1]  CanvasLayer         — chapter image sequences, scroll → frame
       *  z-[2]  SceneDecorations    — particles, globe, recognition ambient
       *  z-[2]  ChapterAtmosphere   — CSS/gradient per-chapter identity
       *  z-[3]  AmbientAtmosphere   — slow-breathing haze blobs
       *  z-[4]  GrapheneVolumetric  — WebGL graphene lattice (non-low-power)
       *
       * Content (<main> at z-[10]) scrolls above every background layer.
       * Nav / HUD / MobileCTABar use their own high z-indexes (50+).
       */}

      {/* CanvasLayer starts preloading sequences on first paint. */}
      <CanvasLayer
        onReady={handleVideoReady}
        onProgress={handleProgress}
        lenisRef={lenisRef}
      />

      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <SceneDecorations />
        </Suspense>
      )}

      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <GrapheneVolumetric scrollProgress={scrollProgress} mouse={mouse} />
        </Suspense>
      )}

      {/* Heavy compositor layers (full-screen mix-blend-screen + large blur
          filters). On mobile/touch these stack and cross-fade through the
          chapters and overwhelm the GPU around the Recognition/Ecosystem
          point → device hang. Gated off on mobile; the canvas image-sequence
          (the core cinematic feature) and chapter content carry the experience. */}
      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <AmbientAtmosphere />
        </Suspense>
      )}

      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <ChapterAtmosphere />
        </Suspense>
      )}

      {scenesReady && entered && !isLowPower && (
        <Suspense fallback={null}>
          <CursorAura />
        </Suspense>
      )}

      {/*
       * Homepage content fades in over 500 ms after the loader exits.
       * contentVisible is false during loading (opacity 0, pointer-events
       * none) so accidental clicks can't land on hidden UI.
       */}
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: contentVisible ? "opacity 500ms ease" : "none",
          pointerEvents: contentVisible ? undefined : "none",
        }}
      >
        <Nav />
        <HUD scrollProgress={scrollProgress} />
        <MobileCTABar />
        {/*
         * z-[10]: explicit stacking context ensures ALL section content
         * renders above every fixed background layer (z-[1]–z-[4]).
         * Without this, CSS group ordering (z-auto < z-positive) would
         * place the content BELOW the fixed z-[1] video layer.
         */}
        <main id="main" className="relative z-[10] bg-transparent">
          <ScrollSections />
        </main>
      </div>
    </div>
  );
}
