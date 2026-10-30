// PROTOTYPE — throwaway. Shared plumbing for the background variants:
// smoothed pointer parallax, a capped RAF loop that pauses when hidden,
// and perf stats piped to the switcher HUD.

export const VARIANTS = [
  { key: "canvas", name: "Canvas 2D sprites" },
  { key: "shader", name: "WebGL shader" },
  { key: "three", name: "three.js 3D" },
  { key: "current", name: "Current (tsparticles + CSS)" },
] as const;

export type VariantKey = (typeof VARIANTS)[number]["key"];

export const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// Palette from DESIGN.md, in linear-ish sRGB 0..1 for shaders.
export const COLORS = {
  void: [0.118, 0.118, 0.122] as const, // oklch(18.98% 0 294)
  magenta: [0.62, 0.25, 0.72] as const, // plasma-magenta
  comet: [0.93, 0.77, 0.3] as const, // comet-yellow
};

/** Pointer position in -1..1, eased toward the target every frame. */
export function createParallax(ease = 0.05) {
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  if (finePointer && !reducedMotion) {
    window.addEventListener(
      "pointermove",
      (e) => {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
    document.addEventListener("pointerleave", () => {
      target.x = 0;
      target.y = 0;
    });
  }
  return {
    current,
    /** Returns true while still settling (i.e. a redraw is useful). */
    step() {
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      current.x += dx * ease;
      current.y += dy * ease;
      return Math.abs(dx) + Math.abs(dy) > 0.0005;
    },
  };
}

export const stats = { fps: 0, ms: 0, drawn: 0, note: "" };

/**
 * RAF loop with optional fps cap. `frame` returns false to say "nothing
 * changed, skip". Pauses while the tab is hidden. Under reduced motion it
 * draws a single frame.
 */
export function startLoop(
  frame: (t: number, dt: number) => boolean | void,
  { maxFps = 60 } = {}
) {
  if (reducedMotion) {
    frame(0, 0);
    stats.note = "reduced motion: static frame";
    return;
  }
  const minDelta = 1000 / maxFps - 1;
  let last = 0;
  let acc = 0;
  let frames = 0;
  let msSum = 0;
  let windowStart = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = now - last;
    if (dt < minDelta) return;
    last = now;
    acc += 1;
    const t0 = performance.now();
    if (frame(now / 1000, Math.min(dt, 100) / 1000) !== false) {
      frames += 1;
      msSum += performance.now() - t0;
    }
    if (now - windowStart > 1000) {
      stats.fps = Math.round((acc * 1000) / (now - windowStart));
      stats.drawn = frames;
      stats.ms = frames ? msSum / frames : 0;
      acc = frames = msSum = 0;
      windowStart = now;
    }
  };
  raf = requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  });
}

export function onResize(cb: () => void) {
  let timer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = window.setTimeout(cb, 150);
  });
}

/** Cheap seeded PRNG so layouts are stable across reloads. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100lvh;z-index:-50;pointer-events:none;";
  return canvas;
}

// Value noise + fbm for one-off texture bakes (CPU). Not for per-frame use.
const PERM = new Uint8Array(512);
{
  const rand = mulberry32(1337);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}
const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const h3 = (x: number, y: number, z: number) =>
  PERM[PERM[PERM[x & 255] + (y & 255)] + (z & 255)] / 255;

export function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);
  return lerp(
    lerp(
      lerp(h3(xi, yi, zi), h3(xi + 1, yi, zi), u),
      lerp(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), u),
      v
    ),
    lerp(
      lerp(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), u),
      lerp(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), u),
      v
    ),
    w
  );
}

export function fbm3(x: number, y: number, z: number, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise3(x * freq, y * freq, z * freq);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum / (1 - 0.5 ** octaves);
}

export type Rgb = readonly [number, number, number];
export const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Surface colour functions shared by the canvas bake and three.js textures.
 *  Input is a unit-sphere point; output is sRGB 0..1. */
export const SURFACES = {
  // Big banded gas giant: muted sky/slate, like the old sky-950 planet.
  giant(x: number, y: number, z: number): Rgb {
    const warp = fbm3(x * 2.2, y * 2.2, z * 2.2, 4);
    const band = Math.sin(y * 14 + warp * 5.5) * 0.5 + 0.5;
    const fine = fbm3(x * 9, y * 26, z * 9, 3);
    const storm = smoothstep(0.66, 0.8, fbm3(x * 4 + 3, y * 7, z * 4, 3));
    let c = mix([0.09, 0.17, 0.24], [0.27, 0.38, 0.45], band);
    c = mix(c, [0.48, 0.55, 0.58], fine * 0.35);
    c = mix(c, [0.55, 0.45, 0.42], storm * 0.5);
    return c;
  },
  // Small rocky/icy world: muted emerald + grey, like the old emerald-950.
  rock(x: number, y: number, z: number): Rgb {
    const n = fbm3(x * 3 + 10, y * 3, z * 3, 5);
    const ridges = 1 - Math.abs(fbm3(x * 6, y * 6, z * 6, 3) * 2 - 1);
    const craters = smoothstep(0.62, 0.7, fbm3(x * 11, y * 11, z * 11, 2));
    let c = mix([0.07, 0.13, 0.11], [0.24, 0.31, 0.27], n);
    c = mix(c, [0.36, 0.4, 0.37], ridges ** 4 * 0.6);
    c = mix(c, [0.05, 0.08, 0.07], craters * 0.3);
    const ice = smoothstep(0.78, 0.92, Math.abs(y) + n * 0.15);
    return mix(c, [0.72, 0.76, 0.78], ice * 0.8);
  },
};

// Light comes from off-screen upper right, slightly toward the viewer.
// Screen space: +x right, +y down, +z toward the viewer.
export const LIGHT = (() => {
  const v = [0.72, -0.5, 0.18];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l] as const;
})();

/** Planet framing in CSS px, shared so variants compare like for like. */
export function planetLayout(w: number, h: number) {
  const giantR = Math.max(200, Math.min(w * 0.3, h * 0.48));
  const rockR = giantR * 0.3;
  return {
    giant: { x: w * 0.7, y: h + giantR * 0.38, r: giantR, depth: 1 },
    rock: { x: w * 0.2, y: h - rockR * 1.4, r: rockR, depth: 0.55 },
  };
}
