import './ProgressDots.css'

export const PROGRESS_STEP_COUNT = 9

export const PROGRESS = {
  WELCOME: 0,
  INTRO: 1,
  PRETEST: 2,
  LESSON_1: 3,
  LESSON_2: 4,
  LESSON_3: 5,
  LESSON_4: 6,
  LESSON_COMPLETE: 7,
  POSTTEST: 8,
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
