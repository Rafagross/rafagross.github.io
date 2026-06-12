# Monochrome SRE Design System Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the entire Astro portfolio with the Monochrome SRE Design System — new tokens, fonts, React islands (Nav, Hero, Footer, Terminal), and re-styled multi-page content — while preserving all existing routes and MDX content.

**Architecture:** Big-bang visual rebuild on branch `redesign/monochrome-sre`. Pure-Astro site gains the `@astrojs/react` integration; only Nav/Hero/Footer/Terminal hydrate as islands, everything else stays static `.astro` styled with DS tokens. Theme uses the existing `.dark` class PLUS a new `[data-theme]` attribute; bilingual UI chrome uses a `[data-lang]` attribute with CSS dual-render for static strings and a shared lang store for islands.

**Tech Stack:** Astro 6, React 18 (via `@astrojs/react`), Tailwind v4, Space Grotesk + JetBrains Mono, vanilla DS tokens (CSS custom properties).

**Verification model:** This is a static-site visual migration with no unit-test harness. The "test" for each task is: `npm run build` succeeds, `npm run check` has no new errors, and the documented visual/behavioral check passes. Commit after each task. **Do NOT add `Co-Authored-By` trailers or any "Claude/Anthropic/Sonnet/Opus" keywords to commit messages** (user rule).

**Source of truth:** The DS source is extracted (gitignored) at `.ds-src/`. Reference files there directly. Key files:
- `.ds-src/tokens/{colors,typography,fonts,spacing,motion}.css`
- `.ds-src/ui_kits/portfolio/{Hero,Nav,Projects,Runbooks,Writing,Footer,Terminal}.jsx`
- `.ds-src/components/core/{Button,Tag,Badge,Card,StatusDot,ThemeToggle,NavLink}.jsx`
- `.ds-src/ui_kits/portfolio/index.html` (full visual reference)

**Commit signing note:** The user's git signs commits via GPG. If `git commit` fails with "No passphrase given", the implementer cannot supply it; either the user pre-caches the passphrase (`echo cache | gpg -s -o /dev/null`) or commits are made with `git -c commit.gpgsign=false commit ...` and the user re-signs later. Prefer signed; fall back to unsigned only if signing fails.

---

## File Structure

**New files:**
- `src/lib/i18n.ts` — UI-string dictionary + `getLang`/`setLang`/`onLangChange` store (client)
- `src/scripts/ds-interactions.ts` — global IntersectionObserver fade-in + card spotlight wiring
- `src/components/islands/Nav.jsx` — fixed top nav island (theme + lang toggles)
- `src/components/islands/Hero.jsx` — home hero island (grayscale cloud, flow field)
- `src/components/islands/Footer.jsx` — footer island
- `src/components/islands/Terminal.jsx` — decorative terminal island
- `src/components/ds/SectionHeader.astro` — eyebrow + heading + sub (bilingual, static)
- `src/components/ds/ProjectCard.astro` — DS project card (static, spotlight via class)
- `src/components/ds/RunbookCard.astro` — DS runbook card (links to detail page)
- `src/components/ds/WritingRow.astro` — DS writing row
- `src/components/ds/Tag.astro`, `Badge.astro`, `Button.astro` — DS atoms

**Modified files:**
- `astro.config.mjs` — add `react()` integration
- `package.json` / `package-lock.json` — React deps (via `astro add`)
- `src/styles/global.css` — replace token blocks with DS tokens + bilingual CSS + DS base styles
- `src/layouts/BaseLayout.astro` — fonts, theme+lang bootstrap, mount Nav/Footer islands, load interactions script
- `src/layouts/{ProjectLayout,RunbookLayout,WritingLayout}.astro` — DS typography/badges
- `src/pages/index.astro` — Hero + Terminal + Projects/Runbooks/Writing sections
- `src/pages/projects/index.astro`, `projects/[slug].astro`
- `src/pages/runbooks/index.astro`, `runbooks/[slug].astro`
- `src/pages/writing/index.astro`, `writing/[slug].astro`, `writing/category/[category].astro`
- `src/pages/{about,contact,resume,404}.astro`

**Removed/replaced files:**
- `src/components/layout/Header.astro` → replaced by Nav island (delete after BaseLayout no longer imports it)
- `src/components/layout/Footer.astro` → replaced by Footer island
- `src/components/project/ProjectCard.astro`, `runbook/RunbookCard.astro` → superseded by `src/components/ds/*` (delete once unreferenced)
- `src/components/ui/{Tag,Callout}.astro` → re-styled or replaced by `src/components/ds/*`

---

## Phase 0 — Foundation

### Task 1: Add the React integration

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install the React integration**

Run: `npx astro add react --yes`

Expected: installs `@astrojs/react`, `react`, `react-dom`; adds `react()` to `integrations` in `astro.config.mjs`.

- [ ] **Step 2: Confirm config**

