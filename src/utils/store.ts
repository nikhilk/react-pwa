// store.ts
// Generic localStorage-backed store with React hook
//

import * as React from 'react'

type Listener = () => void

export function createStore<T extends Record<string, unknown>>(
  key: string,
  defaults: T,
  onUpdate?: (state: T) => void,
) {
  const listeners = new Set<Listener>()

  function load(): T {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        return { ...defaults, ...JSON.parse(raw) as Partial<T> }
      }
    }
    catch {
    }
    return defaults
  }

  let state = load()
  onUpdate?.(state)

  function subscribe(listener: Listener) {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }

  function getSnapshot(): T {
    return state
  }

  function update(patch: Partial<T>) {
    state = { ...state, ...patch }
    localStorage.setItem(key, JSON.stringify(state))
    onUpdate?.(state)
    listeners.forEach((listener) => listener())
  }

  function useStore() {
    const current = React.useSyncExternalStore(subscribe, getSnapshot)

    const set = React.useCallback(
      (patch: Partial<T>) => update(patch),
      [],
    )

    return [current, set] as const
  }

  return { useStore }
}
