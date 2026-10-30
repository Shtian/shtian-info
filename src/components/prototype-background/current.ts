// PROTOTYPE — Variant "current": the existing tsparticles stars + CSS planets,
// kept only as a baseline for comparison. Config copied from
// UniverseBackground.astro.

import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import { stats } from "./shared";

export async function mount(host: HTMLElement) {
  host.querySelector<HTMLElement>("[data-proto-legacy]")!.hidden = false;
  for (const id of ["stars", "shooting-stars"]) {
    const el = document.createElement("div");
    el.id = id;
    host.append(el);
  }
  await loadSlim(tsParticles);
  await tsParticles.load({
    id: "stars",
    options: {
      style: { opacity: "0.4" },
      fullScreen: { zIndex: -50 },
      particles: {
        number: { value: 80 },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.4, max: 1 },
          animation: { enable: true, speed: 0.5, sync: false },
        },
        size: { value: { min: 0.8, max: 1.5 } },
        move: {
          enable: true,
          speed: { min: 0.01, max: 0.3 },
          direction: "left",
          random: true,
          straight: true,
          outModes: { default: "out" },
        },
      },
    },
  });
  await tsParticles.load({
    id: "shooting-stars",
    options: {
      fullScreen: { zIndex: -40 },
      particles: {
        number: { value: 1 },
        color: { value: "rgb(80 80 80)" },
        shape: { type: "circle" },
        size: { value: { min: 0.8, max: 1.5 } },
        move: {
          enable: true,
          speed: { min: 3, max: 10 },
          direction: "bottom-right",
          random: true,
          straight: true,
          outModes: { default: "out" },
        },
      },
    },
  });
  stats.note = "tsparticles runs its own loop; fps not measured here";
}
