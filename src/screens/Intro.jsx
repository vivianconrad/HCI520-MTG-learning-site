import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import SessionRecoveryGuide from '../components/SessionRecoveryGuide.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import { describeSessionSetupError } from '../lib/sessionErrors.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import './Intro.css'

export default function Intro({ session }) {
  const navigate = useNavigate()
  const { sessionId, pretestCompleted } = session
  const { rowReady, rowError } = useParticipantBootstrap(session)
  const [saveCodeCopied, setSaveCodeCopied] = useState(false)
  const [saveCodeAcknowledged, setSaveCodeAcknowledged] = useState(false)
  const saveCodeReady = saveCodeCopied || saveCodeAcknowledged
  const canContinue = rowReady && saveCodeReady

  return (
    <PageLayout title="Study Overview · Learn to Play MTG" className="intro">
      <div className="intro__frame">
        <p className="intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="intro__heading">Before We Begin</h1>
        <hr className="intro__rule" aria-hidden="true" />
        <div className="intro__body">
          <p className="intro__paragraph">
            We&apos;ll start with a short pre-test about Magic: The Gathering. You have not been
            taught these topics yet, so guessing is fine and wrong answers are expected.
          </p>
          <p className="intro__purpose-note" role="note">
            The pre-test and post-test are not grades. We use them to see how well these lessons
            convey the material — not to judge your competence or intelligence. There is no pass or
            fail.
          </p>
          <p className="intro__paragraph">
            After the pre-test, you&apos;ll read a short overview, then work through four lessons on
            reading a card, card types, turn structure (including a sample turn walkthrough), and
            putting it all together.
          </p>
          <p className="intro__paragraph">
            If you might close this tab before finishing, copy your save code below. We use it to
            match your results later — no account or password needed.
          </p>
        </div>
        <CopySessionId
          sessionId={sessionId}
          className="intro__session"
          description="Optional now; you can also copy this code on the results screen at the end."
          onCopied={() => setSaveCodeCopied(true)}
        />
        <label className="intro__save-code-check">
          <input
            type="checkbox"
            checked={saveCodeAcknowledged}
            onChange={(event) => setSaveCodeAcknowledged(event.target.checked)}
          />
          <span>I saved my save code, or I don&apos;t need it right now (optional)</span>
        </label>
        {!saveCodeReady ? (
          <p className="intro__save-code-note" role="note">
            Copy your save code or check the box above before continuing.
          </p>
        ) : null}
        <SessionRecoveryGuide />
        {rowError ? (
          <p className="intro__error" role="alert">
            {describeSessionSetupError(rowError)}
          </p>
        ) : null}
        {!rowReady && !rowError ? (
          <p className="intro__status" aria-live="polite">
            Preparing your session…
          </p>
        ) : null}
        <div className="intro__actions intro__actions--split">
          <button
            type="button"
            className="intro__button intro__button--back"
            onClick={() => navigate('/welcome')}
          >
            Back
          </button>
          <button
            type="button"
            className="intro__button"
            disabled={!canContinue}
            onClick={() => navigate(pretestCompleted ? '/pretest-complete' : '/pretest')}
          >
            {pretestCompleted ? 'Continue' : "I'm Ready"}
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.INTRO} />
      </div>
    </PageLayout>
  )
}
