# VEXA Quality Checklist

**Status:** permanent, reusable gate — run before every commit and before
every production deployment.
**Companion documents:** [`VEXA_BIBLE.md`](./VEXA_BIBLE.md) (the standard —
read this for *why*) and [`VEXA_BACKLOG.md`](./VEXA_BACKLOG.md) (known,
tracked exceptions to some items below — read this before flagging a debt
item as a "new" failure). This checklist is the *verification* layer: it
doesn't set the standard, it confirms the standard was met.

## How to use this document

This file is a template, not a log — **copy the relevant checklist into your
PR description or a scratch file for the sprint, check boxes there, and
leave this file's boxes unchecked** for the next person. Never commit this
file back with boxes ticked.

Two gates, two depths. Not every item runs every time — trying to run a full
Lighthouse + cross-browser pass on every single commit is how a checklist
gets abandoned within a sprint.

| Tag | Run it... | Cost |
| --- | --- | --- |
| 🔹 **Commit** | Before every commit, every PR | Seconds to a few minutes — automatable, no excuse to skip |
| 🔸 **Deploy** | Before every production deployment / release cut | Minutes to an hour — manual/tooling-assisted, budget real time for it |

Items are tagged inline. An item with both tags is cheap enough for every
commit but *especially* non-negotiable before a deploy.

