import './SessionRecoveryGuide.css'

const RECOVERY_STEPS = [
  'Use the on-screen Back and Continue buttons to move between steps. Your browser\u2019s back button is turned off on most study screens.',
  'Copy your save code on the Intro screen if you might close the tab before finishing. You can also find it on the results screen.',
  'If Welcome shows a session error, use Reset session there or finish the study and use Start over on the Results page.',
  'Refreshing the page is safe — your answers and lesson progress are saved as you go.',
]

export default function SessionRecoveryGuide({ className = '' }) {
  const rootClass = ['session-recovery-guide', className].filter(Boolean).join(' ')

  return (
    <details className={rootClass}>
      <summary className="session-recovery-guide__summary">
        <span className="session-recovery-guide__summary-text">Stuck or lost your place?</span>
      </summary>
      <div className="session-recovery-guide__body">
        <ul className="session-recovery-guide__list">
          {RECOVERY_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </details>
  )
}
