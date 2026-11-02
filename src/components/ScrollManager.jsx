import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scrolls to #hash targets (also when arriving from another route) and
 * resets scroll on normal page navigation. Moves focus to the target
 * section so keyboard and screen reader users land in the right place.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (!hash) {
      if (navigationType !== 'POP') window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return undefined
    }

    let frame
    let attempts = 0
    const id = decodeURIComponent(hash.slice(1))

    const scrollToTarget = () => {
      const el = document.getElementById(id)
      if (!el) {
        // Target may not be rendered yet (route just changed).
        if (attempts++ < 30) frame = requestAnimationFrame(scrollToTarget)
        return
      }
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
      if (el.tabIndex === -1) el.focus({ preventScroll: true })
    }

    scrollToTarget()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key, navigationType])

  return null
}
