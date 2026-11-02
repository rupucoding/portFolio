import { useState } from 'react'

const THEME_COLORS = { dark: '#0a1120', light: '#f7f9fc' }

// index.html applies the saved theme before React loads; read it back from the DOM.
const readTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Storage blocked (private mode etc.): the theme still applies for this visit.
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return { theme, toggle }
}
