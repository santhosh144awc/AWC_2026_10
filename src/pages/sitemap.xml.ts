import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://antwealth.in';
  
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/plan', changefreq: 'monthly', priority: '0.9' },
    { url: '/plan/children', changefreq: 'monthly', priority: '0.9' },
    { url: '/tools', changefreq: 'monthly', priority: '0.9' },
    { url: '/tools/retirement-distribution', changefreq: 'monthly', priority: '0.9' },
    { url: '/tools/retirement', changefreq: 'monthly', priority: '0.9' },
    { url: '/tools/home-purchase', changefreq: 'monthly', priority: '0.9' },
    { url: '/tools/life-insurance', changefreq: 'monthly', priority: '0.9' },
    { url: '/health-check', changefreq: 'monthly', priority: '0.9' },
    { url: '/health-check/real-statement', changefreq: 'monthly', priority: '0.9' },
    { url: '/learn', changefreq: 'weekly', priority: '0.85' },
    { url: '/about', changefreq: 'monthly', priority: '0.8' },
    { url: '/contact', changefreq: 'monthly', priority: '0.8' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
    { url: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
  ];

  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const articlePages = articles.map((article) => ({
    url: `/learn/${article.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date(article.data.publishDate).toISOString().split('T')[0]
  }));

  const allEntries = [...staticPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (item) => `  <url>
    <loc>${siteUrl}${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>${'lastmod' in item ? `\n    <lastmod>${item.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
