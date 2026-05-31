import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './LessonComplete.css'

export default function LessonComplete({ session }) {
  const navigate = useNavigate()

  return (
    <div className="lesson-complete">
      <div className="lesson-complete__frame">
        <p className="lesson-complete__breadcrumb">
          Magic: The Gathering · Beginner&apos;s Guide
        </p>
        <h1 className="lesson-complete__heading">Your mana is tapped, your hand is ready.</h1>
        <hr className="lesson-complete__rule" aria-hidden="true" />

        <div className="lesson-complete__body">
          <p className="lesson-complete__paragraph">
            You&apos;ve worked through all four lessons. You know how to read a card, what the seven
            card types do, how a turn is structured, and how it all fits together.
          </p>
          <p className="lesson-complete__paragraph">
            Now it&apos;s time to answer the same questions you saw at the start. Don&apos;t
            overthink it. Just go with what you know.
          </p>
        </div>

        <p className="lesson-complete__session">Your session ID: {session.sessionId}</p>

        <div className="lesson-complete__actions">
          <button
            type="button"
            className="lesson-complete__button"
            onClick={() => navigate('/posttest')}
          >
            Begin Final Questions →
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_COMPLETE} />
      </div>
    </div>
  )
}
