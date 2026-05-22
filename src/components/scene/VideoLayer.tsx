import { useEffect, useRef } from "react";
import grapheneAsset from "@/assets/graphene.mp4.asset.json";

/**
 * Cinematic video layer that fades in over a scroll range.
 * Sits between the 3D canvas (z-0) and the UI (z-10).
 */
export default function VideoLayer({
  scrollProgress,
  start = 0.42,
  end = 0.62,
}: {
  scrollProgress: React.MutableRefObject<number>;
  start?: number;
  end?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = scrollProgress.current;
      const fade = 0.06;
      let o = 0;
      if (p > start - fade && p < end + fade) {
        if (p < start) o = (p - (start - fade)) / fade;
        else if (p > end) o = 1 - (p - end) / fade;
        else o = 1;
      }
      o = Math.max(0, Math.min(1, o));
      if (ref.current) ref.current.style.opacity = String(o * 0.55);
      if (videoRef.current) {
        if (o > 0.05 && videoRef.current.paused) videoRef.current.play().catch(() => {});
        if (o <= 0.05 && !videoRef.current.paused) videoRef.current.pause();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress, start, end]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[1] pointer-events-none opacity-0 transition-opacity duration-100 mix-blend-screen"
    >
      <video
        ref={videoRef}
        src={grapheneAsset.url}
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
      {/* Soften edges into the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#04050a_85%)]" />
    </div>
  );
}
