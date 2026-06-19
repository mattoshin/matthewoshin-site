---
title: OceanAI
tags: [matthewoshin-site, chat, api]
---

# OceanAI

OceanAI is the floating chat guide on the site. It is a small, playful, warm deep-sea persona that answers questions about Matthew Oshin: who he is, what he has built, his skills, and the site itself. It lives as a bioluminescent anglerfish-lure button pinned to the bottom-right of [[Project Overview|the descent]], opens into a glassy ocean-dark panel, and talks to a single server route that calls Claude.

The whole point is conversational discovery. A recruiter, partner, or investor can ask "what has Matthew built?" instead of hunting through buckets, and get a tight, on-brand answer. See [[Project Overview]] for the north star this serves.

## Two files

| Piece | Path | Role |
| --- | --- | --- |
| Widget (client) | `src/components/chrome/OceanAI.tsx` | The FAB, the dialog panel, message state, fetch to the route |
| Route (server) | `src/app/api/oceanai/route.ts` | Validates the request, calls Anthropic, never 500s |

The widget is a default-export client component (`"use client"`). It does not mount itself. The integrator renders `<OceanAI />` once, high in the tree, after the canvas. In this site that happens in the root layout via the chrome layer, so the widget is global and survives client-side route changes the same way the persistent canvas does. See [[Architecture]] for why the chrome and canvas live in the root layout.

## The widget UX

The FAB is a real `<button>` fixed at `bottom-5 right-5`, `z-50`. Closed, it shows the `LureGlyph` (a hand-drawn anglerfish with a glowing bulb on a stalk) plus a small bioluminescent ping dot. Open, it swaps to a close glyph and the glow ring intensifies.

Opening the panel seeds a greeting the first time it is shown:

```
Hi, I'm OceanAI, your guide to the deep. Ask me anything about Matthew,
what he's built, or this strange glowing site.
```

The panel is a labelled dialog anchored `bottom-24 right-5`, width `min(360px, calc(100vw - 2.5rem))`, max height `70vh`. It uses the site's ocean tokens: bio-cyan and bio-aqua glow, `ink-*` text, a dark translucent glass background with `backdrop-blur-xl`. Assistant bubbles are tinted cyan, user bubbles are neutral white-tint. See [[Design System]] for the tokens.

Flow:

1. On first open, three starter chips appear (only while `messages.length <= 1` and not pending): "What has Matthew built?", "Tell me about Mocean", "Why the ocean theme?". Clicking a chip sends it.
2. The user types in the textarea and sends. A typing indicator (three bouncing dots) shows while `pending`.
3. The assistant reply renders as a cyan bubble. The list auto-scrolls to the newest content.
4. On any fetch failure the widget shows an inline error: "Something stirred in the dark and the signal dropped. Please try again."

State lives entirely in the component (`useState`). Nothing is persisted across reloads.

### Accessibility

Accessibility is built in, matching the WCAG AA + reduced-motion posture of the rest of the site (see [[Design System]]).

- Every control is a real `<button>`. The FAB carries `aria-haspopup="dialog"`, `aria-expanded`, and a descriptive `aria-label` that changes with open state.
- The panel is `role="dialog"` with `aria-modal="true"`, `aria-labelledby` (the "OceanAI" heading) and `aria-describedby` (the "your guide to the deep" tagline).
- Esc closes the panel from anywhere on the page. Enter sends, Shift+Enter inserts a newline.
- On open, focus moves into the input. On close, focus returns to the FAB.
- The typing indicator is in an `aria-live="polite"` region with an `sr-only` "OceanAI is typing" label. The error is `role="alert"`.
- Honors `prefers-reduced-motion`: no scale/transform animations, instant scroll instead of smooth, and the lure ping is suppressed (`motion-safe:animate-ping`).

## The API route contract

`POST /api/oceanai`. Node runtime (default). No SDK dependency, it calls the Anthropic Messages API via plain `fetch`.

### Request

```json
{
  "messages": [
    { "role": "user", "content": "What has Matthew built?" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "Tell me about Mocean" }
  ]
}
```

`messages` must be a non-empty array of `{ role: "user" | "assistant", content: string }`. The route validates and sanitizes it server-side:

- Empty-string turns are dropped silently.
- Each `content` is trimmed and capped at `MAX_CONTENT_CHARS` (1500 chars).
- Only the last `MAX_TURNS` (12) turns are kept, as a cost and latency guard. The widget already trims to the last 12 before sending, so both ends agree.

A malformed body returns a real `400`:

| Condition | Status | Body |
| --- | --- | --- |
| Body is not valid JSON | 400 | `{ "error": "Invalid JSON body." }` |
| Body is not an object | 400 | `{ "error": "Request body must be an object with a messages array." }` |
| `messages` invalid or empty after sanitizing | 400 | `{ "error": "messages must be a non-empty array of { role: 'user' \| 'assistant', content: string }." }` |

