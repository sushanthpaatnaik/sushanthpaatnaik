import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  scrollProgress: React.MutableRefObject<number>;
}

function Particles({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.02;
      ref.current.rotation.x += dt * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#9bbcff"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function HeroOrb({ scrollProgress }: SceneProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const p = scrollProgress.current;
    if (mesh.current) {
      mesh.current.rotation.x += dt * 0.15;
      mesh.current.rotation.y += dt * 0.2;
    }
    if (group.current) {
      // Lerp camera-relative position based on scroll
      const targetY = -p * 8;
      const targetZ = p * 4;
      const targetScale = 1 - p * 0.4;
      group.current.position.y += (targetY - group.current.position.y) * 0.06;
      group.current.position.z += (targetZ - group.current.position.z) * 0.06;
      const s = group.current.scale.x + (targetScale - group.current.scale.x) * 0.06;
      group.current.scale.setScalar(Math.max(0.2, s));
      group.current.rotation.z = p * Math.PI * 0.5;
    }
    // gentle camera drift
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.2 + p * 1.5;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.6, 8]} />
          <MeshDistortMaterial
            color="#5b8def"
            roughness={0.15}
            metalness={0.9}
            distort={0.45}
            speed={2}
            emissive="#1a3a8a"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>
      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#c7ddff" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function FloatingShards({ scrollProgress }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8 - 2,
        ] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
          number,
          number,
          number,
        ],
        scale: 0.2 + Math.random() * 0.5,
        seed: i,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    group.current.rotation.y = p * Math.PI * 0.6 + state.clock.elapsedTime * 0.05;
    group.current.children.forEach((c, i) => {
      c.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002;
      c.rotation.x += 0.002;
      c.rotation.z += 0.003;
    });
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#a8c5ff"
            metalness={1}
            roughness={0.2}
            emissive="#3b5bdb"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene({ scrollProgress }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#05060a"]} />
        <fog attach="fog" args={["#05060a", 8, 28]} />

        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#c7ddff" />
        <pointLight position={[-6, -2, -4]} intensity={2} color="#7c5cff" distance={20} />
        <pointLight position={[6, 4, 2]} intensity={1.5} color="#5b8def" distance={18} />

        <HeroOrb scrollProgress={scrollProgress} />
        <FloatingShards scrollProgress={scrollProgress} />
        <Particles />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
