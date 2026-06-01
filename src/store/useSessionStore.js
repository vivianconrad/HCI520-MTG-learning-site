import { useState, useCallback, useEffect } from 'react'
import questionBank from '../data/questionBank.js'
import {
  loadPersistedSession,
  persistSession,
  clearPersistedSession,
} from './sessionStorage.js'

const LO_ORDER = ['LO1', 'LO2', 'LO3', 'LO4']
// Unambiguous chars — no 0/O, 1/I/L confusion when reading aloud or transcribing
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateSessionId() {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => CHARS[b % CHARS.length]).join('')
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickQuestions() {
  return LO_ORDER.flatMap((lo) => {
    const pool = questionBank.filter((q) => q.lo === lo)
    return shuffle(pool).slice(0, 2)
  })
}

export default function useSessionStore() {
  const saved = loadPersistedSession()

  const [sessionId] = useState(() => saved?.sessionId ?? generateSessionId())
  const [selectedQuestions, setSelectedQuestions] = useState(
    () => saved?.selectedQuestions ?? null,
  )
  const [pretestAnswers, setPretestAnswers] = useState(
    () => saved?.pretestAnswers ?? {},
  )
  const [posttestAnswers, setPosttestAnswers] = useState(
    () => saved?.posttestAnswers ?? {},
  )

  useEffect(() => {
    persistSession({
      sessionId,
      selectedQuestions,
      pretestAnswers,
      posttestAnswers,
    })
  }, [sessionId, selectedQuestions, pretestAnswers, posttestAnswers])

  const selectQuestions = useCallback(() => {
    const selected = pickQuestions()
    setSelectedQuestions(selected)
    return selected
  }, [])

  const setPretestAnswer = useCallback((id, index) => {
    setPretestAnswers((prev) => ({ ...prev, [id]: index }))
  }, [])

  const setPosttestAnswer = useCallback((id, index) => {
    setPosttestAnswers((prev) => ({ ...prev, [id]: index }))
  }, [])

  const resetSession = useCallback(() => {
    clearPersistedSession()
    setSelectedQuestions(null)
    setPretestAnswers({})
    setPosttestAnswers({})
    window.location.href = `${import.meta.env.BASE_URL}`
  }, [])

  return {
    sessionId,
    selectedQuestions,
    selectQuestions,
    pretestAnswers,
    posttestAnswers,
    setPretestAnswer,
    setPosttestAnswer,
    resetSession,
  }
}
