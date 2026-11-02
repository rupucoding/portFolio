import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { getIcon } from '../components/icons'
import Reveal from '../components/Reveal'
import { isExternal } from '../lib/utils'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const others = profile.social.filter((s) => s.icon !== 'mail')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="py-16 sm:py-20"
    >
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-70" />
          <div
            aria-hidden
            className="absolute left-1/2 top-0 -z-10 h-64 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
          />

          <p className="eyebrow">
            <span className="text-muted">08 / </span>Contact
          </p>
          <h2 id="contact-title" className="mt-3 text-3xl font-semibold sm:text-5xl">
            {profile.contact.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted text-balance">
            {profile.contact.blurb}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`mailto:${profile.email}`} className="btn-primary max-w-full px-5 py-3 text-base">
              <Mail size={18} aria-hidden />
              <span className="truncate">{profile.email}</span>
            </a>
            <button type="button" onClick={copyEmail} className="btn-secondary px-5 py-3">
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
          </div>
          {profile.altEmail && (
            <p className="mt-4 text-sm text-muted">
              or{' '}
              <a
                href={`mailto:${profile.altEmail}`}
                className="font-medium text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {profile.altEmail}
              </a>
            </p>
          )}
          <p className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {others.map(({ label, href, icon }) => {
              const Icon = getIcon(icon)
              return (
                <li key={label}>
                  <a
                    href={href}
                    className="btn-ghost"
                    {...(isExternal(href) && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon size={18} aria-hidden />
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
