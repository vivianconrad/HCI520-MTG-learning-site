export const CHECK_ORDER = ['consent', 'questions', 'rowReady', 'pretest', 'lessons', 'posttest']

export const REDIRECTS = {
  consent: '/',
  questions: '/welcome',
  rowReady: '/welcome',
  pretest: '/pretest',
  posttest: '/posttest',
}

const LESSON_RESUME_SCREENS = [
  { screen: 'WhatIsMtg', path: '/what-is-mtg' },
  { screen: 'CardAnatomy', path: '/lesson/1' },
  { screen: 'CardTypes', path: '/lesson/2' },
  { screen: 'TurnStructure', path: '/lesson/3' },
  { screen: 'PuttingItTogether', path: '/lesson/4' },
]

/** Resume the lesson path the participant visited most recently, or lesson intro if none. */
export function getLessonsResumePath(screenTimes = {}) {
  let resumePath = '/lesson/intro'

  for (const { screen, path } of LESSON_RESUME_SCREENS) {
    const dwellMs = screenTimes[screen]
    if (typeof dwellMs === 'number' && dwellMs > 0) {
      resumePath = path
    }
  }

  return resumePath
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
      if (key === 'lessons') {
        return getLessonsResumePath(session.screenTimes)
      }
      return REDIRECTS[key]
    }
  }

  return null
}
