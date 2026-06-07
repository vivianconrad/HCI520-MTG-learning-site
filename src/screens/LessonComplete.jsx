import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import { saveLessonComplete, savePosttestReadiness } from '../lib/db.js'
import { describeSaveFailure } from '../lib/sessionErrors.js'
import { PRACTICE_SCENARIO_COUNT } from '../lib/lessonConstants.js'
import PageLayout from '../components/PageLayout.jsx'
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

const READINESS_LABELS = {
  1: 'Not ready yet',
  2: 'A little unsure',
  3: 'Somewhat ready',
  4: 'Mostly ready',
  5: 'Ready to try',
}

export default function LessonComplete({ session }) {
  const navigate = useNavigate()
  const {
    sessionId,
    sessionSecret,
    scenariosAttempted,
    screenTimes,
    setLessonsCompleted,
    posttestCompleted,
    posttestReadiness,
    setPosttestReadiness,
  } = session
  const completedAllPractice = scenariosAttempted >= PRACTICE_SCENARIO_COUNT
  const [saveWarning, setSaveWarning] = useState(null)
  const [saveOk, setSaveOk] = useState(false)
  const [saving, setSaving] = useState(true)
  const [readiness, setReadiness] = useState(posttestReadiness)
  const [readinessSaving, setReadinessSaving] = useState(false)
  const saveStarted = useRef(false)

  const persistLessonComplete = useCallback(async () => {
    setSaving(true)
    setSaveWarning(null)

    const result = await saveLessonComplete(
      sessionId,
      sessionSecret,
      scenariosAttempted,
      screenTimes,
      readiness ?? posttestReadiness
    )

    if (result?.ok) {
      setLessonsCompleted(true)
      setSaveOk(true)
      setSaveWarning(null)
    } else {
      if (import.meta.env.DEV) {
        console.warn('[LessonComplete] saveLessonComplete failed:', result)
      }
      setSaveOk(false)
      setSaveWarning(describeSaveFailure(result))
    }

    setSaving(false)
  }, [
    sessionId,
    sessionSecret,
    scenariosAttempted,
    screenTimes,
    readiness,
    posttestReadiness,
    setLessonsCompleted,
  ])

  useEffect(() => {
    if (saveStarted.current) return
    saveStarted.current = true
    persistLessonComplete()
  }, [persistLessonComplete])

  async function handleReadiness(value) {
    setReadiness(value)
    setPosttestReadiness(value)
    setReadinessSaving(true)
    if (sessionId && sessionSecret) {
      await savePosttestReadiness(sessionId, sessionSecret, value)
    }
    setReadinessSaving(false)
  }

  const canChooseNext = saveOk && readiness != null && !readinessSaving

  return (
    <PageLayout title="Lessons Complete · Learn to Play MTG" className="lesson-complete">
      <div className="lesson-complete__frame">
        <p className="lesson-complete__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-complete__heading">You&apos;ve finished all four lessons.</h1>
        <p className="lesson-complete__tagline">Your mana is tapped, your hand is ready.</p>
        <hr className="lesson-complete__rule" aria-hidden="true" />

        <div className="lesson-complete__body">
          <p className="lesson-complete__paragraph">
            {completedAllPractice
              ? 'You finished all four lessons, including every practice scenario in Lesson 4. Topics from the lessons:'
              : 'You finished all four lessons but skipped some optional practice in Lesson 4. Topics from the lessons:'}
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
        <div className="lesson-complete__review-strip" role="group" aria-label="Cards covered in lessons">
          {REVIEW_CARDS.map((src, index) => (
            <img
              key={src}
              className="lesson-complete__review-card"
              src={src}
              alt={`Lesson review card ${index + 1}`}
            />
          ))}
        </div>

        <CopySessionId sessionId={session.sessionId} className="lesson-complete__session" />

        {saving ? (
          <p className="lesson-complete__save-warning" role="status">
            Saving your lesson progress…
          </p>
        ) : null}

        {saveWarning ? (
          <div className="lesson-complete__save-warning-block" role="alert">
            <p className="lesson-complete__save-warning">{saveWarning}</p>
            <button
              type="button"
              className="lesson-complete__button lesson-complete__button--next"
              onClick={() => {
                saveStarted.current = false
                persistLessonComplete()
              }}
            >
              Retry save
            </button>
          </div>
        ) : null}

        <fieldset className="lesson-complete__readiness">
          <legend className="lesson-complete__readiness-legend">
            How ready do you feel for the post-test?
          </legend>
          <div className="lesson-complete__readiness-scale" role="group" aria-label="Readiness 1 to 5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`lesson-complete__readiness-btn${
                  readiness === value ? ' lesson-complete__readiness-btn--selected' : ''
                }`}
                aria-pressed={readiness === value}
                disabled={!saveOk || readinessSaving}
                onClick={() => handleReadiness(value)}
              >
                <span className="lesson-complete__readiness-num">{value}</span>
                <span className="lesson-complete__readiness-label">{READINESS_LABELS[value]}</span>
              </button>
            ))}
          </div>
          {readinessSaving ? (
            <p className="lesson-complete__readiness-status" role="status">
              Saving your response…
            </p>
          ) : null}
          {readiness != null && readiness <= 2 && completedAllPractice ? (
            <p className="lesson-complete__reflection" role="note">
              You finished every practice scenario even though you feel less than ready. That work
              matters — the post-test is just a check-in on what stuck, not a grade and not compared
              to anyone else.
            </p>
          ) : null}
        </fieldset>

        {canChooseNext ? (
          <div className="lesson-complete__fork">
            <h2 className="lesson-complete__fork-heading">What would you like to do next?</h2>
            <div className="lesson-complete__fork-options">
              {!completedAllPractice ? (
                <button
                  type="button"
                  className="lesson-complete__choice lesson-complete__choice--practice"
                  onClick={() => navigate('/lesson/4')}
                >
                  <span className="lesson-complete__choice-label">Practice one more scenario</span>
                  <span className="lesson-complete__choice-hint">
                    Return to Lesson 4 for optional practice before the post-test
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                className="lesson-complete__choice lesson-complete__choice--finish"
                onClick={() => navigate(posttestCompleted ? '/results' : '/posttest-prep')}
              >
                <span className="lesson-complete__choice-label">
                  {posttestCompleted ? 'View results' : 'Start post-test'}
                </span>
                <span className="lesson-complete__choice-hint">
                  {posttestCompleted
                    ? 'See how you did on the pre-test and post-test'
                    : 'Review what to expect, then answer the same questions again'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <p className="lesson-complete__fork-hint" role="status">
            {!saveOk
              ? 'Lesson progress must save before you can continue.'
              : 'Choose how ready you feel above to unlock your next step.'}
          </p>
        )}

        <ProgressDots activeIndex={PROGRESS.LESSON_COMPLETE} />
      </div>
    </PageLayout>
  )
}