### Response

```json
{ "reply": "Matthew is a builder. He founded Mocean Technologies...", "fallback": false }
```

`reply` is always a string. `fallback` is present and `true` only when the canned reply was served instead of a live model answer. On a successful live call the route returns just `{ reply }` (no `fallback` field).

### Model and persona

| Setting | Value |
| --- | --- |
| Model | `claude-haiku-4-5` |
| Max tokens | 600 |
| Endpoint | `https://api.anthropic.com/v1/messages` |
| `anthropic-version` | `2023-06-01` |

The system prompt makes OceanAI a playful, warm deep-sea guide with light, tasteful ocean flavor (the occasional sea metaphor, never forced). It is concise (2 to 5 sentences), and it ONLY discusses Matthew Oshin. Off-topic asks (general trivia, coding help, world events, other people) get a gentle steer back to Matthew. The prompt explicitly bans em dashes (matching Matthew's voice rule), and it includes a grounded bio block so the model answers accurately without inventing facts: BrachyClip (CAIO), ICR (VP of AI, recent), Manatuck Hill equity research, Element Underground, Mocean Technologies, Profit Paradise, Ocean Supply, Resell Network, current builds Sigma and Galactic Signals, University of Michigan B.A. Economics, and contact details. Only the public figures from [[Content and Buckets]] appear there. See [[Decision Log]] on confidentiality.

### The graceful no-key fallback (never 500s)

This is the load-bearing design decision (see [[Decision Log]]). The route never returns a 500 to the user. Both a missing key and any upstream failure degrade to the same warm, on-brand canned reply, so the widget keeps working even with no key configured.

`fallback` is served (`{ reply: FALLBACK_REPLY, fallback: true }`) when any of these happen:

- `ANTHROPIC_API_KEY` is not set in the environment.
- The Anthropic call returns a non-OK status (the route drains the body so the connection can be reused, then falls back).
- The upstream JSON has no extractable text (the route concatenates `type === "text"` blocks; an empty result triggers fallback).
- A network error, timeout, or malformed upstream JSON throws (caught and turned into the fallback).

The canned reply is a real one-line bio plus a next step:

```
I'm OceanAI, your guide to Matthew Oshin's world. Matthew is a builder and
Chief AI Officer at BrachyClip, formerly VP of AI & Innovation at ICR, with a
track record spanning equity research, hospitality (Element Underground), and
ventures like Mocean Technologies. Surface the buckets above to explore his
work, or reach him directly at matthewoshin@gmail.com.
```

Because the route only 400s on genuinely malformed input and the widget only sends well-formed payloads, the widget's inline error text ("Something stirred in the dark...") is effectively a network-level safety net. In normal operation the user always gets a reply, live or canned.

## How to enable live answers

Live answers need a Claude key in the deployment environment. Without it, the route still works and just serves the canned fallback.

1. Add `ANTHROPIC_API_KEY` to the Vercel project (Production, and Preview if you want live answers on previews).
2. Redeploy. The route reads `process.env.ANTHROPIC_API_KEY` at request time, so the next deploy picks it up.

Local development: put `ANTHROPIC_API_KEY` in `.env.local` and run `PORT=3100 pnpm dev`. See [[Deployment and Ops]] for the full env-var and deploy story, and the pending public-vs-gated decision.

```bash
# local smoke test once the key is set
curl -s localhost:3100/api/oceanai \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"Who is Matthew?"}]}'
```

A response with no `fallback` field means the live model answered. `"fallback": true` means the key is missing or the upstream call failed.

## Planned: gbrain RAG grounding

Today the persona is grounded only by the static bio block baked into the system prompt. The planned upgrade (see [[Roadmap]]) is to ground OceanAI in gbrain (RAG) so it answers from Matthew's real indexed history instead of a fixed paragraph:

- Local development would query the indexed brain via the gbrain CLI.
- Production would query the Supabase brain directly.
- The same graceful fallback posture holds: if retrieval is unavailable, OceanAI degrades to the static bio answer rather than failing.

This is a NEXT item, not built yet. The current static grounding is intentional for the first ship and keeps the route self-contained and key-optional. See [[Roadmap]] for where this sits relative to case studies, custom domain, and the newsletter popup, and [[Deployment and Ops]] for the Supabase keys it would require.

## Related

- [[Architecture]] - why the widget mounts globally in the root layout
- [[Roadmap]] - the gbrain RAG grounding and other NEXT items
- [[Deployment and Ops]] - env vars, the API key, and deploy flow
- [[Design System]] - the ocean tokens the widget reuses
- [[Content and Buckets]] - the source of the public bio facts
- [[Decision Log]] - the graceful-fallback and confidentiality decisions
