import { useEffect, useId, useRef, useState } from 'react'
import './KeywordTooltip.css'

function prefersHover() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

export default function KeywordTooltip({ term, definition, children }) {
  const tooltipId = useId()
  const rootRef = useRef(null)
  const popupRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [placement, setPlacement] = useState('above')
  const open = hovered || pinned

  useEffect(() => {
    if (!open) return undefined

    function updatePlacement() {
      const root = rootRef.current
      const popup = popupRef.current
      if (!root || !popup) return

      const rootRect = root.getBoundingClientRect()
      const popupHeight = popup.offsetHeight || 100
      const spaceAbove = rootRect.top
      const spaceBelow = window.innerHeight - rootRect.bottom

      setPlacement(spaceAbove < popupHeight + 16 && spaceBelow > spaceAbove ? 'below' : 'above')
    }

    updatePlacement()
    const frame = requestAnimationFrame(updatePlacement)
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, true)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement, true)
    }
  }, [open, definition])

  useEffect(() => {
    if (!open) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setPinned(false)
        setHovered(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!pinned) return undefined

    function onPointerDown(event) {
      if (rootRef.current?.contains(event.target)) return
      setPinned(false)
      setHovered(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [pinned])

  return (
    <span
      ref={rootRef}
      className={[
        'keyword-tooltip',
        open ? 'keyword-tooltip--open' : '',
        pinned ? 'keyword-tooltip--pinned' : '',
        placement === 'below' ? 'keyword-tooltip--below' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => {
        if (prefersHover()) setHovered(true)
      }}
      onMouseLeave={() => {
        if (prefersHover()) setHovered(false)
      }}
    >
      <button
        type="button"
        className="keyword-tooltip__trigger mtg-rules-term"
        aria-expanded={open}
        aria-controls={tooltipId}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setHovered(true)}
        onBlur={(event) => {
          if (rootRef.current?.contains(event.relatedTarget)) return
          setHovered(false)
          setPinned(false)
        }}
        onClick={() => setPinned((value) => !value)}
      >
        {children}
      </button>
      <span
        id={tooltipId}
        ref={popupRef}
        role="tooltip"
        className="keyword-tooltip__popup"
        aria-hidden={!open}
      >
        <span className="keyword-tooltip__term">{term}</span>
        <span className="keyword-tooltip__definition">{definition}</span>
        {pinned ? (
          <span className="keyword-tooltip__hint">Tap again or press Escape to close.</span>
        ) : null}
      </span>
    </span>
  )
}
