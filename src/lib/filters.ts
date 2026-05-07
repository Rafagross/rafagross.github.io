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
 * Status badge color classes.
 */
export function getStatusClasses(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    stable: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'in-progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    deprecated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  return map[status.toLowerCase()] ?? map.draft;
}

/**
 * Severity badge color classes for runbooks.
 */
export function getSeverityClasses(severity: string): string {
  const map: Record<string, string> = {
    P1: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
    P2: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    P3: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    P4: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
  };
  return map[severity] ?? map.P4;
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
