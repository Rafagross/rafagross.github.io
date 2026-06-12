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
 * Formats a date for display — consistent across all pages.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
