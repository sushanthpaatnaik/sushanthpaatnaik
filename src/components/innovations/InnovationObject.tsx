import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type ObjectKind =
  | "lattice"
  | "cell"
  | "membrane"
  | "core"
  | "shell"
  | "fiber"
  | "node";

/** Domain → object kind mapping. Pure heuristic — keep deterministic. */
export function inferKind(domain: string): ObjectKind {
  const d = domain.toLowerCase();
  if (/hydrogen|water|desalination|membrane|atmospheric/.test(d)) return "membrane";
  if (/storage|electrode|fuel cell|battery|grid/.test(d)) return "cell";
  if (/combustion|tribology|lubricant|thermal power/.test(d)) return "core";
  if (/defence|ballistics|corrosion|multifunctional/.test(d)) return "shell";
  if (/composite|fibre|fibres|tyre|textile/.test(d)) return "fiber";
  if (/mobility/.test(d)) return "core";
  return "lattice";
}

/* ------------------------------------------------------------------ */
/*  Materials — titanium/graphite/gold tones, restrained                */
/* ------------------------------------------------------------------ */

function useMetal(color = "#cfd6df", roughness = 0.32, metalness = 0.92) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness,
        envMapIntensity: 0.9,
      }),
    [color, roughness, metalness],
  );
}

function useEmissive(color = "#3FA9F5", intensity = 0.55) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: intensity,
        roughness: 0.4,
        metalness: 0.5,
      }),
    [color, intensity],
  );
}

/* ------------------------------------------------------------------ */
/*  Kind: lattice — graphene hex plane, slowly rotating in 3D          */
/* ------------------------------------------------------------------ */

function LatticeMesh() {
  const group = useRef<THREE.Group>(null);
  const metal = useMetal("#a9b6c4", 0.28, 0.95);
  const glow = useEmissive("#7CCBFF", 0.7);

  const nodes = useMemo(() => {
    const out: [number, number][] = [];
    const R = 2.2;
    const step = 0.42;
    for (let q = -7; q <= 7; q++) {
      for (let r = -7; r <= 7; r++) {
        const x = step * 1.5 * q;
        const y = step * (Math.sqrt(3) * (r + q / 2));
        if (Math.hypot(x, y) < R) out.push([x, y]);
      }
    }
    return out;
  }, []);

  const bonds = useMemo(() => {
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    const step = 0.42;
    for (const [x, y] of nodes) {
      for (const [ox, oy] of [
        [step, 0],
        [step * 0.5, step * Math.sqrt(3) / 2],
        [-step * 0.5, step * Math.sqrt(3) / 2],
      ]) {
        const nx = x + ox;
        const ny = y + oy;
        if (nodes.some(([a, b]) => Math.abs(a - nx) < 0.001 && Math.abs(b - ny) < 0.001)) {
          out.push([new THREE.Vector3(x, y, 0), new THREE.Vector3(nx, ny, 0)]);
        }
      }
    }
    return out;
  }, [nodes]);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.z += dt * 0.05;
    group.current.rotation.x = -0.55;
  });

  return (
    <group ref={group}>
      {nodes.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} material={glow}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
      ))}
      {bonds.map(([a, b], i) => {
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        return (
          <mesh key={i} position={mid} quaternion={quat} material={metal}>
            <cylinderGeometry args={[0.012, 0.012, len, 6]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Kind: cell — battery / electrode stack                              */
/* ------------------------------------------------------------------ */

function CellMesh() {
  const group = useRef<THREE.Group>(null);
  const shell = useMetal("#b8c2cc", 0.22, 0.98);
  const core = useEmissive("#c9a84c", 0.5);
  const ring = useMetal("#2a2f36", 0.6, 0.7);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.18;
    group.current.rotation.x = 0.35;
  });

  const cells: Array<[number, number]> = [
    [-0.9, 0],
    [0, 0],
    [0.9, 0],
  ];

  return (
    <group ref={group}>
      {cells.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={shell}>
            <cylinderGeometry args={[0.38, 0.38, 1.6, 48]} />
          </mesh>
          <mesh position={[0, 0.82, 0]} material={core}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 32]} />
          </mesh>
          <mesh position={[0, -0.82, 0]} material={ring}>
            <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Kind: membrane — undulating sheet                                   */
/* ------------------------------------------------------------------ */

function MembraneMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useMetal("#9eb0c4", 0.36, 0.85);

  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(3.4, 2.2, 80, 50);
    return g;
  }, []);

  useFrame((state, dt) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const pos = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 1.6 + t * 0.6) * 0.12 +
        Math.cos(y * 1.9 + t * 0.4) * 0.09;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    mesh.current.rotation.z += dt * 0.04;
    mesh.current.rotation.x = -0.7;
  });

  return <mesh ref={mesh} geometry={geom} material={mat} />;
}

