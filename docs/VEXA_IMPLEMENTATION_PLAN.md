# VEXA Master Implementation Plan

**Status:** executable — this document turns `VEXA_BACKLOG.md` into sprints.
**Role change, effective this document:** documentation work is done. Every
task after this plan is implementation. This file itself is the last
planning artifact; it exists to make everything after it code, not more docs.

**Inputs reviewed to build this plan:** the Sprint 1 codebase audit,
`VEXA_BIBLE.md` (the standard), `VEXA_BACKLOG.md` (37 tasks, 7 milestones),
`VEXA_QUALITY_CHECKLIST.md` (the verification gate). Every sprint below maps
to specific Backlog task IDs and closes with the Checklist sections that
prove it's done.

## Sequencing principles

These five rules decided the order below. When new work gets slotted in
later, sequence it by the same logic:

1. **Foundation before features.** No feature work starts before CI and a
   regression net exist (Sprint 0) — every later sprint depends on being
   able to verify it didn't break something else.
2. **Isolate risk.** A risky, wide-blast-radius change (the Next.js major
   upgrade) gets its own sprint, touching nothing else, so a regression has
   one obvious cause.
3. **Close debt before building on top of it.** Hero's known accessibility
   and performance debt (Sprint 4) closes before any new scene reuses its
   patterns — copying a known gap into three more scenes is worse than
   fixing it once.
4. **Design before build, for anything creative-dependent.** Packaging and
   Configurator each split into a design/data sprint and a build sprint,
   because their real bottleneck is external (photography, pricing
   decisions), not engineering time.
5. **Desktop before mobile, mobile before release.** Matches the Bible's
   explicit desktop-first stance — Mobile (Sprint 13) runs once desktop
   scenes are stable, and Production Release (Sprint 14) runs last, as
   verification, not new work.

Every sprint below is scoped so that **at its freeze point, the project is
deployable** — no sprint leaves the `main`/release branch in a half-migrated
or partially-working state. If a sprint must stop early, freeze at the last
fully-validated deliverable inside it, not partway through one.

---

## Sprint 0 — Foundation & Safety Net

**Objective:** Give every later sprint something to verify itself against.
Nothing here is user-visible; all of it is regression protection and
hygiene.

**Deliverables**
- CI workflow running `npm run build`, `npx eslint .`, `npx tsc --noEmit` on
  every PR.
- A minimum smoke-test suite (Playwright): homepage loads, loader gates and
  releases, cinematic sequence reaches its settled end-state, all current
  nav/footer links are asserted (will start red — that's expected, see
  Sprint 1).
- Documented `.env.example` and secret-handling convention.
- `engines` field in `package.json` + `.nvmrc`.
- Confirmed, correct `lucide-react` version resolution.

**Backlog tasks:** `CRIT-5`, `HIGH-1`, `HIGH-9`, `LOW-8`

**Files involved**
- `.github/workflows/ci.yml` (new)
- `tests/` or `e2e/` (new directory — Playwright specs)
- `playwright.config.ts` (new)
- `.env.example` (new)
- `package.json` (add `engines`, verify `lucide-react`)
- `.nvmrc` (new)

**Components involved:** none — this sprint is tooling/process, not UI.

**Estimated implementation order**
1. Verify `lucide-react` resolves to a real, intended release; pin exactly.
2. Add `engines` + `.nvmrc`.
3. Write `.env.example` + a short `docs/` note on where secrets go (local
   vs. deployment).
4. Write the Playwright smoke suite against the current build.
5. Wire the CI workflow; confirm it's red on the known-broken link
   assertions and green on everything else.

