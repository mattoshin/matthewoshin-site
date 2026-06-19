---
title: Roadmap
tags: [matthewoshin-site, roadmap]
---

# Roadmap

This is the plan of record for the site. It splits into three parts: what is DONE (the seven build phases that got us to the current multi-page Descent), what is NEXT (four cherry-picked moves from a CEO-style review, "Selective Expansion"), and PENDING DECISIONS (calls Matthew needs to make before the next moves can ship).

The north star never changes: this is the link Matthew hands out that makes someone want him (recruiters, partners, press, investors). Every item below either sharpens that pitch or removes a thing that breaks it.

For the commit-level history see [[Build Log]]. For the reasoning behind the big calls see [[Decision Log]]. For env keys and hosting see [[Deployment and Ops]].

## DONE (Phases 1 to 7)

All seven phases shipped to `main` in a single ultracode session (build, integrate, adversarial browser verify, commit each phase). One line each, in order.

| Phase | Commit | What shipped |
| --- | --- | --- |
| 1 | `e86902a` | Descent spine: route-driven depth, the persistent canvas, the dive between zones. |
| 2 | `fec309a` | Living ocean scene: the first seven procedural creatures (no external assets). |
| 3 | `3a16498` | Blend pass: brighter friendly reef palette plus recognizable reef creatures over the pure dark abyss. |
| 4 | `4b7a971` | Front-page launchpad, bucket nav, and the real LinkedIn-sourced content wired in. |
| 5 | `4add6b6` | [[OceanAI]]: the Claude-backed anglerfish-lure chat widget with graceful fallback. |
| 6 | `6442fcf` | Meta-design polish: fish redesigned to opaque steel-blue, one warm coral accent for wayfinding. |
| 7 | `54fd782` | Multi-page architecture: each bucket gets a crawlable URL while the persistent canvas keeps the dive. |

Two legibility passes landed between phases 6 and 7: `8a52870` (lighter scrim plus text-shadow so the ocean reads through) and `b428ba7` (responsive mobile hamburger nav plus stronger text).

## NEXT (Selective Expansion)

Four moves, picked deliberately over a longer wishlist. Each has a one-line why and any dependency it needs to go live.

### 1. Real case studies plus metrics

Add deep case studies with concrete numbers to the Experience and Entrepreneurship buckets, surfaced through the `/projects/[slug]` shells that already exist (sigma, galactic-signals).

- Why: the buckets currently summarize. Proof (the public Mocean and Element Underground numbers, the live Sigma and Galactic Signals builds) is what converts a visitor into a believer.
- Dependency: none technical. Content only. Stay inside the confidential boundary (public figures only, no profit splits, NDAs, equity terms, or party details). See [[Decision Log]].

### 2. OceanAI grounded in gbrain (RAG)

Move [[OceanAI]] from a static bio persona to retrieval over Matthew's real indexed history.

- Why: an AI that answers from Matthew's actual work is the single most impressive thing on the site, and it proves the AI-engineer claim instead of asserting it.
- Dependency: gbrain. Local dev queries via the gbrain CLI; production queries the Supabase brain directly, so this needs the Supabase keys in Vercel (see Pending Decisions). The current graceful static fallback stays as the floor so it never 500s.

### 3. Custom domain plus per-page OG images

Point `matthewoshin.com` at the site and generate a share image per page.

- Why: `matthewoshin-site.vercel.app` is not the link you hand out. A clean domain plus rich OG previews is the difference between a shared link that looks pro and one that looks like a draft.
- Dependency: domain DNS in Vercel. OG images are build-time, no keys.

### 4. Newsletter email popup

A Supabase-backed email capture popup.

- Why: turns one-time visitors (press, recruiters, partners) into a list Matthew owns.
- Dependency: Supabase keys in Vercel for the write path (see Pending Decisions).

## Pending decisions

These block or shape the NEXT moves. They are Matthew's calls, tracked in [[Decision Log]] and actioned in [[Deployment and Ops]].

### Deploy and privacy: public vs password gate

Decide whether the live site stays fully public or sits behind a password gate. The older public build is already up at `matthewoshin-site.vercel.app`. Going public maximizes shareability (the whole point of the north star). A gate buys control over who sees it before it is polished. Pick one before pointing the custom domain.

### Add keys in Vercel

Two moves above stay in fallback or off until these land in the Vercel project env:

```text
ANTHROPIC_API_KEY        # live OceanAI (without it, OceanAI serves the canned bio fallback)
SUPABASE keys            # newsletter writes + production gbrain RAG for OceanAI
```

Until then OceanAI runs on its graceful static reply and the newsletter has no backend. Setting these is the unlock for NEXT moves 2 and 4.

## Related pages

- [[Build Log]] for the full commit history and phase notes.
- [[OceanAI]] for the widget, the persona, the route, and the RAG plan.
- [[Deployment and Ops]] for hosting, env vars, and the domain steps.
- [[Decision Log]] for the why behind the architecture and the open calls.
- [[Project Overview]] and [[Home]] for the wider map.
