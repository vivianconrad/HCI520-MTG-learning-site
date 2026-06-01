import { useEffect } from 'react'

const DEFAULT_TITLE = 'Learn to Play MTG · HCI520'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ?? DEFAULT_TITLE
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title])
}
