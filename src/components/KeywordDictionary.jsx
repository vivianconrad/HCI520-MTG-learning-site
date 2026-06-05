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

  useFocusTrap(panelRef, open)

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return KEYWORD_TERMS
    return KEYWORD_TERMS.filter(
      ({ term, definition }) =>
        term.toLowerCase().includes(normalized) || definition.toLowerCase().includes(normalized),
    )
  }, [query])

  useEffect(() => {
    if (!open) return undefined
    setQuery('')
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
        onClick={() => setOpen(true)}
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
              <h2 id="keyword-dictionary-title" className="keyword-dictionary__title">
                Keyword guide
              </h2>
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

            <div className="keyword-dictionary__list-wrap">
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
