import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useChapterPhase, HOME_CHAPTER_IDS } from "./useChapterPhase";
import sceneSpark from "@/assets/story-01-spark.webp";

interface CinematicLayerProps {
  /** Lenis-smoothed scroll progress 0→1, updated externally each RAF frame. */
  scrollProgress: React.RefObject<number>;
}

/**
 * Chapter time anchors (seconds) — start of each chapter's video segment.
 * Index maps 1:1 to HOME_CHAPTER_IDS: spark(0), founder(1), carbon(2),
 * industrial(3), recognition(4), ecosystem(5), future(6), end(7).
 */
const CHAPTER_TIMES = [0.0, 1.2, 2.2, 3.4, 5.2, 6.2, 7.0, 8.0] as const;

/**
 * Map chapter phase (0–6, fractional) to a video timestamp in seconds.
 *
 * Phase is piecewise-linearly interpolated between chapter anchors so
 * scrolling through a chapter scrubs only within that chapter's range.
 * For the final chapter (Future Systems, phase ≥ 6) the tail of overall
 * scroll progress extends playback toward 8.0 s.
 */
function phaseToTime(phase: number, scrollProg: number): number {
  const p = Math.max(0, Math.min(phase, 6));
  const i = Math.floor(p);
  const f = p - i;

  if (i >= 6) {
    // Future Systems: use last 20 % of page scroll to scrub 7.0 → 8.0 s
    const tail = Math.max(0, Math.min((scrollProg - 0.80) / 0.20, 1));
    return 7.0 + tail * 1.0;
  }

  return CHAPTER_TIMES[i] + f * (CHAPTER_TIMES[i + 1] - CHAPTER_TIMES[i]);
}

/**
 * Single persistent cinematic background layer.
 *
 * Architecture:
 *   - One <video> element, mounted once, never remounted.
 *   - Chapter phase drives video.currentTime — each chapter scrubs only
 *     within its assigned time range (see CHAPTER_TIMES above).
 *   - Fixed position, full viewport, z-[1] — content scrolls above it.
 *   - Reduced-motion: static poster image, no video element.
 */
export default function CinematicLayer({ scrollProgress }: CinematicLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const rafRef = useRef(0);
  const readyRef = useRef(false);
  const phase = useChapterPhase(HOME_CHAPTER_IDS);

  useEffect(() => {
    if (reduce) return;
    const vid = videoRef.current;
    if (!vid) return;

    readyRef.current = vid.readyState >= 2;
    const onCanPlay = () => { readyRef.current = true; };
    vid.addEventListener("canplay", onCanPlay);

    const tick = () => {
      if (readyRef.current && vid.duration > 0) {
        const target = phaseToTime(phase.get(), scrollProgress.current ?? 0);
        const clamped = Math.max(0, Math.min(target, vid.duration));
        // Only seek when delta > ~1 frame at 60 fps to avoid decoder thrashing.
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
  }, [reduce, scrollProgress, phase]);

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

      {/* Text readability: darkens sky/highlights without crushing blacks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 260 / 0.58) 0%, oklch(0.03 0.006 260 / 0.26) 48%, oklch(0.03 0.006 260 / 0.62) 100%)",
        }}
      />

      {/* Perimeter vignette: pulls focus inward, blends edges into UI */}
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
