import { useState } from 'react'
import './CardAnatomyMobileHint.css'

const HINT_DISMISSED_KEY = 'mtg-card-anatomy-mobile-hint-dismissed'

export default function CardAnatomyMobileHint() {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(HINT_DISMISSED_KEY) === '1'
  )

  if (dismissed) {
    return null
  }

  function dismissHint() {
    window.localStorage.setItem(HINT_DISMISSED_KEY, '1')
    setDismissed(true)
  }

  return (
    <aside className="card-anatomy-mobile-hint" aria-label="Card anatomy tip">
      <p className="card-anatomy-mobile-hint__text">
        Tap each numbered marker on the card to read what that part means. On a phone, you can also
        use the parts list below the diagram. Explore all six before continuing.
      </p>
      <button
        type="button"
        className="card-anatomy-mobile-hint__dismiss"
        aria-label="Dismiss card anatomy tip"
        onClick={dismissHint}
      >
        ×
      </button>
    </aside>
  )
}
