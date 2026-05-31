// Settings.tsx
// Settings page for choosing the home button action, plus about section
//

import { useAppSettings, type ButtonAction } from '../App.tsx'

const actionOptions: {
  value: ButtonAction
  label: string
  description: string
}[] = [
  {
    value: 'celebrate',
    label: 'Celebrate',
    description: 'A burst of confetti',
  },
  {
    value: 'wave',
    label: 'Wave',
    description: 'A friendly greeting in a random language',
  },
  {
    value: 'inspire',
    label: 'Inspire',
    description: 'A random inspirational quote',
  },
  {
    value: 'paint',
    label: 'Paint',
    description: 'A random photo from the web',
  },
]

export function Settings() {
  const [settings, updateSettings] = useAppSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Settings
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
        Choose what the button on the home page does.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {actionOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => updateSettings({
              buttonAction: option.value,
            })}
            className={
              'text-left p-4 rounded-lg border-2 transition-all '
              + (settings.buttonAction === option.value
                ? 'border-blue-600 bg-blue-50'
                  + ' dark:bg-blue-950/30 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-800'
                  + ' hover:border-gray-300'
                  + ' dark:hover:border-gray-700')
            }
          >
            <div className="font-semibold">{option.label}</div>
            <div className="text-sm text-gray-500
              dark:text-gray-400 mt-1"
            >
              {option.description}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-12 sm:mt-16 pt-8 border-t
        border-gray-200 dark:border-gray-800"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">About</h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-400
          leading-relaxed"
        >
          <p>
            <strong className="text-gray-900 dark:text-gray-100">
              Hello
            </strong>{' '}
            is a minimal progressive web app built with React,
            TypeScript, and Tailwind CSS.
          </p>
          <p>
            It works offline, can be installed to your home screen on
            any device, and remembers your preferences between sessions.
          </p>
          <p>
            Built with Bun — zero bundler plugins, no framework
            overhead. Just a clean, fast, modern web app.
          </p>
        </div>
      </div>
    </div>
  )
}
