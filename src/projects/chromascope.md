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

I wanted an easy way to do a visual diff on elements/pages across the most used browser engines: chromium, gecko, webkit. To build this I created a CLI with NodeJS, Playwright to control different headless browsers and screenshot, then ImageSharp to pixel-diff each screenshot.

The package is published on npm and can easily be called with npx without having to globally install the package.

Sample output:

```bash
> pnpm dlx chromascope shtian.info
✔ Captured Chromium screenshot 📸
✔ Captured WebKit screenshot 📸
✔ Captured Firefox screenshot 📸
✔ Diff complete 🎉
┌─ 🍎 WebKit
└─ 👉 3.50% pixel change compared to Chromium (32271px)
┌─ 🦊 Firefox
└─ 👉 0.43% pixel change compared to Chromium (4001px)
```

It has quite a list of options to customize and support different scenarios, one of them is diffing a certain element on a page based on a selector:

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
