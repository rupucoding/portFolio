import { useState } from 'react'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { entries, tracks } from '../lib/learning'
import { profile } from '../data/profile'
import { cx } from '../lib/utils'
import LearningOverview from '../components/LearningOverview'
import LogEntryCard from '../components/LogEntryCard'
import Reveal from '../components/Reveal'

const PAGE_SIZE = 20
const ALL = 'All'

export default function Learning() {
  useDocumentHead({ title: 'Learning log', description: profile.learning.intro })
  const [track, setTrack] = useState(ALL)
  const [shown, setShown] = useState(PAGE_SIZE)

  const filtered = track === ALL ? entries : entries.filter((e) => e.tracks.includes(track))

  const choose = (name) => {
    setTrack(name)
    setShown(PAGE_SIZE)
  }

  return (
    <div className="container-page pb-20 pt-32 sm:pb-28 sm:pt-40">
      <header className="max-w-2xl">
        <p className="eyebrow">Learning log</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{profile.headings.learning}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{profile.learning.intro}</p>
      </header>

      {entries.length ? (
        <>
          <LearningOverview className="mt-12" />

          <div className="mt-14 max-w-3xl">
            {tracks.length > 1 && (
              <div role="group" aria-label="Filter by track" className="mb-8 flex flex-wrap gap-2">
                {[{ name: ALL, count: entries.length }, ...tracks].map(({ name, count }) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={track === name}
                    onClick={() => choose(name)}
                    className={cx(
                      'chip gap-1.5 px-3 py-1.5 text-sm transition hover:border-accent/40 hover:text-fg',
                      track === name && 'border-accent/40 bg-accent/10 text-accent hover:text-accent',
                    )}
                  >
                    {name}
                    <span className="font-mono text-xs opacity-70">{count}</span>
                  </button>
                ))}
              </div>
            )}

            <ol className="space-y-5 border-l border-line">
              {filtered.slice(0, shown).map((entry) => (
                <Reveal as="li" key={entry.slug} className="relative pl-5 sm:pl-8">
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-7 h-[9px] w-[9px] rounded-full border-2 border-accent bg-bg"
                  />
                  <LogEntryCard entry={entry} headingLevel="h2" />
                </Reveal>
              ))}
            </ol>

            {filtered.length > shown && (
              <button
                type="button"
                className="btn-secondary mt-8"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
              >
                Show older entries
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="mt-12 text-muted">No entries yet.</p>
      )}
    </div>
  )
}
