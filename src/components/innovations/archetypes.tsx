import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Procedural archetype scenes — quiet technological supremacy.              */
/*  Every mesh is parametric; no external GLTF/textures so they load fast.    */
/* -------------------------------------------------------------------------- */

export type ArchetypeId =
  | "lattice"      // graphene hex sheet
  | "membrane"     // perforated planar disc
  | "cellstack"    // stacked battery cells
  | "panel"        // engineered surface plate
  | "orb"          // catalytic sphere with ring
  | "shield"       // ballistic curved plate
  | "fiber"        // twisted reinforcement strand
  | "halo";        // multi-functional ring / flame guard

export interface ArchetypeProps {
  accent?: string;            // hex/oklch hex color
  exploded?: boolean;         // modal exploded view
  intensity?: number;         // scale of motion (0..1)
  seed?: number;              // for variation between same archetype
}

const DEFAULT_ACCENT = "#7da3ff";

function useSeed(seed = 0) {
  return useMemo(() => {
    const s = (seed * 9301 + 49297) % 233280;
    return s / 233280;
  }, [seed]);
}

/* ---------------------------- Shared materials ---------------------------- */

function metalMat(accent: string, opacity = 1) {
  return (
    <meshPhysicalMaterial
      color={accent}
      metalness={0.86}
      roughness={0.28}
      clearcoat={0.6}
      clearcoatRoughness={0.35}
      reflectivity={0.6}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

function glassMat(accent: string) {
  return (
    <meshPhysicalMaterial
      color={accent}
      metalness={0.05}
      roughness={0.12}
      transmission={0.78}
      thickness={0.6}
      clearcoat={1}
      ior={1.45}
      transparent
      opacity={0.55}
    />
  );
}

/* --------------------------------- Lattice -------------------------------- */
/*  Hex graphene sheet — the substrate.                                       */
function Lattice({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const group = useRef<THREE.Group>(null);
  const sd = useSeed(seed);

  const lines = useMemo(() => {
    const positions: number[] = [];
    const rows = 8, cols = 9, r = 0.18;
    const w = Math.sqrt(3) * r, h = 1.5 * r;
    for (let row = -rows / 2; row < rows / 2; row++) {
      for (let col = -cols / 2; col < cols / 2; col++) {
        const offset = row % 2 === 0 ? 0 : w / 2;
        const cx = col * w + offset;
        const cy = row * h;
        const verts: THREE.Vector3[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          verts.push(new THREE.Vector3(cx + r * Math.cos(a), cy + r * Math.sin(a), 0));
        }
        for (let i = 0; i < 6; i++) {
          const a = verts[i], b = verts[(i + 1) % 6];
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.x = -0.55 + Math.sin(s.clock.elapsedTime * 0.15) * 0.04 * intensity;
    group.current.rotation.z += dt * 0.04 * intensity;
    group.current.rotation.y = sd * 0.3 + Math.cos(s.clock.elapsedTime * 0.18) * 0.06;
  });

  return (
    <group ref={group} scale={exploded ? 1.4 : 1}>
      {[0, exploded ? 0.45 : 0.18, exploded ? 0.9 : 0.36].map((z, i) => (
        <lineSegments key={i} geometry={lines} position={[0, 0, -z]}>
          <lineBasicMaterial
            color={accent}
            transparent
            opacity={0.35 - i * 0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      ))}
    </group>
  );
}

/* -------------------------------- Membrane -------------------------------- */
/*  Perforated planar disc — water/H₂ separation surfaces.                    */
function Membrane({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const group = useRef<THREE.Group>(null);
  const sd = useSeed(seed);

  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.18 * intensity;
    group.current.rotation.x = -0.42 + Math.sin(s.clock.elapsedTime * 0.22 + sd) * 0.05;
  });

  const layers = exploded ? 5 : 3;
  return (
    <group ref={group} scale={exploded ? 1.3 : 1}>
      {Array.from({ length: layers }).map((_, i) => {
        const z = (i - (layers - 1) / 2) * (exploded ? 0.32 : 0.12);
        return (
          <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, (i * Math.PI) / 6]}>
            <ringGeometry args={[0.32, 0.95, 64]} />
            <meshPhysicalMaterial
              color={accent}
              metalness={0.4}
              roughness={0.35}
              transmission={0.55}
              thickness={0.4}
              transparent
              opacity={0.55 - i * 0.06}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      {/* central pore ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.012, 16, 64]} />
        {metalMat(accent)}
      </mesh>
    </group>
  );
}

/* ------------------------------- Cell stack ------------------------------- */
/*  Stacked battery / fuel cells.                                             */
function CellStack({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const group = useRef<THREE.Group>(null);
  const sd = useSeed(seed);
  const count = 6;

  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.22 * intensity;
    group.current.rotation.x = -0.32 + Math.sin(s.clock.elapsedTime * 0.18 + sd) * 0.06;
  });

  const gap = exploded ? 0.22 : 0.08;
  return (
    <group ref={group} scale={exploded ? 1.15 : 0.95}>
      {Array.from({ length: count }).map((_, i) => {
        const y = (i - (count - 1) / 2) * gap;
        const isElectrode = i % 2 === 0;
        return (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[1.1, 0.05, 0.7]} />
            {isElectrode ? metalMat(accent) : metalMat("#1a2030")}
          </mesh>
        );
      })}
      {/* terminal posts */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, (count * gap) / 2 + 0.04, 0.25]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          {metalMat(accent)}
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------- Panel --------------------------------- */
/*  Engineered surface plate — coatings, solar.                               */
function Panel({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const group = useRef<THREE.Group>(null);
  const sd = useSeed(seed);

  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.12 * intensity;
    group.current.rotation.x = -0.65 + Math.sin(s.clock.elapsedTime * 0.18 + sd) * 0.05;
    group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.08;
  });

  const layers = exploded ? 4 : 2;
  return (
    <group ref={group}>
      {Array.from({ length: layers }).map((_, i) => {
        const z = (i - (layers - 1) / 2) * (exploded ? 0.22 : 0.06);
        return (
          <mesh key={i} position={[0, 0, z]}>
            <boxGeometry args={[1.4, 0.9, 0.02]} />
            {i === 0 ? metalMat(accent) : metalMat("#10141d", 0.85)}
          </mesh>
        );
      })}
      {/* grid lines on top */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={`v${i}`} position={[(i - 3) * 0.2, 0, 0.012 + (exploded ? 0.45 : 0.04)]}>
          <boxGeometry args={[0.004, 0.88, 0.001]} />
          <meshBasicMaterial color={accent} transparent opacity={0.55} />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`h${i}`} position={[0, (i - 2) * 0.2, 0.012 + (exploded ? 0.45 : 0.04)]}>
          <boxGeometry args={[1.4, 0.004, 0.001]} />
          <meshBasicMaterial color={accent} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/* ----------------------------------- Orb ---------------------------------- */
/*  Catalytic sphere — combustion improvers, additives.                       */
function Orb({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const sd = useSeed(seed);

  useFrame((s, dt) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += dt * 0.4 * intensity;
      ringRef.current.rotation.y += dt * 0.12 * intensity;
    }
    if (orbRef.current) {
      orbRef.current.rotation.y += dt * 0.18 * intensity;
      orbRef.current.position.y = Math.sin(s.clock.elapsedTime * 0.6 + sd) * 0.04;
    }
  });

  return (
    <group scale={exploded ? 1.2 : 1}>
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        {metalMat(accent)}
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[exploded ? 1.05 : 0.82, 0.008, 16, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, 0, Math.PI / 3]}>
        <torusGeometry args={[exploded ? 1.25 : 0.96, 0.005, 12, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* ---------------------------------- Shield -------------------------------- */
/*  Curved ballistic plate.                                                   */
function Shield({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const group = useRef<THREE.Group>(null);
  const sd = useSeed(seed);

  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.16 * intensity;
    group.current.rotation.x = -0.18 + Math.sin(s.clock.elapsedTime * 0.18 + sd) * 0.04;
  });

  const layers = exploded ? 4 : 2;
  return (
    <group ref={group} scale={exploded ? 1.2 : 1}>
      {Array.from({ length: layers }).map((_, i) => {
        const z = (i - (layers - 1) / 2) * (exploded ? 0.18 : 0.05);
        return (
          <mesh key={i} position={[0, 0, z]}>
            <sphereGeometry args={[0.9, 32, 24, 0, Math.PI * 0.9, Math.PI * 0.18, Math.PI * 0.55]} />
            <meshPhysicalMaterial
              color={i === 0 ? accent : "#1a2030"}
              metalness={0.88}
              roughness={0.32}
              clearcoat={0.5}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92 - i * 0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------------------------------- Fiber --------------------------------- */
/*  Twisted reinforcement strand — composites/fibres/tyres.                   */
function Fiber({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const group = useRef<THREE.Group>(null);
  const sd = useSeed(seed);

  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.3 * intensity;
    group.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.2 + sd) * 0.18;
  });

  return (
    <group ref={group} scale={exploded ? 1.25 : 1}>
      <mesh>
        <torusKnotGeometry args={[0.55, 0.07, 180, 16, 2, 3]} />
        {metalMat(accent)}
      </mesh>
      {exploded && (
        <mesh>
          <torusKnotGeometry args={[0.55, 0.02, 180, 8, 2, 3]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

/* ---------------------------------- Halo ---------------------------------- */
/*  Multi-functional ring — pyronex / thermal regulation.                     */
function Halo({ accent = DEFAULT_ACCENT, exploded, intensity = 1, seed }: ArchetypeProps) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const sd = useSeed(seed);

  useFrame((_, dt) => {
    if (r1.current) r1.current.rotation.z += dt * 0.18 * intensity;
    if (r2.current) r2.current.rotation.z -= dt * 0.12 * intensity;
    if (r3.current) r3.current.rotation.z += dt * 0.08 * intensity;
  });

  return (
    <group rotation={[Math.PI / 2.4, sd, 0]} scale={exploded ? 1.25 : 1}>
      <mesh ref={r1}>
        <torusGeometry args={[0.55, 0.018, 16, 96]} />
        {metalMat(accent)}
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[exploded ? 0.95 : 0.78, 0.01, 12, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[exploded ? 1.25 : 0.98, 0.006, 10, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.18, 1]} />
        {glassMat(accent)}
      </mesh>
    </group>
  );
}

/* ----------------------------- Dispatch + map ----------------------------- */

export function ArchetypeScene({
  id,
  ...props
}: ArchetypeProps & { id: ArchetypeId }) {
  switch (id) {
    case "lattice": return <Lattice {...props} />;
    case "membrane": return <Membrane {...props} />;
    case "cellstack": return <CellStack {...props} />;
    case "panel": return <Panel {...props} />;
    case "orb": return <Orb {...props} />;
    case "shield": return <Shield {...props} />;
    case "fiber": return <Fiber {...props} />;
    case "halo": return <Halo {...props} />;
  }
}

/* Map every innovation title → archetype + accent color */
export const INNOVATION_ARCHETYPE: Record<
  string,
  { id: ArchetypeId; accent: string }
> = {
  // Lattice — substrate / structural / bulk material
  Graphacrete: { id: "lattice", accent: "#8aa6d4" },
  "HD-G-PE":   { id: "lattice", accent: "#9ab4d9" },
  Bitumax:     { id: "lattice", accent: "#b8a070" },
  Graphosite:  { id: "lattice", accent: "#a5b9d6" },

  // Membrane — separation / filtration / atmospheric
  Aquamax:     { id: "membrane", accent: "#7dc6e8" },
  Mariphene:   { id: "membrane", accent: "#6fb8d8" },
  Gryogen:     { id: "membrane", accent: "#9ad4c8" },
  Aerophenter: { id: "membrane", accent: "#a8cfdf" },

  // Cell stack — energy storage / fuel cells
  Graphenodes: { id: "cellstack", accent: "#c8a960" },
  Voltaphene:  { id: "cellstack", accent: "#d4b066" },
  Hydrocell:   { id: "cellstack", accent: "#8fd4c0" },

  // Panel — surfaces / coatings / solar
  Graffisol:   { id: "panel", accent: "#e0c068" },
  Ceraphene:   { id: "panel", accent: "#c0c8d4" },
  Rustene:     { id: "panel", accent: "#b88a6a" },

  // Orb — combustion / catalytic / additive
  Coalorix:    { id: "orb", accent: "#e89868" },
  "Ignitron D":{ id: "orb", accent: "#d88058" },
  "Ignitron P":{ id: "orb", accent: "#e0a070" },
  Lubritron:   { id: "orb", accent: "#c8a880" },

  // Shield — armour / defence
  Armophene:   { id: "shield", accent: "#a8b0bc" },

  // Fiber — composites / fibres / tyres / textiles
  Fibrasphene: { id: "fiber", accent: "#b0c8e0" },
  Graphyre:    { id: "fiber", accent: "#909aa8" },
  Thermaphene: { id: "fiber", accent: "#d8a0a8" },

  // Halo — multi-functional / thermal
  Pyronex:     { id: "halo", accent: "#e08068" },
};

export function archetypeFor(title: string): { id: ArchetypeId; accent: string } {
  return INNOVATION_ARCHETYPE[title] ?? { id: "lattice", accent: DEFAULT_ACCENT };
}
