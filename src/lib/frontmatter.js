/**
 * Tiny frontmatter parser for blog posts and learning-log entries (works in
 * the browser and in Node). Supports the subset of YAML they use:
 *
 *   title: "Some title"
 *   date: 2026-09-14
 *   tags: [Azure, Networking]     # or a "- item" list on the following lines
 *   draft: false
 */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const unquote = (s) => {
  const v = s.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

const parseValue = (raw) => {
  const v = raw.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map(unquote)
      .filter(Boolean)
  }
  return unquote(v)
}

export function parseFrontmatter(source) {
  const match = source.match(FRONTMATTER)
  if (!match) return { data: {}, content: source }

  const data = {}
  let listKey = null

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue

    const item = line.match(/^\s*-\s+(.*)$/)
    if (item && listKey) {
      data[listKey].push(unquote(item[1]))
      continue
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!pair) continue
    const [, key, value] = pair
    if (value.trim() === '') {
      data[key] = []
      listKey = key
    } else {
      data[key] = parseValue(value)
      listKey = null
    }
  }

  return { data, content: source.slice(match[0].length) }
}

// Technical posts with code read slower than prose, so count everything at 200 wpm.
const WORDS_PER_MINUTE = 200

export function readingTime(markdown) {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

const toList = (value) => (Array.isArray(value) ? value : value ? [value] : [])

/** Normalised post object shared by the app and the postbuild script. */
export function toPost(slug, source) {
  const { data, content } = parseFrontmatter(source)
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description || '',
    tags: toList(data.tags),
    draft: data.draft === true,
    readingTime: readingTime(content),
    content,
  }
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

// "https://leetcode.com/problems/two-sum/description/" -> "Two Sum"
const titleFromLink = (link) => {
  const path = link.replace(/[?#].*$/, '')
  const slug = /\/problems\/([^/]+)/.exec(path)?.[1] ?? path.split('/').filter(Boolean).pop()
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * One line of a log entry's `problems` list:
 *   "Two Sum | Easy | https://leetcode.com/problems/two-sum/"
 * The parts can come in any order, and the difficulty and link are optional.
 */
export function parseProblem(line) {
  const parts = String(line)
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)
  const link = parts.find((p) => /^https?:\/\//i.test(p)) || ''
  const difficulty = DIFFICULTIES.find((d) => parts.some((p) => p.toLowerCase() === d.toLowerCase())) || ''
  const title =
    parts.find((p) => p !== link && p.toLowerCase() !== difficulty.toLowerCase()) ||
    (link ? titleFromLink(link) : '')
  return { title, difficulty, link }
}

/** Normalised learning-log entry, without its body, shared by the app and the build. */
export function toEntry(slug, source) {
  const { data } = parseFrontmatter(source)
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description || '',
    tracks: toList(data.track),
    topics: toList(data.topics),
    problems: toList(data.problems).map(parseProblem).filter((p) => p.title),
    draft: data.draft === true,
  }
}

/**
 * Adds `day` to each entry: the first date with an entry is Day 1 and each
 * later date that has one counts up by one, so skipped days don't leave gaps.
 * Entries on the same date share a day.
 */
export function numberDays(entries) {
  const dates = [...new Set(entries.map((e) => e.date))].sort()
  const dayOf = new Map(dates.map((date, i) => [date, i + 1]))
  return entries.map((e) => ({ ...e, day: dayOf.get(e.date) }))
}

export const byDateDesc = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
