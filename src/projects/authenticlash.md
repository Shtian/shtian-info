---
name: Authenticlash
description: "A competitive game built around the two-digit codes your authenticator throws at you"
date: 2023-12-16
slug: authenticlash
link: https://www.github.com/shtian/authenticlash
cover: "./images/authenticlash-cover.jpg"
tags:
  - SvelteKit
  - Supabase
  - OpenAI
  - Game
---

It started with a question nobody asked: how do I make 2FA codes fun? You know the ones. Microsoft Authenticator, GitHub Mobile and friends flash a random number between 1 and 99 at you several times a day. Authenticlash turns those numbers into points.

Someone creates a game with an end date and a cooldown, then shares the link with friends or colleagues. Every time you get a code, you punch it in. The scores pile up, and whoever has the highest total when the clock runs out wins.

Raw luck got old fast, so I bolted on an RPG layer. When you join a game you pick a class (Thief, Barbarian, Necromancer, Paladin, Warden or Diceblade), each with its own active and passive abilities for stealing, boosting or gambling with points. An AI commentator narrates every move in the event log, and the game creator picks its personality. When a game ends, the winner gets a generated victory image, and everyone gets a weekly AI avatar based on a nickname, a creature and a random backdrop.

Then there are the badges, because what is a game without achievements? Dozens of them, a few secret ones 🤫, a global unlock rate, and a stats page that tracks your wins and losses over time.

Under the hood it is SvelteKit 5 with Supabase for auth and data, OpenAI for the commentator and image generation, and Sentry keeping an eye on things. It has been running since late 2023 and still gets new classes when I get the itch.

Play it at [authenticlash.app](https://www.authenticlash.app) 👀
