/** Routes where the keyword guide and inline hints must stay hidden. */
export const KEYWORD_DICTIONARY_HIDDEN_PATHS = ['/pretest', '/posttest']

export function isKeywordDictionaryHiddenPath(pathname) {
  return KEYWORD_DICTIONARY_HIDDEN_PATHS.includes(pathname)
}

export function shouldShowKeywordDictionary(pathname, requested = false) {
  return requested && !isKeywordDictionaryHiddenPath(pathname)
}
