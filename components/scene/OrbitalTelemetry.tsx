"use client";

/**
 * OrbitalTelemetry — a near-imperceptible "living systems" layer.
 *
 * Three ultra-slow, low-opacity passes that make the homepage feel like a
 * cinematic operating system rather than a static page:
 *  1. A vast concentric orbital halo that slowly rotates (telemetry sweep).
 *  2. A faint cinematic scan band that drifts top→bottom over ~60s.
 *  3. A soft concentric breath ring centered on the Earth horizon.
 *
 * Everything is fixed, pointer-events-none, mix-blend-screen, GPU-only
 * transforms. Reduced-motion users see the static composition without
 * animation via the global @media (prefers-reduced-motion: reduce) rule
 * which neutralizes animation-duration in styles.css.
 */
export default function OrbitalTelemetry() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[4] overflow-hidden mix-blend-screen"
      style={{ contain: "strict" }}
    >
      {/* Slow rotating orbital halo — barely visible telemetry sweep */}
      <div
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: "180vmax",
          height: "180vmax",
          animation: "orbital-sweep 320s linear infinite",
          opacity: 0.45,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, oklch(0.7 0.06 232 / 0.05) 28deg, transparent 56deg, transparent 360deg)",
            maskImage:
              "radial-gradient(circle at center, transparent 38%, #000 42%, #000 58%, transparent 62%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, transparent 38%, #000 42%, #000 58%, transparent 62%)",
          }}
        />
      </div>

      {/* Counter-rotating inner telemetry trace — even slower */}
      <div
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: "120vmax",
          height: "120vmax",
          animation: "orbital-sweep 540s linear infinite reverse",
          opacity: 0.35,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 180deg, transparent 0deg, oklch(0.62 0.05 232 / 0.04) 20deg, transparent 42deg, transparent 360deg)",
            maskImage:
              "radial-gradient(circle at center, transparent 44%, #000 47%, #000 53%, transparent 57%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, transparent 44%, #000 47%, #000 53%, transparent 57%)",
          }}
        />
      </div>

      {/* Cinematic scan band — soft horizontal sheet drifting top → bottom */}
      <div
        className="absolute left-0 right-0 h-[28vh] will-change-transform"
        style={{
          top: 0,
          background:
            "linear-gradient(180deg, transparent, oklch(0.62 0.04 232 / 0.045) 45%, oklch(0.7 0.05 232 / 0.06) 50%, oklch(0.62 0.04 232 / 0.045) 55%, transparent)",
          filter: "blur(22px)",
          animation: "orbital-scan 64s ease-in-out infinite",
        }}
      />

      {/* Concentric breath ring — anchored on Earth horizon */}
      <div
        className="absolute left-1/2 top-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          width: "80vmin",
          height: "80vmin",
          border: "0.5px solid oklch(0.7 0.05 232 / 0.10)",
          boxShadow:
            "0 0 60px oklch(0.62 0.05 232 / 0.05), inset 0 0 80px oklch(0.62 0.05 232 / 0.04)",
          animation: "orbital-breath 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}
