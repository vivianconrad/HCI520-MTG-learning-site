import { getKeywordDefinition, isOfficialKeyword } from '../data/keywordDictionary.js'

/**
 * Match phrases in lesson copy to canonical glossary terms.
 * Longer patterns must appear first so they win overlaps.
 */
const GLOSSARY_MATCHES = [
  { pattern: /\bsummoning sickness\b/gi, term: 'Summoning sickness' },
  { pattern: /\blegend(?:ary)?\s+rule\b/gi, term: 'Legendary' },
  { pattern: /\blegendary\b/gi, term: 'Legendary' },
  { pattern: /\bhand size limit\b/gi, term: 'Hand size limit' },
  { pattern: /\bdiscard down to seven\b/gi, term: 'Hand size limit' },
  { pattern: /\bmore than seven cards in hand\b/gi, term: 'Hand size limit' },
  { pattern: /\bcolorless mana\b/gi, term: 'Colorless mana' },
  { pattern: /\bgeneric mana\b/gi, term: 'Generic mana' },
  { pattern: /\bmana pool\b/gi, term: 'Mana pool' },
  { pattern: /\bmulligans?\b/gi, term: 'Mulligan' },
  { pattern: /\bplay(?:ing)?\s+(?:a\s+)?land\b/gi, term: 'Play (a land)' },
  { pattern: /\bplay(?:ing)?\s+lands\b/gi, term: 'Play (a land)' },
  { pattern: /\blands?\s+are\s+played\b/gi, term: 'Play (a land)' },
  { pattern: /\bplayed,\s+not\s+cast\b/gi, term: 'Play (a land)' },
  { pattern: /\bone land per turn\b/gi, term: 'Play (a land)' },
  { pattern: /\bactivated abilities?\b/gi, term: 'Activate (ability)' },
  { pattern: /\bactivat(?:e|es|ed|ing)\b/gi, term: 'Activate (ability)' },
  { pattern: /\bcounter(?:ing|ed|s)?\s+(?:a\s+)?spell\b/gi, term: 'Counter (a spell)' },
  { pattern: /\bcounters?\s+another spell\b/gi, term: 'Counter (a spell)' },
  { pattern: /\bspells?\b/gi, term: 'Spell' },
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
  {
    pattern:
      /\bcast(?:ing|s)?\s+(?:a\s+)?(?:spell|creature|instant|sorcery|planeswalker|artifact)\b/gi,
    term: 'Cast',
  },
  { pattern: /\b(?:you|then|to|just|and)\s+cast(?:s|ing)?\b/gi, term: 'Cast' },
  { pattern: /\bcast(?:s|ing)?\s+it\b/gi, term: 'Cast' },
  { pattern: /\b(?:can|could)\s+(?:only\s+)?be\s+cast\b/gi, term: 'Cast' },
  { pattern: /\b(?:can|could)\s+(?:you\s+)?cast\b/gi, term: 'Cast' },
  { pattern: /\bopponent\s+just\s+cast\b/gi, term: 'Cast' },
  { pattern: /\bcast(?:s|ing)?\s+[A-Z][\w'-]+(?:\s+[A-Z][\w'-]+)*\b/g, term: 'Cast' },
]

function collectMatches(text) {
  const matches = []

  for (const { pattern, term } of GLOSSARY_MATCHES) {
    if (!isOfficialKeyword(term)) continue

    pattern.lastIndex = 0
    let match = pattern.exec(text)
    while (match) {
      const definition = getKeywordDefinition(term)
      if (!definition) {
        match = pattern.exec(text)
        continue
      }

      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        value: match[0],
        term,
        definition,
      })
      match = pattern.exec(text)
    }
  }

  return matches
}

function rangesOverlap(a, b) {
  return a.start < b.end && a.end > b.start
}

function selectNonOverlapping(matches) {
  const sorted = [...matches].sort((a, b) => {
    const lengthDiff = b.end - b.start - (a.end - a.start)
    if (lengthDiff !== 0) return lengthDiff
    if (a.start !== b.start) return a.start - b.start
    return 0
  })

  const selected = []

  for (const match of sorted) {
    if (!match.definition) continue
    if (selected.some((picked) => rangesOverlap(match, picked))) continue
    selected.push(match)
  }

  return selected.sort((a, b) => a.start - b.start)
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
