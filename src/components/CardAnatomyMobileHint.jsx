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
        Start with the list below the sample card. Tap each part to read what it means right there.
        You can also tap the numbered dots on the card. Explore all six to continue.
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
