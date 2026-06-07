import { useLocation, useNavigate } from 'react-router-dom'
import './GateNotice.css'

export default function GateNotice() {
  const location = useLocation()
  const navigate = useNavigate()
  const notice = location.state?.gateNotice

  if (!notice) return null

  function dismiss() {
    navigate(location.pathname, { replace: true, state: null })
  }

  return (
    <div className="gate-notice" role="status">
      <p className="gate-notice__text">{notice}</p>
      <button type="button" className="gate-notice__dismiss" onClick={dismiss}>
        Dismiss
      </button>
    </div>
  )
}
