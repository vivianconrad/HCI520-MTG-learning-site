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

    expect(keywords).toEqual(['Priority', 'Spell', 'Resolve', 'Stack'])
  })

  it('links spell without overlapping cast a spell with the Cast term only', () => {
    const segments = linkGlossaryTerms('You can cast a spell when the stack is empty.')
    const keywords = segments.filter((segment) => segment.type === 'keyword')

    expect(keywords.map((k) => k.term)).toEqual(['Cast', 'Stack'])
    expect(keywords.find((k) => k.term === 'Cast')?.value).toBe('cast a spell')
  })

  it('links mulligan in opening-hand setup copy', () => {
    const segments = linkGlossaryTerms(
      'If the hand is weak, many groups allow a mulligan: shuffle back and draw one fewer card.'
    )
    const keywords = segments.filter((segment) => segment.type === 'keyword')

    expect(keywords).toHaveLength(1)
    expect(keywords[0].value).toBe('mulligan')
    expect(keywords[0].term).toBe('Mulligan')
  })

  it('links graveyards in simplified table layout caption', () => {
    const segments = linkGlossaryTerms(
      'A simplified table layout: play areas (battlefield) in the middle, decks (libraries) and discard piles (graveyards) on each side.'
    )
    const keywords = segments.filter((segment) => segment.type === 'keyword').map((k) => k.term)

    expect(keywords).toContain('Library')
    expect(keywords).toContain('Graveyard')
    expect(
      segments.find((segment) => segment.type === 'keyword' && segment.term === 'Graveyard')?.value
    ).toBe('graveyards')
  })

  it('links exile and graveyard in the exile zone description', () => {
    const segments = linkGlossaryTerms(
      'A separate zone for cards removed from the game. Exiled cards are not in your graveyard and usually cannot be used again unless a card says so.'
    )
    const keywords = segments.filter((segment) => segment.type === 'keyword')

    expect(keywords.map((k) => k.term)).toEqual(['Exile', 'Graveyard'])
    expect(keywords.find((k) => k.term === 'Exile')?.value).toBe('Exiled')
  })
})
