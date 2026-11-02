import { Award, Trophy } from 'lucide-react'
import { profile } from '../data/profile'
import Reveal from '../components/Reveal'
import Section from '../components/Section'

export default function Certifications() {
  const { certifications, achievements } = profile

  return (
    <Section
      id="certifications"
      index="06"
      eyebrow="Certifications & Achievements"
      title={profile.headings.certifications}
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ul className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert, i) => (
            <Reveal as="li" key={cert.name} delay={(i % 2) * 0.06} className="card card-hover flex gap-4 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                <Award size={20} aria-hidden />
              </span>
              <div>
                <h3 className="font-sans font-semibold leading-snug tracking-normal">{cert.name}</h3>
                {(cert.issuer || cert.date) && (
                  <p className="mt-1 text-sm text-muted">
                    {[cert.issuer, cert.date].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-surface to-surface p-6 sm:p-8">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
          />
          <p className="eyebrow">Achievements</p>
          <ul className="relative mt-5 space-y-5">
            {achievements.map((a) => (
              <li key={a.title} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-solid text-white shadow-lg shadow-accent-solid/30">
                  <Trophy size={22} aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <p className="mt-0.5 text-muted">{a.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
