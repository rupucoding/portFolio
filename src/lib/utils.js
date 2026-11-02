/** URL for a file in /public, respecting the GitHub Pages base path. */
export const asset = (file) => `${import.meta.env.BASE_URL}${encodeURI(file)}`

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-09-14" -> "14 Sep 2026". Parsed by hand so the day never shifts by timezone. */
export function formatDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  if (!match) return iso || ''
  const [, year, month, day] = match
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`
}

export const isExternal = (href = '') => /^https?:\/\//.test(href)

/** Treat '#' or empty as "link not added yet". */
export const hasLink = (href) => Boolean(href) && href !== '#'

export const cx = (...classes) => classes.filter(Boolean).join(' ')
