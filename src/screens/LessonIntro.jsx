import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrowserBackNotice from '../components/BrowserBackNotice.jsx'
import KeywordTooltip from '../components/KeywordTooltip.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import { useBlockBrowserBack } from '../hooks/useBlockBrowserBack.js'
import { saveCuriosityFocus } from '../lib/db.js'
import { describeSaveFailure } from '../lib/sessionErrors.js'
import { CURIOSITY_OPTIONS } from '../lib/learnerChoice.js'
import { cardImage } from '../assets/cards/index.js'
import './LessonIntro.css'

const GOLD_TERMS_HELP = {
  term: 'Gold-highlighted terms',
  definition:
    'Lessons mark official rules terms in gold, like this example. On a computer with a mouse, hover to read a short definition. On a phone or tablet, tap to open it, then tap again or press Escape to close. The same pattern works for every gold word in the lessons.',
}

const OVERVIEW = {
  title: 'What Is Magic?',
  time: '~5 min',
  image: new URL('../assets/batrlefield-simple.jpg', import.meta.url).href,
}

const LESSONS = [
  {
    num: '01',
    title: 'How to Read a Card',
    time: '~4 min',
    image: cardImage('creature-shadowmage-infiltrator.webp'),
  },
  {
    num: '02',
    title: 'The Seven Card Types',
    time: '~4 min',
    image: cardImage('artifact-sol-ring.jpg'),
  },
  {
    num: '03',
    title: 'How a Turn Works',
    time: '~4 min',
    image: cardImage('land-forest.jpg'),
  },
  {
    num: '04',
    title: 'Putting It Together',
    time: '~5 min',
    image: cardImage('instant-shock.jpg'),
  },
]

export default function LessonIntro({ session }) {
  const navigate = useNavigate()
  useBlockBrowserBack()
  const { sessionId, sessionSecret, curiosityFocus, setCuriosityFocus } = session
  const [selectedFocus, setSelectedFocus] = useState(curiosityFocus)
  const [saving, setSaving] = useState(false)
  const [saveWarning, setSaveWarning] = useState(null)

  const selectedOption = CURIOSITY_OPTIONS.find((option) => option.id === selectedFocus)

  async function handleContinue() {
    if (!selectedFocus) return
    setCuriosityFocus(selectedFocus)
    setSaving(true)
    setSaveWarning(null)
    if (sessionId && sessionSecret) {
      const result = await saveCuriosityFocus(sessionId, sessionSecret, selectedFocus)
      if (!result?.ok) {
        if (import.meta.env.DEV) {
          console.warn('[LessonIntro] saveCuriosityFocus failed:', result)
        }
        setSaving(false)
        setSaveWarning(describeSaveFailure(result))
        return
      }
    }
    setSaving(false)
    navigate('/what-is-mtg', { replace: true })
  }

  return (
    <PageLayout
      title="Lessons Overview · Learn to Play MTG"
      className="lesson-intro"
      showKeywordDictionary
    >
      <div className="lesson-intro__frame page-layout__content-frame">
        <BrowserBackNotice />
        <p className="lesson-intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-intro__heading">What comes next</h1>
        <hr className="lesson-intro__rule" aria-hidden="true" />

        <div className="lesson-intro__body">
          <p className="lesson-intro__paragraph">
            You finished the pre-test. Next you&apos;ll see a short overview of Magic, then four
            lessons before the post-test.
          </p>
          <p className="lesson-intro__paragraph">
            Throughout the lessons, official rules terms{' '}
            <KeywordTooltip term={GOLD_TERMS_HELP.term} definition={GOLD_TERMS_HELP.definition}>
              appear in gold
            </KeywordTooltip>
            . For a searchable list of every term used in this course, including informal ones like
            summoning sickness, open the Keyword guide button in the corner of the page.
          </p>
        </div>

        <fieldset className="lesson-intro__curiosity">
          <legend className="lesson-intro__curiosity-legend">
            What are you most curious about? (for the study)
          </legend>
          <p className="lesson-intro__curiosity-note">
            Pick one so we know your interests. You will still complete every lesson in order.
          </p>
          <div className="lesson-intro__curiosity-options">
            {CURIOSITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`lesson-intro__curiosity-card${
                  selectedFocus === option.id ? ' lesson-intro__curiosity-card--selected' : ''
                }`}
                aria-pressed={selectedFocus === option.id}
                onClick={() => setSelectedFocus(option.id)}
              >
                <span className="lesson-intro__curiosity-label">{option.label}</span>
                <span className="lesson-intro__curiosity-hint">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {selectedOption ? (
          <p className="lesson-intro__curiosity-ack" role="status">
            {selectedOption.lessonNum
              ? `Got it. We noted your interest in ${selectedOption.label.toLowerCase()}. Lesson ${selectedOption.lessonNum} covers that topic, and you will still go through every lesson.`
              : 'Got it. We noted that you prefer the full guide. You will walk through every lesson in order.'}
          </p>
        ) : null}

        <ul className="lesson-intro__list">
          <li>
            <img
              className="lesson-intro__lesson-image"
              src={OVERVIEW.image}
              alt="Overview battlefield diagram preview"
            />
            <span className="lesson-intro__lesson-num">Overview</span>
            {': '}
            {OVERVIEW.title}
            <span className="lesson-intro__lesson-time"> ({OVERVIEW.time})</span>
          </li>
          {LESSONS.map((lesson) => (
            <li key={lesson.num}>
              <img
                className="lesson-intro__lesson-image"
                src={lesson.image}
                alt={`Lesson ${lesson.num} card preview`}
              />
              <span className="lesson-intro__lesson-num">Lesson {lesson.num}</span>
              {': '}
              {lesson.title}
              <span className="lesson-intro__lesson-time"> ({lesson.time})</span>
            </li>
          ))}
        </ul>

        <p className="lesson-intro__closing">Work at your own pace.</p>

        {saveWarning ? (
          <div className="lesson-intro__save-warning" role="alert">
            <p>{saveWarning}</p>
            <button
              type="button"
              className="lesson-intro__button"
              onClick={() => {
                setSaveWarning(null)
                navigate('/what-is-mtg', { replace: true })
              }}
            >
              Continue without saving
            </button>
          </div>
        ) : null}

        <div className="lesson-intro__actions lesson-intro__actions--end">
          <button
            type="button"
            className="lesson-intro__button lesson-intro__button--next"
            disabled={!selectedFocus || saving}
            onClick={handleContinue}
          >
            {saving ? 'Saving…' : 'Continue to What Is Magic?'}
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_INTRO} />
      </div>
    </PageLayout>
  )
}
