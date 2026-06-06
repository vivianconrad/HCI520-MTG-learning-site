import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { ConfirmContext } from './confirmContext.js'

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const resolveRef = useRef(null)

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setDialog({
        message,
        title: options.title ?? 'Leave this step?',
        confirmLabel: options.confirmLabel ?? 'Leave',
        cancelLabel: options.cancelLabel ?? 'Stay',
      })
    })
  }, [])

  const close = useCallback((result) => {
    resolveRef.current?.(result)
    resolveRef.current = null
    setDialog(null)
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      <div {...(dialog ? { inert: true } : {})}>{children}</div>
      {dialog ? (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          confirmLabel={dialog.confirmLabel}
          cancelLabel={dialog.cancelLabel}
          onCancel={() => close(false)}
          onConfirm={() => close(true)}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}
