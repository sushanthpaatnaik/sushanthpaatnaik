import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Points, PointMaterial, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  scrollProgress: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

/* ---------- helpers ---------- */
const range = (p: number, a: number, b: number, fadeIn = 0.05, fadeOut = 0.05) => {
  if (p < a - fadeIn || p > b + fadeOut) return 0;
  if (p < a) return (p - (a - fadeIn)) / fadeIn;
  if (p > b) return 1 - (p - b) / fadeOut;
  return 1;
};

/* ---------- ambient particles (always on) ---------- */
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
      ref.current.rotation.y += dt * 0.008;
      ref.current.rotation.x += dt * 0.002;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#8aa6d8" size={0.018} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  );
}

/* ---------- Scene 01: HERO ORB (0.00 – 0.14) ---------- */
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
      const t = Math.min(1, p / 0.14);
      const targetY = -t * 5;
      const targetZ = t * 6;
      const targetScale = 1 - t * 0.6;
      group.current.position.y += (targetY - group.current.position.y) * 0.08;
      group.current.position.z += (targetZ - group.current.position.z) * 0.08;
      const s = group.current.scale.x + (targetScale - group.current.scale.x) * 0.08;
      group.current.scale.setScalar(Math.max(0.15, s));
      group.current.rotation.z = p * Math.PI * 0.4;
    }
    if (halo.current) halo.current.rotation.z += dt * 0.05;
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.6, 12]} />
          <MeshDistortMaterial color="#5b8def" roughness={0.1} metalness={0.95} distort={0.45} speed={2} emissive="#1a3a8a" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#c7ddff" transparent opacity={0.08} />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[2.6, 0.012, 8, 200]} />
        <meshBasicMaterial color="#a8c5ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ---------- Scene 02: CRYSTAL CORE (0.14 – 0.28) ---------- */
