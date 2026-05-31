// Greeting.tsx
// Displays a random greeting in a different language
//

import * as React from 'react'

const greetings = [
  'Hello, World! 🇬🇧',
  'Hola, Mundo! 🇪🇸',
  'Bonjour, le Monde! 🇫🇷',
  'こんにちは、世界！🇯🇵',
  'Hallo, Welt! 🇩🇪',
  'Ciao, Mondo! 🇮🇹',
  'Olá, Mundo! 🇧🇷',
  'Привет, мир! 🇷🇺',
  'مرحباً بالعالم! 🇸🇦',
  '你好，世界！🇨🇳',
  'Hej, Världen! 🇸🇪',
  '안녕, 세계! 🇰🇷',
  'Namaste, Duniya! 🇮🇳',
  'Hallo, Wereld! 🇳🇱',
  'Merhaba, Dünya! 🇹🇷',
]

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function Greeting({ refreshKey }: { refreshKey: number }) {
  const greeting = React.useMemo(() => pickRandom(greetings), [refreshKey])

  return (
    <p className="text-lg sm:text-xl font-medium
      animate-fade-in mt-2 px-2"
    >
      {greeting}
    </p>
  )
}
