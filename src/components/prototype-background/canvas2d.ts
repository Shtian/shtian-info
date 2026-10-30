// PROTOTYPE — Variant "canvas": plain Canvas 2D, zero dependencies.
// Planets are path-traced once on the CPU into sprites (lit sphere, banded
// surface, atmosphere halo); every frame just blits sprites and a few hundred
// star rects with a parallax offset. Cheap per frame, one-off bake cost.

import {
  createCanvas,
  createParallax,
  LIGHT,
  mulberry32,
  onResize,
  planetLayout,
  type Rgb,
  SURFACES,
  smoothstep,
  startLoop,
  stats,
} from "./shared";

type Star = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  layer: number;
  twinkle: number;
  tint: string;
};

const LAYER_SHIFT = [5, 11, 20]; // px of parallax at full pointer deflection
const PLANET_SHIFT = 34;

function bakePlanet(
  r: number,
  dpr: number,
  surface: (x: number, y: number, z: number) => Rgb,
  atmosphere: Rgb,
  tilt: number
) {
  const halo = r * 0.22;
  const R = Math.ceil((r + halo) * dpr);
  const size = R * 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const data = img.data;
  const rp = r * dpr;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const [lx, ly, lz] = LIGHT;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const dx = (px - R + 0.5) / rp;
      const dy = (py - R + 0.5) / rp;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2);
      const i = (py * size + px) * 4;
      // How lit this side of the disc is, used for both halo and rim.
      const facing = d > 0 ? (dx * lx + dy * ly) / d : 0;

      if (d2 <= 1) {
        const nz = Math.sqrt(1 - d2);
        const diffuse = dx * lx + dy * ly + nz * lz;
        const light = smoothstep(-0.12, 0.55, diffuse);
        // Rotate into planet space (axial tilt) for texture lookup.
        const sx = dx * cosT - dy * sinT;
        const sy = dx * sinT + dy * cosT;
        const c = surface(sx, sy, nz);
        const limb = 0.55 + 0.45 * Math.sqrt(nz);
        const fres = (1 - nz) ** 2.5;
        const rim = fres * smoothstep(-0.3, 0.6, facing);
        // Edge AA: fade the last pixel of the disc.
        const edge = Math.min(1, (1 - d) * rp);
        const ambient = 0.035;
        for (let k = 0; k < 3; k++) {
          const v =
            c[k] * (ambient + light * limb * 0.95) + atmosphere[k] * rim * 0.9;
          data[i + k] = Math.min(255, v * 255);
        }
        data[i + 3] = 255 * Math.max(0, edge);
        if (edge < 1) {
          // Blend halo underneath the AA edge.
          const a = data[i + 3] / 255;
          const glow = smoothstep(-0.4, 0.7, facing) * 0.55;
          for (let k = 0; k < 3; k++) {
            data[i + k] =
              data[i + k] * a + atmosphere[k] * 255 * glow * (1 - a);
          }
          data[i + 3] = 255 * Math.max(a, glow * (1 - a));
        }
      } else {
        const out = (d - 1) / (halo / r);
        if (out > 1) continue;
        const glow = (1 - out) ** 3 * smoothstep(-0.4, 0.7, facing) * 0.55;
        data[i] = atmosphere[0] * 255;
        data[i + 1] = atmosphere[1] * 255;
        data[i + 2] = atmosphere[2] * 255;
        data[i + 3] = glow * 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return { canvas, half: R / dpr };
}

function bakeNebula(w: number, h: number) {
  // Half-res: it's all soft gradients, upscaling is free quality-wise.
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(w / 2);
  canvas.height = Math.ceil(h / 2);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(0.5, 0.5);
  const blobs: [number, number, number, string][] = [
    [0.18, 0.2, 0.55, "oklch(55.7% 0.199 314.53 / 0.07)"],
    [0.85, 0.15, 0.45, "oklch(45% 0.09 250 / 0.08)"],
    [0.55, 0.85, 0.7, "oklch(40% 0.06 220 / 0.10)"],
    [0.05, 0.9, 0.4, "oklch(50% 0.1 170 / 0.05)"],
  ];
  for (const [x, y, r, color] of blobs) {
    const rad = r * Math.max(w, h);
    const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, rad);
    g.addColorStop(0, color);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  return canvas;
}

