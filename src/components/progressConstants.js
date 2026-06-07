export const PROGRESS_STEP_COUNT = 16

/** Learner-facing phase names for the progress indicator (inclusive step ranges). */
export const PROGRESS_PHASE_RANGES = [
  { from: 0, to: 2, label: 'Setup' },
  { from: 3, to: 4, label: 'Pre-test' },
  { from: 5, to: 11, label: 'Learn' },
  { from: 12, to: 14, label: 'Post-test' },
  { from: 15, to: 15, label: 'Complete' },
]

export function getProgressPhaseLabel(activeIndex) {
  const phase = PROGRESS_PHASE_RANGES.find(
    ({ from, to }) => activeIndex >= from && activeIndex <= to
  )
  return phase?.label ?? 'Progress'
}

/** Which phase segment (0–4) is active for the compact progress bar. */
export function getProgressPhaseIndex(activeIndex) {
  const index = PROGRESS_PHASE_RANGES.findIndex(
    ({ from, to }) => activeIndex >= from && activeIndex <= to
  )
  return index >= 0 ? index : 0
}

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
  POSTTEST_PREP: 12,
  POSTTEST: 13,
  CALCULATING: 14,
  RESULTS: 15,
}

/** Step within the Learn phase (lesson intro through lesson complete), or null outside Learn. */
export function getLearnPhaseStep(activeIndex) {
  const { LESSON_INTRO, LESSON_COMPLETE } = PROGRESS
  if (activeIndex < LESSON_INTRO || activeIndex > LESSON_COMPLETE) return null
  return {
    step: activeIndex - LESSON_INTRO + 1,
    total: LESSON_COMPLETE - LESSON_INTRO + 1,
  }
}
