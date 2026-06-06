import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import { cardImage } from '../assets/cards/index.js'
import './LessonIntro.css'

const OVERVIEW = {
  title: 'What Is Magic?',
  time: '~6 min',
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

export default function LessonIntro({ session: _session }) {
  const navigate = useNavigate()

  return (
    <PageLayout title="Lessons Overview · Learn to Play MTG" className="lesson-intro" showKeywordDictionary>
      <div className="lesson-intro__frame page-layout__content-frame">
        <p className="lesson-intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-intro__heading">Here&apos;s What&apos;s Coming</h1>
        <hr className="lesson-intro__rule" aria-hidden="true" />

        <div className="lesson-intro__body">
          <p className="lesson-intro__paragraph">
            You finished the pre-test. Great work. Before the lessons begin, here is a quick preview
            of what you will cover.
          </p>
          <p className="lesson-intro__paragraph">
            You&apos;ll start with a short overview, then work through four interactive lessons.
            Official rules terms appear in gold — hover or tap one for a quick definition. Use the
            Keyword guide in the corner for the full list, including informal terms like summoning
            sickness.
          </p>
          <p className="lesson-intro__paragraph">Here&apos;s what we&apos;ll go through:</p>
        </div>

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
              <img className="lesson-intro__lesson-image" src={lesson.image} alt={`Lesson ${lesson.num} card preview`} />
              <span className="lesson-intro__lesson-num">Lesson {lesson.num}</span>
              {': '}
              {lesson.title}
              <span className="lesson-intro__lesson-time"> ({lesson.time})</span>
            </li>
          ))}
        </ul>

        <p className="lesson-intro__closing">Take your time with each lesson. There&apos;s no rush.</p>

        <div className="lesson-intro__actions">
          <button
            type="button"
            className="lesson-intro__button lesson-intro__button--back"
            onClick={() => navigate('/pretest-complete')}
          >
            Back
          </button>
          <button
            type="button"
            className="lesson-intro__button lesson-intro__button--next"
            onClick={() => navigate('/what-is-mtg')}
          >
            Continue to What Is Magic?
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_INTRO} />
      </div>
    </PageLayout>
  )
}
