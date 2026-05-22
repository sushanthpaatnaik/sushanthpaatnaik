import { useEffect, useMemo, useRef } from "react";
import atmosphereVideo from "@/assets/atmosphere.mp4";

/**
 * Sitewide cinematic atmosphere layer.
 * Living deep-tech environment surrounding the interface.
 * Scroll-reactive: slow parallax + scale + blur + perspective drift.
 */
export default function AtmosphereLayer({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particleWrapRef = useRef<HTMLDivElement>(null);

  // Pre-computed floating molecular particles
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 0.8 + Math.random() * 1.6,
        delay: Math.random() * 24,
        dur: 28 + Math.random() * 32,
        seed: i,
      })),
    [],
  );

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.playbackRate = 0.25; // deeper, luxurious cadence
      v.play().catch(() => {});
    }
    let raf = 0;
    let cur = 0;
    let t0 = performance.now();
    const loop = () => {
      const now = performance.now();
      const t = (now - t0) / 1000;
      const target = scrollProgress.current;
      cur += (target - cur) * 0.03; // slower, heavier follow

      if (wrapRef.current) {
        const ty = -cur * 38;              // slower parallax
        const scale = 1.08 + cur * 0.03;  // restrained perspective scale
        const blur = 3 + cur * 3.5;        // softer depth blur
        const drift = Math.sin(t * 0.035) * 4; // ambient drift
        wrapRef.current.style.transform = `translate3d(${drift}px, ${ty}px, 0) scale(${scale})`;
        wrapRef.current.style.filter = `blur(${blur.toFixed(2)}px) saturate(0.62) contrast(1.01) brightness(0.45)`;
      }
      if (hazeRef.current) {
        const dy = Math.sin(t * 0.06) * 8;
        const op = 0.14 + Math.sin(t * 0.05) * 0.03;
        hazeRef.current.style.transform = `translate3d(0, ${dy}px, 0)`;
        hazeRef.current.style.opacity = op.toFixed(3);
      }
      if (glowRef.current) {
        const op = 0.08 + Math.sin(t * 0.035 + 1.2) * 0.02;
        glowRef.current.style.opacity = op.toFixed(3);
      }
      if (particleWrapRef.current) {
        particleWrapRef.current.style.transform = `translate3d(0, ${-cur * 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Video atmosphere */}
      <div
        ref={wrapRef}
        className="absolute inset-0 will-change-transform"
        style={{
          transform: "scale(1.12)",
          filter: "blur(4px) saturate(0.7) contrast(1.04) brightness(0.52)",
        }}
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
        {/* Cinematic color grade — graphite blacks, restrained cyan-blue conductive cast */}
        <div className="absolute inset-0 mix-blend-color bg-[linear-gradient(135deg,oklch(0.14_0.03_240)_0%,oklch(0.18_0.05_220)_55%,oklch(0.16_0.04_255)_100%)] opacity-80" />
        {/* Tonal crush — lift shadows into graphite */}
        <div className="absolute inset-0 mix-blend-multiply bg-[#0a0d14]/70" />
      </div>

      {/* Deep graphite darkening — readability */}
      <div className="absolute inset-0 bg-[#04060c]/72" />

      {/* Layered atmospheric haze — slow drifting fog */}
      <div
        ref={hazeRef}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 0.18 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,oklch(0.3_0.06_240/0.5),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,oklch(0.28_0.05_230/0.4),transparent_60%)]" />
      </div>

      {/* Conductive glow — restrained cyan-blue center */}
      <div
        ref={glowRef}
        className="absolute inset-0 mix-blend-screen"
        style={{ opacity: 0.12 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.45_0.14_220/0.5),transparent_55%)]" />
      </div>

      {/* Foreground molecular particle drift */}
      <div ref={particleWrapRef} className="absolute inset-0 will-change-transform">
        {particles.map((p) => (
          <span
            key={p.seed}
            className="absolute rounded-full bg-[oklch(0.85_0.06_220)] atmos-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.35,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px oklch(0.7 0.1 220 / 0.4)",
              animation: `atmosDrift ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Cinematic vignette — deepened edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#02030a_100%)]" />

      {/* Letterbox gradients — taller, premium framing */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#02030a]/98 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#02030a]/98 to-transparent" />

      {/* Procedural grain — fine, cinematic */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Inline keyframes for particle drift (CSS animation OK here — non-React, GPU transforms) */}
      <style>{`
        @keyframes atmosDrift {
          0%   { transform: translate3d(0, 0, 0); opacity: 0.18; }
          50%  { transform: translate3d(8px, -14px, 0); opacity: 0.42; }
          100% { transform: translate3d(-6px, -28px, 0); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
