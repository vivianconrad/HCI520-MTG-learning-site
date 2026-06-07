export const CHECK_ORDER = ['consent', 'questions', 'rowReady', 'pretest', 'lessons', 'posttest']

export const REDIRECTS = {
  consent: '/',
  questions: '/welcome',
  rowReady: '/welcome',
  pretest: '/pretest',
  lessons: '/what-is-mtg',
  posttest: '/posttest',
}

/** First unmet requirement in flow order, or null when the route is allowed. */
export function getRedirectPath(requirements, session) {
  const checks = {
    consent: session.consentGiven,
    questions: session.selectedQuestions != null,
    rowReady: session.participantRowReady,
    pretest: session.pretestCompleted,
    lessons: session.lessonsCompleted,
    posttest: session.posttestCompleted,
  }

  for (const key of CHECK_ORDER) {
    if (requirements.includes(key) && !checks[key]) {
      return REDIRECTS[key]
    }
  }

  return null
}
