"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  scrollProgress: React.MutableRefObject<number>;
}

/* ---------- Hex lattice plane (graphene sheet) ---------- */
function HexLattice({
  z,
  scale = 1,
  color = "#5b8def",
  opacity = 0.22,
  scrollProgress,
  speed = 1,
}: {
  z: number;
  scale?: number;
  color?: string;
  opacity?: number;
  scrollProgress: Props["scrollProgress"];
  speed?: number;
}) {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    // Build a hexagonal lattice as line segments
    const positions: number[] = [];
    const cols = 22;
    const rows = 26;
    const r = 0.42; // hex radius
    const w = Math.sqrt(3) * r;
    const h = 1.5 * r;
    // Hex vertices (pointy-top)
    const hex = (cx: number, cy: number) => {
      const verts: THREE.Vector3[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        verts.push(new THREE.Vector3(cx + r * Math.cos(a), cy + r * Math.sin(a), 0));
      }
      for (let i = 0; i < 6; i++) {
        const a = verts[i];
        const b = verts[(i + 1) % 6];
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    };
    for (let row = -rows / 2; row < rows / 2; row++) {
      for (let col = -cols / 2; col < cols / 2; col++) {
        const offset = row % 2 === 0 ? 0 : w / 2;
        hex(col * w + offset, row * h);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const p = scrollProgress.current;
    // Slow cinematic drift, scroll modulates rotation slightly
    ref.current.rotation.z += dt * 0.012 * speed;
    ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.05 * speed) * 0.3;
    ref.current.position.y = -p * 6 * speed + Math.cos(state.clock.elapsedTime * 0.04) * 0.2;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    // Subtle pulse on conductive glow
    mat.opacity = opacity * (0.85 + Math.sin(state.clock.elapsedTime * 0.4 + z) * 0.15);
  });

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, 0, z]} scale={scale} rotation={[0, 0, 0]}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ---------- Molecular particle drift ---------- */
function MolecularDrift({ scrollProgress }: Props) {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = -2 - Math.random() * 14;
      sd[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, seeds: sd };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollProgress.current;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      arr[i * 3] += Math.sin(t * 0.08 + s) * 0.0015;
      arr[i * 3 + 1] += Math.cos(t * 0.06 + s * 1.3) * 0.0012 - p * 0.001;
      // wrap
      if (arr[i * 3 + 1] < -12) arr[i * 3 + 1] = 12;
      if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = -12;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = p * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#8fb4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Graphene atmosphere (composed) ---------- */
export default function GrapheneAtmosphere({ scrollProgress }: Props) {
  return (
    <group>
      {/* Deep background sheet */}
      <HexLattice z={-12} scale={1.6} color="#2a3a6a" opacity={0.12} speed={0.4} scrollProgress={scrollProgress} />
      {/* Mid sheet — conductive electric blue */}
      <HexLattice z={-7} scale={1.1} color="#4f7ad8" opacity={0.18} speed={0.7} scrollProgress={scrollProgress} />
      {/* Foreground sheet — soft */}
      <HexLattice z={-3.5} scale={0.85} color="#7da3ff" opacity={0.1} speed={1} scrollProgress={scrollProgress} />
      {/* Molecular drift */}
      <MolecularDrift scrollProgress={scrollProgress} />
    </group>
  );
}
