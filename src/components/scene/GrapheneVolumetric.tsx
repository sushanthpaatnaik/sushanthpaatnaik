import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import GrapheneAtmosphere from "./GrapheneAtmosphere";

interface Props {
  /** Page scroll progress 0..1, supplied by the parent. */
  scrollProgress: React.MutableRefObject<number>;
  /** Normalized mouse position [-1, 1] for parallax drift. */
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

function range(p: number, a: number, b: number, fadeIn = 0.08, fadeOut = 0.08) {
  if (p < a - fadeIn || p > b + fadeOut) return 0;
  if (p < a) return (p - (a - fadeIn)) / fadeIn;
  if (p > b) return 1 - (p - b) / fadeOut;
  return 1;
}

/** Parallax + depth camera that breathes with the cursor and scroll. */
function ParallaxCamera({ scrollProgress, mouse }: Props) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 9), []);

  useFrame((_, dt) => {
    const p = scrollProgress.current;
    // Slow z drift as the user scrolls through the graphene chapters.
    target.set(mouse.current.x * 0.6, -mouse.current.y * 0.4, 9 - p * 1.2);
    camera.position.lerp(target, 1 - Math.pow(0.0025, dt));
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Drives composer-wide opacity by writing a scroll-derived alpha onto the canvas. */
function CanvasOpacity({ scrollProgress }: { scrollProgress: Props["scrollProgress"] }) {
  const { gl } = useThree();
  const wrapper = gl.domElement.parentElement as HTMLDivElement | null;

  useFrame(() => {
    if (!wrapper) return;
    const p = scrollProgress.current;
    // Visible across chapters 02 → 06, peak around chapter 03 (Carbon Intelligence).
    const v = Math.max(range(p, 0.14, 0.82, 0.1, 0.12), range(p, 0.28, 0.45, 0.05, 0.1));
    wrapper.style.opacity = String(0.55 * v);
  });
  return null;
}

function GrapheneCanvas({ scrollProgress, mouse }: Props) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 9], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#06070a", 6, 24]} />

        <ambientLight intensity={0.18} />
        <directionalLight position={[6, 4, 5]} intensity={0.45} color="#9bb8d8" />
        <pointLight position={[-5, -2, -2]} intensity={1.1} distance={18} color="#3FA9F5" />
        <pointLight position={[4, 3, 1]} intensity={0.6} distance={16} color="#7CCBFF" />

        <GrapheneAtmosphere scrollProgress={scrollProgress} />
        <ParallaxCamera scrollProgress={scrollProgress} mouse={mouse} />
        <CanvasOpacity scrollProgress={scrollProgress} />

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.24} luminanceThreshold={0.45} luminanceSmoothing={0.94} />
          <DepthOfField focusDistance={0.02} focalLength={0.045} bokehScale={1.4} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

/**
 * Volumetric graphene lattice layer. Lives between the scene-image background
 * and the foreground content so molecules feel physically present in 3D —
 * with parallax, depth of field, and bloom doing the cinematic work.
 *
 * Gracefully no-ops when:
 * - prefers-reduced-motion is set
 * - the device is small (mobile)
 * - WebGL fails to initialize
 */
export default function GrapheneVolumetric(props: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(wide && !reduced);
  }, []);

  if (!enabled) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] opacity-0 transition-opacity duration-[1200ms]"
      aria-hidden
    >
      <GrapheneCanvas {...props} />
    </div>
  );
}
