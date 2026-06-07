import { describe, expect, it } from 'vitest'
import {
  PROGRESS,
  getLearnPhaseStep,
  getProgressPhaseIndex,
  getProgressPhaseLabel,
} from '../components/progressConstants.js'

describe('getProgressPhaseLabel', () => {
  it('labels setup, pre-test, learn, post-test, and complete phases', () => {
    expect(getProgressPhaseLabel(PROGRESS.CONSENT)).toBe('Setup')
    expect(getProgressPhaseLabel(PROGRESS.PRETEST)).toBe('Pre-test')
    expect(getProgressPhaseLabel(PROGRESS.LESSON_2)).toBe('Learn')
    expect(getProgressPhaseLabel(PROGRESS.POSTTEST)).toBe('Post-test')
    expect(getProgressPhaseLabel(PROGRESS.RESULTS)).toBe('Complete')
  })
})

describe('getLearnPhaseStep', () => {
  it('returns null outside the learn phase', () => {
    expect(getLearnPhaseStep(PROGRESS.PRETEST)).toBeNull()
    expect(getLearnPhaseStep(PROGRESS.POSTTEST_PREP)).toBeNull()
  })

  it('counts lesson intro through lesson complete as seven parts', () => {
    expect(getLearnPhaseStep(PROGRESS.LESSON_INTRO)).toEqual({ step: 1, total: 7 })
    expect(getLearnPhaseStep(PROGRESS.LESSON_4)).toEqual({ step: 6, total: 7 })
    expect(getLearnPhaseStep(PROGRESS.LESSON_COMPLETE)).toEqual({ step: 7, total: 7 })
  })
})

describe('getProgressPhaseIndex', () => {
  it('maps active steps to phase segments', () => {
    expect(getProgressPhaseIndex(PROGRESS.WELCOME)).toBe(0)
    expect(getProgressPhaseIndex(PROGRESS.LESSON_1)).toBe(2)
    expect(getProgressPhaseIndex(PROGRESS.RESULTS)).toBe(4)
  })
})
