import './StackExplainer.css'
import { renderGlossaryListItem, renderGlossaryString } from './glossaryRender.jsx'

const tapSymbolImg = new URL('../assets/tap-symbol mtg.webp', import.meta.url).href

const BRIEF = [
  'To tap a card, turn it sideways. That marks it as used for now. Most tapped cards cannot be used again until they untap.',
  'Lands tap to produce mana. Creatures tap when they attack. Many cards show a curved-arrow tap symbol for abilities that require tapping. At the start of your turn, the untap step turns your permanents upright again.',
]

const FULL = [
  'Tapping is how Magic tracks which cards have already been used this turn. A card that is upright is untapped; a card turned sideways is tapped.',
  {
    heading: 'Why cards get tapped',
    list: [
      'Lands: tap a land to add mana to your pool (for example, tap a Forest for one green mana).',
      'Creatures: a creature taps when it attacks. A tapped creature cannot attack again that turn (unless a card says otherwise).',
      'Abilities: many cards say “Tap this permanent:” or show a curved-arrow tap symbol, meaning you turn the card sideways as part of using that ability.',
    ],
  },
  {
    heading: 'Entering the battlefield tapped',
    list: [
      'Some lands and artifacts say they enter the battlefield tapped. They start sideways and cannot be used right away.',
      'Woodland Cemetery is an example: without a Swamp or Forest already on the battlefield, it enters tapped and you cannot tap it for mana until your next turn.',
    ],
  },
  'During your untap step at the beginning of your turn, you untap all permanents you control. They turn upright and are ready to use again. You never choose which to untap; they all untap at once.',
  'If a card is already tapped, you cannot tap it again for a second effect. Summoning sickness also stops a creature from attacking or using tap abilities (abilities with a tap symbol in the cost) until it has been under your control since the start of your turn.',
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

export default function TapExplainer({ variant = 'brief' }) {
  const blocks = variant === 'brief' ? BRIEF : FULL

  return (
    <aside
      className={`stack-explainer stack-explainer--${variant}`}
      aria-labelledby="tap-explainer-heading"
    >
      <h2 id="tap-explainer-heading" className="stack-explainer__heading">
        What does tap mean?
      </h2>
      <img
        src={tapSymbolImg}
        alt="The MTG tap symbol: a curved arrow pointing clockwise"
        className="stack-explainer__tap-symbol"
      />
      {blocks.map(renderBlock)}
    </aside>
  )
}
