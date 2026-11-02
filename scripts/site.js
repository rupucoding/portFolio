// Shared by vite.config.js and scripts/postbuild.js (Node only).
import { profile } from '../src/data/profile.js'

// Repo name on GitHub Pages. The deploy workflow sets BASE_PATH automatically,
// so this default only matters for local builds.
const DEFAULT_BASE = '/portfolio/'

export function getBase() {
  let base = process.env.BASE_PATH || DEFAULT_BASE
  if (!base.startsWith('/')) base = `/${base}`
  if (!base.endsWith('/')) base = `${base}/`
  return base
}

export function getSiteUrl() {
  return profile.site.origin.replace(/\/$/, '') + getBase()
}

export const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export const defaultTitle = `${profile.name} · ${profile.title}`

/**
 * SEO block injected into <head>. Wrapped in markers so the postbuild
 * script can swap it per route (blog list, each post).
 */
export function seoTags({
  title = defaultTitle,
  description = profile.site.description,
  path = '',
  type = 'website',
  publishedTime,
  jsonLd = true,
} = {}) {
  const siteUrl = getSiteUrl()
  const url = siteUrl + path
  const image = `${siteUrl}og-image.png`
  const t = escapeHtml(title)
  const d = escapeHtml(description)

  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="author" content="${escapeHtml(profile.name)}" />`,
    `<meta name="keywords" content="${escapeHtml(profile.site.keywords.join(', '))}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="sitemap" type="application/xml" href="${siteUrl}sitemap.xml" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(profile.name)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(`${profile.name}, ${profile.title}`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ]

  if (publishedTime) {
    tags.push(`<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`)
  }

  if (jsonLd) {
    const person = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.title,
      url: siteUrl,
      email: `mailto:${profile.email}`,
      address: { '@type': 'PostalAddress', addressLocality: profile.location },
      sameAs: profile.social.filter((s) => s.href.startsWith('http')).map((s) => s.href),
    }
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
    )
  }

  return `<!-- seo:start -->\n    ${tags.join('\n    ')}\n    <!-- seo:end -->`
}
