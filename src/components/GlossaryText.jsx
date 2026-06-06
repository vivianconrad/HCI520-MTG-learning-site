import { linkGlossaryTerms } from '../lib/linkGlossaryTerms.js'
import KeywordTooltip from './KeywordTooltip.jsx'

export default function GlossaryText({ text, children, as: Tag = 'span', className }) {
  const source = text ?? children

  if (typeof source !== 'string') {
    return source ?? null
  }

  const segments = linkGlossaryTerms(source)

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
