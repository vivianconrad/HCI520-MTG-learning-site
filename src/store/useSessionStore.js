import { useState, useCallback, useEffect } from 'react'
import questionBank from '../data/questionBank.js'
import {
  loadPersistedSession,
  persistSession,
  clearPersistedSession,
} from './sessionStorage.js'

const TOPIC_ORDER = ['LO1', 'LO2', 'LO3', 'LO4']
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
  return TOPIC_ORDER.flatMap((topicKey) => {
    const pool = questionBank.filter((q) => q.lo === topicKey)
    return shuffle(pool).slice(0, 2)
  })
}

export default function useSessionStore() {
  const saved = loadPersistedSession()

  const [sessionId] = useState(() => saved?.sessionId ?? generateSessionId())
  const [participantId, setParticipantIdState] = useState(() => saved?.participantId ?? null)
  const [participantRowReady, setParticipantRowReady] = useState(
    () => saved?.participantRowReady ?? Boolean(saved?.participantId),
  )
  const [selectedQuestions, setSelectedQuestions] = useState(
    () => saved?.selectedQuestions ?? null,
  )
  const [pretestAnswers, setPretestAnswers] = useState(
    () => saved?.pretestAnswers ?? {},
  )
  const [posttestAnswers, setPosttestAnswers] = useState(
    () => saved?.posttestAnswers ?? {},
  )
  const [screenStartTimes, setScreenStartTimes] = useState(
    () => saved?.screenStartTimes ?? {},
  )
  const [screenTimes, setScreenTimes] = useState(() => saved?.screenTimes ?? {})
  const [scenariosAttempted, setScenariosAttempted] = useState(
    () => saved?.scenariosAttempted ?? 0,
  )
  const [lessonsCompleted, setLessonsCompletedState] = useState(
    () => saved?.lessonsCompleted ?? false,
  )

  useEffect(() => {
    persistSession({
      sessionId,
      participantId,
      participantRowReady,
      selectedQuestions,
      pretestAnswers,
      posttestAnswers,
      screenStartTimes,
      screenTimes,
      scenariosAttempted,
      lessonsCompleted,
    })
  }, [
    sessionId,
    participantId,
    participantRowReady,
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    screenStartTimes,
    screenTimes,
    scenariosAttempted,
    lessonsCompleted,
  ])

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

  const setParticipantId = useCallback((id) => {
    setParticipantIdState(id)
  }, [])

  const markParticipantRowReady = useCallback(() => {
    setParticipantRowReady(true)
  }, [])

  const recordScreenEnter = useCallback((screenName) => {
    setScreenStartTimes((prev) => ({
      ...prev,
      [screenName]: Date.now(),
    }))
  }, [])

  const recordScreenExit = useCallback((screenName) => {
    setScreenStartTimes((prev) => {
      const startedAt = prev[screenName]
      if (!startedAt) return prev

      const elapsedMs = Date.now() - startedAt
      setScreenTimes((times) => ({
        ...times,
        [screenName]: (times[screenName] ?? 0) + elapsedMs,
      }))

      const next = { ...prev }
      delete next[screenName]
      return next
    })
  }, [])

  const incrementScenarios = useCallback(() => {
    setScenariosAttempted((count) => count + 1)
  }, [])

  const setLessonsCompleted = useCallback((value) => {
    setLessonsCompletedState(value)
  }, [])

  const resetSession = useCallback(() => {
    // Clear storage and reload immediately. Do not call setState here — the persist
    // effect would write the old sessionId back into sessionStorage before navigation.
    clearPersistedSession()
    window.location.replace(`${import.meta.env.BASE_URL}`)
  }, [])

  return {
    sessionId,
    participantId,
    participantRowReady,
    markParticipantRowReady,
    selectedQuestions,
    selectQuestions,
    pretestAnswers,
    posttestAnswers,
    setPretestAnswer,
    setPosttestAnswer,
    setParticipantId,
    screenStartTimes,
    screenTimes,
    scenariosAttempted,
    lessonsCompleted,
    recordScreenEnter,
    recordScreenExit,
    incrementScenarios,
    setLessonsCompleted,
    resetSession,
  }
}
