# Changelog

Release notes for matthewoshin.com. Versions use MAJOR.MINOR.PATCH.MICRO.

## [1.2.6.0] - 2026-09-03

### Changed
- Content-page headings use Fraunces, the share card's serif, through a new `font-serif` token (`--font-fraunces` from next/font, variable weight, optical size, roman + italic). Page titles, section and entry headings, case-study titles, venture pull quotes and blog prose headings all follow it. The home descent panels' h2 and beat follow it too, since they are the same glass panels the subpages use. Type that sits on the water (hero, nav wordmark, bucket labels, OceanAI) stays Poppins, so the playful sans on the scene is untouched; this is design audit F-013, and the split is what the Poppins-only pass (#53) was protecting.
- Entry headings carry `leading-snug`, the entrepreneurship one-liner no longer out-weighs its serif title, the interests digest heading matches the schools digest size, and venture pull quotes sit at medium weight so the italic hairlines keep their colour (design review).
- `display-type.test.tsx` binds the font wiring to the rendered classes: Fraunces loaded on `<html>`, the serif token, PageShell, About and home-panel headings in the serif, and the on-the-water components still on `font-display`.

## [1.2.5.0] - 2026-09-03

### Changed
- The About page follows the same rule as the rest of the site: its
  Education and Off the clock sections drop their boxes for hairline rows
  and two editorial columns, so a box only ever means "you can open this".

## [1.2.4.0] - 2026-09-03

### Changed
- A box now means "you can open this". Experience, Education and Interests
  no longer wrap their entries in cards: Experience reads as a timeline on a
  rule with a dot per role and the dates above it, Education as plain rows
  where the two schools with their own page keep an arrow, and Interests as
  two editorial columns with a thin rule above each entry. Portfolio and
  Writing keep their cards because there the card is the link.

## [1.2.3.0] - 2026-09-03

### Added
- Every portfolio card now opens with a screenshot of the actual product, so
  the work is seen before it is read. Thirteen captures from the live demos
  and sites, one uniform grid, nothing singled out. The first row loads with
  the page and the rest load as you scroll, so the page stays light.
- `scripts/capture-portfolio-thumbs.sh` regenerates the thumbnails from
  production whenever a demo or site changes.

## [1.2.2.0] - 2026-09-03

Six quick fixes from the 2026-09-03 design audit. Nothing changes how the
site looks at a glance; everything changes how it feels to use on a phone
or with a keyboard.

### Fixed
- Every small link is now easy to tap. Nav pills, the wordmark, footer links,
  the "Open ..." arrows on the home page, the case-study links and the
  demo-bar links all respond to a 44px touch area (a new `hit` utility
  extends the target without changing the visible size). Social icons sit in
  40px boxes (44 would crowd the nav on a small laptop) and the mobile menu
  button is 44px. Wrapped footer rows on phones are spaced so the enlarged
  targets never overlap.
- Keyboard focus no longer squares off round buttons and pills: the focus
  ring follows each control's own shape.
- Keyboard users can see where they are inside the chat widget: the
  launcher, close, suggestion chips and send button show the site's focus
  ring again.
- The Contact page eyebrow reads "Contact" instead of "Interests" (it shares
  that depth of the ocean but is its own page).
- The portfolio filter tells screen readers the truth: pressed buttons with
  a spoken "Showing N of M projects" instead of tabs that had no panels.
- Page titles wrap in balanced lines on narrow screens instead of leaving a
  single word on the last line.

### Changed
- The writing index and post pages use the same page shell as every other
  section: reading-width column, the 650m Writing eyebrow, a back link above
  the eyebrow on posts and the date under it.

## [1.2.1.0] - 2026-09-03

### Changed
- The link preview card (what iMessage, LinkedIn, and X show when you paste
  matthewoshin.com) no longer names a job title or employer. The line under
  the name now reads "Builder. AI products, trading research tools, and
  companies." The circle portrait, water gradient, and domain footer are
  unchanged.
- The page description tag drops the "communications firm / medical device
  company" sentence and now says the same thing as the card.
- The card is rendered at build time from code instead of a static PNG, so a
  future wording change is a one-string edit in `src/data/content.ts`. X gets
  the same card through its own twitter-image route. The image URL includes a
  version derived from the name, tagline, fonts, and portrait, so link
  crawlers that cache by URL refetch after any change instead of showing the
  old card for days.
- The old `/og.png` address still works and serves the current card, so
  cached pages and old links do not break.

### Removed
- `public/og.png`, the static card with the old title painted into it.

### For contributors
- CI now builds and tests on Node 24, the line Vercel uses for production.

## [1.2.0.1] - 2026-08-25

### Added
- Observly's portfolio card now links out to its live site
  (observlymd.com) with a "View Site" button, matching the pattern
  already used for BrachyClip, mTrain, and Dog House.

## [1.2.0.0] - 2026-07-07

### Added
- Demo top bar is now a hierarchy-aware breadcrumb: Portfolio › Demo ›
  Dashboard. From any demo's dashboard the Demo crumb links straight back to
  that demo's own landing page, so you can step up one level without
  detouring through Portfolio and re-launching the demo. The demo registry
  moved to `src/data/demos.ts` (shared by the demos hub and the DemoBar), and
  a test covers the landing, dashboard, and index breadcrumb states.

## [1.1.0.0] - 2026-07-06

### Added
- /about: the whole picture in one read. At-a-glance facts, the full story,
  a trimmed toolkit, education cards, and off-the-clock interests, each
  section linking to its deeper page. Reachable from a new "More about me"
  hero chip, the footer, and the mobile menu.
- Dog House joins the portfolio under Web & Client: the photo-led band site
  plus self-serve CMS built end to end for a NYC rock band, with a full case
  study at /projects/dog-house and a View Site link to the live build.
- A real test suite: vitest + Testing Library, 17 tests over content
  integrity, page composition, and nav state, gated in CI on every push
  and pull request.
- OceanAI now knows about the Dog House build and points visitors to /about.

### Changed
- The nav's Contact button rests as translucent glass and fills turquoise
  only on hover or press, in the desktop bar and the mobile menu.
- Interests copy now reads "house sets behind the decks."

## [1.0.0.0] - 2026-07-06

Baseline. Names the site as it was live when versioning began: the
ocean-descent portfolio with the home dive, experience, ventures, the
portfolio of live demos, and OceanAI.
