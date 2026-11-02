/**
 * Runs after `vite build`:
 *  - writes a real HTML file for /blog/, /learning/, every post and every
 *    learning-log entry, each with its own title, description and Open Graph
 *    tags (GitHub Pages serves them with 200)
 *  - writes 404.html so any other deep link still boots the app
 *  - writes sitemap.xml and robots.txt
 */
import fs from 'node:fs'
import path from 'node:path'
import { profile } from '../src/data/profile.js'
import { byDateDesc, numberDays, toEntry, toPost } from '../src/lib/frontmatter.js'
import { getSiteUrl, seoTags } from './site.js'

const dist = path.resolve('dist')
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

const indexHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!SEO_BLOCK.test(indexHtml)) throw new Error('SEO markers missing from dist/index.html')

const withSeo = (options) => indexHtml.replace(SEO_BLOCK, seoTags({ jsonLd: false, ...options }))

const write = (relative, contents) => {
  const file = path.join(dist, relative)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents)
}

/** Every published .md file in a content folder, normalised with toPost / toEntry. */
const readContent = (folder, normalise) => {
  const dir = path.resolve('src/content', folder)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => normalise(f.replace(/\.md$/, ''), fs.readFileSync(path.join(dir, f), 'utf8')))
    .filter((item) => !item.draft)
}

const posts = readContent('blog', toPost).sort(byDateDesc)
const entries = numberDays(readContent('learning', toEntry)).sort(byDateDesc)

// Route pages
write(
  'blog/index.html',
  withSeo({ title: `Blog · ${profile.name}`, description: profile.blog.intro, path: 'blog/' }),
)

for (const post of posts) {
  write(
    `blog/${post.slug}/index.html`,
    withSeo({
      title: `${post.title} · ${profile.name}`,
      description: post.description || profile.blog.intro,
      path: `blog/${post.slug}/`,
      type: 'article',
      publishedTime: post.date,
    }),
  )
}

// The log only gets pages once it has a published entry (the nav link appears then too).
if (entries.length) {
  write(
    'learning/index.html',
    withSeo({
      title: `Learning log · ${profile.name}`,
      description: profile.learning.intro,
      path: 'learning/',
    }),
  )
}

for (const entry of entries) {
  write(
    `learning/${entry.slug}/index.html`,
    withSeo({
      title: `Day ${entry.day}: ${entry.title} · ${profile.name}`,
      description: entry.description || profile.learning.intro,
      path: `learning/${entry.slug}/`,
      type: 'article',
      publishedTime: entry.date,
    }),
  )
}

write(
  '404.html',
  withSeo({ title: `Page not found · ${profile.name}` }).replace(
    '<meta charset="UTF-8" />',
    '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex" />',
  ),
)

// Sitemap + robots
const siteUrl = getSiteUrl()
const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: siteUrl, lastmod: today },
  { loc: `${siteUrl}blog/`, lastmod: posts[0]?.date || today },
  ...posts.map((p) => ({ loc: `${siteUrl}blog/${p.slug}/`, lastmod: p.date || today })),
  ...(entries.length ? [{ loc: `${siteUrl}learning/`, lastmod: entries[0].date || today }] : []),
  ...entries.map((e) => ({ loc: `${siteUrl}learning/${e.slug}/`, lastmod: e.date || today })),
]

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`,
)

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`)

// Friendly reminders for files that live in /public
for (const [label, file] of [
  ['Photo', profile.photo.src],
  ['Resume', profile.resume.src],
]) {
  if (!fs.existsSync(path.resolve('public', file))) {
    console.warn(`\n⚠  ${label} not found: public/${file} (see README > Assets)`)
  }
}

console.log(
  `\n✓ postbuild: ${posts.length} posts, ${entries.length} learning-log entries, sitemap with ${urls.length} URLs → ${siteUrl}`,
)
