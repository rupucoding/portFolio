import { useEffect, useState } from 'react'

/** Returns the id of the section currently in the middle of the viewport. */
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!enabled) {
      setActive('')
      return undefined
    }

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // A thin band across the middle of the screen decides the active section.
      { rootMargin: '-45% 0px -50% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, enabled])

  return active
}
