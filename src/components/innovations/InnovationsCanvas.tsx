import { Canvas } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Single WebGL context shared by every InnovationCard3D on the page.
 * Each card declares a `<View track={ref}>` portal that draws into the
 * shared canvas at the card's screen rectangle. This gives us up to 23
 * independent 3D scenes without 23 GPU contexts.
 */

interface CanvasCtx {
  enabled: boolean;
}
const Ctx = createContext<CanvasCtx>({ enabled: false });
export const useInnovationsCanvas = () => useContext(Ctx);

interface Props {
  children: ReactNode;
}

export default function InnovationsCanvasHost({ children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 640px)").matches;
    setEnabled(wide && !reduced);
  }, []);

  return (
    <Ctx.Provider value={{ enabled }}>
      <div ref={hostRef} className="relative">
        {children}
        {enabled && (
          <Canvas
            eventSource={hostRef as unknown as React.RefObject<HTMLElement>}
            eventPrefix="client"
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            className="!pointer-events-none !fixed !inset-0 !z-[3]"
            style={{ background: "transparent" }}
          >
            {/* Shared cinematic lighting — every <View> uses these */}
            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 5, 6]} intensity={0.85} color="#cfd8e8" />
            <pointLight position={[-5, -2, -3]} intensity={0.6} distance={18} color="#3FA9F5" />
            <pointLight position={[3, 4, 2]} intensity={0.45} distance={14} color="#e8c878" />
            <View.Port />
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.32} luminanceThreshold={0.55} luminanceSmoothing={0.92} />
            </EffectComposer>
          </Canvas>
        )}
      </div>
    </Ctx.Provider>
  );
}

/** Single <View> wrapper that renders an archetype scene tracked to a DOM ref. */
export function InnovationView({
  trackRef,
  children,
}: {
  trackRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={32} />
      {children}
    </View>
  );
}
