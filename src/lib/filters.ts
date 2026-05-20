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

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugToCategory(slug: string): WritingCategory | undefined {
  return WRITING_CATEGORIES.find((cat) => categoryToSlug(cat) === slug);
}

export function getAllTags(entries: Array<{ data: { tags: string[] } }>): string[] {
  const tags = entries.flatMap((e) => e.data.tags);
  return [...new Set(tags)].sort();
}

/**
 * Status badge — inline styles only, works with both light and dark zinc palette.
 * Returns { bg, text, border } as an inline style string.
 */
export function getStatusStyle(status: string): string {
  const map: Record<string, string> = {
    active:       'background:#16a34a1a; color:#16a34a; border:1px solid #16a34a33',
    stable:       'background:#16a34a1a; color:#16a34a; border:1px solid #16a34a33',
    progress:     'background:#d974061a; color:#d97406; border:1px solid #d9740633',
    'in-progress':'background:#d974061a; color:#d97406; border:1px solid #d9740633',
    draft:        'background:var(--color-surface-raised); color:var(--color-text-muted); border:1px solid var(--color-border)',
    deprecated:   'background:#dc26261a; color:#dc2626; border:1px solid #dc262633',
    archived:     'background:var(--color-surface-raised); color:var(--color-text-muted); border:1px solid var(--color-border)',
  };
  return map[status.toLowerCase()] ?? map.draft;
}

/** @deprecated Use getStatusStyle instead */
export function getStatusClasses(status: string): string {
  return '';
}

/**
 * Severity badge — inline styles, zinc-safe.
 */
export function getSeverityStyle(severity: string): string {
  const map: Record<string, string> = {
    P1: 'background:#dc26261a; color:#dc2626; border:1px solid #dc262633',
    P2: 'background:#d974061a; color:#d97406; border:1px solid #d9740633',
    P3: 'background:#2563eb1a; color:#2563eb; border:1px solid #2563eb33',
    P4: 'background:var(--color-surface-raised); color:var(--color-text-muted); border:1px solid var(--color-border)',
  };
  return map[severity] ?? map.P4;
}

/** @deprecated Use getSeverityStyle instead */
export function getSeverityClasses(severity: string): string {
  return '';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
