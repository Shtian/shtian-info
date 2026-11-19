---
name: BFF – Best Friends in Forever
description: "A WoW: Forever addon that keeps your friends' dings, deaths and adventures in view, even when you play at different times"
date: 2026-10-31
slug: bff-wow
link: https://www.github.com/shtian/bff-wow
cover: "./images/bff-wow-cover.png"
tags:
  - Lua
  - World of Warcraft
  - Addon
  - Game
---

BFF is a World of Warcraft: Forever addon for a group of friends levelling side by side. It helps you keep up with each other when you play at different times, and it makes the game more social when you play together.

The Pocket Camp is the part you see the most. It is a small pixel-art campfire you can keep anywhere on screen, with every friend who is online sitting around it, you included. Each figure shows what that friend is doing right now: fighting, fishing, crafting, gathering, flying, browsing the auction house, resting at an inn or standing in a dungeon doorway. Druids and shamans show up in their animal forms. News plays out by the fire too. A ding gets a gold star, reaching max level bursts into sparks, a death turns into a skeleton and a finished crew goal makes the flames flare purple. Hover a friend to see their character, level and zone, or right-click them to whisper, invite or find them on the map. The Pocket Camp started as a request in the CurseForge comments, and most of its poses came from players asking for them.

![The Pocket Camp: your online friends around a campfire, each one shown doing what they are doing right now](./images/bff-wow-pocket.jpg)

The other half is catching up. When you log in, BFF shows what happened while you were away: every ding, death and new character your friends had since you last played.

![While you were away: the dings, deaths and new characters your friends had since you last played](./images/bff-wow-hero.jpg)

When you are online together, news arrives as it happens. A friend's ding or death pops up as a small toast with a sound, and one click sends back a reaction: a cheer for a ding, respects for a death, or a welcome for someone new. If whoever dinged has already logged off, they hear about the cheer later.

![The feed, with one-click cheers, respects and welcomes](./images/bff-wow-feed.jpg)

The same campfire sits at the top of the BFF panel, with the whole crew around it. Friends who are playing are awake, friends who aren't are asleep in bedrolls, and a recent death leaves a grave until somebody pays their respects with a flower.

![The crew gathered around a campfire at the top of the BFF panel](./images/bff-wow-camp.jpg)

Goals give the crew something to work towards together, and trophies mark what you did as a group, like clearing a dungeon. Nobody gets ranked. Spares let you offer a piece of gear you don't need, and whoever claims it first gets it by in-game mail.

![Goals and trophies the whole crew works towards](./images/bff-wow-goals.jpg)

![Spares: pass on gear you don't need to a friend](./images/bff-wow-spares.jpg)

The rest is an eagle-eye view of the crew. The roster lists every friend's characters, levels, whereabouts and when each was last seen, and map pins show where everyone is. A grid shows everyone's professions and skill, so you know who to ask for a craft. The dungeons tab shows which friends are close to your level and the dungeons you can run together, and a heatmap shows the hours each friend usually plays, in your own time zone. A fishing field guide fills in each kind of fish as someone in the crew catches it for the first time.

![The roster: every friend's characters, levels and whereabouts](./images/bff-wow-roster.jpg)

![Every friend's professions and skill in one grid](./images/bff-wow-professions.jpg)

![Dungeons you can run together with friends close to your level](./images/bff-wow-together.jpg)

![A heatmap of when each friend usually plays](./images/bff-wow-when.jpg)

There is no server, no account and no shared guild. One friend types `/bff start` and shares a crew code, and the others type `/bff join` with it. BFF is peer-to-peer. It joins a hidden chat channel to find out who else in the crew is online, then sends each update to them as an addon whisper. Every member keeps a copy of everyone's records and passes on what they know, so news can reach you through any friend who is online at the same time as you, not only the one it happened to. The catch is that someone has to be online with you. If your play times never overlap with anyone in the crew, nothing gets through.

![Start a crew: everyone installs BFF, one friend types /bff start, the others type /bff join](./images/bff-wow-crew.jpg)

It is written in Lua. Almost all of the logic lives in one pure-Lua core with no WoW calls in it, so the busted test suite and an in-game simulator can run several clients against each other through a fake network. The WoW-facing code only reads the game and draws what the core tells it to. Releases are tagged on GitHub, and a GitHub Actions workflow packages the addon and publishes it to CurseForge.

Get it on [CurseForge](https://www.curseforge.com/wow/addons/bff-best-friends-in-forever), or search for BFF in the CurseForge app. There is also a [Discord](https://discord.gg/5bgyqhHFv) for ideas, bug reports and new releases.
