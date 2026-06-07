import { describe, expect, it } from 'vitest'
import { CURIOSITY_FOCUS, getCuriosityWhatIsMtgNote } from './learnerChoice.js'

describe('getCuriosityWhatIsMtgNote', () => {
  it('returns null when focus is missing or guide mode', () => {
    expect(getCuriosityWhatIsMtgNote(null)).toBeNull()
    expect(getCuriosityWhatIsMtgNote(undefined)).toBeNull()
    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.GUIDE)).toBeNull()
  })

  it('returns a lesson-specific note for each curiosity focus', () => {
    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.READING_CARDS)).toContain(
      'reading cards'
    )
    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.READING_CARDS)).toContain('Lesson 1')

    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.CARD_TYPES)).toContain('card types')
    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.CARD_TYPES)).toContain('Lesson 2')

    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.TURNS)).toContain('how turns work')
    expect(getCuriosityWhatIsMtgNote(CURIOSITY_FOCUS.TURNS)).toContain('Lesson 3')
  })
})
