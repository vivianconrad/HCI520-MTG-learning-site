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

const LESSON_CURIOSITY_NOTES = {
  lesson1: {
    [CURIOSITY_FOCUS.READING_CARDS]:
      'This lesson is the one you picked — reading cards. Take your time on each numbered marker.',
    [CURIOSITY_FOCUS.CARD_TYPES]:
      'You said card types interest you most. This lesson covers how to read a card first; Lesson 2 goes deeper on types.',
    [CURIOSITY_FOCUS.TURNS]:
      'You said turns interest you most. Start here with how to read a card; Lesson 3 walks through each turn phase.',
  },
  lesson2: {
    [CURIOSITY_FOCUS.CARD_TYPES]:
      'You picked card types as your focus — this lesson is built for that. Open each type once; you do not need every example slide.',
    [CURIOSITY_FOCUS.READING_CARDS]:
      'You focused on reading cards in Lesson 1. Here you will see how card types change what you can do and when.',
    [CURIOSITY_FOCUS.TURNS]:
      'Turns come next in Lesson 3. This lesson shows when each card type can be played or cast.',
  },
  lesson3: {
    [CURIOSITY_FOCUS.TURNS]:
      'This is your focus topic — how turns work. Visit each phase tab once to unlock Continue.',
    [CURIOSITY_FOCUS.READING_CARDS]:
      'You started with reading cards. This lesson shows where those parts of a card matter during a turn.',
    [CURIOSITY_FOCUS.CARD_TYPES]:
      'You explored card types in Lesson 2. Here you will see when those types fit into each phase.',
  },
}

export function getCuriosityLessonNote(focus, lessonKey) {
  if (!focus || focus === CURIOSITY_FOCUS.GUIDE) return null
  return LESSON_CURIOSITY_NOTES[lessonKey]?.[focus] ?? null
}

export const REVIEW_TOPIC_CHOICES = [
  { id: 'reading', label: 'How to Read a Card', path: '/lesson/1' },
  { id: 'types', label: 'Card Types', path: '/lesson/2' },
  { id: 'turns', label: 'How a Turn Works', path: '/lesson/3' },
]
