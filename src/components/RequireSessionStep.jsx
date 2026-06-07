import { Navigate } from 'react-router-dom'

const CHECK_ORDER = ['consent', 'questions', 'rowReady', 'pretest', 'lessons', 'posttest']

const REDIRECTS = {
  consent: '/',
  questions: '/welcome',
  rowReady: '/welcome',
  pretest: '/pretest',
  lessons: '/what-is-mtg',
  posttest: '/posttest',
}

function getRedirectPath(requirements, session) {
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

export default function RequireSessionStep({
  session,
  require,
  redirectIfPretestComplete,
  redirectIfPosttestComplete,
  children,
}) {
  const requirements = Array.isArray(require) ? require : [require]

  if (redirectIfPretestComplete && session.pretestCompleted) {
    return <Navigate to="/pretest-complete" replace />
  }

  if (redirectIfPosttestComplete && session.posttestCompleted) {
    return <Navigate to="/results" replace />
  }

  const redirect = getRedirectPath(requirements, session)

  if (redirect) {
    return <Navigate to={redirect} replace />
  }

  return children
}
