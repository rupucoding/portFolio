import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { profile } from './src/data/profile.js'
import { toEntry } from './src/lib/frontmatter.js'
import { escapeHtml, getBase, seoTags } from './scripts/site.js'
import { fetchLeetCode, leetcodeUsername } from './scripts/leetcode.js'

const noscript = `<noscript>
      <p style="padding: 1rem; font-family: system-ui, sans-serif">
        This site needs JavaScript to render. You can reach ${escapeHtml(profile.name)} at
        <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>.
      </p>
    </noscript>`

// Injects title, meta description, Open Graph and JSON-LD from profile.js.
// GoatCounter visitor counting: production builds only, once profile.analytics.goatcounter is set.
const goatcounter = profile.analytics?.goatcounter
const analyticsTag = goatcounter
  ? `\n    <script data-goatcounter="https://${escapeHtml(goatcounter)}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`
  : ''

function seoPlugin() {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: (html, ctx) =>
      html
        .replace('<!-- seo -->', seoTags() + (ctx.server ? '' : analyticsTag))
        .replace('<!-- noscript -->', noscript),
  }
}

// React Router links to the home page without a trailing slash (e.g.
// "/portfolio#projects"). GitHub Pages redirects that to "/portfolio/", but
// Vite's dev and preview servers show an error page instead, so reloading
// after clicking a nav link broke locally. Redirect the same way here.
function baseRedirectPlugin(base) {
  const bare = base.slice(0, -1)
  const redirect = (req, res, next) => {
    const [pathname, query] = req.url.split('?')
    if (!bare || pathname !== bare) return next()
    res.writeHead(302, { Location: base + (query ? `?${query}` : '') })
    res.end()
  }
  return {
    name: 'portfolio-base-redirect',
    configureServer(server) {
      server.middlewares.use(redirect)
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect)
    },
  }
}

// `entry.md?meta` imports only a learning-log entry's frontmatter, so the log
// can grow to hundreds of days without every entry's text landing in the main
// bundle. The entry page loads the body itself when it's opened.
function markdownMetaPlugin() {
  return {
    name: 'portfolio-markdown-meta',
    load(id) {
      const [file, query] = id.split('?')
      if (query !== 'meta' || !file.endsWith('.md')) return null
      const entry = toEntry(path.basename(file, '.md'), fs.readFileSync(file, 'utf8'))
      return `export default ${JSON.stringify(entry)}`
    },
  }
}

// `import leetcode from 'virtual:leetcode'` gives the LeetCode stats fetched
// at build time (or null). Fetched once per dev-server start / build.
function leetcodePlugin() {
  const id = 'virtual:leetcode'
  const link = profile.social.find((s) => s.icon === 'leetcode')?.href
  let data
  return {
    name: 'portfolio-leetcode',
    resolveId: (source) => (source === id ? `\0${id}` : null),
    async load(resolved) {
      if (resolved !== `\0${id}`) return null
      data ??= fetchLeetCode(leetcodeUsername(link))
      return `export default ${JSON.stringify(await data)}`
    },
  }
}

// If photo.jpg isn't in /public yet, the site shows an "RS" monogram instead
// of requesting a missing file. Restart the dev server after adding the photo.
const hasPhoto = fs.existsSync(path.resolve('public', profile.photo.src))

const base = getBase()

export default defineConfig({
  base,
  plugins: [react(), seoPlugin(), baseRedirectPlugin(base), markdownMetaPlugin(), leetcodePlugin()],
  define: {
    __HAS_PHOTO__: JSON.stringify(hasPhoto),
  },
})
