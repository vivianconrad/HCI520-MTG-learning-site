import { useNavigate } from 'react-router-dom'
import KeywordTooltip from '../components/KeywordTooltip.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
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
            You finished the pre-test. Next you&apos;ll see a short overview of Magic, then four
            lessons before the post-test.
          </p>
          <p className="lesson-intro__paragraph">
            Throughout the lessons, official rules terms{' '}
            <KeywordTooltip term={GOLD_TERMS_HELP.term} definition={GOLD_TERMS_HELP.definition}>
              appear in gold
            </KeywordTooltip>
            . For a searchable list of every term used in this course, including
            informal ones like summoning sickness, open the Keyword guide button in the corner of
            the page.
          </p>
          <p className="lesson-intro__paragraph">
            Magic has a large vocabulary of keywords and shorthand, and even experienced players
            look things up. This course is not meant to make you memorize all of them. The guide is
            there when you need it—use it as a reference whenever a word is unfamiliar, and focus on
            the ideas in each lesson instead.
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
