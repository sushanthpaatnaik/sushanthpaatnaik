import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const EARTH_CHAPTER = 6;
/** Radians added per frame at nominal 60 fps → ~150 s full revolution */
const SPIN_PER_FRAME = (Math.PI * 2) / (150 * 60);
const SUN_ANGLE_DEG  = 65;
/** CDN texture URLs (NASA imagery via three-globe package) */
const CDN = {
  day:      "https://unpkg.com/three-globe/example/img/earth-day.jpg",
  night:    "https://unpkg.com/three-globe/example/img/earth-night.jpg",
  specular: "https://unpkg.com/three-globe/example/img/earth-water.png",
  bump:     "https://unpkg.com/three-globe/example/img/earth-topology.png",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FM chapter opacity (smooth-step curve, same as all other scene layers)
// ─────────────────────────────────────────────────────────────────────────────
function useEarthOpacity(phase: MotionValue<number>) {
  return useTransform(phase, (v) => {
    const d = Math.abs(v - EARTH_CHAPTER);
    if (d >= 1) return 0;
    const t = 1 - d;
    return t * t * t * (t * (t * 6 - 15) + 10);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// JS-side smoothstep (mirrors GLSL built-in, used in procedural textures)
// ─────────────────────────────────────────────────────────────────────────────
function ss(e0: number, e1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

// ─────────────────────────────────────────────────────────────────────────────
// Self-contained Simplex 3D noise — no external dependency
// ─────────────────────────────────────────────────────────────────────────────
function buildNoise() {
  const F3 = 1 / 3, G3 = 1 / 6;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
  const perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12; }
  const g3 = [1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1];
  return {
    simplex3D(xi: number, yi: number, zi: number): number {
      const s = (xi + yi + zi) * F3;
      const i0 = Math.floor(xi + s), j0 = Math.floor(yi + s), k0 = Math.floor(zi + s);
      const tc = (i0 + j0 + k0) * G3;
      const x0 = xi - (i0 - tc), y0 = yi - (j0 - tc), z0 = zi - (k0 - tc);
      let i1 = 0, j1 = 0, k1 = 0, i2 = 0, j2 = 0, k2 = 0;
      if (x0 >= y0) {
        if (y0 >= z0)      { i1=1; i2=1; j2=1; }
        else if (x0 >= z0) { i1=1; i2=1; k2=1; }
        else               { k1=1; i2=1; k2=1; }
      } else {
        if (y0 < z0)      { k1=1; j2=1; k2=1; }
        else if (x0 < z0) { j1=1; j2=1; k2=1; }
        else              { j1=1; i2=1; j2=1; }
      }
      const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3;
      const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3;
      const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3;
      const ii=i0&255, jj=j0&255, kk=k0&255;
      const c = (g: number, x: number, y: number, z: number) => {
        const t = 0.6 - x*x - y*y - z*z;
        return t < 0 ? 0 : (t*t)*(t*t)*(g3[g*3]*x + g3[g*3+1]*y + g3[g*3+2]*z);
      };
      return 32 * (
        c(permMod12[ii   +perm[jj   +perm[kk  ]]], x0, y0, z0) +
        c(permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]], x1, y1, z1) +
        c(permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]], x2, y2, z2) +
        c(permMod12[ii+1 +perm[jj+1 +perm[kk+1 ]]], x3, y3, z3)
      );
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Procedural cosmic nebula skybox texture
// ─────────────────────────────────────────────────────────────────────────────
function buildSpaceBg(noise: ReturnType<typeof buildNoise>): THREE.CanvasTexture {
  const W = 1024, H = 512;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#010103";
  ctx.fillRect(0, 0, W, H);
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const lat = (y / H) * Math.PI - Math.PI / 2;
    for (let x = 0; x < W; x++) {
      const lon = (x / W) * Math.PI * 2 - Math.PI;
      const idx = (y * W + x) * 4;
      const nx = Math.cos(lat)*Math.cos(lon), ny = Math.cos(lat)*Math.sin(lon), nz = Math.sin(lat);
      const n1 = noise.simplex3D(nx*1.5, ny*1.5, nz*1.5)*0.5+0.5;
      const n2 = noise.simplex3D(nx*3.5, ny*3.5, nz*3.5)*0.25;
      // Primary equatorial dust band
      const band  = Math.exp(-Math.pow(lat - 0.12, 2) / 0.10);
      const gas   = Math.max(0, (n1 + n2) * band);
      // Second offset lane — different latitude + rotated, adds subtle depth layering
      const n3   = noise.simplex3D(nx*2.2+1.1, ny*2.2+0.8, nz*2.2)*0.5+0.5;
      const band2 = Math.exp(-Math.pow(lat + 0.30, 2) / 0.14) * 0.5;
      const gas2  = Math.max(0, n3 * band2);
      // Near-black charcoal — no visible purple/blue tint
      img.data[idx]   = Math.floor(gas * 6 + gas2 * 4);
      img.data[idx+1] = Math.floor(gas * 7 + gas2 * 5);
      img.data[idx+2] = Math.floor(gas * 10 + gas2 * 7);
      img.data[idx+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // Depth haze blobs — scattered across full height for spatial layering
  for (let i = 0; i < 9; i++) {
    const cx = Math.random()*W, cy = Math.random()*H, r = 80+Math.random()*200;
    const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gr.addColorStop(0, Math.random()>0.5 ? "rgba(8,10,14,0.04)" : "rgba(10,18,28,0.05)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  }
  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────────────────────────
// Procedural sun lens-flare quad texture
// ─────────────────────────────────────────────────────────────────────────────
function buildSunFlare(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const ctx = cv.getContext("2d")!;
  const gr = ctx.createRadialGradient(64, 64, 1, 64, 64, 64);
  gr.addColorStop(0,    "rgba(255,255,255,1.0)");
  gr.addColorStop(0.12, "rgba(255,245,230,0.85)");
  gr.addColorStop(0.35, "rgba(245,158,11,0.20)");
  gr.addColorStop(0.65, "rgba(245,158,11,0.02)");
  gr.addColorStop(1.0,  "rgba(0,0,0,0)");
  ctx.fillStyle = gr; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────────────────────────
// Procedural cloud texture (used inside setupEarth)
// ─────────────────────────────────────────────────────────────────────────────
function buildCloudTexture(noise: ReturnType<typeof buildNoise>): THREE.CanvasTexture {
  const W = 1024, H = 512;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const lat = (y / H) * Math.PI - Math.PI / 2;
    for (let x = 0; x < W; x++) {
      const lon = (x / W) * Math.PI * 2 - Math.PI;
      const idx = (y * W + x) * 4;
      const nx = Math.cos(lat)*Math.cos(lon), ny = Math.cos(lat)*Math.sin(lon), nz = Math.sin(lat);
      let cSum = 0, cFreq = 1.95, cAmp = 0.52;
      for (let j = 0; j < 5; j++) {
        cSum += noise.simplex3D(nx*cFreq, ny*cFreq, nz*cFreq) * cAmp;
        cFreq *= 1.88; cAmp *= 0.5;
      }
      const v = cSum > 0.02 ? Math.floor(ss(0.02, 0.48, cSum) * 230) : 0;
      img.data[idx] = img.data[idx+1] = img.data[idx+2] = v;
      img.data[idx+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────────────────────────
// Procedural fallback Earth textures (day/night/specular/bump)
// Generated entirely on the CPU if CDN assets fail to load.
// ─────────────────────────────────────────────────────────────────────────────
function buildFallbackTextures(noise: ReturnType<typeof buildNoise>) {
  const W = 2048, H = 1024;
  const make = () => { const c = document.createElement("canvas"); c.width=W; c.height=H; return c; };
  const [dcv, scv, ncv, bcv, gcv] = [make(), make(), make(), make(), make()];
  const [dctx, sctx, nctx, bctx, gctx] = [dcv, scv, ncv, bcv, gcv].map(c => c.getContext("2d")!);
  gctx.fillStyle = "#000"; gctx.fillRect(0,0,W,H);
  gctx.fillStyle = "#fff";
  const lx = (lon: number) => ((lon+180)/360)*W;
  const ly = (lat: number) => ((90-lat)/180)*H;
  const poly = (pts: [number,number][]) => {
    gctx.beginPath(); gctx.moveTo(lx(pts[0][0]), ly(pts[0][1]));
    pts.slice(1).forEach(([lo,la]) => gctx.lineTo(lx(lo), ly(la)));
    gctx.closePath(); gctx.fill();
  };
  // Major landmasses (simplified outlines)
  poly([[-168,65],[-120,72],[-80,75],[-85,60],[-60,50],[-80,25],[-100,16],[-125,45]]);  // N America
  poly([[-80,8],[-35,-5],[-68,-55],[-81,-5]]);                                           // S America
  poly([[-17,15],[10,37],[30,31],[51,11],[20,-34],[8,4]]);                               // Africa
  poly([[-9,38],[20,70],[100,77],[170,66],[130,35],[105,10],[77,8],[35,30]]);            // Eurasia
  poly([[113,-26],[130,-12],[153,-28],[148,-38]]);                                        // Australia
  const gData = gctx.getImageData(0, 0, W, H);
  const dImg = dctx.createImageData(W,H), sImg = sctx.createImageData(W,H);
  const nImg = nctx.createImageData(W,H), bImg = bctx.createImageData(W,H);
  for (let y = 0; y < H; y++) {
    const lat = (y / H) * Math.PI - Math.PI / 2;
    for (let x = 0; x < W; x++) {
      const lon = (x / W) * Math.PI * 2 - Math.PI;
      const i = (y * W + x) * 4;
      const nx = Math.cos(lat)*Math.cos(lon), ny = Math.cos(lat)*Math.sin(lon), nz = Math.sin(lat);
      let n = 0, freq = 1.35, amp = 0.55;
      for (let j = 0; j < 5; j++) { n += noise.simplex3D(nx*freq,ny*freq,nz*freq)*amp; freq*=2.05; amp*=0.45; }
      const isLand = gData.data[i] > 128 || n > 0.18;
      let r=0,g=0,b=0,sp=0,ht=0,nr=0,ng2=0;
      if (!isLand) { sp=255; r=6; g=18; b=42; }
      else { ht=Math.floor(Math.min(1,Math.max(0,n+0.45))*255); r=28; g=78; b=32; }
      const pn = noise.simplex3D(nx*3, ny*3, nz*3)*0.05;
      if (lat > 1.25+pn || lat < -1.15+pn) { r=245; g=248; b=255; sp=30; ht=55; }
      [dImg,sImg,nImg,bImg].forEach(img => { img.data[i+3]=255; });
      dImg.data[i]=r; dImg.data[i+1]=g; dImg.data[i+2]=b;
      sImg.data[i]=sImg.data[i+1]=sImg.data[i+2]=sp;
      bImg.data[i]=bImg.data[i+1]=bImg.data[i+2]=ht;
      if (isLand && lat < 1.15 && lat > -1.1) {
        const cf = noise.simplex3D(nx*15,ny*15,nz*15)*noise.simplex3D(nx*40,ny*40,nz*40);
        if (cf > 0.02) { nr=255; ng2=175; }
      }
      nImg.data[i]=nr; nImg.data[i+1]=ng2; nImg.data[i+2]=0;
    }
  }
  [dctx,sctx,nctx,bctx].forEach((ctx, k) =>
    ctx.putImageData([dImg,sImg,nImg,bImg][k], 0, 0)
  );
  return {
    day:      new THREE.CanvasTexture(dcv),
    specular: new THREE.CanvasTexture(scv),
    night:    new THREE.CanvasTexture(ncv),
    bump:     new THREE.CanvasTexture(bcv),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GLSL shader sources
// ─────────────────────────────────────────────────────────────────────────────
const HALO_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;
const HALO_FRAG = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 vSunDir;
  uniform float atmosphereIntensity;
  void main() {
    vec3 n = normalize(vNormal);
    float intensity = pow(0.68 - dot(n, vec3(0.0,0.0,1.0)), 2.8);
    float dotSun = dot(n, normalize(vSunDir));
    float sunGlow = smoothstep(-0.4, 0.2, dotSun);
    float blend = smoothstep(-0.1, 0.1, dotSun);
    vec3 blue   = vec3(0.08,0.46,0.95) * intensity;
    vec3 sunset = vec3(1.0,0.42,0.05)  * intensity * 1.5;
    vec3 color  = mix(sunset, blue, blend) * sunGlow * atmosphereIntensity;
    gl_FragColor = vec4(color, intensity * sunGlow * atmosphereIntensity);
  }
`;
const STAR_VERT = /* glsl */`
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3  aColor;
  uniform float uTime;
  varying float vOpacity;
  varying vec3  vColor;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    // Two-harmonic twinkle — organic flicker (phi-ratio second harmonic avoids periodicity)
    float t = uTime * aSpeed;
    float tw = sin(t + aPhase) * (0.62 + 0.38 * sin(t * 0.618 + aPhase * 1.41));
    vOpacity = 0.68 + 0.32 * tw;
    vColor = aColor;
    gl_PointSize = aSize * (350.0 / -mvPos.z);
  }
`;
const STAR_FRAG = /* glsl */`
  varying float vOpacity;
  varying vec3  vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core  = smoothstep(0.5, 0.04, d);
    float bloom = smoothstep(0.5, 0.0,  d) * 0.14;
    float a = (core + bloom) * vOpacity;
    gl_FragColor = vec4(vColor, a * 0.28);
  }
`;
const EARTH_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    vec3 t = cross(normal, vec3(0.0,1.0,0.0));
    if (length(t) < 0.001) t = cross(normal, vec3(0.0,0.0,1.0));
    vTangent   = normalize(normalMatrix * t);
    vBitangent = normalize(normalMatrix * cross(normal, t));
    gl_Position = projectionMatrix * mvPos;
  }
`;
const EARTH_FRAG = /* glsl */`
  uniform sampler2D tDiffuse;
  uniform sampler2D tSpecular;
  uniform sampler2D tNight;
  uniform sampler2D tNormal;
  uniform vec3  vSunDir;
  uniform float atmosphereIntensity;
  uniform float specularIntensity;
  uniform float bumpStrength;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying vec3 vViewDir;
  void main() {
    vec3 sun  = normalize(vSunDir);
    vec3 view = normalize(vViewDir);
    vec3 nm = texture2D(tNormal, vUv).rgb * 2.0 - 1.0;
    nm.xy *= bumpStrength;
    mat3 tbn = mat3(normalize(vTangent), normalize(vBitangent), normalize(vNormal));
    vec3 N   = normalize(tbn * nm);
    vec3 day   = texture2D(tDiffuse,  vUv).rgb;
    float spec = texture2D(tSpecular, vUv).r * specularIntensity;
    vec3 night = texture2D(tNight,    vUv).rgb;
    float ndl   = dot(N, sun);
    float dayW  = smoothstep(-0.15, 0.15, ndl);
    vec3 half_  = normalize(sun + view);
    float specF = pow(max(dot(N, half_), 0.0), 32.0) * spec;
    vec3 glint  = vec3(1.0,0.94,0.86) * specF * 1.8;
    float cloud = texture2D(tNormal, vUv + vec2(0.01, 0.0)).g;
    vec3 dayL   = (day * max(ndl+0.04, 0.0)) * mix(1.0, 0.5, cloud*dayW);
    float term  = smoothstep(0.18, 0.0, abs(ndl));
    vec3 sunset = vec3(1.0,0.35,0.06) * term * 0.45 * (1.0-spec);
    vec3 nightL = night * (1.0-dayW) * 1.68;
    vec3 surface = mix(nightL, dayL+glint+sunset, dayW);
    float limb  = pow(1.0 - max(dot(normalize(vNormal), view), 0.0), 4.5);
    surface += vec3(0.05,0.26,0.60) * limb * 0.79 * atmosphereIntensity;
    gl_FragColor = vec4(surface, 1.0);
  }
`;
const CLOUD_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;
const CLOUD_FRAG = /* glsl */`
  uniform sampler2D tClouds;
  uniform vec3  vSunDir;
  uniform float cloudOpacity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec3 n   = normalize(vNormal);
    vec3 sun = normalize(vSunDir);
    float c   = texture2D(tClouds, vUv).r;
    float ndl = dot(n, sun);
    float rim = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 3.5);
    vec3 rimC = vec3(0.08,0.4,0.8) * rim * 0.38 * c;
    vec3 color = (vec3(0.97,0.98,1.0) * max(ndl+0.08, 0.0)) + rimC;
    float vis  = smoothstep(-0.2, 0.2, ndl);
    gl_FragColor = vec4(color, c * cloudOpacity * mix(0.18, 1.0, vis));
  }
`;

const MOON_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const MOON_FRAG = /* glsl */`
  uniform sampler2D tMoon;
  uniform vec3 vSunDir;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 n = normalize(vNormal);
    float ndl = dot(n, normalize(vSunDir));
    // Tiny ambient fill so the night side isn't absolute black
    // Higher ambient floor so the Moon reads through the CSS dim overlays
    float light = max(ndl + 0.22, 0.0);
    vec3 surface = texture2D(tMoon, vUv).rgb * light;
    gl_FragColor = vec4(surface, 1.0);
  }
`;

// Procedural grey Moon — crater diffuse texture, no external CDN needed
function buildMoonTexture(): THREE.CanvasTexture {
  const W = 512, H = 256;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  // Light lunar grey — bright enough to read through the CSS overlay stack
  ctx.fillStyle = "#b4b4c2";
  ctx.fillRect(0, 0, W, H);
  // Mare (dark basalt plains)
  for (let i = 0; i < 8; i++) {
    const hx = Math.random() * W, hy = Math.random() * H, hr = 30 + Math.random() * 80;
    const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
    hg.addColorStop(0, "rgba(62,62,74,0.55)");
    hg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI*2); ctx.fill();
  }
  // Impact craters — dark floor, lighter ejecta rim
  for (let i = 0; i < 50; i++) {
    const cx = Math.random() * W, cy = Math.random() * H;
    const r  = 3 + Math.random() * 22;
    const cg = ctx.createRadialGradient(cx, cy, r * 0.25, cx, cy, r);
    cg.addColorStop(0,    "rgba(40,40,50,0.90)");  // dark crater floor
    cg.addColorStop(0.72, "rgba(80,80,92,0.65)");
    cg.addColorStop(0.88, "rgba(200,200,210,0.45)"); // bright ejecta rim
    cg.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  }
  // Subtle surface grain
  const img = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < img.data.length; i += 4) {
    const g = (Math.random() - 0.5) * 10;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + g));
    img.data[i+1] = img.data[i]; img.data[i+2] = Math.max(0, Math.min(255, img.data[i] + 8));
  }
  ctx.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Photorealistic WebGL Earth for the "Future Systems" chapter.
 *
 * Scene (ported from standalone HTML reference implementation):
 *   • ACES filmic tonemapping + SRGBColorSpace
 *   • Perspective camera (FOV 36°, z=15.5) looking at planetGroup at y=−10.2
 *     → forms the distinctive large curved-horizon look
 *   • Earth sphere (r=12.2, 128 segments) with custom ShaderMaterial:
 *       day texture · night city-lights · specular water · bump normal map
 *       Blinn-Phong specular · Rayleigh limb scatter · sunset terminator bloom
 *   • Cloud sphere (r=12.35) with procedural simplex-noise cloud texture
 *   • BackSide atmosphere halo (r=12.85) with custom GLSL limb shader
 *   • Star field (800 points) with per-point twinkling via shader uniform uTime
 *   • Procedural cosmic nebula skybox (r=180)
 *   • Sun lens-flare billboard, position driven by sun angle uniform
 *   • Textures loaded from CDN (NASA imagery) with full procedural fallback
 *   • No mouse/touch interaction — pointer-events:none background layer
 *   • prefers-reduced-motion: single static frame, no rAF loop
 *   • Mobile: 64-segment geometry, pixelRatio≤1, low-power GPU hint
 *   • Full Three.js disposal (geometries, materials, textures, renderer) on unmount
 */
export default function EarthGlobe({
  phase,
  src: _src,
}: {
  phase: MotionValue<number>;
  src?: string;
}) {
  const opacity     = useEarthOpacity(phase);
  const reduceMotion = useReducedMotion();
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const segs = isMobile ? 64 : 128;
    const dpr  = Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5);

    // ── Renderer ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.64;
    renderer.outputColorSpace    = THREE.SRGBColorSpace;

    // ── Scene & Camera ───────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 18.0);

    // ── Planet group — offset down to form curved horizon ────────────────
    const planetGroup = new THREE.Group();
    planetGroup.position.set(0, -9.9, -1.0);
    scene.add(planetGroup);

    // ── Noise (shared by all procedural generators) ──────────────────────
    const noise = buildNoise();

    // ── Space skybox ─────────────────────────────────────────────────────
    const spaceTex = buildSpaceBg(noise);
    const spaceGeo = new THREE.SphereGeometry(180, 32, 32);
    const spaceMat = new THREE.MeshBasicMaterial({
      map: spaceTex, side: THREE.BackSide, transparent: true, opacity: 0.50,
    });
    scene.add(new THREE.Mesh(spaceGeo, spaceMat));

    // ── Sun billboard ────────────────────────────────────────────────────
    const sunTex = buildSunFlare();
    const sunGeo = new THREE.PlaneGeometry(35, 35);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // ── Atmosphere halo ──────────────────────────────────────────────────
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        vSunDir:             { value: new THREE.Vector3() },
        atmosphereIntensity: { value: 0.44 },
      },
      vertexShader:   HALO_VERT,
      fragmentShader: HALO_FRAG,
      blending:    THREE.AdditiveBlending,
      side:        THREE.BackSide,
      transparent: true,
    });
    const haloGeo = new THREE.SphereGeometry(12.85, 64, 64);
    planetGroup.add(new THREE.Mesh(haloGeo, haloMat));

    // ── Star field — three depth layers ─────────────────────────────────
    // bg 60%: r=120-175, tiny/faint, slow twinkle (deep field)
    // mid 30%: r=78-115, medium, moderate twinkle
    // near 10%: r=52-72, slightly larger, faster twinkle + soft bloom
    const starCount = isMobile ? 400 : 800;
    const bgEnd  = Math.floor(starCount * 0.60);
    const midEnd = Math.floor(starCount * 0.90);
    const starGeo = new THREE.BufferGeometry();
    const pos    = new Float32Array(starCount * 3);
    const sizes  = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    const speeds = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const snx = Math.sin(phi)*Math.cos(theta), sny = Math.sin(phi)*Math.sin(theta), snz = Math.cos(phi);
      // Noise-based density variation — subtle clusters and voids
      const density = noise.simplex3D(snx*0.85, sny*0.85, snz*0.85) * 0.5 + 0.5;
      let r: number, sBase: number, spBase: number, spRange: number;
      if (i < bgEnd) {
        r = 120 + Math.random()*55; sBase = 0.5 + Math.random()*0.9; spBase = 0.25; spRange = 0.30;
      } else if (i < midEnd) {
        r = 78  + Math.random()*37; sBase = 1.0 + Math.random()*1.2; spBase = 0.65; spRange = 0.45;
      } else {
        r = 52  + Math.random()*20; sBase = 1.8 + Math.random()*1.4; spBase = 1.20; spRange = 0.60;
      }
      pos[i*3] = r*snx; pos[i*3+1] = r*sny; pos[i*3+2] = r*snz;
      sizes[i]  = sBase * (0.6 + density * 0.8);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = spBase + Math.random() * spRange;
      // Physically-inspired color: ~60% warm-white (G/F), ~22% blue-white (A/B), ~18% orange (K)
      const cr = Math.random();
      if (cr < 0.60) {
        colors[i*3]=1.00; colors[i*3+1]=0.96+Math.random()*0.02; colors[i*3+2]=0.90+Math.random()*0.06;
      } else if (cr < 0.82) {
        colors[i*3]=0.88+Math.random()*0.08; colors[i*3+1]=0.92+Math.random()*0.04; colors[i*3+2]=1.00;
      } else {
        colors[i*3]=1.00; colors[i*3+1]=0.78+Math.random()*0.14; colors[i*3+2]=0.62+Math.random()*0.14;
      }
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos,    3));
    starGeo.setAttribute("aSize",    new THREE.BufferAttribute(sizes,  1));
    starGeo.setAttribute("aPhase",   new THREE.BufferAttribute(phases, 1));
    starGeo.setAttribute("aSpeed",   new THREE.BufferAttribute(speeds, 1));
    starGeo.setAttribute("aColor",   new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.ShaderMaterial({
      uniforms:       { uTime: { value: 0 } },
      vertexShader:   STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Distant Moon — secondary planetary body, upper-left of viewport ──
    // World position (-7, 10, -38): appears ~31% from left, ~33% from top
    // at camera z=18, FOV 36°. Radius 1.4 ≈ 15% of screen height.
    const moonTex = buildMoonTexture();
    const moonGeo = new THREE.SphereGeometry(1.4, 48, 48);
    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        tMoon:   { value: moonTex },
        vSunDir: { value: new THREE.Vector3() },
      },
      vertexShader:   MOON_VERT,
      fragmentShader: MOON_FRAG,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(-7, 10, -38);
    scene.add(moonMesh);
    // Share sun direction with Moon
    const moonUpdateSun = () => {
      const rad = (SUN_ANGLE_DEG * Math.PI) / 180;
      moonMat.uniforms.vSunDir.value.set(Math.cos(rad), 0.18, Math.sin(rad)).normalize();
    };
    moonUpdateSun();

    // ── Earth + cloud meshes (built after textures load) ─────────────────
    let earthMesh: THREE.Mesh | null = null;
    let cloudMesh: THREE.Mesh | null = null;
    let earthMat:  THREE.ShaderMaterial | null = null;
    let cloudMat:  THREE.ShaderMaterial | null = null;

    type TexSet = { day: THREE.Texture; night: THREE.Texture; specular: THREE.Texture; bump: THREE.Texture };

    function setupEarth(t: TexSet) {
      if (destroyed) { Object.values(t).forEach(tx => tx.dispose()); return; }

      const cloudTex = buildCloudTexture(noise);

      // Earth sphere
      const earthGeo = new THREE.SphereGeometry(12.2, segs, segs);
      earthMat = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse:  { value: t.day },  tSpecular: { value: t.specular },
          tNight:    { value: t.night }, tNormal:   { value: t.bump },
          vSunDir:             { value: new THREE.Vector3() },
          atmosphereIntensity: { value: 0.44 },
          specularIntensity:   { value: 0.48 },
          bumpStrength:        { value: 0.75 },
        },
        vertexShader:   EARTH_VERT,
        fragmentShader: EARTH_FRAG,
      });
      earthMesh = new THREE.Mesh(earthGeo, earthMat);
      planetGroup.add(earthMesh);

      // Cloud sphere
      const cloudGeo = new THREE.SphereGeometry(12.35, segs, segs);
      cloudMat = new THREE.ShaderMaterial({
        uniforms: {
          tClouds:      { value: cloudTex },
          vSunDir:      { value: new THREE.Vector3() },
          cloudOpacity: { value: 0.28 },
        },
        vertexShader:   CLOUD_VERT,
        fragmentShader: CLOUD_FRAG,
        transparent: true,
        depthWrite:  false,
        blending:    THREE.NormalBlending,
      });
      cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      planetGroup.add(cloudMesh);

      updateSun();
    }

    function updateSun() {
      const rad = (SUN_ANGLE_DEG * Math.PI) / 180;
      const dir = new THREE.Vector3(Math.cos(rad), 0.18, Math.sin(rad)).normalize();
      if (earthMat) earthMat.uniforms.vSunDir.value.copy(dir);
      if (cloudMat) cloudMat.uniforms.vSunDir.value.copy(dir);
      haloMat.uniforms.vSunDir.value.copy(dir);
      sunMesh.position.copy(dir.clone().multiplyScalar(110));
      sunMesh.lookAt(0, 0, 0);
    }

    // ── Texture loading with procedural fallback ─────────────────────────
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    let loaded: Partial<TexSet> = {};
    let loadedCount = 0;
    let fallbackUsed = false;

    function onLoad(key: keyof TexSet, tex: THREE.Texture) {
      if (destroyed || fallbackUsed) { tex.dispose(); return; }
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      loaded[key] = tex;
      if (++loadedCount === 4) setupEarth(loaded as TexSet);
    }
    function onError() {
      if (destroyed || fallbackUsed) return;
      fallbackUsed = true;
      Object.values(loaded).forEach(tx => tx.dispose());
      setupEarth(buildFallbackTextures(noise));
    }
    (["day","night","specular","bump"] as const).forEach((k) => {
      loader.load(CDN[k], (t) => onLoad(k, t), undefined, onError);
    });

    // ── Render loop ──────────────────────────────────────────────────────
    let rafId = 0;
    let rotY  = 1.6; // initial angle (matches reference implementation)
    const t0  = performance.now();

    function tick() {
      rafId = requestAnimationFrame(tick);
      rotY += SPIN_PER_FRAME;
      planetGroup.rotation.y = rotY;
      if (cloudMesh) cloudMesh.rotation.y += 0.00018; // clouds drift faster than surface
      moonMesh.rotation.y += 0.00008; // very slow — near-tidally-locked drift
      starMat.uniforms.uTime.value = (performance.now() - t0) * 0.001;
      renderer.render(scene, camera);
    }

    // ── Resize ───────────────────────────────────────────────────────────
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    updateSun();
    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      tick();
    }

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      spaceTex.dispose(); spaceMat.dispose(); spaceGeo.dispose();
      sunTex.dispose();   sunMat.dispose();   sunGeo.dispose();
      haloMat.dispose();  haloGeo.dispose();
      starGeo.dispose();  starMat.dispose();
      moonTex.dispose();  moonMat.dispose();  moonGeo.dispose();
      if (earthMesh) earthMesh.geometry.dispose();
      if (earthMat) {
        (["tDiffuse","tSpecular","tNight","tNormal"] as const)
          .forEach(k => earthMat!.uniforms[k]?.value?.dispose());
        earthMat.dispose();
      }
      if (cloudMesh) cloudMesh.geometry.dispose();
      if (cloudMat) { cloudMat.uniforms.tClouds?.value?.dispose(); cloudMat.dispose(); }
      renderer.dispose();
    };
  }, [reduceMotion]);

  return (
    <motion.div
      aria-hidden
      style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}
    >
      {/* Canvas — blur(0.35px) softens the sharp WebGL render into a cinematic feel */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          filter: "blur(0.35px) saturate(0.88)",
        }}
      />

      {/* Ultra-faint film grain — SVG fractal noise tiled at 512px, overlay blend */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23g)' opacity='0.012'/%3E%3C/svg%3E\")",
          backgroundSize: "512px 512px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Cinematic dark overlay — dims the WebGL scene to luxury background level */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.46)",
          pointerEvents: "none",
        }}
      />

      {/* Soft atmospheric horizon band — restrained blue edge along the planet arc */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 28% at 50% 88%, rgba(18,52,96,0.22) 0%, rgba(8,20,44,0.10) 55%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Edge vignette — crushes corners and side edges to black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 68% 58% at 50% 60%, transparent 0%, rgba(0,0,0,0.50) 52%, rgba(0,0,0,0.88) 76%, rgba(0,0,0,0.97) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Side-edge crush — additional lateral darkening */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top-sky crush — keeps headline area dark even when globe arc is bright */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.28) 32%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

    </motion.div>
  );
}
