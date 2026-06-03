import { useEffect, useRef, useState } from "react";
import monogram from "@/assets/sp-monogram.svg";

export const LOADER_SESSION_KEY = "sp_preloader_seen";

const MIN_SHOW_MS = 1_400; // always show for at least this long on first visit

/**
 * CinematicLoader
 *
 * Holds the screen until `ready` is true (video canplaythrough) AND
 * the minimum display time has elapsed, then fades out.
 *
 * Shows once per session (sessionStorage gate). On subsequent navigations
 * within the same tab the component is a no-op.
 */
export default function Loader({ ready }: { ready: boolean }) {
  const [entering, setEntering] = useState(false);
  const [loadProgress, setLoadProgress] = useState<"idle" | "loading" | "complete">("idle");
  const [exiting, setExiting]   = useState(false);
  const [done, setDone]         = useState(false);
  const startRef = useRef(0);
  const exitedRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem(LOADER_SESSION_KEY) === "1") {
      setDone(true);
      return;
    }
    sessionStorage.setItem(LOADER_SESSION_KEY, "1");
    startRef.current = Date.now();

    const raf = requestAnimationFrame(() => {
      setEntering(true);
      // Start the indeterminate progress bar sweep
      requestAnimationFrame(() => setLoadProgress("loading"));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // When the video signals ready, complete the bar then begin the exit fade.
  useEffect(() => {
    if (!ready || done || exiting || exitedRef.current) return;

    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    const t = setTimeout(() => {
      if (exitedRef.current) return;
      exitedRef.current = true;
      setLoadProgress("complete");

      // Let the bar reach 100 % before the overlay fades
      const t2 = setTimeout(() => {
        setExiting(true);
        setTimeout(() => setDone(true), 700);
      }, 380);
      return () => clearTimeout(t2);
    }, remaining);

    return () => clearTimeout(t);
  }, [ready, done, exiting]);

  if (done) return null;

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

        {/* Status label — updates when video is ready */}
        <div
          className="mt-14 font-mono text-[8px] uppercase tracking-[0.55em] transition-colors duration-500"
          style={{
            color: loadProgress === "complete"
              ? "oklch(0.63 0.10 75 / 0.55)"
              : "oklch(0.967 0 0 / 0.18)",
            opacity: entering ? 1 : 0,
            transition: entering ? "opacity 600ms 550ms ease, color 500ms ease" : "none",
          }}
        >
          {loadProgress === "complete" ? "Archive · Ready" : "Archive · Loading"}
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
            transform:
              loadProgress === "idle"    ? "scaleX(0)" :
              loadProgress === "loading" ? "scaleX(0.88)" :
              "scaleX(1)",
            transition:
              loadProgress === "idle"    ? "none" :
              loadProgress === "loading" ? "transform 10000ms cubic-bezier(0.12, 0, 0.2, 1)" :
              "transform 380ms cubic-bezier(0.19, 1, 0.22, 1)",
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
