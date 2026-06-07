import { useMemo } from 'react'
import { linkGlossaryTerms } from '../lib/linkGlossaryTerms.js'
import KeywordTooltip from './KeywordTooltip.jsx'

/** Lesson-only helper. Do not use in pre-test or post-test question copy. */
export default function GlossaryText({
  text,
  children,
  as: Tag = 'span',
  className,
  enabled = true,
}) {
  const source = text ?? children

  const segments = useMemo(
    () => (enabled && typeof source === 'string' ? linkGlossaryTerms(source) : null),
    [enabled, source]
  )

  if (!enabled || typeof source !== 'string') {
    return typeof source === 'string' ? <Tag className={className}>{source}</Tag> : (source ?? null)
  }

  return (
    <Tag className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={`text-${index}`}>{segment.value}</span>
        }

        return (
          <KeywordTooltip
            key={`kw-${index}-${segment.term}`}
            term={segment.term}
            definition={segment.definition}
          >
            {segment.value}
          </KeywordTooltip>
        )
      })}
    </Tag>
  )
}
