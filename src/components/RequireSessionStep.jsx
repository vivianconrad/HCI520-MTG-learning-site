import { Navigate } from 'react-router-dom'
import { getRedirectPath } from '../lib/sessionGate.js'

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
