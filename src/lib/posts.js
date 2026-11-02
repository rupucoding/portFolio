import { byDateDesc, toPost } from './frontmatter'

// Every .md file in src/content/blog becomes a post. The file name is the URL slug.
const files = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const all = Object.entries(files).map(([path, source]) =>
  toPost(path.split('/').pop().replace(/\.md$/, ''), source),
)

// Drafts show up while running `npm run dev`, never in the production build.
export const posts = all.filter((p) => import.meta.env.DEV || !p.draft).sort(byDateDesc)

export const getPost = (slug) => posts.find((p) => p.slug === slug)
