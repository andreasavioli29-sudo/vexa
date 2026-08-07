# The VEXA Design & Engineering Bible

**Status:** single source of truth for the VEXA codebase.
**Audience:** any engineer or designer touching this repository, from day one.
**Rule:** if this document and the code disagree, that is a bug — in the code if
the document describes an intended standard, or in the document if reality has
moved on and no one updated it. Either way, fix the mismatch in the same PR you
find it in.

This document describes the codebase as it actually exists today (verified
against source, not aspirational), plus the standards every future addition —
new pages, new scenes, new components — must follow. Where current code falls
short of the standard, that is called out explicitly as **debt**, not glossed
over. A new senior developer should be able to read this once and start
shipping VEXA-quality work without asking where anything goes.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Visual Principles](#2-visual-principles)
3. [Motion Principles](#3-motion-principles)
4. [Typography Rules](#4-typography-rules)
5. [Color System](#5-color-system)
6. [Spacing System](#6-spacing-system)
7. [Component Naming Conventions](#7-component-naming-conventions)
8. [Animation Guidelines](#8-animation-guidelines)
9. [Performance Rules](#9-performance-rules)
10. [Accessibility Rules](#10-accessibility-rules)
11. [Image Optimization Rules](#11-image-optimization-rules)
12. [Folder Architecture](#12-folder-architecture)
13. [Coding Conventions](#13-coding-conventions)
14. [Rules That Must Never Be Broken](#14-rules-that-must-never-be-broken)
15. [Roadmap of Future Sections](#15-roadmap-of-future-sections)

---

## 1. Design Philosophy

VEXA sits in the same tonal register as Apple, Bang & Olufsen, Rimowa, and
Nothing: **minimal layout, generous negative space, restrained motion,
precision typography.** Every design decision should be defensible against
the question *"would a €5,000 mattress brand's website do this?"*

Three non-negotiable premises follow from that:

- **Confidence over decoration.** The site earns attention through
  restraint — one accent color used sparingly, one display-font moment per
  screen, one continuous cinematic gesture rather than a dozen small ones.
  If a design choice needs to shout to be noticed, it's the wrong choice for
  VEXA.
- **The product is the hero, and the product is frozen.** VEXA ONE and VEXA
  SIGNATURE's shape, silhouette, proportions, stitching, and border are
  design-approved and outside engineering's authority to change. Every
  scene this codebase builds exists to frame that product, never to
  reinterpret it. See [Rule 14.1](#141-the-product-is-frozen).
- **Desktop-first, cinematic-first.** The current build (Sprint 1: Cinematic
  Hero) is explicitly optimized for desktop first. Mobile must not be
  broken, but desktop is where the brand statement is made, and no mobile
  compromise should be allowed to blunt the desktop experience.

The site's current structural metaphor — **Bed → Mattress** — is the model
for how every future scene should work: start with something familiar and
human (a room, a life, a moment), then reveal the product as the answer to
it, in one continuous gesture rather than a hard cut. New sections should
extend this metaphor, not abandon it for a generic "features grid" layout.

---

## 2. Visual Principles

- **One accent color, used sparingly.** Copper appears only for: kickers,
  the italic word of emphasis in a headline, hover/focus accents, small UI
  marks (the logo dot, progress lines). It never becomes a background fill
  or covers more than a few percent of any frame. If you're reaching for
  copper a third time in the same viewport, reconsider.
- **Black is the studio, not just a background.** The deep black scale
  (`--color-black-950…700`) is used deliberately in layers — atmosphere,
  vignette, blackout — to construct depth, not just as `background: black`.
  See [Section 5](#5-color-system).
- **Photography over illustration, always.** The hero uses the client's
  actual villa photograph and the actual VEXA ONE product photograph — never
  a CSS-rendered mockup or generic stock illustration standing in for the
  product. If a future scene needs new imagery, source or commission real
  photography before reaching for a placeholder.
- **No hard cuts inside a single narrative.** Within one scroll-driven
  sequence, transitions are dissolves, irises, and continuous camera moves —
  never a jump cut. Hard cuts are reserved for moving between distinct
  *pages* (e.g., homepage → `/one`), not within a page's own story.
- **Depth through layering, not through 3D.** There is no WebGL/Three.js
  anywhere in this codebase, and there shouldn't be one without a deliberate
  architecture decision (see [14.8](#148-dont-reach-for-a-3d-engine-by-default)).
  Depth, parallax, and "camera movement" are achieved with stacked
  `absolute`/`sticky` layers, CSS `perspective`/`rotateX`/`rotateY`, and
  scroll-linked scale/opacity — cheaper, more robust, and so far, entirely
  sufficient.
- **Grain, not gloss.** The `.bg-grain` film-grain overlay (`globals.css`)
  is applied at low opacity behind dark hero/studio sections to avoid the
  "flat vector" look large solid-black areas get on modern displays. Use it
  on any new full-bleed black section; don't invent a second texture
  technique for the same job.

---

## 3. Motion Principles

Motion in VEXA has exactly **two registers**, and every animation in the
codebase is one or the other. Know which one you're building before you
write a line of Framer Motion.

### 3.1 Scroll-scrubbed (progress-driven)

Tied directly to scroll position via a single `progress` value (0→1) from
Framer Motion's `useScroll`. There is no "duration" — the user's scroll
speed *is* the duration. This is how the cinematic hero's entire sequence
works: camera dolly, iris, mattress emergence, lift, rotation, settle, text
reveal — all one `progress` value, sliced into ranges.

**Rule:** a scroll-scrubbed sequence is defined once, in one hook, as a set
of named `[start, end] → [from, to]` ranges — see
[`use-hero-timeline.ts`](#123-hooks) as the reference pattern. It is never
scattered as ad hoc `useTransform` calls sprinkled through JSX.

### 3.2 Time-based (duration-driven)

Triggered by mount, hover, focus, or a state change, and driven by an
explicit `duration` and `ease`. This is how the navbar entrance, the mobile
menu, the intro-scene fade, and the premium loader work.

**Rule:** every time-based animation's `ease` comes from
[`src/lib/motion.ts`](#5-color-system) — `EASE_REVEAL` or `EASE_CURTAIN`.
**Never type a bezier array literal in a component file.** If neither
existing curve fits, that's a real design decision — add a third named
constant to `motion.ts` with a comment explaining when to reach for it,
don't hand-roll one inline.

### 3.3 The two curves, and when to use which

| Constant | Values | Feel | Used for |
| --- | --- | --- | --- |
| `EASE_REVEAL` | `[0.16, 1, 0.3, 1]` | Expo-out — fast start, long soft landing | Anything **arriving**: nav entrance, mobile menu open, scene fade-ins |
| `EASE_CURTAIN` | `[0.76, 0, 0.24, 1]` | Sharper, more deliberate | The loader's **dismissal** — anything being **taken away** |

If you're building an entrance, reach for `EASE_REVEAL` by default. If
you're building an exit/dismissal, reach for `EASE_CURTAIN`. A third curve
should only exist if a motion genuinely doesn't fit either job.

### 3.4 Scroll engine

Two systems run concurrently and this is intentional, not an oversight:

- **Lenis** (`SmoothScrollProvider`, mounted `root` in `layout.tsx`) applies
  inertial smoothing to native wheel/touch scroll site-wide.
- **Framer Motion's `useScroll`** independently tracks scroll position for
  any scroll-scrubbed sequence.

They don't need to talk to each other for scroll-scrubbing to work — Lenis
smooths the *input*, Framer reads the *resulting* native scroll position.
The one place they must coordinate is **scroll locking** (see
`PremiumLoader`): call `lenis.stop()`/`lenis.start()` *and* toggle
`document.documentElement.style.overflow`, together, every time. Removing
either half re-opens a way for the page to scroll when it shouldn't.

### 3.5 The pinned scroll-scrub pattern

Any new scroll-driven scene (the next one, per the roadmap, is likely a
Mattress → Craftsmanship or Mattress → Signature transition) must follow the
exact structural pattern established in `cinematic-hero.tsx`:

```tsx
const wrapperRef = useRef<HTMLDivElement>(null);
const { scrollYProgress: progress } = useScroll({
  target: wrapperRef,
  // Numeric, not "start start"/"end end" — an exact match against Framer's
  // built-in offset presets makes it swap to a native CSS ViewTimeline,
  // which is degenerate (frozen) for a target much taller than the
  // viewport, like this pinned scroll-scrub wrapper.
  offset: [[0, 0], [1, 0.999]],
});
```

wrapped in a tall outer `<div>` (e.g. `h-[220vh] sm:h-[260vh]`) containing a
`sticky top-0 h-svh` inner viewport. **Do not** use Framer's string offset
presets (`"start start"`, `"end end"`) on a wrapper taller than the
viewport — this is a known Framer/CSS-ViewTimeline interaction that freezes
the animation, not a style preference.

---

## 4. Typography Rules

Two font families, loaded exactly once, self-hosted via `next/font/google`
in `src/app/layout.tsx`:

| Token | Font | Role |
| --- | --- | --- |
| `--font-sans` | Geist Sans | Everything: UI, body copy, nav, buttons, kickers |
| `--font-display` | Fraunces (weights 300/400/500, italic + normal) | Editorial accent only — the single italic word/phrase that closes a headline |

**There is no `--font-mono`.** Geist Mono was removed (it was loaded and
wired into the design system but never used by any component — pure dead
weight). If a future feature genuinely needs a monospace face (a numeric
spec table, a price ticker), add it back deliberately, with an actual
consumer in the same PR — never speculatively.

### Rules

- **Fraunces is a punctuation mark, not a paragraph font.** One italic word
  or short phrase per headline, maximum. It's the visual equivalent of a
  vocal pause for emphasis — if you're setting more than a few words in it,
  you're misusing it.
- **Headline sizing uses `clamp()`, not breakpoint-by-breakpoint overrides.**
  The hero headline is `text-[clamp(2rem,5.6vw,4.75rem)]` — one fluid
  declaration instead of `text-3xl sm:text-4xl lg:text-6xl`. Prefer this
  pattern for any new large display text; it scales continuously instead of
  jumping at breakpoints.
- **Tracking (letter-spacing) is load-bearing for the brand voice.** Kickers
  and nav labels are uppercase with wide tracking
  (`uppercase tracking-[0.2em]` to `tracking-[0.5em]`) — this is what makes
  small caption text read as "considered" rather than "default browser
  text." Never set an uppercase label without generous tracking.
- **Font weights stay light.** Body/headline default weight is `font-light`
  or the font's own light/normal weight; `font-medium` is reserved for UI
  labels (nav, buttons, kickers) that need to hold their own at small sizes.
  Never use a bold/black weight for display text — it reads as a generic
  template, not VEXA.
- **`display: swap` always.** Every `next/font` call includes
  `display: "swap"`. Don't remove it — it avoids invisible-text flashes
  while self-hosted fonts load, at the (accepted) cost of a brief
  system-font flash before swap.

---

## 5. Color System

All tokens live in `src/app/globals.css`, defined once under `:root` and
re-registered under `@theme inline` so Tailwind generates utilities from
them (`bg-black-900`, `text-copper-300`, etc.). **Never hardcode a hex value
in a component.** If the exact shade you need doesn't exist as a token,
that's a signal to add one to `globals.css`, not to reach for `bg-[#1a1a1a]`.

### 5.1 The three scales

| Scale | Tokens | Purpose |
| --- | --- | --- |
| **Black** | `--color-black-950` `#030303` → `--color-black-700` `#101012` | Studio/background layers. Deliberately used in *steps* (blackout, atmosphere, vignette) to build depth, not as one flat fill. |
| **Anthracite** | `--color-anthracite-900` `#1c1c1e` → `--color-anthracite-100` `#e8e8e9` | All grey text, borders, and surfaces. `300` is the default body/nav text color on black; `400` is the dimmest anything gets (see contrast note below). |
| **Copper** | `--color-copper-600` `#8a5230` → `--color-copper-100` `#f3ddc7` | The one accent. `400` is the default accent shade; `300` and `200` are for text-on-black accent use (kickers, italic emphasis). |

### 5.2 Verified contrast baseline

These exact pairings have been measured (WCAG relative-luminance contrast
ratio) against the `--background` black (`#050505`) and must be treated as
the floor, not the target:

| Foreground | Ratio vs. black | Verdict |
| --- | --- | --- |
| `anthracite-300` (primary nav/body text) | ≈ 8.1 : 1 | Comfortably exceeds AAA (7:1) |
| `copper-300` at 90% opacity (kicker text) | ≈ 7.7 : 1 | Comfortably exceeds AAA |
| `anthracite-400` (dimmest text in use — footer legal links) | ≈ 4.8 : 1 | Just clears AA (4.5:1) — **this is the floor** |

**Rule:** never introduce a text color dimmer than `anthracite-400` on a
black background. If a design comp calls for something dimmer "for
hierarchy," solve it with size/weight/tracking instead of contrast.

### 5.3 Known inconsistency (flagged, not fixed)

`--radius: 0.25rem` is declared under `:root` but **never registered under
`@theme inline`**, so it produces no Tailwind utility. The one component
that needs a border radius (`Button`) uses a hardcoded `rounded-[6px]`
instead. Until this is deliberately resolved, treat `rounded-[6px]` as the
de facto standard for small UI elements (buttons, chips, inputs) — **don't**
start referencing `var(--radius)` in new code without first fixing the
token registration, or you'll get a silent no-op.

### 5.4 Where color logic belongs

Ambient glows and gradients (the mattress's studio-dressing halo, the
atmosphere layer's radial gradients) currently mix approximated literal
`rgba()` values with the copper token family. When adding a new glow/gradient
effect, prefer deriving it from a token via `color-mix()` — exactly as
`::selection` already does:

```css
background: color-mix(in oklab, var(--color-copper-400) 35%, transparent);
```

over inventing a new `rgba(193, 122, 78, 0.16)`-style literal that
approximates but doesn't reference the token.

---

## 6. Spacing System

There is **no custom spacing scale** — VEXA uses Tailwind's default
4px-based spacing (`p-1` = 4px, `p-4` = 16px, etc.) throughout. Don't add a
custom spacing token file; the default scale has been sufficient for every
layout built so far.

### 6.1 The container pattern

Every full-width section (navbar, footer, and any future top-level section)
uses this exact container shape — copy it verbatim, don't approximate it:

```
mx-auto max-w-[1600px] px-8 sm:px-12 lg:px-20
```

- `max-w-[1600px]` — the page never exceeds this width; content centers
  within it on very large displays.
- `px-8 sm:px-12 lg:px-20` — horizontal breathing room that grows with
  viewport width.

The one sanctioned exception is centered text content that isn't a
full-width container in its own right (the hero's headline/CTA column uses
`px-6` instead of `px-8`, since it's a narrower, centered text block, not an
edge-aligned nav/footer row). If you're building a new full-width section,
use the container pattern above; if you're building centered prose inside
one, `px-6` is acceptable.

### 6.2 Vertical rhythm

- Section vertical padding: `py-20 sm:py-24` (see `Footer`) for standalone
  page sections.
- Component-internal spacing uses `gap-*` on flex/grid containers in
  preference to margin chains — check any existing component before adding
  a new one; margins between siblings inside a single component are a
  smell.
- The hero content column uses top padding that scales across breakpoints
  (`pt-32 sm:pt-36 lg:pt-40`) to clear the fixed navbar (`h-20`) with
  consistent breathing room — replicate this offset for any new content
  that sits directly under the fixed nav.

---

## 7. Component Naming Conventions

These are 100% consistent across the current codebase — verified against
every file, not aspirational. Follow them exactly.

- **Files are kebab-case.** `premium-loader.tsx`, `smooth-scroll-provider.tsx`,
  `use-hero-timeline.ts`, `hero-assets-provider.tsx`. No `PremiumLoader.tsx`,
  no `premiumLoader.tsx`.
- **Exports are PascalCase for components, camelCase for hooks/utilities.**
  `export function PremiumLoader()`, `export function useHeroTimeline()`,
  `export function cn()`.
- **Every component and hook is a named export.** `export function X`, never
  `export default function X`. The **only** exceptions are Next.js's own
  required special files — `page.tsx` and `layout.tsx` — which the
  framework requires to default-export. If you're writing a default export
  anywhere else, you're breaking convention.
- **Hooks are prefixed `use-` in the filename and `use` in the export.**
  `use-hero-timeline.ts` → `useHeroTimeline`. Hooks live in `src/hooks/`,
  never inline-defined-and-reused across files from inside a component file.
- **Props types are named `<Component>Props`.** `HeroProps`,
  `MattressVisualProps`, `LogoMarkProps`. Not `Props`, not `IHeroProps`.
- **A file may export a tightly-coupled secondary symbol.** `logo.tsx`
  exports both `Logo` (the composed wordmark+mark) and `LogoMark` (just the
  mark) because callers legitimately need both — this is fine when the two
  exports are this closely related. It is not a license to bundle unrelated
  components into one file.
- **Context providers are named `<Domain>Provider`, with paired hooks named
  for what they do, not how they're implemented.** `HeroAssetsProvider`
  pairs with `useMarkHeroAssetLoaded()` and `useHeroAssetsReady()` — not
  `useHeroAssetsContext()`. Name the hook after the question it answers or
  the action it performs.

---

## 8. Animation Guidelines

- **Every new animated component decides, explicitly, which register it's
  in** (see [Section 3](#3-motion-principles)) before any code is written.
  If you find yourself mixing a `useTransform` scroll value with an
  arbitrary hardcoded `duration`, stop — that's usually a sign the two
  registers are being conflated.
- **Ambient/looping animations (`repeat: Infinity`) must be transform-only.**
  The mattress's idle float (`animate={{ y: [...], rotate: [...] }}`) only
  ever touches `transform`-backed properties, never anything that forces
  layout/paint (`width`, `top`, `margin`, box-shadow spread, etc.). This is
  what keeps it compositor-cheap enough to run indefinitely.
- **An ambient loop should not run while its element is fully invisible.**
  Known debt: the mattress float loop currently runs from mount, including
  during the ~0–52% scroll range where the mattress is at `opacity: 0`. New
  ambient loops must gate on visibility (e.g., derive an `animate`/`stop`
  toggle from the same opacity motion value) rather than running
  unconditionally from mount.
- **A scroll timeline is data, not scattered JSX.** Extend
  `use-hero-timeline.ts`'s pattern: one hook, taking `progress`, returning a
  plain object grouped by scene (`{ intro: {...}, mattress: {...}, hero:
  {...} }`). A new scene gets a new named group in the returned object, not
  a new pile of ungrouped `useTransform` calls in the consuming component.
- **Pointer/mouse-reactive effects are a separate hook from the scroll
  timeline.** `use-pointer-tilt.ts` is intentionally independent of
  `use-hero-timeline.ts` — one is scroll-progress-driven, the other is
  pointer-position-driven, and they should compose via props, not merge
  into one mega-hook.
- **`prefers-reduced-motion` is mandatory for new work, full stop.** Every
  new animated component must call `useReducedMotion()` (from
  `framer-motion`) and either skip the motion or substantially shorten it.
  `PremiumLoader` is the reference implementation. **Known debt:** the
  cinematic scroll sequence and the mattress's ambient float loop do not
  yet honor it — this is an open violation of this rule against *existing*
  code, tracked for remediation, not a precedent to extend.

---

## 9. Performance Rules

- **One network request per asset, always.** If something needs to know
  when an image has loaded (a loader, a gate, a transition trigger), it
  listens to the actual `<Image onLoad>`/`onError` event — via the
  `HeroAssetsProvider` pattern (`src/components/providers/hero-assets-provider.tsx`)
  — rather than independently re-fetching the same URL with `new Image()`.
  A raw `new Image()`/`fetch()` preload of a path that a `next/image`
  component *also* renders is a guaranteed double-download, because
  Next rewrites the displayed image to an optimized `/_next/image?...` URL
  that doesn't share a cache entry with the raw original. This exact bug
  existed in this codebase once and was fixed — don't reintroduce it.
- **`priority` is reserved for the true above-the-fold LCP element, singular.**
  Marking two images `priority` makes them compete for initial bandwidth.
  Only the image the user actually sees first should carry it.
- **No dead weight ships.** A font, CSS keyframe, design token, or npm
  dependency with zero consumers does not merge, ever — not "for later."
  (Geist Mono and two unused `@keyframes` were removed from this codebase
  for exactly this reason.) If you're adding something for a near-future
  feature, add it in the PR that uses it.
- **Fonts are self-hosted via `next/font` only.** Never link an external
  font stylesheet (Google Fonts CDN `<link>`, etc.) — it reintroduces an
  external request and a FOIT/layout-shift risk that `next/font` exists to
  eliminate.
- **`backdrop-blur` is a deliberate, budgeted choice.** It's used once (the
  navbar's glass state on scroll) and that's the current budget. Adding it
  to more elements should be a conscious performance decision, not a
  drive-by aesthetic tweak.
- **Bundle size is a reviewable metric.** Run `npm run build` before
  proposing a change and note the `/` route's First Load JS in your PR
  description if it moves meaningfully. As of this writing it is ~19.7 kB
  route-specific / ~172 kB total first load — treat a significant regression
  as something to justify, not something to ignore.

---

## 10. Accessibility Rules

- **Contrast floor: `anthracite-400` on black (~4.8:1).** Nothing dimmer
  ships. See [5.2](#52-verified-contrast-baseline).
- **Semantic landmarks are mandatory.** `<header>`, `<main>`, `<footer>` —
  one of each, always present, exactly as `page.tsx`/`Navbar`/`Footer`
  already establish. A new top-level page must preserve this shape.
- **Exactly one `<h1>` per page.** Heading levels increment logically for
  any subsequent headings (`<h2>`, then `<h3>` — never skip a level).
- **`aria-hidden="true"` is for genuinely decorative content only, and it
  must be scoped to the smallest wrapping element that's actually
  decorative** — not to a wrapper that happens to also contain meaningful
  content. (`IntroScene`'s villa photo is deliberately *not* hidden — its
  `alt` text is real content for screen-reader users; only the vignette
  overlay div carries `aria-hidden`.)
- **An interactive element must never be keyboard-focusable while
  invisible-and-unclickable.** If an element's `opacity` and
  `pointer-events` are both driven by the same motion value, they must
  reach their "interactive" state atomically — a link should not be
  reachable by <kbd>Tab</kbd> while it's still transparent and
  `pointer-events: none`. **Known debt:** the hero's CTAs are currently
  tab-reachable well before they're visible/clickable (their
  `textPointerEvents` only flips to `"auto"` once opacity exceeds 0.6, but
  nothing removes them from the tab order before that point). Any new
  scroll-revealed interactive element must close this gap rather than copy
  the existing pattern — e.g. drive `tabIndex` from the same threshold.
- **Every new large-scale motion sequence must have a `prefers-reduced-motion`
  path before it ships**, not as a follow-up ticket. See
  [Section 8](#8-animation-guidelines).
- **Focus states must be visible and on-brand.** Interactive elements use
  `focus-visible:ring-1 focus-visible:ring-copper-300
  focus-visible:ring-offset-2 focus-visible:ring-offset-black` (see
  `Button`) — never `outline-none` without an equivalent visible
  replacement.
- **`alt` text is written for content, not decoration.** If an image *is*
  the content (a photo standing in for descriptive text), write a real,
  specific `alt`. If it's purely decorative, hide it via `aria-hidden` on
  its container and skip the `alt` debate — don't write `alt=""` on
  meaningful imagery to make a lint rule happy.

---

## 11. Image Optimization Rules

- **`next/image` only. No raw `<img>`, ever.** It's what gives us automatic
  format negotiation (AVIF/WebP), responsive sizing, and lazy-loading by
  default.
- **`sizes` is mandatory on every `<Image fill>`.** Match the element's
  actual rendered width at each breakpoint — don't default to `100vw` for
  something that's never full-width.
- **Asset paths are centralized, never inline string literals repeated
  across files.** New hero-critical (or otherwise gate-worthy) image paths
  go in `src/lib/hero-assets.ts` as a named constant, imported everywhere
  that path is needed — the component that renders it *and* anything
  gating on its load. This is what prevents the path used to render an
  image and the path used to preload/gate on it from silently drifting
  apart.
- **File extensions must match actual encoding.** `vexa-one-hero.png` was
  actually JPEG-encoded under a `.png` extension until this was caught and
  fixed — verify with `file <path>`, not by trusting the extension, before
  adding a new asset.
- **Loading-completion signals go through `HeroAssetsProvider`, never a
  second fetch.** See [Section 9](#9-performance-rules) — this is the same
  rule stated from the image-optimization side: don't build a new gate that
  re-downloads what `next/image` is already fetching.
- **New product/hero photography is real, high-resolution photography** —
  see [Visual Principles](#2-visual-principles) — compressed sensibly
  before it enters `public/`. Next's built-in optimizer re-encodes on
  request, but it can't fix a source file that's unnecessarily large or
  poorly compressed to begin with.

---

## 12. Folder Architecture

```
src/
  app/
    layout.tsx          Root shell: fonts (next/font), <html>/<body>,
                         metadata + viewport, mounts SmoothScrollProvider →
                         HeroAssetsProvider → PremiumLoader → {children}
    page.tsx             Composes Navbar / main(CinematicHero) / Footer
    globals.css          All design tokens (:root + @theme inline), base
                         styles, .bg-grain utility
    icon.svg             Favicon / app icon

  components/
    ui/                  Generic, brand-agnostic primitives with a real
                         variant API (currently: button.tsx). Nothing here
                         should know about VEXA-specific copy or scenes.
    layout/              Page-frame chrome that appears on every page:
                         navbar.tsx, footer.tsx
    sections/            Page-specific scenes/content blocks:
                         cinematic-hero.tsx (wires the timeline to the DOM),
                         intro-scene.tsx, mattress-visual.tsx, hero.tsx
    loader/              Full-page takeover chrome: premium-loader.tsx
    providers/           React Context providers mounted at the root:
                         smooth-scroll-provider.tsx (Lenis),
                         hero-assets-provider.tsx (load-once asset signal)
    logo.tsx             VEXA wordmark (Logo) + mark (LogoMark) — lives at
                         the components/ root because it's used across
                         layout, loader, and section boundaries alike, not
                         owned by any one of those folders

  hooks/
    use-hero-timeline.ts  CinematicHero's scroll choreography, grouped by
                         scene — the single source of truth for the
                         cinematic sequence; future scenes extend this
                         object rather than adding parallel state elsewhere
    use-pointer-tilt.ts   Mouse-reactive tilt/light, independent of scroll —
                         reusable by any future floating product visual

  lib/
    utils.ts             cn() — the only className-merging helper; use it,
                         don't hand-roll conditional className strings
    motion.ts             Shared easing curves (EASE_REVEAL, EASE_CURTAIN) —
                         the only place a bezier array literal should exist
    hero-assets.ts        Canonical hero image path constants
```

### 12.1 Decision guide: where does new code go?

| You're building... | It goes in... |
| --- | --- |
| A new page-level scene/content block | `src/components/sections/<name>.tsx` |
| A brand-agnostic, reusable UI primitive (new button variant, input, card) | `src/components/ui/<name>.tsx` |
| Chrome that appears on every page (a new nav item group, a cookie banner) | `src/components/layout/` |
| A new Context provider mounted at the root | `src/components/providers/<domain>-provider.tsx` |
| A new scroll-driven timeline for a new scene | `src/hooks/use-<scene>-timeline.ts`, following `use-hero-timeline.ts`'s grouped-object shape |
| A reusable non-scroll animation behavior (drag, hover-parallax, etc.) | `src/hooks/use-<behavior>.ts` |
| A new shared easing/duration constant | Add to `src/lib/motion.ts` — don't create a second motion-constants file |
| A new set of asset path constants | Add to `src/lib/hero-assets.ts` if hero-related, or a new `src/lib/<scene>-assets.ts` following the same pattern for a genuinely separate scene's assets |
| A new App Router route (`/one`, `/signature`, etc.) | `src/app/<route>/page.tsx`, composing existing `sections/`/`layout/` pieces wherever the content overlaps — don't fork a parallel Navbar/Footer |

---

## 13. Coding Conventions

- **TypeScript strict mode is always on** (`tsconfig.json` — do not weaken
  it). No `any` without a specific, commented reason; prefer precise types
  from `framer-motion` (`MotionValue<T>`) over loosening a prop to `unknown`.
- **Named exports only**, with the Next.js special-file exception — see
  [Section 7](#7-component-naming-conventions).
- **`"use client"` goes at the very top of the file, and only on files that
  actually need it** (a hook using `useState`/`useEffect`/browser APIs, a
  component using Framer Motion's `motion.*`, event handlers, etc.). Before
  adding it reflexively, check whether the component could stay a Server
  Component — `footer.tsx`, `button.tsx`, and `page.tsx`/`layout.tsx` all
  correctly have no client directive today because they don't need one. A
  Server Component can render a Client Component as a child without itself
  needing the directive (this is how `footer.tsx` renders the now-client
  `Logo` without becoming client itself) — don't add `"use client"`
  upward through a tree further than the actual browser-API usage requires.
- **Styling is Tailwind v4, CSS-first, utility classes in JSX.** There is no
  `tailwind.config.js` — all tokens live in `globals.css`'s `@theme inline`
  block. Don't reintroduce a JS config file; extend the CSS-first tokens
  instead.
- **`cn()` (from `@/lib/utils`) is the only way to merge/conditionally apply
  classNames.** It wraps `clsx` + `tailwind-merge` so conflicting utility
  classes resolve correctly (e.g., a caller-supplied `text-lg` correctly
  overriding a default `text-base`). Never string-concatenate classNames by
  hand.
- **Variant APIs use `class-variance-authority` (CVA)**, following
  `button.tsx`'s pattern: a `cva()` call with `variants`/`defaultVariants`,
  a `VariantProps<typeof xVariants>` type intersection for the component's
  props. Don't invent a second variant-prop pattern (e.g., a switch
  statement over a string prop) when CVA already covers the case.
- **Comments explain WHY, never WHAT.** The codebase's existing comments
  (see `cinematic-hero.tsx`, `mattress-visual.tsx`) are a model: they exist
  to explain non-obvious rationale (why this exact scroll range, why this
  z-order, why this offset avoids a Framer/CSS bug) — never to restate what
  a well-named variable or self-evident line already says. If you can
  delete a comment without losing information, delete it.
- **No speculative abstraction.** Don't build a generic `<Scene>` wrapper
  component "in case we need it for the next three sections" before a
  second concrete section actually needs it. Extract a shared abstraction
  the second time a pattern repeats, not preemptively.
- **Every PR must pass, with zero warnings:** `npm run build`,
  `npx eslint .`, and `npx tsc --noEmit`. None of these are optional gates —
  a warning today is a broken build tomorrow once someone else's change
  lands on top of it.
- **Assets are renamed to match reality before merge**, not left mislabeled
  "for now" — see [Section 11](#11-image-optimization-rules).

---

## 14. Rules That Must Never Be Broken

These are the rules with the highest cost if violated. If a PR needs to
break one of these, that's not a code review comment — that's a
conversation with whoever owns this document, before the PR is written.

### 14.1 The product is frozen

Never change VEXA ONE's or VEXA SIGNATURE's shape, silhouette, proportions,
stitching, border, or any other product-design detail. This applies to the
actual product photography *and* to any future CSS/3D representation of the
product. Scenes, lighting, camera movement, and framing around the product
are entirely engineering's domain; the product itself is not.

### 14.2 No duplicate asset fetches

Never add a raw `new Image()`/`fetch()` preload of a path that a
`next/image` component also renders on the same page. Always gate on the
real `<Image>` element's own load event via the `HeroAssetsProvider`
pattern (or its equivalent for a new asset domain).

### 14.3 No inline easing/timing literals

Never write a bezier array (`[x, y, z, w]`) directly in a component. It goes
in `src/lib/motion.ts` as a named constant, or it doesn't ship.

### 14.4 No dead weight

Never merge an unused font, CSS keyframe, design token, npm dependency, or
exported-but-uncalled function. "We'll need it later" is not a merge
criterion — add it in the PR that actually uses it.

### 14.5 No default exports outside Next.js special files

`page.tsx` and `layout.tsx` (and other Next.js special files —
`loading.tsx`, `error.tsx`, `not-found.tsx`, etc., if/when added) default-export
because the framework requires it. Nothing else does.

### 14.6 No contrast below the floor

Never ship text dimmer than `anthracite-400` on a black background
(~4.8:1). See [5.2](#52-verified-contrast-baseline).

### 14.7 No new large-scale motion without a reduced-motion path

Every new scroll sequence, ambient loop, or entrance choreography must call
`useReducedMotion()` and provide a real reduced/skipped alternative before
it ships — not as a fast-follow.

### 14.8 Don't reach for a 3D engine by default

There is no Three.js/WebGL in this codebase, and introducing one is an
architecture decision, not a component-level choice — it must be discussed
and deliberately adopted (with a plan for fallback rendering, bundle-size
budget, and device-capability handling), never added ad hoc inside a single
new section because CSS transforms felt limiting for one specific effect.

### 14.9 No raw hex colors in components

Every color used in a component comes from a token
(`bg-black-900`, `text-copper-300`, `border-anthracite-800`, etc.) or a
`color-mix()` derived from one. A hardcoded `#c17a4e` or `bg-[#1a1a1a]` in a
component file is always wrong — either the token already exists, or it
needs to be added to `globals.css` first.

### 14.10 No merging with a red build

`npm run build`, `npx eslint .`, and `npx tsc --noEmit` must all be clean
before a PR merges. No exceptions for "just a warning."

---

## 15. Roadmap of Future Sections

This roadmap reflects both the navigation already wired into the UI (which
currently 404s — see below) and the structural/technical debt surfaced
during the Sprint 1 audit and refactor. Sequence within each phase is a
starting recommendation, not a hard dependency order.

### Phase 1 — Close the navigation gap (highest priority)

The navbar and footer already link to nine routes that don't exist yet:
`/one`, `/signature`, `/craftsmanship`, `/journal` (nav), and `/privacy`,
`/terms`, `/warranty`, `/careers`, `/accessories` (footer). Every one of
these is a live 404 for a real visitor today. Before any new visual work,
either build minimal-but-real versions of the highest-traffic ones
(`/one`, `/signature` first — they're the actual product pages) or remove
the links until they exist. This is the single highest-leverage fix
available.

### Phase 2 — Extend the Bed → Mattress narrative

The homepage's cinematic sequence ends with the mattress floating, settled.
The next structural beat — per the original Sprint 1 brief — is preparing
for further transitions from that resting state:

- **Mattress → Craftsmanship**: a scroll- or interaction-triggered reveal of
  material/construction detail (cross-section, stitching macro shots,
  material provenance) using the same one-continuous-shot philosophy.
- **Mattress → Signature**: a comparison/upsell moment distinguishing ONE
  from SIGNATURE without ever treating the product itself as a UI element to
  restyle.
- Each of these should be built as its own `use-<scene>-timeline.ts` hook
  following `use-hero-timeline.ts`'s grouped-object pattern, composed into
  its own `sections/` component — not bolted onto `cinematic-hero.tsx`,
  which should stay scoped to the homepage's specific sequence.

### Phase 3 — Product detail pages (`/one`, `/signature`)

Real product pages: specifications, material story, pricing/configuration
if applicable, and purchase or lead-generation flow. This is also the
natural point to introduce genuine Server Component data-fetching into the
codebase for the first time (product data, inventory/pricing) — the current
homepage has no server-fetched data at all.

### Phase 4 — Craftsmanship & Journal

Editorial content pages (brand story, materials, process; a journal/blog for
SEO and brand depth). These are the first pages that will need a real
heading hierarchy beyond a single `<h1>`, and the first good candidates for
introducing MDX or a headless CMS if content velocity demands it.

### Phase 5 — Commerce & legal

Cart/checkout or lead-capture flow (depending on the business model),
`/privacy`, `/terms`, `/warranty`, `/careers` — real content behind the
footer links, not indefinite placeholders.

### Phase 6 — Technical foundation (can run in parallel with Phases 1–5)

- **SEO fundamentals**: Open Graph image, `Product`/`Organization`
  structured data (JSON-LD) — especially valuable given the footer already
  claims a Milano/New York presence — `sitemap.xml`, `robots.txt`, and a
  branded `not-found.tsx`.
- **Testing & CI**: Playwright is already a devDependency with zero tests
  written against it. Add real coverage (at minimum: the cinematic scroll
  sequence reaches its settled end-state; the loader gates and releases
  correctly; nav/footer links resolve) and wire a CI workflow that runs
  build + lint + typecheck + tests on every PR.
- **Dependency health**: resolve the `next` (15.5.22) /
  `eslint-config-next` (16.3.0) version mismatch, and make a deliberate,
  tested decision about the pending high-severity `npm audit` advisories
  (inherited via `next`'s own `postcss`/`sharp` dependencies — the fix path
  is a Next major upgrade).
- **Reduced-motion remediation**: close the two known gaps flagged in
  [Section 8](#8-animation-guidelines) and [10](#10-accessibility-rules) —
  the cinematic scroll sequence and the mattress float loop — before adding
  a third large motion sequence on top of them.
- **Security headers**: add a `headers()` function in `next.config.ts`
  (CSP, `X-Frame-Options`, etc.) before this becomes a public production
  site handling real traffic.

---

*This document is maintained alongside the codebase it describes. If you
change a convention, update this file in the same PR — a design system
document that drifts from reality is worse than no document at all.*
