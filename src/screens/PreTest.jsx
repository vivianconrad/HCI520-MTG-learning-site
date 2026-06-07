import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrowserBackNotice from '../components/BrowserBackNotice.jsx'
import PageLayout from '../components/PageLayout.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBlockBrowserBack } from '../hooks/useBlockBrowserBack.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePretest } from '../lib/db.js'
import { describeSaveFailure, describeSessionSetupError, SESSION_NOT_READY_MESSAGE } from '../lib/sessionErrors.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import { useConfirm } from '../context/useConfirm.js'
import { PRETEST_LEAVE_CONFIRM_MESSAGE, PRETEST_LEAVE_CONFIRM_TITLE } from '../lib/lessonNav.js'
import { calculateTestScoreAsync } from '../lib/testScore.js'
import useRedirectIfTestComplete from '../hooks/useRedirectIfTestComplete.js'

export default function PreTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [saveWarning, setSaveWarning] = useState(null)
  const [saving, setSaving] = useState(false)
  const {
    sessionId,
    sessionSecret,
    selectedQuestions,
    questionsLoading,
    questionsError,
    selectQuestions,
    setPretestAnswer,
    pretestAnswers,
    pretestCompleted,
    markPretestCompleted,
    participantRowReady,
  } = session

  const { rowReady, rowError } = useParticipantBootstrap(session)
  const canSave = participantRowReady && rowReady

  useRedirectIfTestComplete(pretestCompleted, '/pretest-complete')
  useScreenTime(session, 'PreTest')
  useBlockBrowserBack(!pretestCompleted)

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  const handleComplete = useCallback(
    async (lastAnswer) => {
      if (!canSave) {
        setSaveWarning(
          rowError ? describeSessionSetupError(rowError) : SESSION_NOT_READY_MESSAGE
        )
        return
      }

      setSaving(true)
      setSaveWarning(null)

      const answers = { ...pretestAnswers, ...lastAnswer }
      const score = await calculateTestScoreAsync(selectedQuestions, answers)
      const result = await savePretest(sessionId, sessionSecret, answers, score)

      if (result?.ok) {
        markPretestCompleted()
        navigate('/pretest-complete', { replace: true })
        return
      }

      if (import.meta.env.DEV) {
        console.warn('[PreTest] savePretest failed:', result)
      }
      setSaving(false)
      setSaveWarning(describeSaveFailure(result))
    },
    [
      canSave,
      rowError,
      pretestAnswers,
      selectedQuestions,
      sessionId,
      sessionSecret,
      navigate,
      markPretestCompleted,
    ]
  )

  if (pretestCompleted) {
    return null
  }

  if (questionsLoading || (selectedQuestions === null && !questionsError)) {
    return (
      <PageLayout
        title="Pre-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
        <div className="pretest__frame">
          <h1 className="pretest__empty">Pre-Test</h1>
          <p className="pretest__empty" aria-live="polite">
            Loading your questions…
          </p>
        </div>
      </PageLayout>
    )
  }

  if (questionsError || selectedQuestions?.length === 0) {
    return (
      <PageLayout
        title="Pre-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
        <div className="pretest__frame">
          <h1 className="pretest__empty">Pre-Test unavailable</h1>
          <p className="pretest__empty" role="alert">
            {questionsError ??
              'Your test questions did not load. Go to Welcome to reload them, or try again here.'}
          </p>
          <div className="pretest__actions pretest__actions--empty">
            <button
              type="button"
              className="pretest__button"
              disabled={questionsLoading}
              onClick={() => selectQuestions()}
            >
              {questionsLoading ? 'Loading questions…' : 'Try loading questions again'}
            </button>
            <button
              type="button"
              className="pretest__button pretest__button--back"
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
              Go to Welcome
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
      {rowError ? (
        <div className="pretest__save-warning-block" role="alert">
          <p className="pretest__save-warning">{describeSessionSetupError(rowError)}</p>
        </div>
      ) : null}
      {!canSave && !rowError ? (
        <p className="pretest__intro-note" aria-live="polite">
          Preparing your session…
        </p>
      ) : null}
      {saveWarning ? (
        <div className="pretest__save-warning-block" role="alert">
          <p className="pretest__save-warning">{saveWarning}</p>
          <p className="pretest__save-warning-detail">
            If you continue without saving, your answers will not be included in the study data, but
            you can still finish the lessons and post-test.
          </p>
          <button
            type="button"
            className="pretest__button"
            onClick={() => {
              markPretestCompleted()
              navigate('/pretest-complete', { replace: true })
            }}
          >
            Continue without saving
          </button>
        </div>
      ) : null}
      <BrowserBackNotice />
      <TestQuestionFlow
        testLabel="Pre-Test"
        progressIndex={PROGRESS.PRETEST}
        selectedQuestions={selectedQuestions}
        answers={pretestAnswers}
        setAnswer={setPretestAnswer}
        onComplete={handleComplete}
        saving={saving}
        lastButtonLabel="Finish pre-test"
        introNote="You have not been taught these topics yet. Answer with your best guess. Wrong answers are expected and help show what the lessons should cover."
        assessmentNote="Gold-highlighted term definitions from the lessons are not available during the test."
      />
    </PageLayout>
  )
}
