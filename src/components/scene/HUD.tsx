import { useEffect, useRef, useState } from "react";

const labels = ["Genesis", "Vision", "Depth", "Motion", "Tech", "Process", "Impact", "Contact"];

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

      {/* Right: telemetry */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-2 pointer-events-none font-mono">
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
          Telemetry
        </span>
        <span className="text-[10px] tracking-[0.3em] text-foreground/80 tabular-nums">
          SCROLL {(p * 100).toFixed(2)}%
        </span>
        <span className="text-[10px] tracking-[0.3em] text-foreground/40 tabular-nums">
          LAT 0.4ms · 120 FPS
        </span>
        <div className="mt-3 w-px h-32 bg-gradient-to-b from-foreground/40 via-foreground/10 to-transparent relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_oklch(0.85_0.15_220/0.8)]"
            style={{ top: `${p * 100}%` }}
          />
        </div>
      </div>

      {/* Bottom center: coordinates */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 pointer-events-none font-mono">
        <span>LAT 37.7749°</span>
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span>LON -122.4194°</span>
      </div>
    </>
  );
}
