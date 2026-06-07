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
    <div className="gate-notice" role="status" aria-live="polite">
      <div className="gate-notice__content">
        <p className="gate-notice__title">Study path reminder</p>
        <p className="gate-notice__text">{notice}</p>
      </div>
      <button type="button" className="gate-notice__dismiss" onClick={dismiss}>
        Got it
      </button>
    </div>
  )
}
