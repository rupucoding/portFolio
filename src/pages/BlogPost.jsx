import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { getPost, posts } from '../lib/posts'
import MarkdownContent from '../components/MarkdownContent'
import { PostMeta } from '../components/PostCard'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  useDocumentHead(post ? { title: post.title, description: post.description } : { title: 'Not found' })

  if (!post) return <NotFound />

  // posts are newest first
  const i = posts.indexOf(post)
  const newer = posts[i - 1]
  const older = posts[i + 1]

  return (
    <article className="container-page max-w-3xl pb-20 pt-28 sm:pb-28 sm:pt-36">
      <Link to="/blog" className="link-accent inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={16} aria-hidden /> All posts
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <PostMeta post={post} />
        <h1 className="mt-4 text-3xl font-bold leading-tight text-balance sm:text-5xl">{post.title}</h1>
        {post.description && (
          <p className="mt-5 text-lg leading-relaxed text-muted">{post.description}</p>
        )}
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <MarkdownContent className="mt-10">{post.content}</MarkdownContent>

      {(newer || older) && (
        <nav aria-label="More posts" className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {older ? (
            <Link to={`/blog/${older.slug}`} className="card card-hover group p-5">
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeft size={14} aria-hidden /> Older
              </span>
              <span className="mt-2 block font-display font-semibold group-hover:text-accent">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link to={`/blog/${newer.slug}`} className="card card-hover group p-5 sm:text-right">
              <span className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">
                Newer <ArrowRight size={14} aria-hidden />
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
