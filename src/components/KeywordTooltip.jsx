import { useId, useState } from 'react'
import './KeywordTooltip.css'

export default function KeywordTooltip({ term, definition, children }) {
  const tooltipId = useId()
  const [open, setOpen] = useState(false)

  return (
    <span className={`keyword-tooltip${open ? ' keyword-tooltip--open' : ''}`}>
      <abbr
        className="keyword-tooltip__trigger"
        tabIndex={0}
        aria-describedby={tooltipId}
        title=""
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen((value) => !value)
          }
        }}
      >
        {children}
      </abbr>
      <span
        id={tooltipId}
        role="tooltip"
        className="keyword-tooltip__popup"
      >
        <span className="keyword-tooltip__term">{term}</span>
        <span className="keyword-tooltip__definition">{definition}</span>
      </span>
    </span>
  )
}
