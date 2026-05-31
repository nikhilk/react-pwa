// Nav.tsx
// Navigation bar with dark mode toggle
//

import * as Router from 'react-router-dom'
import * as Icons from 'lucide-react'
import { useTheme } from './ThemeProvider.tsx'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/settings', label: 'Settings' },
]

export function Nav() {
  const { darkTheme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-10 backdrop-blur
      bg-white/80 dark:bg-gray-950/80
      border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-3xl mx-auto px-4 h-14
        flex items-center justify-between
        pt-[env(safe-area-inset-top)]"  // pt so backdrop-blur extends behind iOS statusbar
      >
        <div className="flex items-center gap-3 sm:gap-6">
          <Router.NavLink
            to="/"
            aria-label="Home"
            className="text-blue-600 dark:text-blue-400"
          >
            <Icons.Sparkles size={20} />
          </Router.NavLink>
          <div className="flex gap-2 sm:gap-4">
            {navLinks.map((link) => (
              <Router.NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  'text-sm font-medium transition-colors ' +
                  (isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-900' +
                      ' dark:text-gray-400 dark:hover:text-gray-100')
                }
              >
                {link.label}
              </Router.NavLink>
            ))}
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-md text-gray-500
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition-colors"
        >
          {darkTheme ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
        </button>
      </div>
    </nav>
  )
}
