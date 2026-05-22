import { useEffect, useRef } from "react";

/**
 * A near-invisible volumetric cool light that drifts toward the cursor.
 *
 * Intentionally hidden: ~6% peak luminance, screen-blended, heavily lerped
 * so it trails the pointer with a slow film-grade follow. Disabled on
 * touch / coarse pointers and when prefers-reduced-motion is set.
 *
 * The effect should feel discovered — a faint warmth in the room that
 * happens to follow you, not a cursor follower.
 */
export default function CursorAura() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    const el = ref.current;
    if (!el) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let active = 0; // 0..1 envelope — fades in on first move, out on idle
    let targetActive = 0;
    let idleTimer: number | undefined;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      targetActive = 1;
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        targetActive = 0;
      }, 2200);
    };

    let raf = 0;
    const loop = () => {
      // Heavy lerp so the aura trails the cursor like a slow film light.
      x += (tx - x) * 0.045;
      y += (ty - y) * 0.045;
      active += (targetActive - active) * 0.04;
      el.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`;
      el.style.opacity = String(active * 0.85);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[4] h-[640px] w-[640px] mix-blend-screen opacity-0 will-change-transform"
      style={{
        background:
          "radial-gradient(circle at center, oklch(0.62 0.08 235 / 0.06) 0%, oklch(0.5 0.06 240 / 0.025) 35%, transparent 65%)",
      }}
      ref={ref}
    />
  );
}
