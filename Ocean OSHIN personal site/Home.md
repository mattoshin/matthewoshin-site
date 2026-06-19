---
title: Home
tags: [matthewoshin-site, moc, index]
---

# Ocean OSHIN personal site

The project wiki for **The Descent**, Matthew Oshin's personal hub and portfolio: an ocean you move down through, where navigating between pages dives the camera from a sunlit surface to a bioluminescent abyss. This is the map of content. Open any page below in Obsidian.

> One-liner: the link Matthew hands to recruiters, partners, press, and investors. The medium proves the message, he builds, so the site is a thing most people cannot build.

## Start here

- [[Project Overview]] :: what the site is, who it is for, the concept, the live URL, and how to read this wiki.

## Build it / change it

- [[Architecture]] :: the multi-page site, the single persistent WebGL canvas, and route-driven depth (the dive). Read first if you touch routing or the scene.
- [[Ocean Scene]] :: the WebGL ocean, every procedural creature, and the registry contract for adding a new one.
- [[Design System]] :: the depth-zone palette, the one coral accent, the type trio, the legibility scrim, and the a11y rules.
- [[OceanAI]] :: the Claude-backed chat guide, its persona, the API route, the graceful fallback, and the planned gbrain grounding.
- [[Content and Buckets]] :: the real content in `src/data/content.ts`, the buckets, and the confidentiality rules.

## Direction / history

- [[Roadmap]] :: what is done and what is next (case studies, gbrain RAG, custom domain, newsletter).
- [[Decision Log]] :: the why behind the big calls.
- [[Build Log]] :: the phase-by-phase commit history.
- [[Deployment and Ops]] :: hosting, environment variables, and the pending deploy and privacy decisions.

## Fast facts

| | |
|---|---|
| Repo | `github.com/mattoshin/matthewoshin-site` (private) |
| Local | `~/Code/matthewoshin-site` |
| Dev | `PORT=3100 pnpm dev` then http://localhost:3100 |
| Stack | Next.js 16, React 19, TypeScript, Tailwind v4, Vercel |
| 3D | three + react-three-fiber v9 + drei + postprocessing |
| Live | `matthewoshin-site.vercel.app` (older build, public; see [[Deployment and Ops]]) |
| Routes | `/` plus `/experience` `/entrepreneurship` `/skills` `/education` `/interests` `/contact` |

## House rules

- No em dashes anywhere. Ever.
- Only publish the public figures. See the confidentiality section in [[Content and Buckets]].
- Scene elements are procedural and license-clean. See [[Ocean Scene]].
- Legibility comes from text treatment, not from darkening the ocean. See [[Design System]].
