import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Points, PointMaterial, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  scrollProgress: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

/* ---------- PARTICLES ---------- */
function Particles({ count = 2500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 22;
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
      ref.current.rotation.y += dt * 0.015;
      ref.current.rotation.x += dt * 0.004;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#9bbcff"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}

/* ---------- HERO ORB (Scene 01) ---------- */
function HeroOrb({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    const p = scrollProgress.current;
    if (mesh.current) {
      mesh.current.rotation.x += dt * 0.12;
      mesh.current.rotation.y += dt * 0.18;
    }
    if (group.current) {
      // Fades + drifts away as user scrolls past scene 1
      const t = Math.min(1, p / 0.25);
      const targetY = -t * 5;
      const targetZ = t * 6;
      const targetScale = 1 - t * 0.6;
      group.current.position.y += (targetY - group.current.position.y) * 0.08;
      group.current.position.z += (targetZ - group.current.position.z) * 0.08;
      const s = group.current.scale.x + (targetScale - group.current.scale.x) * 0.08;
      group.current.scale.setScalar(Math.max(0.15, s));
      group.current.rotation.z = p * Math.PI * 0.4;
    }
    if (halo.current) {
      halo.current.rotation.z += dt * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.6, 12]} />
          <MeshDistortMaterial
            color="#5b8def"
            roughness={0.1}
            metalness={0.95}
            distort={0.45}
            speed={2}
            emissive="#1a3a8a"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#c7ddff" transparent opacity={0.08} />
      </mesh>
      {/* Halo ring */}
      <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[2.6, 0.012, 8, 200]} />
        <meshBasicMaterial color="#a8c5ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ---------- CRYSTAL CORE (Scene 02) ---------- */
function CrystalCore({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    // Visible roughly from 0.2 to 0.5
    const t = THREE.MathUtils.clamp((p - 0.2) / 0.25, 0, 1);
    const out = THREE.MathUtils.clamp((p - 0.45) / 0.1, 0, 1);
    const opacity = t * (1 - out);
    const targetY = THREE.MathUtils.lerp(6, -2, t) + out * -6;
    group.current.position.y += (targetY - group.current.position.y) * 0.08;
    group.current.rotation.y += dt * 0.25;
    group.current.children.forEach((c) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      if (mat && "opacity" in mat) mat.opacity = opacity;
    });
  });

  return (
    <group ref={group} position={[0, 6, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 3, 0]} position={[0, i * 0.05, 0]}>
          <octahedronGeometry args={[1.4 - i * 0.15, 0]} />
          <meshPhysicalMaterial
            color="#b6d4ff"
            metalness={0.2}
            roughness={0.05}
            transmission={0.9}
            thickness={1.2}
            ior={1.6}
            transparent
            opacity={0}
            emissive="#3b5bdb"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- TORUS GRID (Scene 03) ---------- */
function TorusGrid({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    const t = THREE.MathUtils.clamp((p - 0.45) / 0.25, 0, 1);
    const out = THREE.MathUtils.clamp((p - 0.7) / 0.1, 0, 1);
    const opacity = t * (1 - out);
    const targetY = THREE.MathUtils.lerp(6, 0, t) - out * 8;
    group.current.position.y += (targetY - group.current.position.y) * 0.08;
    group.current.rotation.z += dt * 0.08;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    group.current.children.forEach((c) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && "opacity" in mat) mat.opacity = opacity * 0.9;
    });
  });
  return (
    <group ref={group} position={[0, 6, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.7, 0]}>
          <torusGeometry args={[1.6 + i * 0.25, 0.012, 12, 220]} />
          <meshStandardMaterial
            color="#a8c5ff"
            emissive="#5b8def"
            emissiveIntensity={1.2}
            transparent
            opacity={0}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- FLOATING SHARDS ---------- */
function FloatingShards({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 10 - 3,
        ] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        scale: 0.15 + Math.random() * 0.45,
        seed: i,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    group.current.rotation.y = p * Math.PI * 0.8 + state.clock.elapsedTime * 0.04;
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
            roughness={0.15}
            emissive="#3b5bdb"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- CAMERA RIG ---------- */
function CameraRig({ scrollProgress, mouse }: SceneProps) {
  const { camera } = useThree();
  // Cinematic camera path keyframes
  const path = useMemo(
    () => [
      { p: new THREE.Vector3(0, 0, 6.5), l: new THREE.Vector3(0, 0, 0) },
      { p: new THREE.Vector3(2.2, 1.2, 5), l: new THREE.Vector3(0, 0, 0) },
      { p: new THREE.Vector3(-2.4, -0.6, 4.2), l: new THREE.Vector3(0, 0.4, 0) },
      { p: new THREE.Vector3(0.6, 2.0, 5.4), l: new THREE.Vector3(0, 0, 0) },
      { p: new THREE.Vector3(0, 0.4, 7.5), l: new THREE.Vector3(0, 0, 0) },
    ],
    [],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const lookTmp = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const p = THREE.MathUtils.clamp(scrollProgress.current, 0, 0.9999);
    const seg = p * (path.length - 1);
    const i = Math.floor(seg);
    const f = seg - i;
    // Smoothstep ease per segment
    const e = f * f * (3 - 2 * f);
    const a = path[i];
    const b = path[Math.min(path.length - 1, i + 1)];
    tmp.lerpVectors(a.p, b.p, e);
    targetLook.lerpVectors(a.l, b.l, e);

    // Mouse parallax
    const mx = mouse.current.x;
    const my = mouse.current.y;
    tmp.x += mx * 0.45;
    tmp.y += -my * 0.35;

    // Subtle breath drift
    tmp.x += Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    tmp.y += Math.cos(state.clock.elapsedTime * 0.14) * 0.08;

    camera.position.lerp(tmp, 1 - Math.pow(0.001, dt));
    lookTmp.lerp(targetLook, 1 - Math.pow(0.005, dt));
    camera.lookAt(lookTmp);
  });
  return null;
}

/* ---------- DYNAMIC LIGHTS ---------- */
function DynamicLights({ mouse }: { mouse: SceneProps["mouse"] }) {
  const a = useRef<THREE.PointLight>(null);
  const b = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (a.current) {
      a.current.position.x = Math.sin(t * 0.4) * 6 + mouse.current.x * 2;
      a.current.position.y = Math.cos(t * 0.3) * 3 + mouse.current.y * 2;
    }
    if (b.current) {
      b.current.position.x = Math.cos(t * 0.25) * 5;
      b.current.position.y = Math.sin(t * 0.35) * 4;
    }
  });
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#c7ddff" />
      <pointLight ref={a} position={[-6, -2, -4]} intensity={3} color="#7c5cff" distance={22} />
      <pointLight ref={b} position={[6, 4, 2]} intensity={2} color="#5b8def" distance={20} />
    </>
  );
}

export default function Scene({ scrollProgress, mouse }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#04050a"]} />
        <fog attach="fog" args={["#04050a", 7, 30]} />

        <DynamicLights mouse={mouse} />

        <CameraRig scrollProgress={scrollProgress} mouse={mouse} />

        <HeroOrb scrollProgress={scrollProgress} />
        <CrystalCore scrollProgress={scrollProgress} />
        <TorusGrid scrollProgress={scrollProgress} />
        <FloatingShards scrollProgress={scrollProgress} />
        <Particles />
        <Stars radius={60} depth={40} count={1500} factor={3} fade speed={0.4} />

        <Environment preset="night" />

        <EffectComposer multisampling={0}>
          <Bloom intensity={1.1} luminanceThreshold={0.22} luminanceSmoothing={0.9} mipmapBlur />
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={2.2} />
          <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
