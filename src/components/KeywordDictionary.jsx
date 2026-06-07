import { useEffect, useMemo, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'
import { KEYWORD_TERMS } from '../data/keywordDictionary.js'
import './KeywordDictionary.css'

export default function KeywordDictionary() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const searchRef = useRef(null)
  const listWrapRef = useRef(null)

  useFocusTrap(panelRef, open)

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return KEYWORD_TERMS

    const termMatches = KEYWORD_TERMS.filter(({ term }) =>
      term.toLowerCase().includes(normalized)
    )
    if (termMatches.length > 0) return termMatches

    return KEYWORD_TERMS.filter(({ definition }) =>
      definition.toLowerCase().includes(normalized)
    )
  }, [query])

  useEffect(() => {
    if (!open) return undefined
    listWrapRef.current?.scrollTo({ top: 0 })
  }, [query, open])

  useEffect(() => {
    if (!open) return undefined
    const id = window.requestAnimationFrame(() => searchRef.current?.focus())
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(id)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) return undefined
    const id = window.requestAnimationFrame(() => triggerRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="keyword-dictionary__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="keyword-dictionary-panel"
        title="Open the full keyword guide, including informal terms like summoning sickness."
        onClick={() => {
          setQuery('')
          setOpen(true)
        }}
      >
        Keyword guide
      </button>

      {open ? (
        <div className="keyword-dictionary" role="presentation">
          <button
            type="button"
            className="keyword-dictionary__backdrop"
            aria-label="Close keyword guide"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id="keyword-dictionary-panel"
            className="keyword-dictionary__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyword-dictionary-title"
          >
            <header className="keyword-dictionary__header">
              <div className="keyword-dictionary__intro">
                <h2 id="keyword-dictionary-title" className="keyword-dictionary__title">
                  Keyword guide
                </h2>
                <p className="keyword-dictionary__lede">
                  Search every term here, including informal ones like summoning sickness. Official
                  rules terms in lessons also appear in gold. Hover or tap them for the same quick
                  definitions.
                </p>
              </div>
              <button
                type="button"
                className="keyword-dictionary__close"
                aria-label="Close keyword guide"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </header>

            <label className="keyword-dictionary__search-label" htmlFor="keyword-dictionary-search">
              Search terms
            </label>
            <input
              ref={searchRef}
              id="keyword-dictionary-search"
              type="search"
              className="keyword-dictionary__search"
              placeholder="Tap, stack, priority…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />

            <div ref={listWrapRef} className="keyword-dictionary__list-wrap">
              {filteredTerms.length === 0 ? (
                <p className="keyword-dictionary__empty">No terms match your search.</p>
              ) : (
                <dl className="keyword-dictionary__list">
                  {filteredTerms.map(({ term, definition }) => (
                    <div key={term} className="keyword-dictionary__entry">
                      <dt className="keyword-dictionary__term">{term}</dt>
                      <dd className="keyword-dictionary__definition">{definition}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
