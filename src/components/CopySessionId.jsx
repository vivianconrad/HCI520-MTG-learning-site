import { useState } from 'react'
import './CopySessionId.css'

export default function CopySessionId({ sessionId, className = '' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sessionId)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = sessionId
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`copy-session-id${className ? ` ${className}` : ''}`}>
      <span className="copy-session-id__label">Your session ID:</span>
      <code className="copy-session-id__value">{sessionId}</code>
      <button type="button" className="copy-session-id__button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Session ID copied to clipboard.' : ''}
      </span>
    </div>
  )
}
