# Design: Monochrome SRE Design System Migration

**Date:** 2026-06-12
**Owner:** Elvis Rafael Gross
**Status:** Draft — awaiting approval

## Summary

Migrate the entire portfolio (https://rafagross.github.io, Astro + Tailwind v4 static
site on GitHub Pages) to the **Monochrome SRE Design System** shipped in
`Monochrome SRE Design System.zip`. This is a full visual rebuild ("big-bang"), not an
incremental restyle. The existing multi-page architecture and all real content are
preserved; only the design layer is replaced.

## Decisions (locked with user)

| Topic | Decision |
|---|---|
| Scope | Adopt the full design system across every page |
| Strategy | **Big-bang** — no compatibility bridge; old visual layer is fully replaced in one development branch |
| Tech | **Add React** to Astro (`@astrojs/react` + `react` + `react-dom`); interactive DS pieces become Astro islands |
| Architecture | **Multi-page, re-styled** — keep all routes and MDX content; nav links go to real routes (`/projects`, `/runbooks`, …), NOT one-page anchors |
| Color | **Monochrome strict** — accent = near-black (light) / white (dark). Hero cloud icon recolored from cyan/blue to the grayscale ramp. Only permitted hue is `--green` for the "Available" dot |
| Theme | **Respect existing mechanism** — keep `.dark` class + `localStorage['theme']`; ALSO set `[data-theme]` on `<html>` so DS tokens and Hero JS work |
| i18n | **Bilingual UI chrome (EN/ES)** with a persistent toggle — Nav, Hero, section headers, buttons, Footer. Long-form MDX content stays in its authored language until the user provides translations |

## Out of scope (separate tasks)

These were mentioned by the user as upcoming, separate work — NOT part of this migration:

- Updated **resume** content (text + downloadable PDF placement)
- **Cover letter** (page or PDF)
- **Architecture diagrams** (source + placement per project)
- Repo access / remote changes
- Spanish translations of long-form MDX articles

## Architecture

### Token layer (foundation)

Replace the contents of `src/styles/global.css` token blocks with the DS tokens, sourced
from the zip's `tokens/` directory:

- `colors.css` — grayscale ramp + `--green`, under `:root`/`[data-theme="light"]` and `[data-theme="dark"]`
- `typography.css` — `--font-display`/`--font-sans` = Space Grotesk, `--font-mono` = JetBrains Mono, type scale, tracking, leading
- `spacing.css` — space grid, `--radius*`, `--max-width: 1100px`, shadows
- `motion.css` — easing/duration tokens, `prefers-reduced-motion` zeroing
- Keep `@import "tailwindcss";` and the `@variant dark` line at the top

The old `--color-*` token names are **removed**. Every page/component that referenced them
is rewritten in this migration (big-bang), so no bridge aliases are kept.

### Fonts

In `BaseLayout.astro`, replace the Inter+JetBrains `<link>` with Space Grotesk + JetBrains Mono:
`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap`
(keep `preconnect` hints). Self-hosting is a future optimization, not required here.

### Theme + language state (`<html>` attributes)

The DS keys styling off `[data-theme]` and the Hero JS reads `getAttribute('data-theme')`.
The existing site keys off the `.dark` class. Bridge both in the inline pre-paint script in
`BaseLayout.astro`:

```js
const storedTheme = localStorage.getItem('theme');
const theme = storedTheme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark'); // existing Tailwind variant
document.documentElement.setAttribute('data-theme', theme);          // DS tokens + Hero JS

const lang = localStorage.getItem('lang') ?? 'en';
document.documentElement.setAttribute('data-lang', lang);
```

The `ThemeToggle` and language toggle live in the React `Nav` island. On toggle they update
`localStorage`, set both `.dark` class and `data-theme`/`data-lang` attributes, and dispatch a
`themechange` / `langchange` CustomEvent so other islands (Hero, Footer) re-read state.

### Language strategy

Static multi-page site → bilingual UI chrome is delivered through React islands that share a
tiny lang store (`localStorage['lang']` + `langchange` event). The chrome islands are:
**Nav, Hero, Footer**, plus section headers rendered as small islands or via `data-lang`-gated
dual strings. Body/MDX content is not translated in this migration. The language toggle button
flips `en` ⇄ `es` and persists the choice.

### Component mapping (DS mock → real data)

The DS UI-kit components are hardcoded React mockups. Each is adapted to consume the site's
real data while preserving the DS visual treatment exactly.

