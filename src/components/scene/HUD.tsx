import { useEffect, useRef, useState } from "react";

const labels = [
  "Spark",
  "Origin",
  "Material",
  "Stack",
  "Founder",
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
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4 pointer-events-none">
        {labels.map((l, i) => {
          const active = i === idx;
          return (
            <div key={l} className="flex items-center gap-3">
              <div
                className={`h-px transition-all duration-700 ${
                  active ? "w-10 bg-foreground" : "w-4 bg-foreground/25"
                }`}
              />
              <span
                className={`text-[10px] uppercase tracking-[0.4em] transition-all duration-700 ${
                  active ? "text-foreground" : "text-muted-foreground/40"
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
