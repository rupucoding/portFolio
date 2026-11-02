import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import leetcode from 'virtual:leetcode'
import { profile } from '../data/profile'
import { entries } from '../lib/learning'
import LeetCodeStats from '../components/LeetCodeStats'
import LogEntryCard from '../components/LogEntryCard'
import Reveal from '../components/Reveal'
import Section from '../components/Section'

const leetcodeLink = profile.social.find((s) => s.icon === 'leetcode')?.href

/** LeetCode stats, plus the latest learning-log entries once there are any. */
export default function LearningPreview() {
  const latest = entries.slice(0, 3)
  if (!leetcode && !latest.length) return null

  return (
    <Section
      id="learning"
      index="05"
      eyebrow="Problem solving"
      title={profile.headings.learning}
      action={
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {leetcode && leetcodeLink && (
            <a
              href={leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent inline-flex items-center gap-1.5"
            >
              LeetCode profile <ArrowUpRight size={16} aria-hidden />
            </a>
          )}
          {latest.length > 0 && (
            <Link to="/learning" className="link-accent inline-flex items-center gap-1.5">
              Full log <ArrowRight size={16} aria-hidden />
            </Link>
          )}
        </div>
      }
    >
      <Reveal>
        <LeetCodeStats />
      </Reveal>
      {latest.length > 0 && (
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {latest.map((entry, i) => (
            <Reveal as="li" key={entry.slug} delay={i * 0.06}>
              <LogEntryCard entry={entry} />
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  )
}
