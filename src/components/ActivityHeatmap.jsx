import { activity, fromDayNumber, todayNumber } from '../lib/learning'
import { MONTHS, cx, formatDate } from '../lib/utils'

const CELL = 11
const STEP = 14 // cell + 3px gap
const LEFT = 28 // room for weekday labels
const TOP = 16 // room for month labels
const WEEKDAYS = [
  [0, 'Mon'],
  [2, 'Wed'],
  [4, 'Fri'],
]
// Intensity 0 (nothing) to 3 (busiest).
const LEVELS = ['fill-line/60', 'fill-accent/60', 'fill-accent/80', 'fill-accent']

const monthOf = (n) => Number(fromDayNumber(n).slice(5, 7)) - 1

// Defaults: the learning log. Level = entries that day (3 or more share the last).
const logLevel = (n) => Math.min(activity.get(n)?.length ?? 0, LEVELS.length - 1)
const logDetail = (n) => (activity.get(n) ?? []).map((e) => `\nDay ${e.day}: ${e.title}`).join('')
const logSummary = (active, weeks) =>
  `Activity: ${active} ${active === 1 ? 'day' : 'days'} logged in the last ${weeks} weeks`

/** One column per week, Monday at the top, ending with the current week. */
function Grid({ weeks, today, level, detail, summary, className }) {
  const thisMonday = today - ((today + 3) % 7) // 1 Jan 1970 (day 0) was a Thursday
  const start = thisMonday - (weeks - 1) * 7

  const cells = []
  const months = []
  let active = 0
  for (let w = 0; w < weeks; w++) {
    const monday = start + w * 7
    if (w === 0 || monthOf(monday) !== monthOf(monday - 7)) months.push({ w, label: MONTHS[monthOf(monday)] })
    for (let d = 0; d < 7 && monday + d <= today; d++) {
      const n = monday + d
      const l = level(n)
      if (l) active++
      cells.push({ n, w, d, l })
    }
  }
  // The first month label would collide with the next one when a month starts right after it.
  if (months.length > 1 && months[1].w - months[0].w < 3) months.shift()

  const width = LEFT + weeks * STEP - (STEP - CELL)
  const height = TOP + 7 * STEP - (STEP - CELL)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={summary(active, weeks)}
      className={cx('h-auto max-w-full', className)}
    >
      {months.map(({ w, label }) => (
        <text key={w} x={LEFT + w * STEP} y={10} className="fill-muted text-[10px]">
          {label}
        </text>
      ))}
      {WEEKDAYS.map(([d, label]) => (
        <text key={label} x={0} y={TOP + d * STEP + 9} className="fill-muted text-[10px]">
          {label}
        </text>
      ))}
      {cells.map(({ n, w, d, l }) => (
        <rect
          key={n}
          x={LEFT + w * STEP}
          y={TOP + d * STEP}
          width={CELL}
          height={CELL}
          rx={2}
          className={LEVELS[l]}
        >
          <title>
            {formatDate(fromDayNumber(n))}
            {detail(n)}
          </title>
        </rect>
      ))}
    </svg>
  )
}

/**
 * GitHub-style activity grid: about 4 months on phones, 6 months on larger screens.
 * Shows the learning log unless `level` (day number -> 0-3), `detail` (extra
 * tooltip text) and `summary` (screen-reader label) say otherwise.
 */
export default function ActivityHeatmap({
  className,
  level = logLevel,
  detail = logDetail,
  summary = logSummary,
}) {
  const today = todayNumber()
  const props = { today, level, detail, summary }
  return (
    <div className={className}>
      <Grid weeks={17} {...props} className="sm:hidden" />
      <Grid weeks={26} {...props} className="hidden sm:block" />
      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted" aria-hidden>
        Less
        {LEVELS.map((l) => (
          <svg key={l} width={CELL} height={CELL}>
            <rect width={CELL} height={CELL} rx={2} className={l} />
          </svg>
        ))}
        More
      </div>
    </div>
  )
}
