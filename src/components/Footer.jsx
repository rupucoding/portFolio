import { ArrowUp } from 'lucide-react'
import { profile } from '../data/profile'
import SectionLink from './SectionLink'
import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 text-sm text-muted sm:flex-row">
        <div className="text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {profile.name}. {profile.title}, {profile.location}.
          </p>
          <p className="mt-1">Built with React, Vite and Tailwind CSS.</p>
        </div>
        <div className="flex items-center gap-3">
          <SocialLinks />
          <SectionLink id="top" className="icon-btn" aria-label="Back to top" title="Back to top">
            <ArrowUp size={18} aria-hidden />
          </SectionLink>
        </div>
      </div>
    </footer>
  )
}