function CrystalCore({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    const v = range(p, 0.14, 0.28, 0.04, 0.04);
    group.current.position.y = THREE.MathUtils.lerp(6, 0, v) * (v < 0.5 ? 1 : 0) + (1 - v) * -4 * (v > 0.95 ? 1 : 0);
    group.current.position.y = (1 - v) * 5 - (v < 0.5 ? 0 : 0);
    group.current.rotation.y += dt * 0.25;
    group.current.children.forEach((c) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      if (mat && "opacity" in mat) mat.opacity = v;
    });
  });
  return (
    <group ref={group} position={[0, 6, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 3, 0]} position={[0, i * 0.05, 0]}>
          <octahedronGeometry args={[1.4 - i * 0.15, 0]} />
          <meshPhysicalMaterial color="#b6d4ff" metalness={0.2} roughness={0.05} transmission={0.9} thickness={1.2} ior={1.6} transparent opacity={0} emissive="#3b5bdb" emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Scene 03: TORUS GRID (0.28 – 0.42) ---------- */
function TorusGrid({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    const v = range(p, 0.28, 0.42, 0.04, 0.04);
    group.current.position.y = (1 - v) * 6;
    group.current.rotation.z += dt * 0.08;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    group.current.children.forEach((c) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && "opacity" in mat) mat.opacity = v * 0.9;
    });
  });
  return (
    <group ref={group} position={[0, 6, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.7, 0]}>
          <torusGeometry args={[1.6 + i * 0.25, 0.012, 12, 220]} />
          <meshStandardMaterial color="#a8c5ff" emissive="#5b8def" emissiveIntensity={1.2} transparent opacity={0} metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Scene 04: LIGHT TUNNEL (0.42 – 0.56) ---------- */
function LightTunnel({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  useFrame((state, dt) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    const v = range(p, 0.42, 0.56, 0.04, 0.05);
    group.current.children.forEach((c, i) => {
      const baseZ = -i * 1.4;
      c.position.z = baseZ + ((state.clock.elapsedTime * 1.2 + i * 0.2) % (rings.length * 1.4));
      c.rotation.z += dt * (0.1 + i * 0.005);
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshBasicMaterial;
      if (mat && "opacity" in mat) {
        const fade = 1 - Math.abs(c.position.z + 6) / 14;
        mat.opacity = Math.max(0, fade) * v * 0.7;
      }
    });
  });
  return (
    <group ref={group}>
      {rings.map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 8]}>
          <torusGeometry args={[2.4 + (i % 3) * 0.15, 0.008, 6, 100]} />
          <meshBasicMaterial color={i % 2 ? "#a8c5ff" : "#9b7cff"} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Scene 05: WIREFRAME GLOBE (0.56 – 0.72) ---------- */
function WireGlobe({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    const p = scrollProgress.current;
    const v = range(p, 0.56, 0.72, 0.04, 0.04);
    group.current.scale.setScalar(0.001 + v * 1.6);
    group.current.rotation.y += dt * 0.2;
    group.current.rotation.x = Math.sin(p * 8) * 0.1;
    group.current.children.forEach((c) => {
      const m = c as THREE.Mesh;
      const mat = m.material as THREE.MeshBasicMaterial;
      if (mat && "opacity" in mat) mat.opacity = v * (m.userData.base ?? 0.4);
    });
  });
  return (
    <group ref={group} scale={0.001}>
      <mesh userData={{ base: 0.35 }}>
        <sphereGeometry args={[1.4, 48, 32]} />
        <meshBasicMaterial color="#5b8def" wireframe transparent opacity={0} />
      </mesh>
      <mesh userData={{ base: 0.15 }}>
        <sphereGeometry args={[1.42, 96, 64]} />
        <meshBasicMaterial color="#c7ddff" wireframe transparent opacity={0} />
      </mesh>
      <mesh userData={{ base: 0.08 }}>
        <sphereGeometry args={[1.38, 32, 32]} />
        <meshBasicMaterial color="#9b7cff" transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* ---------- Scene 06: MONOLITH (0.72 – 1.0) ---------- */
function Monolith({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const p = scrollProgress.current;
    const v = range(p, 0.72, 1.0, 0.05, 0.001);
    mesh.current.position.y = (1 - v) * -8;
    mesh.current.position.z = THREE.MathUtils.lerp(-2, 1.2, v);
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.2 + p * 0.4;
    const mat = mesh.current.material as THREE.MeshPhysicalMaterial;
    if (mat && "opacity" in mat) mat.opacity = v;
  });
  return (
    <mesh ref={mesh} position={[0, -8, -2]}>
      <boxGeometry args={[1.2, 4.2, 0.3]} />
      <meshPhysicalMaterial color="#0a0d18" metalness={1} roughness={0.05} clearcoat={1} clearcoatRoughness={0} emissive="#3b5bdb" emissiveIntensity={0.4} transparent opacity={0} />
    </mesh>
  );
}

/* ---------- Background shards (always present) ---------- */
function FloatingShards({ scrollProgress }: { scrollProgress: SceneProps["scrollProgress"] }) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        pos: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 10 - 3] as [number, number, number],
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
          <meshStandardMaterial color="#a8c5ff" metalness={1} roughness={0.15} emissive="#3b5bdb" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Spline-based camera rig ---------- */
function CameraRig({ scrollProgress, mouse }: SceneProps) {
  const { camera } = useThree();
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 6.5),
      new THREE.Vector3(2.4, 1.0, 5.4),
      new THREE.Vector3(-2.6, -0.6, 4.6),
      new THREE.Vector3(0.4, 2.0, 5.2),
      new THREE.Vector3(-1.6, 0.2, 3.8),
      new THREE.Vector3(1.8, -1.2, 4.6),
      new THREE.Vector3(0, 0.6, 7.8),
    ];
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
  }, []);
  const lookCurve = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.2, 0),
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0, 0, 0),
    ];
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
  }, []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookLerp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const p = THREE.MathUtils.clamp(scrollProgress.current, 0, 0.999);
    // Smoothstep the param for cinematic ease
    const e = p * p * (3 - 2 * p) * 0.5 + p * 0.5;
    curve.getPointAt(e, tmp);
    lookCurve.getPointAt(e, look);
    // Mouse parallax
    tmp.x += mouse.current.x * 0.45;
    tmp.y += -mouse.current.y * 0.35;
    // Breath drift
    tmp.x += Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    tmp.y += Math.cos(state.clock.elapsedTime * 0.14) * 0.08;
    camera.position.lerp(tmp, 1 - Math.pow(0.001, dt));
    lookLerp.lerp(look, 1 - Math.pow(0.005, dt));
    camera.lookAt(lookLerp);
  });
  return null;
}

