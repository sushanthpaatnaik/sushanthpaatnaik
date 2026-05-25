"use client";

import { useEffect, useMemo } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * Compute a "chapter phase" value derived from the **actual** vertical
 * position of each chapter section in the DOM — not uniform scroll progress.
 *
 * Phase semantics:
 *   - integer N  →  the viewport focal line is at the center of chapter N
 *   - N + 0.5    →  the focal line is exactly halfway between chapter N and N+1
 *
 * This guarantees the foreground content section and the background scene
 * stay synchronised, regardless of per-section height differences.
 */
export function useChapterPhase(ids: readonly string[]): MotionValue<number> {
  const phase = useMotionValue(0);
  const key = useMemo(() => ids.join("|"), [ids]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idList = key.split("|");
    let raf = 0;
    let centers: number[] = [];

    const measure = () => {
      centers = idList.map((id) => {
        const el = document.getElementById(id);
        if (!el) return Number.NaN;
        const rect = el.getBoundingClientRect();
        return window.scrollY + rect.top + rect.height * 0.5;
      });
    };

    const compute = () => {
      if (!centers.length || centers.some(Number.isNaN)) measure();
      if (!centers.length) return;
      // Focal line at exact viewport center — the section the reader's eye
      // is on owns the frame.
      const focal = window.scrollY + window.innerHeight * 0.5;
      const last = centers.length - 1;
      let raw = 0;
      if (focal <= centers[0]) raw = 0;
      else if (focal >= centers[last]) raw = last;
      else {
        for (let i = 0; i < last; i++) {
          const a = centers[i];
          const b = centers[i + 1];
          if (focal >= a && focal <= b) {
            raw = i + (focal - a) / Math.max(1, b - a);
            break;
          }
        }
      }
      // Re-shape the linear position into a snap-biased curve: the phase
      // stays close to the active integer for most of the section, and
      // only crosses rapidly through the boundary midline. This eliminates
      // the "two scenes visible at once for half the scroll" feel while
      // still preserving a short crossfade.
      const base = Math.floor(raw);
      const f = raw - base;
      // Custom curve: flat at 0, steep near 0.5, flat at 1.
      // 6t^5 - 15t^4 + 10t^3 (smootherstep) is too gentle; sharpen it.
      const sharp = (() => {
        // remap 0..1 with a steep S that snaps before/after 0.5
        const k = 2.4; // steepness
        const x = (f - 0.5) * k;
        const s = 1 / (1 + Math.exp(-x));
        // normalise so f=0→0, f=1→1
        const s0 = 1 / (1 + Math.exp(k * 0.5));
        const s1 = 1 / (1 + Math.exp(-k * 0.5));
        return (s - s0) / (s1 - s0);
      })();
      phase.set(base + sharp);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    const onResize = () => {
      measure();
      compute();
    };

    // Initial + a couple of deferred passes to catch font/image layout shifts.
    measure();
    compute();
    const t1 = window.setTimeout(onResize, 120);
    const t2 = window.setTimeout(onResize, 600);
    const t3 = window.setTimeout(onResize, 1600);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("load", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("load", onResize);
    };
  }, [key, phase]);

  return phase;
}

export const HOME_CHAPTER_IDS = [
  "spark",
  "founder",
  "carbon-intelligence",
  "industrial",
  "recognition",
  "ecosystem",
  "future",
] as const;
