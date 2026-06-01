import './ProgressDots.css'

export const PROGRESS_STEP_COUNT = 13

export const PROGRESS = {
  CONSENT: 0,
  WELCOME: 1,
  INTRO: 2,
  PRETEST: 3,
  LESSON_INTRO: 4,
  LESSON_1: 5,
  LESSON_2: 6,
  LESSON_3: 7,
  LESSON_4: 8,
  LESSON_COMPLETE: 9,
  POSTTEST: 10,
  CALCULATING: 11,
  RESULTS: 12,
}

export default function ProgressDots({ activeIndex }) {
  const stepNumber = activeIndex + 1

  return (
    <nav className="progress-dots" aria-label="Lesson progress">
      <span className="progress-dots__label">
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
