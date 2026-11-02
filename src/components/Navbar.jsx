import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { entries } from '../lib/learning'
import { cx } from '../lib/utils'
import ResumeButton from './ResumeButton'
import SectionLink from './SectionLink'
import ThemeToggle from './ThemeToggle'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
]
// 'top' (the hero) has no link; observing it clears the highlight back at the top.
const SECTION_IDS = [
  'top',
  ...SECTIONS.map((s) => s.id),
  'learning',
  'certifications',
  'education',
  'blog',
  'contact',
]

// Pages with their own route. The learning log appears once it has an entry.
const PAGES = [
  entries.length > 0 && { to: '/learning', label: 'Learning' },
  { to: '/blog', label: 'Blog' },
].filter(Boolean)

// Tighter padding between md and lg so all the links fit next to the Resume button.
const linkBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-fg aria-[current=true]:text-accent md:px-2 lg:px-3'

export default function Navbar() {
  const { pathname, key } = useLocation()
  const isHome = pathname === '/'
  const active = useActiveSection(SECTION_IDS, isHome)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation or Escape.
  useEffect(() => setOpen(false), [key])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const sectionLinks = (mobile) =>
    SECTIONS.map(({ id, label }) => (
      <li key={id}>
        <SectionLink
          id={id}
          aria-current={isHome && active === id ? 'true' : undefined}
          className={cx(linkBase, 'text-muted', mobile && 'block py-3 text-base')}
        >
          {label}
        </SectionLink>
      </li>
    ))

  const pageLinks = (mobile) =>
    PAGES.map(({ to, label }) => (
      <li key={to}>
        <NavLink
          to={to}
          className={({ isActive }) =>
            cx(linkBase, isActive ? 'text-accent' : 'text-muted', mobile && 'block py-3 text-base')
          }
        >
          {label}
        </NavLink>
      </li>
    ))

  const contactLink = (mobile) => (
    <li>
      <SectionLink
        id="contact"
        aria-current={isHome && active === 'contact' ? 'true' : undefined}
        className={cx(linkBase, 'text-muted', mobile && 'block py-3 text-base')}
      >
        Contact
      </SectionLink>
    </li>
  )

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-line bg-bg/85 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-lg font-display text-lg font-bold"
          aria-label={`${profile.name}, home`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent transition group-hover:bg-accent/20">
            {profile.initials}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {sectionLinks(false)}
          {pageLinks(false)}
          {contactLink(false)}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ResumeButton label="Resume" variant="primary" className="hidden sm:inline-flex" />
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-line md:hidden">
        <ul className="container-page py-3">
          {sectionLinks(true)}
          {pageLinks(true)}
          {contactLink(true)}
          <li className="pt-3 sm:hidden">
            <ResumeButton variant="primary" className="w-full" />
          </li>
        </ul>
      </div>
    </header>
  )
}
