import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * GoatCounter counts the first page load itself; this reports the in-app
 * navigations after it. Does nothing unless the GoatCounter script is on the
 * page (production builds with profile.analytics.goatcounter set).
 */
export default function Analytics() {
  const { pathname } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.goatcounter?.count?.({
      path: import.meta.env.BASE_URL.replace(/\/$/, '') + pathname,
    })
  }, [pathname])

  return null
}
