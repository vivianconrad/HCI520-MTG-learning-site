export const CURIOSITY_FOCUS = {
  READING_CARDS: 'reading_cards',
  CARD_TYPES: 'card_types',
  TURNS: 'turns',
  GUIDE: 'guide',
}

export const CURIOSITY_OPTIONS = [
  {
    id: CURIOSITY_FOCUS.READING_CARDS,
    label: 'Reading cards',
    hint: 'Mana costs, types, and what the text box means',
    lessonNum: 1,
  },
  {
    id: CURIOSITY_FOCUS.CARD_TYPES,
    label: 'Card types',
    hint: 'Creatures, instants, lands, and when you can play each',
    lessonNum: 2,
  },
  {
    id: CURIOSITY_FOCUS.TURNS,
    label: 'How turns work',
    hint: 'Phases, combat, and when you can cast spells',
    lessonNum: 3,
  },
  {
    id: CURIOSITY_FOCUS.GUIDE,
    label: "I'll follow the guide",
    hint: 'Walk through every lesson in order',
    lessonNum: null,
  },
]

const FOCUS_LESSON_PHRASE = {
  [CURIOSITY_FOCUS.READING_CARDS]: 'reading cards',
  [CURIOSITY_FOCUS.CARD_TYPES]: 'card types',
  [CURIOSITY_FOCUS.TURNS]: 'how turns work',
}

export function getCuriosityWhatIsMtgNote(focus) {
  if (!focus || focus === CURIOSITY_FOCUS.GUIDE) return null
  const phrase = FOCUS_LESSON_PHRASE[focus]
  const option = CURIOSITY_OPTIONS.find((o) => o.id === focus)
  if (!phrase || !option?.lessonNum) return null
  return `You said you are most curious about ${phrase}. Lesson ${option.lessonNum} covers that topic. First, a quick overview of the game, then how to read a card. You will still complete every lesson in order.`
}

export const REVIEW_TOPIC_CHOICES = [
  { id: 'reading', label: 'How to Read a Card', path: '/lesson/1' },
  { id: 'types', label: 'Card Types', path: '/lesson/2' },
  { id: 'turns', label: 'How a Turn Works', path: '/lesson/3' },
]
