import { useEffect, useRef, useState } from "react";

export const LOADER_SESSION_KEY = "sp_preloader_seen";

const MIN_SHOW_MS  = 1_400;
const FAILSAFE_MS  = 8_000;
const PAUSE_MS     = 200;
const FADE_OUT_MS  = 400;

/**
 * Cinematic preloader.
 *
 * Shows once per session (sessionStorage gate).
 * Accepts real loading progress (0–100) from CanvasLayer.
 * Calls onDone after the fade-out completes so the parent can start
 * the homepage fade-in and re-enable scroll.
 */
export default function Loader({
  progress,
  onDone,
}: {
  progress: number;
  onDone?: () => void;
}) {
  const [entering,  setEntering]  = useState(false);
  const [exiting,   setExiting]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [failsafe,  setFailsafe]  = useState(false);
  const startRef  = useRef(0);
  const exitedRef = useRef(false);

  // Session gate — skip loader on repeat visits within the same tab.
  useEffect(() => {
    if (sessionStorage.getItem(LOADER_SESSION_KEY) === "1") {
      setDone(true);
      onDone?.();
      return;
    }
    sessionStorage.setItem(LOADER_SESSION_KEY, "1");
    startRef.current = Date.now();
    const raf = requestAnimationFrame(() => setEntering(true));
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CSS scroll lock — primary barrier, active before React event listeners attach.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    const prevTA = document.body.style.touchAction;
    document.body.style.overflow   = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow    = prev;
      document.body.style.touchAction = prevTA;
    };
  }, [done]);

  // Event-based scroll lock — belt-and-suspenders with the CSS lock above.
  useEffect(() => {
    if (done) return;
    const stopWheel = (e: WheelEvent) => e.preventDefault();
    const stopTouch = (e: TouchEvent) => e.preventDefault();
    const stopKeys  = (e: KeyboardEvent) => {
      if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key))
        e.preventDefault();
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

  // Failsafe — surface a status message if loading stalls past 8 s.
  useEffect(() => {
    const t = setTimeout(() => setFailsafe(true), FAILSAFE_MS);
    return () => clearTimeout(t);
  }, []);

  // Exit once progress reaches 100 % and the minimum display time has passed.
  useEffect(() => {
    if (progress < 100 || done || exiting || exitedRef.current) return;

    const elapsed   = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    const t = setTimeout(() => {
      if (exitedRef.current) return;
      exitedRef.current = true;
      // Brief pause so the user sees the filled bar, then fade out.
      const t2 = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setDone(true);
          onDone?.();
        }, FADE_OUT_MS);
      }, PAUSE_MS);
      return () => clearTimeout(t2);
    }, remaining);

    return () => clearTimeout(t);
  }, [progress, done, exiting, onDone]);

  if (done) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
      style={{
        backgroundColor: "#050816",
        opacity: exiting ? 0 : 1,
        transition: exiting
          ? `opacity ${FADE_OUT_MS}ms cubic-bezier(0.19, 1, 0.22, 1)`
          : "none",
        willChange: "opacity",
        transform: "translateZ(0)",
      }}
    >
      {/* Subtle radial glow behind text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.028) 0%, transparent 70%)",
        }}
      />

      {/* Centre content */}
      <div
        className="relative flex flex-col items-center"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? "translateY(0)" : "translateY(14px)",
          transition: entering
            ? "opacity 900ms cubic-bezier(0.19, 1, 0.22, 1), transform 1000ms cubic-bezier(0.19, 1, 0.22, 1)"
            : "none",
          willChange: "opacity, transform",
        }}
      >
        {/* Name */}
        <span
          style={{
            fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
            fontSize: "clamp(13px, 1.9vw, 20px)",
            letterSpacing: "0.44em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.90)",
            fontWeight: 300,
            lineHeight: 1,
            paddingRight: "0.44em", // compensate letter-spacing on the last glyph
          }}
        >
          Sushanth Paatnaik
        </span>

        {/* Tagline */}
        <span
          style={{
            marginTop: "10px",
            fontFamily: "ui-monospace, 'SF Mono', monospace",
            fontSize: "clamp(7.5px, 0.9vw, 10px)",
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.26)",
            fontWeight: 400,
            paddingRight: "0.30em",
          }}
        >
          Engineering Intelligent Matter
        </span>

        {/* Progress area */}
        <div
          style={{
            marginTop: "52px",
            width: "min(260px, 58vw)",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Loading bar track */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.10)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Fill */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "left",
                transform: `scaleX(${pct / 100})`,
                background: "rgba(255,255,255,0.70)",
                transition: pct >= 100
                  ? `transform 200ms cubic-bezier(0.19, 1, 0.22, 1)`
                  : `transform 400ms cubic-bezier(0.25, 0, 0.1, 1)`,
                willChange: "transform",
              }}
            />
          </div>

          {/* Status label + live percentage */}
          <div
            style={{
              marginTop: "11px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "ui-monospace, 'SF Mono', monospace",
                fontSize: "8.5px",
                letterSpacing: "0.52em",
                textTransform: "uppercase",
                color: failsafe && pct < 100
                  ? "rgba(255,255,255,0.42)"
                  : pct >= 100
                  ? "rgba(255,255,255,0.36)"
                  : "rgba(255,255,255,0.18)",
                transition: "color 500ms ease",
                paddingRight: "0.52em",
              }}
            >
              {failsafe && pct < 100
                ? "Optimizing Experience…"
                : pct >= 100
                ? "Ready"
                : "Loading"}
            </span>
            <span
              style={{
                fontFamily: "ui-monospace, 'SF Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                color: pct >= 100
                  ? "rgba(255,255,255,0.46)"
                  : "rgba(255,255,255,0.28)",
                transition: "color 300ms ease",
                minWidth: "3ch",
                textAlign: "right",
              }}
            >
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
