---
name: Where's the Fault (WTF)?
description: "A terminal-style troubleshooting guide for tracing alerts back to their source"
date: 2024-09-29
slug: wheres-the-fault
link: https://www.github.com/shtian/wheres-the-fault
cover: "./images/wtf-cover.jpg"
tags:
  - Svelte
  - DevOps
  - Monitoring
---

An alert pops up in the monitoring channel. Where does it come from, and what do you do about it? If you are new to the team, or it has been a while since the last incident, the answer usually lives in someone else's head. _Where's the Fault (WTF)?_ puts that knowledge into an interactive guide.

It looks like a terminal in a little desktop window, complete with a top bar and a dock. It walks you through a flowchart of questions: Which channel did the alert land in? Is it one of the known errors? Each answer leads to the next step, an explanation, or a link straight to the right Slack thread or runbook.

The flow is defined as a typed array of prompts in `src/lib/prompts.ts`. Each prompt is a question that branches, an info message, or a link. TypeScript keeps the flow consistent, so the team can update it without breaking anything.

Built with Svelte and TailwindCSS. There is also a confetti easter egg, if you can find the right key 🎉
