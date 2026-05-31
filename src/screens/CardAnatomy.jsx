import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CardAnatomy.css'

const cardImageUrl = new URL('../assets/creature-shadowmage-infiltrator.webp', import.meta.url).href

const CALLOUTS = {
  name: {
    label: 'Name',
    number: 1,
    text: "The card's name. No two cards in your deck can have the same name, except for basic lands.",
    side: 'left',
  },
  typeLine: {
    label: 'Type Line',
    number: 3,
    text: 'This tells you what kind of card it is. Creature, Instant, Sorcery, Land, Enchantment, Artifact, or Planeswalker.',
    side: 'left',
  },
  manaCost: {
    label: 'Mana Cost',
    number: 2,
    text: 'The coloured symbols in the top right tell you what mana you need to cast this card. Numbers mean any colour.',
    side: 'right',
  },
  textBox: {
    label: 'Text Box',
    number: 4,
    text: "This is where the card's abilities live. Keywords like Fear are shorthand for longer rules.",
    side: 'right',
  },
  power: {
    label: 'Power',
    number: 5,
    text: 'The first number in the bottom right. This is how much damage the creature deals in combat.',
    side: 'bottom',
  },
  toughness: {
    label: 'Toughness',
    number: 6,
    text: 'The second number in the bottom right. This is how much damage the creature can take before it dies.',
    side: 'bottom',
  },
}

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

function Callout({ id, config, isActive, onToggle }) {
  const { label, side, number } = config

  const content =
    side === 'left' ? (
      <>
        <button type="button" className="card-anatomy__callout-label" onClick={() => onToggle(id)}>
          {label}
        </button>
        <span className="card-anatomy__callout-line" aria-hidden="true" />
        <button
          type="button"
          className="card-anatomy__callout-marker"
          aria-label={`${label} callout`}
          onClick={() => onToggle(id)}
        >
          {number}
        </button>
      </>
    ) : side === 'right' ? (
      <>
        <button
          type="button"
          className="card-anatomy__callout-marker"
          aria-label={`${label} callout`}
          onClick={() => onToggle(id)}
        >
          {number}
        </button>
        <span className="card-anatomy__callout-line" aria-hidden="true" />
        <button type="button" className="card-anatomy__callout-label" onClick={() => onToggle(id)}>
          {label}
        </button>
      </>
    ) : (
      <>
        <button type="button" className="card-anatomy__callout-label" onClick={() => onToggle(id)}>
          {label}
        </button>
        <span className="card-anatomy__callout-line" aria-hidden="true" />
        <button
          type="button"
          className="card-anatomy__callout-marker"
          aria-label={`${label} callout`}
          onClick={() => onToggle(id)}
        >
          {number}
        </button>
      </>
    )

  return (
    <div
      className={`card-anatomy__callout card-anatomy__callout--${side}${isActive ? ' card-anatomy__callout--active' : ''}`}
    >
      {content}
    </div>
  )
}

export default function CardAnatomy({ session: _session }) {
  const navigate = useNavigate()
  const [activeCallout, setActiveCallout] = useState(null)

  function toggleCallout(id) {
    setActiveCallout((prev) => (prev === id ? null : id))
  }

  return (
    <div className="card-anatomy">
      <div className="card-anatomy__frame">
        <p className="card-anatomy__breadcrumb">
          Lesson 01 · Card Anatomy · Lesson 1 of 4
        </p>
        <h1 className="card-anatomy__heading">How to Read a Card</h1>
        <hr className="card-anatomy__rule" aria-hidden="true" />

        <div className="card-anatomy__diagram">
          <div className="card-anatomy__callouts-left">
            <Callout
              id="name"
              config={CALLOUTS.name}
              isActive={activeCallout === 'name'}
              onToggle={toggleCallout}
            />
            <Callout
              id="typeLine"
              config={CALLOUTS.typeLine}
              isActive={activeCallout === 'typeLine'}
              onToggle={toggleCallout}
            />
          </div>

          <div className="card-anatomy__card-column">
            <CardImage />
            <div className="card-anatomy__bottom-callouts">
              <Callout
                id="power"
                config={CALLOUTS.power}
                isActive={activeCallout === 'power'}
                onToggle={toggleCallout}
              />
              <Callout
                id="toughness"
                config={CALLOUTS.toughness}
                isActive={activeCallout === 'toughness'}
                onToggle={toggleCallout}
              />
            </div>
          </div>

          <div className="card-anatomy__callouts-right">
            <Callout
              id="manaCost"
              config={CALLOUTS.manaCost}
              isActive={activeCallout === 'manaCost'}
              onToggle={toggleCallout}
            />
            <Callout
              id="textBox"
              config={CALLOUTS.textBox}
              isActive={activeCallout === 'textBox'}
              onToggle={toggleCallout}
            />
          </div>
        </div>

        {activeCallout && (
          <div className="card-anatomy__info-panel">{CALLOUTS[activeCallout].text}</div>
        )}

        <hr className="card-anatomy__divider" aria-hidden="true" />

        <p className="card-anatomy__intro">
          Each Magic: The Gathering card contains key information about what it does in play. Click
          or hover any label above to learn more about that part of the card.
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
      </div>
    </div>
  )
}