| DS component | Adapted to | Data source | Notes |
|---|---|---|---|
| `Nav.jsx` | React island, site-wide | static link list | Links → real routes; monogram "ERG"; theme + lang toggles; nav order: Projects → Runbooks → Writing → About → Resume → Contact |
| `Hero.jsx` | React island on home | static `T_HERO` | Cloud icon recolored to grayscale; CTAs → `/projects` and `/resume`; `lang` from store |
| `Projects.jsx` | `.astro` cards (static render) + JS for spotlight hover | `src/data/projects.json` | `title`, `shortDescription`, `tags`, `status`, `featured`→badge; card links → `/projects/[slug]` |
| `Runbooks.jsx` | `.astro` cards | `runbooks` collection | `title`, `severity`, `status`, `estimatedTime`, `tags`, `description`; card links → `/runbooks/[slug]`. The DS inline "Expand steps" accordion is dropped in favor of linking to the full runbook page (multi-page architecture) |
| `Writing.jsx` | `.astro` rows | `writing` collection | `title`, `category`, `publishedDate`, `description`; rows link → `/writing/[slug]` |
| `Footer.jsx` | React island | static | Real links: GitHub `github.com/Rafagross`, LinkedIn `linkedin.com/in/rafagross`, Email `mailto:rafagross15@gmail.com`; bilingual labels |
| core `Button`, `Tag`, `Badge`, `Card`, `StatusDot` | `.astro` components under `src/components/ui/` | — | Replace existing `ui/Tag.astro` etc. with DS styling |
| `Terminal.jsx` | React island on home | static | Decorative SRE terminal — **included** on the home page (confirmed) |

**Spotlight hover** (cards): the DS uses `--mx/--my` CSS vars set on `mousemove`. For static
`.astro` cards, attach a small site-wide `<script>` that wires the same behavior via a shared
class (e.g. `.ds-card`), so we get the effect without making every card a React island.

**`fade-in` entry animation**: DS uses IntersectionObserver + staggered `translateY`. Port the
DS's `ds-base.js` IntersectionObserver into a global client script.

### Pages to rewrite

Every page/component below is restyled to the DS. Functionality and routes unchanged.

- `src/layouts/BaseLayout.astro` — fonts, theme/lang bootstrap, Nav/Footer islands
- `src/layouts/ProjectLayout.astro`, `RunbookLayout.astro`, `WritingLayout.astro` — DS typography, mono metadata, severity/status badges
- `src/pages/index.astro` — Hero island + Projects/Runbooks/Writing DS sections
- `src/pages/projects/index.astro`, `projects/[slug].astro`
- `src/pages/runbooks/index.astro`, `runbooks/[slug].astro`
- `src/pages/writing/index.astro`, `writing/[slug].astro`, `writing/category/[category].astro`
- `src/pages/about.astro`, `contact.astro`, `resume.astro`, `404.astro`
- `src/components/layout/Header.astro` → replaced by DS `Nav` island (or removed)
- `src/components/layout/Footer.astro` → replaced by DS `Footer` island
- `src/components/project/ProjectCard.astro`, `runbook/RunbookCard.astro`, `ui/Tag.astro`, `ui/Callout.astro`

### Adapting DS JSX for Astro/React islands

The zip's `.jsx` files use a standalone-script style: global `React.*` (no import) and
`window.X = X` with no `export`. For each island component, convert to ES modules:
`import React, { useState, useRef, useEffect } from 'react'`, `export default Component`,
remove the `window.X` line, and inline/import any sub-components (`StatusDotInline`,
`BtnInline`, `SectionHeader`, etc.).

## Phasing (single development branch, big-bang merge)

Although delivered as one branch, work proceeds in a safe order so the site builds at each step:

1. **Foundation** — add React integration; swap tokens; swap fonts; theme/lang bootstrap. Site builds; existing pages temporarily ugly but functional.
2. **Chrome** — Nav + Footer islands; BaseLayout wired. Theme + lang toggles working end-to-end.
3. **Home** — Hero island (grayscale cloud) + Projects/Runbooks/Writing sections from real data.
4. **Index pages** — `/projects`, `/runbooks`, `/writing` list pages restyled.
5. **Detail layouts** — ProjectLayout, RunbookLayout, WritingLayout + `[slug]` pages.
6. **Remaining pages** — about, contact, resume, 404, category.
7. **Polish** — spotlight/fade-in scripts, reduced-motion, responsive/mobile nav, a11y focus rings, Lighthouse pass.
8. **Merge to `main`** → GitHub Pages deploy.

## Testing & verification

- `npm run build` (`astro build`) succeeds with zero errors at every phase boundary.
- `npm run check` (`astro check`) passes.
- Manual: light/dark toggle persists and repaints with no FOUC; EN/ES toggle persists and swaps chrome strings; every nav route resolves; cards link to correct detail pages; `prefers-reduced-motion` kills animation.
- Visual spot-check against the zip's `ui_kits/portfolio/index.html` reference.
- Monochrome audit: no stray hue anywhere except `--green` dot (grep for hex colors / cyan/blue in components).

## Risks & mitigations

- **Big-bang breakage** — mitigated by phased ordering with a building site at each boundary, all on a feature branch (not `main`) until complete.
- **React bundle weight on a previously JS-light site** — keep islands minimal; static `.astro` for non-interactive cards; only Nav/Hero/Footer/(Terminal) hydrate.
- **i18n scope creep** — explicitly bounded to UI chrome; MDX translation is out of scope.

## Resolved decisions (formerly open)

1. Footer/contact **email**: `rafagross15@gmail.com` (confirmed).
2. Decorative **Terminal** on the home page: **included** (confirmed).
