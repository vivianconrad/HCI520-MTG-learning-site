import { describe, expect, it } from 'vitest'
import {
  SESSION_SAVE_FAILED_MESSAGE,
  describeSaveFailure,
} from './sessionErrors.js'

describe('describeSaveFailure', () => {
  it('includes the server error when one is present', () => {
    expect(describeSaveFailure({ error: 'permission denied' })).toBe(
      `${SESSION_SAVE_FAILED_MESSAGE} Server: permission denied`
    )
  })

  it('explains a blocked update with zero rows updated', () => {
    expect(describeSaveFailure({ ok: false, rowsUpdated: 0 })).toContain(
      'session may not be registered yet'
    )
  })

  it('falls back to the generic save message', () => {
    expect(describeSaveFailure(null)).toBe(SESSION_SAVE_FAILED_MESSAGE)
    expect(describeSaveFailure({ ok: true, rowsUpdated: 1 })).toBe(SESSION_SAVE_FAILED_MESSAGE)
  })
})
