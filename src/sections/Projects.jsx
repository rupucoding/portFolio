import { ArrowUpRight, FolderGit2, Github } from 'lucide-react'
import { profile } from '../data/profile'
import ProjectSlider from '../components/ProjectSlider'
import Reveal from '../components/Reveal'
import Section from '../components/Section'
import { hasLink } from '../lib/utils'

function ProjectCard({ project }) {
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
          <FolderGit2 size={20} aria-hidden />
        </span>
        {project.status && (
          <span className="chip border-warn/30 bg-warn/10 text-warn">{project.status}</span>
        )}
      </div>
      <h4 className="mt-5 text-lg font-semibold">{project.title}</h4>
      {project.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
      )}
      {project.tags?.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech">
          {project.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}
      {(hasLink(project.link) || hasLink(project.github)) && (
        <div className="mt-auto flex flex-wrap gap-4 pt-5 text-sm">
          {hasLink(project.link) && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent inline-flex items-center gap-1"
            >
              Live site <ArrowUpRight size={14} aria-hidden />
              <span className="sr-only">for {project.title} (opens in a new tab)</span>
            </a>
          )}
          {hasLink(project.github) && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent inline-flex items-center gap-1"
            >
              <Github size={14} aria-hidden /> Code
              <span className="sr-only">for {project.title} (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function Projects() {
  const { featured, other } = profile.projects

  return (
    <Section id="projects" index="04" eyebrow="Projects" title={profile.headings.projects}>
      <Reveal>
        <ProjectSlider projects={featured} />
      </Reveal>

      {other.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <h3 className="text-xl font-semibold">Other projects</h3>
          </Reveal>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((project, i) => (
              <Reveal as="li" key={project.title} delay={(i % 3) * 0.06}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
