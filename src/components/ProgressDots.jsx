import './ProgressDots.css'
import { PROGRESS_STEP_COUNT, getProgressPhaseLabel } from './progressConstants.js'

export { PROGRESS, PROGRESS_STEP_COUNT, getProgressPhaseLabel } from './progressConstants.js'

function dotLabel(index, activeIndex, phaseLabel) {
  const stepNumber = index + 1
  const stepOf = `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}`
  if (index < activeIndex) {
    return `${phaseLabel} · ${stepOf}, completed`
  }
  if (index === activeIndex) {
    return `${phaseLabel} · ${stepOf}, current step`
  }
  return `${phaseLabel} · ${stepOf}, upcoming`
}

export default function ProgressDots({ activeIndex, stepLabel }) {
  const stepNumber = activeIndex + 1
  const phaseLabel = getProgressPhaseLabel(activeIndex)
  const stepOf = `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}`
  const stepText = stepLabel
    ? `${phaseLabel} · ${stepOf} · ${stepLabel}`
    : `${phaseLabel} · ${stepOf}`

  return (
    <nav className="progress-dots" aria-label="Lesson progress">
      <span className="progress-dots__label">{stepText}</span>
      <div className="progress-dots__track" role="list" aria-label="Progress steps">
        {Array.from({ length: PROGRESS_STEP_COUNT }, (_, index) => (
          <span
            key={index}
            role="listitem"
            aria-label={dotLabel(index, activeIndex, getProgressPhaseLabel(index))}
            aria-current={index === activeIndex ? 'step' : undefined}
            className={`progress-dots__dot${
              index === activeIndex ? ' progress-dots__dot--active' : ''
            }${index < activeIndex ? ' progress-dots__dot--complete' : ''}`}
          />
        ))}
      </div>
    </nav>
  )
}
