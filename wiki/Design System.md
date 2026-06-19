---
title: Design System
tags: [matthewoshin-site, design, css]
---

# Design System

This is the visual language of the site, the rules that keep "The Descent" legible, warm, and on-brand from the sunlit surface down to the abyss. Everything here lives in one file: `src/app/globals.css` (Tailwind CSS v4, `@theme inline` tokens). The depth-zone colors are mirrored in `src/lib/depth.ts`, which drives the WebGL fog. See [[Ocean Scene]] for the canvas side and [[Architecture]] for how the route-driven dive ties it all together.

The guiding idea: the moving ocean is the background and it must keep reading through the content. We earn legibility with text treatment (halos, shadows, a light veil), not by painting an opaque box over the water. The why behind each call lives in [[Decision Log]].

```text
src/app/globals.css   # the entire design system (tokens + utilities)
src/app/layout.tsx    # next/font bindings for the type trio
src/lib/depth.ts      # the SAME zone hex values, for WebGL fog
```

> Hard rule, repeated everywhere: NO em dashes. Use commas, periods, parentheses, or "to" and "and".

## The one source-of-truth warning

Zone colors are defined twice on purpose: as CSS variables (driving DOM surfaces like sections, chrome, and the static fallback gradient) and again in `src/lib/depth.ts` (driving the FogExp2 in the WebGL scene). If you change a zone color, change it in BOTH places or the DOM and the fog drift apart.

## Depth-zone palette

The palette is the "blend" reef look: a friendly, bright sunlit surface up top, and rich dark teal-navy (never flat black) in the deep. Each zone has a few stops used for gradients on the matching route. Zone ids are immutable because creatures and the depth controller gate on them.

| Zone (route) | Token | Hex | Role |
| --- | --- | --- | --- |
| Surface, 0m (`/`) | `--surface-sky` | `#d6f4fb` | Top of the sunlit gradient |
| | `--surface-water` | `#9be0ee` | Mid surface water |
| | `--surface-deep` | `#5cc6e0` | Lower surface, toward shallows |
| | `--surface-sun` | `#ffe9a8` | Warm sun cast |
| | `--surface-foam` | `#ffffff` | Foam, light halos |
| Sunlit shallows to twilight (`/experience`, `/entrepreneurship`) | `--mid-top` | `#0a3b4e` | Top of midwater, dark enough for AA |
| | `--mid-body` | `#093647` | Midwater body |
| | `--mid-deep` | `#082a39` | Lower midwater |
| Deep / midnight (`/skills`) | `--deep-top` | `#082633` | Top of the deep |
| | `--deep-body` | `#0a2532` | Deep body (and the page `--background`) |
| | `--deep-floor` | `#091f2b` | Deep floor |
| Abyss / seabed (`/education`, `/interests`, `/contact`) | `--abyss-top` | `#081c27` | Top of the abyss |
| | `--abyss-body` | `#071824` | Abyss body |
| | `--abyss-void` | `#071824` | Deepest void (halo/shadow base) |
| | `--abyss-silt` | `#0d3144` | Silty seabed accent |

The deep zones are deliberately dark teal-navy, not black, so the water still holds a blue-green cast and never goes to a dead void. See the route-to-zone mapping in [[Architecture]].

## Bioluminescent accents

The cool accents glow brighter the deeper you go. `--bio-cyan` is the primary: links, active states, focus rings, deep heading glow.

| Token | Hex | Role |
| --- | --- | --- |
| `--bio-cyan` | `#3fe0e6` | Primary glow, links, active, focus ring |
| `--bio-aqua` | `#5ff2c8` | Secondary accent |
| `--bio-lumen` | `#8fe8ff` | Light shafts, deep headings |
| `--bio-violet` | `#7b8cff` | Rare, sparing use |
| `--bio-hot` | `#36f5b0` | Single hot CTA per viewport, no more |

## The one warm accent: `--reef-coral`

Everything in the water is cool. So one warm accent does all the wayfinding, and it is rationed.

| Token | Hex | Role |
| --- | --- | --- |
| `--reef-coral` | `#ff9b5a` | Base coral/sun accent |
| `--reef-coral-soft` | `#ffb877` | Lighter coral for hovers and on-dark glows |

Where coral is allowed:

- Section eyebrows (the small mono labels above headings)
- The ACTIVE nav pill (paired with the `.glow-coral` shadow utility)
- Link, hover, and focus warmth
- Small markers and accents

Where it is NOT allowed: do not splash it across backgrounds, fills, or large surfaces. `--bio-cyan` stays the cool primary. Coral reads as a deliberate "you are here" cue, not decoration. The rationale (one warm accent against cool water for wayfinding) is in [[Decision Log]].

## Typography trio

Three families, bound to CSS variables in `src/app/layout.tsx` via `next/font/google`, then mapped to Tailwind font tokens in `globals.css` (`--font-display`, `--font-sans`, `--font-mono`).

| Family | next/font var | CSS token | Role |
| --- | --- | --- | --- |
| Fraunces | `--font-fraunces` | `--font-display` | Display serif. Large headings only. Variable, optical sizing + SOFT axes (`axes: ["opsz", "SOFT"]`), warm. |
| Hanken Grotesk | `--font-hanken` | `--font-sans` | Body copy. The default `body` font, line-height 1.65, antialiased. |
| JetBrains Mono | `--font-jetbrains` | `--font-mono` | Mono accent. Eyebrows, labels, and metrics only. |

Helper classes:

