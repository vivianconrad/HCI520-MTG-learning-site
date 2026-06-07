import { useConfirm } from '../context/useConfirm.js'
import { LESSON_BACK_CONFIRM_MESSAGE, LESSON_BACK_CONFIRM_TITLE } from '../lib/lessonNav.js'
import './LessonActions.css'

export default function LessonActions({
  classPrefix,
  onBack,
  backLabel = 'Back',
  backHint,
  backConfirm = true,
  onReview,
  reviewLabel = 'Quick review',
  reviewHint = 'Scroll back to the top of this lesson',
  onNext,
  nextLabel = 'Next',
  canProceed = true,
  gateMessage,
  readyMessage,
  onGateBlocked,
}) {
  const confirm = useConfirm()
  const hintId = `${classPrefix}-gate-hint`
  const readyId = `${classPrefix}-ready-hint`
  const visibleGateHint = !canProceed && gateMessage ? gateMessage : ''
  const visibleReadyMessage = canProceed && readyMessage ? readyMessage : ''

  async function handleBack() {
    if (
      backConfirm &&
      !(await confirm(LESSON_BACK_CONFIRM_MESSAGE, { title: LESSON_BACK_CONFIRM_TITLE }))
    ) {
      return
    }
    onBack()
  }

  function handleNext() {
    if (!canProceed) {
      return
    }
    onNext()
  }

  function handleGateHintActivate() {
    onGateBlocked?.()
  }

  function handleReview() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    onReview?.()
  }

  return (
    <>
      <div
        className={`${classPrefix}__actions${onReview ? ` ${classPrefix}__actions--with-review` : ''}`}
      >
        <button
          type="button"
          className={`${classPrefix}__button ${classPrefix}__button--back${
            backHint ? ` ${classPrefix}__button--stacked` : ''
          }`}
          onClick={handleBack}
        >
          {backHint ? (
            <>
              <span className={`${classPrefix}__button-label`}>{backLabel}</span>
              <span className={`${classPrefix}__button-hint`}>{backHint}</span>
            </>
          ) : (
            backLabel
          )}
        </button>
        <div className={`${classPrefix}__actions-forward`}>
          {onReview ? (
            <button
              type="button"
              className={`${classPrefix}__button ${classPrefix}__button--review ${classPrefix}__button--stacked`}
              onClick={handleReview}
            >
              <span className={`${classPrefix}__button-label`}>{reviewLabel}</span>
              <span className={`${classPrefix}__button-hint`}>{reviewHint}</span>
            </button>
          ) : null}
          {visibleGateHint ? (
            <p
              id={hintId}
              className="lesson-nav__gate-hint"
              role="status"
              aria-live="polite"
              onClick={handleGateHintActivate}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleGateHintActivate()
                }
              }}
              tabIndex={onGateBlocked ? 0 : undefined}
            >
              {visibleGateHint}
            </p>
          ) : null}
          {visibleReadyMessage ? (
            <p id={readyId} className="lesson-nav__ready-hint" role="status" aria-live="polite">
              {visibleReadyMessage}
            </p>
          ) : null}
          <button
            type="button"
            className={`${classPrefix}__button ${classPrefix}__button--next${
              !canProceed ? ` ${classPrefix}__button--next-blocked` : ''
            }${onReview ? ` ${classPrefix}__button--stacked` : ''}`}
            onClick={handleNext}
            disabled={!canProceed}
            aria-describedby={
              visibleGateHint ? hintId : visibleReadyMessage ? readyId : undefined
            }
          >
            {onReview ? (
              <>
                <span className={`${classPrefix}__button-label`}>{nextLabel}</span>
                <span className={`${classPrefix}__button-hint`}>Move on to the next lesson</span>
              </>
            ) : (
              nextLabel
            )}
          </button>
        </div>
      </div>
    </>
  )
}
