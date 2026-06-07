import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrowserBackNotice from '../components/BrowserBackNotice.jsx'
import SessionRecoveryGuide from '../components/SessionRecoveryGuide.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ParchmentFrameSkeleton from '../components/ParchmentFrameSkeleton.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'
import { useBlockBrowserBack } from '../hooks/useBlockBrowserBack.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { savePosttest, saveScreenTime } from '../lib/db.js'
import { describeSaveFailure, describeSessionSetupError, SESSION_NOT_READY_MESSAGE } from '../lib/sessionErrors.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import { useConfirm } from '../context/useConfirm.js'
import { POSTTEST_LEAVE_CONFIRM_MESSAGE, POSTTEST_LEAVE_CONFIRM_TITLE } from '../lib/lessonNav.js'
import { calculateTestScoreAsync } from '../lib/testScore.js'
import useRedirectIfTestComplete, {
  getRedirectStatusMessage,
} from '../hooks/useRedirectIfTestComplete.js'

export default function PostTest({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [saveWarning, setSaveWarning] = useState(null)
  const [saving, setSaving] = useState(false)
  const {
    sessionId,
    sessionSecret,
    selectedQuestions,
    selectQuestions,
    questionsLoading,
    questionsError,
    screenTimes,
    setPosttestAnswer,
    posttestAnswers,
    posttestCompleted,
    markPosttestCompleted,
    participantRowReady,
  } = session

  const { rowReady, rowError } = useParticipantBootstrap(session)
  const canSave = participantRowReady && rowReady

  const redirecting = useRedirectIfTestComplete(posttestCompleted, '/results')
  useScreenTime(session, 'PostTest')
  useBlockBrowserBack(!posttestCompleted)

  useEffect(() => {
    if (selectedQuestions === null && !questionsError) {
      selectQuestions()
    }
  }, [selectedQuestions, questionsError, selectQuestions])

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

      const answers = { ...posttestAnswers, ...lastAnswer }
      const score = await calculateTestScoreAsync(selectedQuestions, answers)
      const result = await savePosttest(sessionId, sessionSecret, answers, score)

      if (result?.ok) {
        const screenTimeResult = await saveScreenTime(sessionId, sessionSecret, screenTimes)
        markPosttestCompleted()
        navigate('/calculating', {
          replace: true,
          state: screenTimeResult?.ok ? undefined : { screenTimeWarning: true },
        })
        return
      }

      if (import.meta.env.DEV) {
        console.warn('[PostTest] savePosttest failed:', result)
      }
      setSaving(false)
      setSaveWarning(describeSaveFailure(result))
    },
    [
      canSave,
      rowError,
      posttestAnswers,
      selectedQuestions,
      sessionId,
      sessionSecret,
      screenTimes,
      navigate,
      markPosttestCompleted,
    ]
  )

  if (posttestCompleted || redirecting) {
    return (
      <PageLayout
        title="Post-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
        <ParchmentFrameSkeleton
          className="pretest"
          label={getRedirectStatusMessage('/results')}
          compact
        />
      </PageLayout>
    )
  }

  if (questionsLoading || (selectedQuestions === null && !questionsError)) {
    return (
      <PageLayout
        title="Post-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
        <ParchmentFrameSkeleton className="pretest" label="Loading post-test questions…" compact />
      </PageLayout>
    )
  }

  if (questionsError || selectedQuestions.length === 0) {
    return (
      <PageLayout
        title="Post-Test · Learn to Play MTG"
        className="pretest"
        showKeywordDictionary={false}
      >
        <div className="pretest__frame">
          <h1 className="pretest__empty">Post-Test unavailable</h1>
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
                  !(await confirm(POSTTEST_LEAVE_CONFIRM_MESSAGE, {
                    title: POSTTEST_LEAVE_CONFIRM_TITLE,
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
      title="Post-Test · Learn to Play MTG"
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
            If you continue without saving, your post-test answers will not be included in the
            study data, but you can still view your results screen and review lesson content.
          </p>
          <button
            type="button"
            className="pretest__button"
            onClick={() => {
              markPosttestCompleted()
              navigate('/calculating', { replace: true })
            }}
          >
            Continue without saving
          </button>
        </div>
      ) : null}
      <BrowserBackNotice />
      <SessionRecoveryGuide className="pretest__recovery" />
      <TestQuestionFlow
        testLabel="Post-Test"
        progressIndex={PROGRESS.POSTTEST}
        selectedQuestions={selectedQuestions}
        answers={posttestAnswers}
        setAnswer={setPosttestAnswer}
        onComplete={handleComplete}
        saving={saving}
        lastButtonLabel="Submit post-test"
        introNote="These are the same questions as the pre-test. Answer from what you learned in the lessons."
        leaveLabel="Exit post-test"
        onLeave={async () => {
          if (
            !(await confirm(POSTTEST_LEAVE_CONFIRM_MESSAGE, {
              title: POSTTEST_LEAVE_CONFIRM_TITLE,
            }))
          ) {
            return
          }
          navigate('/posttest-prep')
        }}
      />
    </PageLayout>
  )
}
