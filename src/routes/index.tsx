import { createFileRoute } from "@tanstack/react-router";
import { useRef, useCallback, useEffect, useState } from "react";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import Loader from "@/components/scene/Loader";
import HUD from "@/components/scene/HUD";
import AtmosphereLayer from "@/components/scene/AtmosphereLayer";
import AmbientAtmosphere from "@/components/scene/AmbientAtmosphere";
import GrapheneVolumetric from "@/components/scene/GrapheneVolumetric";
import CursorAura from "@/components/scene/CursorAura";
import { useLenis } from "@/components/scene/useLenis";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sushanth Paatnaik — Inventor · Graphene & Advanced Materials · Deep-Tech Founder" },
      {
        name: "description",
        content:
          "Inventor, deep-tech founder, and six-time Indian Presidential awardee. Building graphene, nano-materials, and industrial systems from India for the world. Founder of Monoatom Labs, Grafillium, SPI Industries, InThinks, Starunico Capital. CIO at Magppie.",
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
    ],
  }),
});

function Index() {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  const handleScroll = useCallback((p: number) => {
    scrollProgress.current = p;
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
      // Use Lenis when available so its internal target stays in sync,
      // otherwise fall back to native scroll (covers first-paint window
      // before Lenis instance is constructed).
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true, lock: true });
      } else {
        window.scrollTo(0, 0);
      }
    };

    if (shouldForceTop) {
      snapTop();
      // Catch late layout shifts from images, fonts, and sticky pin recompute.
      const r1 = requestAnimationFrame(snapTop);
      const t1 = window.setTimeout(snapTop, 60);
      const t2 = window.setTimeout(snapTop, 300);
      const t3 = window.setTimeout(snapTop, 900);
      const t4 = window.setTimeout(snapTop, 1600);
      const onLoad = () => snapTop();
      window.addEventListener("load", onLoad, { once: true });
      const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
      fonts?.ready.then(snapTop).catch(() => {});

      // Stabilize against back/forward cache restores landing mid-page.
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


  // Reveal main content after loader
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
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

      {/* Sitewide cinematic atmosphere — Framer Motion driven scene crossfade */}
      <div
        className={`fixed inset-0 z-0 transition-[opacity,filter] duration-[1800ms] ease-out ${
          entered ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
      >
        <AtmosphereLayer />
      </div>

      {/* Volumetric graphene lattice — 3D depth + parallax + DoF, lives inside the scene */}
      {entered && <GrapheneVolumetric scrollProgress={scrollProgress} mouse={mouse} />}

      {/* Sitewide ambient atmosphere — near-imperceptible haze + grain for spatial life */}
      {entered && <AmbientAtmosphere />}

      {/* Hidden cinematic interaction — a faint cool aura that trails the cursor */}
      {entered && <CursorAura />}

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[60] w-6 h-6 rounded-full border border-foreground/40 mix-blend-difference hidden md:block"
      />

      <div
        className={`transition-opacity duration-1000 ${entered ? "opacity-100" : "opacity-0"}`}
      >
        <Nav />
        <HUD scrollProgress={scrollProgress} />
        <ScrollSections />
      </div>
    </div>
  );
}
