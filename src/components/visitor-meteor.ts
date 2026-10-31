// A pixel-art shooting star that streaks above the hero, leaves a pencilled
// track and reveals the visitor's number. It steps at 20fps on a 2px grid to
// match the space background's pixel art.

const FRAMES = 26;
const FRAME_MS = 50;
const TRAIL = 34;
const START_DELAY_MS = 400;

const snap = (v: number) => Math.round(v / 2) * 2;
const px = (x: number, y: number, size: number, alpha: number) =>
  `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="oklch(var(--foreground) / ${alpha})"/>`;

// Desktop: a diagonal streak with the note beside its end.
// Mobile: a flatter streak across the top, note right-aligned under its end.
function layout(root: HTMLElement) {
  const w = root.clientWidth;
  const h = root.clientHeight;
  const wide = matchMedia("(min-width: 768px)").matches;
  const [sx, sy, cx, cy, ex, ey] = wide
    ? [20, 14, 140, 20, 236, 86]
    : [14, 8, w * 0.45, 8, w - 70, 36];
  const d = `M${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;

  root.querySelector("svg")?.setAttribute("viewBox", `0 0 ${w} ${h}`);
  for (const el of root.querySelectorAll(".track, .track-reveal"))
    el.setAttribute("d", d);
  root
    .querySelector(".radiant")
    ?.setAttribute("d", `M${sx - 6} ${sy - 4}l4 4M${sx - 2} ${sy - 4}l-4 4`);
  const impact = root.querySelector(".impact");
  impact?.setAttribute("cx", String(ex));
  impact?.setAttribute("cy", String(ey));
}

function streak(root: HTMLElement, onDone: () => void) {
  const track = root.querySelector<SVGPathElement>(".track");
  const meteor = root.querySelector<SVGGElement>(".meteor");
  if (!track || !meteor) return;
  const length = track.getTotalLength();

  let frame = 0;
  const tick = () => {
    if (!root.isConnected) return;
    const t = frame / (FRAMES - 1);
    const head = Math.pow(t, 1.3) * length;
    // The trail shortens as the meteor burns out.
    const burn = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;

    let rects = "";
    for (let k = 0; k < TRAIL * burn; k++) {
      const d = head - k * 2;
      if (d < 0) break;
      const p = track.getPointAtLength(d);
      const x = snap(p.x);
      const y = snap(p.y);
      if (k === 0) {
        rects += px(x - 4, y - 4, 8, 0.12) + px(x - 2, y - 2, 4, 1);
      } else {
        const alpha = Math.pow(1 - k / TRAIL, 1.4) * (0.35 + 0.65 * burn);
        rects += px(x - 1, y - 1, 2, Number(alpha.toFixed(2)));
      }
    }
    if (frame === FRAMES - 1) {
      const end = track.getPointAtLength(length);
      for (const [dx, dy] of [
        [6, -4],
        [8, 4],
        [2, 8],
        [-4, 6],
      ]) {
        rects += px(snap(end.x + dx), snap(end.y + dy), 2, 0.6);
      }
    }
    meteor.innerHTML = rects;

    frame++;
    if (frame < FRAMES) {
      setTimeout(tick, FRAME_MS);
    } else {
      setTimeout(() => {
        meteor.innerHTML = "";
        onDone();
      }, 120);
    }
  };
  tick();
}

export function mountVisitorMeteor(root: HTMLElement) {
  const logged = root.querySelector(".logged");
  if (logged) {
    const time = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    logged.textContent = `Meteor VIS-${root.dataset.visitor} · logged ${time}`;
  }

  layout(root);
  const done = () => root.classList.add("is-tracked");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    done();
  } else {
    setTimeout(() => streak(root, done), START_DELAY_MS);
  }

  let replaying = false;
  root.querySelector(".note")?.addEventListener("mouseenter", () => {
    if (reducedMotion || replaying || !root.classList.contains("is-tracked"))
      return;
    replaying = true;
    streak(root, () => (replaying = false));
  });

  const onResize = () => {
    if (!root.isConnected)
      return window.removeEventListener("resize", onResize);
    layout(root);
  };
  window.addEventListener("resize", onResize);
}
