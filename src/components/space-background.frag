// Retro space scene: chunky pixel-block planets with engraved contour lines,
// a sparse stippled nebula and single-pixel stars. The canvas renders at a
// low resolution and CSS scales it up with `image-rendering: pixelated`.
// Behind text blocks ([data-bg-quiet]) the scene dissolves to a calm void.
// See space-background.ts for the uniforms and planet layout.

precision highp float;
uniform vec2 uRes;      // CSS px
uniform float uScale;   // canvas px per CSS px
uniform float uTime;
uniform vec2 uMouse;    // -1..1, eased
uniform vec4 uGiant;    // x, y, r, depth  (CSS px, y down)
uniform vec4 uRock;
uniform vec3 uLight;
uniform vec3 uVoid;
uniform vec3 uMagenta;
uniform vec3 uStarlight;
uniform float uDim;        // planet brightness, set per page for readability
uniform float uStars;      // star density multiplier
uniform vec4 uQuiet[4];    // text rects to keep calm: x, y, w, h in CSS px
uniform float uQuietCount;

const float PARALLAX = 0.3;
const float TWINKLE_SHARE = 0.12;  // share of stars that blink at all
const float TWINKLE_SPEED = 0.35;

float T;      // scene time, stepped to 8fps
float gIso;   // surface value the contour lines follow
float gLine;  // contour line mask from the last planet() call
float gEdge;  // signed distance to the nearest planet silhouette, CSS px

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

// Ordered dither thresholds in 0..1.
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float lum(vec3 c) { return dot(c, vec3(0.3, 0.59, 0.11)); }

// Single-pixel stars, at most one per cell. A few blink slowly.
float starPix(vec2 p, float cell, float density, float seed) {
  vec2 id = floor(p / cell);
  float h = hash12(id + seed);
  density *= uStars;
  if (h > density) return 0.0;
  vec2 pos = (0.15 + 0.7 * hash22(id + seed * 1.3)) * cell;
  vec2 d = abs(p - id * cell - pos);
  float on = step(max(d.x, d.y), 0.5 / uScale);
  float blinks = step(h / density, TWINKLE_SHARE);
  float off = step(fract(T * (0.2 + h) * TWINKLE_SPEED + h * 9.0), 0.25);
  return on * (1.0 - blinks * off);
}

float starsAt(vec2 p) {
  vec2 m = uMouse * PARALLAX;
  return max(max(
    starPix(p - m * 5.0, 22.0, 0.30, 1.0),
    starPix(p - m * 11.0, 54.0, 0.40, 17.0)),
    starPix(p - m * 20.0, 130.0, 0.50, 41.0));
}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c,0,-s, 0,1,0, s,0,c); }
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c,-s,s,c); }

vec3 giantSurface(vec3 n) {
  float warp = fbm3(n * 2.2 + vec3(0.0, 0.0, T * 0.01), 3);
  float band = sin(n.y * 14.0 + warp * 5.5) * 0.5 + 0.5;
  float storm = smoothstep(0.62, 0.78, fbm3(n * vec3(4.0, 7.0, 4.0) + 3.0, 2));
  gIso = n.y * 14.0 + warp * 5.5;
  vec3 c = mix(vec3(0.09, 0.17, 0.24), vec3(0.27, 0.38, 0.45), band);
  return mix(c, vec3(0.55, 0.45, 0.42), storm * 0.5);
}
vec3 rockSurface(vec3 n) {
  float b = fbm3(n * 3.0 + vec3(10.0, 0.0, 0.0), 4);
  float craters = smoothstep(0.62, 0.7, fbm3(n * 11.0, 2));
  gIso = b * 9.0;
  vec3 c = mix(vec3(0.07, 0.13, 0.11), vec3(0.30, 0.36, 0.32), b);
  c = mix(c, vec3(0.05, 0.08, 0.07), craters * 0.3);
  float ice = smoothstep(0.78, 0.92, abs(n.y) + b * 0.15);
  return mix(c, vec3(0.72, 0.76, 0.78), ice * 0.8);
}

// Lit planet color at p (alpha = coverage). Sets gLine and folds the
// silhouette distance into gEdge.
vec4 planet(vec2 p, vec4 P, float tilt, float spin, vec3 atmo, bool giant) {
  vec2 d = (p - P.xy) / P.z;
  float l = length(d);
  gLine = 0.0;
  gEdge = min(gEdge, (l - 1.0) * P.z);
  if (l > 1.0) return vec4(0.0);

  vec3 n = vec3(d, sqrt(1.0 - l * l));
  float diffuse = dot(n, uLight);
  float light = smoothstep(-0.12, 0.55, diffuse);
  vec3 s = n;
  s.xy = rot2(tilt) * s.xy;
  s = rotY(T * spin) * s;
  vec3 c = giant ? giantSurface(s) : rockSurface(s);
  float limb = 0.55 + 0.45 * sqrt(n.z);
  float facing = l > 0.0 ? dot(d / l, uLight.xy) : 0.0;
  float rim = pow(1.0 - n.z, 2.5) * smoothstep(-0.3, 0.6, facing);
  vec3 col = c * (0.035 + light * limb * 0.95) + atmo * rim * 0.9;

  // Engraved contours on the lit side, thinner toward the limb.
  float k = abs(fract(gIso / 3.14159) - 0.5);
  gLine = step(0.5 - 0.09 * n.z, k) * smoothstep(-0.25, 0.3, diffuse);
  return vec4(col, 1.0);
}

