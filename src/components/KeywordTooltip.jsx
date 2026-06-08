import { useEffect, useId, useRef, useState } from 'react'
import './KeywordTooltip.css'

const VIEWPORT_MARGIN = 16
const POPUP_GAP = 10

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
  const [popupStyle, setPopupStyle] = useState(null)
  const open = hovered || pinned

  useEffect(() => {
    if (!open) return undefined

    function updatePosition() {
      const root = rootRef.current
      const popup = popupRef.current
      if (!root || !popup) return

      const rootRect = root.getBoundingClientRect()
      const popupRect = popup.getBoundingClientRect()
      const popupWidth = popupRect.width || popup.offsetWidth || 300
      const popupHeight = popupRect.height || popup.offsetHeight || 100
      const spaceAbove = rootRect.top
      const spaceBelow = window.innerHeight - rootRect.bottom
      const placeBelow = spaceAbove < popupHeight + POPUP_GAP + 6 && spaceBelow > spaceAbove

      let top = placeBelow
        ? rootRect.bottom + POPUP_GAP
        : rootRect.top - popupHeight - POPUP_GAP

      let left = rootRect.left + rootRect.width / 2 - popupWidth / 2
      left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(left, window.innerWidth - popupWidth - VIEWPORT_MARGIN)
      )
      top = Math.max(
        VIEWPORT_MARGIN,
        Math.min(top, window.innerHeight - popupHeight - VIEWPORT_MARGIN)
      )

      setPopupStyle({
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        width: `${Math.round(popupWidth)}px`,
      })
    }

    const popup = popupRef.current
    updatePosition()
    const frame = requestAnimationFrame(updatePosition)
    const resizeObserver =
      popup && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updatePosition())
        : null
    resizeObserver?.observe(popup)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
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

  function togglePinned() {
    setPinned((wasPinned) => {
      const next = !wasPinned
      if (!next && !prefersHover()) {
        setHovered(false)
      }
      return next
    })
  }

  return (
    <span
      ref={rootRef}
      className={[
        'keyword-tooltip',
        open ? 'keyword-tooltip--open' : '',
        pinned ? 'keyword-tooltip--pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="keyword-tooltip__trigger mtg-rules-term"
        aria-label={`${term}, glossary term`}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => {
          if (prefersHover()) setHovered(true)
        }}
        onMouseLeave={() => {
          if (prefersHover()) setHovered(false)
        }}
        onFocus={() => setHovered(true)}
        onBlur={(event) => {
          if (rootRef.current?.contains(event.relatedTarget)) return
          setHovered(false)
          setPinned(false)
        }}
        onClick={togglePinned}
      >
        {children}
      </button>
      <span
        id={tooltipId}
        ref={popupRef}
        role="tooltip"
        className={[
          'keyword-tooltip__popup',
          open && popupStyle ? 'keyword-tooltip__popup--positioned' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!open}
        style={open ? (popupStyle ?? undefined) : undefined}
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
