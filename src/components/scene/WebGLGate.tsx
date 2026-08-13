import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Guards the page's one WebGL surface.
 *
 * `GrapheneVolumetric` builds a react-three-fiber renderer *during render*.
 * `<Suspense>` does not catch errors — only an error boundary does — so on a
 * browser with WebGL disabled, a blocklisted driver, or one already at its
 * context limit, the failure propagates straight past the Suspense wrapper and
 * unmounts the React tree. The graphene lattice is atmosphere layered behind
 * the cinematic canvas; losing it should cost the page a background effect,
 * never its content or its scrolling.
 */

/**
 * One-shot capability probe.
 *
 * Cached deliberately: a failed probe must not be retried on every render, and
 * each attempt allocates a real GPU context. The throwaway context is released
 * immediately via WEBGL_lose_context so probing does not itself consume one of
 * the handful of contexts a browser will hand out.
 */
let supported: boolean | null = null;

export function webglSupported(): boolean {
  if (supported !== null) return supported;
  if (typeof document === "undefined") return false; // SSR
  try {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") ??
      probe.getContext("webgl")) as WebGLRenderingContext | null;
    supported = gl !== null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
}

export class WebGLBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Reported, not rethrown, and never retried — a context that could not be
    // created will not succeed a moment later, and a retry loop would spend
    // the frame budget the rest of the page needs.
    console.warn("WebGL layer disabled:", error.message, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
