import { describe, expect, it } from 'vitest'
import { getReviewLessonPath, isCardTypeIdentificationQuestion } from './scoring.js'

describe('isCardTypeIdentificationQuestion', () => {
  it('returns true for LO1 card type identification prompts', () => {
    expect(
      isCardTypeIdentificationQuestion({ lo: 'LO1', question: 'What type of card is this?' })
    ).toBe(true)
  })

  it('returns false for other LO1 anatomy questions', () => {
    expect(
      isCardTypeIdentificationQuestion({
        lo: 'LO1',
        question: 'Which part of a card tells you what it can do during the game?',
      })
    ).toBe(false)
  })
})

describe('getReviewLessonPath', () => {
  it('prefers an explicit reviewLesson field when set', () => {
    expect(
      getReviewLessonPath({
        lo: 'LO1',
        reviewLesson: '/lesson/2',
        question: 'Which part of a card tells you what it can do during the game?',
      })
    ).toBe('/lesson/2')
  })

  it('falls back to card type identification for LO1 type questions without reviewLesson', () => {
    expect(getReviewLessonPath({ lo: 'LO1', question: 'What type of card is this?' })).toBe(
      '/lesson/2'
    )
  })

  it('uses TOPIC_LESSON_PATHS for LO2 turn structure questions', () => {
    expect(getReviewLessonPath({ lo: 'LO2', question: 'Which phase comes first?' })).toBe(
      '/lesson/3'
    )
  })

  it('returns the intro path for LO0 and the timing lesson for LO4', () => {
    expect(getReviewLessonPath({ lo: 'LO0', id: 'lo0_q1', question: 'Basics' })).toBe(
      '/what-is-mtg'
    )
    expect(getReviewLessonPath({ lo: 'LO0', id: 'lo0_q5', question: 'Play vs cast' })).toBe(
      '/first-game'
    )
    expect(getReviewLessonPath({ lo: 'LO4', question: 'Timing' })).toBe('/lesson/4')
  })
})
