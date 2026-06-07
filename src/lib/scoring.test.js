import { describe, expect, it } from 'vitest'
import {
  aggregateCohortStats,
  buildResultsSummary,
  calculateScores,
  getImprovementMessage,
  getLoTag,
  getReviewLessonPath,
  isCardTypeIdentificationQuestion,
  sessionsToCsv,
} from './scoring.js'

const sampleQuestions = [
  { id: 'lo0_q1', lo: 'LO0', correctIndex: 0 },
  { id: 'lo1_q1', lo: 'LO1', correctIndex: 1 },
]

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
      '/what-is-mtg'
    )
    expect(getReviewLessonPath({ lo: 'LO4', question: 'Timing' })).toBe('/lesson/4')
  })
})

describe('calculateScores', () => {
  it('counts correct pre-test and post-test answers by topic', () => {
    const result = calculateScores(
      sampleQuestions,
      { lo0_q1: 0, lo1_q1: 0 },
      { lo0_q1: 0, lo1_q1: 1 },
      null
    )

    expect(result.pretestCorrect).toBe(1)
    expect(result.posttestCorrect).toBe(2)
    expect(result.loScores.LO0).toEqual({ pre: 1, post: 1 })
    expect(result.loScores.LO1).toEqual({ pre: 0, post: 1 })
  })

  it('prefers answer keys over embedded correctIndex values', () => {
    const result = calculateScores(
      [{ id: 'q1', lo: 'LO0', correctIndex: 0 }],
      { q1: 1 },
      { q1: 1 },
      { q1: 1 }
    )

    expect(result.pretestCorrect).toBe(1)
    expect(result.posttestCorrect).toBe(1)
  })
})

describe('getLoTag', () => {
  it('labels topic movement as improved, review, or same', () => {
    expect(getLoTag(1, 2)).toEqual({
      label: 'Improved',
      className: 'results__lo-tag--improved',
    })
    expect(getLoTag(2, 1)).toEqual({
      label: 'Review',
      className: 'results__lo-tag--declined',
    })
    expect(getLoTag(1, 1)).toEqual({
      label: 'Same',
      className: 'results__lo-tag--same',
    })
  })
})

describe('getImprovementMessage', () => {
  it('uses singular copy for a one-point gain', () => {
    expect(getImprovementMessage(3, 4).text).toBe('You improved by 1 point.')
  })

  it('uses plural copy for multi-point gains', () => {
    expect(getImprovementMessage(2, 5).text).toBe('You improved by 3 points.')
  })

  it('returns neutral guidance when the score is unchanged or lower', () => {
    expect(getImprovementMessage(4, 4).text).toContain('Same score')
    expect(getImprovementMessage(5, 3).text).toContain('missed more')
  })
})

describe('buildResultsSummary', () => {
  it('formats session totals and topic breakdown', () => {
    const summary = buildResultsSummary('ABC123', {
      pretestCorrect: 1,
      posttestCorrect: 2,
      loScores: {
        LO0: { pre: 1, post: 1 },
        LO1: { pre: 0, post: 1 },
        LO2: { pre: 0, post: 0 },
        LO3: { pre: 0, post: 0 },
        LO4: { pre: 0, post: 0 },
      },
    }, sampleQuestions)

    expect(summary).toContain('Session ID: ABC123')
    expect(summary).toContain('Pre-Test: 1 / 2')
    expect(summary).toContain('Post-Test: 2 / 2')
    expect(summary).toContain('MTG Basics: 1/2 → 1/2')
    expect(summary).toContain('How to Read a Card: 0/2 → 1/2')
  })
})

describe('aggregateCohortStats', () => {
  it('returns zeroed means for an empty cohort', () => {
    const stats = aggregateCohortStats([])
    expect(stats.count).toBe(0)
    expect(stats.meanPretest).toBe(0)
    expect(stats.meanPosttest).toBe(0)
    expect(stats.loMeans.LO0).toEqual({ pre: 0, post: 0, gain: 0 })
  })

  it('averages stored scores and derives topic means from answers when needed', () => {
    const stats = aggregateCohortStats([
      {
        session_id: 's1',
        pretest_score: 2,
        posttest_score: 4,
        lo_scores: { LO0: { pre: 1, post: 2 }, LO1: { pre: 1, post: 2 } },
      },
      {
        session_id: 's2',
        pretest_correct: 0,
        posttest_correct: 2,
        selected_questions: sampleQuestions,
        pretest_answers: { lo0_q1: 0, lo1_q1: 0 },
        posttest_answers: { lo0_q1: 0, lo1_q1: 1 },
      },
    ])

    expect(stats.count).toBe(2)
    expect(stats.meanPretest).toBe(1)
    expect(stats.meanPosttest).toBe(3)
    expect(stats.meanGain).toBe(2)
    expect(stats.loMeans.LO0.pre).toBe(1)
    expect(stats.loMeans.LO0.post).toBe(1.5)
    expect(stats.loMeans.LO1.pre).toBe(0.5)
    expect(stats.loMeans.LO1.post).toBe(1.5)
  })
})

describe('sessionsToCsv', () => {
  it('emits a header row and escapes values with commas', () => {
    const csv = sessionsToCsv([
      {
        session_id: 'sess,1',
        submitted_at: '2026-06-07',
        pretest_score: 1,
        posttest_score: 2,
        lo_scores: { LO0: { pre: 1, post: 2 } },
        question_ids: ['lo0_q1', 'lo1_q1'],
      },
    ])

    expect(csv.split('\n')[0]).toContain('session_id')
    expect(csv).toContain('"sess,1"')
    expect(csv).toContain('lo0_q1;lo1_q1')
  })
})
