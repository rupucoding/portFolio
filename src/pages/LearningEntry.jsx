import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Link2, Linkedin } from 'lucide-react'
import { profile } from '../data/profile'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { entries, getEntry, loadEntryBody } from '../lib/learning'
import { DifficultyChip, EntryMeta, EntryTags } from '../components/LogEntryCard'
import MarkdownContent from '../components/MarkdownContent'
import NotFound from './NotFound'

/** The entry's Markdown body, or null while it loads. */
function useEntryBody(slug) {
  const [body, setBody] = useState({ slug: null, content: null })

  useEffect(() => {
    let current = true
    loadEntryBody(slug)
      .catch(() => 'This entry could not be loaded. Refresh the page to try again.')
      .then((content) => current && setBody({ slug, content }))
    return () => {
      current = false
    }
  }, [slug])

  return body.slug === slug ? body.content : null
}

function Problems({ problems }) {
  return (
    <section aria-labelledby="problems-title" className="card mt-10 p-5 sm:p-6">
      <h2 id="problems-title" className="text-lg font-semibold">
        Problems solved <span className="font-normal text-muted">({problems.length})</span>
      </h2>
      <ul className="mt-2 divide-y divide-line">
        {problems.map((p, i) => (
          <li key={`${i}-${p.title}`} className="flex items-center justify-between gap-4 py-3">
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-accent"
              >
                {p.title}
                <ArrowUpRight size={14} aria-hidden className="ml-1 inline align-[-1px] text-accent" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="font-medium">{p.title}</span>
            )}
            {p.difficulty && <DifficultyChip difficulty={p.difficulty} />}
          </li>
        ))}
      </ul>
    </section>
  )
}

// Shared links always point at the live site, even while previewing locally.
const liveUrl = (path) => `${profile.site.origin.replace(/\/$/, '')}${import.meta.env.BASE_URL}${path}`

function ShareLinks({ entry }) {
  const url = liveUrl(`learning/${entry.slug}/`)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Clipboard blocked (old browser, permissions): let them copy it by hand.
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
      <p className="mr-1 text-sm text-muted">Share Day {entry.day}</p>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary"
      >
        <Linkedin size={16} aria-hidden /> LinkedIn
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <button type="button" className="btn-secondary" onClick={copy}>
        {copied ? <Check size={16} aria-hidden /> : <Link2 size={16} aria-hidden />}
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied' : ''}
      </span>
    </div>
  )
}

export default function LearningEntry() {
  const { slug } = useParams()
  const entry = getEntry(slug)
  const body = useEntryBody(slug)
  useDocumentHead(
    entry
      ? { title: `Day ${entry.day}: ${entry.title}`, description: entry.description }
      : { title: 'Not found' },
  )

  if (!entry) return <NotFound />

  // entries are newest first
  const i = entries.indexOf(entry)
  const newer = entries[i - 1]
  const older = entries[i + 1]

  return (
    <article className="container-page max-w-3xl pb-20 pt-28 sm:pb-28 sm:pt-36">
      <Link to="/learning" className="link-accent inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={16} aria-hidden /> Learning log
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <EntryMeta entry={entry} />
        <h1 className="mt-4 text-3xl font-bold leading-tight text-balance sm:text-5xl">{entry.title}</h1>
        {entry.description && (
          <p className="mt-5 text-lg leading-relaxed text-muted">{entry.description}</p>
        )}
        <EntryTags entry={entry} className="mt-6" />
      </header>

      {entry.problems.length > 0 && <Problems problems={entry.problems} />}

      {body === null ? (
        <div className="mt-10 min-h-[40vh]" aria-busy="true" />
      ) : (
        <MarkdownContent className="mt-10">{body}</MarkdownContent>
      )}

      {!entry.draft && <ShareLinks entry={entry} />}

      {(newer || older) && (
        <nav aria-label="More entries" className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {older ? (
            <Link to={`/learning/${older.slug}`} className="card card-hover group p-5">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeft size={14} aria-hidden /> Day {older.day}
              </span>
              <span className="mt-2 block font-display font-semibold group-hover:text-accent">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link to={`/learning/${newer.slug}`} className="card card-hover group p-5 sm:text-right">
              <span className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">
                Day {newer.day} <ArrowRight size={14} aria-hidden />
              </span>
              <span className="mt-2 block font-display font-semibold group-hover:text-accent">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}
