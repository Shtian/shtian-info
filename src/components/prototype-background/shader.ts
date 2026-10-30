// PROTOTYPE — Variant "shader": one full-screen fragment shader, raw WebGL,
// zero dependencies. Everything is procedural and alive: planets rotate,
// cloud bands drift, a faint nebula sits behind hashed star layers.
// Cost is GPU fill-rate, so the canvas renders at a pixel budget and is
// upscaled by CSS. Override with `&scale=1` to see full-res cost.

import {
  COLORS,
  createCanvas,
  createParallax,
  LIGHT,
  onResize,
  planetLayout,
  startLoop,
  stats,
} from "./shared";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;      // CSS px
uniform float uScale;   // device px per CSS px actually rendered
uniform float uTime;
uniform vec2 uMouse;    // -1..1
uniform vec4 uGiant;    // x, y, r, depth  (CSS px, y down)
uniform vec4 uRock;
uniform vec3 uLight;
uniform vec3 uVoid;
uniform vec3 uMagenta;
uniform float uDim;     // planet brightness, set per page for readability

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x),
        mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x),
        mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float fbm3(vec3 p, const int oct) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    s += a * noise3(p);
    p = p * 2.03 + 1.7;
    a *= 0.5;
  }
  return s;
}
float noise2(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1,0)), f.x),
             mix(hash12(i + vec2(0,1)), hash12(i + vec2(1,1)), f.x), f.y);
}
float fbm2(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * noise2(p); p = p * 2.1 + 3.1; a *= 0.5; }
  return s;
}

float starLayer(vec2 p, float cell, float density, float size, float seed) {
  vec2 uv = p / cell;
  vec2 id = floor(uv);
  vec2 f = fract(uv);
  float h = hash12(id + seed);
  if (h > density) return 0.0;
  vec2 pos = 0.15 + 0.7 * hash22(id + seed * 1.3);
  // distance in CSS px; floor the radius so stars survive downscaling
  float d = length((f - pos) * cell);
  float r = max(size, 0.75 / uScale);
  float tw = 0.65 + 0.35 * sin(uTime * (0.6 + h * 3.0) + h * 40.0);
  float core = smoothstep(r, 0.0, d);
  float glow = 0.18 * smoothstep(r * 4.0, 0.0, d);
  return (core + glow) * (0.35 + 0.65 * hash12(id + seed + 7.0)) * tw;
}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c,0,-s, 0,1,0, s,0,c); }
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c,-s,s,c); }

vec3 giantSurface(vec3 n) {
  float warp = fbm3(n * 2.2 + vec3(0.0, 0.0, uTime * 0.01), 4);
  float band = sin(n.y * 14.0 + warp * 5.5) * 0.5 + 0.5;
  float fine = fbm3(n * vec3(9.0, 26.0, 9.0) + vec3(uTime * 0.03, 0.0, 0.0), 3);
  float storm = smoothstep(0.62, 0.78, fbm3(n * vec3(4.0, 7.0, 4.0) + 3.0, 3));
  vec3 c = mix(vec3(0.09, 0.17, 0.24), vec3(0.27, 0.38, 0.45), band);
  c = mix(c, vec3(0.48, 0.55, 0.58), fine * 0.35);
  c = mix(c, vec3(0.55, 0.45, 0.42), storm * 0.5);
  return c;
}
vec3 rockSurface(vec3 n) {
  float b = fbm3(n * 3.0 + vec3(10.0, 0.0, 0.0), 5);
  float ridges = 1.0 - abs(fbm3(n * 6.0, 3) * 2.0 - 1.0);
  float craters = smoothstep(0.62, 0.7, fbm3(n * 11.0, 2));
  vec3 c = mix(vec3(0.07, 0.13, 0.11), vec3(0.24, 0.31, 0.27), b);
  c = mix(c, vec3(0.36, 0.40, 0.37), pow(ridges, 4.0) * 0.6);
  c = mix(c, vec3(0.05, 0.08, 0.07), craters * 0.3);
  float ice = smoothstep(0.78, 0.92, abs(n.y) + b * 0.15);
  return mix(c, vec3(0.72, 0.76, 0.78), ice * 0.8);
}