A known, already-tracked exception (e.g., "the cinematic hero doesn't yet
honor `prefers-reduced-motion`," tracked as `HIGH-4` in the Backlog) is not a
reason to skip that checklist line — check the Backlog, confirm the item is
tracked, and don't let a second, undocumented instance of the same gap slip
in elsewhere.

---

## Visual Quality

- [ ] 🔸 **Pixel-perfect alignment** — compare the built page against the
      design reference at each tested breakpoint (1600 / 1280 / 768 / 390px);
      use the browser's layout ruler/inspector, not eyeballing. For
      scroll-scrubbed scenes, step through each named timeline checkpoint
      (see `use-hero-timeline.ts`'s scene groups) and verify each one matches
      its intended frame, not just the start/end states.
- [ ] 🔹 **Consistent spacing** — new spacing uses Tailwind's default scale;
      no invented arbitrary `px-[Npx]` value without a documented reason. New
      full-width sections use the container pattern
      (`mx-auto max-w-[1600px] px-8 sm:px-12 lg:px-20`, Bible §6.1) verbatim.
- [ ] 🔹 **Typography consistency** — only `--font-sans` (Geist) and
      `--font-display` (Fraunces) are in use; Fraunces is limited to a single
      accent word/phrase per headline (Bible §4); uppercase labels carry
      generous tracking; large display text uses `clamp()` rather than
      breakpoint-by-breakpoint size jumps.
- [ ] 🔸 **Animation smoothness** — record the full scroll sequence in Chrome
      DevTools → Performance; confirm no dropped frames / long tasks. Ambient
      loops touch only `transform`-backed properties (translate/rotate/scale),
      never layout-affecting ones (Bible §8).
- [ ] 🔹 **Color consistency** — `grep` any new component for literal `#` hex
      or `rgba(` values outside `globals.css`; every color traces to a design
      token or a `color-mix()` derived from one (Bible §5.4, Rule 14.9).
- [ ] 🔸 **Mobile quality** — test at real breakpoints (≈390×844, ≈768×1024
      minimum); mobile nav overlay opens/closes/scrolls correctly; no text
      overflow, no horizontal scroll; pinned scroll-scrub sections respond to
      touch scroll (Lenis `touchMultiplier`) without stutter. Desktop-first
      does not mean mobile-broken (Bible §1; Backlog `MED-13`).

---

## Performance

- [ ] 🔸 **Lighthouse** — run against a production build (`npm run build &&
      npm run start`, then Lighthouse in Chrome DevTools or `npx lighthouse
      http://localhost:3000 --view`). Target: Performance ≥ 90, Accessibility
      ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Record the four scores in the
      PR/release notes — a silent regression is a regression nobody caught.
- [ ] 🔸 **LCP** (< 2.5s) — confirm exactly one image carries `priority`: the
      true above-the-fold element, never two competing images (Bible §9).
      Check the network waterfall for what's actually blocking first paint.
- [ ] 🔸 **CLS** (< 0.1) — every image has explicit dimensions or a sized
      `fill` parent; fonts load with `display: swap`; nothing injects late
      and shifts layout (the loader is a `fixed` overlay and must stay one —
      verify it never contributes layout shift).
- [ ] 🔸 **INP** (< 200ms) — interactive elements (nav toggle, buttons,
      future Configurator controls) respond immediately; no heavy synchronous
      work runs on scroll/pointer event handlers.
- [ ] 🔹 **Bundle size** — run `npm run build` and check the `/` route's First
      Load JS against the last recorded baseline (~19.7 kB route-specific /
      ~172 kB total as of the last refactor). A meaningful increase must be
      explained in the PR, not silently absorbed (Bible §9).
- [ ] 🔸 **FPS during animations** — Chrome DevTools → Rendering → "Frame
      Rendering Stats" while scrolling through the full cinematic sequence and
      while the ambient float loop runs idle; target a steady 60fps, no
      visible jank.

---

## Accessibility

- [ ] 🔹 **Keyboard navigation** — `Tab` through the entire page in order; no
      interactive element is focusable while still invisible/unclickable
      (known gap tracked as Backlog `HIGH-5` — confirm no *new* instance of
      the same pattern shipped elsewhere); skip-to-content link present and
      working once landed (`HIGH-10`).
- [ ] 🔹 **Focus states** — every interactive element shows a visible,
      on-brand focus ring (`focus-visible:ring-1 ring-copper-300
      ring-offset-2 ring-offset-black`, per `Button`); never `outline-none`
      without an equivalent visible replacement.
- [ ] 🔸 **`prefers-reduced-motion`** — test with Chrome DevTools → Rendering
      → "Emulate CSS media feature prefers-reduced-motion: reduce." Every
      *new* animated component must degrade gracefully (Bible Rule 14.7).
      Known existing gaps (cinematic scroll sequence, ambient float loop —
      Backlog `HIGH-4`) are tracked, not a precedent to extend.
- [ ] 🔹 **Contrast** — no new text color dimmer than `anthracite-400` on
      black (~4.8:1 — the documented floor, Bible §5.2). Check with the
      browser DevTools color picker's built-in contrast readout on anything
      new.
- [ ] 🔸 **Screen readers** — run at least one full pass with VoiceOver
      (macOS) or NVDA (Windows) on any significant UI change. Verify: exactly
      one `<h1>`, logical heading order, semantic landmarks
      (`header`/`main`/`footer`) present, `aria-hidden` scoped only to truly
      decorative wrappers, meaningful `alt` text on content-bearing images.

---

## SEO

- [ ] 🔹 **Metadata** — every route has a unique, real title and description;
      `metadataBase` points at the actual production domain, never a
      placeholder (Backlog `CRIT-4`).
- [ ] 🔸 **Structured data** — JSON-LD present where applicable
      (`Organization` now, `Product` once product pages exist — Backlog
      `HIGH-3`); validate with Google's Rich Results Test before each deploy.
- [ ] 🔸 **Sitemap** — `sitemap.xml` lists only real, live routes; no 404s,
      no routes missing (Backlog `HIGH-2`, gated on `CRIT-1`).
- [ ] 🔸 **Robots** — `robots.txt` present, intentionally allows/disallows
      what it should, and references the sitemap.
- [ ] 🔹 **Canonicals** — canonical URL is correct for every route; no
      duplicate-content ambiguity from trailing slashes, query params, or
      `www`/non-`www` mismatches.
- [ ] 🔸 **Open Graph** — OG image, title, and description render correctly;
      verify with Facebook's Sharing Debugger, Twitter Card Validator, and
      LinkedIn Post Inspector before each deploy — don't assume it's correct
      because the meta tags look right in the HTML source.

---

## Code Quality

- [ ] 🔹 **No dead code** — no unused export, design token, CSS keyframe, or
      npm dependency ships (Bible Rule 14.4 — the exact discipline that
      removed Geist Mono and two unused keyframes). `grep` for the new
      symbol's usage before merging, not just its definition.
- [ ] 🔹 **No duplicated code** — no hand-copied markup that an existing
      component/hook already provides (the `LogoMark` lesson); no repeated
      literal bezier array outside `lib/motion.ts` (Rule 14.3); no repeated
      raw asset-path string outside `lib/hero-assets.ts` or a properly
      named sibling.
- [ ] 🔹 **Naming conventions** — kebab-case filenames, PascalCase
      components, camelCase `use`-prefixed hooks, `<Component>Props` type
      names, named exports everywhere except Next.js special files (Bible
      §7, Rule 14.5).
- [ ] 🔹 **Type safety** — `npx tsc --noEmit` is clean; no `any` without a
      specific, commented reason; `MotionValue<T>` types are precise, not
      loosened to `unknown`.
- [ ] 🔹 **Reusable components** — no copy-pasted JSX block that should be a
      shared component or hook; a new scroll scene follows the
      `use-<scene>-timeline.ts` grouped-object pattern rather than inlining
      loose `useTransform` calls.
- [ ] 🔹 **File organization** — every new file lands in the folder the
      Bible's decision table (§12.1) says it should; nothing orphaned outside
      the established `components/ui|layout|sections|loader|providers`,
      `hooks/`, `lib/` structure.

---

## Production

- [ ] 🔹 **Build passes** — `npm run build` exits clean, zero errors.
- [ ] 🔹 **Lint passes** — `npx eslint .` reports zero warnings and zero
      errors. A warning today is a broken build the moment someone else's
      change lands on top of it (Bible Rule 14.10).
- [ ] 🔹 **No console errors** — open DevTools console through a full page
      load, a full scroll through every scene, and every interactive control;
      zero errors or warnings logged.
- [ ] 🔹 **No hydration errors** — specifically watch for React
      hydration-mismatch warnings; check any component touching
      `Date.now()`/`Math.random()`/other non-deterministic or browser-only
      values at render time — these must be deferred to an effect or a lazy
      `useState` initializer, never called bare during render.
- [ ] 🔸 **No broken links** — every nav and footer link resolves with a real
      200, not a 404 (cross-reference Backlog `CRIT-1`'s status before
      assuming this is clean). Prefer an automated crawl (Playwright) over a
      manual click-through once `CRIT-5`'s CI/test baseline exists.
- [ ] 🔸 **Responsive validation** — manually verify at mobile (~390px),
      tablet (~768px), laptop (~1280px), and desktop (~1600px+): no
      horizontal scroll, no overlapping or clipped content, images stay
      undistorted, the mobile nav overlay works end-to-end.

---

## Sign-off block

Copy this into the PR description or release notes for every production
deployment (commit-level checks don't need a formal sign-off, just a clean
run):

```
VEXA Quality Checklist — Deploy Sign-off
Date:
Commit / tag:
Run by:

Lighthouse (Perf / A11y / Best Practices / SEO): __ / __ / __ / __
Bundle size (/ route First Load JS):
Known tracked exceptions relied upon (Backlog IDs):
New issues found and fixed before this sign-off:
New issues found and deferred (added to Backlog as ID: ___):

[ ] All sections above run and passing, or exceptions are tracked in
    VEXA_BACKLOG.md — not silently skipped.
```

---

*This checklist is reusable across every future sprint by design — it
should almost never need structural edits, only its cross-references to the
Bible/Backlog kept current. If a checklist line stops making sense (a tool
changes, a threshold needs revising), update it here deliberately, in its
own commit, with a reason — don't let it silently drift out of sync with how
the team actually ships.*
