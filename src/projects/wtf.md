---
name: Where's the Fault (WTF)?
description: "An interactive terminal-based assistant to trace the source of alerts"
date: 2024-09-16
slug: wheres-the-fault
link: https://www.github.com/shtian/wheres-the-fault
cover: "./images/wtf-cover.jpg"
tags:
  - Svelte
  - DevOps
  - Monitoring
  - CLI
---

When an alert pops up in our monitoring channel, figuring out its source can be a hassle. _Where's the Fault (WTF)?_ is a terminal-based assistant designed to help dev teams trace the origin of an issue through an interactive, structured workflow.

Built with Svelte, it provides a streamlined way to navigate through possible causes and solutions.

## How It Works

At its core, WTF is an interactive flowchart presented in a terminal interface. It guides users through a series of prompts, allowing them to answer questions, get additional information, or jump directly to relevant documentation.

## Configuring the Workflow

The workflow is defined in `src/lib/prompts.ts` as an array called `promptCollection`. Each prompt represents a step in the troubleshooting process and can be one of the following:

- **Questions** → Directs the user to the next step based on their answer.
- **Information messages** → Provides additional context or explanations.
- **Links to documentation** → Guides the user to external resources for deeper insights.

All prompts are type-assisted, ensuring consistency and maintainability.
