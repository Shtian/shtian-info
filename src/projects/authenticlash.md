---
name: Authenticlash
description: "Bored of 2FA-codes? I created a game to make them more interesting!"
date: 2024-01-01
slug: authenticlash
link: https://www.github.com/shtian/authenticlash
cover: "./images/authenticlash-cover.jpg"
tags:
  - SvelteKit
  - Supabase
  - Game
  - OpenAI
---

This project started with the idea of something as stupid as "How can I make 2-FA codes more fun?". Specifically the 10-99 codes from Microsoft Authenticator/GitHub Authenticator (and probably others). I set out to build a game around this to play with friends or colleagues.

The project is made with SvelteKit as the frontend framework and Supabase for persisting data.

Later on a number of integrations with OpenAI SDK has been made. One to generate profile pictures each week as well as a prompt to have a custom personality comment each event during the game.

Players can generate a game which lasts for a set period of time. They can also specify how often players should be able to add a code. During the game, each code you add is accumulated to your total score. The player with the highest score win the game.

To add some more strategic and fun elements, players can now choose their class as they enter the game. There are a number of classes and each class has different active/passive skills.

Players can also see their global stats, as well as earn achievements (integral part of any game, as we can all agree).

Visit [www.authenticlash.app](www.authenticlash.app) to check it out 👀
