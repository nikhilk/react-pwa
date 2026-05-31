// ThemeProvider.tsx
// Resolves theme setting, applies dark class, listens for OS changes
//

import * as React from 'react'
import { useAppSettings, type Theme } from '../App.tsx'

type ThemeContextInterface = {
  theme: Theme
  darkTheme: boolean
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextInterface>({
  theme: 'auto',
  darkTheme: false,
  toggleTheme: () => {},
})

function resolveTheme(theme: Theme): boolean {
  if (theme === 'dark') {
    return true
  }
  if (theme === 'light') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)

  // Update the meta tag to change the status header background
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    // Ensure the transition is disabled, otherwise retrieving the computed
    // style background quite likely returns an interpolated/non-final value.
    const transition = document.body.style.transition
    document.body.style.transition = 'none'

    try {
      // Use canvas to convert CSS color to hex
      const ctx = document.createElement('canvas').getContext('2d')!
      ctx.fillStyle = getComputedStyle(document.body).backgroundColor

      meta.setAttribute('content', ctx.fillStyle)
    }
    finally {
      document.body.style.transition = transition
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, updateSettings] = useAppSettings()
  const darkTheme = resolveTheme(settings.theme)

  React.useEffect(() => {
    applyTheme(darkTheme)
  }, [darkTheme])

  React.useEffect(() => {
    if (settings.theme !== 'auto') {
      return
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [settings.theme])

  const toggleTheme = React.useCallback(() => {
    updateSettings({ theme: darkTheme ? 'light' : 'dark' })
  }, [darkTheme, updateSettings])

  return (
    <ThemeContext value={{ theme: settings.theme, darkTheme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
