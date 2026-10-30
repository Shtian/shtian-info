---
name: Tons of Nom
description: "Rate festival food stalls in metal horns 🤘"
date: 2026-06-24
slug: tons-of-nom
link: https://www.github.com/shtian/tons-of-nom
cover: "./images/tons-of-nom-cover.jpg"
tags:
  - Next.js
  - Convex
  - TailwindCSS
  - shadcn/ui
---

At a festival, the question that matters most between concerts is where to eat next. Tons of Nom is a throwaway crowd-rating site for the food stalls at a single festival, scored in metal horns from 1 to 5, with half horns allowed.

It is built for someone standing in a queue with a phone in one hand. There is no account and no sign-up. You pick a nickname the first time you visit, it is stored on your device, and that is your identity. Find the stall you just ate at, or add it if nobody has yet, drop a rating and maybe a line about what you had, then get back to the music. Award the full five horns and you get one moment of pure metal.

The leaderboard uses a weighted (Bayesian) average, so a stall with a single 5-horn rating can't jump straight to the top. Each new rating nudges it toward its real score. You still see the honest average and the number of ratings, but the ordering stays fair. Convex keeps the list live, so it updates for everyone as ratings come in.

The design goes for true death-metal gravity rather than festival kitsch: crimson on black, heavy type, and very few words. I wrote the design decisions down as a short domain model and a set of ADRs before building it, which kept a one-day project from growing into a full review platform.

Built with Next.js, React 19, Convex, TailwindCSS 4 and shadcn/ui, deployed on Vercel. Check it out at [tons-of-nom.vercel.app](https://tons-of-nom.vercel.app) 🤘
