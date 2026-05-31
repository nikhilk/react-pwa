// Home.tsx
// Landing page with hero section and configurable action button
//

import * as React from 'react'
import { useAppSettings, type ButtonAction } from '../App.tsx'
import { spawnConfetti } from '../components/Confetti.tsx'
import { Greeting } from '../components/Greeting.tsx'
import { Picture } from '../components/Picture.tsx'
import { Quote } from '../components/Quote.tsx'

const buttonLabels: Record<ButtonAction, string> = {
  celebrate: 'Celebrate!',
  wave: 'Wave Hello!',
  inspire: 'Inspire Me!',
  paint: 'Paint!',
}


export function Home() {
  const [settings] = useAppSettings()
  const [clickCount, setClickCount] = React.useState(0)
  const [animating, setAnimating] = React.useState(false)

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnimating(true)
      setClickCount((n) => n + 1)
      if (settings.buttonAction === 'celebrate') {
        spawnConfetti(e.currentTarget)
      }
      setTimeout(() => setAnimating(false), 600)
    },
    [settings.buttonAction],
  )

  return (
    <div className="max-w-3xl mx-auto px-4
      py-12 sm:py-20 md:py-28
      flex flex-col items-center text-center gap-6 sm:gap-8"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl
        font-bold tracking-tight"
      >
        Hello<span className="text-blue-600 dark:text-blue-400">.</span>
      </h1>
      <p className="text-base sm:text-lg
        text-gray-500 dark:text-gray-400 max-w-md"
      >
        A simple, modern progressive web app.
        Install it, use it offline, and make it yours.
      </p>
      <button
        onClick={handleClick}
        className={
          'px-6 sm:px-8 py-3 rounded-lg'
          + ' bg-blue-600 hover:bg-blue-700'
          + ' active:scale-95 text-white font-semibold'
          + ' text-base sm:text-lg'
          + ' shadow-lg shadow-blue-600/25 transition-all'
          + (animating ? ' scale-110' : '')
        }
      >
        {buttonLabels[settings.buttonAction]}
      </button>
      {clickCount > 0 && settings.buttonAction !== 'celebrate' && (
        settings.buttonAction === 'paint'
          ? <Picture refreshKey={clickCount} />
          : settings.buttonAction === 'wave'
            ? <Greeting refreshKey={clickCount} />
            : <Quote refreshKey={clickCount} />
      )}
    </div>
  )
}
