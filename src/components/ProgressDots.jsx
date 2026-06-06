import './ProgressDots.css'
import { PROGRESS_STEP_COUNT } from './progressConstants.js'

export { PROGRESS, PROGRESS_STEP_COUNT } from './progressConstants.js'

export default function ProgressDots({ activeIndex }) {
  const stepNumber = activeIndex + 1

  return (
    <nav className="progress-dots" aria-label="Lesson progress">
      <span className="progress-dots__label" aria-current="step">
        Step {stepNumber} of {PROGRESS_STEP_COUNT}
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
