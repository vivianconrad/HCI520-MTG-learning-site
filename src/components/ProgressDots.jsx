import './ProgressDots.css'
import {
  PROGRESS_PHASE_RANGES,
  PROGRESS_STEP_COUNT,
  getLearnPhaseStep,
  getProgressPhaseIndex,
} from './progressConstants.js'

function segmentAriaLabel(label, index, phaseIndex) {
  if (index === phaseIndex) return `${label}, current phase`
  if (index < phaseIndex) return `${label}, completed`
  return label
}

export default function ProgressDots({ activeIndex, stepLabel }) {
  const stepNumber = activeIndex + 1
  const learnStep = getLearnPhaseStep(activeIndex)
  const phaseIndex = getProgressPhaseIndex(activeIndex)
  const stepOf = `Step ${stepNumber} of ${PROGRESS_STEP_COUNT}`
  const learnSuffix = learnStep ? ` · Part ${learnStep.step} of ${learnStep.total} in lessons` : ''
  const stepText = stepLabel
    ? `${stepOf}${learnSuffix} · ${stepLabel}`
    : `${stepOf}${learnSuffix}`

  return (
    <nav className="progress-dots" aria-label="Lesson progress">
      <div className="progress-dots__bar" role="list" aria-label="Study phases">
        {PROGRESS_PHASE_RANGES.map(({ label }, index) => (
          <span
            key={label}
            role="listitem"
            className={`progress-dots__segment${
              index === phaseIndex ? ' progress-dots__segment--active' : ''
            }${index < phaseIndex ? ' progress-dots__segment--complete' : ''}`}
            aria-current={index === phaseIndex ? 'step' : undefined}
            aria-label={segmentAriaLabel(label, index, phaseIndex)}
          />
        ))}
      </div>
      <span className="progress-dots__label">{stepText}</span>
    </nav>
  )
}