// Returns premultiplied rgba of a planet + halo at pixel p.
vec4 planet(vec2 p, vec4 P, float tilt, float spin, vec3 atmo, bool giant) {
  vec2 d = (p - P.xy) / P.z;
  float l = length(d);
  if (l > 1.25) return vec4(0.0);
  float facing = l > 0.0 ? dot(d / l, uLight.xy) : 0.0;
  float haloA = pow(clamp(1.0 - (l - 1.0) / 0.22, 0.0, 1.0), 3.0)
    * smoothstep(-0.4, 0.7, facing) * 0.55;
  if (l > 1.0) return vec4(atmo * haloA, haloA);

  vec3 n = vec3(d, sqrt(1.0 - l * l));
  float diffuse = dot(n, uLight);
  float light = smoothstep(-0.12, 0.55, diffuse);
  vec3 s = n;
  s.xy = rot2(tilt) * s.xy;
  s = rotY(uTime * spin) * s;
  vec3 c = giant ? giantSurface(s) : rockSurface(s);
  float limb = 0.55 + 0.45 * sqrt(n.z);
  float rim = pow(1.0 - n.z, 2.5) * smoothstep(-0.3, 0.6, facing);
  vec3 col = c * (0.035 + light * limb * 0.95) + atmo * rim * 0.9;
  float aa = clamp((1.0 - l) * P.z * uScale, 0.0, 1.0);
  return vec4(col * aa + atmo * haloA * (1.0 - aa), max(aa, haloA));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uScale - gl_FragCoord.y) / uScale;
  vec2 m = uMouse;

  // Nebula: low-frequency warped fbm, very faint.
  vec2 np = (p - m * 3.0) / uRes.y;
  float neb = fbm2(np * 2.2 + fbm2(np * 1.4 + uTime * 0.004) * 1.5);
  vec3 col = uVoid;
  col += uMagenta * smoothstep(0.45, 0.9, neb) * 0.08 * (1.0 - np.y * 0.6);
  col += vec3(0.12, 0.2, 0.3) * smoothstep(0.5, 0.95, fbm2(np * 3.0 + 9.0)) * 0.12;

  float stars = 0.0;
  stars += starLayer(p - m * 5.0, 26.0, 0.32, 0.55, 1.0) * 0.55;
  stars += starLayer(p - m * 11.0, 60.0, 0.38, 0.8, 17.0) * 0.8;
  stars += starLayer(p - m * 20.0, 140.0, 0.45, 1.1, 41.0);
  col += vec3(0.95, 0.95, 1.0) * stars;

  vec4 rock = planet(p - m * 34.0 * uRock.w, uRock, 0.2, 0.025, vec3(0.6, 0.85, 0.75), false);
  col = col * (1.0 - rock.a) + rock.rgb * uDim;
  vec4 giant = planet(p - m * 34.0 * uGiant.w, uGiant, -0.35, 0.012, vec3(0.55, 0.75, 0.9), true);
  col = col * (1.0 - giant.a) + giant.rgb * uDim;

  // Tiny dither to kill gradient banding in the dark nebula.
  col += (hash12(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function mount(host: HTMLElement) {
  const canvas = createCanvas();
  host.append(canvas);
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    stats.note = "WebGL unavailable";
    return;
  }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const uRes = u("uRes");
  const uScale = u("uScale");
  const uTime = u("uTime");
  const uMouse = u("uMouse");
  const uGiant = u("uGiant");
  const uRock = u("uRock");
  const uDim = u("uDim");
  gl.uniform3fv(u("uLight"), LIGHT);
  gl.uniform3fv(u("uVoid"), COLORS.void);
  gl.uniform3fv(u("uMagenta"), COLORS.magenta);

  const scaleOverride = Number(
    new URLSearchParams(location.search).get("scale")
  );
  // ~1.3M shaded pixels max: a 1440x900 window at 1x, or a retina laptop at ~0.7x.
  const PIXEL_BUDGET = 1.3e6;

  const setup = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale =
      scaleOverride > 0
        ? scaleOverride * dpr
        : Math.min(dpr, Math.sqrt(PIXEL_BUDGET / (w * h)));
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uScale, scale);
    const { giant, rock } = planetLayout(w, h);
    gl.uniform4f(uGiant, giant.x, giant.y, giant.r, giant.depth);
    gl.uniform4f(uRock, rock.x, rock.y, rock.r, rock.depth);
    stats.note = `render ${canvas.width}×${canvas.height} (${(scale / dpr).toFixed(2)}× of dpr ${dpr})`;
  };
  setup();
  onResize(setup);

  // Pages opt into dimmer planets with data-bg-dim on any element; eased so
  // the change animates across view transitions.
  const readDim = () =>
    Number(
      document.querySelector<HTMLElement>("[data-bg-dim]")?.dataset.bgDim ?? 1
    );
  let dimTarget = readDim();
  let dim = dimTarget;
  document.addEventListener("astro:page-load", () => {
    dimTarget = readDim();
  });

  const parallax = createParallax();
  startLoop((t) => {
    parallax.step();
    dim += (dimTarget - dim) * 0.06;
    gl.uniform1f(uDim, dim);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, parallax.current.x, parallax.current.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
}
