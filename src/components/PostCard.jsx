import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '../lib/utils'

export function PostMeta({ post, className = '' }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted ${className}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span>{post.readingTime} min read</span>
      {post.draft && (
        <span className="chip border-warn/30 bg-warn/10 py-0.5 text-warn">Draft</span>
      )}
    </p>
  )
}

/** Whole card is clickable via the title link's stretched ::after. */
export default function PostCard({ post, headingLevel = 'h3' }) {
  const Heading = headingLevel
  return (
    <article className="card card-hover group relative flex h-full flex-col p-6">
      <PostMeta post={post} />
      <Heading className="mt-3 text-lg font-semibold leading-snug text-balance sm:text-xl">
        <Link
          to={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
        >
          {post.title}
        </Link>
      </Heading>
      {post.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{post.description}</p>
      )}
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <ul className="flex flex-1 flex-wrap gap-2" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
        <ArrowRight
          size={18}
          aria-hidden
          className="mb-1.5 shrink-0 text-accent transition-transform group-hover:translate-x-1"
        />
      </div>
    </article>
  )
}
