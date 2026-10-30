---
name: ChromaScope
description: "Lets your coding agent see what its UI change did, with visual diffs in real browsers"
date: 2023-03-31
slug: chromascope
link: https://www.github.com/shtian/chromascope
cover: "./images/chromascope-cover.jpg"
tags:
  - CLI
  - Playwright
  - AI Agents
  - Tooling
---

ChromaScope started life as a small CLI for diffing a page across Chromium, WebKit and Firefox. Version 2 gives it a new job: let a coding agent see what its UI change actually did.

Agents happily edit CSS and components without ever looking at the result, then call the change done. ChromaScope gives them a way to check. Capture the page in real browsers before the change, capture it again after, and get back a pixel change percentage plus diff images with every changed pixel painted red. The agent opens the images and can tell you, region by region, whether every change was one it meant to make.

```bash
chromascope snapshot localhost:3000/pricing --element .card
# ...edit the code...
chromascope compare localhost:3000/pricing --element .card --json --out /tmp/pricing
```

The same building blocks cover a few other flows:

- **Prove a refactor changed nothing.** Take a full-page baseline, refactor, and run `compare --fail-above 0`. Exit code `0` means not a single pixel moved.
- **Match production.** `versus` diffs your local page against the live one.
- **Check other browsers.** `diff` compares Chromium against WebKit and Firefox, and `--fail-above` turns it into a CI gate.

It ships with an agent skill you can install with `npx skills add Shtian/chromascope`. The skill teaches Claude Code, Codex or Cursor when to reach for ChromaScope, how to read the JSON and exit codes, and to actually look at the images before declaring victory. Humans can use it straight from the terminal too. Under the hood it is Node.js with Playwright for the browsers and pixelmatch for the comparison, published on npm.
