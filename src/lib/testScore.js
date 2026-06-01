export function calculateTestScore(selectedQuestions, answers) {
  if (!selectedQuestions?.length) return 0
  return selectedQuestions.reduce(
    (total, question) =>
      total + (answers[question.id] === question.correctIndex ? 1 : 0),
    0,
  )
}
