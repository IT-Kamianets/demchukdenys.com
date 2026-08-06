import { writeFile } from 'node:fs/promises';

const siteUrl = 'https://demchukdenys.com';
const paths = [
	'',
	'portfolios',
	...Array.from({ length: 6 }, (_, index) => `portfolio/${index + 1}`),
	'services',
	'articles',
	...Array.from({ length: 6 }, (_, index) => `article/${index + 1}`),
];
const lastModified = new Date().toISOString().slice(0, 10);
const urls = paths
	.map(
		(path) => `  <url>\n    <loc>${new URL(path, `${siteUrl}/`).href}</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>`,
	)
	.join('\n');

await writeFile(
	new URL('../public/sitemap.xml', import.meta.url),
	`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
