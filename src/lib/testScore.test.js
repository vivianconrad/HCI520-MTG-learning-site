import { describe, expect, it } from 'vitest'
import { calculateTestScore } from './testScore.js'

const sampleQuestions = [{ id: 'q1' }, { id: 'q2' }]
const sampleKeys = { q1: 0, q2: 2 }

describe('calculateTestScore', () => {
  it('counts answers that match answer keys', () => {
    expect(calculateTestScore(sampleQuestions, { q1: 0, q2: 1 }, sampleKeys)).toBe(1)
  })

  it('returns 0 when answer keys are missing', () => {
    expect(calculateTestScore(sampleQuestions, { q1: 0 }, null)).toBe(0)
  })
})
