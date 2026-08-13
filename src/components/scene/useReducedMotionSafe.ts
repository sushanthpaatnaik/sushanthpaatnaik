import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `useReducedMotion`, but safe to branch on during hydration.
 *
 * framer-motion's hook reports the real preference on the client's very first
 * render, while the server always rendered with it off. Anything that branches
 * on it during render therefore produces two different trees, and React throws
 * "Hydration failed because the server rendered HTML didn't match the client…
 * this tree will be regenerated on the client" and re-renders the subtree from
 * scratch.
 *
 * On this page both branches were structural, not cosmetic: CanvasLayer swaps
 * the whole `<canvas>` for a static `<img>`, and ScrollSections drives its y
 * offsets and Origin beat opacities from it. So the only visitors who hit a
 * full remount of the cinematic stage were the ones who had asked their
 * operating system for *less* work on screen.
 *
 * Returning false until mounted makes the first client render match the
 * server's byte for byte; the preference applies on the next frame, before
 * anything has had a chance to move.
 */
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}
