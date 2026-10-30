---
name: Brew
description: "A pour-over coffee log for remembering which beans, dose and grind actually worked"
date: 2026-04-15
slug: brew
link: https://www.github.com/shtian/brew
cover: "./images/brew-cover.jpg"
tags:
  - Next.js
  - Neon
  - Postgres
  - TailwindCSS
---

Pour-over coffee is a game of small variables. Change the grind a notch, add a gram, pour a little slower, and the cup tastes completely different. I could never remember what I did last time, so I built Brew to keep track for me.

Each brew is one entry: the beans, the dose in grams, the total brew time, the grinder setting, and a note on how it tasted. Everything lands in a table with the newest brew on top, so it is easy to look back and find the version that worked. On a phone the table turns into a stack of cards instead of scrolling sideways. An activity heatmap at the top shows how often the kettle has been on over the last few months.

There is no login and only one user, me. That keeps it to a Next.js app with server actions writing straight to a Neon Postgres database, deployed on Vercel. The look is a dark, vintage botanical notebook, with olive headings, parchment tones and hand-drawn fronds, and the UI is in Norwegian.

I also used it to try a task-driven workflow: I wrote a PRD with a list of testable tasks up front, and an agent worked through them one at a time until every task passed.

See it at [brew-orcin.vercel.app](https://brew-orcin.vercel.app).
