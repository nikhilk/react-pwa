// Confetti.tsx
// Animated confetti particle effect
//

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e',
  '#f59e0b', '#8b5cf6', '#ec4899',
]
const PARTICLE_COUNT = 40

export function spawnConfetti(origin: HTMLElement) {
  const rect = origin.getBoundingClientRect()
  const cx = rect.left + origin.offsetWidth / 2
  const cy = rect.top

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const dot = document.createElement('div')
    const size = Math.random() * 8 + 4
    Object.assign(dot.style, {
      position: 'fixed',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      backgroundColor:
        COLORS[Math.floor(Math.random() * COLORS.length)],
      left: `${cx}px`,
      top: `${cy}px`,
      pointerEvents: 'none',
      zIndex: '50',
    })
    document.body.appendChild(dot)

    const angle = Math.random() * Math.PI * 2
    const velocity = Math.random() * 300 + 200
    const dx = Math.cos(angle) * velocity
    const dy = Math.sin(angle) * velocity - 200

    dot.animate(
      [
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy + 400}px)`
            + ` rotate(${Math.random() * 720 - 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0,0,0.2,1)',
      },
    ).onfinish = () => dot.remove()
  }
}
