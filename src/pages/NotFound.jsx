import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useDocumentHead } from '../hooks/useDocumentHead'

export default function NotFound() {
  useDocumentHead({ title: 'Page not found' })
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-muted">
        That route doesn&apos;t resolve to anything here. It may have moved, or the link has a typo.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft size={16} aria-hidden /> Back home
      </Link>
    </div>
  )
}
