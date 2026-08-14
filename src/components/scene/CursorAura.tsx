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
    let wx = NaN, wy = NaN, wo = NaN;   // last values actually written to the DOM

    /* This is a 640px mix-blend-screen layer. A blend layer cannot be
       composited from its own texture alone — the browser has to re-blend it
       against whatever is underneath — so every style write here costs a
       recomposite of that region, on top of whatever else the frame is doing.
       During a chapter hand-over that is the canvas uploading a new bitmap and
       the chapter layers cross-fading, all at once, in the 640px around the
       pointer. Reported as the area near the mouse shaking through transitions.

       The loop used to write transform and opacity unconditionally on every
       frame and never stop, because a lerp approaches its target
       asymptotically and never arrives. Two changes: only write when a value
       has moved enough to change a pixel, and park the loop entirely once the
       aura has settled and faded out, restarting it on the next pointermove. */
    const loop = () => {
      // Heavy lerp so the aura trails the cursor like a slow film light.
      x += (tx - x) * 0.045;
      y += (ty - y) * 0.045;
      active += (targetActive - active) * 0.04;

      if (!(Math.abs(x - wx) < 0.5 && Math.abs(y - wy) < 0.5)) {
        wx = x; wy = y;
        el.style.transform = `translate3d(${Math.round(x) - 320}px, ${Math.round(y) - 320}px, 0)`;
      }
      const o = active * 0.85;
      if (!(Math.abs(o - wo) < 0.004)) {
        wo = o;
        el.style.opacity = o.toFixed(3);
      }

      // Settled and invisible — stop burning frames until the pointer moves.
      if (targetActive === 0 && active < 0.004 && Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) {
        if (wo !== 0) { wo = 0; el.style.opacity = "0"; }
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    kick();

    window.addEventListener("pointermove", (e) => { onMove(e as PointerEvent); kick(); }, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove as EventListener);
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
