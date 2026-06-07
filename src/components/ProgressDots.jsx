import './ProgressDots.css'
import { PROGRESS_STEP_COUNT } from './progressConstants.js'

export { PROGRESS, PROGRESS_STEP_COUNT } from './progressConstants.js'

function dotLabel(index, activeIndex) {
  const stepNumber = index + 1
  if (index < activeIndex) {
    return `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}, completed`
  }
  if (index === activeIndex) {
    return `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}, current step`
  }
  return `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}, upcoming`
}

export default function ProgressDots({ activeIndex, stepLabel }) {
  const stepNumber = activeIndex + 1
  const stepText = stepLabel
    ? `Step ${stepNumber} of ${PROGRESS_STEP_COUNT} · ${stepLabel}`
    : `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}`

  return (
    <nav className="progress-dots" aria-label="Lesson progress">
      <span className="progress-dots__label" aria-current="step">
        {stepText}
      </span>
      <div className="progress-dots__track" role="list" aria-label="Progress steps">
        {Array.from({ length: PROGRESS_STEP_COUNT }, (_, index) => (
          <span
            key={index}
            role="listitem"
            aria-label={dotLabel(index, activeIndex)}
            className={`progress-dots__dot${
              index === activeIndex ? ' progress-dots__dot--active' : ''
            }${index < activeIndex ? ' progress-dots__dot--complete' : ''}`}
          />
        ))}
      </div>
    </nav>
  )
}
