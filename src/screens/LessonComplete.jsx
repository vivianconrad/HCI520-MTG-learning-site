import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import { saveLessonProgress, saveScreenTime } from '../lib/db.js'
import { PRACTICE_SCENARIO_COUNT } from '../lib/lessonConstants.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import PageLayout from '../components/PageLayout.jsx'
import { LESSON_BACK_CONFIRM_MESSAGE, LESSON_BACK_CONFIRM_TITLE } from '../lib/lessonNav.js'
import { cardImage } from '../assets/cards/index.js'
import './LessonComplete.css'

const REVIEW_CARDS = [
  cardImage('creature-shadowmage-infiltrator.webp'),
  cardImage('instant-counterspell.webp'),
  cardImage('sorcery-cultivate.jpg'),
  cardImage('artifact-sol-ring.jpg'),
  cardImage('land-woodland-cemetery.jpg'),
]

const RECAP = [
  'How to read a card and what each part means',
  'The seven card types and when you can cast them',
  'How a turn is structured from start to finish',
  'How card types and timing work together in real scenarios',
]

export default function LessonComplete({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const { sessionId, scenariosAttempted, screenTimes, setLessonsCompleted } = session
  const completedAllPractice = scenariosAttempted >= PRACTICE_SCENARIO_COUNT

  useEffect(() => {
    setLessonsCompleted(true)
    saveLessonProgress(sessionId, true, scenariosAttempted)
  }, [sessionId, scenariosAttempted, setLessonsCompleted])

  useEffect(() => {
    saveScreenTime(sessionId, screenTimes)
  }, [sessionId, screenTimes])

  return (
    <PageLayout title="Lessons Complete · Learn to Play MTG" className="lesson-complete">
      <div className="lesson-complete__frame">
        <p className="lesson-complete__breadcrumb">
          Magic: The Gathering · Beginner&apos;s Guide
        </p>
        <h1 className="lesson-complete__heading">Your mana is tapped, your hand is ready.</h1>
        <hr className="lesson-complete__rule" aria-hidden="true" />

        <div className="lesson-complete__body">
          <p className="lesson-complete__paragraph">
            {completedAllPractice
              ? "You've worked through all four lessons, including every practice scenario in Lesson 4. Here's what you covered:"
              : "You've finished all four lesson modules. You skipped some optional practice scenarios in Lesson 4. You can return to them anytime before the post-test. Here's what you covered:"}
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
        <div className="lesson-complete__review-strip" aria-label="Cards covered in lessons">
          {REVIEW_CARDS.map((src, index) => (
            <img key={src} className="lesson-complete__review-card" src={src} alt={`Lesson review card ${index + 1}`} />
          ))}
        </div>

        <CopySessionId sessionId={session.sessionId} className="lesson-complete__session" />

        <div className="lesson-complete__actions">
          <button
            type="button"
            className="lesson-complete__button lesson-complete__button--back"
            onClick={async () => {
              if (
                !(await confirm(LESSON_BACK_CONFIRM_MESSAGE, {
                  title: LESSON_BACK_CONFIRM_TITLE,
                }))
              ) {
                return
              }
              navigate('/lesson/4')
            }}
          >
            Back to Lesson 4
          </button>
          <button
            type="button"
            className="lesson-complete__button lesson-complete__button--next"
            onClick={() => navigate('/posttest')}
          >
            Start Post-Test
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_COMPLETE} />
      </div>
    </PageLayout>
  )
}
