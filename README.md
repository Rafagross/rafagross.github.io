# rafagross.github.io

Personal CloudOps and Platform Engineering portfolio — built with Astro, Tailwind CSS, and MDX. Deployed via GitHub Pages.

**Live site:** https://rafagross.github.io

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6.x |
| Styling | Tailwind CSS 4.x |
| Content | MDX via Astro Content Collections |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Project data | `src/data/projects.json` (curated, no API dependency) |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Type check
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Repository Structure

```
src/
├── components/       # Astro UI components
│   ├── layout/       # Header, Footer
│   ├── ui/           # Tag, Callout (shared)
│   ├── project/      # ProjectCard, ProjectGrid
│   └── runbook/      # RunbookCard, RunbookHeader
├── content/
│   ├── config.ts     # Zod schemas for content collections
│   ├── runbooks/     # MDX runbooks
│   └── writing/      # MDX writing posts
├── data/
│   ├── projects.json       # Curated project data
│   ├── skills.json         # Technical skills
│   └── certifications.json # Certifications
├── layouts/          # Page layouts (Base, Project, Runbook, Writing)
├── lib/              # Utility functions
├── pages/            # Route pages
└── styles/           # Global CSS + design tokens
```

## Adding Content

### Add a project

Edit `src/data/projects.json`. Follow the existing schema — every field is intentional. Required fields: `slug`, `title`, `shortDescription`, `category`, `status`, `featured`, `displayOrder`, `github`, `techStack`, `awsServices`, `operationalValue`.

### Add a runbook

1. Copy `src/content/runbooks/_TEMPLATE.mdx`
2. Rename to `your-runbook-slug.mdx`
3. Fill in frontmatter fields (see schema in `src/content/config.ts`)
4. Write content following the standard section order
5. Set `status: "stable"` and `draft: false` when ready to publish

### Add a writing post

1. Create `src/content/writing/your-post-slug.mdx`
2. Add required frontmatter: `title`, `description`, `category`, `tags`, `publishedDate`
3. Set `draft: false` to publish

## Deployment

Push to `main` triggers automatic deployment via GitHub Actions.

**GitHub Pages setup (one-time):**
1. Repo Settings → Pages → Source: **GitHub Actions**
2. Push to `main` — the workflow handles the rest

**Custom domain (future):**
1. Add `public/CNAME` containing the domain
2. Update `site` in `astro.config.mjs`
3. Configure DNS per GitHub's documentation

## License

Content (writing, runbooks) © Elvis Rafael Gross. Code structure MIT.
