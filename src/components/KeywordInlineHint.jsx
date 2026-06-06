import { useState } from 'react'
import { getKeywordDefinition } from '../data/keywordDictionary.js'
import KeywordTooltip from './KeywordTooltip.jsx'
import './KeywordTooltip.css'
import './KeywordInlineHint.css'

const HINT_DISMISSED_KEY = 'mtg-keyword-inline-hint-dismissed'

const STACK_DEFINITION = getKeywordDefinition('Stack')

export default function KeywordInlineHint() {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(HINT_DISMISSED_KEY) === '1',
  )

  if (dismissed) {
    return null
  }

  function dismissHint() {
    window.localStorage.setItem(HINT_DISMISSED_KEY, '1')
    setDismissed(true)
  }

  return (
    <aside className="keyword-inline-hint" aria-label="Rules term help">
      <p className="keyword-inline-hint__text">
        Gold highlights mark official rules terms. Try{' '}
        {STACK_DEFINITION ? (
          <KeywordTooltip term="Stack" definition={STACK_DEFINITION}>
            stack
          </KeywordTooltip>
        ) : (
          <span className="mtg-rules-term keyword-inline-hint__sample">stack</span>
        )}
        {' '}
        here, or tap any highlighted word in the lesson.
      </p>
      <button
        type="button"
        className="keyword-inline-hint__dismiss"
        aria-label="Dismiss rules term tip"
        onClick={dismissHint}
      >
        ×
      </button>
    </aside>
  )
}
