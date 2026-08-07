# VEXA Technical Backlog

**Status:** official project tracker.
**Companion document:** [`VEXA_BIBLE.md`](./VEXA_BIBLE.md) — every "why it matters"
below traces back to a rule, principle, or known-debt item in the Bible, or to
a finding from the Sprint 1 codebase audit. This backlog is the actionable
list; the Bible is the standard those actions are held to.

This document reflects the codebase as it exists today. Sprint 1 (Cinematic
Hero) shipped a solid, verified-clean homepage experience — the tasks below
are what's *left*, not a re-litigation of what's already built.

## How to read this backlog

- **Priority** (Critical / High / Medium / Low) reflects urgency **relative
  to reaching Milestone 7 — Production Release**. A task being "Low
  priority" does not mean its milestone is unimportant; it means the work
  is correctly sequenced *after* launch-blocking work, not that it doesn't
  matter. Packaging and Configurator are real future milestones with mostly
  Medium/Low-priority tasks today, simply because launch comes first.
- **Complexity** is a rough T-shirt estimate, not a committed sprint size:

  | Size | Rough scope |
  | --- | --- |
  | **S** | Less than a day. Single file, low risk, no design/content dependency. |
  | **M** | A few days. Touches multiple files or needs a small design/content decision. |
  | **L** | ~1–2 weeks. A new page, a new scene, or a real migration. |
  | **XL** | Multi-week, cross-cutting, or genuinely open-ended (e.g., a new architecture paradigm). |

- **Dependencies** name the other task IDs, decisions, or external inputs
  (content, legal review, business decisions) a task is blocked on.
- **Status** starts at `Todo` for every task in this document by definition
  — update it in place as work progresses; don't create a second tracker.
- Task IDs (`CRIT-1`, `HIGH-1`, `MED-1`, `LOW-1`, …) are stable identifiers —
  reference them in commits/PRs (`Closes MED-2`) rather than re-typing full
  titles.

---

## Critical

*Blocking issues before production. Nothing in this section ships to real
users until it's resolved.*

#### CRIT-1 — Resolve the nine dead navigation and footer links

