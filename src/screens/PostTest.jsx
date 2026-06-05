import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBrowserBackConfirm } from '../hooks/useBrowserBackConfirm.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePosttest } from '../lib/db.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import {
  POSTTEST_LEAVE_CONFIRM_MESSAGE,
  POSTTEST_LEAVE_CONFIRM_TITLE,
} from '../lib/lessonNav.js'
import { calculateTestScore } from '../lib/testScore.js'
import useRedirectIfTestComplete from '../hooks/useRedirectIfTestComplete.js'

export default function PostTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const {
    sessionId,
    selectedQuestions,
    setPosttestAnswer,
    posttestAnswers,
    posttestCompleted,
    markPosttestCompleted,
  } = session

  useRedirectIfTestComplete(posttestCompleted, '/results')
  useScreenTime(session, 'PostTest')
  useBrowserBackConfirm(
    !posttestCompleted,
    POSTTEST_LEAVE_CONFIRM_MESSAGE,
    POSTTEST_LEAVE_CONFIRM_TITLE,
  )

  const handleComplete = useCallback(
    async (lastAnswer) => {
      const answers = { ...posttestAnswers, ...lastAnswer }
      const score = calculateTestScore(selectedQuestions, answers)
      await savePosttest(sessionId, answers, score)
      markPosttestCompleted()
      navigate('/calculating', { replace: true })
    },
    [posttestAnswers, selectedQuestions, sessionId, navigate, markPosttestCompleted],
  )

  if (posttestCompleted) {
    return null
  }

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return (
      <PageLayout title="Post-Test · Learn to Play MTG" className="pretest">
        <div className="pretest__frame">
          <h1 className="pretest__empty">Post-Test unavailable</h1>
          <p className="pretest__empty">No questions loaded. Return to the start and try again.</p>
          <div className="pretest__actions">
            <button
              type="button"
              className="pretest__button"
              onClick={async () => {
                if (
                  !(await confirm(POSTTEST_LEAVE_CONFIRM_MESSAGE, {
                    title: POSTTEST_LEAVE_CONFIRM_TITLE,
                  }))
                ) {
                  return
                }
                navigate('/welcome')
              }}
            >
              Return to Welcome
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Post-Test · Learn to Play MTG" className="pretest">
      <TestQuestionFlow
        testLabel="Post-Test"
        progressIndex={PROGRESS.POSTTEST}
        selectedQuestions={selectedQuestions}
        setAnswer={setPosttestAnswer}
        onComplete={handleComplete}
        firstQuestionBackPath="/lesson/complete"
        leaveConfirmMessage={POSTTEST_LEAVE_CONFIRM_MESSAGE}
        leaveConfirmTitle={POSTTEST_LEAVE_CONFIRM_TITLE}
        lastButtonLabel="Submit"
        introNote="These are the same questions as the pre-test. Answer from what you learned in the lessons."
      />
    </PageLayout>
  )
}
