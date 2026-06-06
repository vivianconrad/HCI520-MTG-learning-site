import { useEffect } from 'react'
import { useConfirm } from '../context/useConfirm.js'

/**
 * Confirms before the user leaves via the browser Back button (popstate).
 * Pushes a history entry so the first Back triggers a confirm instead of leaving immediately.
 */
export function useBrowserBackConfirm(enabled, message, title) {
  const confirm = useConfirm()

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    function onBeforeUnload(event) {
      event.preventDefault()
      event.returnValue = message
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [enabled, message])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    const url = window.location.href
    window.history.pushState({ leaveGuard: true }, '', url)

    function onPopState() {
      void (async () => {
        if (await confirm(message, { title })) {
          window.removeEventListener('popstate', onPopState)
          window.history.back()
          return
        }
        window.history.pushState({ leaveGuard: true }, '', url)
      })()
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [enabled, message, title, confirm])
}
