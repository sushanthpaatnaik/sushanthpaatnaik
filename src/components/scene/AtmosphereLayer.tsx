import { useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import atmosphereVideo from "@/assets/atmosphere.mp4";

/**
 * Sitewide cinematic atmosphere layer.
 *
 * The video keeps looping continuously — only transforms and overlay opacities
 * animate between section "states", so it feels like a slow cinematic camera
 * drifting through a graphene/nano-material environment rather than a wallpaper.
 *
 *   0 Origin/Hero · 1 Vision   · 2 Materials · 3 Intelligence
 *   4 Ventures    · 5 Process  · 6 Impact    · 7 Contact
 */
const STOPS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => i / 7);

export default function AtmosphereLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (!v) return;
    v.playbackRate = 0.28;
    v.play().catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll();
  // Silky spring — restrained, cinematic, never snappy
  const p = useSpring(scrollYProgress, { stiffness: 50, damping: 30, mass: 0.7 });

  /* ---------- Video "camera" — drifting through the environment ----------
   * Each section keyframe matches the emotional brief:
   *   Hero       — clearest, sharpest, strongest graphene visibility
   *   Vision     — softer contrast, deeper atmosphere, more haze
   *   Materials  — stronger molecular visibility, conductive glow rises
   *   Intelligence — cyan energy peak, sharper material depth
   *   Ventures   — darker cinematic contrast, calmer atmosphere
   *   Process    — transitional, slightly diffused
   *   Impact     — softer focus, more atmospheric diffusion
   *   Contact    — elegant darkness, stillness
   */
  //                              Hero  Vision Mater. Intel. Vent.  Proc.  Impact Contact
  const scale      = useTransform(p, STOPS, [1.04, 1.07, 1.10, 1.12, 1.09, 1.10, 1.08, 1.14]);
  const translateY = useTransform(p, STOPS, [   0,  -14,   -8,  -22,  -16,  -28,  -20,  -36]);
  const rotate     = useTransform(p, STOPS, [   0, -0.4,  0.3, -0.2,  0.4, -0.3,  0.2, -0.5]);
  const blurPx     = useTransform(p, STOPS, [ 0.2,  1.4,  0.6,  0.9,  1.8,  1.5,  2.2,  2.0]);
  const brightness = useTransform(p, STOPS, [0.92, 0.66, 0.82, 0.76, 0.58, 0.62, 0.70, 0.48]);
  const contrast   = useTransform(p, STOPS, [1.06, 1.02, 1.12, 1.10, 1.16, 1.06, 0.98, 1.08]);
  const saturate   = useTransform(p, STOPS, [0.92, 0.74, 0.94, 1.00, 0.70, 0.76, 0.82, 0.60]);
  const videoOpacity = useTransform(p, STOPS, [0.92, 0.74, 0.86, 0.82, 0.70, 0.74, 0.76, 0.60]);

  const videoFilter = useTransform(
    [blurPx, brightness, contrast, saturate] as never,
    ([b, br, ct, sa]: number[]) =>
      `blur(${b.toFixed(2)}px) brightness(${br.toFixed(2)}) contrast(${ct.toFixed(2)}) saturate(${sa.toFixed(2)})`,
  );

  /* ---------- Darkening / readability overlay ---------- */
  const darkOpacity = useTransform(p, STOPS, [0.28, 0.46, 0.36, 0.40, 0.56, 0.50, 0.46, 0.64]);

  /* ---------- Atmospheric haze — drifts gently upward ---------- */
  const hazeOpacity = useTransform(p, STOPS, [0.14, 0.30, 0.22, 0.24, 0.22, 0.24, 0.34, 0.28]);
  const hazeY       = useTransform(p, [0, 1], [0, -70]);

  /* ---------- Conductive cyan glow — peaks at Intelligence ---------- */
  const glowOpacity = useTransform(p, STOPS, [0.05, 0.09, 0.16, 0.24, 0.10, 0.09, 0.10, 0.07]);
  const glowScale   = useTransform(p, STOPS, [1.00, 1.05, 1.10, 1.18, 1.06, 1.04, 1.08, 1.02]);

  /* ---------- Vignette depth ---------- */
  const vignetteOpacity = useTransform(p, STOPS, [0.50, 0.68, 0.60, 0.64, 0.76, 0.70, 0.66, 0.84]);

  /* ---------- Foreground particle parallax ---------- */
  const particleY = useTransform(p, [0, 1], [0, -90]);
  const particleOpacity = useTransform(p, STOPS, [0.85, 0.70, 1.00, 0.95, 0.55, 0.65, 0.75, 0.35]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Video atmosphere — cinematic camera drifting through the environment */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          scale,
          y: translateY,
          rotate,
          opacity: videoOpacity,
          filter: videoFilter,
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
        <div className="absolute inset-0 mix-blend-color bg-[linear-gradient(135deg,oklch(0.12_0.02_240)_0%,oklch(0.15_0.04_220)_55%,oklch(0.13_0.03_255)_100%)] opacity-50" />
        {/* Tonal crush — lift shadows into graphite */}
        <div className="absolute inset-0 mix-blend-multiply bg-[#0a0d14]/55" />
      </motion.div>

      {/* Section-reactive darkening */}
      <motion.div
        className="absolute inset-0 bg-[#03050a]"
        style={{ opacity: darkOpacity }}
      />

      {/* Layered atmospheric haze — slow drifting fog */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: hazeOpacity, y: hazeY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,oklch(0.30_0.06_240/0.45),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,oklch(0.26_0.05_230/0.35),transparent_65%)]" />
      </motion.div>

      {/* Conductive glow — breathes wider through Intelligence */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform"
        style={{ opacity: glowOpacity, scale: glowScale }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.55_0.16_220/0.55),transparent_60%)]" />
      </motion.div>

      {/* Foreground molecular particle drift */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: particleY, opacity: particleOpacity }}
      >
        {particles.map((pt) => (
          <span
            key={pt.seed}
            className="absolute rounded-full bg-[oklch(0.85_0.05_220)]"
            style={{
              left: `${pt.left}%`,
              top: `${pt.top}%`,
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              opacity: 0.28,
              filter: "blur(1.1px)",
              boxShadow: "0 0 5px oklch(0.7 0.08 220 / 0.28)",
              animation: `atmosDrift ${pt.dur}s ease-in-out ${pt.delay}s infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      {/* Cinematic vignette */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,#02030a_100%)]"
        style={{ opacity: vignetteOpacity }}
      />

      {/* Letterbox gradients */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#02030a]/95 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#02030a]/95 to-transparent" />

      {/* Procedural grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0%   { transform: translate3d(0, 0, 1px); opacity: 0.14; }
          50%  { transform: translate3d(6px, -10px, 1px); opacity: 0.32; }
          100% { transform: translate3d(-4px, -20px, 1px); opacity: 0.18; }
        }
      `}</style>
    </div>
  );
}
