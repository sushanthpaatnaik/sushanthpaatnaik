import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import * as THREE from "three";

const EARTH_CHAPTER = 6;
/** Seconds for one full Y-axis revolution. */
const ROTATION_SECONDS = 160;

function useEarthOpacity(phase: MotionValue<number>) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - EARTH_CHAPTER);
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * t * (t * (t * 6 - 15) + 10);
  });
}

/**
 * True 3D rotating Earth globe for the "Future Systems" chapter.
 *
 * Technique — WebGL sphere with texture + Phong lighting:
 *   Three.js (already in the bundle) renders a SphereGeometry with the Earth
 *   texture mapped equirectangularly. The sphere rotates on its Y axis at a
 *   constant angular velocity, so continents travel in a lateral arc across
 *   a spherical profile — not a flat pan, not a tilting rectangle.
 *
 *   A directional "sun" light creates the day/night terminator.
 *   A BackSide atmosphere sphere adds the characteristic blue limb glow.
 *   An ambient fill prevents the night side from going pitch black.
 *
 * Sizing:
 *   Camera FOV 45°, sphere radius 1, camera z=3.0 → sphere fills ~80% of
 *   viewport height on a 16:9 screen. Canvas is full-viewport transparent so
 *   the dark sceneFuture plate reads as deep space around the globe.
 *
 * Performance:
 *   pixelRatio capped at 1.5 · powerPreference "low-power" · alpha canvas.
 *   ResizeObserver keeps the projection matrix in sync with viewport changes.
 *   Proper disposal (renderer, geometries, materials, texture) on unmount.
 *   prefers-reduced-motion: renders one static frame, no rAF loop.
 */
export default function EarthGlobe({
  phase,
  src,
}: {
  phase: MotionValue<number>;
  src: string;
}) {
  const opacity = useEarthOpacity(phase);
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ────────────────────────────────────────────────────────────
    // FOV 45°, sphere radius 1, z=3.0 → sphere fills ~80% of viewport height
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.0;

    // ── Texture ───────────────────────────────────────────────────────────
    const texture = new THREE.TextureLoader().load(src);
    texture.colorSpace = THREE.SRGBColorSpace;

    // ── Earth sphere ──────────────────────────────────────────────────────
    const geoEarth = new THREE.SphereGeometry(1, 72, 72);
    const matEarth = new THREE.MeshPhongMaterial({
      map: texture,
      specular: new THREE.Color(0x111c2b),
      shininess: 16,
    });
    const earth = new THREE.Mesh(geoEarth, matEarth);
    // Tilt ~23.5° to match Earth's axial tilt — more realistic silhouette
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);
    scene.add(earth);

    // ── Atmosphere (BackSide sphere — renders the rim glow) ───────────────
    const geoAtmo = new THREE.SphereGeometry(1.025, 72, 72);
    const matAtmo = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x2255aa),
      transparent: true,
      opacity: 0.10,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(geoAtmo, matAtmo);
    atmosphere.rotation.z = earth.rotation.z;
    scene.add(atmosphere);

    // ── Lighting ──────────────────────────────────────────────────────────
    // Ambient: very dark blue — night side is deep, not black
    scene.add(new THREE.AmbientLight(0x0d1528, 2.0));

    // Sun: warm directional light from upper-left, simulating solar illumination
    const sun = new THREE.DirectionalLight(0xfff2e6, 1.6);
    sun.position.set(4, 2, 5);
    scene.add(sun);

    // Earthshine: faint cool fill on the night hemisphere
    const fill = new THREE.DirectionalLight(0x223355, 0.22);
    fill.position.set(-5, -1, -4);
    scene.add(fill);

    // ── Resize sync ───────────────────────────────────────────────────────
    function resize(w: number, h: number) {
      renderer.setSize(w, h, false); // false = don't set CSS size (handled by CSS)
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) resize(e.contentRect.width, e.contentRect.height);
    });
    ro.observe(canvas);

    // Initial size from the parent viewport
    resize(window.innerWidth, window.innerHeight);

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId = 0;
    const t0 = performance.now();

    function tick() {
      rafId = requestAnimationFrame(tick);
      // Y rotation drives the horizontal surface travel — true planetary spin
      earth.rotation.y = ((performance.now() - t0) / 1000 / ROTATION_SECONDS) * Math.PI * 2;
      atmosphere.rotation.y = earth.rotation.y;
      renderer.render(scene, camera);
    }

    if (reduceMotion) {
      renderer.render(scene, camera); // single static frame
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      geoEarth.dispose();
      geoAtmo.dispose();
      matEarth.dispose();
      matAtmo.dispose();
      texture.dispose();
    };
  }, [src, reduceMotion]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </motion.div>
  );
}
