import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      // Eased fake progress that decelerates near 100
      p += (100 - p) * 0.08 + 0.6;
      if (p >= 99.5) {
        p = 100;
        setProgress(100);
        clearInterval(id);
        setTimeout(() => setDone(true), 900);
      } else {
        setProgress(p);
      }
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-all duration-1000 ${
        done ? "opacity-0 pointer-events-none [clip-path:inset(50%_0%_50%_0%)]" : "[clip-path:inset(0%_0%_0%_0%)]"
      }`}
    >
      {/* center mark */}
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_oklch(0.85_0.15_220/0.6)] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.5em] font-medium">Nova</span>
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
