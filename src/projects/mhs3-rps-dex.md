---
name: MHS3 RPS Dex
description: "A Monster Hunter Stories 3 reference app for browsing monsters by attack type, element, and rank"
date: 2025-06-01
slug: mhs3-rps-dex
link: https://www.github.com/shtian/mhs3-rps-dex
cover: "./images/mhs3-rps-dex-cover.jpg"
tags:
  - React Router
  - React
  - TailwindCSS
  - Vercel
---

Monster Hunter Stories 3 has a rock-paper-scissors combat system where every monster leans toward Power, Speed, or Technical. Keeping track of which monster favours which type, and how that changes when they get enraged, is the kind of thing you end up alt-tabbing a wiki for mid-battle. I wanted a faster, more focused tool, so I built MHS3 RPS Dex as a single-page reference app.

The app lets you browse 50+ monsters on a responsive card grid, each color-coded by their default attack type. Filters are the core of the experience: you can search by name, narrow by default or enraged attack type, element, elemental weakness, and star rank. Filters combine with AND logic across dimensions and OR within each, so it is easy to ask questions like "show me all Speed monsters weak to Fire."

Under the hood it runs on React Router 7 in framework mode with server-side rendering for a snappy first load, styled with TailwindCSS 4. The monster dataset is static, which keeps the whole thing simple and deployable as a lightweight Vercel project with no backend to maintain.

Visit [mhs3-rps-dex.vercel.app](https://mhs3-rps-dex.vercel.app) to try it out.
