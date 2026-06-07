import './StackExplainer.css'
import { renderGlossaryListItem, renderGlossaryString } from './glossaryRender.jsx'

const BRIEF = [
  'When you cast a spell (not a land), it goes on the stack first. It is a waiting line where spells and abilities sit before they happen.',
  'If nothing is waiting, the stack is empty. Sorceries and most other non-instant spells can only be cast during your main phase when the stack is empty. Instants can be cast any time you have priority, even in response to something already on the stack.',
]

const FULL = [
  'The stack is not a turn phase. It is a zone that exists throughout the game: a queue of spells and abilities waiting to resolve.',
  'When you cast a spell, you pay its mana cost and put the spell on the stack. It does not happen yet. Both players get a chance to respond when they have priority by casting instants or activating abilities. When both players pass without adding anything, the spell on top of the stack resolves (its effect happens), then players get another chance to respond before the next item resolves.',
  {
    heading: 'Stack empty vs. not empty',
    list: [
      'Stack empty: no spell or ability is waiting. You can cast sorceries, creatures, artifacts, enchantments, and planeswalkers during your main phase.',
      'Stack not empty: something is waiting to resolve (for example, your opponent just cast a spell). You cannot cast a sorcery now, but you can cast an instant in response, such as Counterspell to cancel their spell.',
    ],
  },
  'Spells resolve last in, first out: the most recently added spell resolves first, like stacking plates. That back-and-forth is the stack, and it is why you can answer a sorcery with an instant but not the other way around.',
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
    </div>
  )
}

export default function StackExplainer({ variant = 'full' }) {
  const blocks = variant === 'brief' ? BRIEF : FULL

  return (
    <aside
      className={`stack-explainer stack-explainer--${variant}`}
      aria-labelledby="stack-explainer-heading"
    >
      <h2 id="stack-explainer-heading" className="stack-explainer__heading">
        What is the stack?
      </h2>
      {blocks.map(renderBlock)}
    </aside>
  )
}
