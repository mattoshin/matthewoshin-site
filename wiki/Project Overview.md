---
title: Project Overview
tags: [matthewoshin-site, overview]
---

# Project Overview

## What this is

This is Matthew Oshin's personal hub and portfolio site. It is a single Next.js 16 app that presents his work, ventures, and story as an ocean you move down through. It is not a static resume. The medium is the message: Matthew is a builder, so the site itself is a built thing that people experience.

The whole site lives in one repository and one persistent WebGL canvas. Every page you visit is a depth in the same ocean, and navigating between pages dives the camera through the water. See [[Architecture]] for how that persistence works and [[Ocean Scene]] for what lives in the water.

## Who it is for

The north star is one sentence:

> The link Matthew hands out that makes someone want him.

In practice that means recruiters, hiring managers, potential partners and co-founders, press, and investors. The second job, stated plainly, is to impress people. Every decision on this site is checked against those two goals.

Matthew, for context:

- Chief AI Officer at BrachyClip, an early-stage cancer medical device company.
- Recently VP of AI and Innovation at ICR.
- University of Michigan, B.A. Economics.
- Serial entrepreneur and builder. Voice is confident, warm, and direct, with no em dashes anywhere.

The real, LinkedIn-sourced content (experience, ventures, skills, education, interests, contact) lives in [[Content and Buckets]].

## The "Descent" concept

The site is an ocean. Scrolling and navigating means descending, from a sunlit surface down to a bioluminescent abyss. You start at the surface (the launchpad), and as you move deeper the water darkens, the fog thickens, the plankton multiply, and the creatures change. By the floor you are in the dark with an anglerfish glowing nearby.

Depth is the organizing metaphor for everything: the navigation, the color palette, the creatures, even the AI assistant. The deeper you go, the more there is to find.

### Why the ocean theme is authentic to Matthew

This is not a random aesthetic. Matthew's real ventures are ocean-coded, so the theme is true to his actual brand history:

- **Ocean Supply**, his sneaker business.
- **Mocean Technologies**, which reads as M. Oshin plus Ocean, with a shark logo.
- **Profit Paradise**, with a palm-tree logo.

The ocean was already his visual language. The site just makes it the whole world. That authenticity is the first and most important design decision, captured in the [[Decision Log]].

## North star, in one line

Build the link Matthew hands out that makes someone want him, and impress people while doing it. When two paths are in tension, pick the one that better serves that goal.

## Quick facts

| Item | Value |
| --- | --- |
| Live URL (older public build) | https://matthewoshin-site.vercel.app |
| Repo | github.com/mattoshin/matthewoshin-site (private) |
| Local path | `/Users/matthewoshin/Code/matthewoshin-site` |
| Dev command | `PORT=3100 pnpm dev` |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript strict |
| Styling | Tailwind CSS v4 (`@theme` tokens in `globals.css`) |
| 3D | three, @react-three/fiber v9, @react-three/drei v10, @react-three/postprocessing |
| State | zustand |
| Host | Vercel |

To run it locally:

```bash
cd /Users/matthewoshin/Code/matthewoshin-site
PORT=3100 pnpm dev
```

A note on the stack: `lenis` and `gsap` are still in `package.json` from the single-scroll era and are now largely unused after the move to multi-page navigation. The `/webdev` skill's FastAPI, Bootstrap, Electron, and discord.py stack belongs to Matthew's Galactic and Discord toolkit, not this site. This site is Next.js plus React Three Fiber. Full deploy and environment details are in [[Deployment and Ops]].

## Repository map

The pieces a new engineer will reach for first:

```text
src/app/layout.tsx                 root layout, mounts the persistent canvas via DescentChrome
src/app/page.tsx                   / launchpad (the surface)
src/app/{experience,entrepreneurship,skills,education,interests,contact}/   the depth pages
src/app/projects/[slug]/           case-study shells (sigma, galactic-signals)
src/app/api/oceanai/route.ts       OceanAI server route (Anthropic-backed)
src/app/globals.css                Tailwind v4 @theme tokens, depth palette, type, scrims
src/components/scene/OceanScene.tsx        maps the registry, runs the DepthController
src/components/scene/registry.ts           scene element registry
src/components/scene/elements/             procedural water and creatures
src/components/chrome/OceanAI.tsx          floating Claude chat widget
src/components/chrome/DescentChrome.tsx    wires the canvas + nav into the layout
src/components/chrome/StaticOcean.tsx      reduced-motion / no-WebGL fallback
src/lib/depth.ts                   zone center math (zoneCenterProgress, inZone, within)
src/lib/store.ts                   zustand depth store (targetProgress)
src/lib/webgl.ts                   WebGL2 capability check
src/data/content.ts                all real content (LinkedIn-sourced)
```

## How to read this wiki

Start with [[Home]] for the index, then follow the trail that matches what you are doing:

- **[[Architecture]]**: the persistent canvas in the root layout, route-driven depth, and how navigating dives the camera. Read this first if you are touching routing or the scene.
- **[[Ocean Scene]]**: the WebGL scene: water, light, and the procedural creatures, plus the registry contract for adding a new element.
- **[[Design System]]**: the depth-zone palette, the one coral accent, typography, scrims and legibility, accessibility, and performance.
- **[[OceanAI]]**: the Claude-backed chat widget, its persona, the API route, the graceful fallback, and the planned gbrain grounding.
- **[[Content and Buckets]]**: the real content in `src/data/content.ts`, the seven buckets, and the confidentiality rules.
- **[[Roadmap]]**: what is done and what is next (case studies, gbrain RAG, custom domain, newsletter).
- **[[Decision Log]]**: the why behind the big calls (ocean theme, multi-page, blend palette, procedural creatures, fish redesign, light scrim, coral accent, AI fallback).
- **[[Build Log]]**: the phase-by-phase build history from the git commits.
- **[[Deployment and Ops]]**: hosting, environment variables, and the pending deploy and privacy decisions.

If you are opening this project cold, read this page, then [[Architecture]], then [[Ocean Scene]]. Those three give you the mental model for everything else.
