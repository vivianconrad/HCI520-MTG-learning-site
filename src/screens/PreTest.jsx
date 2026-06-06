import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBrowserBackConfirm } from '../hooks/useBrowserBackConfirm.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { isParticipantUpdateBlocked, savePretest } from '../lib/db.js'
import { SESSION_SAVE_FAILED_MESSAGE } from '../lib/sessionErrors.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import {
  PRETEST_LEAVE_CONFIRM_MESSAGE,
  PRETEST_LEAVE_CONFIRM_TITLE,
} from '../lib/lessonNav.js'
import { calculateTestScore } from '../lib/testScore.js'
import useRedirectIfTestComplete from '../hooks/useRedirectIfTestComplete.js'

export default function PreTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [saveWarning, setSaveWarning] = useState(null)
  const {
    sessionId,
    sessionSecret,
    selectedQuestions,
    selectQuestions,
    setPretestAnswer,
    pretestAnswers,
    pretestCompleted,
    markPretestCompleted,
  } = session

  useRedirectIfTestComplete(pretestCompleted, '/pretest-complete')
  useScreenTime(session, 'PreTest')
  useBrowserBackConfirm(
    !pretestCompleted,
    PRETEST_LEAVE_CONFIRM_MESSAGE,
    PRETEST_LEAVE_CONFIRM_TITLE,
  )

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  const handleComplete = useCallback(
    async (lastAnswer) => {
      const answers = { ...pretestAnswers, ...lastAnswer }
      const score = calculateTestScore(selectedQuestions, answers)
      const result = await savePretest(sessionId, sessionSecret, answers, score)
      markPretestCompleted()

      if (isParticipantUpdateBlocked(result)) {
        if (import.meta.env.DEV) {
          console.warn('[PreTest] savePretest blocked:', result)
        }
        setSaveWarning(SESSION_SAVE_FAILED_MESSAGE)
        window.setTimeout(() => navigate('/pretest-complete', { replace: true }), 2500)
        return
      }

      navigate('/pretest-complete', { replace: true })
    },
    [pretestAnswers, selectedQuestions, sessionId, sessionSecret, navigate, markPretestCompleted],
  )

  if (pretestCompleted) {
    return null
  }

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return (
      <PageLayout
        title="Pre-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
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
    <PageLayout
      title="Pre-Test · Learn to Play MTG"
      className="pretest"
      showKeywordDictionary={false}
    >
      {saveWarning ? (
        <p className="pretest__save-warning" role="alert">
          {saveWarning}
        </p>
      ) : null}
      <TestQuestionFlow
        testLabel="Pre-Test"
        progressIndex={PROGRESS.PRETEST}
        selectedQuestions={selectedQuestions}
        setAnswer={setPretestAnswer}
        onComplete={handleComplete}
        firstQuestionBackPath="/intro"
        leaveConfirmMessage={PRETEST_LEAVE_CONFIRM_MESSAGE}
        leaveConfirmTitle={PRETEST_LEAVE_CONFIRM_TITLE}
        lastButtonLabel="Continue"
      />
    </PageLayout>
  )
}
