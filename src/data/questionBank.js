const questionBank = [
  // LO1 — Card anatomy
  // Distractors: other card types learners might confuse with creatures
  {
    id: 'lo1_q1',
    lo: 'LO1',
    question: 'What type of card is this?',
    hasImage: true,
    imageKey: 'shadowmage-infiltrator',
    imageAlt: 'Shadowmage Infiltrator — Creature',
    options: ['Creature', 'Instant', 'Land', 'Sorcery'],
    correctIndex: 0,
  },
  // Distractors: conflate mana cost with combat stats or loyalty
  {
    id: 'lo1_q2',
    lo: 'LO1',
    question: 'What does the number in the top right corner of a card represent?',
    options: ['Power', 'Mana cost', 'Toughness', 'Loyalty'],
    correctIndex: 1,
  },
  // Distractors: confuse type line or mana cost with rules text location
  {
    id: 'lo1_q3',
    lo: 'LO1',
    question: 'Which part of a card tells you what it can do during the game?',
    options: ['Mana cost', 'Text box', 'Type line', 'Power/Toughness'],
    correctIndex: 1,
  },
  // Distractors: mix up P/T with mana cost, loyalty, or generic combat terms
  {
    id: 'lo1_q4',
    lo: 'LO1',
    question: "A card shows '3/2' in the bottom right corner. What do these numbers mean?",
    options: ['Mana cost and loyalty', 'Power and toughness', 'Attack and defence', 'Cost and ability'],
    correctIndex: 1,
  },

  // LO2 — Turn structure
  // Distractors: reorder phases or swap main/combat order
  {
    id: 'lo2_q1',
    lo: 'LO2',
    question: 'Which of the following correctly sequences the steps of an MTG turn?',
    options: [
      'Untap, Upkeep, Draw, Main 1, Combat, Main 2, End',
      'Draw, Untap, Upkeep, Main 1, Combat, Main 2, End',
      'Untap, Upkeep, Draw, Combat, Main 1, Main 2, End',
      'Untap, Upkeep, Draw, Main 1, Main 2, Combat, End',
    ],
    correctIndex: 0,
  },
  // Distractors: adjacent phases that learners commonly mix up
  {
    id: 'lo2_q2',
    lo: 'LO2',
    question: 'Which phase comes immediately after the draw step?',
    options: ['Combat', 'Second main phase', 'First main phase', 'Upkeep'],
    correctIndex: 2,
  },
  // Distractors: "Stack phase" is not a turn phase — tests phase vs. zone confusion
  {
    id: 'lo2_q3',
    lo: 'LO2',
    question: 'Which of the following is NOT one of the five phases of an MTG turn?',
    options: ['Combat phase', 'Stack phase', 'Main phase', 'End phase'],
    correctIndex: 1,
  },

  // LO3 — Turn steps in detail
  // Distractors: other steps where drawing might be incorrectly associated
  {
    id: 'lo3_q1',
    lo: 'LO3',
    question: 'During which step do you draw a card?',
    options: ['Untap', 'Upkeep', 'Draw', 'Main phase'],
    correctIndex: 2,
  },
  // Distractors: confuse untap with tap, draw, or combat actions
  {
    id: 'lo3_q2',
    lo: 'LO3',
    question: 'What happens during the untap step?',
    options: [
      'You draw a card',
      'You tap all your lands',
      'You untap all your permanents',
      'You declare attackers',
    ],
    correctIndex: 2,
  },
  // Distractors: other steps where triggered abilities might seem to occur
  {
    id: 'lo3_q3',
    lo: 'LO3',
    question: 'During the upkeep step, what is a player most likely doing?',
    options: [
      'Drawing a card',
      'Declaring attackers',
      'Resolving triggered abilities',
      'Untapping permanents',
    ],
    correctIndex: 2,
  },
  // Distractors: main phase and upkeep are common wrong answers for combat timing
  {
    id: 'lo3_q4',
    lo: 'LO3',
    question: 'When can a player declare attackers?',
    options: ['First main phase', 'Combat phase', 'End step', 'Upkeep'],
    correctIndex: 1,
  },

  // LO4 — Instant vs sorcery timing
  // Distractors: restrict instants to main phase, combat, or opponent's turn
  {
    id: 'lo4_q1',
    lo: 'LO4',
    question: 'When can you cast an instant?',
    hasImage: true,
    imageKey: 'shock',
    imageAlt: 'Shock — Instant',
    options: [
      'Only during your main phase',
      'Only during combat',
      'At any time',
      "Only during your opponent's turn",
    ],
    correctIndex: 2,
  },
  // Distractors: "any time" is the instant rule — tests sorcery restriction
  {
    id: 'lo4_q2',
    lo: 'LO4',
    question: 'When can you cast a sorcery?',
    hasImage: true,
    imageKey: 'cultivate',
    imageAlt: 'Cultivate — Sorcery',
    options: [
      'Any time',
      'Only during your main phase when the stack is empty',
      'Only during combat',
      "Only during your opponent's turn",
    ],
    correctIndex: 1,
  },
  // Distractors: turn ownership and phase restrictions learners often assume
  {
    id: 'lo4_q3',
    lo: 'LO4',
    question:
      'Your opponent just attacked you with a creature. You have an instant in your hand. Can you cast it?',
    hasImage: true,
    imageKey: 'giant-growth',
    imageAlt: 'Giant Growth — Instant',
    options: [
      'Yes, instants can be cast any time',
      "No, it's not your turn",
      'Yes, but only before they declared attackers',
      'No, you need to be in your main phase',
    ],
    correctIndex: 0,
  },
  // Distractors: pair instants with other types that have different timing rules
  {
    id: 'lo4_q4',
    lo: 'LO4',
    question:
      'Which two card types can only be cast during your own main phase when the stack is empty?',
    options: [
      'Instants and enchantments',
      'Sorceries and instants',
      'Creatures and instants',
      'Sorceries and enchantments',
    ],
    correctIndex: 3,
  },
]

export default questionBank
