import './ProgressDots.css'

export const PROGRESS_STEP_COUNT = 15

export const PROGRESS = {
  CONSENT: 0,
  WELCOME: 1,
  INTRO: 2,
  PRETEST: 3,
  PRETEST_COMPLETE: 4,
  LESSON_INTRO: 5,
  WHAT_IS_MTG: 6,
  LESSON_1: 7,
  LESSON_2: 8,
  LESSON_3: 9,
  LESSON_4: 10,
  LESSON_COMPLETE: 11,
  POSTTEST: 12,
  CALCULATING: 13,
  RESULTS: 14,
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
