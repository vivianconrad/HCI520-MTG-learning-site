import { Navigate, useLocation } from 'react-router-dom'
import { getLessonProgressForwardPath } from '../lib/sessionGate.js'

/** Silently skip stale routes when the participant already passed gates and hit Back. */
export default function ForwardLessonProgress({ session, children }) {
  const { pathname } = useLocation()
  const target = getLessonProgressForwardPath(pathname, session)

  if (target) {
    return <Navigate to={target} replace />
  }

  return children
}
