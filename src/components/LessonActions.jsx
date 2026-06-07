import { useState } from 'react'
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
  onGateBlocked,
}) {
  const confirm = useConfirm()
  const [gateHint, setGateHint] = useState('')
  const hintId = `${classPrefix}-gate-hint`
  const visibleGateHint = canProceed ? '' : gateHint

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
      setGateHint(gateMessage)
      onGateBlocked?.()
      return
    }
    setGateHint('')
    onNext()
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
          <button
            type="button"
            className={`${classPrefix}__button ${classPrefix}__button--next${
              !canProceed ? ` ${classPrefix}__button--next-blocked` : ''
            }${onReview ? ` ${classPrefix}__button--stacked` : ''}`}
            onClick={handleNext}
            aria-describedby={visibleGateHint ? hintId : undefined}
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
      {visibleGateHint && (
        <p id={hintId} className="lesson-nav__gate-hint" role="status">
          {visibleGateHint}
        </p>
      )}
    </>
  )
}
