import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBrowserBackConfirm } from '../hooks/useBrowserBackConfirm.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePosttest } from '../lib/db.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { POSTTEST_LEAVE_CONFIRM_MESSAGE } from '../lib/lessonNav.js'
import { calculateTestScore } from '../lib/testScore.js'

export default function PostTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const {
    sessionId,
    selectedQuestions,
    setPosttestAnswer,
    posttestAnswers,
  } = session

  useScreenTime(session, 'PostTest')
  useBrowserBackConfirm(true, POSTTEST_LEAVE_CONFIRM_MESSAGE)

  const handleComplete = useCallback(
    (lastAnswer) => {
      const answers = { ...posttestAnswers, ...lastAnswer }
      const score = calculateTestScore(selectedQuestions, answers)
      savePosttest(sessionId, answers, score)
      navigate('/calculating')
    },
    [posttestAnswers, selectedQuestions, sessionId, navigate],
  )

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return (
      <div className="pretest">
        <div className="pretest__frame">
          <p className="pretest__empty">No questions loaded. Return to the start and try again.</p>
          <div className="pretest__actions">
            <button
              type="button"
              className="pretest__button"
              onClick={async () => {
                if (!(await confirm(POSTTEST_LEAVE_CONFIRM_MESSAGE))) return
                navigate('/welcome')
              }}
            >
              Return to Welcome
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TestQuestionFlow
      testLabel="Post-Test"
      progressIndex={PROGRESS.POSTTEST}
      selectedQuestions={selectedQuestions}
      setAnswer={setPosttestAnswer}
      onComplete={handleComplete}
      firstQuestionBackPath="/lesson/complete"
      leaveConfirmMessage={POSTTEST_LEAVE_CONFIRM_MESSAGE}
      lastButtonLabel="Submit"
      introNote="These are the same questions as the pre-test. Answer from what you learned in the lessons."
    />
  )
}
