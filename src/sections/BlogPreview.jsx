import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { profile } from '../data/profile'
import { posts } from '../lib/posts'
import { stories } from '../lib/timeline'
import PostCard from '../components/PostCard'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import TimelineCard from '../components/TimelineCard'

export default function BlogPreview() {
  const latest = posts.slice(0, 3)
  const news = stories.slice(0, 3)
  if (!latest.length && !news.length) return null

  return (
    <Section
      id="blog"
      index="08"
      eyebrow="Blog"
      title={profile.headings.blog}
      action={
        <Link to="/blog" className="link-accent inline-flex items-center gap-1.5 text-sm">
          All posts <ArrowRight size={16} aria-hidden />
        </Link>
      }
    >
      {latest.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-3">
          {latest.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={i * 0.06}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      )}

      {news.length > 0 && (
        <div className={latest.length ? 'mt-14' : undefined}>
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold sm:text-2xl">{profile.blog.timelineHeading}</h3>
              <p className="mt-1 text-sm text-muted">
                {stories.length} stories since {stories.at(-1).date.slice(0, 4)}, month by month
              </p>
            </div>
            <Link to="/blog#timeline" className="link-accent inline-flex items-center gap-1.5 text-sm">
              Full timeline <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
          <ul className="grid gap-5 md:grid-cols-3">
            {news.map((item, i) => (
              <Reveal as="li" key={item.url} delay={i * 0.06}>
                <TimelineCard item={item} headingLevel="h4" />
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
