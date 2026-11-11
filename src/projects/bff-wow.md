---
name: BFF – Best Friends in Forever
description: "A WoW: Forever addon that keeps a friend group in touch, even when nobody plays at the same time"
date: 2026-10-31
slug: bff-wow
link: https://www.github.com/shtian/bff-wow
cover: "./images/bff-wow-cover.jpg"
tags:
  - Lua
  - World of Warcraft
  - Addon
  - Game
---

My friends and I started levelling together in World of Warcraft: Forever, and within a week we had stopped playing at the same time. Someone would log in after work, someone else late at night, and the only way to know how the others were doing was to ask in a group chat. BFF is an addon that answers that question inside the game.

When you log in, BFF tells you what happened while you were away: every ding, death and new character your friends had since you last played.

![While you were away: the dings, deaths and new characters your friends had since you last played](./images/bff-wow-hero.jpg)

At the top of the panel the whole crew sits around a campfire, drawn as pixel art. Friends who are playing are awake, friends who aren't are asleep, and a recent death leaves a grave until somebody pays their respects with a flower.

![The crew gathered around a campfire at the top of the BFF panel](./images/bff-wow-camp.jpg)

Below it, the roster lists every friend's characters, levels, whereabouts and when each was last seen. The feed lets you cheer a ding, pay respects for a death or welcome someone new with one click.

![The roster: every friend's characters, levels and whereabouts](./images/bff-wow-roster.jpg)

![The feed, with one-click cheers, respects and welcomes](./images/bff-wow-feed.jpg)

The rest of the tabs grew out of things we kept asking each other. Goals give the crew something to work towards together, and trophies mark what you did as a group, like clearing a dungeon. Nobody gets ranked. Spares let you offer a piece of gear you don't need, and whoever claims it first gets it by in-game mail. A heatmap shows the hours each friend usually plays, in your own time zone. There is a grid of everyone's professions, so you know who to ask for a craft, and a list of the dungeons you can run with the friends closest to your level.

![Goals and trophies the whole crew works towards](./images/bff-wow-goals.jpg)

![Spares: pass on gear you don't need to a friend](./images/bff-wow-spares.jpg)

![A heatmap of when each friend usually plays](./images/bff-wow-when.jpg)

![Every friend's professions and skill in one grid](./images/bff-wow-professions.jpg)

![Dungeons you can run together with friends close to your level](./images/bff-wow-together.jpg)

There is no server, no account and no shared guild. One friend types `/bff start` and shares a crew code, and the others type `/bff join` with it. Behind the scenes BFF joins a hidden chat channel to find out who else in the crew is online, then sends each update as an addon whisper. Every member keeps a copy of everyone's records and passes on what they know, so news reaches friends who were offline when it happened.

![Start a crew: everyone installs BFF, one friend types /bff start, the others type /bff join](./images/bff-wow-crew.jpg)

It is written in Lua. Almost all of the logic lives in one pure-Lua core with no WoW calls in it, so the busted test suite and an in-game simulator can run several clients against each other through a fake network. The WoW-facing code only reads the game and draws what the core tells it to. Releases are tagged on GitHub, and a GitHub Actions workflow packages the addon and publishes it to CurseForge.

Get it on [CurseForge](https://www.curseforge.com/wow/addons/bff-best-friends-in-forever), or search for BFF in the CurseForge app.
