import { loadAnswerKeys } from './questionKeys.js'

export function calculateTestScore(selectedQuestions, answers, answerKeys) {
  if (!selectedQuestions?.length || !answerKeys) return 0
  return selectedQuestions.reduce((total, question) => {
    const correctIndex = answerKeys[question.id]
    if (correctIndex === undefined) return total
    return total + (answers[question.id] === correctIndex ? 1 : 0)
  }, 0)
}

export async function calculateTestScoreAsync(selectedQuestions, answers) {
  const answerKeys = await loadAnswerKeys()
  return calculateTestScore(selectedQuestions, answers, answerKeys)
}
