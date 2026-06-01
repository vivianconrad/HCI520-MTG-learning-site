import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBrowserBackConfirm } from '../hooks/useBrowserBackConfirm.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePretest } from '../lib/db.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { PRETEST_LEAVE_CONFIRM_MESSAGE } from '../lib/lessonNav.js'
import { calculateTestScore } from '../lib/testScore.js'

export default function PreTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const {
    sessionId,
    selectedQuestions,
    selectQuestions,
    setPretestAnswer,
    pretestAnswers,
  } = session

  useScreenTime(session, 'PreTest')
  useBrowserBackConfirm(true, PRETEST_LEAVE_CONFIRM_MESSAGE)

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  const handleComplete = useCallback(
    (lastAnswer) => {
      const answers = { ...pretestAnswers, ...lastAnswer }
      const score = calculateTestScore(selectedQuestions, answers)
      savePretest(sessionId, answers, score)
      navigate('/lesson/intro')
    },
    [pretestAnswers, selectedQuestions, sessionId, navigate],
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
                if (!(await confirm(PRETEST_LEAVE_CONFIRM_MESSAGE))) return
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
      testLabel="Pre-Test"
      progressIndex={PROGRESS.PRETEST}
      selectedQuestions={selectedQuestions}
      setAnswer={setPretestAnswer}
      onComplete={handleComplete}
      firstQuestionBackPath="/intro"
      leaveConfirmMessage={PRETEST_LEAVE_CONFIRM_MESSAGE}
      lastButtonLabel="Begin Lessons"
    />
  )
}
