import { Activity, ArrowRight, Cloud, Mail, MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import Avatar from '../components/Avatar'
import ResumeButton from '../components/ResumeButton'
import SectionLink from '../components/SectionLink'
import SkillsBackground from '../components/SkillsBackground'
import SocialLinks from '../components/SocialLinks'

export default function Hero() {
  const slaStat = profile.about.stats.find((s) => s.value.includes('%') && /SLA/i.test(s.label))

  return (
    <section
      id="top"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-36"
    >
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <SkillsBackground
        keywords={profile.heroKeywords}
        className="absolute inset-0 -z-10 overflow-hidden text-accent/[0.07] [mask-image:radial-gradient(ellipse_65%_85%_at_78%_45%,#000_20%,transparent_80%)]"
      />
      <div
        aria-hidden
        className="absolute -right-32 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <p className="chip gap-1.5">
            <MapPin size={14} aria-hidden className="text-accent" />
            {profile.location}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            {profile.name}
          </h1>
          <p className="mt-4 font-display text-xl font-medium text-accent sm:text-2xl">
            {profile.title}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-balance">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <SectionLink id="projects" className="btn-primary">
              View Projects
              <ArrowRight size={16} aria-hidden />
            </SectionLink>
            <ResumeButton />
            <SectionLink id="contact" className="btn-ghost">
              <Mail size={16} aria-hidden />
              Contact
            </SectionLink>
          </div>

          <SocialLinks className="mt-9" />
        </div>

        <div className="relative order-first flex justify-center lg:order-none lg:justify-end">
          <div className="relative">
            <Avatar />
            <div className="absolute -left-4 top-6 hidden items-center gap-2 rounded-xl border border-line bg-surface/90 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur sm:flex lg:-left-10">
              <Cloud size={14} aria-hidden className="text-accent" />
              Azure networking
            </div>
            {slaStat && (
              <div className="absolute -right-2 bottom-8 hidden items-center gap-2 rounded-xl border border-line bg-surface/90 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur sm:flex lg:-right-6">
                <Activity size={14} aria-hidden className="text-ok" />
                {slaStat.value} SLA
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
