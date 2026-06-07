import './SessionRecoveryGuide.css'

export default function SessionRecoveryGuide({ className = '' }) {
  const rootClass = ['session-recovery-guide', className].filter(Boolean).join(' ')

  return (
    <details className={rootClass}>
      <summary className="session-recovery-guide__summary">Stuck or lost your place?</summary>
      <div className="session-recovery-guide__body">
        <p>Use the on-screen Back and Continue buttons to move between steps. Your browser&apos;s back button is turned off on most study screens.</p>
        <p>
          Copy your session ID on the Intro screen before the pre-test. You will need it at the end
          of the study.
        </p>
        <p>
          If Welcome shows a session error, use Reset session there or finish the study and use
          Start over on the Results page.
        </p>
        <p>Refreshing the page is safe — your answers and lesson progress are saved as you go.</p>
      </div>
    </details>
  )
}
