/** Short inline explanations for missed pre/post test questions (shown on Results). */
const QUESTION_EXPLANATIONS = {
  lo0_q1:
    'Magic is a two-player (or more) collectible card game. Each player uses a deck of cards to cast spells, play lands, and attack until an opponent reaches 0 life.',
  lo0_q2:
    'Commander decks are exactly 100 cards with no duplicates except basic lands, plus a legendary commander that defines your deck’s color identity.',
  lo0_q3:
    'Most Standard-style constructed decks require at least 60 cards. Limited formats like Draft use 40-card minimum decks.',
  lo0_q4:
    'Lands are played, not cast. During your main phase you may put one land from your hand onto the battlefield (one per turn by default).',
  lo0_q5:
    'Lands are played directly to the battlefield without using the stack. Spells are cast: you pay mana, they go on the stack, and opponents can respond.',
  lo0_q6:
    'Tapping turns a permanent sideways to show it has been used. Lands tap for mana; creatures tap when they attack. They untap during your untap step.',
  lo0_q7:
    'Your deck sits face-down as your library. You draw from the top of your library during the game.',
  lo0_q8:
    'When a creature dies, it goes to its owner’s graveyard (a face-up discard pile) unless a card says to exile it or put it somewhere else.',
  lo0_q9:
    'Exile is a separate zone for cards removed from the game. Exiled cards are not in the graveyard and usually cannot be used again unless a card allows it.',
  lo0_q10:
    'During the untap step, all of your tapped permanents turn upright so you can use them again on that turn.',
  lo0_q11:
    'By default you may play only one land per turn, during either your first or second main phase.',

  lo1_q1:
    'The type line says “Creature.” Creatures stay on the battlefield and can attack and block in combat.',
  lo1_q2:
    'The mana cost in the top right shows how much mana and which colors you need to cast the spell.',
  lo1_q3:
    'The text box lists the card’s abilities and rules text: what the card actually does in the game.',
  lo1_q4:
    'On creatures, the first number is power (damage dealt in combat) and the second is toughness (damage needed to destroy it).',
  lo1_q5:
    'Basic lands have the type “Land” on the type line. “Plains” is a subtype, not a separate card type.',
  lo1_q6:
    'Planeswalkers have their own type line and a loyalty counter in the bottom right, not power/toughness.',
  lo1_q7:
    'Enchantments stay on the battlefield and provide ongoing effects. “Aura” is an enchantment subtype.',
  lo1_q8: 'This card’s type line identifies it as a planeswalker, not a creature or sorcery.',
  lo1_q9: 'Instants can be cast any time you have priority, including during an opponent’s turn.',
  lo1_q10:
    'Sorceries are non-permanent spells. They can only be cast at sorcery speed unless a card says otherwise.',
  lo1_q11:
    'Artifacts are permanents that stay on the battlefield. Sol Ring is an artifact, not an enchantment.',
  lo1_q12:
    'Counterspell is an instant. Note the word “Instant” on the type line and its flash timing.',
  lo1_q13:
    'Duress is a sorcery. Sorceries resolve and then go to the graveyard; they do not stay on the battlefield.',
  lo1_q14: 'Islands are lands. The card type is “Land”; “Island” is a basic land subtype.',
  lo1_q15: 'Llanowar Elves is a creature. It has power and toughness and can attack and block.',
  lo1_q16: 'Hyena Umbra is an enchantment. Auras are enchantments that attach to other permanents.',
  lo1_q17:
    'Nahiri is a planeswalker card, identified by the planeswalker type and loyalty abilities.',
  lo1_q18: 'Mountains are basic lands. The card type is “Land,” not “Mountain.”',

  lo2_q1:
    'A turn has five phases in order: Beginning (untap, upkeep, draw), First Main, Combat, Second Main, End.',
  lo2_q2:
    'After the draw step in the beginning phase comes your first main phase, when you usually play a land and cast sorcery-speed spells.',
  lo2_q3:
    'The stack is a zone where spells wait to resolve. It is not one of the five turn phases.',
  lo2_q4:
    'The player who takes the first turn of the game skips their draw step on that turn only.',
  lo2_q5:
    'The beginning phase contains the untap, upkeep, and draw steps before your first main phase.',
  lo2_q6:
    'The stack holds spells and abilities that are waiting to resolve. When you or your opponent casts a spell, it goes on the stack first, and either player can respond before it resolves, for example Counterspell against an opponent’s spell.',
  lo2_q7:
    'Priority is the right to cast spells or activate abilities before your opponent at a given moment in the turn.',
  lo2_q8: 'On your turn, you (the active player) receive priority first in each step and phase.',
  lo2_q9:
    'Lands are normally played during a main phase: your first or second main phase on your turn.',
  lo2_q10:
    'After a spell resolves, players get priority again and may cast more spells or pass until the stack is empty.',

  lo3_q1:
    'You draw one card during the draw step, which is part of the beginning phase (after upkeep).',
  lo3_q2:
    'During the untap step, all of your permanents untap. They turn upright so you can use them again.',
  lo3_q3:
    'The upkeep step is when “at the beginning of your upkeep” triggers resolve, before you draw.',
  lo3_q4: 'You declare attackers during the combat phase, not during a main phase or upkeep.',
  lo3_q5:
    'Summoning sickness prevents a creature from attacking the turn you cast it unless it has haste.',
  lo3_q6:
    'A land that entered the battlefield tapped cannot be tapped for mana until it untaps on a later turn.',
  lo3_q7: 'Blockers must be untapped creatures you control. They do not tap when they block.',

  lo4_q1: 'Instants can be cast any time you have priority, on your turn or your opponent’s turn.',
  lo4_q2:
    'Sorceries can only be cast during your main phase when the stack is empty (sorcery speed).',
  lo4_q3:
    'When your opponent attacks, you can cast instants like Giant Growth during combat because instants do not require sorcery speed.',
  lo4_q4:
    'Creatures, sorceries, enchantments, artifacts, and planeswalkers use sorcery-speed timing by default. Instants and lands do not.',
  lo4_q5:
    'Counterspell is an instant, so you can cast it while your opponent’s spell is on the stack to counter it before it resolves.',
}

export function getQuestionExplanation(question) {
  if (!question?.id) return null
  return QUESTION_EXPLANATIONS[question.id] ?? null
}
