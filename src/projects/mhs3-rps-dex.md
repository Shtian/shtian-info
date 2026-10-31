---
name: MHS3 RPS Dex
description: "A field guide to Monster Hunter Stories 3 attack types, so you always pick the right counter"
date: 2026-03-31
slug: mhs3-rps-dex
link: https://www.github.com/shtian/mhs3-rps-dex
cover: "./images/mhs3-rps-dex-cover.jpg"
tags:
  - React Router
  - React
  - TailwindCSS
  - Vercel
---

Combat in Monster Hunter Stories 3 is rock-paper-scissors. Every monster leans toward Power, Speed or Technical attacks, and many of them switch when they get enraged. Pick the counter and you win the head-to-head. Pick wrong and you lose it. I kept alt-tabbing to a wiki mid-battle, so I built a reference that answers that one question fast.

The dex shows 50+ monsters on a responsive card grid, colour-coded by default attack type: red for Power, blue for Speed, green for Technical. The filters do the heavy lifting. You can search by name, jump with a touch-friendly A–Z bar, and narrow by default or enraged attack type, element, elemental weakness and star rank. Filters combine with AND across categories and OR within each one, so "Speed monsters weak to Fire" is two taps away.

It runs on React Router 7 in framework mode with server-side rendering, styled with TailwindCSS 4. The monster data is a static file, so there is no backend to look after, only a lightweight Vercel deploy.

Try it at [mhs3-rps-dex.vercel.app](https://mhs3-rps-dex.vercel.app).
