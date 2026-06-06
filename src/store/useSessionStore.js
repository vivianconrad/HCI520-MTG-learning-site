import { useState, useCallback, useEffect, useRef } from 'react'
import { TOPIC_ORDER } from '../lib/scoring.js'
import {
  loadPersistedSession,
  persistSession,
  clearPersistedSession,
} from './sessionStorage.js'

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

function isTestFullyAnswered(answers, questions) {
  if (!questions?.length) return false
  return questions.every((question) => answers[question.id] !== undefined)
}

export default function useSessionStore() {
  const savedRef = useRef(null)
  if (savedRef.current === null) {
    savedRef.current = loadPersistedSession()
  }
  const saved = savedRef.current

  const [sessionId] = useState(() => saved?.sessionId ?? generateSessionId())
  const [sessionSecret] = useState(
    () => saved?.sessionSecret ?? generateSessionSecret(),
  )
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
  const [scenarioIdsAttempted, setScenarioIdsAttempted] = useState(() => {
    if (Array.isArray(saved?.scenarioIdsAttempted)) return saved.scenarioIdsAttempted
    const legacyCount = saved?.scenariosAttempted
    if (typeof legacyCount === 'number' && legacyCount > 0) {
      const capped = Math.min(legacyCount, 10)
      return Array.from({ length: capped }, (_, index) => `legacy-${index}`)
    }
    return []
  })
  const [lessonsCompleted, setLessonsCompletedState] = useState(
    () => saved?.lessonsCompleted ?? false,
  )
  const [pretestCompleted, setPretestCompletedState] = useState(
    () =>
      saved?.pretestCompleted ??
      isTestFullyAnswered(saved?.pretestAnswers ?? {}, saved?.selectedQuestions),
  )
  const [posttestCompleted, setPosttestCompletedState] = useState(
    () =>
      saved?.posttestCompleted ??
      isTestFullyAnswered(saved?.posttestAnswers ?? {}, saved?.selectedQuestions),
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
    lessonsCompleted,
    pretestCompleted,
    posttestCompleted,
  ])

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
  }
}
