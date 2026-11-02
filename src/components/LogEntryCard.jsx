import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { cx, formatDate } from '../lib/utils'

const DIFFICULTY_STYLES = {
  Easy: 'border-ok/30 bg-ok/10 text-ok',
  Medium: 'border-warn/30 bg-warn/10 text-warn',
  Hard: 'border-danger/30 bg-danger/10 text-danger',
}

export function DifficultyChip({ difficulty }) {
  return <span className={cx('chip shrink-0', DIFFICULTY_STYLES[difficulty])}>{difficulty}</span>
}

export function EntryMeta({ entry, className }) {
  const solved = entry.problems.length
  return (
    <p className={cx('flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted', className)}>
      <span className="font-semibold text-accent">Day {entry.day}</span>
      <span aria-hidden>·</span>
      <time dateTime={entry.date}>{formatDate(entry.date)}</time>
      {solved > 0 && (
        <>
          <span aria-hidden>·</span>
          <span>
            {solved} {solved === 1 ? 'problem' : 'problems'}
          </span>
        </>
      )}
      {entry.draft && (
        <span className="chip border-warn/30 bg-warn/10 py-0.5 text-warn">Draft</span>
      )}
    </p>
  )
}

/** Track chips (highlighted) followed by topic chips. */
export function EntryTags({ entry, className }) {
  if (!entry.tracks.length && !entry.topics.length) return null
  return (
    <ul className={cx('flex flex-wrap gap-2', className)} aria-label="Track and topics">
      {entry.tracks.map((track) => (
        <li key={`track-${track}`} className="chip border-accent/30 bg-accent/10 text-accent">
          {track}
        </li>
      ))}
      {entry.topics.map((topic) => (
        <li key={topic} className="chip">
          {topic}
        </li>
      ))}
    </ul>
  )
}

/** Whole card is clickable via the title link's stretched ::after. */
export default function LogEntryCard({ entry, headingLevel = 'h3' }) {
  const Heading = headingLevel
  return (
    <article className="card card-hover group relative flex h-full flex-col p-6">
      <EntryMeta entry={entry} />
      <Heading className="mt-3 text-lg font-semibold leading-snug text-balance sm:text-xl">
        <Link
          to={`/learning/${entry.slug}`}
          className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
        >
          {entry.title}
        </Link>
      </Heading>
      {entry.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{entry.description}</p>
      )}
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <EntryTags entry={entry} className="flex-1" />
        <ArrowRight
          size={18}
          aria-hidden
          className="mb-1.5 ml-auto shrink-0 text-accent transition-transform group-hover:translate-x-1"
        />
      </div>
    </article>
  )
}
