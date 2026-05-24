import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import InnovationObject, { type ObjectKind } from "./InnovationObject";

interface Props {
  kind: ObjectKind;
  /** [-1,1] normalized parallax target, smoothed inside Canvas. */
  parallax: React.MutableRefObject<{ x: number; y: number }>;
  /** active = render frames; otherwise frozen */
  active: boolean;
  /** Slightly larger camera distance for hero/modal. */
  cameraZ?: number;
  intense?: boolean;
}

function ParallaxRig({ parallax }: { parallax: Props["parallax"] }) {
  const { camera } = useThree();
  const cur = useRef({ x: 0, y: 0 });
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.001, dt);
    cur.current.x += (parallax.current.x - cur.current.x) * k;
    cur.current.y += (parallax.current.y - cur.current.y) * k;
    camera.position.x = cur.current.x * 0.45;
    camera.position.y = -cur.current.y * 0.32;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function InnovationCanvas({
  kind,
  parallax,
  active,
  cameraZ = 4.4,
  intense = false,
}: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, cameraZ], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "demand"}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#06070a", 6, 22]} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[4, 5, 6]} intensity={0.85} color="#cfe2ff" />
        <directionalLight position={[-5, -2, 3]} intensity={0.35} color="#3FA9F5" />
        <pointLight position={[2, 3, 2]} intensity={0.5} distance={14} color="#c9a84c" />

        <InnovationObject kind={kind} />
        <ParallaxRig parallax={parallax} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={intense ? 0.42 : 0.22}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.94}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

/** Wrapper that mounts the canvas only when in view + capable device. */
export function InnovationCanvasMount({
  kind,
  className = "",
  fallback,
  intense = false,
  cameraZ,
}: {
  kind: ObjectKind;
  className?: string;
  fallback?: React.ReactNode;
  intense?: boolean;
  cameraZ?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const parallax = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(wide && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "200px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    parallax.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    parallax.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  const onLeave = () => {
    parallax.current.x = 0;
    parallax.current.y = 0;
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? onLeave : undefined}
    >
      {enabled && inView ? (
        <InnovationCanvas
          kind={kind}
          parallax={parallax}
          active={inView}
          intense={intense}
          cameraZ={cameraZ}
        />
      ) : (
        fallback ?? null
      )}
    </div>
  );
}
