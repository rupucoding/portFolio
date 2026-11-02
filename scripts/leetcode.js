/**
 * Fetches public LeetCode stats when the site builds. LeetCode's API refuses
 * requests from browsers, so the numbers are baked into the build and kept
 * fresh by the daily scheduled deploy (.github/workflows/deploy.yml).
 *
 * Returns null on any failure; the section then hides instead of breaking.
 */
const QUERY = `query ($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { submissionCalendar }
  }
  allQuestionsCount { difficulty count }
}`

const DAY_S = 86_400

/** The username from a LeetCode profile link, e.g. https://leetcode.com/u/name/ -> "name". */
export const leetcodeUsername = (href = '') =>
  /leetcode\.com\/(?:u\/)?([^/?#]+)/i.exec(href)?.[1] ?? null

export async function fetchLeetCode(username) {
  if (!username) return null
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { data } = await res.json()
    const user = data?.matchedUser
    if (!user) throw new Error(`no LeetCode user "${username}"`)

    const solvedBy = Object.fromEntries(
      user.submitStatsGlobal.acSubmissionNum.map((d) => [d.difficulty, d.count]),
    )
    const totalBy = Object.fromEntries(data.allQuestionsCount.map((d) => [d.difficulty, d.count]))

    // { "<unix seconds at UTC midnight>": submissions } -> [[day number, submissions], ...]
    const raw = JSON.parse(user.userCalendar?.submissionCalendar || '{}')
    const calendar = Object.entries(raw)
      .map(([ts, count]) => [Math.floor(Number(ts) / DAY_S), count])
      .filter(([n, count]) => Number.isFinite(n) && count > 0)
      .sort((a, b) => a[0] - b[0])

    return {
      username: user.username,
      solved: solvedBy.All ?? 0,
      byDifficulty: ['Easy', 'Medium', 'Hard'].map((level) => ({
        level,
        solved: solvedBy[level] ?? 0,
        total: totalBy[level] ?? 0,
      })),
      calendar,
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.warn(`[leetcode] Couldn't fetch stats (${err.message}); the LeetCode section will be hidden.`)
    return null
  }
}
