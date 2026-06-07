import { useNavigate } from 'react-router-dom'
import BrowserBackNotice from '../components/BrowserBackNotice.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import { useBlockBrowserBack } from '../hooks/useBlockBrowserBack.js'
import './LessonIntro.css'

const PREP_POINTS = [
  'These are the same 10 questions you answered before the lessons.',
  'Answer from what you learned. There is no glossary or gold-term helper during the test.',
  'You will not see whether each answer is correct until the results screen at the end.',
]

export default function PostTestPrep() {
  const navigate = useNavigate()
  useBlockBrowserBack()

  return (
    <PageLayout title="Post-Test Prep · Learn to Play MTG" className="lesson-intro">
      <div className="lesson-intro__frame page-layout__content-frame">
        <BrowserBackNotice />
        <p className="lesson-intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-intro__heading">Ready for the post-test?</h1>
        <hr className="lesson-intro__rule" aria-hidden="true" />

        <div className="lesson-intro__body">
          <p className="lesson-intro__paragraph">
            You finished all four lessons. The post-test measures what you learned using the same
            questions as the pre-test.
          </p>
          <ul className="lesson-intro__list">
            {PREP_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <p className="lesson-intro__closing">Take a breath if you need one, then begin when ready.</p>

        <div className="lesson-intro__actions lesson-intro__actions--end">
          <button
            type="button"
            className="lesson-intro__button lesson-intro__button--next"
            onClick={() => navigate('/posttest', { replace: true })}
          >
            Begin post-test
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.POSTTEST_PREP} stepLabel="Post-test prep" />
      </div>
    </PageLayout>
  )
}
