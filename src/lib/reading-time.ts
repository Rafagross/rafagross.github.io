/**
 * Estimates reading time for a piece of text content.
 * Average reading speed: 200-238 words per minute (technical content skews slower)
 * We use 200 wpm to account for code blocks and command scanning.
 */
export function estimateReadingTime(content: string): number {
  const WORDS_PER_MINUTE = 200;

  // Strip MDX/Markdown syntax before counting
  const cleaned = content
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`[^`]+`/g, '')         // remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → just text
    .replace(/#{1,6}\s/g, '')         // remove heading markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/---+/g, '')             // horizontal rules
    .replace(/<[^>]+>/g, '')          // HTML tags
    .trim();

  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return Math.max(1, minutes);
}

/**
 * Formats reading time as a human-readable string.
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}
