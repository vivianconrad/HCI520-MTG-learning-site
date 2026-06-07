import './BrowserBackNotice.css'

export default function BrowserBackNotice({ className = '' }) {
  const rootClass = ['browser-back-notice', className].filter(Boolean).join(' ')

  return (
    <p className={rootClass} role="note">
      Use the on-screen buttons to move between steps. Your browser&apos;s back button is disabled
      on this screen.
    </p>
  )
}
