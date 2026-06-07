import './StackExplainer.css'
import { renderGlossaryListItem, renderGlossaryString } from './glossaryRender.jsx'

const BRIEF = [
  'In Magic, playing and casting are different actions. You play lands; you cast everything else that is a spell.',
  'Playing a land puts it straight onto the battlefield with no stack and no waiting for your opponent to respond. Casting means paying mana and putting a spell on the stack first, where both players can respond before it resolves. On the stack it is a spell; if it stays on the battlefield after resolving, it becomes a permanent.',
  'Priority is your window to play cards, activate abilities, or pass and let the game move on.',
]

const FULL = [
  'Magic uses two different words on purpose. Mixing them up is a common beginner mistake, but the rules are straightforward once you know which cards use which action.',
  'Priority is your window to play cards, activate abilities, or pass and let the game move on. When you have priority, you can act; when you pass, your opponent gets a chance.',
  {
    heading: 'Playing a land',
    list: [
      'Only land cards are played (not cast).',
      'You may play one land per turn during your first or second main phase when you have priority, not one in each phase.',
      'The land goes directly onto the battlefield. It never goes on the stack.',
      'Your opponent cannot respond to you playing a land the way they can to a spell.',
    ],
  },
  {
    heading: 'Casting a spell',
    list: [
      'Creatures, instants, sorceries, artifacts, enchantments, and planeswalkers are all cast.',
      'You pay the mana cost shown in the top-right corner, then the spell goes on the stack.',
      'Both players can cast instants or activate abilities in response before the spell resolves.',
      'After it resolves, a permanent stays on the battlefield; a one-shot spell like Shock goes to the graveyard.',
    ],
  },
  'When a card or rule says “cast,” it does not include lands. When it says “play a land,” that is only for lands. The turn structure lesson describes main phases as when you “play lands and cast spells.” Those are two separate actions.',
]

function renderBlock(block, index) {
  if (typeof block === 'string') {
    return renderGlossaryString(block, index, 'stack-explainer__paragraph')
  }

  return (
    <div key={index} className="stack-explainer__block">
      {block.heading && <h3 className="stack-explainer__subheading">{block.heading}</h3>}
      {block.list && (
        <ul className="stack-explainer__list">
          {block.list.map((item) => (
            <li key={item}>{renderGlossaryListItem(item)}</li>
          ))}
        </ul>
      )}
      {block.text &&
        renderGlossaryString(block.text, `${index}-text`, 'stack-explainer__paragraph')}
    </div>
  )
}

export default function CastVsPlayExplainer({ variant = 'brief' }) {
  const blocks = variant === 'brief' ? BRIEF : FULL

  return (
    <aside
      className={`stack-explainer stack-explainer--${variant}`}
      aria-labelledby="cast-vs-play-heading"
    >
      <h2 id="cast-vs-play-heading" className="stack-explainer__heading">
        Casting vs. playing
      </h2>
      {blocks.map(renderBlock)}
    </aside>
  )
}
