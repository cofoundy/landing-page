import type { APIRoute } from 'astro';
import { languages, defaultLang, getLocalizedPath } from '../utils/i18n';

const siteUrl = 'https://cofoundy.dev';

// Define all pages that should be included in sitemap
const pages = [
  '/', // Homepage
  // Add more pages here as you create them
  // '/services',
  // '/about',
  // '/contact',
];

export const GET: APIRoute = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(page => {
  // Generate entries for all languages
  return Object.keys(languages).map(lang => {
    const localizedPath = getLocalizedPath(page, lang);
    const url = `${siteUrl}${localizedPath}`;
    const lastmod = new Date().toISOString().split('T')[0];
    
    // Generate alternate language links
    const alternates = Object.keys(languages)
      .filter(altLang => altLang !== lang)
      .map(altLang => {
        const altPath = getLocalizedPath(page, altLang);
        const altUrl = `${siteUrl}${altPath}`;
        return `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
      }).join('\n');

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
${alternates}
  </url>`;
  }).join('\n');
}).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}; 