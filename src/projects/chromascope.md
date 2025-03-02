---
name: ChromaScope
description: "A simple CLI to get a visual diff across various browser engines"
date: 2022-04-01
slug: chromascope
link: https://www.github.com/shtian/chromascope
cover: "./images/chromascope-cover.jpg"
tags:
  - Playwright
  - cli
  - Tooling
  - ImageSharp
---

# ChromaScope

I wanted an easy way to do a visual diff on elements/pages across the most used browser engines: chromium, gecko, webkit. To build this I created a CLI with NodeJS, Playwright to control different headless browsers and screenshot, then ImageSharp to pixel-diff each screenshot.

The package is published on npm and can easily be called with npx without having to globally install the package.
