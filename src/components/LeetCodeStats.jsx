import { CalendarCheck, CircleCheck, Flame, Send } from 'lucide-react'
import leetcode from 'virtual:leetcode'
import { todayNumber } from '../lib/learning'
import { cx, formatDate } from '../lib/utils'
import ActivityHeatmap from './ActivityHeatmap'

const DIFFICULTY_COLORS = { Easy: 'bg-ok', Medium: 'bg-warn', Hard: 'bg-danger' }

const submissions = new Map(leetcode?.calendar ?? [])

// Busier days get darker squares: 1-2, 3-5, 6+ submissions.
const level = (n) => {
  const count = submissions.get(n) ?? 0
  return count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : 3
}
const detail = (n) => {
  const count = submissions.get(n)
  return count ? `\n${count} ${count === 1 ? 'submission' : 'submissions'}` : ''
}
const summary = (active, weeks) =>
  `LeetCode activity: submissions on ${active} ${active === 1 ? 'day' : 'days'} in the last ${weeks} weeks`

function pastYear() {
  const from = todayNumber() - 365
  const days = (leetcode?.calendar ?? []).filter(([n]) => n > from)
  let longest = 0
  let run = 0
  let previous = NaN
  for (const [n] of days) {
    run = n === previous + 1 ? run + 1 : 1
    longest = Math.max(longest, run)
    previous = n
  }
  return {
    activeDays: days.length,
    submissions: days.reduce((sum, [, count]) => sum + count, 0),
    longest,
  }
}

/** Solved counts, past-year activity and a submission heatmap, fetched from LeetCode at build time. */
export default function LeetCodeStats({ className }) {
  if (!leetcode) return null
  const year = pastYear()

  const stats = [
    { icon: CircleCheck, value: leetcode.solved, label: 'Problems solved' },
    { icon: CalendarCheck, value: year.activeDays, label: 'Active days' },
    { icon: Flame, value: year.longest, label: 'Longest streak' },
    { icon: Send, value: year.submissions, label: 'Submissions' },
  ]

  return (
    <div className={cx('card p-5 sm:p-6 lg:p-8', className)}>
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
        <div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-2">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <dt className="flex items-center gap-1.5 text-sm text-muted">
                  <Icon size={15} aria-hidden className="shrink-0 text-accent" />
                  {label}
                </dt>
                <dd className="mt-1.5 font-display text-3xl font-bold sm:text-4xl">{value}</dd>
              </div>
            ))}
          </dl>

          {leetcode.solved > 0 && (
            <div className="mt-7">
              <div className="flex h-2 overflow-hidden rounded-full bg-line/60" aria-hidden>
                {leetcode.byDifficulty.map(({ level: name, solved }) => (
                  <span
                    key={name}
                    className={DIFFICULTY_COLORS[name]}
                    style={{ width: `${(solved / leetcode.solved) * 100}%` }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {leetcode.byDifficulty.map(({ level: name, solved }) => (
                  <li key={name} className="flex items-center gap-1.5">
                    <span aria-hidden className={cx('h-2 w-2 rounded-full', DIFFICULTY_COLORS[name])} />
                    <span className="font-semibold">{solved}</span>
                    <span className="text-muted">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <ActivityHeatmap level={level} detail={detail} summary={summary} />
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
        Activity over the past year, from my LeetCode profile. Updated{' '}
        {formatDate(leetcode.fetchedAt.slice(0, 10))}.
      </p>
    </div>
  )
}
