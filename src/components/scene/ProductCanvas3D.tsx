import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Real 3D product viewer using Three.js / R3F.
 *
 * Renders a subtly curved plane textured with the original cutout PNG. The
 * label remains pixel-perfect (it's a texture), but the surface catches real
 * light, has real depth, and rotates with true geometry — no AI re-render,
 * no label drift.
 *
 * Two modes:
 *   - "card": small, lazy-mounted via IntersectionObserver, gentle autorotate,
 *     responds to pointer with a slight turn.
 *   - "modal": full inspection chamber, drag-to-rotate via OrbitControls,
 *     contact shadow, env-style rim lighting.
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

/** Curved label plane — a PlaneGeometry warped into a cylindrical arc. */
function CurvedLabel({
  src,
  autoSpeed = 0.18,
  cursorPull = 0,
  restY = 0.32,
  featured = false,
}: {
  src: string;
  autoSpeed?: number;
  cursorPull?: number;
  restY?: number;
  featured?: boolean;
}) {
  const texture = useTexture(src);
  useEffect(() => {
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const group = useRef<THREE.Group>(null);
  const t = useRef(Math.random() * 10);

  const geometry = useMemo(() => {
    // Aspect approximates bottle silhouette (1 : 1.4 w:h).
    const w = featured ? 2.05 : 1.85;
    const h = featured ? 2.85 : 2.6;
    const geo = new THREE.PlaneGeometry(w, h, 64, 4);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const curve = 0.42;
    const halfW = w / 2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Cosine arc: deepest at center, flat at edges (cylinder front face).
      const z = -curve * (1 - Math.cos((x / halfW) * (Math.PI / 2)));
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [featured]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    t.current += dt;
    const sway = Math.sin(t.current * autoSpeed) * 0.55; // ±31°
    const target = restY + sway + cursorPull;
    g.rotation.y += (target - g.rotation.y) * 0.06;
  });

  return (
    <group ref={group} rotation={[0, restY, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.04}
          metalness={0.18}
          roughness={0.62}
          side={THREE.DoubleSide}
          envMapIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

/** Cinematic studio lighting rig — dark graphite, titanium rim. */
function StudioLights({ featured = false }: { featured?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.32} color="#a8b6c8" />
      {/* Key light — cool, upper-left */}
      <directionalLight
        position={[-3.2, 3.4, 4]}
        intensity={featured ? 1.4 : 1.15}
        color="#dceaff"
      />
      {/* Rim light — warm titanium, behind-right */}
      <directionalLight
        position={[3.5, 1.2, -3]}
        intensity={featured ? 1.1 : 0.85}
        color="#ffd9a8"
      />
      {/* Fill — soft, low */}
      <directionalLight
        position={[0, -2.5, 2.5]}
        intensity={0.35}
        color="#7fa0c8"
      />
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
      {/* Backplate atmosphere — studio depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, oklch(0.16 0.018 232 / 0.55), transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[15%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.55 0.10 220 / 0.18), transparent 65%)",
        }}
      />

      {inView && (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5.2], fov: 28 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={reduced ? "demand" : "always"}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <StudioLights featured={featured} />
            <CurvedLabel
              src={src}
              autoSpeed={reduced ? 0 : featured ? 0.16 : 0.22}
              cursorPull={pull}
              restY={0.28}
              featured={featured}
            />
            {/* Ground contact shadow — sells presence */}
            <ContactShadows
              position={[0, featured ? -1.55 : -1.4, 0]}
              opacity={0.55}
              scale={4}
              blur={2.6}
              far={2}
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
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-label={alt}
    >
      <Suspense fallback={null}>
        <StudioLights featured={featured} />
        <CurvedLabel
          src={src}
          autoSpeed={0}
          cursorPull={0}
          restY={0}
          featured={featured}
        />
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.7}
          scale={5}
          blur={2.8}
          far={2.5}
          color="#000000"
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
          rotateSpeed={0.6}
          dampingFactor={0.08}
          enableDamping
        />
      </Suspense>
    </Canvas>
  );
}
