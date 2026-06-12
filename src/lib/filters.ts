export const WRITING_CATEGORIES = [
  'AWS CloudOps',
  'Kubernetes',
  'Linux / Troubleshooting',
  'Observability',
  'Automation',
  'Homelab',
  'Cost Optimization',
  'Architecture Decisions',
] as const;

export type WritingCategory = (typeof WRITING_CATEGORIES)[number];

/**
 * Normalizes a category string to a URL-safe slug.
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Converts a URL slug back to the display category name.
 */
export function slugToCategory(slug: string): WritingCategory | undefined {
  return WRITING_CATEGORIES.find(
    (cat) => categoryToSlug(cat) === slug
  );
}

/**
 * Returns all unique tags from a collection of entries.
 */
export function getAllTags(entries: Array<{ data: { tags: string[] } }>): string[] {
  const tags = entries.flatMap((e) => e.data.tags);
  return [...new Set(tags)].sort();
}

/**
 * Status badge inline styles (monochrome DS).
 * Returns a `style` string for use with the `style` attribute.
 * active/stable  → --green (the one permitted hue, same as availability dot)
 * progress       → --text-muted on --bg-subtle, thicker border
 * draft/archived → --text-faint on --bg-subtle
 * deprecated     → --text on --bg-subtle, strong border
 */
export function getStatusStyle(status: string): string {
  const base = 'background:var(--bg-subtle);border:1px solid var(--border);border-radius:4px;padding:2px 6px;font-size:0.6875rem;font-family:var(--font-mono);font-weight:600;letter-spacing:0.05em;text-transform:uppercase;';
  const map: Record<string, string> = {
    active:       base + 'color:var(--green);border-color:var(--green);',
    stable:       base + 'color:var(--green);border-color:var(--green);',
    progress:     base + 'color:var(--text-muted);border-color:var(--border-strong);',
    'in-progress':base + 'color:var(--text-muted);border-color:var(--border-strong);',
    draft:        base + 'color:var(--text-faint);',
    deprecated:   base + 'color:var(--text);border-color:var(--border-strong);',
    archived:     base + 'color:var(--text-faint);',
  };
  return map[status.toLowerCase()] ?? map.draft;
}

/** @deprecated Use getStatusStyle() instead — returns inline style string for monochrome DS. */
export function getStatusClasses(status: string): string {
  return '';
}

/**
 * Severity badge inline styles for runbooks (monochrome DS).
 * P1 → strong border + primary text (most severe)
 * P2 → strong border + muted text
 * P3 → default border + muted text
 * P4 → default border + faint text
 */
export function getSeverityStyle(severity: string): string {
  const base = 'background:var(--bg-subtle);border-radius:4px;padding:2px 6px;font-size:0.6875rem;font-family:var(--font-mono);font-weight:600;letter-spacing:0.05em;text-transform:uppercase;';
  const map: Record<string, string> = {
    P1: base + 'border:2px solid var(--border-strong);color:var(--text);',
    P2: base + 'border:2px solid var(--border);color:var(--text-muted);',
    P3: base + 'border:1px solid var(--border);color:var(--text-muted);',
    P4: base + 'border:1px solid var(--border);color:var(--text-faint);',
  };
  return map[severity] ?? map.P4;
}

/** @deprecated Use getSeverityStyle() instead — returns inline style string for monochrome DS. */
export function getSeverityClasses(severity: string): string {
  return '';
}

/**
 * Formats a date for display — consistent across all pages.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
