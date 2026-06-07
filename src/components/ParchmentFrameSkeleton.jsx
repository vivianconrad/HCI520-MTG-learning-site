import './ParchmentFrameSkeleton.css'

export default function ParchmentFrameSkeleton({
  className = '',
  screenClassName = 'parchment-skeleton-screen',
  label = 'Loading…',
  compact = false,
}) {
  const rootClass = [screenClassName, className].filter(Boolean).join(' ')
  const frameClass = ['parchment-skeleton__frame', compact ? 'parchment-skeleton__frame--compact' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass} aria-busy="true" aria-live="polite">
      <div className={frameClass}>
        <span className="visually-hidden">{label}</span>
        <div className="parchment-skeleton__line parchment-skeleton__line--breadcrumb" aria-hidden="true" />
        <div className="parchment-skeleton__line parchment-skeleton__line--title" aria-hidden="true" />
        <div className="parchment-skeleton__rule" aria-hidden="true" />
        <div className="parchment-skeleton__line parchment-skeleton__line--body" aria-hidden="true" />
        <div className="parchment-skeleton__line parchment-skeleton__line--body-short" aria-hidden="true" />
        {!compact && (
          <div className="parchment-skeleton__block parchment-skeleton__block--media" aria-hidden="true" />
        )}
        <div className="parchment-skeleton__actions" aria-hidden="true">
          <div className="parchment-skeleton__button" />
        </div>
      </div>
    </div>
  )
}
