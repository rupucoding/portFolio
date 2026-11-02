import { timeline } from '../data/timeline'
import { MONTHS } from './utils'

/** All stories, newest first. */
export const stories = [...timeline].sort((a, b) => b.date.localeCompare(a.date))

/** Years that have stories, newest first: [2026, 2025] */
export const years = [...new Set(stories.map((s) => Number(s.date.slice(0, 4))))]

/** Stories grouped by month, newest first: [{ key: '2026-10', month: 'Oct', year: 2026, items }] */
export function byMonth(items = stories) {
  const groups = new Map()
  for (const item of items) {
    const key = item.date.slice(0, 7)
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        month: MONTHS[Number(key.slice(5, 7)) - 1],
        year: Number(key.slice(0, 4)),
        items: [],
      })
    }
    groups.get(key).items.push(item)
  }
  return [...groups.values()]
}