```css
.font-display { font-family: var(--font-display), Georgia, serif; font-optical-sizing: auto; }
.font-mono    { font-family: var(--font-mono), ui-monospace, monospace; }
.measure      { max-width: 68ch; }   /* target body column width */
```

Fraunces uses optical sizing on, so big headings get the warm high-contrast cut while smaller display text stays clean. Keep mono for short bursts (a label, a stat) so it stays a texture, not a paragraph.

## Legibility: text, not a dark box

This is the core principle of the whole system. The content rides over a live WebGL ocean whose brightness is unpredictable (blinding god rays at the surface, near-dark in the abyss). We keep type AA without killing the ocean.

### `.section-scrim` (the readability backbone)

A refined glass panel, NOT an opaque box. It is a teal-tinted dark veil plus a soft top-down gradient that guarantees light type clears WCAG AA over any zone, while the ocean still glows through and around it. The veil is kept intentionally light (44% to 52% opacity mixed toward `--deep-body` and `--abyss-body`) so the water reads through.

```css
.section-scrim {
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--deep-body) 44%, transparent),
    color-mix(in srgb, var(--abyss-body) 52%, transparent));
  border: 1px solid color-mix(in srgb, var(--bio-cyan) 12%, transparent);
  backdrop-filter: blur(7px) saturate(125%);
  /* + inset top highlight and a soft drop shadow */
}
```

The scrim also auto-applies a layered text-shadow halo to its headings, paragraphs, list items, links, and spans (a tight dark ring plus a softer spread), so deep body copy stays AA even where bright bioluminescence drifts behind it.

There is a light variant for the bright surface zone, where the text is dark on light: `.section-scrim--light` swaps the dark veil for a luminous pane of glass (mixed toward `--surface-sky` and `--surface-foam`) and gives its text a light halo instead.

### `.hero-halo` (for the bare hero)

The surface hero renders with NO scrim, so its dark type sits directly on the bright, variable, sunlit ocean. The halo is a layered white text-shadow (a tight luminous ring plus a softer spread) that lifts the dark ink off the surface WITHOUT darkening the background. There is a lighter `.hero-halo-soft` for the big display name, which is already high contrast.

```css
.hero-halo {
  text-shadow:
    0 1px 2px color-mix(in srgb, var(--surface-foam) 92%, transparent),
    0 0 18px color-mix(in srgb, var(--surface-foam) 78%, transparent),
    0 0 40px color-mix(in srgb, var(--surface-foam) 55%, transparent);
}
```

### Glow utilities

| Class | Effect | Use |
| --- | --- | --- |
| `.glow-cyan` | Cyan text-shadow | Deep headings and links |
| `.glow-hot` | Layered `--bio-hot` box-shadow | The single hot CTA per viewport |
| `.glow-coral` | Warm coral box-shadow | The active nav pill only |

## Spacing and motion

- Body copy targets a ~68ch column via `.measure`. Body line-height is 1.65 for comfortable reading over a busy background.
- Section corners are soft: the scrim uses `border-radius: 1.75rem`. Glass, not hard panels.
- Reveal motion is a gentle vertical rise: the `rise` keyframe (opacity 0 to 1, `translateY(24px)` to 0) on `.reveal`, with a calm `cubic-bezier(0.16, 1, 0.3, 1)` ease over 0.8s. It only runs under `prefers-reduced-motion: no-preference`.
- Depth motion is route-driven, not scroll-driven. The camera dives between pages; page scroll no longer changes depth. Smooth scroll is native fallback only (Lenis was used in the single-scroll era and is largely unused now). See [[Architecture]].

## Accessibility

The site is built to be usable and AA-legible by default, not as a bolt-on.

- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` zeroes out animation and transition durations globally and disables scroll smoothing. On top of that, a reduced-motion preference AND a manual toggle both unmount the WebGL canvas and render a deterministic per-route `StaticOcean` gradient instead. See [[Ocean Scene]].
- **WCAG AA contrast.** Ink tokens are tuned to clear AA across every zone with the scrim halo in play. Dark-zone text uses `--ink-heading #eaf6fb`, `--ink-body #d4e4ec`, `--ink-muted #a7c0cd`, `--ink-faint #6c8696`. The bright surface uses dark-on-light: `--ink-light-primary #03191f`, `--ink-light-secondary #062c38`. "Muted" is intentionally not a low-contrast grey.
- **Focus rings.** `:focus-visible` on links, buttons, and `[tabindex]` draws a 2px `--bio-cyan` outline with 3px offset and a small radius, clearly visible against the dark water.
- **Skip link.** A `.sr-only` "Skip to content" link is the first focusable element; it becomes visible on focus (`.focus:not-sr-only`) and jumps past the ocean chrome to `#content` (the wrapper in `src/app/layout.tsx`).
- **Screen reader text.** `.sr-only` is the standard visually-hidden utility.
- **No em dashes.** This applies to UI copy, content, and these docs. Use commas, periods, parentheses, or "to" and "and".

## Where to start when editing

1. Changing a zone color? Edit `:root` in `globals.css` AND the matching value in `src/lib/depth.ts`.
2. Adding an accent? Prefer an existing bio token. Coral is reserved for wayfinding only.
3. New legibility need? Reach for a halo or the scrim, never an opaque background.
4. Verify reduced-motion and the `StaticOcean` fallback still look right (see [[Ocean Scene]]).

Related pages: [[Ocean Scene]], [[Architecture]], [[Decision Log]], [[OceanAI]], [[Project Overview]], [[Home]].