Open `astro.config.mjs`. The `integrations` array must read `[mdx(), sitemap(), react()]` (order does not matter). If `astro add` failed to edit it, add `import react from '@astrojs/react';` and `react()` manually.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build completes, 24 pages, no errors.

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "build: add @astrojs/react integration"
```

---

### Task 2: Install DS tokens into global.css

**Files:**
- Modify: `src/styles/global.css` (replace lines 8–77, the two token blocks `:root {…}` and `.dark {…}`)

- [ ] **Step 1: Replace the token blocks**

Keep lines 1–6 (`@import "tailwindcss";` and the `@variant dark` line). Replace the `:root {…}` light block and `.dark {…}` dark block (current lines ~8–77) with the DS tokens. Copy the full contents of these files in order, concatenated under the existing `@variant dark` line:

1. `.ds-src/tokens/colors.css` (full — defines grayscale ramp, `--green`, and both `:root`/`[data-theme="light"]` and `[data-theme="dark"]` blocks)
2. `.ds-src/tokens/typography.css` (full)
3. `.ds-src/tokens/spacing.css` (full)
4. `.ds-src/tokens/motion.css` (full)

Do **not** import `fonts.css` here (fonts load via `<link>` in BaseLayout, Task 4). Leave the rest of `global.css` (base styles below line 77) for Step 2.

- [ ] **Step 2: Bridge the dark selector**

The DS keys dark mode off `[data-theme="dark"]`, but Tailwind's `@variant dark` and existing code key off `.dark`. Add this alias block immediately after the pasted DS color tokens so the `.dark` class also yields dark tokens:

```css
/* Bridge: the existing .dark class mirrors [data-theme="dark"] */
html.dark {
  --bg:#0b0b0b; --bg-subtle:#0e0e0e; --surface:#111111; --surface-raised:#161616;
  --border:#1f1f1f; --border-strong:#2a2a2a;
  --text:#f2f2f2; --text-muted:#9a9a9a; --text-faint:#6b6b6b; --text-inverse:#0a0a0a;
  --accent:#ffffff; --accent-text:#0a0a0a;
  --spotlight:rgba(255,255,255,0.06); --grid-line:rgba(255,255,255,0.035); --overlay:rgba(11,11,11,0.72);
  color-scheme:dark;
}
```

- [ ] **Step 3: Update base body styles**

In the `body { … }` rule (was ~line 93), change `background-color: var(--color-bg)` → `var(--bg)`, `color: var(--color-text-primary)` → `var(--text)`, and `font-family: 'Inter', …` → `var(--font-sans)`. Update the mono `font-family` rule (was ~line 158) to `var(--font-mono)`. Replace any remaining `var(--color-*)` references throughout `global.css` with their DS equivalents (`--color-bg`→`--bg`, `--color-bg-subtle`→`--bg-subtle`, `--color-surface`→`--surface`, `--color-text-primary`→`--text`, `--color-text-secondary`→`--text-muted`, `--color-text-muted`→`--text-faint`, `--color-border`→`--border`, `--color-border-strong`→`--border-strong`, `--color-accent`→`--accent`).

Run to find stragglers: `grep -rn "color-" src/styles/global.css`
Expected after fix: no `--color-*` custom-property references remain.

- [ ] **Step 4: Add bilingual + DS helper CSS**

Append to `global.css`:

```css
/* ── Bilingual dual-render: toggle visibility by <html data-lang> ── */
[data-lang-en], [data-lang-es] { display: contents; }
html[data-lang="es"] [data-lang-en] { display: none; }
html:not([data-lang="es"]) [data-lang-es] { display: none; }

/* ── DS entry animation (gated on reduced-motion) ── */
.fade-in { opacity: 0; transform: translateY(20px); }
.fade-in.is-visible { opacity: 1; transform: none; transition: opacity 420ms cubic-bezier(.4,0,.2,1), transform 420ms cubic-bezier(.4,0,.2,1); }
@media (prefers-reduced-motion: reduce) { .fade-in { opacity: 1; transform: none; } }

/* ── Animated underline links (DS) ── */
.ds-link { position: relative; text-decoration: none; color: var(--text-muted); transition: color var(--duration-fast) var(--ease-default); }
.ds-link:hover { color: var(--text); }
.ds-link::after { content:''; position:absolute; left:0; bottom:-2px; height:1px; width:0; background:var(--accent); transition: width var(--duration-normal) var(--ease-default); }
.ds-link:hover::after { width:100%; }

/* ── Focus ring (DS) ── */
a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: completes with no errors. (Pages will look unstyled/odd — expected at this phase.)

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css
git commit -m "style: replace tokens with Monochrome SRE design system"
```

---

### Task 3: Language store + UI dictionary

**Files:**
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Write the store**

```ts
// src/lib/i18n.ts — client-side language store + UI string dictionary.
// Static body content is NOT translated; only UI chrome strings live here.
export type Lang = 'en' | 'es';

