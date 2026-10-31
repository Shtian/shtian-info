---
name: Inflation Station
description: "A self-hosted personal finance app that turns bank statements into monthly AI reviews"
date: 2026-02-21
slug: inflation-station
link: https://www.github.com/shtian/inflation-station
cover: "./images/inflation-station-cover.jpg"
tags:
  - TanStack Start
  - Prisma
  - SQLite
  - Docker
  - OpenAI
---

My money is spread across Norwegian banks and cards that never talk to each other, and I did not want to hand my statements to yet another cloud service to get the full picture. Inflation Station is a self-hosted finance app where every transaction ends up in one ledger, stored in SQLite on my own server.

The monthly ritual goes like this: import the month's CSV exports and PDF invoices, check the categories, then read the monthly review. Categorization runs in two steps. Rules that match on merchant text go first, so the usual suspects get sorted the same way every time. Whatever is left gets an AI suggestion with a calibrated confidence score, and I always have the final say before anything is saved.

The monthly review is the point of the whole thing. Instead of just another chart, it explains the month in writing and points out things I would not have noticed on my own. Around it are an overview dashboard, accounts, subscriptions, trips for keeping track of what a holiday really cost, and Spør, a chat assistant you can ask questions about your own spending.

It is built with TanStack Start on Vite+, Prisma and SQLite, with the Vercel AI SDK talking to OpenAI. Releases ship as a Docker image that I run on Coolify, with one instance per family member, each with its own database. A feedback button in the app files GitHub issues straight into the repo.
