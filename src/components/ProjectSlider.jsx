import { useCallback, useEffect, useRef, useState } from 'react'
import { m, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Github, Pause, Play, Trophy } from 'lucide-react'
import { cx, hasLink } from '../lib/utils'
import ProjectVisual from './ProjectVisual'

const INTERVAL = 6000
const SWIPE_THRESHOLD = 50
const EASE = [0.22, 1, 0.36, 1]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Slide({ project, position, total }) {
  return (
    <div className="card grid h-full overflow-hidden md:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow">
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {project.badge && (
            <span className="chip gap-1.5 border-accent/30 bg-accent/10 text-accent">
              <Trophy size={12} aria-hidden />
              {project.badge}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-balance sm:text-3xl">{project.title}</h3>
        <p className="mt-4 leading-relaxed text-muted">{project.description}</p>

        {project.modules && (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            <span className="font-medium text-fg">Modules: </span>
            {project.modules.join(', ')}
          </p>
        )}

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech">
          {project.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>

        {hasLink(project.github) && (
          <div className="mt-auto pt-7">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={16} aria-hidden />
              View on GitHub
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center border-t border-line bg-surface-2/50 p-6 sm:p-8 md:border-l md:border-t-0">
        <ProjectVisual project={project} />
      </div>
    </div>
  )
}

export default function ProjectSlider({ projects }) {
  const count = projects.length
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [hovered, setHovered] = useState(false)
  const [keyboardFocus, setKeyboardFocus] = useState(false)
  const rootRef = useRef(null)
  const touch = useRef(null)
  const inView = useInView(rootRef, { amount: 0.35 })

  const go = useCallback((delta) => setIndex((i) => (i + delta + count) % count), [count])

  const paused = hovered || keyboardFocus || !inView

  useEffect(() => {
    if (!playing || paused || count < 2) return undefined
    const timer = setTimeout(() => go(1), INTERVAL)
    return () => clearTimeout(timer)
  }, [index, playing, paused, go, count])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  if (!count) return null

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setKeyboardFocus(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setKeyboardFocus(false)}
      onKeyDown={onKeyDown}
    >
      {/* All slides share one grid cell, so the height never jumps between slides. */}
      <div
        className="grid touch-pan-y overflow-x-clip"
        aria-live={playing ? 'off' : 'polite'}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {projects.map((project, i) => {
          const active = i === index
          // Park inactive slides on the side they'll enter from (circularly).
          const ahead = (i - index + count) % count <= count / 2
          return (
            <m.div
              key={project.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${project.title}`}
              inert={active ? undefined : ''}
              className={cx('col-start-1 row-start-1', active ? 'z-10' : 'pointer-events-none z-0')}
              initial={false}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : ahead ? 48 : -48 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Slide project={project} position={i + 1} total={count} />
            </m.div>
          )
        })}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {projects.map((project, i) => (
              <button
                key={project.title}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show project ${i + 1}: ${project.title}`}
                aria-current={i === index ? 'true' : undefined}
                className="group grid h-8 place-items-center px-1"
              >
                <span
                  className={cx(
                    'block h-2 rounded-full transition-all duration-300',
                    i === index ? 'w-8 bg-accent' : 'w-2 bg-line group-hover:bg-muted',
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause auto-play' : 'Start auto-play'}
              title={playing ? 'Pause auto-play' : 'Start auto-play'}
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => go(-1)}
              aria-label="Previous project"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next project">
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
