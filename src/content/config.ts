import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date().or(z.string().transform((val) => new Date(val))),
    updatedDate: z.date().or(z.string().transform((val) => new Date(val))).optional(),
    category: z.enum([
      'Personal Finance',
      'Mutual Funds',
      'SIP & Investing',
      'Goal Planning',
      'Retirement Planning',
      'Insurance & Protection',
      'Wealth Creation',
      'Financial Planning'
    ]),
    tags: z.array(z.string()).default([]),
    author: z.string().default('C. Santhosh Sathriyan, B.E., QPFP Certified'),
    authorTitle: z.string().default('AMFI-Registered Mutual Fund Distributor (ARN: 266896)'),
    featuredImage: z.string().optional(),
    readingTime: z.string().default('5 min read'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    calculatorCTA: z.object({
      title: z.string(),
      description: z.string(),
      buttonLabel: z.string(),
      href: z.string()
    }).optional()
  }),
});

export const collections = {
  'articles': articlesCollection,
};

