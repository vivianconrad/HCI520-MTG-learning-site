import { calculateScores } from './scoring.js'
import answerKeys from '../data/questionAnswerKeys.js'

export function buildParticipantExport(session) {
  const {
    sessionId,
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    screenTimes,
    scenariosAttempted,
    curiosityFocus,
    posttestReadiness,
    lessonsCompleted,
    pretestCompleted,
    posttestCompleted,
  } = session

  const scores =
    selectedQuestions?.length &&
    Object.keys(pretestAnswers ?? {}).length > 0 &&
    Object.keys(posttestAnswers ?? {}).length > 0
      ? calculateScores(selectedQuestions, pretestAnswers, posttestAnswers, answerKeys)
      : null

  return {
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    sessionId,
    progress: {
      pretestCompleted: Boolean(pretestCompleted),
      posttestCompleted: Boolean(posttestCompleted),
      lessonsCompleted: Boolean(lessonsCompleted),
      scenariosAttempted: scenariosAttempted ?? 0,
    },
    curiosityFocus: curiosityFocus ?? null,
    posttestReadiness: posttestReadiness ?? null,
    pretestAnswers: pretestAnswers ?? {},
    posttestAnswers: posttestAnswers ?? {},
    scores: scores
      ? {
          pretestCorrect: scores.pretestCorrect,
          posttestCorrect: scores.posttestCorrect,
          loScores: scores.loScores,
        }
      : null,
    screenTimes: screenTimes ?? {},
    questionIds: selectedQuestions?.map((question) => question.id) ?? [],
  }
}

export function downloadParticipantExport(session) {
  const payload = buildParticipantExport(session)
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `hci520-mtg-session-${session.sessionId}-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
