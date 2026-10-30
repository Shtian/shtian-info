---
name: Shtian's universe
description: A hand-drawn star chart of side projects, charted by one curious developer.
colors:
  plasma-magenta: "oklch(55.7% 0.199 314.53)"
  comet-yellow: "oklch(81.18% 0.161 97.64)"
  void-black: "oklch(18.98% 0 294)"
  starlight-grey: "oklch(90% 0.004 297)"
typography:
  wordmark:
    fontFamily: "Caveat, ui-serif, serif"
    fontSize: "3.75rem"
    fontWeight: 400
    lineHeight: 1
  display:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  body-small:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  script-accent:
    fontFamily: "Caveat, ui-serif, serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.55
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
components:
  project-planet-card:
    textColor: "{colors.starlight-grey}"
    rounded: "{rounded.md}"
    padding: "32px 16px"
  tag-chip:
    textColor: "{colors.starlight-grey}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 8px"
  script-link:
    textColor: "{colors.starlight-grey}"
    typography: "{typography.script-accent}"
  icon-link:
    textColor: "{colors.starlight-grey}"
    size: "24px"
  wordmark:
    textColor: "{colors.starlight-grey}"
    typography: "{typography.wordmark}"
  toast:
    backgroundColor: "#000000cc"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
---

# Design System: Shtian's universe

## Overview

**Creative North Star: "The Hand-Drawn Star Chart"**

The site is a navigator's chart of a small universe. A clean, dark sci-fi base (near-black space, faint drifting stars, two half-lit planets on the horizon) carries the structure, and a handwritten voice scribbles notes in the margins: the Caveat wordmark, the wavy gold underline, the odd emphasised word. The chart is precise; the handwriting is what makes it one person's chart.

It should feel curious, handmade and nerdy. Curious: projects are bodies to approach, and each one rewards a closer look. Handmade: a little imperfect, a little playful, clearly not a template. Nerdy: sci-fi references and nods to the retro web are welcome, as long as they stay legible. Interactive pieces are minimal and restrained; most of the screen is calm, and the energy comes from small, exact details.

It must never drift toward neon cyberpunk (heavy glows, glitch effects, saturated neon everywhere) or corporate SaaS (gradient heroes, stock illustration, generic feature-card grids).

**Key Characteristics:**
- Near-black space with a sparse, slowly drifting starfield behind everything.
- One sans family (Lato) for structure; Caveat handwriting only for the wordmark and short accents.
- Two signal colors used sparingly: Plasma Magenta for interaction, Comet Yellow for handwritten emphasis.
- Depth from light, blur and glow; no drop shadows on UI.
- Projects shown as planets: circular, greyscale at rest, coming into color when approached.

## Colors

A near-monochrome night sky with two small, hot signals.

