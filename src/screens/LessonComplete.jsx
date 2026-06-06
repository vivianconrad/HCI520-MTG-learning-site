import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import { isParticipantUpdateBlocked, saveLessonProgress, saveScreenTime } from '../lib/db.js'
import { SESSION_SAVE_FAILED_MESSAGE } from '../lib/sessionErrors.js'
import { PRACTICE_SCENARIO_COUNT } from '../lib/lessonConstants.js'
import { useConfirm } from '../context/useConfirm.js'
import PageLayout from '../components/PageLayout.jsx'
import { LESSON_BACK_CONFIRM_MESSAGE, LESSON_BACK_CONFIRM_TITLE } from '../lib/lessonNav.js'
import { cardImage } from '../assets/cards/index.js'
import './LessonComplete.css'

const REVIEW_CARDS = [
  cardImage('creature-shadowmage-infiltrator.webp'),
  cardImage('instant-counterspell.webp'),
  cardImage('sorcery-cultivate.jpg'),
  cardImage('artifact-sol-ring.jpg'),
  cardImage('enchantment-sylvan-library.webp'),
  cardImage('planeswalker-nahiri.webp'),
  cardImage('land-woodland-cemetery.jpg'),
]

const RECAP = [
  'How to read a card and what each part means',
  'The seven card types and when you can play or cast them',
  'How a turn is structured from start to finish',
  'How card types and timing work together in real scenarios',
]

export default function LessonComplete({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const {
    sessionId,
    sessionSecret,
    scenariosAttempted,
    screenTimes,
    setLessonsCompleted,
    posttestCompleted,
  } = session
  const completedAllPractice = scenariosAttempted >= PRACTICE_SCENARIO_COUNT
  const [saveWarning, setSaveWarning] = useState(null)
  const hasSavedRef = useRef(false)

  useEffect(() => {
    if (hasSavedRef.current) return
    hasSavedRef.current = true

    setLessonsCompleted(true)
    saveLessonProgress(sessionId, sessionSecret, true, scenariosAttempted).then((result) => {
      if (isParticipantUpdateBlocked(result)) {
        if (import.meta.env.DEV) {
          console.warn('[LessonComplete] saveLessonProgress blocked:', result)
        }
        setSaveWarning(SESSION_SAVE_FAILED_MESSAGE)
      }
    })
    saveScreenTime(sessionId, sessionSecret, screenTimes).then((result) => {
      if (isParticipantUpdateBlocked(result)) {
        if (import.meta.env.DEV) {
          console.warn('[LessonComplete] saveScreenTime blocked:', result)
        }
        setSaveWarning(SESSION_SAVE_FAILED_MESSAGE)
      }
    })
    // Save once on mount with values captured at visit time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageLayout title="Lessons Complete · Learn to Play MTG" className="lesson-complete">
      <div className="lesson-complete__frame">
        <p className="lesson-complete__breadcrumb">
          Magic: The Gathering · Beginner&apos;s Guide
        </p>
        <h1 className="lesson-complete__heading">You&apos;ve finished all four lessons.</h1>
        <p className="lesson-complete__tagline">Your mana is tapped, your hand is ready.</p>
        <hr className="lesson-complete__rule" aria-hidden="true" />

        <div className="lesson-complete__body">
          <p className="lesson-complete__paragraph">
            {completedAllPractice
              ? 'You finished all four lessons, including every practice scenario in Lesson 4. Topics from the lessons:'
              : 'You finished all four lessons but skipped some optional practice in Lesson 4. You can go back before the post-test. Topics from the lessons:'}
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

        {saveWarning ? (
          <p className="lesson-complete__save-warning" role="status">
            {saveWarning}
          </p>
        ) : null}

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
            onClick={() => navigate(posttestCompleted ? '/results' : '/posttest')}
          >
            {posttestCompleted ? 'View results' : 'Start Post-Test'}
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_COMPLETE} />
      </div>
    </PageLayout>
  )
}
