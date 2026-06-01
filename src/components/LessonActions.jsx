import { useEffect, useState } from 'react'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { LESSON_BACK_CONFIRM_MESSAGE } from '../lib/lessonNav.js'
import './LessonActions.css'

export default function LessonActions({
  classPrefix,
  onBack,
  backLabel = 'Back',
  backHint,
  backConfirm = true,
  onNext,
  nextLabel = 'Next',
  canProceed = true,
  gateMessage,
}) {
  const confirm = useConfirm()
  const [gateHint, setGateHint] = useState('')
  const hintId = `${classPrefix}-gate-hint`

  useEffect(() => {
    if (canProceed) setGateHint('')
  }, [canProceed])

  async function handleBack() {
    if (backConfirm && !(await confirm(LESSON_BACK_CONFIRM_MESSAGE))) return
    onBack()
  }

  function handleNext() {
    if (!canProceed) {
      setGateHint(gateMessage)
      return
    }
    setGateHint('')
    onNext()
  }

  return (
    <>
      <div className={`${classPrefix}__actions`}>
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
        <button
          type="button"
          className={`${classPrefix}__button ${classPrefix}__button--next${
            !canProceed ? ` ${classPrefix}__button--next-blocked` : ''
          }`}
          onClick={handleNext}
          aria-describedby={gateHint ? hintId : undefined}
        >
          {nextLabel}
        </button>
      </div>
      {gateHint && (
        <p id={hintId} className="lesson-nav__gate-hint" role="status">
          {gateHint}
        </p>
      )}
    </>
  )
}