### Primary
- **Plasma Magenta** (`oklch(55.7% 0.199 314.53)`, ≈ #9d43c2): the interaction color. Focus rings, tag outlines, the profile-photo ring (at 50%), and the hover color of wavy links.

### Secondary
- **Comet Yellow** (`oklch(81.18% 0.161 97.64)`, ≈ #dec121): the handwriting color. Wavy underlines under Caveat accents and prose links.

### Neutral
- **Void Black** (`oklch(18.98% 0 294)`, ≈ #141414): the page background.
- **Starlight Grey** (`oklch(90% 0.004 297)`, ≈ #dedde0): text. Small secondary text uses it at 60% opacity, resting icons at 50%, hairline borders at 10–20%.

The site is dark only. There is no light theme; `:root` sets `color-scheme: dark` so browser controls and scrollbars match.

Colors are defined once on `:root` in `src/styles/global.css` as bare OKLCH channel triplets (`--foreground`, `--background`, `--primary`, `--accent`) and exposed to Tailwind as `foreground`, `background`, `primary`, `accent`. Opacity variants (`foreground/50`, `primary/50`) are how tints are made; there is no separate tint scale.

The background planets use Tailwind's `sky-950` and `emerald-950` with reduced saturation, and the orbiting moons pick from a small set of muted rose, emerald, comet, blue and stone gradients. These are scenery, not UI colors.

### Named Rules
**The Two Signals Rule.** Magenta means "you can interact with this"; yellow means "this is the handwritten voice". Don't swap them, and don't introduce a third signal color for UI.

**The Dark Sky Rule.** Signal colors appear as lines, rings and outlines, never as large filled areas. If a screen has a magenta or yellow block bigger than a tag, it has drifted toward neon.

## Typography

**Display Font:** Lato (with system-ui, sans-serif)
**Body Font:** Lato (with system-ui, sans-serif)
**Script Font:** Caveat (with ui-serif, serif)

**Character:** Lato is the chart: friendly, even and readable. Caveat is the pencil annotation on top. Both load from Google Fonts in `global.css`.

### Hierarchy
- **Wordmark** (Caveat 400, 3rem → 3.75rem from `sm`, line-height 1): "shtian's universe" in the header. The only large use of Caveat.
- **Display** (Lato 700, 3rem, line-height 1.2): the home greeting, typed out character by character on load.
- **Headline** (Lato 700, 1.875rem): project page titles.
- **Title** (Lato 400, 1.125rem): project names on planet cards.
- **Body** (Lato 400, 1rem, line-height 1.75): prose from the Tailwind Typography plugin, about 65ch wide. Project write-ups are justified.
- **Body Small** (Lato 400, 0.875rem): project descriptions on cards.
- **Label** (Lato 400, 0.75rem): tag chips.
- **Script Accent** (Caveat 700, 1.125rem, wavy Comet Yellow underline): one or two emphasised words inline in body copy ("things", "Let's talk.").

Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty`.

### Named Rules
**The Margin Note Rule.** Caveat is for the wordmark and short inline accents of one to three words. Never set a paragraph, heading or UI label in it.

## Layout

A centred column on a full-bleed sky. Page content sits in a container of max 80rem (`max-w-7xl`) with 16px side padding, widening to 32px from `lg`. Prose is held to the Typography plugin's comfortable measure and centred.

The home page stacks the hero and the project grid with 64px between them. Projects use an auto-fit grid of columns at least 280px wide (or full width on narrow screens), with 32px gaps, so the column count follows the viewport with no breakpoints. In the hero, the profile photo sits beside the copy from `sm` and above it on small screens (96px → 192px).

Spacing follows Tailwind's 4px base. The steps actually used are 8px (between tags), 16px (inside cards, between icons), 32px (card padding and grid gaps) and 64px (between page sections).

The background scene (starfield, shooting star, two planets) is fixed behind the content and persists across Astro view transitions. Project images and titles animate between the card and the project page with shared-element view transitions.

## Elevation & Depth

Depth comes from light, not shadow. Cards are frosted glass (`backdrop-blur-lg`) with a faint inner rim instead of a border, and the background planets glow softly and fade into the sky. Layers are separated by blur, transparency and z-order behind the content, never by drop shadows under UI.

### Shadow Vocabulary
- **Glass rim** (`box-shadow: inset 0 0 4px oklch(var(--foreground) / 0.1)`): the edge of a project card.
- **Planet halo** (`box-shadow: 0 0 100px 1px oklch(var(--foreground) / 0.05–0.1)`): the soft glow around background planets.
- **Terminator** (`box-shadow: 0 0 120px 72px oklch(var(--background))`): the shadow side of a planet, drawn in the page background color.

### Named Rules
**The Starlight Rule.** If something needs to stand out, give it light (a glow, a rim, a lift in brightness), not a drop shadow. Glows stay faint, at 10% opacity or less, so they never read as neon.

## Shapes

The world is round. Planets, moons, the profile photo and tag chips are full circles or pills. Containers are only gently rounded: cards at 6px, the cover figure on project pages at 8px, prose images at 12px. Borders are rare: hairline dividers in `foreground/20`, and the dashed orbit ring that appears around a planet on hover.

## Components

### Project Planet Card
The signature component. A frosted-glass card holding a circular 160px cover image (the planet), the project name, a short description and tag chips.
- **At rest:** the planet is greyscale and slightly dimmed (`brightness-90 contrast-110 saturate-90`); the card is barely visible beyond its glass rim.
- **Hover (pointer) or scrolled into view (touch):** the planet scales to 105% and turns to full color, a dashed orbit ring expands out to 16px, a small moon starts orbiting (24s per lap, random starting angle and color), and a faint white sheen fades in across the card. Transitions are 300ms, staggered so the ring follows after 300ms and the moon after 600ms.
- **Navigation:** the whole card is a link. The planet image and title morph into the project page through view transitions.

### Tag Chips
- **Style:** 1px Plasma Magenta outline, transparent fill, pill shape, label type (0.75rem), 4px × 8px padding.
- **State:** static and not interactive.

### Links
- **Script link:** Caveat bold with a 2px wavy Comet Yellow underline, offset 4px. On hover the underline turns Plasma Magenta. Used for "Let's talk." and in-prose emphasis.
- **Prose links:** body type with the same wavy yellow underline that turns magenta on hover.
- **Icon links** (GitHub, LinkedIn, copy Discord username): 24px Lucide-style line icons at 50% Starlight Grey, going to full on hover, each with a screen-reader label.

### Navigation
The header is just the Caveat wordmark linking home. There is no menu.

### Toast
A small confirmation ("Discord username copied!") that slides up from the bottom centre: 80% black, white text, 6px corners, fades out after 5 seconds.

### Focus
Every focusable element gets a 2px Plasma Magenta ring offset 2px from the page background. This is global in `global.css`.

## Do's and Don'ts

### Do:
- **Do** keep the background near-black (`oklch(18.98% 0 294)`) with the starfield and planets fixed behind the content.
- **Do** use Plasma Magenta only for interaction (focus, outlines, hover) and Comet Yellow only for handwritten emphasis.
- **Do** keep components quiet at rest and let state changes be subtle and exact (300ms transitions, small scale steps, opacity shifts).
- **Do** build depth with blur, faint rims and glows at 10% opacity or less.
- **Do** keep circles for things that are "bodies" (planets, moons, avatars) and gentle 6–12px corners for containers.
- **Do** use the theme tokens (`foreground`, `background`, `primary`, `accent`) with opacity rather than adding new grey values.

### Don't:
- **Don't** add neon-cyberpunk treatments: strong glows, glitch effects, scanlines or saturated neon fills.
- **Don't** add corporate SaaS patterns: gradient hero banners, stock illustrations, generic icon-and-heading feature grids.
- **Don't** set more than a few words in Caveat, or use it for UI labels.
- **Don't** put drop shadows under cards or buttons.
- **Don't** fill large areas with Plasma Magenta or Comet Yellow.
- **Don't** add a light theme or theme toggle; the site is dark only.
