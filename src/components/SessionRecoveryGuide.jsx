import './SessionRecoveryGuide.css'

const RECOVERY_SECTIONS = [
  {
    title: 'Moving through the study',
    steps: [
      'Use the on-screen Back and Continue buttons between steps. Your browser\u2019s back button is turned off on most study screens.',
      'Refreshing the page is safe — your answers and lesson progress are saved as you go.',
    ],
  },
  {
    title: 'Saving your place',
    steps: [
      'Copy your save code on the Intro screen if you might close the tab before finishing. You can also find it on the results screen.',
      'If a gold banner appears at the top, read it — we sent you back because an earlier step was not finished yet.',
    ],
  },
  {
    title: 'Session errors or starting over',
    steps: [
      'If Welcome shows a session error, tap Reset session there to begin with a fresh save code.',
      'After you finish the study, use Start over on the Results page if you want to run through everything again on this device.',
    ],
  },
]

export default function SessionRecoveryGuide({ className = '' }) {
  const rootClass = ['session-recovery-guide', className].filter(Boolean).join(' ')

  return (
    <details className={rootClass}>
      <summary className="session-recovery-guide__summary">
        <span className="session-recovery-guide__summary-text">Stuck or lost your place?</span>
      </summary>
      <div className="session-recovery-guide__body">
        <p className="session-recovery-guide__lead">
          These tips help you recover without losing progress. Nothing here is graded — take your
          time.
        </p>
        {RECOVERY_SECTIONS.map((section) => (
          <section key={section.title} className="session-recovery-guide__section">
            <h3 className="session-recovery-guide__section-title">{section.title}</h3>
            <ul className="session-recovery-guide__list">
              {section.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </details>
  )
}
