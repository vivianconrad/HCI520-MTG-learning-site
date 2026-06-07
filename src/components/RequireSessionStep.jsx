import { Navigate } from 'react-router-dom'
import { getGateNotice, getRedirectInfo } from '../lib/sessionGate.js'

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

  const redirectInfo = getRedirectInfo(requirements, session)

  if (redirectInfo) {
    return (
      <Navigate
        to={redirectInfo.path}
        replace
        state={{ gateNotice: getGateNotice(redirectInfo.failedKey, redirectInfo.path) }}
      />
    )
  }

  return children
}
