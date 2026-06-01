import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './LessonIntro.css'

const LESSONS = [
  'Lesson 1: How to read a card and what each part means',
  'Lesson 2: The seven card types and when you can play them',
  'Lesson 3: How a turn is structured from start to finish',
  'Lesson 4: Putting it all together with real game scenarios',
]

export default function LessonIntro({ session }) {
  void session
  const navigate = useNavigate()

  return (
    <div className="lesson-intro">
      <div className="lesson-intro__frame">
        <p className="lesson-intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-intro__heading">Here&apos;s What&apos;s Coming</h1>
        <hr className="lesson-intro__rule" aria-hidden="true" />

        <div className="lesson-intro__body">
          <p className="lesson-intro__paragraph">You just finished the pre-test. Now it&apos;s time to learn.</p>
          <p className="lesson-intro__paragraph">
            Over the next four lessons, you&apos;ll cover everything you need to sit down and play
            your first game of Magic: The Gathering.
          </p>
          <p className="lesson-intro__paragraph">Here&apos;s what we&apos;ll go through:</p>
        </div>

        <ul className="lesson-intro__list">
          {LESSONS.map((lesson) => (
            <li key={lesson}>{lesson}</li>
          ))}
        </ul>

        <p className="lesson-intro__closing">Take your time with each lesson. There&apos;s no rush.</p>

        <div className="lesson-intro__actions">
          <button
            type="button"
            className="lesson-intro__button"
            onClick={() => navigate('/lesson/1')}
          >
            Let&apos;s Go →
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_INTRO} />
      </div>
    </div>
  )
}
