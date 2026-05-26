import { useEffect, useState } from "react";
import monogram from "@/assets/sp-monogram.svg";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      // Eased fake progress — reaches 100 in ~500ms
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
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-all duration-1000 ${
        done ? "opacity-0 pointer-events-none [clip-path:inset(50%_0%_50%_0%)]" : "[clip-path:inset(0%_0%_0%_0%)]"
      }`}
      style={
        done
          ? undefined
          : {
              animation: "loaderAutoDismiss 0.9s ease 1.2s forwards",
            }
      }
    >
      <style>{`@keyframes loaderAutoDismiss { 0% { opacity: 1; clip-path: inset(0% 0% 0% 0%); visibility: visible; } 100% { opacity: 0; clip-path: inset(50% 0% 50% 0%); visibility: hidden; } }`}</style>
      {/* center mark */}
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
              className="relative w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-[0_0_14px_oklch(0.78_0.13_80/0.45)]"
            />
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-medium whitespace-pre-line text-center leading-relaxed">
            SUSHANTH{"\n"}PAATNAIK
          </span>
        </div>

        <div className="w-[260px] flex flex-col items-center gap-3">
          <div className="w-full h-px bg-foreground/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex w-full justify-between text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            <span>Loading scene</span>
            <span className="tabular-nums">{Math.floor(progress).toString().padStart(3, "0")}</span>
          </div>
        </div>
      </div>

      {/* corner brackets */}
      <Brackets />
    </div>
  );
}

function Brackets() {
  const cls = "absolute w-10 h-10 border-foreground/30";
  return (
    <>
      <div className={`${cls} top-8 left-8 border-l border-t`} />
      <div className={`${cls} top-8 right-8 border-r border-t`} />
      <div className={`${cls} bottom-8 left-8 border-l border-b`} />
      <div className={`${cls} bottom-8 right-8 border-r border-b`} />
    </>
  );
}
