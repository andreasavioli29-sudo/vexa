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
| `--font-mono` | Geist Mono — reserved for numerals/labels |

Utilities: `.bg-grain` (subtle film-grain overlay for dark hero/section
backgrounds), `animate-fade-up` / `animate-marquee` keyframes.

## Structure

```
src/
  app/
    layout.tsx        Fonts, metadata, Lenis provider
    page.tsx           Assembles Navbar / Hero / Footer
    globals.css        Design tokens (Tailwind v4 @theme)
    icon.svg            Favicon / app icon
  components/
    ui/                 shadcn-style primitives (button.tsx …)
    layout/             navbar.tsx, footer.tsx
    sections/           hero.tsx (and future page sections)
    providers/          smooth-scroll-provider.tsx (Lenis)
    logo.tsx            VEXA wordmark + mark
  lib/
    utils.ts            cn() class merge helper
```

## Sprint 1 scope

- Clean, scalable project structure
- Full design system (colors, type, motion primitives)
- Minimal navbar (transparent → glass on scroll, mobile overlay menu)
- Minimal footer
- Fullscreen hero: logo, "The Art of Sleeping" kicker, headline, dual CTAs,
  ambient copper glow + grain, animated scroll cue

Navigation links to `/one`, `/signature`, `/craftsmanship` etc. are wired for
future sprints and will 404 until those pages are built.
