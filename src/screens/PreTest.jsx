import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBrowserBackConfirm } from '../hooks/useBrowserBackConfirm.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePretest } from '../lib/db.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import {
  PRETEST_LEAVE_CONFIRM_MESSAGE,
  PRETEST_LEAVE_CONFIRM_TITLE,
} from '../lib/lessonNav.js'
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
  useBrowserBackConfirm(true, PRETEST_LEAVE_CONFIRM_MESSAGE, PRETEST_LEAVE_CONFIRM_TITLE)

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  const handleComplete = useCallback(
    async (lastAnswer) => {
      const answers = { ...pretestAnswers, ...lastAnswer }
      const score = calculateTestScore(selectedQuestions, answers)
      await savePretest(sessionId, answers, score)
      navigate('/lesson/intro')
    },
    [pretestAnswers, selectedQuestions, sessionId, navigate],
  )

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return (
      <PageLayout title="Pre-Test · Learn to Play MTG" className="pretest">
        <div className="pretest__frame">
          <h1 className="pretest__empty">Pre-Test unavailable</h1>
          <p className="pretest__empty">No questions loaded. Return to the start and try again.</p>
          <div className="pretest__actions">
            <button
              type="button"
              className="pretest__button"
              onClick={async () => {
                if (
                  !(await confirm(PRETEST_LEAVE_CONFIRM_MESSAGE, {
                    title: PRETEST_LEAVE_CONFIRM_TITLE,
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
    <PageLayout title="Pre-Test · Learn to Play MTG" className="pretest">
      <TestQuestionFlow
        testLabel="Pre-Test"
        progressIndex={PROGRESS.PRETEST}
        selectedQuestions={selectedQuestions}
        setAnswer={setPretestAnswer}
        onComplete={handleComplete}
        firstQuestionBackPath="/intro"
        leaveConfirmMessage={PRETEST_LEAVE_CONFIRM_MESSAGE}
        leaveConfirmTitle={PRETEST_LEAVE_CONFIRM_TITLE}
        lastButtonLabel="Begin Lessons"
      />
    </PageLayout>
  )
}
