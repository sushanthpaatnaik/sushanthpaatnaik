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
    v.playbackRate = 0.24;
    v.play().catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll();
  // Dual-spring parallax depth system:
  //   pFast  — video camera responds with restrained immediacy
  //   pSlow  — atmospheric overlays drift heavier, creating dimensional depth
  const pFast = useSpring(scrollYProgress, { stiffness: 32, damping: 42, mass: 1.2 });
  const pSlow = useSpring(scrollYProgress, { stiffness: 18, damping: 52, mass: 2.0 });

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
   *
   * All motion values reduced by ~15% for luxury restraint.
   */
  //                              Hero  Vision Mater. Intel. Vent.  Proc.  Impact Contact
  const scale      = useTransform(pFast, STOPS, [1.03, 1.06, 1.09, 1.10, 1.08, 1.09, 1.07, 1.12]);
  const translateY = useTransform(pFast, STOPS, [   0,  -12,   -7,  -19,  -14,  -24,  -17,  -31]);
  const rotate     = useTransform(pFast, STOPS, [   0, -0.34, 0.26, -0.17, 0.34, -0.26, 0.17, -0.43]);
  const blurPx     = useTransform(pFast, STOPS, [ 0.17, 1.19, 0.51, 0.77, 1.53, 1.28, 1.87, 1.70]);
  const brightness = useTransform(pFast, STOPS, [0.89, 0.66, 0.80, 0.75, 0.60, 0.63, 0.70, 0.51]);
  const contrast   = useTransform(pFast, STOPS, [1.06, 1.03, 1.11, 1.09, 1.14, 1.06, 0.99, 1.08]);
  const saturate   = useTransform(pFast, STOPS, [0.90, 0.75, 0.92, 0.97, 0.72, 0.77, 0.82, 0.63]);
  const videoOpacity = useTransform(pFast, STOPS, [0.90, 0.74, 0.85, 0.81, 0.71, 0.74, 0.76, 0.63]);

  const videoFilter = useTransform(
    [blurPx, brightness, contrast, saturate] as never,
    ([b, br, ct, sa]: number[]) =>
      `blur(${b.toFixed(2)}px) brightness(${br.toFixed(2)}) contrast(${ct.toFixed(2)}) saturate(${sa.toFixed(2)})`,
  );

  /* ---------- Darkening / readability overlay — slower, deeper ---------- */
  const darkOpacity = useTransform(pSlow, STOPS, [0.31, 0.46, 0.37, 0.41, 0.54, 0.49, 0.46, 0.61]);

  /* ---------- Atmospheric haze — drifts gently upward with heavy lag ---------- */
  const hazeOpacity = useTransform(pSlow, STOPS, [0.16, 0.29, 0.22, 0.24, 0.22, 0.24, 0.33, 0.28]);
  const hazeY       = useTransform(pSlow, [0, 1], [0, -60]);

  /* ---------- Conductive cyan glow — softer, more restrained ---------- */
  const glowOpacity = useTransform(pSlow, STOPS, [0.06, 0.09, 0.15, 0.22, 0.10, 0.09, 0.10, 0.08]);
  const glowScale   = useTransform(pSlow, STOPS, [1.01, 1.05, 1.10, 1.16, 1.06, 1.04, 1.08, 1.03]);

  /* ---------- Vignette depth — deeper for cinematic immersion ---------- */
  const vignetteOpacity = useTransform(pSlow, STOPS, [0.54, 0.73, 0.65, 0.69, 0.82, 0.76, 0.71, 0.91]);

  /* ---------- Foreground particle parallax — heavy atmospheric lag ---------- */
  const particleY = useTransform(pSlow, [0, 1], [0, -77]);
  const particleOpacity = useTransform(pSlow, STOPS, [0.83, 0.70, 0.96, 0.92, 0.58, 0.66, 0.75, 0.41]);

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
        <div className="absolute inset-0 mix-blend-color bg-[linear-gradient(135deg,oklch(0.12_0.02_240)_0%,oklch(0.15_0.04_220)_55%,oklch(0.13_0.03_255)_100%)] opacity-55" />
        {/* Tonal crush — lift shadows into graphite */}
        <div className="absolute inset-0 mix-blend-multiply bg-[#0a0d14]/60" />
      </motion.div>

      {/* Section-reactive darkening */}
      <motion.div
        className="absolute inset-0 bg-[#03050a]"
        style={{ opacity: darkOpacity }}
      />

      {/* Layered atmospheric haze — slow drifting fog, softer gradients */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ opacity: hazeOpacity, y: hazeY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,oklch(0.30_0.06_240/0.38),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,oklch(0.26_0.05_230/0.30),transparent_65%)]" />
      </motion.div>

      {/* Conductive glow — breathes wider through Intelligence, softer intensity */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform"
        style={{ opacity: glowOpacity, scale: glowScale }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.55_0.16_220/0.45),transparent_60%)]" />
      </motion.div>

      {/* Foreground molecular particle drift — softer, more atmospheric */}
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
              opacity: 0.24,
              filter: "blur(1.4px)",
              boxShadow: "0 0 4px oklch(0.7 0.08 220 / 0.22)",
              animation: `atmosDrift ${pt.dur}s ease-in-out ${pt.delay}s infinite alternate`,
            }}
          />
        ))}
      </motion.div>

      {/* Cinematic vignette — deeper edge falloff */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#02030a_100%)]"
        style={{ opacity: vignetteOpacity }}
      />

      {/* Letterbox gradients — deeper cinematic bars */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02030a]/95 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#02030a]/95 to-transparent" />

      {/* Procedural grain — more restrained */}
      <div
        className="absolute inset-0 opacity-[0.028] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0%   { transform: translate3d(0, 0, 1px); opacity: 0.15; }
          50%  { transform: translate3d(5px, -9px, 1px); opacity: 0.30; }
          100% { transform: translate3d(-3px, -17px, 1px); opacity: 0.19; }
        }
      `}</style>
    </div>
  );
}
