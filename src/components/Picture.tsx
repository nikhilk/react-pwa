// Picture.tsx
// Displays a random photo from Picsum
//

import * as React from 'react'

export function Picture({ refreshKey }: { refreshKey: number }) {
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    setLoaded(false)
  }, [refreshKey])

  return (
    <img
      src={`https://picsum.photos/400/400?random=${refreshKey}`}
      alt="Random photo"
      onLoad={() => setLoaded(true)}
      className={
        'mt-2 rounded-lg shadow-lg max-w-full transition-opacity duration-500'
        + (loaded ? ' opacity-100' : ' opacity-0')
      }
    />
  )
}
