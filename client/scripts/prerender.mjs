import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tools } from '../src/tools.js';
import { pdfTools } from '../src/pdfTools.js';
import { homeSeo, toolSeo } from '../src/seoContent.js';
import { legalPages } from '../src/legalContent.js';

const here = dirname(fileURLToPath(import.meta.url));
const clientRoot = resolve(here, '..');
const dist = resolve(clientRoot, 'dist');
const siteUrl = (process.env.SITE_URL || 'https://imageforge.onrender.com').replace(/\/+$/, '');
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || '';
new URL(siteUrl);

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const safeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const { renderPage } = await import(pathToFileURL(resolve(clientRoot, '.ssr-build/ssr-entry.js')).href);
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const routes = [
  { path: '/', seo: homeSeo, tool: null },
  ...tools.map((tool) => ({ path: tool.path, seo: toolSeo[tool.id], tool })),
  ...pdfTools.map((tool) => ({ path: tool.path, seo: { title: `${tool.title} | Free PDF Tool | MyPDF`, description: tool.description }, tool })),
  ...Object.entries(legalPages).map(([slug, page]) => ({ path: `/${slug}`, seo: { title: `${page.title} | MyPDF`, description: page.description }, tool: null, legal: page })),
];

for (const route of routes) {
    const rendered = renderPage(route.path);
    const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
    const graph = route.tool
      ? [{ '@type': 'WebApplication', name: route.seo.title.split(' | ')[0], url: canonical, description: route.seo.description, applicationCategory: 'MultimediaApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: route.tool.title, item: canonical }] }]
      : route.legal
        ? [{ '@type': 'WebPage', name: route.seo.title, url: canonical, description: route.seo.description }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: route.legal.title, item: canonical }] }]
      : [{ '@type': 'WebSite', name: 'MyPDF', url: `${siteUrl}/` }, { '@type': 'WebApplication', name: 'MyPDF', url: canonical, description: route.seo.description, applicationCategory: 'MultimediaApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }];
    const verificationTag = googleVerification ? `\n    <meta name="google-site-verification" content="${escapeHtml(googleVerification)}" />` : '';
    const jsonLdTag = `\n    <script id="MyPDF-structured-data" type="application/ld+json">${safeJson({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
    const html = template
      .replace('<title>Free Online Image &amp; PDF Tools | MyPDF</title>', `<title>${escapeHtml(route.seo.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(route.seo.description)}$2`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
      .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(route.seo.title)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(route.seo.description)}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(canonical)}$2`)
      .replace('</head>', `${verificationTag}${jsonLdTag}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
    const outPath = route.path === '/' ? resolve(dist, 'index.html') : resolve(dist, route.path.slice(1), 'index.html');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf8');
}
  const sitemapEntries = routes.map(({ path }) => `  <url><loc>${escapeHtml(`${siteUrl}${path === '/' ? '/' : path}`)}</loc></url>`).join('\n');
  await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`, 'utf8');
  await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
  console.log(`Prerendered ${routes.length} canonical pages for ${siteUrl}`);

