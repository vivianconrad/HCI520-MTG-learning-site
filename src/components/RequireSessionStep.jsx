import { Navigate, useLocation } from 'react-router-dom'
import { getGateNotice, getLessonProgressForwardPath, getRedirectInfo } from '../lib/sessionGate.js'

export default function RequireSessionStep({
  session,
  require,
  redirectIfPretestComplete,
  redirectIfPosttestComplete,
  children,
}) {
  const { pathname } = useLocation()
  const requirements = Array.isArray(require) ? require : [require]

  if (redirectIfPosttestComplete && session.posttestCompleted) {
    return <Navigate to="/results" replace />
  }

  const redirectInfo = getRedirectInfo(requirements, session)

  if (redirectInfo) {
    return (
      <Navigate
        to={redirectInfo.path}
        state={{ gateNotice: getGateNotice(redirectInfo.failedKey, redirectInfo.path) }}
        replace
      />
    )
  }

  if (redirectIfPretestComplete && session.pretestCompleted) {
    return <Navigate to="/pretest-complete" replace />
  }

  const progressForward = getLessonProgressForwardPath(pathname, session)
  if (progressForward) {
    return <Navigate to={progressForward} replace />
  }

  return children
}
