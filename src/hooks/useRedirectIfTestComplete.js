import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const REDIRECT_STATUS_MESSAGES = {
  '/pretest-complete': 'Pre-test complete — taking you to the next step…',
  '/results': 'Post-test complete — loading your results…',
  '/calculating': 'Saving your answers — almost there…',
}

export function getRedirectStatusMessage(redirectPath) {
  return REDIRECT_STATUS_MESSAGES[redirectPath] ?? 'Moving you to the next step…'
}

/** Redirect when a test is already complete; returns true while redirecting. */
export default function useRedirectIfTestComplete(completed, redirectPath) {
  const navigate = useNavigate()

  useEffect(() => {
    if (completed) {
      navigate(redirectPath, { replace: true })
    }
  }, [completed, redirectPath, navigate])

  return completed
}
