import { describe, expect, it } from 'vitest'
import {
  CURIOSITY_FOCUS,
  getCuriosityLessonNote,
  getCuriosityWhatIsMtgNote,
} from './learnerChoice.js'

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

describe('getCuriosityLessonNote', () => {
  it('returns null for guide mode or missing focus', () => {
    expect(getCuriosityLessonNote(null, 'lesson1')).toBeNull()
    expect(getCuriosityLessonNote(CURIOSITY_FOCUS.GUIDE, 'lesson2')).toBeNull()
  })

  it('returns lesson-specific notes on matching lessons', () => {
    expect(getCuriosityLessonNote(CURIOSITY_FOCUS.READING_CARDS, 'lesson1')).toContain(
      'picked'
    )
    expect(getCuriosityLessonNote(CURIOSITY_FOCUS.CARD_TYPES, 'lesson2')).toContain(
      'card types'
    )
    expect(getCuriosityLessonNote(CURIOSITY_FOCUS.TURNS, 'lesson3')).toContain('focus topic')
  })

  it('returns cross-lesson context when focus points elsewhere', () => {
    expect(getCuriosityLessonNote(CURIOSITY_FOCUS.TURNS, 'lesson1')).toContain('Lesson 3')
    expect(getCuriosityLessonNote(CURIOSITY_FOCUS.READING_CARDS, 'lesson2')).toContain('Lesson 1')
  })
})
