import { useEffect, useRef, useState } from "react";

const labels = [
  "Spark",
  "Recognition",
  "Carbon Intelligence",
  "Industrial Applications",
  "Venture Builder",
  "India → World",
  "Future",
];

export default function HUD({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const [p, setP] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const loop = () => {
      setP(scrollProgress.current);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [scrollProgress]);

  const idx = Math.min(labels.length - 1, Math.floor(p * labels.length));

  return (
    <>
      {/* Left: chapter ladder */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-5 pointer-events-none opacity-[0.82] mix-blend-screen">
        {labels.map((l, i) => {
          const active = i === idx;
          return (
            <div key={l} className="flex items-center gap-3">
              <div
                className={`h-px transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  active ? "w-8 bg-foreground/85" : "w-3 bg-foreground/20"
                }`}
              />
              <span
                className={`text-[9px] uppercase tracking-[0.45em] transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  active ? "text-foreground/90" : "text-muted-foreground/40"
                }`}
              >
                {String(i + 1).padStart(2, "0")} {l}
              </span>
            </div>
          );
        })}
      </div>


    </>
  );
}
