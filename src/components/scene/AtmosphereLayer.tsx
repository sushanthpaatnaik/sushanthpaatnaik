import { useEffect, useRef } from "react";
import atmosphereVideo from "@/assets/atmosphere.mp4";

/**
 * Sitewide cinematic atmosphere layer.
 * Always present, behind UI, in front of 3D canvas.
 * Scroll-reactive: subtle parallax + scale + blur drift.
 */
export default function AtmosphereLayer({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.playbackRate = 0.4; // slower, more luxurious cadence
      v.play().catch(() => {});
    }
    let raf = 0;
    let cur = 0;
    const loop = () => {
      const target = scrollProgress.current;
      cur += (target - cur) * 0.05; // deeper, slower follow
      if (wrapRef.current) {
        const ty = -cur * 45;            // restrained parallax
        const scale = 1.1 + cur * 0.035; // gentler scale
        const blur = 3.5 + cur * 4.5;    // softer baseline depth
        wrapRef.current.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
        wrapRef.current.style.filter = `blur(${blur.toFixed(2)}px) saturate(0.78) contrast(1.02) brightness(0.6)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  return (
    <>
      {/* Video atmosphere — fixed full-bleed, behind content */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div
          ref={wrapRef}
          className="absolute inset-0 will-change-transform"
          style={{ transform: "scale(1.1)", filter: "blur(3.5px) saturate(0.78) contrast(1.02) brightness(0.6)" }}
        >
          <video
            ref={videoRef}
            src={atmosphereVideo}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Cinematic color grade — graphite blacks, restrained electric-blue highlights */}
          <div className="absolute inset-0 mix-blend-color bg-[linear-gradient(135deg,oklch(0.16_0.035_250)_0%,oklch(0.2_0.05_260)_100%)] opacity-70" />
        </div>

        {/* Deep graphite darkening — readability */}
        <div className="absolute inset-0 bg-[#06070c]/68" />

        {/* Atmospheric haze — soft molecular glow center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.32_0.1_245/0.14),transparent_65%)] mix-blend-screen" />

        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#03040a_98%)]" />

        {/* Letterbox gradients */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#03040a]/97 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#03040a]/97 to-transparent" />

        {/* Procedural grain */}
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        {/* Subtle scanline overlay — premium screen feel */}
        <div className="absolute inset-0 opacity-[0.014] bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,#ffffff_2px,#ffffff_3px)] mix-blend-overlay" />
      </div>
    </>
  );
}
