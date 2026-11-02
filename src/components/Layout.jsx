import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Analytics from './Analytics'
import Footer from './Footer'
import Navbar from './Navbar'
import ScrollManager from './ScrollManager'

export default function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-accent-solid px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Analytics />
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
