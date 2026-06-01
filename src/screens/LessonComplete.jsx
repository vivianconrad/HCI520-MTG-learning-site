import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './LessonComplete.css'

const RECAP = [
  'How to read a card and what each part means',
  'The seven card types and when you can play them',
  'How a turn is structured from start to finish',
  'How card types and timing work together in real scenarios',
]

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
            You&apos;ve worked through all four lessons. Here&apos;s what you covered:
          </p>
          <ul className="lesson-complete__recap">
            {RECAP.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="lesson-complete__paragraph">
            Now it&apos;s time to answer the same questions you saw at the start. Don&apos;t
            overthink it. Just go with what you know.
          </p>
        </div>

        <CopySessionId sessionId={session.sessionId} className="lesson-complete__session" />

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
