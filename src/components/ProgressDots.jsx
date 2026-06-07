import './ProgressDots.css'
import { PROGRESS_STEP_COUNT } from './progressConstants.js'

export { PROGRESS, PROGRESS_STEP_COUNT } from './progressConstants.js'

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
      <div className="progress-dots__track" aria-hidden="true">
        {Array.from({ length: PROGRESS_STEP_COUNT }, (_, index) => (
          <span
            key={index}
            className={`progress-dots__dot${index === activeIndex ? ' progress-dots__dot--active' : ''}`}
          />
        ))}
      </div>
    </nav>
  )
}
