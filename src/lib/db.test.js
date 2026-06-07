import { describe, expect, it } from 'vitest'
import { isParticipantUpdateBlocked } from './participantUpdate.js'

describe('isParticipantUpdateBlocked', () => {
  it('returns true when the patch succeeded at HTTP level but updated zero rows', () => {
    expect(isParticipantUpdateBlocked({ ok: false, rowsUpdated: 0 })).toBe(true)
  })

  it('returns false when at least one row was updated', () => {
    expect(isParticipantUpdateBlocked({ ok: true, rowsUpdated: 1 })).toBe(false)
  })

  it('returns false for null or missing results', () => {
    expect(isParticipantUpdateBlocked(null)).toBe(false)
    expect(isParticipantUpdateBlocked(undefined)).toBe(false)
  })
})
