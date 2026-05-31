import { useState, useCallback } from 'react'
import questionBank from '../data/questionBank.js'

const LO_ORDER = ['LO1', 'LO2', 'LO3', 'LO4']
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateSessionId() {
  let id = ''
  for (let i = 0; i < 6; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return id
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function useSessionStore() {
  const [sessionId] = useState(() => generateSessionId())
  const [selectedQuestions, setSelectedQuestions] = useState(null)
  const [pretestAnswers, setPretestAnswers] = useState({})
  const [posttestAnswers, setPosttestAnswers] = useState({})

  const selectQuestions = useCallback(() => {
    const selected = LO_ORDER.flatMap((lo) => {
      const pool = questionBank.filter((q) => q.lo === lo)
      return shuffle(pool).slice(0, 2)
    })
    setSelectedQuestions(selected)
    return selected
  }, [])

  const setPretestAnswer = useCallback((id, index) => {
    setPretestAnswers((prev) => ({ ...prev, [id]: index }))
  }, [])

  const setPosttestAnswer = useCallback((id, index) => {
    setPosttestAnswers((prev) => ({ ...prev, [id]: index }))
  }, [])

  return {
    sessionId,
    selectedQuestions,
    selectQuestions,
    pretestAnswers,
    posttestAnswers,
    setPretestAnswer,
    setPosttestAnswer,
  }
}
