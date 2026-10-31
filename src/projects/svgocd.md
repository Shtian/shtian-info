---
name: SVGOCD
description: "A VS Code extension that runs SVGO on your SVGs without leaving the editor"
date: 2019-08-26
slug: svgocd
link: https://github.com/Shtian/vscode-svgocd
cover: "./images/svgocd-cover.png"
tags:
  - VS Code
  - Extension
  - SVG
  - SVGO
---

SVGs exported from design tools tend to arrive with editor metadata, empty groups and far too many decimals. I got tired of copying them into a separate tool to clean them up, so I wrote a VS Code extension that runs SVGO right where the file is open.

Run `SVGOCD: Optimize current SVG` to clean up the whole file, or select a chunk of SVG markup and optimize only that. When it is done, it tells you how much smaller the file got.

You can configure it in two ways. Every SVGO plugin is available as a VS Code setting, or you can drop a `svgo.config.{js,mjs,cjs}` file into the workspace and the extension picks it up, so it follows the same rules as your build. It is my oldest project still in use, and it has kept up with SVGO 3.

Find it on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=shtian.svgocd).
