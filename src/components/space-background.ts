import fragmentShader from "./space-background.frag?raw";

const vertexShader = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Light from off-screen upper right, slightly toward the viewer.
// Screen space: +x right, +y down, +z toward the viewer.
const LIGHT = normalize([0.72, -0.5, 0.18]);
// Palette from DESIGN.md as sRGB 0..1.
const VOID_BLACK = [0.118, 0.118, 0.122];
const PLASMA_MAGENTA = [0.62, 0.25, 0.72];

// Shaded pixels per frame. Fill rate is the whole cost of this effect, so
// the canvas renders at most this many pixels and CSS scales it up.
const PIXEL_BUDGET_DESKTOP = 1.3e6;
const PIXEL_BUDGET_TOUCH = 0.8e6;
const MAX_FPS = 60;
const PARALLAX_EASE = 0.05;
const DIM_EASE = 0.06;

function normalize(v: number[]) {
  const l = Math.hypot(...v);
  return v.map((n) => n / l);
}

/** Planet framing in CSS px: a big gas giant low on the right, half below
 *  the fold, and a small rocky world on the left. */
function planetLayout(w: number, h: number) {
  const giantR = Math.max(200, Math.min(w * 0.3, h * 0.48));
  const rockR = giantR * 0.3;
  return {
    giant: [w * 0.7, h + giantR * 0.38, giantR, 1],
    rock: [w * 0.2, h - rockR * 1.4, rockR, 0.55],
  };
}

/** Page-controlled planet brightness, read from `data-bg-dim`. */
function readDim() {
  const el = document.querySelector<HTMLElement>("[data-bg-dim]");
  const dim = Number(el?.dataset.bgDim ?? 1);
  return Number.isFinite(dim) ? dim : 1;
}

export function mountSpaceBackground(canvas: HTMLCanvasElement) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  // Without WebGL the page keeps its plain void background.
  if (!gl) return;

  let uniforms: Record<string, WebGLUniformLocation | null> = {};

  const init = () => {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return false;
    }
    gl.useProgram(program);

    // One triangle that covers the whole viewport.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uniforms = Object.fromEntries(
      [
        "uRes",
        "uScale",
        "uTime",
        "uMouse",
        "uGiant",
        "uRock",
        "uLight",
        "uVoid",
        "uMagenta",
        "uDim",
      ].map((name) => [name, gl.getUniformLocation(program, name)])
    );
    gl.uniform3fv(uniforms.uLight, LIGHT);
    gl.uniform3fv(uniforms.uVoid, VOID_BLACK);
    gl.uniform3fv(uniforms.uMagenta, PLASMA_MAGENTA);
    resize();
    return true;
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const budget = finePointer ? PIXEL_BUDGET_DESKTOP : PIXEL_BUDGET_TOUCH;
    const scale = Math.min(dpr, Math.sqrt(budget / (w * h)));
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uRes, w, h);
    gl.uniform1f(uniforms.uScale, scale);
    const { giant, rock } = planetLayout(w, h);
    gl.uniform4fv(uniforms.uGiant, giant);
    gl.uniform4fv(uniforms.uRock, rock);
  };

  // Pointer position in -1..1, eased every frame.
  const pointer = { x: 0, y: 0 };
  const parallax = { x: 0, y: 0 };
  if (finePointer && !reducedMotion) {
    window.addEventListener(
      "pointermove",
      (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
    document.addEventListener("pointerleave", () => {
      pointer.x = 0;
      pointer.y = 0;
    });
  }

  let dimTarget = readDim();
  let dim = dimTarget;

  const draw = (time: number) => {
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform2f(uniforms.uMouse, parallax.x, parallax.y);
    gl.uniform1f(uniforms.uDim, dim);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let raf = 0;
  let last = 0;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (now - last < 1000 / MAX_FPS - 1) return;
    last = now;
    parallax.x += (pointer.x - parallax.x) * PARALLAX_EASE;
    parallax.y += (pointer.y - parallax.y) * PARALLAX_EASE;
    dim += (dimTarget - dim) * DIM_EASE;
    draw(now / 1000);
  };
  const start = () => {
    cancelAnimationFrame(raf);
    // Reduced motion gets a single still frame, redrawn only when needed.
    if (reducedMotion) draw(0);
    else raf = requestAnimationFrame(tick);
  };
  const stop = () => cancelAnimationFrame(raf);

  if (!init()) return;
  start();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (reducedMotion) draw(0);
    }, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  document.addEventListener("astro:page-load", () => {
    dimTarget = readDim();
    if (reducedMotion) {
      dim = dimTarget;
      draw(0);
    }
  });

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    stop();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    if (init()) start();
  });
}
