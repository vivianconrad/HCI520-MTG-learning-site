export const SESSION_UPDATE_BLOCKED_MESSAGE =
  'Your saved session no longer matches our records (often after a site update). Use Reset session on the results page or clear site data and start again.'

export const SESSION_OUT_OF_DATE_MESSAGE =
  'Your saved session is out of date. Go back to Welcome and reset to start fresh.'

export const SESSION_SAVE_FAILED_MESSAGE =
  'We could not save your answers to the server. Your progress is stored in this browser only.'

export const SESSION_NOT_READY_MESSAGE =
  'Your session is still being set up. Wait a moment, or go back to Welcome and try again.'

/** Map bootstrap/setup errors to learner-friendly copy without internal details. */
export function describeSessionSetupError(errorMessage) {
  if (!errorMessage) return SESSION_NOT_READY_MESSAGE
  if (
    errorMessage === SESSION_UPDATE_BLOCKED_MESSAGE ||
    /no longer matches/i.test(errorMessage)
  ) {
    return SESSION_OUT_OF_DATE_MESSAGE
  }
  return errorMessage
}

/** User-facing message for a failed update_participant RPC call. */
export function describeSaveFailure(result) {
  if (result?.error) {
    if (import.meta.env.DEV) {
      console.warn('[session] save failed:', result.error)
    }
    return SESSION_SAVE_FAILED_MESSAGE
  }
  if (result?.ok === false && result?.rowsUpdated === 0) {
    return `${SESSION_SAVE_FAILED_MESSAGE} Return to Welcome and wait until your session finishes preparing.`
  }
  return SESSION_SAVE_FAILED_MESSAGE
}