**Risks**
- The link-assertion test will fail immediately (by design, since `CRIT-1`
  isn't fixed yet) — don't let this block merging the CI workflow itself;
  mark that one assertion as a known, tracked failure (`xfail`/skip with a
  comment linking to `CRIT-1`) until Sprint 1 lands, then un-skip it.
- CI flaking on the scroll-sequence smoke test if timing assumptions are too
  tight — prefer asserting on final DOM state/motion-value thresholds over
  fixed `waitForTimeout` windows.

**Validation checklist:** Quality Checklist → **Production** (Build passes,
Lint passes) in full; **Code Quality** → Type safety, Naming conventions for
the new test/config files themselves.

**Freeze point:** tag `checkpoint/sprint-0`. CI is green on every check
except the one documented, tracked link-assertion failure. No sprint after
this one merges without CI running on its PR.

---

## Sprint 1 — Navigation Integrity

**Objective:** Every link in the primary nav and footer resolves to a real
page. Minimal, on-brand content — not a hard 404, not a "coming soon" that
looks broken.

**Deliverables:** nine new routes, each a small, genuinely on-brand page
(wordmark, one line of copy, a way back to the homepage) — not full product
pages yet (those are Sprint 7/8/6).

**Backlog tasks:** `CRIT-1`

**Files involved**
- `src/app/one/page.tsx`, `src/app/signature/page.tsx`,
  `src/app/craftsmanship/page.tsx`, `src/app/journal/page.tsx`
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`,
  `src/app/warranty/page.tsx`, `src/app/careers/page.tsx`,
  `src/app/accessories/page.tsx`
- Possibly one shared `src/components/sections/placeholder-page.tsx` used by
  all nine, to avoid nine near-identical hand-written layouts.

**Components involved:** new `PlaceholderPage` (or similarly named)
section component; existing `Navbar`/`Footer` (unchanged, just now pointing
at real routes).

**Estimated implementation order**
1. Build the one shared placeholder-page component (title, kicker, one line
   of copy, a `Button` back to `/`) — reuse `Logo`, `Button` as-is.
2. Wire all nine routes through it with route-specific copy.
3. Un-skip Sprint 0's link-assertion test; confirm it's green.
4. Update `VEXA_BACKLOG.md`'s `CRIT-1` status to reflect the interim fix is
   live (the *real* builds — `HIGH-6/7`, `HIGH-11`, `MED-7/8/9` — stay open).

**Risks**
- Nine identical-feeling placeholder pages can read as lazy rather than
  "intentionally minimal" if the shared component isn't genuinely on-brand
  (correct type, correct spacing, real copy) — this is a small build, but
  don't let "it's just a placeholder" excuse skipping the Bible's visual
  rules.
- Don't let this sprint quietly turn into building the *real* `/one` page —
  scope is strictly the interim fix; the real page is Sprint 7.

**Validation checklist:** Quality Checklist → **Production** (No broken
links — now automated via Sprint 0's test), **Visual Quality** (Typography
consistency, Spacing), **Accessibility** (Keyboard navigation, Focus states)
on the new shared component.

**Freeze point:** tag `checkpoint/sprint-1`. All nine routes return 200 and
pass the automated link check. No route in this list is a 404 from this
point forward — any future sprint that "removes" one of these must replace
it with something equally real, never regress to a 404.

---

## Sprint 2 — Security & Metadata Hardening

**Objective:** Close the production-hardening gaps that are pure
configuration — no new UI, low risk, high value.

**Deliverables:** `headers()` config, correct production domain everywhere
metadata references it, `robots.txt`, `sitemap.xml`, a branded 404.

**Backlog tasks:** `CRIT-3`, `CRIT-4`, `HIGH-2`

**Files involved**
- `next.config.ts` (add `headers()`)
- `src/app/layout.tsx` (`metadataBase` correction)
- `src/app/robots.ts` (new, Next's convention)
- `src/app/sitemap.ts` (new, Next's convention — enumerates the now-real
  routes from Sprint 1)
- `src/app/not-found.tsx` (new)

**Components involved:** new `NotFound` page composition (reuses `Logo`,
`Button`, matches the Bible's visual language); no changes to existing
scene components.

**Estimated implementation order**
1. Confirm the real production domain with stakeholders (blocking — see
   Risks).
2. Fix `metadataBase` and any other hardcoded domain references.
3. Add `robots.ts` + `sitemap.ts`, generated from the real route list.
4. Add `next.config.ts` security headers; test locally that the CSP doesn't
   break Next's own dev/inline-script requirements (`next/font`, inline
   critical CSS).
5. Build `not-found.tsx`.

**Risks**
- **Blocking external dependency:** this sprint cannot fully close without
  a confirmed production domain. If it's not confirmed yet, do everything
  else in this sprint and leave `CRIT-4` as the one open item, clearly
  flagged — don't guess a domain and ship it.
- An overly strict CSP can silently break `next/font` or Framer Motion's
  runtime style injection — validate with a full manual click-through +
  console-error check (Checklist → Production → No console errors), not
  just "the build succeeded."

**Validation checklist:** Quality Checklist → **SEO** in full (Metadata,
Sitemap, Robots, Canonicals), **Production** (No console errors, Build
passes).

**Freeze point:** tag `checkpoint/sprint-2`. `robots.txt`/`sitemap.xml` are
live and correct; security headers are present and verified not to break
any existing page; `metadataBase` is either the real domain or explicitly
still-pending-and-tracked (never a silent placeholder from this point on).

---

## Sprint 3 — Dependency & Tooling Health

**Objective:** The Next.js major-version upgrade that clears the pending
high-severity advisories and the `eslint-config-next` mismatch — isolated,
because it's the highest-blast-radius change in the entire backlog.

**Deliverables:** Next.js (and its ecosystem — `eslint-config-next`, any
peer deps) upgraded to a version line where `npm audit` is clean and the
lint-config/framework versions match.

**Backlog tasks:** `CRIT-2`

**Files involved**
- `package.json`, `package-lock.json`
- Potentially `next.config.ts` if the new major version changes config
  shape
- No component files should need to change if the upgrade is clean — if any
  do, that's a signal worth flagging in the PR, not silently absorbing

**Components involved:** none directly targeted, but **every** component
using Framer Motion's `useScroll`/scroll-scrub pattern
(`cinematic-hero.tsx`, `use-hero-timeline.ts`) is the highest-risk surface
to regression-test after this upgrade, given the documented
ViewTimeline/ offset-preset sensitivity already called out in the Bible.

**Estimated implementation order**
1. Do this on a dedicated branch, not inline with any other sprint's work.
2. Upgrade in one commit; run `npm audit` to confirm the advisories are
   actually cleared (don't assume — verify).
3. Run the full Sprint 0 test suite + a full manual pass of the cinematic
   scroll sequence at multiple viewport widths.
4. Re-run the entire Quality Checklist's **Production** and **Performance**
   sections before merging — this is the one sprint where "the build
   passed" is not sufficient sign-off on its own.

**Risks**
- **This is the highest-risk sprint in the plan.** A Next.js major version
  can change image-optimization behavior, the App Router's metadata API
  shape, or SSR/hydration timing in ways that specifically threaten the
  scroll-scrub pattern's known CSS-ViewTimeline sensitivity.
- Mitigation: do not combine this with any other sprint's changes; if
  anything regresses, the fix is either a small compatibility patch or a
  documented rollback — never "push through it" into unrelated files.
- Keep the pre-upgrade commit tagged and easily revertible.

**Validation checklist:** Quality Checklist → **Production** in full,
**Performance** in full (this is exactly the kind of change that can
silently regress LCP/CLS/bundle size), plus a full manual replay of every
scroll checkpoint named in `use-hero-timeline.ts`.

**Freeze point:** tag `checkpoint/sprint-3`. `npm audit` reports zero
high-severity advisories; `next` and `eslint-config-next` major versions
match; the full cinematic sequence is manually re-verified frame-by-frame
against Sprint 4... actually against the last known-good baseline. No other
sprint's work should be based on pre-upgrade `main` after this lands.

---

## Sprint 4 — Hero Debt Closure

**Objective:** Close every piece of known debt in the homepage's cinematic
hero before any future scene copies its patterns forward. This is the sprint
that makes Milestone 1 (Hero) actually complete, not just shipped.

**Deliverables:** reduced-motion support for the scroll sequence and the
ambient float loop; the keyboard-focusable-before-visible CTA fix; a
skip-to-content link and documented heading-hierarchy convention; the
`--radius` token fix; the float-loop visibility gate; the consolidated
scroll-lock mechanism; a real assistive-technology description of the
product.

**Backlog tasks:** `HIGH-4`, `HIGH-5`, `HIGH-10`, `MED-1`, `MED-2`, `MED-3`,
`MED-4`

**Files involved**
- `src/hooks/use-hero-timeline.ts` (reduced-motion branching)
- `src/components/sections/mattress-visual.tsx` (float-loop gate,
  reduced-motion, AT description)
- `src/components/sections/hero.tsx` (CTA `tabIndex`/focusability fix)
- `src/components/loader/premium-loader.tsx` (scroll-lock consolidation)
- `src/components/ui/button.tsx`, `src/app/globals.css` (`--radius`
  registration or removal — pick one, per Bible §5.3)
- `src/app/layout.tsx` or `src/components/layout/navbar.tsx` (skip-to-content
  link)

**Components involved:** `CinematicHero`, `MattressVisual`, `Hero`,
`PremiumLoader`, `Button`, `Navbar`.

**Estimated implementation order**
1. `--radius` fix first (smallest, fully isolated, zero behavioral risk).
2. Float-loop visibility gate (isolated to `MattressVisual`).
3. Scroll-lock consolidation in `PremiumLoader` (isolated).
4. Reduced-motion branching for the scroll sequence + float loop (touches
   `use-hero-timeline.ts` and `MattressVisual` together — do this once the
   two isolated fixes above are stable).
5. CTA keyboard-focusability fix in `Hero`.
6. Skip-to-content link + heading-hierarchy documentation.
7. AT product description in `MattressVisual`/`Hero`.

**Risks**
- Reduced-motion branching for a scroll-scrubbed sequence is more involved
  than a simple time-based animation's reduced path — decide up front
  whether "reduced" means *no camera movement at all* (a static, already-final
  composition) or *a much simpler cross-fade* substituting for the
  dolly/iris/emergence sequence. This is a design decision as much as an
  engineering one — confirm the intended reduced experience before writing
  the branching logic, don't improvise it mid-implementation.
- The CTA focusability fix must be tested with an actual keyboard pass, not
  just code review — `pointer-events`/`tabIndex` interactions are exactly
  the kind of thing that looks correct in the diff and is wrong in the
  browser.

**Validation checklist:** Quality Checklist → **Accessibility** in full
(this sprint exists to make that section pass cleanly for the homepage for
the first time), **Visual Quality** → Animation smoothness, **Performance**
→ FPS during animations (confirm the float-loop gate didn't introduce a
visible pop-in).

**Freeze point:** tag `checkpoint/sprint-4`. The homepage passes the
Accessibility section of the Quality Checklist in full, with no "known
gap" caveats remaining for the hero specifically. This is the state any
future scene's `use-<scene>-timeline.ts` should be built to match from day
one — not a bar to catch up to later.

---

## Sprint 5 — Regression Coverage Expansion

**Objective:** Lock in Sprint 4's now-correct hero behavior as an automated
baseline, so it can never silently regress back to its pre-Sprint-4 state.

**Deliverables:** Playwright visual-regression coverage for the cinematic
hero's key scroll checkpoints, running in CI.

**Backlog tasks:** `MED-10`

**Files involved**
- `tests/hero-visual-regression.spec.ts` (new)
- `.github/workflows/ci.yml` (extend to run and store snapshots)

**Components involved:** none modified — this sprint tests
`CinematicHero`/`IntroScene`/`MattressVisual`/`Hero`/`PremiumLoader` as they
now stand post-Sprint-4.

**Estimated implementation order**
1. Identify the exact checkpoints to snapshot: loader visible, loader
   released, intro at rest, iris mid-close, mattress emergence, mattress
   settled/finale, reduced-motion variant of each.
2. Script deterministic scroll positioning for each (learn from this
   project's own manual pixel-diff process used during the Sprint 1
   refactor — real wall-clock scroll via wheel events, not instant
   `scrollTo`, to keep Lenis's state consistent).
3. Generate and commit baseline snapshots.
4. Wire CI to fail on divergence beyond a small, documented pixel-diff
   threshold (the ambient float loop's own idle-phase jitter means the
   threshold can't be zero — see the Sprint 1 refactor's own pixel-diff
   findings for the expected noise floor).

**Risks**
- The ambient float loop's time-based, wall-clock-driven nature makes exact
  pixel-matching non-deterministic between runs — the threshold must
  tolerate that specific, already-understood jitter without becoming so
  loose it misses a real regression. Mock/freeze the animation clock for
  these tests if Playwright/Framer Motion tooling allows it, rather than
  fighting a noisy threshold.

**Validation checklist:** Quality Checklist → **Code Quality** → Type
safety, Reusable components (the test helpers themselves should be
well-structured, not one-off scripts).

**Freeze point:** tag `checkpoint/sprint-5`. Visual-regression snapshots for
the hero are committed and enforced in CI. Any sprint touching
hero-related files from this point forward must update snapshots
deliberately, in the same PR, with a stated reason — never let CI
auto-approve a hero visual change.

---

## Sprint 6 — Operational Readiness

**Objective:** Everything needed to operate VEXA responsibly once real
traffic arrives: visibility into errors/usage, and the one piece of legal
content that's a compliance concern, not just a content gap.

**Deliverables:** analytics + error monitoring live; `/privacy` and
`/terms` replaced with real, reviewed content; `Organization`/`LocalBusiness`
JSON-LD live.

**Backlog tasks:** `HIGH-8`, `HIGH-11`, `HIGH-3` (Organization portion only
— Product portion is Sprint 7)

**Files involved**
- `src/app/layout.tsx` (analytics/monitoring provider mount, JSON-LD script)
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` (real content,
  replacing Sprint 1's placeholders)
- `.env.example` (new keys, per Sprint 0's convention)

**Components involved:** new analytics/monitoring provider wrapper (named
per whatever service is chosen — e.g. `AnalyticsProvider`), following the
existing provider pattern in `src/components/providers/`.

**Estimated implementation order**
1. Choose and integrate the analytics + error-monitoring services; wire
   keys through Sprint 0's `.env` convention.
2. Add the provider(s) at the root, following `HeroAssetsProvider`'s
   established pattern (mount once, at the top, minimal API surface).
3. Add `Organization` JSON-LD.
4. Replace `/privacy` and `/terms` placeholder content with real,
   stakeholder/counsel-reviewed copy.

**Risks**
- **Blocking external dependency:** `/privacy` and `/terms` need real legal
  copy — do not write placeholder legal text yourself and ship it as if
  reviewed. If copy isn't ready, ship the analytics/monitoring/JSON-LD
  portion and leave `HIGH-11` explicitly open rather than guessing at legal
  language.
- A new analytics script is exactly the kind of addition that can quietly
  regress CLS/bundle size/CSP — re-run **Performance** and re-verify
  Sprint 2's CSP still holds after adding the new script's domain.

**Validation checklist:** Quality Checklist → **SEO** → Structured data,
**Performance** → CLS, Bundle size (re-verify after adding the third-party
script), **Production** → No console errors.

**Freeze point:** tag `checkpoint/sprint-6`. Real user monitoring is live in
production; `Organization` structured data validates in Google's Rich
Results Test; `/privacy` and `/terms` carry real content or are explicitly,
visibly tracked as still-pending — never a silent placeholder past this
point.

---

## Sprint 7 — Product Pages

**Objective:** VEXA ONE and VEXA SIGNATURE get real, complete product
pages — the two most consequential links in the entire nav.

**Deliverables:** `/one`, `/signature` fully built (specs, material
summary, purchase/lead-generation entry point, real photography); shared
product-page template; `Product` JSON-LD; the Mattress → Signature
cross-sell scene as a stretch deliverable if the sprint has room.

**Backlog tasks:** `HIGH-6`, `HIGH-7`, `HIGH-3` (Product portion), `MED-6`

**Files involved**
- `src/app/one/page.tsx`, `src/app/signature/page.tsx` (replacing Sprint
  1's placeholders)
- `src/components/sections/product-overview.tsx`,
  `src/components/sections/product-specs.tsx` (new, shared between both
  pages)
- `src/hooks/use-signature-scene-timeline.ts` (new, for `MED-6`, if it lands
  in this sprint)
- `src/lib/products.ts` (new — the first genuine structured content/data
  source in the codebase, per the Bible's note that this is the natural
  point to introduce real data-fetching)

**Components involved:** new `ProductOverview`, `ProductSpecs` (shared
template pieces); new `SignatureCompareScene` if `MED-6` lands here; reuses
`Navbar`, `Footer`, `Button`, `Logo` as-is.

**Estimated implementation order**
1. Define `src/lib/products.ts`'s shape first (specs, pricing/lead-gen
   fields, imagery references) — this is the product-data equivalent of
   `hero-assets.ts`, and both pages should read from it rather than
   duplicating content inline.
2. Build the shared `ProductOverview`/`ProductSpecs` template against VEXA
   ONE's real content first.
3. Apply the same template to VEXA SIGNATURE, confirming the template
   actually generalizes rather than secretly assuming ONE's specifics.
4. Add `Product` JSON-LD, sourced from the same `products.ts` data.
5. If time remains in the sprint: build the Mattress → Signature scene
   (`MED-6`) as a homepage addition linking into the now-real `/signature`
   page. If not, defer it explicitly to its own follow-up sprint rather than
   rushing it.

**Risks**
- Building two pages independently, without a shared template, is exactly
  the kind of duplication the Bible warns against (Rule 14.4/§13) — insist
  on the template-first order above even under schedule pressure.
- `MED-6`'s scene depends on this sprint's pages existing — if it slips out
  of this sprint, that's fine (it's explicitly a stretch item here), but
  don't build it against placeholder pages that will change underneath it.

**Validation checklist:** Quality Checklist → **Visual Quality** in full
(these are the first genuinely new content pages since Sprint 1's launch),
**SEO** → Structured data, Metadata, **Accessibility** in full (new pages,
new heading hierarchy — apply Sprint 4's skip-link/heading conventions from
the start here, don't retrofit).

**Freeze point:** tag `checkpoint/sprint-7`. `/one` and `/signature` are
real, complete, and pass the full Quality Checklist as new pages — not
carried over as "good enough for now." `Product` JSON-LD validates.

---

## Sprint 8 — Materials & Craftsmanship Narrative

**Objective:** Extend the homepage's narrative into material storytelling,
and close out the remaining content-page placeholders.

**Deliverables:** Mattress → Craftsmanship scroll scene; real
`/craftsmanship` and `/journal` pages; real `/warranty`, `/careers`,
`/accessories` content, replacing their Sprint 1 placeholders.

**Backlog tasks:** `MED-5`, `MED-7`, `MED-8`, `MED-9`

**Files involved**
- `src/hooks/use-craftsmanship-timeline.ts` (new)
- `src/components/sections/craftsmanship-scene.tsx` (new)
- `src/app/craftsmanship/page.tsx`, `src/app/journal/page.tsx`,
  `src/app/warranty/page.tsx`, `src/app/careers/page.tsx`,
  `src/app/accessories/page.tsx` (replacing Sprint 1 placeholders)
- `src/lib/journal-content.ts` or an MDX content directory, depending on
  the content-authoring decision made here

**Components involved:** new `CraftsmanshipScene` (homepage addition,
following `use-hero-timeline.ts`'s grouped-object pattern exactly); new
content-page templates for Craftsmanship/Journal.

**Estimated implementation order**
1. Decide the Journal content-authoring approach (MDX vs. headless CMS)
   before writing any Journal-specific code — this determines the shape of
   `src/lib/journal-content.ts` and isn't worth revisiting mid-build.
2. Build the Craftsmanship scroll scene (homepage), reusing
   `use-hero-timeline.ts`'s structure as the template, not inventing a new
   shape.
3. Build the `/craftsmanship` content page.
4. Build the `/journal` page against the content-authoring decision from
   step 1.
5. Replace the three remaining placeholder pages
   (`/warranty`/`/careers`/`/accessories`) with real content.

**Risks**
- A second scroll-scrubbed scene is the first real test of whether
  `use-hero-timeline.ts`'s pattern actually generalizes — if it doesn't
  cleanly, that's a signal to revisit the pattern's design *once*, here,
  rather than letting two slightly-different scroll-scene shapes both ship.
- Journal content velocity is a business unknown — don't over-build a CMS
  integration if a handful of MDX files will do for the first several
  posts; this is exactly the kind of speculative-abstraction the Bible
  warns against (§13).

**Validation checklist:** Quality Checklist → **Visual Quality** →
Animation smoothness (new scroll scene), **Accessibility** → Screen readers
(first genuinely long-form content on the site — heading hierarchy matters
here more than anywhere else so far), **SEO** → Metadata (unique per new
route).

**Freeze point:** tag `checkpoint/sprint-8`. Every footer/nav link now
leads to real, finished content — zero placeholder pages remain anywhere on
the site. This closes out `CRIT-1`'s interim fix permanently.

---

## Sprint 9 — Packaging: Design

**Objective:** Settle the creative direction for the Packaging/Unboxing
scene before any engineering starts on it.

**Deliverables:** shot list and narrative beats for the scene; sourced or
commissioned photography/videography of the actual packaging.

**Backlog tasks:** `MED-11`

**Files involved:** none in `src/` — this sprint's output is creative
assets (destined for `public/`) and a short design brief, not code.

**Components involved:** none yet.

**Estimated implementation order**
1. Confirm real, physical VEXA packaging exists to photograph (a hard
   external prerequisite).
2. Define the narrative beats, matching the Bible's "start human, reveal
   the product" philosophy — how does a box become an unboxed mattress, in
   one continuous read.
3. Commission/source the photography; select and lightly process final
   assets, correctly named and encoded per the Bible's Image Optimization
   Rules (verify actual encoding matches the file extension — this is the
   exact mistake `hero-assets.ts`'s predecessor made once already).

**Risks**
- **This entire sprint is externally blocked** if the physical product
  isn't ready or a photographer/creative resource isn't available. Don't
  let engineering time sit idle waiting on it — this is the sprint most
  likely to need its calendar slot decoupled from the sprint number order
  above (i.e., it's fine to run Sprint 10 (Configurator design) or Sprint
  13 (Mobile) work in parallel if this one stalls on external dependencies).

**Validation checklist:** Quality Checklist → **Image Optimization** items
implicitly (correct file naming/encoding on delivery, before any code
consumes these assets) — full engineering validation happens in Sprint 10.

**Freeze point:** tag `checkpoint/sprint-9`. Final photography/videography
assets are approved, correctly encoded/named, and sitting in `public/`
ready to be wired up — no code changes yet.

---

## Sprint 10 — Packaging: Build

**Objective:** Build the Packaging/Unboxing scene using Sprint 9's assets.

**Deliverables:** a new scroll-driven scene, following the established
architecture, live on the homepage or as its own route (decide based on
Sprint 9's narrative — does it continue the homepage's single shot, or
stand alone as its own page reached from a "how it ships" link).

**Backlog tasks:** `LOW-6`

**Files involved**
- `src/hooks/use-packaging-timeline.ts` (new)
- `src/components/sections/packaging-scene.tsx` (new)
- `src/lib/packaging-assets.ts` (new — following `hero-assets.ts`'s
  canonical-path-registry pattern)
- Registration of the new assets with `HeroAssetsProvider`'s pattern (or a
  parallel provider, if this scene's load-gating needs are genuinely
  distinct)

**Components involved:** new `PackagingScene`; reuses `usePointerTilt` if
the scene includes a floating/interactive product visual similar to
`MattressVisual`'s.

**Estimated implementation order**
1. Register the new assets in `packaging-assets.ts`.
2. Build `use-packaging-timeline.ts` against Sprint 9's confirmed narrative
   beats.
3. Build the scene component; wire it in (homepage extension or standalone
   route, per Sprint 9's decision).
4. Add Playwright visual-regression coverage for this scene's checkpoints,
   extending Sprint 5's pattern immediately — don't let a second scene ship
   without the same regression coverage the first one has.

**Risks**
- Same ambient-loop/reduced-motion considerations as the original hero
  apply here from day one (per Sprint 4's now-established bar) — this
  scene must ship with `prefers-reduced-motion` support built in, not
  retrofitted in a future "debt closure" sprint the way Hero needed one.

**Validation checklist:** Quality Checklist → full **Visual Quality**,
**Accessibility**, and **Performance** sections — this scene should pass
everything on first ship, matching Sprint 4's bar rather than Sprint 1's
baseline.

**Freeze point:** tag `checkpoint/sprint-10`. Milestone 4 (Packaging) is
complete and passes the Quality Checklist in full, with zero "known debt"
caveats — unlike Hero, which needed a dedicated sprint to get there after
the fact.

---

## Sprint 11 — Configurator: Data Model

**Objective:** Settle what's being configured and how pricing works before
any interactive UI is built.

**Deliverables:** a defined set of size/firmness options and pricing logic;
a decision on whether SIGNATURE is configurable at launch or ONE only; a
decision on whether the price readout needs a monospace font (`LOW-1`).

**Backlog tasks:** `MED-12`, `LOW-1` (decision only)

**Files involved**
- `src/lib/configurator.ts` (new — options, pricing rules, following the
  established `lib/` pattern of being the single source of truth a UI reads
  from, never duplicates)
- `src/app/layout.tsx` (only if `LOW-1`'s decision is "yes, add the
  monospace font back" — otherwise no change here)

**Components involved:** none built yet — this sprint is data/decisions
only.

**Estimated implementation order**
1. Get the business/pricing decisions from stakeholders (external
   dependency, likely the sprint's critical path).
2. Model the options and pricing logic in `configurator.ts`.
3. Decide `LOW-1` (monospace font) based on whether the actual price-readout
   design calls for it — implement only if yes, in this sprint, not
   speculatively.

**Risks**
- **Blocking external dependency:** pricing/business logic decisions.
  Engineering cannot productively start Sprint 12 without this sprint's
  output being genuinely settled — resist the temptation to start building
  UI against a "probably final" data model.
- Scope creep risk: if pricing needs to reflect real-time
  inventory/discounts, this stops being a static `lib/` file and becomes a
  small backend/API concern — flag that distinction explicitly the moment
  it comes up, rather than discovering it mid-Sprint-12.

**Validation checklist:** Quality Checklist → **Code Quality** → Naming
conventions, Type safety, File organization (this is a pure data-layer
sprint — the bar is a clean, well-typed model, not a UI pass).

**Freeze point:** tag `checkpoint/sprint-11`. The Configurator's data model
is finalized and typed; Sprint 12 can build against it without
renegotiating scope mid-build.

---

## Sprint 12 — Configurator: Build

**Objective:** Build the interactive size/firmness selector and live price
calculator.

**Deliverables:** the Configurator UI, wherever Sprint 11's decisions place
it (likely embedded in the product pages from Sprint 7, or its own route).

**Backlog tasks:** `LOW-7`, `LOW-5` (conditional)

**Files involved**
- `src/components/sections/configurator.tsx` (new)
- `src/components/ui/` additions as needed (a segmented-control or
  radio-group primitive for size/firmness selection, following `Button`'s
  CVA-variant pattern)
- `src/hooks/use-configurator-state.ts` (new, if selection state logic
  warrants its own hook rather than local `useState` in the component)

**Components involved:** new `Configurator`; new selection-control UI
primitives in `components/ui/`; integrates with `src/lib/configurator.ts`
from Sprint 11.

**Estimated implementation order**
1. Build the new `ui/` selection-control primitive(s) first, generically,
   following `Button`'s established variant pattern — these are
   brand-agnostic primitives, not Configurator-specific markup.
2. Build the `Configurator` section using those primitives against Sprint
   11's data model.
3. Only if Sprint 11 (or this sprint's own design review) concluded a live
   visual preview is genuinely necessary and photography-based presentation
   is insufficient: scope and execute `LOW-5`'s 3D proof-of-concept as an
   explicitly separate, clearly-bounded piece of work — never quietly
   folded into "just build the Configurator."
3. Wire the Configurator into its host page; verify pricing updates
   correctly reflect every selection combination.

**Risks**
- Custom selection controls (segmented controls, swatches) are exactly
  where accessibility regressions hide — keyboard operability and focus
  states (Bible Rules, Quality Checklist → Accessibility) must be built in
  from the first commit of the new `ui/` primitive, not layered on after.
- If `LOW-5` gets pulled in, treat it as its own contained spike with a
  hard time-box and a clear fallback (ship the 2D/photography version if
  the 3D exploration doesn't land cleanly) — per Bible Rule 14.8, this is
  never a change to make casually mid-sprint.

**Validation checklist:** Quality Checklist → **Accessibility** in full on
the new selection controls specifically, **Code Quality** → Reusable
components (the new `ui/` primitives should be genuinely reusable, not
Configurator-only in practice), **Performance** → INP (interaction
responsiveness on selection/price updates).

**Freeze point:** tag `checkpoint/sprint-12`. Milestone 5 (Configurator) is
functionally complete and passes the Quality Checklist in full.

---

## Sprint 13 — Mobile Optimization Pass

**Objective:** Bring every scene shipped so far (Hero, Product, Materials,
Packaging, Configurator) up to a deliberately-tuned mobile standard.

**Deliverables:** touch-scroll tuning for every pinned scroll-scrub scene;
responsive typography/spacing audit; mobile performance profiling; a
re-verified mobile nav overlay against the now-larger site.

**Backlog tasks:** `MED-13`

**Files involved:** every `sections/` scene component and its paired
`hooks/use-*-timeline.ts` file, touched only as needed — this sprint should
mostly be Tailwind breakpoint/behavior tuning, not architectural rewrites.

**Components involved:** `CinematicHero`, `CraftsmanshipScene`,
`PackagingScene`, `Configurator`, `Navbar`'s mobile overlay, all
product/content pages from Sprints 7–8.

**Estimated implementation order**
1. Audit each scene at real device breakpoints (not just browser
   dev-tools resize) — start with the oldest, most-load-bearing scene
   (Hero) since any systemic pinned-scroll-scrub mobile issue will show up
   there first and inform the fix applied to every later scene.
2. Tune touch-scroll behavior (Lenis `touchMultiplier` and related options)
   once, centrally, rather than per-scene if the issue is systemic.
3. Responsive typography/spacing pass across all pages.
4. Mobile performance profiling (Lighthouse mobile preset, real-device
   testing if available) — pay particular attention to the Configurator's
   interactive controls and the Packaging/Craftsmanship scroll scenes,
   which are the newest and least mobile-tested code in the project.
5. Re-verify the mobile nav overlay now that it links to a fully-built
   site, not the Sprint-1-era placeholder set.

**Risks**
- **The real risk here is discovering a desktop-first architectural
  assumption that doesn't just need tuning — it needs rework** (e.g., a
  scroll-scrub distance tuned for desktop reading speed that feels
  interminable on mobile, or a fixed-pixel composition that doesn't
  reflow). If that surfaces, treat it as a scoped follow-up task against
  the specific scene, not something to force-fit within this sprint's
  original estimate.
- This sprint touches the widest surface area of any sprint in this plan —
  lean hard on Sprint 5's (and its Sprint 8/10/12 extensions')
  visual-regression coverage to catch desktop regressions introduced while
  tuning for mobile.

**Validation checklist:** Quality Checklist → **Visual Quality** → Mobile
quality (the section this sprint exists to satisfy), full re-run of
**Performance** on mobile presets, **Production** → Responsive validation.

**Freeze point:** tag `checkpoint/sprint-13`. Every shipped scene passes the
Quality Checklist's Mobile quality and Responsive validation items at
mobile, tablet, and desktop breakpoints. Milestone 6 is complete.

---

## Sprint 14 — Production Release Gate

**Objective:** Verification and polish only — no new features. This sprint
exists to confirm every earlier sprint's freeze point still holds together
as one coherent, launch-ready site, and to close the last few
launch-adjacent hygiene items.

**Deliverables:** PWA manifest + expanded favicon set; a recorded
internationalization decision; a full, formal Quality Checklist deploy
sign-off across the entire site; go/no-go for launch.

**Backlog tasks:** `LOW-3`, `LOW-4`, plus full re-verification of every
prior Critical/High item

**Files involved**
- `public/manifest.json` (new), additional icon files
- No other source changes expected — if this sprint needs to touch feature
  code, that's a signal a defect slipped through an earlier freeze point,
  not expected new work

**Components involved:** none new.

**Estimated implementation order**
1. Add the PWA manifest and expanded favicon set.
2. Record the internationalization decision (even if "not at launch") —
   don't let this stay an implicit, undocumented assumption.
3. Run the full Quality Checklist, **Deploy** tier, end to end, across
   every route the site now has — Lighthouse, structured-data validation,
   OG-preview debugging, screen-reader pass, the works.
4. Fill out the Checklist's sign-off block; file any newly-discovered issue
   as a new Backlog entry rather than fixing it ad hoc under launch
   pressure, unless it's a genuine launch-blocker.
5. Go/no-go.

**Risks**
- The main risk in this sprint is scope creep disguised as "just one more
  fix before launch" — if something substantial surfaces, it either
  genuinely blocks launch (fix it, as its own small dedicated pass, fully
  validated) or it doesn't (file it in the Backlog and ship without it).
  Don't let this sprint's "verification only" scope quietly expand.

**Validation checklist:** the entire `VEXA_QUALITY_CHECKLIST.md`, Deploy
tier, in full — this sprint's deliverable *is* a completed checklist run.

**Freeze point:** tag `v1.0.0`. This is the production release. Every
Critical and High backlog item is closed; every Medium/Low item still open
is knowingly, explicitly deferred with a Backlog ID, not forgotten.

---

## Traceability: sprint → milestone → backlog

| Sprint | Milestone | Backlog IDs closed |
| --- | --- | --- |
| 0 — Foundation & Safety Net | *(cross-cutting)* | `CRIT-5`, `HIGH-1`, `HIGH-9`, `LOW-8` |
| 1 — Navigation Integrity | *(cross-cutting)* | `CRIT-1` |
| 2 — Security & Metadata Hardening | 7 — Production Release (prep) | `CRIT-3`, `CRIT-4`, `HIGH-2` |
| 3 — Dependency & Tooling Health | 7 — Production Release (prep) | `CRIT-2` |
| 4 — Hero Debt Closure | 1 — Hero | `HIGH-4`, `HIGH-5`, `HIGH-10`, `MED-1`, `MED-2`, `MED-3`, `MED-4` |
| 5 — Regression Coverage Expansion | 1 — Hero (hardening) | `MED-10` |
| 6 — Operational Readiness | 7 — Production Release (prep) | `HIGH-8`, `HIGH-11`, `HIGH-3` (partial) |
| 7 — Product Pages | 2 — Product | `HIGH-6`, `HIGH-7`, `HIGH-3` (remainder), `MED-6` |
| 8 — Materials & Craftsmanship | 3 — Materials | `MED-5`, `MED-7`, `MED-8`, `MED-9` |
| 9 — Packaging: Design | 4 — Packaging | `MED-11` |
| 10 — Packaging: Build | 4 — Packaging | `LOW-6` |
| 11 — Configurator: Data Model | 5 — Configurator | `MED-12`, `LOW-1` (decision) |
| 12 — Configurator: Build | 5 — Configurator | `LOW-7`, `LOW-5` (conditional) |
| 13 — Mobile Optimization Pass | 6 — Mobile | `MED-13` |
| 14 — Production Release Gate | 7 — Production Release | `LOW-3`, `LOW-4`, full verification |

`LOW-2` (a third motion easing curve) has no assigned sprint by design —
per the Backlog, it's a standing criterion to apply opportunistically the
moment a real need arises in any sprint above, not a scheduled task.

---

*This plan is executable, not aspirational — every sprint above should be
startable by picking up its "Estimated implementation order" and going.
Sprint boundaries may shift in practice (Sprint 9's external blockers are
flagged for exactly this reason), but the dependency logic between sprints
should hold regardless of calendar slippage. No further planning documents
should be needed to execute this backlog — the next artifact this project
produces should be code.*
