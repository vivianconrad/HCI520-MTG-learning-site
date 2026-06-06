import GlossaryText from './GlossaryText.jsx'

export function renderGlossaryString(text, key, className) {
  if (typeof text !== 'string') return null

  return (
    <p key={key} className={className}>
      <GlossaryText text={text} />
    </p>
  )
}

export function renderGlossaryListItem(text) {
  return <GlossaryText text={text} />
}
