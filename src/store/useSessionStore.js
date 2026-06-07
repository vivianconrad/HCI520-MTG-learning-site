import { useState, useCallback, useEffect } from 'react'
import { TOPIC_ORDER } from '../lib/scoring.js'
import { fetchParticipantProgress } from '../lib/db.js'
import { loadPersistedSession, persistSession, clearPersistedSession } from './sessionStorage.js'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateSessionId() {
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  return Array.from(bytes, (b) => CHARS[b % CHARS.length]).join('')
}

function generateSessionSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

let questionBankPromise = null

function loadQuestionBank() {
  if (!questionBankPromise) {
    questionBankPromise = import('../data/questionBank.js').then((module) => module.default)
  }
  return questionBankPromise
}

async function pickQuestions() {
  const questionBank = await loadQuestionBank()
  return TOPIC_ORDER.flatMap((topicKey) => {
    const pool = questionBank.filter((q) => q.lo === topicKey)
    return shuffle(pool).slice(0, 2)
  })
}

const initialPersistedSession = loadPersistedSession()

export default function useSessionStore() {
  const saved = initialPersistedSession

  const [sessionId, setSessionId] = useState(() => saved?.sessionId ?? generateSessionId())
  const [sessionSecret, setSessionSecret] = useState(
    () => saved?.sessionSecret ?? generateSessionSecret()
  )
  const [participantId, setParticipantIdState] = useState(() => saved?.participantId ?? null)
  const [participantRowReady, setParticipantRowReady] = useState(
    () => saved?.participantRowReady ?? Boolean(saved?.participantId)
  )
  const [selectedQuestions, setSelectedQuestions] = useState(() => saved?.selectedQuestions ?? null)
  const [pretestAnswers, setPretestAnswers] = useState(() => saved?.pretestAnswers ?? {})
  const [posttestAnswers, setPosttestAnswers] = useState(() => saved?.posttestAnswers ?? {})
  const [screenStartTimes, setScreenStartTimes] = useState(() => saved?.screenStartTimes ?? {})
  const [screenTimes, setScreenTimes] = useState(() => saved?.screenTimes ?? {})
  const [scenarioIdsAttempted, setScenarioIdsAttempted] = useState(() => {
    if (Array.isArray(saved?.scenarioIdsAttempted)) return saved.scenarioIdsAttempted
    const legacyCount = saved?.scenariosAttempted
    if (typeof legacyCount === 'number' && legacyCount > 0) {
      const capped = Math.min(legacyCount, 10)
      return Array.from({ length: capped }, (_, index) => `legacy-${index}`)
    }
    return []
  })
  const [consentGiven, setConsentGivenState] = useState(() => saved?.consentGiven ?? false)
  const [lessonsCompleted, setLessonsCompletedState] = useState(
    () => saved?.lessonsCompleted ?? false
  )
  const [pretestCompleted, setPretestCompletedState] = useState(
    () => saved?.pretestCompleted ?? false
  )
  const [posttestCompleted, setPosttestCompletedState] = useState(
    () => saved?.posttestCompleted ?? false
  )

  useEffect(() => {
    persistSession({
      sessionId,
      sessionSecret,
      participantId,
      participantRowReady,
      selectedQuestions,
      pretestAnswers,
      posttestAnswers,
      screenStartTimes,
      screenTimes,
      scenarioIdsAttempted,
      consentGiven,
      lessonsCompleted,
      pretestCompleted,
      posttestCompleted,
    })
  }, [
    sessionId,
    sessionSecret,
    participantId,
    participantRowReady,
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    screenStartTimes,
    screenTimes,
    scenarioIdsAttempted,
    consentGiven,
    lessonsCompleted,
    pretestCompleted,
    posttestCompleted,
  ])

  useEffect(() => {
    if (!sessionId || !sessionSecret || !participantRowReady) return undefined

    let cancelled = false

    fetchParticipantProgress(sessionId, sessionSecret).then((progress) => {
      if (cancelled || !progress) return
      if (progress.pretest_completed) setPretestCompletedState(true)
      if (progress.lessons_completed) setLessonsCompletedState(true)
      if (progress.posttest_completed) setPosttestCompletedState(true)
    })

    return () => {
      cancelled = true
    }
  }, [sessionId, sessionSecret, participantRowReady])

  const selectQuestions = useCallback(async () => {
    const selected = await pickQuestions()
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

  const recordScenarioAttempt = useCallback((scenarioId) => {
    setScenarioIdsAttempted((prev) => {
      if (prev.includes(scenarioId)) return prev
      return [...prev, scenarioId]
    })
  }, [])

  const markConsentGiven = useCallback(() => {
    setConsentGivenState(true)
  }, [])

  const setLessonsCompleted = useCallback((value) => {
    setLessonsCompletedState(value)
  }, [])

  const markPretestCompleted = useCallback(() => {
    setPretestCompletedState(true)
  }, [])

  const markPosttestCompleted = useCallback(() => {
    setPosttestCompletedState(true)
  }, [])

  const resetSession = useCallback(() => {
    // Clear storage and reload immediately. Do not call setState here: the persist
    // effect would write the old sessionId back into sessionStorage before navigation.
    clearPersistedSession()
    window.location.replace(`${import.meta.env.BASE_URL}`)
  }, [])

  const rotateSessionCredentials = useCallback(() => {
    setSessionId(generateSessionId())
    setSessionSecret(generateSessionSecret())
    setParticipantIdState(null)
    setParticipantRowReady(false)
  }, [])

  return {
    sessionId,
    sessionSecret,
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
    scenarioIdsAttempted,
    scenariosAttempted: scenarioIdsAttempted.length,
    consentGiven,
    markConsentGiven,
    lessonsCompleted,
    pretestCompleted,
    posttestCompleted,
    recordScreenEnter,
    recordScreenExit,
    recordScenarioAttempt,
    setLessonsCompleted,
    markPretestCompleted,
    markPosttestCompleted,
    resetSession,
    rotateSessionCredentials,
  }
}
