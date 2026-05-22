import { createFileRoute } from "@tanstack/react-router";
import { useRef, useCallback } from "react";
import Scene from "@/components/scene/Scene";
import ScrollSections from "@/components/scene/ScrollSections";
import Nav from "@/components/scene/Nav";
import { useLenis } from "@/components/scene/useLenis";

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

  const handleScroll = useCallback((p: number) => {
    scrollProgress.current = p;
  }, []);

  useLenis(handleScroll);

  return (
    <div className="relative bg-background text-foreground noise">
      {/* Fixed full-viewport 3D canvas */}
      <div className="fixed inset-0 z-0">
        <Scene scrollProgress={scrollProgress} />
        {/* Cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.05_0.01_260/0.7)_100%)]" />
        {/* Subtle motion-blur veil */}
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[0.5px]" />
      </div>

      <Nav />
      <ScrollSections />
    </div>
  );
}
