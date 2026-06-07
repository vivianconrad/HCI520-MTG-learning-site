export const SESSION_UPDATE_BLOCKED_MESSAGE =
  'Your saved session no longer matches our records (often after a site update). Use Reset session on the results page or clear site data and start again.'

export const SESSION_SAVE_FAILED_MESSAGE =
  'We could not save your answers to the server. Your progress is stored in this browser only.'

/** User-facing message for a failed update_participant RPC call. */
export function describeSaveFailure(result) {
  if (result?.error) {
    return `${SESSION_SAVE_FAILED_MESSAGE} Server: ${result.error}`
  }
  if (result?.ok === false && result?.rowsUpdated === 0) {
    return `${SESSION_SAVE_FAILED_MESSAGE} Your session may not be registered yet — return to Welcome and wait for “Preparing your session” to finish.`
  }
  return SESSION_SAVE_FAILED_MESSAGE
}