/* ---------- Dynamic lights — mood per chapter ---------- */
function DynamicLights({ scrollProgress, mouse }: SceneProps) {
  const a = useRef<THREE.PointLight>(null);
  const b = useRef<THREE.PointLight>(null);
  const c = useRef<THREE.PointLight>(null);
  // Per-chapter color moods
  const moods = useMemo(
    () => [
      { a: new THREE.Color("#7c5cff"), b: new THREE.Color("#5b8def") }, // hero
      { a: new THREE.Color("#9bdcff"), b: new THREE.Color("#c7a8ff") }, // vision
      { a: new THREE.Color("#5b8def"), b: new THREE.Color("#1a3a8a") }, // depth
      { a: new THREE.Color("#9b7cff"), b: new THREE.Color("#5b8def") }, // tunnel
      { a: new THREE.Color("#7cffd1"), b: new THREE.Color("#5b8def") }, // tech
      { a: new THREE.Color("#ff8fb8"), b: new THREE.Color("#9b7cff") }, // metrics
      { a: new THREE.Color("#ffcc8f"), b: new THREE.Color("#9b7cff") }, // outro
    ],
    [],
  );
  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollProgress.current;
    const seg = p * (moods.length - 1);
    const i = Math.floor(seg);
    const f = seg - i;
    tmpA.lerpColors(moods[i].a, moods[Math.min(i + 1, moods.length - 1)].a, f);
    tmpB.lerpColors(moods[i].b, moods[Math.min(i + 1, moods.length - 1)].b, f);
    if (a.current) {
      a.current.position.x = Math.sin(t * 0.4) * 6 + mouse.current.x * 2;
      a.current.position.y = Math.cos(t * 0.3) * 3 + mouse.current.y * 2;
      a.current.color.copy(tmpA);
    }
    if (b.current) {
      b.current.position.x = Math.cos(t * 0.25) * 5;
      b.current.position.y = Math.sin(t * 0.35) * 4;
      b.current.color.copy(tmpB);
    }
    if (c.current) {
      c.current.position.z = -3 + Math.sin(t * 0.2) * 2;
      c.current.color.copy(tmpA).lerp(tmpB, 0.5);
    }
  });
  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#c7ddff" />
      <pointLight ref={a} position={[-6, -2, -4]} intensity={3} distance={22} />
      <pointLight ref={b} position={[6, 4, 2]} intensity={2} distance={20} />
      <pointLight ref={c} position={[0, 0, -3]} intensity={1.5} distance={16} />
    </>
  );
}

export default function Scene({ scrollProgress, mouse }: SceneProps) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <Suspense fallback={null}>
        <color attach="background" args={["#03040a"]} />
        <fog attach="fog" args={["#03040a", 5, 24]} />

        <DynamicLights scrollProgress={scrollProgress} mouse={mouse} />
        <CameraRig scrollProgress={scrollProgress} mouse={mouse} />

        <HeroOrb scrollProgress={scrollProgress} />
        <CrystalCore scrollProgress={scrollProgress} />
        <TorusGrid scrollProgress={scrollProgress} />
        <LightTunnel scrollProgress={scrollProgress} />
        <WireGlobe scrollProgress={scrollProgress} />
        <Monolith scrollProgress={scrollProgress} />

        <FloatingShards scrollProgress={scrollProgress} />
        <Particles />
        <Stars radius={60} depth={40} count={900} factor={2} fade speed={0.2} />

        <Environment preset="night" />

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.42} luminanceSmoothing={0.95} mipmapBlur />
          <DepthOfField focusDistance={0.02} focalLength={0.08} bokehScale={3.2} />
          <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
          <Vignette eskil={false} offset={0.15} darkness={0.95} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
