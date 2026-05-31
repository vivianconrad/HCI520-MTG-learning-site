import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './CardAnatomy.css'

const cardImageUrl = new URL('../assets/creature-shadowmage-infiltrator.webp', import.meta.url).href

const CALLOUTS = [
  {
    id: 'name',
    label: 'Name',
    number: 1,
    text: "The card's name. No two cards in your deck can have the same name, except for basic lands.",
    position: { top: '5%', left: '30%' },
    tipDir: 'below',
  },
  {
    id: 'manaCost',
    label: 'Mana Cost',
    number: 2,
    text: 'The coloured symbols in the top right tell you what mana you need to cast this card. Numbers mean any colour.',
    position: { top: '5%', right: '5%' },
    tipDir: 'below',
  },
  {
    id: 'typeLine',
    label: 'Type Line',
    number: 3,
    text: 'This tells you what kind of card it is. Creature, Instant, Sorcery, Land, Enchantment, Artifact, or Planeswalker.',
    position: { top: '58%', left: '5%' },
    tipDir: 'right',
  },
  {
    id: 'textBox',
    label: 'Text Box',
    number: 4,
    text: "This is where the card's abilities live. Keywords like Fear are shorthand for longer rules.",
    position: { top: '70%', right: '5%' },
    tipDir: 'left',
  },
  {
    id: 'power',
    label: 'Power',
    number: 5,
    text: 'The first number in the bottom right. This is how much damage the creature deals in combat.',
    position: { bottom: '3%', left: '30%' },
    tipDir: 'above',
  },
  {
    id: 'toughness',
    label: 'Toughness',
    number: 6,
    text: 'The second number in the bottom right. This is how much damage the creature can take before it dies.',
    position: { bottom: '3%', left: '55%' },
    tipDir: 'above',
  },
]

const BULLETS = [
  'Every card has a name and a mana cost that tell you what it is and how to cast it.',
  'The type line tells you what kind of card it is: creature, land, instant, and so on.',
  'Power and toughness only appear on creature cards. They determine combat outcomes.',
]

function CardImage() {
  const [hasImage, setHasImage] = useState(true)

  if (!hasImage) {
    return <div className="card-anatomy__card-placeholder">Card image</div>
  }

  return (
    <img
      className="card-anatomy__card-image"
      src={cardImageUrl}
      alt="Shadowmage Infiltrator sample card"
      onError={() => setHasImage(false)}
    />
  )
}

function getMarkerModifier(position) {
  const hasRight = 'right' in position
  const hasBottom = 'bottom' in position
  if (hasBottom && hasRight) return 'card-anatomy__marker--anchor-br'
  if (hasBottom) return 'card-anatomy__marker--anchor-bl'
  if (hasRight) return 'card-anatomy__marker--anchor-tr'
  return 'card-anatomy__marker--anchor-tl'
}

function CardMarker({ callout, isActive, onToggle }) {
  const { id, label, number, position, tipDir } = callout

  return (
    <div
      className={[
        'card-anatomy__marker',
        getMarkerModifier(position),
        tipDir ? `card-anatomy__marker--tip-${tipDir}` : '',
        isActive ? 'card-anatomy__marker--active' : '',
      ].filter(Boolean).join(' ')}
      style={position}
    >
      <button
        type="button"
        className="card-anatomy__callout-marker"
        aria-label={`${label} callout`}
        onClick={() => onToggle(id)}
      >
        {number}
      </button>
      <span className="card-anatomy__marker-tooltip">{label}</span>
    </div>
  )
}

export default function CardAnatomy({ session: _session }) {
  const navigate = useNavigate()
  const [activeCallout, setActiveCallout] = useState(null)

  function toggleCallout(id) {
    setActiveCallout((prev) => (prev === id ? null : id))
  }

  const activeCalloutData = CALLOUTS.find((c) => c.id === activeCallout)

  return (
    <div className="card-anatomy">
      <div className="card-anatomy__frame">
        <p className="card-anatomy__breadcrumb">
          Lesson 01 · Card Anatomy
        </p>
        <h1 className="card-anatomy__heading">How to Read a Card</h1>
        <hr className="card-anatomy__rule" aria-hidden="true" />

        <div className="card-anatomy__diagram">
          <div className="card-anatomy__card-wrap">
            <CardImage />
            {CALLOUTS.map((callout) => (
              <CardMarker
                key={callout.id}
                callout={callout}
                isActive={activeCallout === callout.id}
                onToggle={toggleCallout}
              />
            ))}
          </div>
        </div>

        {activeCalloutData && (
          <div className="card-anatomy__info-panel">{activeCalloutData.text}</div>
        )}

        <hr className="card-anatomy__divider" aria-hidden="true" />

        <p className="card-anatomy__intro">
          Each Magic: The Gathering card contains key information about what it does in play.
          Learning to read a card&apos;s anatomy is the first step to building and piloting any deck.
        </p>

        <h2 className="card-anatomy__subheading">Card Anatomy at a Glance</h2>
        <ul className="card-anatomy__list">
          {BULLETS.map((text) => (
            <li key={text} className="card-anatomy__list-item">
              <span className="card-anatomy__bullet" aria-hidden="true">
                ◆
              </span>
              {text}
            </li>
          ))}
        </ul>

        <div className="card-anatomy__actions" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="card-anatomy__button card-anatomy__button--next"
            onClick={() => navigate('/lesson/2')}
          >
            Next
          </button>
        </div>

        <ProgressDots activeIndex={PROGRESS.LESSON_1} />
      </div>
    </div>
  )
}