/* ------------------------------------------------------------------ */
/*  Kind: core — toroidal coil                                          */
/* ------------------------------------------------------------------ */

function CoreMesh() {
  const group = useRef<THREE.Group>(null);
  const metal = useMetal("#b9c2cc", 0.24, 0.96);
  const glow = useEmissive("#ff9a55", 0.55);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.22;
    group.current.rotation.x += dt * 0.05;
  });

  return (
    <group ref={group}>
      <mesh material={metal}>
        <torusKnotGeometry args={[0.85, 0.22, 200, 24, 2, 3]} />
      </mesh>
      <mesh material={glow} scale={0.32}>
        <icosahedronGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Kind: shell — armoured icosahedron                                  */
/* ------------------------------------------------------------------ */

function ShellMesh() {
  const group = useRef<THREE.Group>(null);
  const outer = useMetal("#cfd6df", 0.18, 0.99);
  const inner = useEmissive("#7CCBFF", 0.45);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.16;
    group.current.rotation.x += dt * 0.04;
  });

  return (
    <group ref={group}>
      <mesh material={outer}>
        <icosahedronGeometry args={[1.15, 1]} />
      </mesh>
      <mesh material={inner} scale={0.6}>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
      <mesh material={outer} scale={0.92}>
        <icosahedronGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Kind: fiber — twisted strands                                       */
/* ------------------------------------------------------------------ */

function FiberMesh() {
  const group = useRef<THREE.Group>(null);
  const metal = useMetal("#b3bcc6", 0.3, 0.9);

  const curves = useMemo(() => {
    return Array.from({ length: 7 }).map((_, idx) => {
      const offset = (idx / 7) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const y = (t - 0.5) * 2.4;
        const r = 0.55;
        const x = Math.cos(t * Math.PI * 3 + offset) * r;
        const z = Math.sin(t * Math.PI * 3 + offset) * r;
        points.push(new THREE.Vector3(x, y, z));
      }
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.2;
  });

  return (
    <group ref={group}>
      {curves.map((c, i) => (
        <mesh key={i} material={metal}>
          <tubeGeometry args={[c, 80, 0.035, 8, false]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Kind: node — orbital nodes                                          */
/* ------------------------------------------------------------------ */

function NodeMesh() {
  const group = useRef<THREE.Group>(null);
  const core = useEmissive("#7CCBFF", 0.65);
  const orbit = useMetal("#9aa6b4", 0.3, 0.92);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.25;
    group.current.rotation.x += dt * 0.08;
  });

  return (
    <group ref={group}>
      <mesh material={core}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]} material={orbit}>
          <torusGeometry args={[1.05 + i * 0.12, 0.012, 12, 96]} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={`n${i}`}
            position={[Math.cos(a) * 1.05, Math.sin(a) * 0.4, Math.sin(a) * 1.05]}
            material={core}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Dispatcher                                                          */
/* ------------------------------------------------------------------ */

export default function InnovationObject({ kind }: { kind: ObjectKind }) {
  switch (kind) {
    case "cell": return <CellMesh />;
    case "membrane": return <MembraneMesh />;
    case "core": return <CoreMesh />;
    case "shell": return <ShellMesh />;
    case "fiber": return <FiberMesh />;
    case "node": return <NodeMesh />;
    default: return <LatticeMesh />;
  }
}
