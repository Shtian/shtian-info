# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Potential clients** looking for an experienced consultant. They want evidence of skill and an easy way to make contact (LinkedIn).
- **Fellow developers** browsing side projects out of curiosity, following links to GitHub repos and reading how things were built.

## Product Purpose

shtian.info is Stian Haga's personal site: a showcase of spare-time projects and a playground for web experiments. Success means visitors explore the projects and come away with a sense of who Stian is and what he builds, and the site itself stays a place where new ideas can be tried out.

## Positioning

A frontend specialist with around 15 years across the stack (backend, cloud infrastructure, monitoring, team leadership) who builds things on the web that "not only work great, but spark delight." The site is meant to show that directly, not just claim it.

## Operating Context

- Built with Astro 6, Tailwind CSS 4, and a hand-written WebGL shader for the background. Deployed on Vercel, with PostHog analytics.
- Projects are an Astro content collection (`src/projects/*.md`) with name, description, tags, date, external link, and a cover image. Each project gets its own page at `/projects/[id]`.
- Contact goes through external channels only: LinkedIn, GitHub, and copying the Discord username. The site has no contact form or backend.

## Capabilities and Constraints

- Static content site: a home page (hero and project overview) and individual project pages.
- Content is in English (`lang="en"`).
- Dark theme only. There is no light theme or theme toggle (decided 2026-10-30).

## Brand Commitments

- **Space / sci-fi theme is binding.** The site is "Shtian's universe", visitors are greeted as "Spacefarer", and projects are presented as planets. Future work keeps this theme.
- **Playful, warm, first-person voice is binding.** The tone is lighthearted and self-aware (for example "spark delight ✨", "It's very... space-y right now. Borderline Geocities retro. I like sci-fi, by the way.").

## Evidence on Hand

- Nine real projects with write-ups and cover images in `src/projects/` and `src/projects/images/`: Authenticlash, ChromaScope, h53, Inflation Station, MHS3 RPS Dex, shtian.info, SVGOCD, The Wit Pit, Where's the Fault (WTF)?.
- Profile photo at `src/assets/profile-pic.webp`; OG image at `public/og-image.jpg`.
- No testimonials, client names, case studies, or employer history are on the site. Do not invent any.

## Product Principles

1. **Projects are the proof.** Let the real work show the skill instead of piling up claims.
2. **Serve both audiences without splitting the site.** A client and a developer should each find what they need on the same pages.
3. **Delight is part of the work.** Playful touches are on-brand, but they must never get in the way of reading or navigating.
4. **Stay a playground.** The site should keep room for experiments and be easy to change.
