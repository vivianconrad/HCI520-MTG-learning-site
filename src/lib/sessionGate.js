export const CHECK_ORDER = ['consent', 'questions', 'rowReady', 'pretest', 'lessons', 'posttest']

export const REDIRECTS = {
  consent: '/',
  questions: '/welcome',
  rowReady: '/welcome',
  pretest: '/pretest',
  posttest: '/posttest',
}

const GATE_NOTICES = {
  consent: 'Please agree to participate before continuing.',
  questions: 'We still need to load your test questions. Start from Welcome when Start is enabled.',
  rowReady: 'Your session is still preparing. Wait on Welcome until Start is enabled.',
  pretest: 'Complete the pre-test before opening the lessons.',
  lessons: 'Finish the four lessons before the post-test.',
  posttest: 'Complete the post-test before viewing your results.',
}

export function getGateNotice(failedKey) {
  return GATE_NOTICES[failedKey] ?? 'That step is not available yet. Continue from where you left off.'
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
export function getRedirectInfo(requirements, session) {
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
        return { path: getLessonsResumePath(session.screenTimes), failedKey: key }
      }
      return { path: REDIRECTS[key], failedKey: key }
    }
  }

  return null
}

/** @deprecated Prefer getRedirectInfo when a gate notice is needed. */
export function getRedirectPath(requirements, session) {
  return getRedirectInfo(requirements, session)?.path ?? null
}
