# VEXA — The Art of Sleeping

A premium, editorial marketing site for VEXA, a sleep-systems brand. Built to
sit alongside Apple, Bang & Olufsen, Rimowa and Nothing in tone: minimal
layout, generous negative space, restrained motion, precision typography.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** (CSS-first `@theme` design tokens, no config file)
- **Framer Motion** for choreographed reveals and micro-interactions
- **Lenis** for inertial smooth scrolling (`lenis/react`, mounted at the root layout)
- **shadcn/ui** conventions (`components.json`, CVA-based primitives in `src/components/ui`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

All design tokens live in `src/app/globals.css` under `:root` / `@theme inline`:

| Token | Purpose |
| --- | --- |
| `--color-black-950…700` | Deep black backgrounds |
| `--color-anthracite-900…100` | Anthracite grey scale (text, borders, surfaces) |
| `--color-copper-600…100` | Satin copper accent (used sparingly: kickers, hover underlines, one accent word) |
| `--font-sans` | Geist Sans — UI, body, nav |
| `--font-display` | Fraunces — editorial display accents (e.g. the italic close of the hero headline) |

Utilities: `.bg-grain` (subtle film-grain overlay for dark hero/section
backgrounds). Shared easing curves (`EASE_REVEAL`, `EASE_CURTAIN`) live in
`src/lib/motion.ts` rather than as inline bezier arrays.

## Structure

```
src/
  app/
    layout.tsx        Fonts, metadata, Lenis + hero-assets providers
    page.tsx           Assembles Navbar / Hero / Footer
    globals.css        Design tokens (Tailwind v4 @theme)
    icon.svg            Favicon / app icon
  components/
    ui/                 shadcn-style primitives (button.tsx …)
    layout/             navbar.tsx, footer.tsx
    sections/           cinematic-hero.tsx (wires the timeline to the DOM),
                        intro-scene.tsx, mattress-visual.tsx, hero.tsx
    loader/             premium-loader.tsx (asset-aware entrance mark,
                        reuses LogoMark for its draw-in reveal)
    providers/          smooth-scroll-provider.tsx (Lenis),
                        hero-assets-provider.tsx (load-once signal so the
                        loader and the actual <Image>s never double-fetch)
    logo.tsx            VEXA wordmark + mark (LogoMark takes optional
                        ring/dot motion props for reveal animations)
  hooks/
    use-hero-timeline.ts  CinematicHero's scroll choreography, grouped by
                        scene (intro/transition/mattress/hero) — the single
                        source of truth for future scenes to extend
    use-pointer-tilt.ts   Mouse-reactive tilt/light, independent of scroll
  lib/
    utils.ts            cn() class merge helper
    motion.ts            Shared easing curves (EASE_REVEAL, EASE_CURTAIN)
    hero-assets.ts        Canonical hero image paths
```

## Sprint 1 scope

- Clean, scalable project structure
- Full design system (colors, type, motion primitives)
- Premium loader: holds until hero imagery is decoded, an animated mark
  reveal, respects `prefers-reduced-motion`, locks scroll (Lenis + document)
  until ready
- Minimal navbar (transparent → glass on scroll, mobile overlay menu)
- Minimal footer
- Cinematic hero: one continuous scroll-driven shot — a villa bedroom dollies
  in, irises to black around the bed, and the VEXA ONE mattress emerges from
  that exact position, lifts, and settles centered — followed by a staggered
  logo reveal, "The Art of Sleeping" kicker, headline, dual CTAs, and an
  animated scroll cue

Navigation links to `/one`, `/signature`, `/craftsmanship` etc. are wired for
future sprints and will 404 until those pages are built.
