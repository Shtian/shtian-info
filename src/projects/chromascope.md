---
name: ChromaScope
description: "A simple CLI to get a visual diff across various browser engines"
date: 2022-04-01
slug: chromascope
link: https://www.github.com/shtian/chromascope
cover: "./images/chromascope-cover.jpg"
tags:
  - Playwright
  - CLI
  - Tooling
  - ImageSharp
---

I wanted an easy way to perform a visual diff on elements/pages across the most widely used browser engines: Chromium, Gecko, and WebKit. To achieve this, I built a CLI using Node.js, Playwright (to control headless browsers and capture screenshots), and ImageSharp (to compute pixel differences between screenshots).

The package is published on npm and can be run with `npx` or equivalent for your package manager of choice, eliminating the need for a global installation.

### Sample Output:

```bash
> pnpm dlx chromascope shtian.info
✔ Captured Chromium screenshot 📸
✔ Captured WebKit screenshot 📸
✔ Captured Firefox screenshot 📸
✔ Diff complete 🎉
┌─ 🍎 WebKit
└─ 👉 3.50% pixel change compared to Chromium (32,271px)
┌─ 🦊 Firefox
└─ 👉 0.43% pixel change compared to Chromium (4,001px)
```

ChromaScope includes various options to customize its behavior for different scenarios. For instance, you can diff a specific element on a page using a selector:

```bash
> pnpm dlx chromascope diff shtian.info -e footer
✔ Captured Chromium screenshot 📸
✔ Captured WebKit screenshot 📸
✔ Captured Firefox screenshot 📸
✔ Diff complete 🎉
┌─ 🍎 WebKit
└─ 👉 0.05% pixel change compared to Chromium (102px)
┌─ 🦊 Firefox
└─ 👉 0.06% pixel change compared to Chromium (115px)
```
