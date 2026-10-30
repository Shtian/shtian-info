// PROTOTYPE — Variant "three": a real 3D scene with three.js (lazy-loaded,
// ~130 kB gz). Stars are a single Points cloud at true depths, so parallax
// comes from moving the camera, not from faking layer offsets. Planets are
// lit spheres with baked equirectangular textures, a fresnel atmosphere
// shell, a ring on the giant and a small orbiting moon.

import * as THREE from "three";

import {
  createCanvas,
  createParallax,
  LIGHT,
  mulberry32,
  onResize,
  planetLayout,
  type Rgb,
  SURFACES,
  startLoop,
  stats,
} from "./shared";

function bakeEquirect(
  surface: (x: number, y: number, z: number) => Rgb,
  width: number
) {
  const height = width / 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const lat = (0.5 - y / height) * Math.PI;
    const cl = Math.cos(lat);
    const sy = Math.sin(lat);
    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const c = surface(cl * Math.sin(lon), sy, cl * Math.cos(lon));
      const i = (y * width + x) * 4;
      img.data[i] = c[0] * 255;
      img.data[i + 1] = c[1] * 255;
      img.data[i + 2] = c[2] * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function atmosphere(radius: number, color: THREE.Color, sunDir: THREE.Vector3) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.12, 64, 32),
    new THREE.ShaderMaterial({
      uniforms: { uColor: { value: color }, uSun: { value: sunDir } },
      vertexShader: `
        varying vec3 vN; varying vec3 vView; varying vec3 vWorldN;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vWorldN = normalize(mat3(modelMatrix) * normal);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform vec3 uSun;
        varying vec3 vN; varying vec3 vView; varying vec3 vWorldN;
        void main() {
          float glow = pow(smoothstep(0.0, 0.45, dot(-vN, vView)), 2.0);
          float lit = smoothstep(-0.35, 0.6, dot(vWorldN, uSun));
          gl_FragColor = vec4(uColor * glow * lit * 1.4, glow * lit);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
}

function ringTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1;
  const ctx = c.getContext("2d")!;
  const rand = mulberry32(7);
  for (let x = 0; x < 512; x++) {
    const t = x / 512;
    const gap = t > 0.55 && t < 0.6 ? 0.1 : 1;
    const a = (0.15 + rand() * 0.35) * Math.sin(t * Math.PI) * gap;
    ctx.fillStyle = `rgba(200,210,215,${a})`;
    ctx.fillRect(x, 0, 1, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function starfield(count: number) {
  const rand = mulberry32(99);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const tints = [
    [1, 1, 1],
    [0.87, 0.91, 1],
    [1, 0.93, 0.85],
    [0.91, 0.86, 1],
  ];
  for (let i = 0; i < count; i++) {
    // Box in front of the camera, from just behind the planets to far away.
    const z = -200 - rand() * 1800;
    const spread = -z * 0.75;
    pos[i * 3] = (rand() * 2 - 1) * spread * 1.6;
    pos[i * 3 + 1] = (rand() * 2 - 1) * spread;
    pos[i * 3 + 2] = z;
    size[i] = 0.6 + rand() ** 3 * 2.2;
    seed[i] = rand();
    const t = tints[Math.floor(rand() * tints.length)];
    color.set(t, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geo.setAttribute("color", new THREE.BufferAttribute(color, 3));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 } },
    vertexShader: `
      attribute float aSize; attribute float aSeed; attribute vec3 color;
      uniform float uTime; uniform float uPx;
      varying float vA; varying vec3 vC;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = aSeed > 0.7 ? 0.6 + 0.4 * sin(uTime * (0.5 + aSeed * 2.5) + aSeed * 50.0) : 1.0;
        vA = (0.3 + 0.7 * aSeed) * tw * smoothstep(2000.0, 600.0, -mv.z) ;
        vA = max(vA, 0.18 * tw);
        vC = color;
        gl_PointSize = max(aSize * uPx * 2.0, 1.5);
      }`,
    fragmentShader: `
      varying float vA; varying vec3 vC;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = smoothstep(1.0, 0.0, d);
        a = a * a;
        gl_FragColor = vec4(vC, a * vA);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

export function mount(host: HTMLElement) {
  const canvas = createCanvas();
  host.append(canvas);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 1, 4000);
  const CAMERA_Z = 600;
  camera.position.z = CAMERA_Z;

  // three.js: +y up. Our LIGHT is screen-space (+y down).
  const sunDir = new THREE.Vector3(LIGHT[0], -LIGHT[1], LIGHT[2]).normalize();
  const sun = new THREE.DirectionalLight(0xfff4e8, 2.4);
  sun.position.copy(sunDir).multiplyScalar(1000);
  scene.add(sun, new THREE.AmbientLight(0x6070a0, 0.08));

  const t0 = performance.now();
  const stars = starfield(2600);
  scene.add(stars);

  const giant = new THREE.Group();
  const giantMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.MeshStandardMaterial({
      map: bakeEquirect(SURFACES.giant, 1024),
      roughness: 1,
      metalness: 0,
    })
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.35, 2.2, 128, 1),
    new THREE.MeshStandardMaterial({
      map: ringTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 1,
      depthWrite: false,
    })
  );
  // RingGeometry UVs are planar; remap u to radius so the 1D texture works.
  {
    const p = ring.geometry.attributes.position;
    const uv = ring.geometry.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const r = Math.hypot(p.getX(i), p.getY(i));
      uv.setXY(i, (r - 1.35) / (2.2 - 1.35), 0.5);
    }
  }
  ring.rotation.x = Math.PI / 2 - 0.5;
  giant.add(
    giantMesh,
    ring,
    atmosphere(1, new THREE.Color(0.55, 0.75, 0.9), sunDir)
  );
  giant.rotation.z = 0.35;
  scene.add(giant);

  const rock = new THREE.Group();
  const rockMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 48),
    new THREE.MeshStandardMaterial({
      map: bakeEquirect(SURFACES.rock, 512),
      roughness: 0.95,
    })
  );
  rock.add(rockMesh, atmosphere(1, new THREE.Color(0.6, 0.85, 0.75), sunDir));
  rock.rotation.z = -0.2;
  scene.add(rock);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x8a8580, roughness: 1 })
  );
  scene.add(moon);
  const bakeMs = performance.now() - t0;

  // Place planets so their projected size/position matches planetLayout().
  // At depth z the visible height is 2*tan(fov/2)*(CAMERA_Z - z).
  const worldPerPx = (z: number) =>
    (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (CAMERA_Z - z)) /
    window.innerHeight;
  const place = (
    obj: THREE.Object3D,
    p: { x: number; y: number; r: number },
    z: number
  ) => {
    const k = worldPerPx(z);
    obj.position.set(
      (p.x - window.innerWidth / 2) * k,
      (window.innerHeight / 2 - p.y) * k,
      z
    );
    obj.scale.setScalar(p.r * k);
  };

  const setup = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const layout = planetLayout(w, h);
    place(giant, layout.giant, 120); // closest to camera, biggest parallax
    place(rock, layout.rock, -250);
    stats.note = `texture bake ${bakeMs.toFixed(0)}ms · ${renderer.getPixelRatio()}x px ratio`;
  };
  setup();
  onResize(setup);

  const parallax = createParallax();
  const starMat = stars.material as THREE.ShaderMaterial;
  starMat.uniforms.uPx.value = renderer.getPixelRatio();

  startLoop((t) => {
    parallax.step();
    // Move the camera, keep looking at a point behind the scene: nearer
    // objects shift more, which is exactly the parallax we want.
    camera.position.x = parallax.current.x * 18;
    camera.position.y = -parallax.current.y * 12;
    camera.lookAt(0, 0, -1200);

    giantMesh.rotation.y = t * 0.03;
    rockMesh.rotation.y = t * 0.06;
    const a = t * 0.12;
    moon.position.set(
      rock.position.x + Math.cos(a) * rock.scale.x * 2.6,
      rock.position.y + Math.sin(a) * rock.scale.x * 0.5,
      rock.position.z + Math.sin(a) * rock.scale.x * 2.6
    );
    moon.scale.setScalar(rock.scale.x * 0.18);
    starMat.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  });
}
