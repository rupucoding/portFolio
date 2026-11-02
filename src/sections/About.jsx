import { profile } from '../data/profile'
import Reveal from '../components/Reveal'
import Section from '../components/Section'

export default function About() {
  const { paragraphs, stats } = profile.about

  return (
    <Section id="about" index="01" eyebrow="About" title={profile.headings.about}>
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>

        <ul className="grid grid-cols-2 gap-4 self-start">
          {stats.map((stat, i) => (
            <Reveal as="li" key={stat.label} delay={i * 0.06} className="card card-hover p-5 sm:p-6">
              <p className="font-display text-3xl font-bold text-accent sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm leading-snug text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
