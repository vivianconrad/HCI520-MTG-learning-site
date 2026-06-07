/** Routes where the keyword guide and inline hints must stay hidden. */
export const KEYWORD_DICTIONARY_HIDDEN_PATHS = ['/pretest', '/posttest']

/** Lesson routes where bottom navigation can overlap the keyword FAB on mobile. */
export const LESSON_KEYWORD_ROUTES = [
  '/what-is-mtg',
  '/lesson/intro',
  '/lesson/1',
  '/lesson/2',
  '/lesson/3',
  '/lesson/4',
]

export function isKeywordDictionaryHiddenPath(pathname) {
  return KEYWORD_DICTIONARY_HIDDEN_PATHS.includes(pathname)
}

export function isLessonKeywordRoute(pathname) {
  return LESSON_KEYWORD_ROUTES.includes(pathname)
}

export function shouldShowKeywordDictionary(pathname, requested = false) {
  return requested && !isKeywordDictionaryHiddenPath(pathname)
}