// Scene color at CSS px p, with the contour line mask in .a.
vec4 scene(vec2 p) {
  vec2 m = uMouse * PARALLAX;
  vec2 np = (p - m * 3.0) / uRes.y;
  float neb = fbm2(np * 2.2 + fbm2(np * 1.4 + T * 0.004) * 1.5);
  vec3 col = uVoid;
  col += uMagenta * smoothstep(0.45, 0.9, neb) * 0.1 * (1.0 - np.y * 0.6);
  col += vec3(0.12, 0.2, 0.3) * smoothstep(0.5, 0.95, fbm2(np * 3.0 + 9.0)) * 0.14;

  gEdge = 1e5;
  vec4 rock = planet(p - m * 34.0 * uRock.w, uRock, 0.2, 0.025, vec3(0.6, 0.85, 0.75), false);
  col = mix(col, rock.rgb * uDim, rock.a);
  float line = gLine;
  vec4 giant = planet(p - m * 34.0 * uGiant.w, uGiant, -0.35, 0.012, vec3(0.55, 0.75, 0.9), true);
  col = mix(col, giant.rgb * uDim, giant.a);
  line = mix(line, gLine, giant.a);
  return vec4(col, line * uDim);
}

// Scene sampled in 16px blocks that split to 8px where detail changes.
// Also returns the silhouette distance at the chosen sample in .a.
vec4 blockScene(vec2 p) {
  vec3 a = scene((floor(p / 16.0) + 0.5) * 16.0).rgb;
  float ea = gEdge;
  vec3 b = scene((floor(p / 8.0) + 0.5) * 8.0).rgb;
  bool split = abs(lum(a) - lum(b)) > 0.03;
  return split ? vec4(b, gEdge) : vec4(a, ea);
}

// Brightness above the void, mapped to 0..1.
float tone(vec3 c, float gain) {
  return clamp((lum(c) - lum(uVoid) - 0.012) * gain, 0.0, 0.999);
}

// Dither t across the blue planet ramp with 2x2 patterns.
vec3 blueRamp(float t, vec2 fc) {
  t *= 4.0;
  float k = floor(t);
  float f = floor(fract(t) * 4.0) / 4.0;
  vec3 r1 = vec3(0.12, 0.16, 0.30);
  vec3 r2 = vec3(0.30, 0.42, 0.68);
  vec3 r3 = vec3(0.55, 0.72, 0.95);
  vec3 lo = k < 1.0 ? uVoid : k < 2.0 ? r1 : k < 3.0 ? r2 : r3;
  vec3 hi = k < 1.0 ? r1 : k < 2.0 ? r2 : k < 3.0 ? r3 : uStarlight;
  return mix(lo, hi, step(bayer2(fc) + 0.01, f));
}

// 1 inside the quiet rects, dissolving to 0 over ~56px around them in
// dithered 8px blocks.
float quietAt(vec2 p) {
  vec2 c = (floor(p / 8.0) + 0.5) * 8.0;
  float d = 1e5;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uQuietCount) break;
    vec4 r = uQuiet[i];
    vec2 q = abs(c - (r.xy + r.zw * 0.5)) - (r.zw * 0.5 + 24.0);
    d = min(d, length(max(q, 0.0)) + min(max(q.x, q.y), 0.0));
  }
  float q = 1.0 - clamp(d / 56.0, 0.0, 1.0);
  return step(bayer4(floor(p / 8.0)) + 0.001, q);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 p = vec2(fc.x, uRes.y * uScale - fc.y) / uScale;
  T = floor(uTime * 8.0) / 8.0;

  float calm = quietAt(p);
  vec4 block = blockScene(p);
  vec3 o;
  if (block.a < 0.0) {
    // Planets: chunky blocks with contours on a 4px grid. Behind text
    // they drop to the two darkest ramp steps and lose their lines.
    o = blueRamp(tone(block.rgb, 3.4) * (1.0 - calm * 0.75), fc);
    float line = scene((floor(p / 4.0) + 0.5) * 4.0).a;
    o = mix(o, uStarlight, line * 0.7 * (1.0 - calm));
  } else {
    // Sky: magenta stipple nebula and stars, cleared behind text.
    float t = tone(scene(p).rgb, 2.2) * (1.0 - calm);
    o = mix(uVoid, uMagenta * 0.75, step(bayer8(fc) + 0.004, t));
    o = mix(o, uStarlight, step(0.3, starsAt(p)) * (1.0 - calm));
  }
  gl_FragColor = vec4(o, 1.0);
}
