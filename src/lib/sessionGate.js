export const CHECK_ORDER = ['consent', 'questions', 'rowReady', 'pretest', 'lessons', 'posttest']

export const REDIRECTS = {
  consent: '/',
  questions: '/welcome',
  rowReady: '/welcome',
  pretest: '/pretest',
  posttest: '/posttest',
}

const LESSON_PATH_LABELS = {
  '/lesson/intro': 'the lesson overview',
  '/what-is-mtg': 'the Magic overview',
  '/lesson/1': 'Lesson 1 (card anatomy)',
  '/lesson/2': 'Lesson 2 (card types)',
  '/lesson/3': 'Lesson 3 (turn structure)',
  '/lesson/4': 'Lesson 4 (putting it together)',
}

const GATE_NOTICES = {
  consent: 'Please agree to participate before continuing. We sent you back to the consent screen.',
  questions:
    'Your test questions are still loading. We sent you back to Welcome. Start when the Start button is enabled.',
  rowReady:
    'Your session is still preparing. We sent you back to Welcome. Wait until Start is enabled.',
  pretest: 'Complete the pre-test before opening the lessons. We sent you to the pre-test.',
  lessons: 'Finish the four lessons before the post-test.',
  posttest: 'Complete the post-test before viewing your results. We sent you to the post-test.',
}

export function getGateNotice(failedKey, redirectPath) {
  if (failedKey === 'lessons' && redirectPath) {
    const destination = LESSON_PATH_LABELS[redirectPath] ?? 'where you left off in the lessons'
    return `Finish the four lessons before the post-test. We sent you to ${destination}.`
  }

  return (
    GATE_NOTICES[failedKey] ??
    'That step is not available yet. We sent you back to where you can continue.'
  )
}

const LESSON_RESUME_SCREENS = [
  { screen: 'WhatIsMtg', path: '/what-is-mtg' },
  { screen: 'CardAnatomy', path: '/lesson/1' },
  { screen: 'CardTypes', path: '/lesson/2' },
  { screen: 'TurnStructure', path: '/lesson/3' },
  { screen: 'PuttingItTogether', path: '/lesson/4' },
]

/** Ordered lesson routes used to detect backward navigation within the lesson phase. */
export const LESSON_FLOW_ORDER = [
  '/lesson/intro',
  '/what-is-mtg',
  '/lesson/1',
  '/lesson/2',
  '/lesson/3',
  '/lesson/4',
]

const PRE_LESSON_ALWAYS_FORWARD = ['/', '/welcome', '/intro', '/pretest', '/pretest-complete']

const POST_LESSON_FORWARD_TARGET = '/posttest-prep'

const POST_LESSON_STALE_PATHS = [
  '/',
  '/welcome',
  '/intro',
  '/pretest',
  '/pretest-complete',
  ...LESSON_FLOW_ORDER,
  '/lesson/complete',
]

function hasLessonDwell(screenTimes = {}) {
  return LESSON_RESUME_SCREENS.some(({ screen }) => (screenTimes[screen] ?? 0) > 0)
}

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

/**
 * When a participant has already passed gates, send them forward to their last lesson
 * (or post-test prep after lessons) instead of leaving them on an earlier step via Back.
 */
export function getLessonProgressForwardPath(currentPath, session) {
  const {
    pretestCompleted,
    lessonsCompleted,
    posttestCompleted,
    screenTimes = {},
  } = session

  if (posttestCompleted) return null

  if (lessonsCompleted) {
    if (
      POST_LESSON_STALE_PATHS.includes(currentPath) &&
      currentPath !== POST_LESSON_FORWARD_TARGET &&
      currentPath !== '/posttest'
    ) {
      return POST_LESSON_FORWARD_TARGET
    }
    return null
  }

  if (!pretestCompleted) return null

  const resumePath = getLessonsResumePath(screenTimes)
  if (currentPath === resumePath) return null

  if (PRE_LESSON_ALWAYS_FORWARD.includes(currentPath)) {
    if (currentPath === '/pretest-complete' && !hasLessonDwell(screenTimes)) {
      return null
    }
    return resumePath
  }

  const flowIndex = LESSON_FLOW_ORDER.indexOf(currentPath)
  const resumeIndex = LESSON_FLOW_ORDER.indexOf(resumePath)

  if (flowIndex === -1 || resumeIndex === -1) return null
  if (flowIndex < resumeIndex) return resumePath

  return null
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
