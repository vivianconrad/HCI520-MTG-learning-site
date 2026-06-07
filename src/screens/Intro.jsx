import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import SessionRecoveryGuide from '../components/SessionRecoveryGuide.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import './Intro.css'

export default function Intro({ session }) {
  const navigate = useNavigate()
  const { sessionId, pretestCompleted } = session
  const { rowReady, rowError } = useParticipantBootstrap(session)

  return (
    <PageLayout title="Study Overview · Learn to Play MTG" className="intro">
      <div className="intro__frame">
        <p className="intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="intro__heading">Before We Begin</h1>
        <hr className="intro__rule" aria-hidden="true" />
        <div className="intro__body">
          <p className="intro__paragraph">
            We&apos;ll start with a short pre-test about Magic: The Gathering. You have not been
            taught these topics yet, so guessing is fine and wrong answers are normal. The pre-test
            only records what you know before the lessons start.
          </p>
          <p className="intro__paragraph">
            After the pre-test, you&apos;ll read a short overview, then work through four lessons on
            reading a card, card types, turn structure (including a sample turn walkthrough), and
            putting it all together.
          </p>
          <p className="intro__paragraph">
            Some questions may ask about ideas the lessons cover later. Answer with your best guess;
            the lessons will explain the rest.
          </p>
          <p className="intro__paragraph">
            When you&apos;re ready, copy your session ID below. You&apos;ll need it at the end.
          </p>
        </div>
        <CopySessionId sessionId={sessionId} className="intro__session" />
        <SessionRecoveryGuide />
        {rowError ? (
          <p className="intro__error" role="alert">
            {rowError}
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
            disabled={!rowReady}
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
