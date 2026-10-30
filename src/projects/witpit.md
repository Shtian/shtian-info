---
name: The Wit Pit
description: "A shared knowledge pit for teams, with an AI writing assistant 🧠"
date: 2024-06-16
slug: the-wit-pit
link: https://www.github.com/shtian/witpit
cover: "./images/witpit-cover.png"
tags:
  - SvelteKit
  - Supabase
  - OpenAI
---

Good links and hard-won tips tend to disappear into Slack threads. The Wit Pit is a quick proof of concept for collecting them in one place: paste a link, add a short note on why it matters, and the rest of the team can find it and comment on it later.

Writing that note is the step people skip, so an OpenAI assistant can draft it for you from the link. Login, comments and data live in Supabase.

The real reason the project exists was to try out sveltekit-superforms and Formsnap. The forms are fully validated with Zod and work on both client and server, which made the whole PoC very quick to build.
