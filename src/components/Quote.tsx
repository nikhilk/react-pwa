// Quote.tsx
// Displays a random inspirational quote
//

import * as React from 'react'

const quotes = [
  'The best way to predict the future is to invent it. — Alan Kay',
  'Simplicity is the ultimate sophistication. — Leonardo da Vinci',
  'Talk is cheap. Show me the code. — Linus Torvalds',
  'First, solve the problem. Then, write the code. — John Johnson',
  'Code is like humor. When you have to explain it, it\'s bad. — Cory House',
  'Good programmers write code that humans can understand. — Martin Fowler',
  'Any sufficiently advanced technology is indistinguishable from magic. — Arthur C. Clarke',
  'The only way to do great work is to love what you do. — Steve Jobs',
  'Make it work, make it right, make it fast. — Kent Beck',
  'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away. — Antoine de Saint-Exupéry',
  'The most dangerous phrase in the language is "we\'ve always done it this way." — Grace Hopper',
  'Imagination is more important than knowledge. — Albert Einstein',
]

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function Quote({ refreshKey }: { refreshKey: number }) {
  const quote = React.useMemo(() => pickRandom(quotes), [refreshKey])

  return (
    <p className="text-lg sm:text-xl font-medium
      animate-fade-in mt-2 px-2"
    >
      {quote}
    </p>
  )
}
