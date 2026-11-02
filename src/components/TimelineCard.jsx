import { useState } from 'react'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import { asset, formatDate } from '../lib/utils'

/** One news story: image, date and source, headline, my note, tags. Opens the source in a new tab. */
export default function TimelineCard({ item, headingLevel = 'h3' }) {
  const Heading = headingLevel
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-video overflow-hidden border-b border-line bg-surface-2">
        {item.image && !imageFailed ? (
          <img
            src={asset(item.image)}
            alt=""
            loading="lazy"
            decoding="async"
            width="800"
            height="450"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-accent/60">
            <Newspaper size={36} aria-hidden />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-lg bg-bg/85 px-2 py-1 font-mono text-[11px] font-medium text-fg shadow-sm backdrop-blur">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{item.source}</p>
        <Heading className="mt-2 font-display text-lg font-semibold leading-snug text-balance">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
          >
            {item.title}
          </a>
        </Heading>
        <p className="mt-3 text-sm leading-relaxed text-muted">{item.note}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <ul className="flex flex-1 flex-wrap gap-2" aria-label="Tags">
            {item.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
          <ArrowUpRight
            size={18}
            aria-hidden
            className="mb-1.5 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </article>
  )
}