- **Description:** The navbar links to `/one`, `/signature`, `/craftsmanship`,
  `/journal`; the footer links to `/privacy`, `/terms`, `/warranty`,
  `/careers`, `/accessories`. All nine currently 404. The immediate fix is
  either (a) remove/disable the links until real destinations exist, or
  (b) ship minimal, real placeholder pages (title, brief copy, "more
  coming soon") — anything but a hard 404 on a live nav item.
- **Why it matters:** This is the first thing any visitor who explores the
  nav will hit. A luxury brand site with broken navigation directly
  undercuts the premium positioning the entire Bible is built around, and
  it was the single highest-leverage fix identified in the Sprint 1 audit.
- **Complexity:** M
- **Dependencies:** None
- **Status:** Interim fix shipped (Sprint 1 — Navigation Integrity). All
  nine routes now resolve via a shared `PlaceholderPage` component instead
  of 404ing. The real destinations are tracked separately and remain open:
  `HIGH-6` (`/one`), `HIGH-7` (`/signature`), `HIGH-11` (`/privacy`,
  `/terms`), `MED-7` (`/craftsmanship`), `MED-8` (`/journal`), `MED-9`
  (`/warranty`, `/careers`, `/accessories`).

#### CRIT-2 — Upgrade Next.js to clear pending vulnerabilities and the tooling version mismatch

- **Description:** `npm audit` currently reports 3 high-severity advisories
  (PostCSS XSS/path-traversal, `sharp`/libvips CVEs), both inherited
  transitively through Next.js's own dependency tree. The fix path is a
  Next.js major-version upgrade, which also resolves the current
  `next@15.5.22` / `eslint-config-next@16.3.0` mismatch. Execute this as one
  deliberate, tested migration — not `npm audit fix --force` blindly — with
  a full regression pass of the cinematic scroll sequence, image
  optimization, and build pipeline.
- **Why it matters:** Shipping known high-severity CVEs to production is a
  real security posture issue. The version mismatch is a secondary risk:
  inconsistent lint enforcement as more engineers touch the codebase.
- **Complexity:** L
- **Dependencies:** Strongly benefits from CRIT-5 (CI/test baseline) landing
  first, so the upgrade has an automated regression net; without it, this
  task must include a full manual regression pass.
- **Status:** Todo

#### CRIT-3 — Add production security headers

- **Description:** `next.config.ts` currently has no `headers()`
  configuration at all — no Content-Security-Policy, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, or HSTS. Add a deliberate
  `headers()` function scoped to what a marketing/commerce-adjacent site
  actually needs.
- **Why it matters:** Baseline security hardening expected of any public
  production site handling real traffic; currently entirely absent.
- **Complexity:** M
- **Dependencies:** None
- **Status:** Todo

#### CRIT-4 — Replace the placeholder production domain in site metadata

- **Description:** `metadataBase` in `layout.tsx` is set to
  `https://vexa.sleep`, which reads as a placeholder. Every canonical URL
  and Open Graph URL derived from metadata is currently wrong for whatever
  the real production domain turns out to be.
- **Why it matters:** Wrong canonical/OG URLs actively harm SEO indexing and
  break social-sharing previews from the moment the site goes live — this
  must be correct *before* launch, not patched after.
- **Complexity:** S
- **Dependencies:** Confirmed production domain from stakeholders.
- **Status:** Todo

#### CRIT-5 — Stand up CI and a minimum smoke-test suite

- **Description:** Playwright is already an installed devDependency with
  zero tests written against it, and there is no CI workflow running
  build/lint/typecheck on any PR. Add a CI workflow (GitHub Actions or
  equivalent) gating on `npm run build`, `npx eslint .`, `npx tsc --noEmit`,
  plus a minimum smoke-test suite: the cinematic hero reaches its settled
  end-state, the loader gates and releases correctly, and all nav/footer
  links resolve (pairs with CRIT-1).
- **Why it matters:** Every other Critical task — the Next.js upgrade
  especially — is materially riskier without this safety net. Merging to a
  production branch with zero automated regression coverage is itself a
  blocking process gap, not just a nice-to-have.
- **Complexity:** L
- **Dependencies:** None — should land before CRIT-2 if at all possible.
- **Status:** Todo

---

## High Priority

*Tasks required before launch. The site "works" without these, but is not
launch-ready.*

#### HIGH-1 — Verify the `lucide-react` dependency version pin

- **Description:** `package.json` pins `lucide-react` to `^1.28.0`, a
  version that looked anomalous against the package's known public release
  history at audit time. Confirm this resolves to a real, intended release
  and not a typo or unexpected resolution before treating the current
  lockfile as trustworthy for launch.
- **Why it matters:** An unverified/anomalous dependency version is a
  supply-chain hygiene risk that should be closed out before any dependency
  lock is treated as final.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### HIGH-2 — Technical SEO baseline

- **Description:** Add `robots.txt`, `sitemap.xml` (via Next's `app/sitemap.ts`
  convention), and a branded `not-found.tsx` matching the VEXA visual
  language. None currently exist; Next currently serves its default,
  unstyled 404.
- **Why it matters:** Table-stakes for proper indexing and for presenting a
  consistent brand experience even when something goes wrong.
- **Complexity:** M
- **Dependencies:** Benefits from CRIT-1 landing first so the sitemap
  reflects real, live routes.
- **Status:** Todo

#### HIGH-3 — Structured data and social sharing metadata

- **Description:** Add an Open Graph image, Twitter card metadata, and
  JSON-LD structured data (`Product` for VEXA ONE/SIGNATURE once built,
  `Organization`/`LocalBusiness` reflecting the Milano/New York presence the
  footer already claims).
- **Why it matters:** Directly improves SEO rich-result eligibility and
  social-sharing click-through. Right now every shared link renders as
  plain text with no preview image.
- **Complexity:** M
- **Dependencies:** HIGH-6/HIGH-7 (product pages) for accurate `Product`
  schema; `Organization` schema can ship independently, sooner.
- **Status:** Todo

#### HIGH-4 — Reduced-motion remediation for the cinematic hero

- **Description:** Add `prefers-reduced-motion` handling to the
  scroll-scrubbed camera sequence and the mattress's infinite float/rotate
  loop. Currently only `PremiumLoader` honors it — an open violation of the
  project's own Bible Rule 14.7.
- **Why it matters:** The homepage's entire identity is a large, sustained
  motion sequence; users with vestibular disorders currently have no way to
  reduce it short of disabling JavaScript entirely.
- **Complexity:** M
- **Dependencies:** None
- **Status:** Todo

#### HIGH-5 — Fix the keyboard-focusable-before-visible hero CTA gap

- **Description:** The hero's CTAs are tab-reachable well before
  `textOpacity`/`textPointerEvents` make them visible or clickable — a
  keyboard user can `Tab` onto a link that's still fully transparent. Drive
  `tabIndex` (or an equivalent inert/visibility gate) from the same
  threshold that currently controls `pointer-events`.
- **Why it matters:** A concrete keyboard-accessibility defect identified in
  the Sprint 1 audit and codified as a must-fix in the Bible's Accessibility
  Rules.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### HIGH-6 — Build the real `/one` product page

- **Description:** Replace the 404 with a genuine VEXA ONE page:
  specifications, material summary, a pricing/purchase or lead-generation
  entry point, and imagery consistent with the Bible's Visual Principles
  (real photography, never a stand-in illustration).
- **Why it matters:** `/one` is the single most-clicked link in the primary
  nav and currently leads nowhere — the most consequential of the nine dead
  links to resolve *properly*, not just stub.
- **Complexity:** L
- **Dependencies:** CRIT-1 (interim fix) should land first; benefits from a
  settled product-data source, even if that's just structured local content
  rather than a full CMS at this stage.
- **Status:** Todo

#### HIGH-7 — Build the real `/signature` product page

- **Description:** Same scope as HIGH-6, for VEXA SIGNATURE, with a clear
  differentiation from VEXA ONE.
- **Why it matters:** Same rationale as HIGH-6 — the second most
  consequential dead nav link.
- **Complexity:** L
- **Dependencies:** Shares components/patterns with HIGH-6 — build a shared
  product-page template once, rather than duplicating one twice.
- **Status:** Todo

#### HIGH-8 — Add analytics and error-monitoring instrumentation

- **Description:** Integrate a privacy-respecting analytics tool and an
  error-tracking service (e.g., Vercel Analytics + Sentry, or equivalent) so
  real user behavior and runtime errors are visible post-launch.
- **Why it matters:** There is currently zero visibility into how the site
  performs or fails for real visitors. Operating a production site blind is
  not viable past initial launch.
- **Complexity:** M
- **Dependencies:** None
- **Status:** Todo

#### HIGH-9 — Establish environment/configuration conventions

- **Description:** Document and scaffold `.env` handling (`.env.example`,
  deployment-secret conventions) ahead of the first real integration that
  needs a key (analytics, CMS, email capture, payment provider).
- **Why it matters:** No such convention exists yet. Establishing it now,
  deliberately, avoids ad hoc and inconsistent secret-handling once the
  first integration lands under launch pressure.
- **Complexity:** S
- **Dependencies:** Should land before HIGH-8's actual keys are wired in.
- **Status:** Todo

#### HIGH-10 — Add skip-to-content link and confirm heading-hierarchy discipline

- **Description:** Add a skip-to-content link so keyboard users can bypass
  the nav and the ~1600px mandatory cinematic scroll sequence. Establish and
  document the heading-level convention (currently a single `<h1>`, no
  `<h2>`+ anywhere yet) before Craftsmanship/Journal content pages
  introduce deeper hierarchies.
- **Why it matters:** Closes a known accessibility gap now, and prevents
  heading-hierarchy drift once real editorial content starts shipping.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### HIGH-11 — Publish Privacy Policy and Terms of Service

- **Description:** Real, counsel-reviewed content behind `/privacy` and
  `/terms` — currently both 404. These are the two footer links with actual
  legal weight, especially once HIGH-8 (analytics) or any lead-capture form
  is collecting user data.
- **Why it matters:** Operating a public site that collects any user data
  without a published privacy policy is a compliance risk, not just a
  content gap — this should land no later than HIGH-8 goes live.
- **Complexity:** M
- **Dependencies:** Legal review/copy from stakeholders/counsel.
- **Status:** Todo

---

## Medium Priority

*Improvements. Valuable, not launch-blocking.*

#### MED-1 — Fix the `--radius` design-token registration

- **Description:** `--radius` is declared under `:root` in `globals.css` but
  never registered under `@theme inline`, so it produces no Tailwind
  utility; `Button` hardcodes `rounded-[6px]` instead. Either wire the token
  up properly and migrate `Button` to use it, or remove the dead token —
  pick one, and make the codebase and the Bible agree.
- **Why it matters:** A known inconsistency flagged in the Bible (Section
  5.3). Left unresolved, it will confuse the next developer who tries to
  reference `var(--radius)` and gets a silent no-op.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### MED-2 — Gate the mattress's ambient float loop on visibility

- **Description:** The mattress's infinite float/rotate animation currently
  runs from mount, including through the ~0–52% scroll range where it's
  fully transparent. Derive a gate from the same opacity motion value so the
  loop only runs once the mattress is actually visible.
- **Why it matters:** Flagged as known debt in the Bible (Section 8) — real,
  if modest, wasted compositor work on an invisible element for over half
  the scroll range.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### MED-3 — Consolidate the redundant scroll-lock mechanism in `PremiumLoader`

- **Description:** `PremiumLoader` currently locks scroll via both
  `lenis.stop()`/`start()` **and** a manual
  `document.documentElement.style.overflow` toggle — overlapping
  responsibility. Either explicitly justify keeping both (defense-in-depth,
  documented as such) or collapse to one mechanism.
- **Why it matters:** Minor architectural redundancy identified in the
  Sprint 1 audit; low risk, but worth a deliberate decision rather than
  accidental duplication.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### MED-4 — Expose a meaningful product description to assistive technology

- **Description:** The only rendering of the VEXA ONE product image on the
  homepage sits inside an `aria-hidden="true"` container, by design, since
  it's part of the decorative scroll animation. Screen-reader users
  currently get the headline/CTAs but no description of what the product
  looks like. Add a concise, non-decorative description reachable by
  assistive technology.
- **Why it matters:** Closes a real content gap for screen-reader users,
  beyond the minimum bar the Bible currently sets.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### MED-5 — Build the Mattress → Craftsmanship scroll scene

- **Description:** Following the Bible's Phase 2 roadmap and the
  `use-hero-timeline.ts` pattern, build a new scroll-driven scene continuing
  from the homepage's settled mattress into a craftsmanship/material-detail
  reveal (cross-section, stitching macro, provenance).
- **Why it matters:** The core narrative extension the original Sprint 1
  brief anticipated — "prepare the architecture for the next transition"
  implies further transitions beyond Bed → Mattress, not a dead end.
- **Complexity:** L
- **Dependencies:** Real photography/videography of the craftsmanship detail
  shots; a new `use-craftsmanship-timeline.ts` hook and `sections/`
  component, following the established architecture.
- **Status:** Todo

#### MED-6 — Build the Mattress → Signature comparison scene

- **Description:** A comparison/upsell moment distinguishing VEXA ONE from
  VEXA SIGNATURE, continuing the same one-continuous-shot philosophy,
  without treating the product itself as a restylable UI element.
- **Why it matters:** Supports cross-sell between the two product lines
  directly from the homepage's own narrative arc.
- **Complexity:** L
- **Dependencies:** HIGH-6/HIGH-7 (product pages) should exist first so this
  scene has somewhere real to lead into.
- **Status:** Todo

#### MED-7 — Build the Craftsmanship content page

- **Description:** Real editorial content behind the currently-dead
  `/craftsmanship` link: brand story, materials, process.
- **Why it matters:** Closes one of the nine dead links properly (beyond
  CRIT-1's interim fix) and adds genuine SEO/brand-depth content.
- **Complexity:** M
- **Dependencies:** Content/copy from brand stakeholders.
- **Status:** Todo

#### MED-8 — Build the Journal page and content-authoring convention

- **Description:** Real editorial/blog content behind `/journal`, plus a
  decision on MDX vs. a headless CMS if content velocity warrants it (per
  the Bible's Phase 4 roadmap).
- **Why it matters:** SEO value and brand depth; also the first page
  requiring an established heading-hierarchy and long-form-content
  convention.
- **Complexity:** L
- **Dependencies:** HIGH-10's heading-hierarchy convention; a
  content-source decision (MDX vs. CMS).
- **Status:** Todo

#### MED-9 — Build the `/warranty`, `/careers`, and `/accessories` pages

- **Description:** Real content behind the three remaining dead footer
  links that aren't legal-compliance-critical (those are HIGH-11).
- **Why it matters:** Expected baseline content for a commerce-adjacent
  brand site, and explicitly promised by the footer today.
- **Complexity:** M
- **Dependencies:** Content from stakeholders (product/HR/accessories
  catalog as applicable).
- **Status:** Todo

#### MED-10 — Add Playwright visual-regression coverage for the cinematic hero

- **Description:** Beyond CRIT-5's functional smoke tests, add screenshot-diff
  coverage of the hero's key scroll checkpoints (loader states, intro
  dolly, iris transition, mattress settle, finale) so future changes can be
  verified against a known-good baseline.
- **Why it matters:** The scroll-scrubbed animation is easy to silently
  break (a single breakpoint typo shifts the whole sequence). This gives the
  team the same confidence the manual pixel-diff process provided during
  the Sprint 1 refactor — automatically, on every PR.
- **Complexity:** M
- **Dependencies:** CRIT-5 (CI baseline) should exist first so this runs
  automatically.
- **Status:** Todo

#### MED-11 — Design the Packaging / Unboxing scene concept

- **Description:** Define the narrative and shot list for a Packaging
  milestone scene — how VEXA ships (roll-compression, box reveal, unboxing
  moment) — and source or commission the real photography/videography it
  requires, per the Bible's no-illustration rule.
- **Why it matters:** A design/content prerequisite that must be settled
  before any engineering work on Milestone 4 (Packaging) can begin.
- **Complexity:** M
- **Dependencies:** Brand/creative direction sign-off; the real product
  packaging must exist to photograph.
- **Status:** Todo

#### MED-12 — Design the Configurator's data model

- **Description:** Define the size options, firmness options, and pricing
  logic the future Configurator (Milestone 5) will present, as a
  content/data design task independent of the interactive UI build.
- **Why it matters:** The UI build (LOW-7) is meaningfully de-risked and
  simplified once this data model is settled first, rather than being
  designed inline with component code under time pressure.
- **Complexity:** M
- **Dependencies:** Business/pricing decisions from stakeholders; catalog
  scope (does SIGNATURE get configured too, or ONE only, at first?).
- **Status:** Todo

#### MED-13 — Full mobile-optimization pass across all shipped scenes

- **Description:** A dedicated audit and tuning pass — touch-scroll behavior
  on the pinned scroll-scrub pattern, responsive typography/spacing, mobile
  performance profiling, and re-verification of the mobile nav overlay —
  across every scene shipped by that point (Hero, Product, Materials,
  Packaging).
- **Why it matters:** The project was explicitly desktop-first by design for
  Sprint 1. This is the deliberate, planned mobile catch-up rather than an
  oversight — and given real-world mobile traffic share, it's a genuine
  pre-launch concern in practice even though it's correctly sequenced after
  desktop-first work.
- **Complexity:** L
- **Dependencies:** Should run after Milestones 1–4's desktop scenes are
  substantially settled, so it tunes real, stable layouts rather than a
  moving target.
- **Status:** Todo

---

## Low Priority

*Nice-to-have items.*

#### LOW-1 — Re-evaluate monospace font reintroduction

- **Description:** Geist Mono was deliberately removed as dead weight.
  Reintroduce it only if/when a concrete numeric-display use case exists (a
  spec table, a price ticker, a Configurator price readout) — in the same
  PR that uses it.
- **Why it matters:** Documents the standing criterion so a future developer
  doesn't need to rediscover why it was removed, and doesn't add it back
  speculatively.
- **Complexity:** S
- **Dependencies:** A genuine consuming feature (most likely LOW-7, the
  Configurator).
- **Status:** Todo

#### LOW-2 — Add a third motion easing curve only on genuine need

- **Description:** `EASE_REVEAL` and `EASE_CURTAIN` currently cover every
  animation in the codebase. Track this as a standing criterion, not a task
  to act on now: only add a third named constant to `lib/motion.ts` when an
  entrance/exit genuinely doesn't fit either existing curve.
- **Why it matters:** Prevents easing-curve sprawl as more scenes are built,
  per the Bible's Motion Principles.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### LOW-3 — PWA manifest and expanded favicon set

- **Description:** Add `manifest.json` and additional icon sizes
  (`apple-touch-icon`, etc.) beyond the current single `icon.svg`.
- **Why it matters:** A more complete "add to home screen" and
  cross-platform icon experience — polish, not launch-blocking.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

#### LOW-4 — Internationalization needs assessment

- **Description:** Given the brand's stated Milano/New York presence,
  deliberately assess whether i18n (Italian/English at minimum) is in
  scope, and record the decision even if the answer is "not yet."
- **Why it matters:** Avoids an undocumented assumption; cheap to decide now,
  expensive to retrofit later if the answer changes.
- **Complexity:** S
- **Dependencies:** Business decision on target markets.
- **Status:** Todo

#### LOW-5 — Scoped 3D/WebGL proof-of-concept for the Configurator

- **Description:** Only if MED-12's design determines a live
  rotating/interactive product preview is genuinely necessary and 2D,
  photography-based presentation proves insufficient, run a small,
  deliberately-scoped Three.js/WebGL proof of concept — per the Bible's Rule
  14.8, never adopted ad hoc.
- **Why it matters:** Keeps a potential major architecture shift
  (introducing a 3D engine for the first time) as a considered decision
  with a fallback plan, not a mid-sprint improvisation.
- **Complexity:** XL
- **Dependencies:** MED-12; a definitive "photography isn't enough" finding.
- **Status:** Todo

#### LOW-6 — Build the Packaging / Unboxing scene implementation

- **Description:** The engineering build-out of MED-11's design: a new
  scroll-driven scene following the established `use-<scene>-timeline.ts`
  architecture.
- **Why it matters:** Delivers Milestone 4, once its design prerequisite is
  settled.
- **Complexity:** L
- **Dependencies:** MED-11 (design/photography) must be complete first.
- **Status:** Todo

#### LOW-7 — Build the Configurator UI

- **Description:** The interactive size/firmness selector and live price
  calculator, built on top of MED-12's data model.
- **Why it matters:** Delivers Milestone 5 — the most speculative and
  furthest-out piece of scope in this backlog, appropriately sequenced last
  among concrete build tasks.
- **Complexity:** XL
- **Dependencies:** MED-12 (data model); possibly LOW-5 if a 3D preview is
  deemed necessary.
- **Status:** Todo

#### LOW-8 — Add explicit Node engines range and version pinning

- **Description:** `package.json` currently has no `engines` field and there
  is no `.nvmrc`. Add both to pin the supported Node version range for
  consistent local/CI/deployment behavior.
- **Why it matters:** Small hygiene improvement that prevents "works on my
  machine" version drift as the team grows.
- **Complexity:** S
- **Dependencies:** None
- **Status:** Todo

---

## Development Roadmap

Grouped by milestone. Each milestone lists its objective and the backlog
tasks (by ID) that belong to it — cross-reference the sections above for full
task detail. A task's priority bucket and its milestone are independent
axes: a task can be "Medium priority" (not launch-blocking on its own) while
still being required content for a specific milestone's release.

### Milestone 1 — Hero

**Objective:** Ship the flagship cinematic homepage experience to a state
where its own known debt is closed and it's safe to build on top of. The
core experience (loader, camera dolly, iris transition, mattress emergence,
staggered reveal) is already built and verified; this milestone is about
closing what's left.

- HIGH-4 — Reduced-motion remediation
- HIGH-5 — Keyboard-focusable-before-visible CTA fix
- MED-1 — `--radius` token fix
- MED-2 — Gate ambient float loop on visibility
- MED-3 — Consolidate scroll-lock mechanism
- MED-4 — Expose product description to assistive technology
- MED-10 — Visual-regression coverage for the hero

### Milestone 2 — Product

**Objective:** Give VEXA ONE and VEXA SIGNATURE real destination pages.

- CRIT-1 — Resolve dead links (immediate unblock)
- HIGH-6 — Build `/one`
- HIGH-7 — Build `/signature`
- HIGH-3 — Structured data (Product schema portion)

### Milestone 3 — Materials

**Objective:** Extend the homepage narrative into craftsmanship/material
storytelling, and establish the site's first long-form editorial content.

- MED-5 — Mattress → Craftsmanship scroll scene
- MED-7 — Craftsmanship content page
- MED-8 — Journal page + content-authoring convention
- HIGH-10 — Heading-hierarchy convention (prerequisite for Journal)

### Milestone 4 — Packaging

**Objective:** Present VEXA's shipping/unboxing experience as its own brand
moment, continuing the cinematic-scene architecture established in
Milestone 1.

- MED-11 — Design the Packaging/Unboxing scene concept
- LOW-6 — Build the Packaging/Unboxing scene implementation

### Milestone 5 — Configurator

**Objective:** Let customers configure size and firmness and see a live
price before purchase or lead capture.

- MED-12 — Design the Configurator's data model
- LOW-7 — Build the Configurator UI
- LOW-5 — Scoped 3D/WebGL proof-of-concept (conditional)
- LOW-1 — Monospace font reintroduction (conditional, if a price readout needs it)

### Milestone 6 — Mobile

**Objective:** Bring the full desktop-first experience up to a deliberate,
tuned mobile standard, once desktop scenes across Milestones 1–4 are
settled.

- MED-13 — Full mobile-optimization pass across all shipped scenes

### Milestone 7 — Production Release

**Objective:** Everything required to responsibly take VEXA live for real
traffic. This milestone pulls together every Critical task, every High
task, and the Medium-priority items that are genuine launch prerequisites
(legal, comparison content) rather than pure polish.

- CRIT-1 — Resolve dead links
- CRIT-2 — Next.js upgrade (vulnerabilities + tooling mismatch)
- CRIT-3 — Production security headers
- CRIT-4 — Correct production domain in metadata
- CRIT-5 — CI + smoke-test suite
- HIGH-1 — Verify `lucide-react` version pin
- HIGH-2 — Technical SEO baseline
- HIGH-3 — Structured data + social sharing metadata
- HIGH-8 — Analytics + error monitoring
- HIGH-9 — Environment/configuration conventions
- HIGH-11 — Privacy Policy + Terms of Service
- MED-6 — Mattress → Signature comparison scene
- MED-9 — Warranty/Careers/Accessories pages
- LOW-3 — PWA manifest + favicon set
- LOW-4 — Internationalization decision
- LOW-8 — Node engines pinning

**Sequencing note:** Milestone 7 is not strictly "last" chronologically —
several of its tasks (CI, security headers, SEO baseline) should land
*early and in parallel* with Milestones 2–4, so that Production Release is a
final verification and sign-off pass rather than a scramble. Treat the list
above as "must all be true before public launch," not "start these only
after Milestone 6."

---

*Update this document's task statuses as work lands. If a new task is
discovered mid-implementation, add it to the appropriate priority section
with the same five fields — don't let work happen outside this tracker.*
