import { describe, expect, it } from 'vitest'
import { linkGlossaryTerms } from './linkGlossaryTerms.js'

describe('linkGlossaryTerms', () => {
  it('returns plain text when no glossary terms match', () => {
    expect(linkGlossaryTerms('Hello world')).toEqual([{ type: 'text', value: 'Hello world' }])
  })

  it('prefers a longer match when shorter patterns overlap the same span', () => {
    const segments = linkGlossaryTerms('During the untap step, nothing else happens.')
    const keywords = segments.filter((segment) => segment.type === 'keyword')

    expect(keywords).toHaveLength(1)
    expect(keywords[0].value).toBe('untap step')
    expect(keywords[0].term).toBe('Tap / Untap')
  })

  it('links separate glossary terms in the same sentence', () => {
    const segments = linkGlossaryTerms('Use priority before a spell resolves on the stack.')
    const keywords = segments.filter((segment) => segment.type === 'keyword').map((k) => k.term)

    expect(keywords).toEqual(['Priority', 'Resolve', 'Stack'])
  })
})
