import { createFileRoute } from "@tanstack/react-router";
import { useRef, useCallback, useEffect, useState } from "react";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import Loader from "@/components/scene/Loader";
import HUD from "@/components/scene/HUD";
import AtmosphereLayer from "@/components/scene/AtmosphereLayer";
import { useLenis } from "@/components/scene/useLenis";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sushanth — Engineering Intelligent Matter · Graphene, Nano-Materials & AI" },
      {
        name: "description",
        content:
          "Building future-facing deep-tech ventures at the intersection of graphene, nano-materials, AI, energy, climate, and intelligent systems.",
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

      {/* Sitewide cinematic atmosphere — Framer Motion driven */}
      <div
        className={`fixed inset-0 z-0 transition-[opacity,filter] duration-[1800ms] ease-out ${
          entered ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
      >
        <AtmosphereLayer />
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
