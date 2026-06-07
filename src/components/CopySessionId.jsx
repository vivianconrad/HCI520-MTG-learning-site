import { useState } from 'react'
import './CopySessionId.css'

export default function CopySessionId({ sessionId, className = '' }) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  async function handleCopy() {
    setCopyFailed(false)
    try {
      await navigator.clipboard.writeText(sessionId)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
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
      } catch {
        setCopyFailed(true)
      }
    }
  }

  return (
    <div className={`copy-session-id${className ? ` ${className}` : ''}`}>
      <span className="copy-session-id__label">Your session ID:</span>
      <code className="copy-session-id__value">{sessionId}</code>
      <button type="button" className="copy-session-id__button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy session ID'}
      </button>
      {copyFailed ? (
        <p className="copy-session-id__error" role="alert">
          Could not copy automatically. Select the ID above and copy it manually.
        </p>
      ) : null}
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Session ID copied to clipboard.' : ''}
      </span>
    </div>
  )
}
