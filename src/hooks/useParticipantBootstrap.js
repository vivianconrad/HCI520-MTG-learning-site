import { useEffect, useState } from 'react'
import { createParticipantRow, fetchParticipantProgress } from '../lib/db.js'
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
    rotateSessionCredentials,
  } = session

  const [rowError, setRowError] = useState(null)
  const [verifiedParticipantId, setVerifiedParticipantId] = useState(null)
  const rowReady = participantRowReady
  const shouldVerify = !participantRowReady && participantId && sessionId && sessionSecret
  const verifying = Boolean(shouldVerify && verifiedParticipantId !== participantId)

  // Reconcile a persisted participantId with the database before allowing saves.
  useEffect(() => {
    if (!shouldVerify || verifiedParticipantId === participantId) return undefined

    let cancelled = false

    fetchParticipantProgress(sessionId, sessionSecret).then((progress) => {
      if (cancelled) return

      if (progress) {
        setVerifiedParticipantId(participantId)
        markParticipantRowReady()
        setRowError(null)
        return
      }

      setVerifiedParticipantId(null)
      setParticipantId(null)
    })

    return () => {
      cancelled = true
    }
  }, [
    shouldVerify,
    verifiedParticipantId,
    participantId,
    sessionId,
    sessionSecret,
    markParticipantRowReady,
    setParticipantId,
  ])

  useEffect(() => {
    if (participantRowReady || participantId || !selectedQuestions?.length) return undefined

    let cancelled = false

    createParticipantRow(sessionId, sessionSecret, selectedQuestions).then((result) => {
      if (cancelled) return

      if (result?.conflict) {
        setRowError(null)
        rotateSessionCredentials()
        return
      }

      if (typeof result === 'string' && result) {
        setParticipantId(result)
        markParticipantRowReady()
        setRowError(null)
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
    rotateSessionCredentials,
  ])

  return { rowReady, rowError, verifying }
}
