import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import { cardImage } from '../assets/cards/index.js'
import './LessonIntro.css'

const OVERVIEW = {
  title: 'What Is Magic?',
  time: '~4 min',
  image: new URL('../assets/batrlefield-simple.jpg', import.meta.url).href,
}

const FIRST_GAME = {
  title: 'Starting a Game & Your First Turn',
  time: '~5 min',
  image: cardImage('land-forest.jpg'),
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

export default function LessonIntro() {
  const navigate = useNavigate()

  return (
    <PageLayout
      title="Lessons Overview · Learn to Play MTG"
      className="lesson-intro"
      showKeywordDictionary
    >
      <div className="lesson-intro__frame page-layout__content-frame">
        <p className="lesson-intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-intro__heading">What comes next</h1>
        <hr className="lesson-intro__rule" aria-hidden="true" />

        <div className="lesson-intro__body">
          <p className="lesson-intro__paragraph">
            You finished the pre-test. Next you&apos;ll see a short overview of Magic, walk through
            starting a game and your first turn, then four lessons before the post-test.
          </p>
          <p className="lesson-intro__paragraph">
            Official rules terms appear in gold. Hover or tap one for a short definition, or open
            the Keyword guide in the corner for the full list, including informal terms like
            summoning sickness.
          </p>
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
          <li>
            <img
              className="lesson-intro__lesson-image"
              src={FIRST_GAME.image}
              alt="Starting a game preview"
            />
            <span className="lesson-intro__lesson-num">Overview</span>
            {': '}
            {FIRST_GAME.title}
            <span className="lesson-intro__lesson-time"> ({FIRST_GAME.time})</span>
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
