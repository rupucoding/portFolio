import { byDateDesc, numberDays, parseFrontmatter } from './frontmatter'

// Every .md file in src/content/learning is one entry. The file name is the URL slug.
// `?meta` (see vite.config.js) imports just the frontmatter; bodies load when opened.
const metas = import.meta.glob('../content/learning/*.md', {
  query: '?meta',
  import: 'default',
  eager: true,
})
const bodies = import.meta.glob('../content/learning/*.md', { query: '?raw', import: 'default' })

// "System design" and "System Design" count as the same track.
const trackNames = new Map()
const canonicalTrack = (name) => {
  const key = name.toLowerCase()
  if (!trackNames.has(key)) trackNames.set(key, name)
  return trackNames.get(key)
}

// Drafts show up while running `npm run dev`, never in the production build.
export const entries = numberDays(
  Object.values(metas)
    .filter((e) => import.meta.env.DEV || !e.draft)
    .map((e) => ({ ...e, tracks: e.tracks.map(canonicalTrack) })),
).sort(byDateDesc)

export const getEntry = (slug) => entries.find((e) => e.slug === slug)

/** The entry's Markdown body, fetched the first time it's needed. */
export async function loadEntryBody(slug) {
  const load = bodies[`../content/learning/${slug}.md`]
  return load ? parseFrontmatter(await load()).content : ''
}

const trackCounts = new Map()
for (const track of entries.flatMap((e) => e.tracks)) {
  trackCounts.set(track, (trackCounts.get(track) ?? 0) + 1)
}

/** Tracks in use, biggest first: [{ name: 'DSA', count: 12 }, ...] */
export const tracks = [...trackCounts]
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count)

const DAY_MS = 86_400_000

/** "2026-10-20" -> whole days since 1 Jan 1970 (NaN if it isn't a date). No timezone shifts. */
function toDayNumber(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return match ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / DAY_MS : NaN
}

/** Today's day number in the visitor's timezone. */
export function todayNumber() {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS
}

export const fromDayNumber = (n) => new Date(n * DAY_MS).toISOString().slice(0, 10)

/** Entries grouped by day number, for the heatmap and streaks. */
export const activity = new Map()
for (const entry of entries) {
  const n = toDayNumber(entry.date)
  if (!Number.isNaN(n)) activity.set(n, [...(activity.get(n) ?? []), entry])
}

/**
 * Current streak in days (still alive if today isn't logged yet but
 * yesterday was) and the longest streak so far.
 */
export function getStreaks(today = todayNumber()) {
  let current = 0
  for (let n = activity.has(today) ? today : today - 1; activity.has(n); n--) current++

  let longest = 0
  let run = 0
  let previous = NaN
  for (const n of [...activity.keys()].sort((a, b) => a - b)) {
    run = n === previous + 1 ? run + 1 : 1
    longest = Math.max(longest, run)
    previous = n
  }

  return { current, longest }
}

// A problem solved again on another day counts once. LeetCode-style links
// match on the problem itself, so ".../two-sum/" and ".../two-sum/description/" agree.
const problemKey = ({ title, link }) => {
  if (!link) return title.toLowerCase()
  const path = link.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '')
  return /^[^/]+\/problems\/[^/]+/.exec(path)?.[0] ?? path.replace(/\/+$/, '')
}

const solved = [...new Map(entries.flatMap((e) => e.problems).map((p) => [problemKey(p), p])).values()]

export const totals = {
  days: activity.size,
  problems: solved.length,
  byDifficulty: ['Easy', 'Medium', 'Hard']
    .map((level) => ({ level, count: solved.filter((p) => p.difficulty === level).length }))
    .filter((d) => d.count),
  topics: new Set(entries.flatMap((e) => e.topics).map((t) => t.toLowerCase())).size,
}
