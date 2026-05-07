import { defineCollection, z } from 'astro:content';

// ============================================================
// SHARED ENUMS
// ============================================================

const CATEGORIES = [
  'AWS CloudOps',
  'Kubernetes',
  'Linux / Troubleshooting',
  'Observability',
  'Automation',
  'Homelab',
  'Cost Optimization',
  'Architecture Decisions',
] as const;

const SEVERITY_LEVELS = ['P1', 'P2', 'P3', 'P4'] as const;
const RUNBOOK_STATUS = ['draft', 'stable', 'deprecated'] as const;
const WRITING_CATEGORIES = [...CATEGORIES] as const;

// ============================================================
// RUNBOOKS COLLECTION
// ============================================================
const runbooks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()),
    severity: z.enum(SEVERITY_LEVELS),
    estimatedTime: z.string(), // e.g., "10-20 min"
    status: z.enum(RUNBOOK_STATUS).default('draft'),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    awsServices: z.array(z.string()).optional().default([]),
    gcpServices: z.array(z.string()).optional().default([]),
    prerequisites: z.array(z.string()).optional().default([]),
    relatedRunbooks: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

// ============================================================
// WRITING COLLECTION (blog + homelab + notes)
// ============================================================
const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(WRITING_CATEGORIES),
    tags: z.array(z.string()),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    readingTime: z.number().optional(), // minutes, auto-computed if not set
  }),
});

export const collections = { runbooks, writing };
