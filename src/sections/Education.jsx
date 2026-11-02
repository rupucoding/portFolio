import { GraduationCap } from 'lucide-react'
import { profile } from '../data/profile'
import Reveal from '../components/Reveal'
import Section from '../components/Section'

export default function Education() {
  return (
    <Section id="education" index="07" eyebrow="Education" title={profile.headings.education}>
      <ul className="space-y-5">
        {profile.education.map((edu) => (
          <Reveal as="li" key={edu.degree} className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <GraduationCap size={22} aria-hidden />
                </span>
                <div>
                  <h3 className="text-xl font-semibold sm:text-2xl">{edu.degree}</h3>
                  <p className="mt-1 text-muted">
                    {edu.school}, {edu.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {edu.grade && (
                  <span className="chip border-accent/30 bg-accent/10 text-accent">{edu.grade}</span>
                )}
                <span className="chip font-mono">{edu.period}</span>
              </div>
            </div>
            {edu.coursework?.length > 0 && (
              <div className="mt-6 border-t border-line pt-6">
                <h4 className="eyebrow">Coursework</h4>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {edu.coursework.map((c) => (
                    <li key={c} className="chip">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
