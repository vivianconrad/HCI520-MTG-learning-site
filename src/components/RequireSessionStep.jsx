import { Navigate } from 'react-router-dom'

const CHECK_ORDER = ['consent', 'questions', 'pretest', 'lessons', 'posttest']

const REDIRECTS = {
  consent: '/',
  questions: '/welcome',
  pretest: '/pretest',
  lessons: '/what-is-mtg',
  posttest: '/posttest',
}

function getRedirectPath(requirements, session) {
  const checks = {
    consent: session.consentGiven,
    questions: session.selectedQuestions != null,
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

export default function RequireSessionStep({ session, require, children }) {
  const requirements = Array.isArray(require) ? require : [require]
  const redirect = getRedirectPath(requirements, session)

  if (redirect) {
    return <Navigate to={redirect} replace />
  }

  return children
}
