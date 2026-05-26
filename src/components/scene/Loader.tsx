import { useEffect, useState } from "react";
import monogram from "@/assets/sp-monogram.svg";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += (100 - p) * 0.22 + 2.5;
      if (p >= 99.5) {
        p = 100;
        setProgress(100);
        clearInterval(id);
        setTimeout(() => setDone(true), 220);
      } else {
        setProgress(p);
      }
    }, 32);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-[opacity,clip-path] duration-1000 ${
        done ? "opacity-0 pointer-events-none [clip-path:inset(50%_0%_50%_0%)]" : "[clip-path:inset(0%_0%_0%_0%)]"
      }`}
      style={{ willChange: "opacity, clip-path", transform: "translateZ(0)" }}
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -m-4 rounded-full animate-pulse"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.78 0.13 80 / 0.32) 0%, oklch(0.72 0.14 75 / 0.14) 45%, transparent 72%)",
                filter: "blur(8px)",
              }}
            />
            <img
              src={monogram}
              alt="SP monogram"
              width={44}
              height={44}
              className="relative w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-[0_0_14px_oklch(0.78_0.13_80/0.45)]"
            />
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-medium whitespace-pre-line text-center leading-relaxed">
            SUSHANTH{"\n"}PAATNAIK
          </span>
        </div>

        <div className="w-[min(260px,80vw)] flex flex-col items-center gap-3">
          <div className="w-full h-px bg-foreground/10 overflow-hidden">
            {/* scaleX transform is GPU-composited, avoids layout reflow from width animation */}
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary origin-left"
              style={{
                transform: `scaleX(${progress / 100})`,
                transition: "transform 150ms ease-out",
                willChange: "transform",
              }}
            />
          </div>
          <div className="flex w-full justify-between text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            <span>Loading scene</span>
            <span className="tabular-nums">{Math.floor(progress).toString().padStart(3, "0")}</span>
          </div>
        </div>
      </div>

      <Brackets />
    </div>
  );
}

function Brackets() {
  const cls = "absolute w-10 h-10 border-foreground/30";
  return (
    <>
      <div className={`${cls} top-6 left-6 sm:top-8 sm:left-8 border-l border-t`} />
      <div className={`${cls} top-6 right-6 sm:top-8 sm:right-8 border-r border-t`} />
      <div className={`${cls} bottom-6 left-6 sm:bottom-8 sm:left-8 border-l border-b`} />
      <div className={`${cls} bottom-6 right-6 sm:bottom-8 sm:right-8 border-r border-b`} />
    </>
  );
}
