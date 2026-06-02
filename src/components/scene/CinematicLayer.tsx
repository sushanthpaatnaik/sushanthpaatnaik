import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import sceneSpark from "@/assets/story-01-spark.webp";

interface CinematicLayerProps {
  /** Lenis-smoothed scroll progress 0→1, updated externally each RAF frame. */
  scrollProgress: React.RefObject<number>;
}

/**
 * Single persistent cinematic background layer.
 *
 * Architecture:
 *   - One <video> element, mounted once, never remounted.
 *   - Scroll position drives video.currentTime (not autoplay).
 *   - 0 % scroll = frame 0 · 100 % scroll = last frame.
 *   - Fixed position, full viewport, z-[1] — content scrolls above it.
 *   - Reduced-motion: static poster image, no video element.
 */
export default function CinematicLayer({ scrollProgress }: CinematicLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const rafRef = useRef(0);
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
        const target = Math.min(scrollProgress.current ?? 0, 1) * vid.duration;
        // Only seek when the delta is larger than ~1 frame at 60 fps — avoids
        // thrashing the decoder when the user isn't scrolling.
        if (Math.abs(vid.currentTime - target) > 0.016) {
          vid.currentTime = target;
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
        // Promote entire background stack to its own GPU compositor layer.
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "strict",
      }}
    >
      {reduce ? (
        /* Reduced-motion: static image, no video element at all. */
        <img
          src={sceneSpark}
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
          style={{ filter: "brightness(0.50) saturate(0.45)" }}
        />
      ) : (
        /* Full-motion: scroll-scrubbed video, GPU-accelerated. */
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

      {/* ── Overlay stack (applied on top of both video and static image) ── */}

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

      {/* Top / bottom letterbox frame: cinematic framing, section blending */}
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
