import './ProgressDots.css'

export const PROGRESS_STEP_COUNT = 10

export const PROGRESS = {
  WELCOME: 0,
  INTRO: 1,
  PRETEST: 2,
  LESSON_INTRO: 3,
  LESSON_1: 4,
  LESSON_2: 5,
  LESSON_3: 6,
  LESSON_4: 7,
  LESSON_COMPLETE: 8,
  POSTTEST: 9,
}

export default function ProgressDots({ activeIndex }) {
  return (
    <div className="progress-dots" aria-hidden="true">
      {Array.from({ length: PROGRESS_STEP_COUNT }, (_, index) => (
        <span
          key={index}
          className={`progress-dots__dot${index === activeIndex ? ' progress-dots__dot--active' : ''}`}
        />
      ))}
    </div>
  )
}
