import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const writing = await getCollection('writing', ({ data }) => !data.draft);
  const runbooks = await getCollection('runbooks', ({ data }) => !data.draft && data.status === 'stable');

  // Combine and sort by date
  const items = [
    ...writing.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.publishedDate,
      description: entry.data.description,
      link: `/writing/${entry.id}/`,
      categories: [entry.data.category, ...entry.data.tags],
    })),
    ...runbooks.map((entry) => ({
      title: `[Runbook] ${entry.data.title}`,
      pubDate: entry.data.publishedDate,
      description: entry.data.description,
      link: `/runbooks/${entry.id}/`,
      categories: [entry.data.category, ...entry.data.tags],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Rafael Gross — CloudOps Writing & Runbooks',
    description: 'CloudOps notes, Kubernetes labs, operational runbooks, and architecture decisions by Elvis Rafael Gross.',
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
