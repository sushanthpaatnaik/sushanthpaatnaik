import { createFileRoute } from "@tanstack/react-router";
import { useRef, useCallback, useEffect, useState } from "react";
import Scene from "@/components/scene/Scene";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import Loader from "@/components/scene/Loader";
import HUD from "@/components/scene/HUD";
import AtmosphereLayer from "@/components/scene/AtmosphereLayer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nova — Beyond the Surface" },
      {
        name: "description",
        content:
          "A cinematic 3D scrollytelling experience. Engineered in light, motion you can feel.",
      },
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

  useLenis(handleScroll);

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

      {/* Fixed full-viewport 3D canvas */}
      <div
        className={`fixed inset-0 z-0 transition-[opacity,transform,filter] duration-[1800ms] ease-out ${
          entered ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.06] blur-md"
        }`}
      >
        <Scene scrollProgress={scrollProgress} mouse={mouse} />
        {/* Cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,oklch(0.04_0.01_260/0.85)_100%)]" />
        {/* Letterbox gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/80 to-transparent" />
        {/* Holographic scanlines — very subtle */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.018] bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,#ffffff_2px,#ffffff_3px)] mix-blend-overlay" />
        {/* Soft atmospheric haze */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,oklch(0.18_0.04_250/0.25),transparent_70%)]" />
      </div>

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
