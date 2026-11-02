import { Link } from 'react-router'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cx, isExternal } from '../lib/utils'

// Root-relative paths ("/blog/x.png", "/blog/other-post") get the site's base path.
const withBase = (src = '') =>
  src.startsWith('/') && !src.startsWith('//')
    ? `${import.meta.env.BASE_URL}${src.slice(1)}`
    : src

const markdownComponents = {
  a: ({ href = '', children, node: _node, ...props }) => {
    if (isExternal(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    }
    if (href.startsWith('/') && !href.startsWith('//')) {
      return (
        <Link to={href} {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
  img: ({ node: _node, alt = '', src, ...props }) => (
    <img alt={alt} src={withBase(src)} loading="lazy" decoding="async" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
}

/** Blog post and learning-log Markdown, styled with the site's typography. */
export default function MarkdownContent({ children, className }) {
  return (
    <div
      className={cx(
        'prose prose-site max-w-none sm:prose-lg prose-headings:font-display prose-headings:tracking-tight prose-pre:rounded-xl',
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {children}
      </Markdown>
    </div>
  )
}
