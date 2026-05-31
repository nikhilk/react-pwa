// App.tsx
// Root application shell with routing and app settings
//

import * as Router from 'react-router-dom'
import { createStore } from './utils/store.ts'
import { Nav } from './components/Nav.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { Home } from './pages/Home.tsx'
import { Settings } from './pages/Settings.tsx'

export type Theme = 'auto' | 'light' | 'dark'
export type ButtonAction = 'celebrate' | 'wave' | 'inspire' | 'paint'

type AppSettings = {
  theme: Theme
  buttonAction: ButtonAction
}

const { useStore } = createStore<AppSettings>(
  'app-state',
  { theme: 'auto', buttonAction: 'celebrate' },
)

export { useStore as useAppSettings }

export function App() {
  return (
    <Router.HashRouter>
      <ThemeProvider>
        <div className="h-dvh flex flex-col overflow-hidden">
          <Nav />
          <main className="flex-1">
            <Router.Routes>
              <Router.Route path="/" element={<Home />} />
              <Router.Route path="/settings" element={<Settings />} />
            </Router.Routes>
          </main>
          <footer
            className="text-center text-sm font-mono text-gray-500
              dark:text-gray-400 bg-gray-50 dark:bg-gray-900
              py-4 border-t border-gray-200 dark:border-gray-800"
          >
            Copyright &copy; 2026
          </footer>
        </div>
      </ThemeProvider>
    </Router.HashRouter>
  )
}