function makeStars(w: number, h: number): Star[] {
  const rand = mulberry32(42);
  const count = Math.round((w * h) / 3200);
  const tints = ["#ffffff", "#dfe8ff", "#ffeeda", "#e9dcff"];
  return Array.from({ length: count }, () => {
    const layer = rand() < 0.6 ? 0 : rand() < 0.7 ? 1 : 2;
    return {
      x: rand() * (w + 60) - 30,
      y: rand() * (h + 60) - 30,
      size: (0.5 + rand() * 0.6) * (1 + layer * 0.45),
      alpha: 0.25 + rand() * 0.5 + layer * 0.12,
      layer,
      twinkle: rand() < 0.25 ? 0.5 + rand() * 2 : 0,
      tint: tints[Math.floor(rand() * tints.length)],
    };
  });
}

export function mount(host: HTMLElement) {
  const canvas = createCanvas();
  host.append(canvas);
  const ctx = canvas.getContext("2d", { alpha: true })!;
  const parallax = createParallax();

  let w = 0;
  let h = 0;
  let dpr = 1;
  let stars: Star[] = [];
  let nebula: HTMLCanvasElement;
  let planets: {
    sprite: { canvas: HTMLCanvasElement; half: number };
    x: number;
    y: number;
    depth: number;
  }[] = [];
  let shooting: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  } | null = null;
  let nextShoot = 4;

  const setup = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    stars = makeStars(w, h);
    nebula = bakeNebula(w, h);
    const t0 = performance.now();
    const layout = planetLayout(w, h);
    // Sprites are baked at <=1.5x; they're soft enough that 2x isn't visible.
    const bakeDpr = Math.min(dpr, 1.5);
    planets = [
      {
        sprite: bakePlanet(
          layout.giant.r,
          bakeDpr,
          SURFACES.giant,
          [0.55, 0.75, 0.9],
          -0.35
        ),
        ...layout.giant,
      },
      {
        sprite: bakePlanet(
          layout.rock.r,
          bakeDpr,
          SURFACES.rock,
          [0.6, 0.85, 0.75],
          0.2
        ),
        ...layout.rock,
      },
    ];
    stats.note = `planet bake ${(performance.now() - t0).toFixed(0)}ms · ${stars.length} stars`;
  };
  setup();
  onResize(setup);

  startLoop((t, dt) => {
    parallax.step();
    const { x: mx, y: my } = parallax.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.drawImage(nebula, -mx * 3, -my * 3, w, h);

    for (const s of stars) {
      const shift = LAYER_SHIFT[s.layer];
      let a = s.alpha;
      if (s.twinkle) a *= 0.6 + 0.4 * Math.sin(t * s.twinkle + s.x);
      ctx.globalAlpha = a;
      ctx.fillStyle = s.tint;
      const x = s.x - mx * shift;
      const y = s.y - my * shift;
      if (s.size > 1.3) {
        ctx.beginPath();
        ctx.arc(x, y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, s.size, s.size);
      }
    }
    ctx.globalAlpha = 1;

    // Occasional shooting star, far layer.
    nextShoot -= dt;
    if (!shooting && nextShoot <= 0) {
      shooting = {
        x: Math.random() * w * 0.7,
        y: Math.random() * h * 0.4,
        vx: 520 + Math.random() * 300,
        vy: 180 + Math.random() * 120,
        life: 0,
      };
      nextShoot = 7 + Math.random() * 10;
    }
    if (shooting) {
      shooting.life += dt;
      shooting.x += shooting.vx * dt;
      shooting.y += shooting.vy * dt;
      const fade = Math.sin(Math.min(1, shooting.life / 0.9) * Math.PI);
      const tail = 0.12;
      const g = ctx.createLinearGradient(
        shooting.x,
        shooting.y,
        shooting.x - shooting.vx * tail,
        shooting.y - shooting.vy * tail
      );
      g.addColorStop(0, `rgba(255,255,255,${0.7 * fade})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(shooting.x - mx * 5, shooting.y - my * 5);
      ctx.lineTo(
        shooting.x - shooting.vx * tail - mx * 5,
        shooting.y - shooting.vy * tail - my * 5
      );
      ctx.stroke();
      if (shooting.life > 0.9) shooting = null;
    }

    for (const p of planets) {
      const shift = PLANET_SHIFT * p.depth;
      const half = p.sprite.half;
      ctx.drawImage(
        p.sprite.canvas,
        p.x - half - mx * shift,
        p.y - half - my * shift,
        half * 2,
        half * 2
      );
    }
  });
}
