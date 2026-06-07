import './ProgressDots.css'
import {
  PROGRESS_PHASE_RANGES,
  PROGRESS_STEP_COUNT,
  getLearnPhaseStep,
  getProgressPhaseIndex,
  getProgressPhaseLabel,
} from './progressConstants.js'

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
  const learnStep = getLearnPhaseStep(activeIndex)
  const phaseIndex = getProgressPhaseIndex(activeIndex)
  const stepOf = `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}`
  const learnSuffix = learnStep ? ` · Part ${learnStep.step} of ${learnStep.total} in lessons` : ''
  const stepText = stepLabel
    ? `${phaseLabel} · ${stepOf}${learnSuffix} · ${stepLabel}`
    : `${phaseLabel} · ${stepOf}${learnSuffix}`

  return (
    <nav className="progress-dots" aria-label="Lesson progress">
      <div
        className="progress-dots__phases"
        role="list"
        aria-label="Study phases"
      >
        {PROGRESS_PHASE_RANGES.map(({ label }, index) => (
          <span
            key={label}
            role="listitem"
            className={`progress-dots__phase${
              index === phaseIndex ? ' progress-dots__phase--active' : ''
            }${index < phaseIndex ? ' progress-dots__phase--complete' : ''}`}
            aria-current={index === phaseIndex ? 'step' : undefined}
            aria-label={`${label}${index === phaseIndex ? ', current phase' : index < phaseIndex ? ', completed' : ''}`}
          >
            <span className="progress-dots__phase-label">{label}</span>
          </span>
        ))}
      </div>
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
