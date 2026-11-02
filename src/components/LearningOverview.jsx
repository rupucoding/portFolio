import { CalendarCheck, CircleCheck, Flame, Lightbulb } from 'lucide-react'
import { getStreaks, totals } from '../lib/learning'
import { cx } from '../lib/utils'
import ActivityHeatmap from './ActivityHeatmap'

/** Streak, totals and the activity heatmap for the whole log. */
export default function LearningOverview({ className }) {
  const { current, longest } = getStreaks()

  const stats = [
    // A broken streak would read as "0", so fall back to the best run so far.
    current > 0
      ? { icon: Flame, value: current, label: 'Day streak' }
      : { icon: Flame, value: longest, label: 'Longest streak' },
    { icon: CalendarCheck, value: totals.days, label: 'Days logged' },
    totals.problems > 0 && {
      icon: CircleCheck,
      value: totals.problems,
      label: 'Problems solved',
      detail: totals.byDifficulty.map(({ level, count }) => `${count} ${level.toLowerCase()}`).join(' · '),
    },
    totals.topics > 0 && { icon: Lightbulb, value: totals.topics, label: 'Topics covered' },
  ].filter(Boolean)

  return (
    <div
      className={cx(
        'card grid items-center gap-8 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-8',
        className,
      )}
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-2">
        {stats.map(({ icon: Icon, value, label, detail }) => (
          <div key={label}>
            <dt className="flex items-center gap-1.5 text-sm text-muted">
              <Icon size={15} aria-hidden className="shrink-0 text-accent" />
              {label}
            </dt>
            <dd className="mt-1.5 font-display text-3xl font-bold sm:text-4xl">{value}</dd>
            {detail && <dd className="mt-1 text-xs text-muted">{detail}</dd>}
          </div>
        ))}
      </dl>
      <ActivityHeatmap />
    </div>
  )
}
