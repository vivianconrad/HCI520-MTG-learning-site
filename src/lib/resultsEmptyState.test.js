import { describe, expect, it } from 'vitest'
import { getResultsEmptyContent } from './resultsEmptyState.js'

const baseSession = {
  selectedQuestions: null,
  pretestAnswers: {},
  posttestAnswers: {},
  pretestCompleted: false,
  lessonsCompleted: false,
  posttestCompleted: false,
  screenTimes: {},
}

describe('getResultsEmptyContent', () => {
  it('guides users who have not finished the pre-test', () => {
    const content = getResultsEmptyContent(baseSession)
    expect(content.heading).toMatch(/not ready yet/i)
    expect(content.primary.path).toBe('/welcome')
  })

  it('routes incomplete lesson progress to the latest lesson', () => {
    const content = getResultsEmptyContent({
      ...baseSession,
      pretestCompleted: true,
      screenTimes: { CardTypes: 1000 },
    })
    expect(content.primary.path).toBe('/lesson/2')
  })

  it('prompts for the post-test when lessons are done', () => {
    const content = getResultsEmptyContent({
      ...baseSession,
      pretestCompleted: true,
      lessonsCompleted: true,
    })
    expect(content.primary.path).toBe('/posttest-prep')
  })

  it('treats missing answer data as a corrupt session', () => {
    const content = getResultsEmptyContent({
      ...baseSession,
      pretestCompleted: true,
      lessonsCompleted: true,
      posttestCompleted: true,
      selectedQuestions: [{ id: 'q1' }],
      pretestAnswers: { q1: 0 },
      posttestAnswers: {},
    })
    expect(content.heading).toMatch(/could not load/i)
    expect(content.secondary?.action).toBe('reset')
  })
})
