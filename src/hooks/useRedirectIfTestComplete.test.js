import { describe, expect, it } from 'vitest'
import { getRedirectStatusMessage } from '../hooks/useRedirectIfTestComplete.js'

describe('getRedirectStatusMessage', () => {
  it('returns learner-friendly copy for known redirect targets', () => {
    expect(getRedirectStatusMessage('/pretest-complete')).toMatch(/pre-test complete/i)
    expect(getRedirectStatusMessage('/results')).toMatch(/results/i)
    expect(getRedirectStatusMessage('/calculating')).toMatch(/saving/i)
  })

  it('falls back for unknown paths', () => {
    expect(getRedirectStatusMessage('/unknown')).toMatch(/next step/i)
  })
})
