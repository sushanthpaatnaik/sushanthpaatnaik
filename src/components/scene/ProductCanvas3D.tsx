import { Canvas, useFrame } from "@react-three/fiber";
import {
  useTexture,
  ContactShadows,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Real 3D bottle product viewer.
 *
 * Instead of a tilted plane, we reconstruct an actual bottle:
 *   - LatheGeometry body (real silhouette: base → body → shoulder → neck)
 *   - Cylinder cap with bevel ring
 *   - A curved label cylinder (thetaLength ~ 210°) wraps the product
 *     cutout texture around the front of the bottle as a real sticker.
 *   - PBR materials + HDR Environment → physically correct reflections
 *   - OrbitControls drag-to-rotate with damping
 */

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const u = () => setR(m.matches);
    u();
    m.addEventListener?.("change", u);
    return () => m.removeEventListener?.("change", u);
  }, []);
  return r;
}

/* ---------- Bottle silhouette via LatheGeometry ---------- */
function useBottleProfile(featured: boolean) {
  return useMemo(() => {
    // (x = radius, y = height). Bottom at y=0, top at top of cap.
    const R = featured ? 0.78 : 0.7; // body radius
    const neckR = R * 0.42;
    const capR = R * 0.5;
    const bodyH = featured ? 2.4 : 2.2;
    const shoulderH = 0.35;
    const neckH = 0.32;
    const capH = 0.42;

    const profile: [number, number][] = [
      [0.001, 0],
      [R * 0.55, 0],
      [R * 0.92, 0.04],
      [R, 0.12],
      [R, bodyH],
      [R * 0.98, bodyH + 0.08],
      [R * 0.85, bodyH + shoulderH * 0.55],
      [neckR * 1.15, bodyH + shoulderH],
      [neckR, bodyH + shoulderH + 0.05],
      [neckR, bodyH + shoulderH + neckH],
      [capR, bodyH + shoulderH + neckH + 0.02],
      [capR, bodyH + shoulderH + neckH + capH - 0.05],
      [capR * 0.92, bodyH + shoulderH + neckH + capH],
      [0.001, bodyH + shoulderH + neckH + capH],
    ];
    const points = profile.map(([x, y]) => new THREE.Vector2(x, y));
    const totalH = bodyH + shoulderH + neckH + capH;
    return {
      points,
      R,
      bodyH,
      capStartY: bodyH + shoulderH + neckH,
      totalH,
    };
  }, [featured]);
}

/* ---------- The bottle ---------- */
function Bottle({
  src,
  autoSpeed = 0.18,
  cursorPull = 0,
  restY = 0.32,
  featured = false,
  interactive = false,
}: {
  src: string;
  autoSpeed?: number;
  cursorPull?: number;
  restY?: number;
  featured?: boolean;
  interactive?: boolean;
}) {
  const label = useTexture(src);
  useEffect(() => {
    label.anisotropy = 16;
    label.colorSpace = THREE.SRGBColorSpace;
    label.wrapS = THREE.ClampToEdgeWrapping;
    label.wrapT = THREE.ClampToEdgeWrapping;
    label.needsUpdate = true;
  }, [label]);

  const { points, R, bodyH, totalH } = useBottleProfile(featured);

  const bodyGeo = useMemo(
    () => new THREE.LatheGeometry(points, 96),
    [points],
  );

  // Label arc: a partial open cylinder wrapping the front ~210° of the body
  const labelArc = Math.PI * 1.17; // ~210°
  const labelHeight = bodyH * 0.78;
  const labelY = bodyH * 0.45;
  const labelGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(
      R * 1.005,
      R * 1.005,
      labelHeight,
      96,
      1,
      true,
      -labelArc / 2,
      labelArc,
    );
    return g;
  }, [R, labelHeight, labelArc]);

  // Alpha mask: fade label edges so the wrap looks like a real sticker
  // (no harsh seam where the print stops). Built once per session.
  const alphaMap = useMemo(() => {
    const w = 256;
    const h = 64;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#000");
    grad.addColorStop(0.08, "#fff");
    grad.addColorStop(0.92, "#fff");
    grad.addColorStop(1, "#000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);

  const group = useRef<THREE.Group>(null);
  const t = useRef(Math.random() * 10);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g || interactive) return;
    t.current += dt;
    const sway = Math.sin(t.current * autoSpeed) * 0.55;
    const target = restY + sway + cursorPull;
    g.rotation.y += (target - g.rotation.y) * 0.06;
  });

  // Center the bottle vertically on origin
  const yOffset = -totalH / 2;

  return (
    <group ref={group} rotation={[0, interactive ? 0 : restY, 0]} position={[0, yOffset, 0]}>
      {/* Bottle body — dark graphite PBR plastic */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#1a1d22"
          metalness={0.35}
          roughness={0.42}
          clearcoat={0.55}
          clearcoatRoughness={0.28}
          envMapIntensity={1.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label sticker — wraps around the front */}
      <mesh geometry={labelGeo} position={[0, labelY, 0]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial
          map={label}
          alphaMap={alphaMap}
          transparent
          metalness={0.12}
          roughness={0.55}
          clearcoat={0.35}
          clearcoatRoughness={0.42}
          envMapIntensity={0.75}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---------- Lighting rig ---------- */
function StudioLights({ featured = false }: { featured?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.18} color="#8da4bf" />
      <directionalLight
        position={[-3.2, 3.4, 4]}
        intensity={featured ? 1.3 : 1.05}
        color="#dceaff"
        castShadow
      />
      <directionalLight
        position={[3.5, 1.2, -2.5]}
        intensity={featured ? 1.0 : 0.8}
        color="#ffd4a0"
      />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#5fa0d0" />
    </>
  );
}

interface CardProps {
  src: string;
  alt: string;
  featured?: boolean;
  className?: string;
}

/** Card-mode 3D viewer — lazy mounted when in viewport. */
export function ProductCanvas3D({ src, alt, featured = false, className = "" }: CardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pull, setPull] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    setPull(Math.max(-1, Math.min(1, nx)) * 0.4);
  };
  const onLeave = () => setPull(0);

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={alt}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, oklch(0.16 0.018 232 / 0.55), transparent 75%)",
        }}
      />
      {inView && (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.2, 5.6], fov: 26 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={reduced ? "demand" : "always"}
          shadows
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <StudioLights featured={featured} />
            <Environment preset="warehouse" environmentIntensity={0.45} />
            <Bottle
              src={src}
              autoSpeed={reduced ? 0 : featured ? 0.16 : 0.22}
              cursorPull={pull}
              restY={0.28}
              featured={featured}
            />
            <ContactShadows
              position={[0, featured ? -1.7 : -1.55, 0]}
              opacity={0.6}
              scale={5}
              blur={2.8}
              far={2.5}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

/** Modal-mode 3D viewer — drag-to-rotate, OrbitControls. */
export function ProductCanvas3DModal({
  src,
  alt,
  featured = false,
}: {
  src: string;
  alt: string;
  featured?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 5.2], fov: 28 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      style={{ background: "transparent" }}
      aria-label={alt}
    >
      <Suspense fallback={null}>
        <StudioLights featured={featured} />
        <Environment preset="warehouse" environmentIntensity={0.55} />
        <Bottle src={src} restY={0} featured={featured} interactive />
        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.7}
          scale={6}
          blur={3}
          far={3}
          color="#000000"
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
          rotateSpeed={0.7}
          dampingFactor={0.08}
          enableDamping
        />
      </Suspense>
    </Canvas>
  );
}
