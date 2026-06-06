import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import './LessonIntro.css'

export default function PretestComplete({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'PretestComplete')

  return (
    <PageLayout title="Pre-Test Complete · Learn to Play MTG" className="lesson-intro">
      <div className="lesson-intro__frame">
        <p className="lesson-intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="lesson-intro__heading">Pre-Test Complete</h1>
        <hr className="lesson-intro__rule" aria-hidden="true" />

        <div className="lesson-intro__body">
          <p className="lesson-intro__paragraph">
            Thank you. Your pre-test answers are saved. If many questions felt unfamiliar, that is
            expected. The pre-test measures what you know before the lessons, not whether you are
            already an expert.
          </p>
          <p className="lesson-intro__paragraph">
            Next comes a preview of the path, a Magic overview, a first-turn walkthrough, four
            lessons, and the post-test with the same questions.
          </p>
        </div>

        <p className="lesson-intro__closing">Continue when you&apos;re ready.</p>

        <div className="lesson-intro__actions lesson-intro__actions--end">
          <button
            type="button"
            className="lesson-intro__button lesson-intro__button--next"
            onClick={() => navigate('/lesson/intro')}
          >
            Continue
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.PRETEST_COMPLETE} />
      </div>
    </PageLayout>
  )
}
