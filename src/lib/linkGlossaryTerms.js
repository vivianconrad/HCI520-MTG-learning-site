import { getKeywordDefinition } from '../data/keywordDictionary.js'

/**
 * Match phrases in lesson copy to canonical glossary terms.
 * Longer patterns must appear first so they win overlaps.
 */
const GLOSSARY_MATCHES = [
  { pattern: /\bsummoning sickness\b/gi, term: 'Summoning sickness' },
  { pattern: /\bhand size limit\b/gi, term: 'Hand size limit' },
  { pattern: /\bdiscard down to seven\b/gi, term: 'Hand size limit' },
  { pattern: /\bmore than seven cards in hand\b/gi, term: 'Hand size limit' },
  { pattern: /\bcolorless mana\b/gi, term: 'Colorless mana' },
  { pattern: /\bgeneric mana\b/gi, term: 'Generic mana' },
  { pattern: /\bmana pool\b/gi, term: 'Mana pool' },
  { pattern: /\bplay(?:ing)?\s+(?:a\s+)?land\b/gi, term: 'Play (a land)' },
  { pattern: /\bplay(?:ing)?\s+lands\b/gi, term: 'Play (a land)' },
  { pattern: /\blands?\s+are\s+played\b/gi, term: 'Play (a land)' },
  { pattern: /\bplayed,\s+not\s+cast\b/gi, term: 'Play (a land)' },
  { pattern: /\bone land per turn\b/gi, term: 'Play (a land)' },
  { pattern: /\bactivated abilities?\b/gi, term: 'Activate (ability)' },
  { pattern: /\bactivat(?:e|es|ed|ing)\b/gi, term: 'Activate (ability)' },
  { pattern: /\bcounter(?:ing|ed|s)?\s+(?:a\s+)?spell\b/gi, term: 'Counter (a spell)' },
  { pattern: /\bcounters?\s+another spell\b/gi, term: 'Counter (a spell)' },
  { pattern: /\buntap(?:ped|ping|s)?\b/gi, term: 'Tap / Untap' },
  { pattern: /\buntap step\b/gi, term: 'Tap / Untap' },
  { pattern: /\btap(?:ped|ping|s)?\b/gi, term: 'Tap / Untap' },
  { pattern: /\bpermanents?\b/gi, term: 'Permanent' },
  { pattern: /\blibraries\b/gi, term: 'Library' },
  { pattern: /\blibrary\b/gi, term: 'Library' },
  { pattern: /\bstack\b/gi, term: 'Stack' },
  { pattern: /\bpriority\b/gi, term: 'Priority' },
  { pattern: /\bresolv(?:e|es|ed|ing)\b/gi, term: 'Resolve' },
  { pattern: /\brespond(?:ing|s)?\b/gi, term: 'Respond' },
  { pattern: /\bin response\b/gi, term: 'Respond' },
  { pattern: /\bcast(?:ing|s)?\b/gi, term: 'Cast' },
]

function collectMatches(text) {
  const matches = []

  for (const { pattern, term } of GLOSSARY_MATCHES) {
    const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)
    let match = re.exec(text)
    while (match) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        value: match[0],
        term,
        definition: getKeywordDefinition(term),
      })
      match = re.exec(text)
    }
  }

  return matches
}

function selectNonOverlapping(matches) {
  const sorted = [...matches].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    return b.end - b.start - (a.end - a.start)
  })

  const selected = []
  let cursor = 0

  for (const match of sorted) {
    if (match.start < cursor || !match.definition) continue
    selected.push(match)
    cursor = match.end
  }

  return selected
}

/**
 * Split plain text into alternating plain-text and glossary segments.
 * @param {string} text
 * @returns {Array<{ type: 'text', value: string } | { type: 'keyword', value: string, term: string, definition: string }>}
 */
export function linkGlossaryTerms(text) {
  if (!text) return [{ type: 'text', value: '' }]

  const selected = selectNonOverlapping(collectMatches(text))
  if (selected.length === 0) return [{ type: 'text', value: text }]

  const segments = []
  let cursor = 0

  for (const match of selected) {
    if (match.start > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, match.start) })
    }
    segments.push({
      type: 'keyword',
      value: match.value,
      term: match.term,
      definition: match.definition,
    })
    cursor = match.end
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) })
  }

  return segments
}