export function getLang(): Lang {
  if (typeof document === 'undefined') return 'en';
  return (document.documentElement.getAttribute('data-lang') as Lang) || 'en';
}

export function setLang(lang: Lang): void {
  document.documentElement.setAttribute('data-lang', lang);
  try { localStorage.setItem('lang', lang); } catch {}
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export function onLangChange(cb: (lang: Lang) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent).detail as Lang);
  window.addEventListener('langchange', handler);
  return () => window.removeEventListener('langchange', handler);
}

// Nav link labels + hrefs (real routes, not anchors). Order is canonical.
export const NAV = {
  en: ['Projects', 'Runbooks', 'Writing', 'About', 'Resume', 'Contact'],
  es: ['Proyectos', 'Runbooks', 'Escritura', 'Sobre mí', 'Currículum', 'Contacto'],
} as const;
export const NAV_HREFS = ['/projects', '/runbooks', '/writing', '/about', '/resume', '/contact'];
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run check`
Expected: no errors referencing `i18n.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat: add client language store and nav dictionary"
```

---

### Task 4: Theme + language bootstrap in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (head fonts + inline scripts; lines ~67–90)

- [ ] **Step 1: Swap the font link**

Replace the Inter+JetBrains `<link href="…Inter…">` (lines ~71–74) with:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Keep the two `preconnect` lines above it.

- [ ] **Step 2: Replace the pre-paint theme script**

Replace the existing theme `<script is:inline>` (lines ~77–84) with one that sets BOTH the class and both attributes:

```html
<script is:inline>
  (function () {
    const t = localStorage.getItem('theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.setAttribute('data-theme', t);
    const l = localStorage.getItem('lang') ?? 'en';
    document.documentElement.setAttribute('data-lang', l);
  })();
</script>
```

- [ ] **Step 3: Verify build + no FOUC**

Run: `npm run build && npm run preview`
Open the preview URL. In DevTools, set `localStorage.theme='dark'`, reload: `<html>` has both `class="dark"` and `data-theme="dark"` before paint. Set `localStorage.lang='es'`, reload: `<html data-lang="es">`.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: bootstrap DS fonts, theme attribute, and lang attribute"
```

---

### Task 5: Global interactions script (fade-in + spotlight)

**Files:**
- Create: `src/scripts/ds-interactions.ts`
- Modify: `src/layouts/BaseLayout.astro` (load the script before `</body>`)

- [ ] **Step 1: Write the interactions script**

```ts
// src/scripts/ds-interactions.ts — DS entry fade-in + card spotlight.
function initFadeIn() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach((el) => io.observe(el));
}

function initSpotlight() {
  document.querySelectorAll<HTMLElement>('.ds-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

initFadeIn();
initSpotlight();
```

- [ ] **Step 2: Load it from BaseLayout**

Before `</body>` in `src/layouts/BaseLayout.astro`, add:

```astro
<script>
  import '../scripts/ds-interactions.ts';
</script>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: completes, no errors. (No `.fade-in`/`.ds-card` elements exist yet — script is a no-op for now.)

- [ ] **Step 4: Commit**

```bash
git add src/scripts/ds-interactions.ts src/layouts/BaseLayout.astro
git commit -m "feat: add DS fade-in and card spotlight interactions"
```

---

## Phase 1 — Chrome (Nav + Footer islands)

### Task 6: Nav island

**Files:**
- Create: `src/components/islands/Nav.jsx`
- Modify: `src/layouts/BaseLayout.astro` (replace `<Header />` with `<Nav client:load />`)
- Reference: `.ds-src/ui_kits/portfolio/Nav.jsx`, `.ds-src/components/core/ThemeToggle.jsx`

- [ ] **Step 1: Write the Nav island**

Adapt `.ds-src/ui_kits/portfolio/Nav.jsx` to an ES module. Changes from the DS source:
- Add `import React, { useState, useEffect } from 'react';` and `export default function Nav() { … }`; remove the `window.Nav = Nav;` line and the `isDark/toggleTheme/lang/setLang` props (the island owns its own state).
- Import labels: `import { NAV, NAV_HREFS, getLang, setLang as setLangStore, onLangChange } from '../../lib/i18n.js';`
- Manage `lang` with `useState(getLang())` + `useEffect(() => onLangChange(setLang), [])`; the ES button calls `setLangStore(lang === 'en' ? 'es' : 'en')`.
- Manage theme with `useState` initialized from `document.documentElement.getAttribute('data-theme') === 'dark'`. `toggleTheme` must mirror BOTH systems and persist under key `theme`:

```js
const toggleTheme = () => {
  const next = isDark ? 'light' : 'dark';
  document.documentElement.classList.toggle('dark', next === 'dark');
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch {}
  setIsDark(!isDark);
};
```

- Keep the DS markup: fixed bar, `scrolled` state (`window.scrollY > 32` → border + `var(--overlay)` background + `blur(12px)`), monogram `ERG`, centered `NavLinkInline` list, the EN/ES button, and the sun/moon `ThemeToggle` SVGs (copy the SVG markup from the DS `Nav.jsx` toggle button, lines 79–90).
- Change `href={hrefs[i]}` to `href={NAV_HREFS[i]}` and labels to `NAV[lang][i]`.
- Add a mobile breakpoint: hide the centered link list under 680px via inline `display` keyed on a `useState` width check, or render the links with a CSS class `ds-nav-links` and add `@media (max-width:680px){.ds-nav-links{display:none}}` to `global.css`. (Mobile menu is out of scope; links collapse, toggles remain.)

- [ ] **Step 2: Mount in BaseLayout**

In `src/layouts/BaseLayout.astro`: add `import Nav from '../components/islands/Nav.jsx';` to the frontmatter, remove `import Header from '../components/layout/Header.astro';`, and replace `<Header />` with `<Nav client:load />`. Add `padding-top: 56px` to `<main>` (the nav is fixed, height 56) — set via a wrapper style or a `main { padding-top: 56px; }` rule in `global.css`.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run preview`
Check: nav is fixed at top; scrolling past 32px adds the frosted border/background; clicking ES flips all nav labels to Spanish and persists across reload; clicking the theme toggle flips light/dark and persists; nav links navigate to `/projects` etc.

- [ ] **Step 4: Commit**

```bash
git add src/components/islands/Nav.jsx src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: add DS Nav island with theme and language toggles"
```

---

### Task 7: Footer island

**Files:**
- Create: `src/components/islands/Footer.jsx`
- Modify: `src/layouts/BaseLayout.astro` (replace `<Footer />` import + usage)
- Reference: `.ds-src/ui_kits/portfolio/Footer.jsx`

- [ ] **Step 1: Write the Footer island**

Adapt `.ds-src/ui_kits/portfolio/Footer.jsx`: add `import React, { useState, useEffect } from 'react';`, `export default function Footer()`, remove `window.Footer`. Own `lang` via `useState(getLang())` + `onLangChange`. Set `LINK_HREFS = ['https://github.com/Rafagross', 'https://linkedin.com/in/rafagross', 'mailto:rafagross15@gmail.com']`. Keep the ERG monogram, `t.built`, `t.role`, and the three `FooterLink`s. Add `import { getLang, onLangChange } from '../../lib/i18n.js';`.

- [ ] **Step 2: Mount in BaseLayout**

Replace `import Footer from '../components/layout/Footer.astro';` with `import Footer from '../components/islands/Footer.jsx';` and `<Footer />` with `<Footer client:visible />`.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run preview`
Check: footer shows ERG, bilingual tagline (flips with the nav ES toggle after reload — note `client:visible` islands read lang on mount; toggling without reload updates via `onLangChange`), and the three links point to the real GitHub/LinkedIn/mailto targets.

- [ ] **Step 4: Delete the old layout components**

```bash
git rm src/components/layout/Header.astro src/components/layout/Footer.astro
```

Run: `grep -rn "layout/Header\|layout/Footer" src/` → expected: no matches.

- [ ] **Step 5: Verify build + commit**

```bash
npm run build
git add -A
git commit -m "feat: add DS Footer island and remove legacy Header/Footer"
```

---

## Phase 2 — Home page

### Task 8: Hero island (grayscale cloud)

**Files:**
- Create: `src/components/islands/Hero.jsx`
- Reference: the user-provided Hero code / `.ds-src/ui_kits/portfolio/Hero.jsx`

- [ ] **Step 1: Write the Hero island**

Start from `.ds-src/ui_kits/portfolio/Hero.jsx`. Convert to ES module:
- `import React, { useRef, useEffect, useState } from 'react';` and replace every `React.useRef/useState/useEffect` with the imported hooks (or keep `React.*` and just `import React from 'react'`). `export default function Hero({ lang = 'en' })`. Remove `window.Hero = Hero;`.
- Keep `FlowFieldCanvas`, `TypingCursor`, `StatusDotInline`, `BtnInline`, and the entry-stagger logic — they are self-contained in that file.
- Own `lang` reactively: `const [lang, setLangState] = useState(getLang()); useEffect(() => onLangChange(setLangState), []);` (import from `../../lib/i18n.js`). Remove the incoming `lang` prop dependence, OR keep the prop and also subscribe — subscribing wins.
- **Recolor the cloud to grayscale (monochrome strict):**
  - In `CloudIcon`, change the SVG `filter` drop-shadows from cyan/blue to neutral: `filter:'drop-shadow(0 0 7px rgba(255,255,255,0.5)) drop-shadow(0 0 14px rgba(255,255,255,0.2))'` (dark) — use `var(--text)`-adjacent neutral glows. Simplest portable choice: `drop-shadow(0 0 6px rgba(154,154,154,0.5))`.
  - Replace the `<linearGradient id="cloud-grad-cb">` stops `#00BCD4`/`#2F55FF` with `stop-color="currentColor"` at both stops, and set the SVG `color: 'var(--text)'` so the cloud outline follows the monochrome accent in both themes.
  - The halo `stroke="rgba(150,220,255,0.40)"` → `stroke="rgba(154,154,154,0.40)"`. The white sweep stays white.
- CTAs: in `T_HERO`, point the buttons at real routes — change `BtnInline href="#projects"` → `href="/projects"` and `href="#resume"` → `href="/resume"`.

- [ ] **Step 2: Verify in isolation**

Temporarily render `<Hero client:load />` in `src/pages/index.astro` (full replacement comes in Task 11). Run `npm run build && npm run preview`. Check: hero fills viewport; flow-field canvas animates (unless reduced-motion); cloud icon is grayscale (no cyan/blue) and floats; typing cursor cycles roles; CTAs link to `/projects` and `/resume`; stack chips render. Toggle dark mode — cloud + text adapt.

- [ ] **Step 3: Commit**

```bash
git add src/components/islands/Hero.jsx src/pages/index.astro
git commit -m "feat: add DS Hero island with monochrome cloud icon"
```

---

### Task 9: DS atoms — Tag, Badge, Button, SectionHeader

**Files:**
- Create: `src/components/ds/Tag.astro`, `Badge.astro`, `Button.astro`, `SectionHeader.astro`

- [ ] **Step 1: Tag.astro** (mono pill, used for tech tags)

```astro
---
interface Props { class?: string; }
const { class: cls = '' } = Astro.props;
---
<span class={cls} style="font-family:var(--font-mono);font-size:10px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-faint);background:var(--bg-subtle);border:1px solid var(--border);border-radius:9999px;padding:2px 8px;line-height:1.6;display:inline-block">
  <slot />
</span>
```

- [ ] **Step 2: Badge.astro** (status / featured marker; `variant` = `accent | muted`)

```astro
---
interface Props { variant?: 'accent' | 'muted'; }
const { variant = 'muted' } = Astro.props;
const color = variant === 'accent' ? 'var(--accent)' : 'var(--text-muted)';
const border = variant === 'accent' ? 'var(--accent)' : 'var(--border)';
---
<span style={`font-family:var(--font-mono);font-size:10px;font-weight:${variant==='accent'?700:600};letter-spacing:0.14em;text-transform:uppercase;color:${color};border:1px solid ${border};border-radius:var(--radius-sm);padding:2px 7px;display:inline-block`}>
  <slot />
</span>
```

- [ ] **Step 3: Button.astro** (`variant` = `primary | secondary`)

```astro
---
interface Props { href: string; variant?: 'primary' | 'secondary'; }
const { href, variant = 'primary' } = Astro.props;
const primary = variant === 'primary';
---
<a href={href} class="ds-btn" data-variant={variant}
  style={`display:inline-flex;align-items:center;text-decoration:none;font-family:var(--font-sans);font-size:var(--text-sm);font-weight:500;letter-spacing:var(--tracking-tight);padding:9px 20px;border-radius:var(--radius-sm);border:1px solid;background:${primary?'var(--accent)':'transparent'};color:${primary?'var(--accent-text)':'var(--text)'};border-color:${primary?'var(--accent)':'var(--border-strong)'};transition:var(--transition-color),transform var(--duration-fast) var(--ease-default)`}>
  <slot />
</a>
```

Add hover in `global.css`: `.ds-btn:hover{transform:translateY(-1px)} .ds-btn[data-variant="primary"]:hover{background:transparent;color:var(--text)} .ds-btn[data-variant="secondary"]:hover{border-color:var(--text)}`.

- [ ] **Step 4: SectionHeader.astro** (bilingual eyebrow + heading + sub)

```astro
---
interface Props { label: string; en: { heading: string; sub: string }; es: { heading: string; sub: string }; }
const { label, en, es } = Astro.props;
---
<div style="margin-bottom:36px">
  <span style="font-family:var(--font-mono);font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-faint);display:block;margin-bottom:8px">{label}</span>
  <h2 style="font-family:var(--font-display);font-weight:700;font-size:var(--text-h2);letter-spacing:var(--tracking-tight);color:var(--text);line-height:var(--leading-tight);margin-bottom:6px">
    <span data-lang-en>{en.heading}</span><span data-lang-es>{es.heading}</span>
  </h2>
  <p style="font-size:var(--text-sm);color:var(--text-muted)">
    <span data-lang-en>{en.sub}</span><span data-lang-es>{es.sub}</span>
  </p>
</div>
```

- [ ] **Step 5: Verify build + commit**

```bash
npm run build
git add src/components/ds/Tag.astro src/components/ds/Badge.astro src/components/ds/Button.astro src/components/ds/SectionHeader.astro src/styles/global.css
git commit -m "feat: add DS atoms (Tag, Badge, Button, SectionHeader)"
```

---

### Task 10: DS cards — ProjectCard, RunbookCard, WritingRow

**Files:**
- Create: `src/components/ds/ProjectCard.astro`, `RunbookCard.astro`, `WritingRow.astro`
- Reference: `.ds-src/ui_kits/portfolio/{Projects,Runbooks,Writing}.jsx`

- [ ] **Step 1: ProjectCard.astro**

Static port of the DS `ProjectCard` (`.ds-src/ui_kits/portfolio/Projects.jsx` lines 54–136). Props: `href, title, description, status, tags (string[]), featured (bool)`. Root `<a class="ds-card fade-in" href={href}>` with `--mx/--my` defaults and the spotlight `<div>` (spotlight wired globally via Task 5). Badge row uses `Badge variant="accent"` for `Featured` (when `featured`) and `Badge variant="muted"` for `status`; external-link SVG (copy from DS lines 107–109); title `h3`; description `p`; tags via `Tag`. Replace the React `hov` border logic with CSS: add `.ds-card{border:1px solid var(--border);transition:transform 200ms cubic-bezier(.4,0,.2,1),box-shadow 200ms,border-color 120ms} .ds-card:hover{border-color:var(--border-strong);transform:scale(1.015) translateY(-3px);box-shadow:var(--shadow-md)}` and the spotlight bg `.ds-card>.ds-spot{position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(380px circle at var(--mx,50%) var(--my,50%),var(--spotlight),transparent 70%)}` to `global.css`.

- [ ] **Step 2: RunbookCard.astro**

Static port of the DS runbook card header (`.ds-src/ui_kits/portfolio/Runbooks.jsx` lines 64–135) **without the accordion** — it is a link, not a collapsible. Root `<a class="ds-card fade-in" href={href}>`. Layout: severity badge (mono, `border-strong`), title, meta (`estimatedTime` mono, `status` badge), and a right chevron-right (not down) SVG. Tags row below. Props: `href, title, severity, status, estimatedTime, tags`.

- [ ] **Step 3: WritingRow.astro**

Static port of the DS `WritingRow` (`.ds-src/ui_kits/portfolio/Writing.jsx` lines 44–95). Props: `href, title, category, date (string), description`. Flex row: left column (120px) with mono date + category pill; center title `h3` + description `p`; right `Read →` arrow. Use `class="ds-link"`-style hover or the DS opacity hover via a `.ds-row` class + CSS.

- [ ] **Step 4: Verify build + commit**

```bash
npm run build
git add src/components/ds/ProjectCard.astro src/components/ds/RunbookCard.astro src/components/ds/WritingRow.astro src/styles/global.css
git commit -m "feat: add DS cards (project, runbook, writing)"
```

---

### Task 11: Assemble the home page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/islands/Terminal.jsx`
- Reference: `.ds-src/ui_kits/portfolio/Terminal.jsx`

- [ ] **Step 1: Terminal island**

Adapt `.ds-src/ui_kits/portfolio/Terminal.jsx`: `import React, { useState, useRef } from 'react';`, `export default function Terminal()`, remove `window.Terminal`. Own `lang` via `useState(getLang())` + `onLangChange`. Keep the `COMMANDS` map, window chrome, command buttons, typing output, and blink cursor as-is (already monochrome). Wrap the section so it sits between Runbooks and Writing (or after Hero — see Step 2).

- [ ] **Step 2: Rewrite index.astro**

Keep the frontmatter data loading (it already pulls `projectsData`, runbooks/writing collections, `skillsData`). Add imports for `Hero`, `Terminal` islands and the DS card components + `SectionHeader`. Replace the entire `<BaseLayout>` body with:

1. `<Hero client:load />` (full-bleed; remove the old hand-built hero section and the profile photo block).
2. Projects section: `<section id="projects" style="padding:var(--section-gap) clamp(20px,4vw,48px);background:var(--bg)">` → `max-width:var(--max-width)` container → `<SectionHeader label="01" en={{heading:'Projects',sub:'Selected infrastructure work'}} es={{heading:'Proyectos',sub:'Trabajo de infraestructura seleccionado'}} />` → grid `repeat(auto-fill,minmax(300px,1fr))` of `<ProjectCard>` mapped from `featuredProjects` (`href={`/projects/${p.slug}`}`, `title`, `description={p.shortDescription}`, `status={p.status}`, `tags={p.tags ?? p.awsServices}`, `featured={p.featured}`).
3. `<Terminal client:visible />` decorative section.
4. Runbooks section: `id="runbooks"`, `background:var(--bg-subtle)` + top/bottom border, `SectionHeader label="02"` (`Runbooks` / `Procedimientos operativos probados en campo`), column of `<RunbookCard>` from `recentRunbooks` (`href={`/runbooks/${rb.id}`}`, `severity`, `status`, `estimatedTime`, `tags` from `rb.data`).
5. Writing section: `id="writing"`, `SectionHeader label="03"` (`Writing` / `Notas técnicas`), column of `<WritingRow>` from `recentWriting` (`href={`/writing/${post.id}`}`, `category`, `date={post.data.publishedDate.toLocaleDateString('en-US',{month:'short',year:'numeric'})}`, `description`).

Remove the old `<style>` `.stretched-link` block if its markup is gone.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run preview`
Check: home shows Hero → Projects (real featured projects, cards link to `/projects/[slug]`) → Terminal (clicking `$ whoami` types output) → Runbooks (real runbooks, link to detail) → Writing (real posts, link to detail). Fade-in animates on scroll; card spotlight follows cursor; ES toggle flips section headers; dark mode works.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/islands/Terminal.jsx
git commit -m "feat: rebuild home page with DS hero, sections, and terminal"
```

---

## Phase 3 — Index (list) pages

### Task 12: Projects, Runbooks, Writing list pages

**Files:**
- Modify: `src/pages/projects/index.astro`, `src/pages/runbooks/index.astro`, `src/pages/writing/index.astro`, `src/pages/writing/category/[category].astro`

- [ ] **Step 1: Restyle each list page**

For each page, keep the existing data-loading frontmatter and route logic. Replace the markup with the DS pattern: a page header (`SectionHeader`-style eyebrow + display heading + sub), then the full list rendered with the DS card/row components from Task 10 (`ProjectCard` for all projects, `RunbookCard` for all runbooks, `WritingRow` for all posts). Wrap content in `<section style="padding:var(--section-gap) clamp(20px,4vw,48px)"><div style="max-width:var(--max-width);margin:0 auto">…`. Reuse existing filtering/sorting. Map fields exactly as in Task 11. For `writing/category/[category].astro`, keep the category param logic and render the filtered `WritingRow` list with a heading naming the category.

- [ ] **Step 2: Verify**

Run: `npm run build && npm run preview`
Check `/projects`, `/runbooks`, `/writing`, and one `/writing/category/<cat>` route: all items render as DS cards, links resolve, headers styled, dark/lang toggles work.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/index.astro src/pages/runbooks/index.astro src/pages/writing/index.astro src/pages/writing/category/[category].astro
git commit -m "feat: restyle list pages with DS cards"
```

---

## Phase 4 — Detail layouts + slug pages

### Task 13: ProjectLayout, RunbookLayout, WritingLayout

**Files:**
- Modify: `src/layouts/ProjectLayout.astro`, `RunbookLayout.astro`, `WritingLayout.astro`

- [ ] **Step 1: Restyle the layouts**

For each layout, apply DS typography and metadata styling while keeping the `<slot />` for MDX body and all frontmatter props. Specifics:
- Title: `font-family:var(--font-display);font-weight:700;font-size:var(--text-h1);letter-spacing:var(--tracking-display);color:var(--text)`.
- Metadata row (mono): dates, reading time, severity (`Badge`), status (`Badge`), category (`Tag`). Use the DS `Badge`/`Tag` atoms.
- Body wrapper: `max-width:var(--max-width-text);margin:0 auto;` with prose styles keyed to DS tokens (`color:var(--text);line-height:var(--leading-relaxed)`; headings in `--font-display`; inline code + code blocks in `--font-mono` on `var(--bg-subtle)`/`var(--surface)` with `var(--border)`).
- Ensure the existing Shiki code-block themes still apply (the `markdown.shikiConfig` in `astro.config.mjs` is unchanged); just make surrounding `pre`/`code` spacing DS-consistent.

- [ ] **Step 2: Verify**

Run: `npm run build && npm run preview`
Open one project (`/projects/aws-cloudops-private-ec2-operations-platform`), one runbook (`/runbooks/ec2-instance-unreachable-via-ssm`), one writing post (`/writing/homelab-proxmox-k3s-cluster`). Check: DS title/typography, mono metadata, readable prose, code blocks styled, architecture SVG (project) still renders (do not remove the existing SVG embed logic).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ProjectLayout.astro src/layouts/RunbookLayout.astro src/layouts/WritingLayout.astro
git commit -m "feat: restyle detail layouts with DS typography"
```

---

### Task 14: Detail slug pages

**Files:**
- Modify: `src/pages/projects/[slug].astro`, `src/pages/runbooks/[slug].astro`, `src/pages/writing/[slug].astro`

- [ ] **Step 1: Align slug pages with restyled layouts**

These pages mostly pass data to the layouts from Task 13. Update any inline markup (related items, tag lists, "back" links, prev/next) to DS atoms (`Tag`, `Badge`, `ds-link`). Keep `getStaticPaths` and content rendering intact. Preserve the project architecture-diagram embed.

- [ ] **Step 2: Verify build + visual**

Run: `npm run build && npm run preview` — spot-check one of each detail route; confirm related-item links and back links use DS styling and resolve.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/[slug].astro src/pages/runbooks/[slug].astro src/pages/writing/[slug].astro
git commit -m "feat: align detail slug pages with DS"
```

---

## Phase 5 — Standalone pages

### Task 15: About, Contact, Resume, 404

**Files:**
- Modify: `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/resume.astro`, `src/pages/404.astro`

- [ ] **Step 1: Restyle each page**

Apply DS layout container (`max-width:var(--max-width)` / `--max-width-text` for prose), DS headings (`--font-display`), mono labels, `Tag`/`Badge` atoms, and `Button` for CTAs. Specifics:
- `about.astro`: DS prose; any skill/cert lists use `Tag`. Keep content.
- `contact.astro`: keep the Cal.com inline widget script/embed intact (recent commit added it); restyle surrounding copy and the email link to `mailto:rafagross15@gmail.com` with DS styling.
- `resume.astro`: keep the full resume content and the PDF download link; restyle headings/sections/metadata to DS. (Resume content updates are a separate task — do not rewrite content here.)
- `404.astro`: DS-styled centered message + `Button` back to home.

- [ ] **Step 2: Verify**

Run: `npm run build && npm run preview` — check `/about`, `/contact` (Cal.com widget loads), `/resume` (PDF link works), and a bad URL (404). Dark/lang toggles work everywhere.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro src/pages/contact.astro src/pages/resume.astro src/pages/404.astro
git commit -m "feat: restyle about, contact, resume, and 404 pages with DS"
```

---

## Phase 6 — Cleanup, polish, verify

### Task 16: Remove dead components + monochrome audit

**Files:**
- Delete: `src/components/project/ProjectCard.astro`, `src/components/runbook/RunbookCard.astro`, and any now-unused `src/components/ui/*` (verify each is unreferenced first)

- [ ] **Step 1: Find unreferenced legacy components**

Run for each candidate, e.g.: `grep -rn "project/ProjectCard\|runbook/RunbookCard\|ui/Tag\|ui/Callout" src/`
Delete only those with no matches. `Callout.astro` may still be used inside MDX — if referenced, restyle it to DS instead of deleting.

- [ ] **Step 2: Monochrome audit**

Run: `grep -rniE "#00bcd4|#2f55ff|0e7490|22d3ee|teal|cyan|blue" src/`
Expected: no stray brand hues in components (the only permitted hue is `--green: #3fb950`, used solely for the StatusDot). Fix any hit by swapping to a DS grayscale token. Confirm the StatusDot green still appears in the Hero "Available" indicator.

- [ ] **Step 3: Verify build + commit**

```bash
npm run build
git add -A
git commit -m "chore: remove legacy components and audit monochrome palette"
```

---

### Task 17: Final verification pass

- [ ] **Step 1: Full build + typecheck**

Run: `npm run build && npm run check`
Expected: build completes (≈24 pages), `astro check` reports 0 errors.

- [ ] **Step 2: Behavioral checklist (preview)**

Run: `npm run preview`. Verify:
- [ ] Theme toggle persists across reload, no FOUC, both `.dark` and `[data-theme]` set.
- [ ] Language toggle flips all chrome (nav, hero, section headers, footer) and persists.
- [ ] Every nav route resolves; home section cards link to correct detail pages.
- [ ] `prefers-reduced-motion` (DevTools emulate) disables flow field, fade-in, float, typing.
- [ ] Mobile width (≤680px): nav links collapse, toggles remain, hero cloud hides, layout not broken.
- [ ] Fonts are Space Grotesk (display/body) + JetBrains Mono (tags/terminal); no Inter anywhere.

- [ ] **Step 3: Update CLAUDE.md note (optional)**

If the repo CLAUDE.md documents the stack as "Astro pure / no React", update that line to reflect the React integration. (Skip if not present.)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass for DS migration"
```

---

## Phase 7 — Merge

### Task 18: Merge to main and deploy

- [ ] **Step 1: Confirm with the user** before merging — the big-bang replaces the live site.

- [ ] **Step 2: Merge**

```bash
git checkout main
git merge --no-ff redesign/monochrome-sre -m "feat: migrate portfolio to Monochrome SRE design system"
```

- [ ] **Step 3: Push (only when the user asks)**

```bash
git push origin main
```

GitHub Pages rebuilds from `main`. Verify the live site after the Pages action completes.

---

## Out of scope (separate follow-up tasks)

Tracked in the spec, NOT part of this plan: updated resume content + PDF, cover letter, architecture diagrams, repo-access changes, and Spanish translation of long-form MDX articles. Address each as its own spec/plan after this migration ships.
