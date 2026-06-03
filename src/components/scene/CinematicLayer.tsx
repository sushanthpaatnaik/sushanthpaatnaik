import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import sceneSpark from "@/assets/story-01-spark.webp";

interface CinematicLayerProps {
  /** Lenis-smoothed scroll progress 0→1, updated each RAF frame. */
  scrollProgress: React.RefObject<number>;
}

/**
 * Chapter time anchors (seconds).
 * CHAPTER_TIMES[N] = video start of chapter N.
 * CHAPTER_TIMES[7] = total mapped duration (end of ch6 / Future Systems).
 *
 * Origin            0.0 → 1.2 s
 * Founder           1.2 → 2.2 s
 * Material          2.2 → 3.4 s
 * Industrial        3.4 → 5.2 s
 * Recognition       5.2 → 6.2 s
 * Ecosystem         6.2 → 7.0 s
 * Future Systems    7.0 → 8.0 s
 */
const CHAPTER_TIMES = [0.0, 1.2, 2.2, 3.4, 5.2, 6.2, 7.0, 8.0] as const;
const N_CHAPTERS = CHAPTER_TIMES.length - 1; // 7

/**
 * Map overall scroll progress (0→1) to a video timestamp.
 *
 * The sticky stage divides the 7 chapters into equal scroll bands — each
 * chapter occupies exactly 1/7 of total scroll.  Piecewise linear through
 * CHAPTER_TIMES gives smooth, continuous scrubbing with no discontinuities
 * at chapter boundaries.
 */
function scrollToTime(scrollProg: number): number {
  const p = Math.max(0, Math.min(scrollProg, 1));
  const pos = p * N_CHAPTERS;               // 0 → 7
  const i   = Math.min(Math.floor(pos), N_CHAPTERS - 1);
  const f   = pos - i;
  return CHAPTER_TIMES[i] + f * (CHAPTER_TIMES[i + 1] - CHAPTER_TIMES[i]);
}

/**
 * Single persistent cinematic background.
 *
 * - One <video>, mounted once, never remounted.
 * - `scrollProgress` drives `video.currentTime` each RAF frame — no autoplay,
 *   no looping.  Each chapter scrubs only within its assigned time range.
 * - Fixed, full-viewport, z-[1].  Content layers sit above.
 * - Reduced-motion: static poster image, no video element.
 */
export default function CinematicLayer({ scrollProgress }: CinematicLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce   = useReducedMotion();
  const rafRef   = useRef(0);
  const readyRef = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const vid = videoRef.current;
    if (!vid) return;

    readyRef.current = vid.readyState >= 2;
    const onCanPlay = () => { readyRef.current = true; };
    vid.addEventListener("canplay", onCanPlay);

    const tick = () => {
      if (readyRef.current && vid.duration > 0) {
        const target  = scrollToTime(scrollProgress.current ?? 0);
        const clamped = Math.max(0, Math.min(target, vid.duration));
        // Skip seeks smaller than one ~60 fps frame to avoid decoder thrashing.
        if (Math.abs(vid.currentTime - clamped) > 0.016) {
          vid.currentTime = clamped;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      vid.removeEventListener("canplay", onCanPlay);
    };
  }, [reduce, scrollProgress]);

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
          style={{ filter: "brightness(0.50) saturate(0.45)" }}
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
            filter: "brightness(0.72) contrast(1.04) saturate(0.82)",
          }}
        >
          <source src="/videos/cinematic-homepage.mp4" type="video/mp4" />
        </video>
      )}

      {/* Text readability — darkens sky/highlights without crushing blacks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.58) 0%, oklch(0.03 0.006 260 / 0.26) 48%, oklch(0.03 0.006 260 / 0.62) 100%)",
        }}
      />

      {/* Perimeter vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 46%, oklch(0.02 0.006 260 / 0.72) 100%)",
        }}
      />

      {/* Top / bottom cinematic letterbox frames */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.03 0.006 260 / 0.44), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.03 0.006 260 / 0.44), transparent)",
        }}
      />
    </div>
  );
}

