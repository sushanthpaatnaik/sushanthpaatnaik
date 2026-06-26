import { useEffect, useRef, useState } from "react";
import monogram from "@/assets/sp-monogram.svg";

export const LOADER_SESSION_KEY = "sp_preloader_seen";

const MIN_SHOW_MS = 1_400; // always display for at least this long on first visit

/**
 * CinematicLoader
 *
 * Accepts real loading `progress` (0–100) from CanvasLayer's onProgress
 * callback. Holds the screen until progress reaches 100 AND the minimum
 * display time has elapsed, then fades out.
 *
 * Scroll is locked for the full duration via event prevention (wheel,
 * touchmove, keyboard) so the canvas sequence is never entered mid-load.
 *
 * Shows once per session (sessionStorage gate). Subsequent navigations
 * within the same tab skip the loader entirely.
 */
export default function Loader({ progress }: { progress: number }) {
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting]   = useState(false);
  const [done, setDone]         = useState(false);
  const startRef   = useRef(0);
  const exitedRef  = useRef(false);

  // Session gate — mark seen on first mount so repeat tab visits skip loader.
  useEffect(() => {
    if (sessionStorage.getItem(LOADER_SESSION_KEY) === "1") {
      setDone(true);
      return;
    }
    sessionStorage.setItem(LOADER_SESSION_KEY, "1");
    startRef.current = Date.now();

    const raf = requestAnimationFrame(() => {
      setEntering(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll lock — prevent wheel, touch and keyboard scrolling while the
  // loader is visible so the canvas sequence starts at frame 0 on reveal.
  useEffect(() => {
    if (done) return;

    const stopWheel = (e: WheelEvent) => { e.preventDefault(); };
    const stopTouch = (e: TouchEvent) => { e.preventDefault(); };
    const stopKeys  = (e: KeyboardEvent) => {
      if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel",     stopWheel, { passive: false });
    window.addEventListener("touchmove", stopTouch, { passive: false });
    window.addEventListener("keydown",   stopKeys);

    return () => {
      window.removeEventListener("wheel",     stopWheel);
      window.removeEventListener("touchmove", stopTouch);
      window.removeEventListener("keydown",   stopKeys);
    };
  }, [done]);

  // Exit once progress hits 100 % and the minimum display time has elapsed.
  useEffect(() => {
    if (progress < 100 || done || exiting || exitedRef.current) return;

    const elapsed   = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    const t = setTimeout(() => {
      if (exitedRef.current) return;
      exitedRef.current = true;

      // Brief pause so the user sees the completed bar before the fade.
      const t2 = setTimeout(() => {
        setExiting(true);
        setTimeout(() => setDone(true), 700);
      }, 320);
      return () => clearTimeout(t2);
    }, remaining);

    return () => clearTimeout(t);
  }, [progress, done, exiting]);

  if (done) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="fixed inset-0 z-[100] bg-[oklch(0.035_0_0)] flex items-center justify-center overflow-hidden"
      style={{
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 700ms cubic-bezier(0.19, 1, 0.22, 1)" : "none",
        willChange: "opacity",
        transform: "translateZ(0)",
      }}
    >
      {/* ── Ambient centrepiece glow ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 46% at 50% 50%, oklch(0.18 0.04 72 / 0.14), transparent 68%)",
        }}
      />

      {/* ── Scanlines ────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="sp-scanlines pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, oklch(0.967 0 0 / 0.015) 3px, oklch(0.967 0 0 / 0.015) 4px)",
          opacity: 0.55,
        }}
      />

      {/* ── Grid crosshair ───────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.967 0 0 / 0.028) 1px, transparent 1px), linear-gradient(90deg, oklch(0.967 0 0 / 0.028) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "center center",
        }}
      />

      {/* ── Centre content ───────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center">
        {/* SP Monogram */}
        <div
          className="relative mb-10 flex items-center justify-center"
          style={{
            opacity: entering ? 1 : 0,
            transform: entering ? "translateY(0) scale(1)" : "translateY(12px) scale(0.86)",
            transition: entering
              ? "opacity 900ms cubic-bezier(0.19, 1, 0.22, 1), transform 1000ms cubic-bezier(0.19, 1, 0.22, 1)"
              : "none",
            willChange: "opacity, transform",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: "-32px",
              background:
                "radial-gradient(circle, oklch(0.63 0.10 75 / 0.28) 0%, oklch(0.63 0.10 75 / 0.08) 48%, transparent 72%)",
              filter: "blur(18px)",
            }}
          />
          <div
            aria-hidden
            className="absolute rounded-full border"
            style={{ inset: "-18px", borderColor: "oklch(0.63 0.10 75 / 0.12)" }}
          />
          <img
            src={monogram}
            alt="SP monogram"
            width={52}
            height={52}
            draggable={false}
            className="relative w-12 h-12 md:w-[52px] md:h-[52px] select-none object-contain"
            style={{
              filter:
                "drop-shadow(0 0 18px oklch(0.78 0.12 78 / 0.55)) drop-shadow(0 0 6px oklch(0.63 0.10 75 / 0.35))",
            }}
          />
        </div>

        {/* Gold accent rule */}
        <div
          aria-hidden
          className="mb-9 h-px"
          style={{
            width: 140,
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.63 0.10 75 / 0.7) 28%, oklch(0.80 0.08 76 / 0.9) 50%, oklch(0.63 0.10 75 / 0.7) 72%, transparent 100%)",
            transform: entering ? "scaleX(1)" : "scaleX(0)",
            opacity: entering ? 1 : 0,
            transition: entering
              ? "transform 750ms 180ms cubic-bezier(0.19, 1, 0.22, 1), opacity 500ms 180ms ease"
              : "none",
            willChange: "transform, opacity",
          }}
        />

        {/* Brand name + tagline */}
        <div
          className="flex flex-col items-center gap-[6px]"
          style={{
            opacity: entering ? 1 : 0,
            transform: entering ? "translateY(0)" : "translateY(10px)",
            transition: entering
              ? "opacity 750ms 320ms cubic-bezier(0.19, 1, 0.22, 1), transform 800ms 320ms cubic-bezier(0.19, 1, 0.22, 1)"
              : "none",
            willChange: "opacity, transform",
          }}
        >
          <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.46em] text-foreground/88 font-light">
            Sushanth Paatnaik
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.34em] text-foreground/30">
            Inventor · Deep-Tech Founder
          </span>
        </div>

        {/* Status label + live percentage counter */}
        <div
          className="mt-14 flex items-center gap-[18px]"
          style={{
            opacity: entering ? 1 : 0,
            transition: entering ? "opacity 600ms 550ms ease" : "none",
          }}
        >
          <span
            className="font-mono text-[8px] uppercase tracking-[0.55em] transition-colors duration-500"
            style={{
              color: pct >= 100
                ? "oklch(0.63 0.10 75 / 0.55)"
                : "oklch(0.967 0 0 / 0.18)",
            }}
          >
            {pct >= 100 ? "Archive · Ready" : "Archive · Loading"}
          </span>
          <span
            className="font-mono text-[10px] tabular-nums transition-colors duration-300"
            style={{
              color: pct >= 100
                ? "oklch(0.80 0.08 76 / 0.55)"
                : "oklch(0.967 0 0 / 0.30)",
              minWidth: "3ch",
              textAlign: "right",
            }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* ── Progress filament — bottom edge ──────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "oklch(0.967 0 0 / 0.06)" }}
      >
        <div
          className="h-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.63 0.10 75 / 0.6) 15%, oklch(0.82 0.08 76 / 0.88) 50%, oklch(0.63 0.10 75 / 0.6) 85%, transparent 100%)",
            transform: `scaleX(${pct / 100})`,
            // Smooth step-by-step fill while loading; instant snap at 100%.
            transition: entering
              ? pct >= 100
                ? "transform 220ms cubic-bezier(0.19, 1, 0.22, 1)"
                : "transform 400ms cubic-bezier(0.25, 0, 0.1, 1)"
              : "none",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── Corner registration brackets ─────────────────────────────────── */}
      <CornerBrackets visible={entering} />
    </div>
  );
}

function CornerBrackets({ visible }: { visible: boolean }) {
  const base: React.CSSProperties = {
    position: "absolute",
    width: 20,
    height: 20,
    opacity: visible ? 0.4 : 0,
    transition: visible ? "opacity 600ms 400ms ease" : "none",
    borderColor: "oklch(0.63 0.10 75 / 0.65)",
  };
  return (
    <>
      <div style={{ ...base, top: 24, left: 24, borderLeft: "1px solid", borderTop: "1px solid" }} />
      <div style={{ ...base, top: 24, right: 24, borderRight: "1px solid", borderTop: "1px solid" }} />
      <div style={{ ...base, bottom: 24, left: 24, borderLeft: "1px solid", borderBottom: "1px solid" }} />
      <div style={{ ...base, bottom: 24, right: 24, borderRight: "1px solid", borderBottom: "1px solid" }} />
    </>
  );
}
