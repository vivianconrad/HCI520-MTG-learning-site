import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBrowserBackConfirm } from '../hooks/useBrowserBackConfirm.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePosttest } from '../lib/db.js'
import { SESSION_SAVE_FAILED_MESSAGE } from '../lib/sessionErrors.js'
import { useConfirm } from '../context/useConfirm.js'
import { POSTTEST_LEAVE_CONFIRM_MESSAGE, POSTTEST_LEAVE_CONFIRM_TITLE } from '../lib/lessonNav.js'
import { calculateTestScoreAsync } from '../lib/testScore.js'
import useRedirectIfTestComplete from '../hooks/useRedirectIfTestComplete.js'

export default function PostTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [saveWarning, setSaveWarning] = useState(null)
  const {
    sessionId,
    sessionSecret,
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
    POSTTEST_LEAVE_CONFIRM_TITLE
  )

  const handleComplete = useCallback(
    async (lastAnswer) => {
      const answers = { ...posttestAnswers, ...lastAnswer }
      const score = await calculateTestScoreAsync(selectedQuestions, answers)
      const result = await savePosttest(sessionId, sessionSecret, answers, score)

      if (result?.ok) {
        markPosttestCompleted()
        navigate('/calculating', { replace: true })
        return
      }

      if (import.meta.env.DEV) {
        console.warn('[PostTest] savePosttest failed:', result)
      }
      setSaveWarning(SESSION_SAVE_FAILED_MESSAGE)
    },
    [posttestAnswers, selectedQuestions, sessionId, sessionSecret, navigate, markPosttestCompleted]
  )

  if (posttestCompleted) {
    return null
  }

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return (
      <PageLayout
        title="Post-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
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
    <PageLayout
      title="Post-Test · Learn to Play MTG"
      className="pretest"
      showKeywordDictionary={false}
    >
      {saveWarning ? (
        <div className="pretest__save-warning-block" role="alert">
          <p className="pretest__save-warning">{saveWarning}</p>
          <button
            type="button"
            className="pretest__button"
            onClick={() => navigate('/calculating', { replace: true })}
          >
            Continue without saving
          </button>
        </div>
      ) : null}
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
