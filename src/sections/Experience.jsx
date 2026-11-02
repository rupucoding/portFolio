import { Briefcase, Check } from 'lucide-react'
import { profile } from '../data/profile'
import Reveal from '../components/Reveal'
import Section from '../components/Section'

function Progression({ steps }) {
  return (
    <ol className="relative space-y-6 border-l border-line pl-6">
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span
            aria-hidden
            className={
              i === 0
                ? 'absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-accent bg-accent shadow-[0_0_0_4px_rgb(var(--c-accent)/0.15)]'
                : 'absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 border-line bg-surface'
            }
          />
          <p className="font-display font-semibold">{step.title}</p>
          <p className="text-sm text-muted">{step.subtitle}</p>
          <p className="mt-1 font-mono text-xs text-muted">{step.period}</p>
        </li>
      ))}
    </ol>
  )
}

// Renders **wrapped** text in a highlight colour; everything else as plain text.
function Highlighted({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-accent">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export default function Experience() {
  return (
    <Section id="experience" index="02" eyebrow="Experience" title={profile.headings.experience}>
      <ol className="relative space-y-10 sm:border-l sm:border-line sm:pl-10">
        {profile.experience.map((job) => (
          <Reveal as="li" key={`${job.company}-${job.period}`} className="relative">
            <span
              aria-hidden
              className="absolute -left-[49px] top-8 hidden h-4 w-4 rounded-full border-2 border-accent bg-bg sm:block"
            />
            <article className="card p-6 sm:p-8">
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Briefcase size={22} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold sm:text-2xl">{job.role}</h3>
                    <p className="mt-1 text-muted">
                      {job.company}, {job.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.current && (
                    <span className="chip border-ok/30 bg-ok/10 text-ok">Current</span>
                  )}
                  <span className="chip font-mono">{job.period}</span>
                </div>
              </header>

              <div className="mt-8 grid gap-8 md:grid-cols-[230px_1fr] md:gap-10">
                {job.progression?.length > 0 && (
                  <div>
                    <h4 className="eyebrow mb-5">
                      {job.progression.length > 1 ? 'Role progression' : 'Role'}
                    </h4>
                    <Progression steps={job.progression} />
                  </div>
                )}

                <div>
                  <h4 className="eyebrow mb-5">Highlights</h4>
                  <ul className="space-y-3">
                    {job.highlights.map((item) => (
                      <li key={item} className="flex gap-3 leading-relaxed text-fg/85">
                        <Check size={18} aria-hidden className="mt-1 shrink-0 text-accent" />
                        <span>
                          <Highlighted text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  {job.stack?.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools and technologies">
                      {job.stack.map((s) => (
                        <li key={s} className="chip border-accent/30 bg-accent/10 text-accent">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
