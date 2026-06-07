import { useEffect } from 'react'

/**
 * Prevents leaving the current page via the browser Back button (popstate).
 * Re-pushes the current URL so history cannot return to prior steps.
 */
export function useBlockBrowserBack(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    const url = window.location.href
    window.history.pushState({ blockBack: true }, '', url)

    function onPopState() {
      window.history.pushState({ blockBack: true }, '', url)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [enabled])
}
