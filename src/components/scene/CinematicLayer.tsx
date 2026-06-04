import { useEffect, useRef } from "react";
import { useReducedMotion, useScroll } from "framer-motion";
import sceneSpark from "@/assets/story-01-spark.webp";
import bgVideo from "@/assets/sp-background-video.mp4";

interface CinematicLayerProps {
  /** Fires once when the video has enough data to play through (canplaythrough).
   *  On reduced-motion devices (no video), fires on the next microtask. */
  onReady?: () => void;
}

/**
 * Single persistent cinematic background.
 *
 * - One <video>, mounted once, never remounted.
 * - scroll progress 0→1 maps linearly to video 0→duration, so the
 *   full video plays exactly once from Origin to Future Systems.
 * - Fixed, full-viewport, z-[1].  Content layers sit above.
 * - Reduced-motion: static poster image, no video element.
 */
export default function CinematicLayer({ onReady }: CinematicLayerProps) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const reduce     = useReducedMotion();
  const rafRef     = useRef(0);
  const readyRef   = useRef(false);
  const notifiedRef = useRef(false);
  const { scrollYProgress } = useScroll();

  // For reduced-motion users there is no video — signal ready immediately.
  useEffect(() => {
    if (!reduce) return;
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      onReady?.();
    }
  }, [reduce, onReady]);

  useEffect(() => {
    if (reduce) return;
    const vid = videoRef.current;
    if (!vid) return;

    const notifyReady = () => {
      if (notifiedRef.current) return;
      notifiedRef.current = true;
      readyRef.current   = true;
      onReady?.();
    };

    readyRef.current = vid.readyState >= 2;
    // Already has enough data (e.g. cached from previous visit)
    if (vid.readyState >= 4) notifyReady();

    const onCanPlay    = () => { readyRef.current = true; };
    const onCanPlayThrough = notifyReady;
    // Fallback: if canplaythrough never fires (very slow connection), reveal after 12 s
    const fallback = window.setTimeout(notifyReady, 12_000);

    vid.addEventListener("canplay", onCanPlay);
    vid.addEventListener("canplaythrough", onCanPlayThrough);

    const tick = () => {
      if (readyRef.current && vid.duration > 0) {
        const target  = Math.max(0, Math.min(scrollYProgress.get(), 1)) * vid.duration;
        const clamped = Math.max(0, Math.min(target, vid.duration));
        // Skip seeks < 2 frames (33 ms) to avoid decoder thrashing while still
        // advancing frame-accurately. fastSeek() is intentionally NOT used —
        // it jumps to the nearest keyframe (can be seconds apart) which causes
        // the background to visibly jump rather than advance smoothly.
        if (Math.abs(vid.currentTime - clamped) > 0.033) {
          vid.currentTime = clamped;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallback);
      vid.removeEventListener("canplay", onCanPlay);
      vid.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, [reduce, scrollYProgress, onReady]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[1] overflow-hidden pointer-events-none"
      style={{
        backgroundColor: "oklch(0.03 0.006 260)",
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "strict",
      }}
    >
      {reduce ? (
        <img
          src={sceneSpark}
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          style={{ filter: "brightness(0.65) saturate(0.52)" }}
        />
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={sceneSpark}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            filter: "brightness(0.80) contrast(1.04) saturate(0.84)",
          }}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      )}

      {/* Text readability — darkens sky/highlights without crushing blacks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.38) 0%, oklch(0.03 0.006 260 / 0.12) 48%, oklch(0.03 0.006 260 / 0.42) 100%)",
        }}
      />

      {/* Perimeter vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, oklch(0.02 0.006 260 / 0.50) 100%)",
        }}
      />

      {/* Top / bottom cinematic letterbox frames */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.03 0.006 260 / 0.26), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.03 0.006 260 / 0.26), transparent)",
        }}
      />

      {/* Bottom-right corner cover — hides any video watermark */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: "280px",
          height: "80px",
          background:
            "linear-gradient(135deg, transparent 0%, oklch(0.03 0.006 260 / 0.82) 55%, oklch(0.02 0.004 260 / 0.96) 100%)",
        }}
      />

    </div>
  );
}

