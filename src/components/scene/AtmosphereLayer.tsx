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
  const pFast = useSpring(scrollYProgress, { stiffness: 27, damping: 44, mass: 1.2 });
  const pSlow = useSpring(scrollYProgress, { stiffness: 15, damping: 54, mass: 2.0 });

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
   * Motion intensity reduced 15%. Softness and atmospheric depth increased
   * for emotional immersion and luxury restraint.
   */
  //                              Hero  Vision Mater. Intel. Vent.  Proc.  Impact Contact
  const scale      = useTransform(pFast, STOPS, [1.02, 1.06, 1.09, 1.11, 1.08, 1.09, 1.05, 1.13]);
  const translateY = useTransform(pFast, STOPS, [   0,  -14,   -7,  -22,  -15,  -27,  -19,  -36]);
  const rotate     = useTransform(pFast, STOPS, [   0, -0.38, 0.29, -0.19, 0.38, -0.29, 0.19, -0.49]);
  const blurPx     = useTransform(pFast, STOPS, [ 0.13, 1.58, 0.47, 0.89, 2.00, 1.63, 2.42, 2.21]);
  const brightness = useTransform(pFast, STOPS, [0.93, 0.64, 0.84, 0.79, 0.57, 0.62, 0.69, 0.49]);
  const contrast   = useTransform(pFast, STOPS, [1.07, 1.00, 1.15, 1.12, 1.18, 1.05, 0.95, 1.11]);
  const saturate   = useTransform(pFast, STOPS, [0.93, 0.72, 0.95, 1.00, 0.68, 0.75, 0.81, 0.57]);
  const videoOpacity = useTransform(pFast, STOPS, [0.95, 0.72, 0.89, 0.85, 0.68, 0.72, 0.76, 0.60]);

  const videoFilter = useTransform(
    [blurPx, brightness, contrast, saturate] as never,
    ([b, br, ct, sa]: number[]) =>
      `blur(${b.toFixed(2)}px) brightness(${br.toFixed(2)}) contrast(${ct.toFixed(2)}) saturate(${sa.toFixed(2)})`,
  );

  /* ---------- Darkening / readability overlay — softer, more restrained ---------- */
  const darkOpacity = useTransform(pSlow, STOPS, [0.23, 0.44, 0.30, 0.37, 0.53, 0.46, 0.42, 0.60]);

  /* ---------- Atmospheric haze — deeper, slower, more immersive ---------- */
  const hazeOpacity = useTransform(pSlow, STOPS, [0.13, 0.37, 0.22, 0.29, 0.24, 0.29, 0.42, 0.33]);
  const hazeY       = useTransform(pSlow, [0, 1], [0, -77]);

  /* ---------- Conductive cyan glow — softer, breathing with the story ---------- */
  const glowOpacity = useTransform(pSlow, STOPS, [0.05, 0.11, 0.19, 0.30, 0.11, 0.09, 0.11, 0.08]);
  const glowScale   = useTransform(pSlow, STOPS, [1.00, 1.05, 1.11, 1.17, 1.05, 1.03, 1.07, 1.02]);

  /* ---------- Vignette depth — deeper cinematic immersion ---------- */
  const vignetteOpacity = useTransform(pSlow, STOPS, [0.51, 0.81, 0.66, 0.74, 0.93, 0.83, 0.76, 1.00]);

  /* ---------- Foreground particle parallax — heavy atmospheric lag ---------- */
  const particleY = useTransform(pSlow, [0, 1], [0, -94]);
  const particleOpacity = useTransform(pSlow, STOPS, [0.85, 0.66, 0.98, 0.94, 0.52, 0.62, 0.73, 0.36]);

  /* ---------- Per-section gradient SCENES — crossfade between chapters ----------
   * Each section owns a distinct color atmosphere. Opacity peaks at its stop and
   * fades to 0 in adjacent sections, so scrolling drives a cinematic crossfade
   * between named "scenes" rather than a continuous wallpaper.
   */
  const peak = (i: number): number[] =>
    STOPS.map((_, j) => (i === j ? 0.85 : Math.abs(i - j) === 1 ? 0.12 : 0));

  const scene0 = useTransform(pSlow, STOPS, peak(0)); // Origin — deep graphite
  const scene1 = useTransform(pSlow, STOPS, peak(1)); // Vision — twilight indigo
  const scene2 = useTransform(pSlow, STOPS, peak(2)); // Graphene — graphite + cyan
  const scene3 = useTransform(pSlow, STOPS, peak(3)); // Intelligence — electric cyan
  const scene4 = useTransform(pSlow, STOPS, peak(4)); // Ventures — deep cobalt
  const scene5 = useTransform(pSlow, STOPS, peak(5)); // Process — warm steel
  const scene6 = useTransform(pSlow, STOPS, peak(6)); // Impact — emerald drift
  const scene7 = useTransform(pSlow, STOPS, peak(7)); // Contact — obsidian stillness

  /* ---------- Aurora glow — sweeps position across the scene timeline ---------- */
  const auroraX = useTransform(pSlow, [0, 1], ["20%", "80%"]);
  const auroraY = useTransform(pSlow, [0, 1], ["30%", "70%"]);
  const auroraOpacity = useTransform(pSlow, STOPS, [0.10, 0.18, 0.26, 0.34, 0.20, 0.16, 0.22, 0.12]);

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
        <div className="absolute inset-0 mix-blend-color bg-[linear-gradient(135deg,oklch(0.12_0.02_240)_0%,oklch(0.15_0.04_220)_55%,oklch(0.13_0.03_255)_100%)] opacity-48" />
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

      {/* ===== Per-section gradient SCENES — crossfade between chapters ===== */}
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(ellipse_at_50%_55%,oklch(0.22_0.03_250/0.9),transparent_70%)]"
        style={{ opacity: scene0 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(160deg,oklch(0.18_0.08_275/0.85)_0%,oklch(0.14_0.06_255/0.7)_60%,transparent_100%)]"
        style={{ opacity: scene1 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_30%_60%,oklch(0.35_0.10_210/0.55),transparent_65%)]"
        style={{ opacity: scene2 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_55%_50%,oklch(0.55_0.18_215/0.65),oklch(0.30_0.12_230/0.3)_45%,transparent_75%)]"
        style={{ opacity: scene3 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light bg-[linear-gradient(200deg,oklch(0.20_0.10_250/0.85),oklch(0.10_0.05_240/0.6)_70%,transparent_100%)]"
        style={{ opacity: scene4 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-overlay bg-[radial-gradient(ellipse_at_60%_45%,oklch(0.32_0.04_50/0.45),transparent_65%)]"
        style={{ opacity: scene5 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_40%_55%,oklch(0.45_0.12_165/0.45),transparent_70%)]"
        style={{ opacity: scene6 }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,oklch(0.06_0.02_250/0.85),#02030a_85%)]"
        style={{ opacity: scene7 }}
      />

      {/* Aurora glow — sweeps across the scene timeline */}
      <motion.div
        className="absolute inset-0 mix-blend-screen will-change-transform pointer-events-none"
        style={{ opacity: auroraOpacity }}
      >
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[120px] bg-[radial-gradient(circle,oklch(0.6_0.18_215/0.5),transparent_70%)]"
          style={{ left: auroraX, top: auroraY, x: "-50%", y: "-50%" }}
        />
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
              opacity: 0.20,
              filter: "blur(1.6px)",
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
        className="absolute inset-0 opacity-[0.034] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.7  0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style>{`
        @keyframes atmosDrift {
          0%   { transform: translate3d(0, 0, 1px); opacity: 0.15; }
          50%  { transform: translate3d(4px, -8px, 1px); opacity: 0.28; }
          100% { transform: translate3d(-3px, -14px, 1px); opacity: 0.19; }
        }
      `}</style>
    </div>
  );
}
