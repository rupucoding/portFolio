import { useEffect } from 'react'
import { profile } from '../data/profile'

const defaultTitle = `${profile.name} · ${profile.title}`

/** Keeps the tab title and meta description in sync with the current route. */
export function useDocumentHead({ title, description } = {}) {
  useEffect(() => {
    document.title = title ? `${title} · ${profile.name}` : defaultTitle
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description || profile.site.description)
  }, [title, description])
}
