---
name: Inflation Station
description: "A local-first personal economy dashboard for tracking spending, income, and cashflow"
date: 2025-04-01
slug: inflation-station
link: https://www.github.com/shtian/inflation-station
cover: "./images/inflation-station-cover.jpg"
tags:
  - Next.js
  - Prisma
  - SQLite
  - TailwindCSS
  - OpenAI
---

I wanted full visibility into my personal finances without handing my bank data to yet another cloud service. Inflation Station is a local-first economy dashboard that runs entirely on your own machine, storing everything in a SQLite database managed by Prisma.

The core loop is simple: import bank statements, categorize transactions, and explore the results. A configurable import pipeline maps CSV exports from different banks into a canonical format, then applies rule-based categorization so recurring merchants get sorted automatically. For the long tail of transactions that don't match any rule, an optional OpenAI integration suggests categories with a confidence score and reasoning, keeping the manual effort to a minimum.

The analytics dashboard ties it all together with inflow/outflow charts, net cashflow trends, category spend breakdowns, and per-account state tracking. Date range presets and account filters make it easy to zoom in on a specific month or compare across accounts. There is also a monthly review feature that uses AI to generate a written summary of your spending patterns.

The whole thing is built with Next.js, React 19, and TailwindCSS with shadcn/ui components. It runs happily on a Raspberry Pi, which makes it a nice always-on home server setup if you want the dashboard accessible across devices on your local network.
