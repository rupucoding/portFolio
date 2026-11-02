import { useState } from 'react'
import { byMonth, stories, years } from '../lib/timeline'
import { cx } from '../lib/utils'
import Reveal from './Reveal'
import TimelineCard from './TimelineCard'

const ALL = 'all'

/** Month-by-month news timeline: a month marker on the rail, that month's stories beside it. */
export default function CloudTimeline() {
  const [year, setYear] = useState(ALL)
  if (!stories.length) return null

  const shown = year === ALL ? stories : stories.filter((s) => s.date.startsWith(String(year)))
  const filters = [
    { value: ALL, label: 'All', count: stories.length },
    ...years.map((y) => ({
      value: y,
      label: String(y),
      count: stories.filter((s) => s.date.startsWith(String(y))).length,
    })),
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by year">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setYear(f.value)}
            aria-pressed={year === f.value}
            className={cx(
              'chip gap-1.5 px-3.5 py-1.5 text-sm transition-colors',
              year === f.value
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'hover:border-accent/30 hover:text-fg',
            )}
          >
            {f.label}
            <span className="font-mono text-xs opacity-70">{f.count}</span>
          </button>
        ))}
      </div>

      <ol className="relative mt-10 space-y-12 border-l border-line pl-6 sm:pl-10">
        {byMonth(shown).map((group) => (
          <li key={group.key} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg shadow-[0_0_0_4px_rgb(var(--c-accent)/0.12)] sm:-left-[47px]"
            />
            <h3 className="flex items-baseline gap-2 font-display">
              <span className="text-2xl font-semibold">{group.month}</span>
              <span className="font-mono text-sm text-muted">{group.year}</span>
              <span className="ml-1 text-xs text-muted">
                · {group.items.length} {group.items.length === 1 ? 'story' : 'stories'}
              </span>
            </h3>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal as="li" key={item.url} delay={(i % 3) * 0.05}>
                  <TimelineCard item={item} headingLevel="h4" />
                </Reveal>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
