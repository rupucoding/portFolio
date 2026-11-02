import { useDocumentHead } from '../hooks/useDocumentHead'
import { posts } from '../lib/posts'
import { stories } from '../lib/timeline'
import { profile } from '../data/profile'
import CloudTimeline from '../components/CloudTimeline'
import PostCard from '../components/PostCard'
import Reveal from '../components/Reveal'

export default function Blog() {
  useDocumentHead({ title: 'Blog', description: profile.blog.intro })

  return (
    <div className="container-page pb-20 pt-32 sm:pb-28 sm:pt-40">
      <header className="max-w-2xl">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{profile.headings.blog}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{profile.blog.intro}</p>
      </header>

      {posts.length ? (
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={(i % 2) * 0.06}>
              <PostCard post={post} headingLevel="h2" />
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-muted">No posts yet.</p>
      )}

      {stories.length > 0 && (
        <section
          id="timeline"
          tabIndex={-1}
          aria-labelledby="timeline-title"
          className="mt-20 scroll-mt-28 sm:mt-28"
        >
          <header className="mb-8 max-w-2xl">
            <p className="eyebrow">Timeline</p>
            <h2 id="timeline-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
              {profile.blog.timelineHeading}
            </h2>
            <p className="mt-4 leading-relaxed text-muted">{profile.blog.timelineIntro}</p>
          </header>
          <CloudTimeline />
        </section>
      )}
    </div>
  )
}
