let answerKeysPromise = null

/** Lazy-load answer keys (separate chunk from the public question bank). */
export function loadAnswerKeys() {
  if (!answerKeysPromise) {
    answerKeysPromise = import('../data/questionAnswerKeys.js').then((module) => module.default)
  }
  return answerKeysPromise
}

/** Attach correctIndex for server persistence (selected_questions JSON). */
export async function attachAnswerKeys(questions) {
  if (!questions?.length) return questions
  const keys = await loadAnswerKeys()
  return questions.map((question) => ({
    ...question,
    correctIndex: keys[question.id],
  }))
}
