import { describe, expect, it } from 'vitest'
import {
  isKeywordDictionaryHiddenPath,
  isLessonKeywordRoute,
  shouldShowKeywordDictionary,
} from './assessmentRoutes.js'

describe('isKeywordDictionaryHiddenPath', () => {
  it('hides the keyword guide on pre-test and post-test routes', () => {
    expect(isKeywordDictionaryHiddenPath('/pretest')).toBe(true)
    expect(isKeywordDictionaryHiddenPath('/posttest')).toBe(true)
  })

  it('allows the keyword guide on lesson routes', () => {
    expect(isKeywordDictionaryHiddenPath('/lesson/1')).toBe(false)
    expect(isKeywordDictionaryHiddenPath('/what-is-mtg')).toBe(false)
  })
})

describe('isLessonKeywordRoute', () => {
  it('flags lesson screens that show bottom navigation with the keyword guide', () => {
    expect(isLessonKeywordRoute('/lesson/1')).toBe(true)
    expect(isLessonKeywordRoute('/what-is-mtg')).toBe(true)
    expect(isLessonKeywordRoute('/pretest')).toBe(false)
    expect(isLessonKeywordRoute('/welcome')).toBe(false)
  })
})

describe('shouldShowKeywordDictionary', () => {
  it('requires an explicit request and a non-assessment route', () => {
    expect(shouldShowKeywordDictionary('/lesson/1', true)).toBe(true)
    expect(shouldShowKeywordDictionary('/lesson/1', false)).toBe(false)
    expect(shouldShowKeywordDictionary('/pretest', true)).toBe(false)
    expect(shouldShowKeywordDictionary('/posttest', true)).toBe(false)
  })
})
