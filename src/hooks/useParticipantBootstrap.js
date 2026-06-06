import { useEffect, useState } from 'react'
import { createParticipantRow } from '../lib/db.js'
import { SESSION_UPDATE_BLOCKED_MESSAGE } from '../lib/sessionErrors.js'

/**
 * Creates the Supabase participant row as soon as questions are selected so
 * later screens do not wait on the network before enabling primary actions.
 */
export default function useParticipantBootstrap(session) {
  const {
    sessionId,
    sessionSecret,
    selectedQuestions,
    participantId,
    participantRowReady,
    setParticipantId,
    markParticipantRowReady,
  } = session

  const [rowError, setRowError] = useState(null)
  const rowReady = participantRowReady || Boolean(participantId)

  useEffect(() => {
    if (participantRowReady || participantId || !selectedQuestions?.length) return undefined

    let cancelled = false

    createParticipantRow(sessionId, sessionSecret, selectedQuestions).then((id) => {
      if (cancelled) return
      if (id) {
        setParticipantId(id)
        markParticipantRowReady()
      } else {
        setRowError(SESSION_UPDATE_BLOCKED_MESSAGE)
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    participantRowReady,
    participantId,
    selectedQuestions,
    sessionId,
    sessionSecret,
    setParticipantId,
    markParticipantRowReady,
  ])

  return { rowReady, rowError }
}
