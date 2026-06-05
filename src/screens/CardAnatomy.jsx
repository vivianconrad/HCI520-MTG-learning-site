import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonActions from '../components/LessonActions.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import { cardImage } from '../assets/cards/index.js'
import './CardAnatomy.css'

const cardImageUrl = cardImage('creature-shadowmage-infiltrator.webp')

const CALLOUTS = [
  {
    id: 'name',
    label: 'Name',
    number: 1,
    text: "The card's name is how you identify it in the game. In most formats, you can only have four copies of any card with the same name in your deck. Basic lands are the exception. You can have as many as you want.",
    position: { top: '7%', left: '-0.5%' },
    tipDir: 'below',
  },
  {
    id: 'manaCost',
    label: 'Mana Cost',
    number: 2,
    text: 'Mana is the energy you spend to cast spells. You usually produce it by tapping lands, then pay from your mana pool when you cast. The symbols in the top right corner are this card’s mana cost. Coloured symbols like the blue and black ones here mean you need that specific colour of mana. Numbers in a grey circle mean you can use mana of any colour. This card costs one of any colour plus one blue and one black, so three mana total.',
    position: { top: '7%', right: '-1%' },
    tipDir: 'below',
  },
  {
    id: 'typeLine',
    label: 'Type Line',
    number: 3,
    text: "The type line tells you what kind of card this is. This card is a Creature, which means it stays on the battlefield and can attack and block. Most creatures cannot attack the turn you cast them (summoning sickness); Lesson 2 explains that in more detail. After the dash you'll see the subtype, in this case Human Wizard. Subtypes don't change the rules but some cards care about them specifically. For example, a card might say 'whenever a Wizard enters the battlefield.'",
    position: { top: '58%', left: '-0.5%' },
    tipDir: 'right',
  },
  {
    id: 'textBox',
    label: 'Text Box',
    number: 4,
    text: "This is where the card's abilities live. Magic uses keywords, which are shorthand for longer rules. On this card, Fear means the creature can only be blocked by artifact creatures or black creatures. Italicised text in parentheses like this is called reminder text. It explains what the keyword means right on the card so you don't have to memorise everything. The second ability is a triggered ability. You can tell because it starts with 'Whenever', meaning it fires automatically when the condition is met.",
    position: { top: '70%', right: '5%' },
    tipDir: 'left',
  },
  {
    id: 'power',
    label: 'Power',
    number: 5,
    text: "The first number in the bottom right corner is the creature's power. Power is how much damage this creature deals when it attacks or blocks in combat. Shadowmage Infiltrator has a power of 1, so it deals 1 damage in combat.",
    position: { bottom: '8.5%', left: '74%' },
    tipDir: 'above',
  },
  {
    id: 'toughness',
    label: 'Toughness',
    number: 6,
    text: "The second number in the bottom right corner is the creature's toughness. Toughness is how much damage a creature can take before it dies. Shadowmage Infiltrator has a toughness of 3, meaning it can survive up to 3 damage. At the end of each turn, damage on creatures is removed, so a creature that takes 2 damage out of 3 toughness survives the turn and heals back to full.",
    position: { bottom: '8.5%', left: '98%' },
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

function CardMarker({ callout, isActive, isSeen, onToggle }) {
  const { id, label, number, position, tipDir } = callout

  return (
    <div
      className={[
        'card-anatomy__marker',
        getMarkerModifier(position),
        tipDir ? `card-anatomy__marker--tip-${tipDir}` : '',
        isSeen ? 'card-anatomy__marker--seen' : '',
        isActive ? 'card-anatomy__marker--active' : '',
      ].filter(Boolean).join(' ')}
      style={position}
    >
      <button
        type="button"
        className="card-anatomy__callout-marker"
        aria-label={`${label} callout`}
        aria-pressed={isActive}
        onClick={() => onToggle(id)}
      >
        {number}
      </button>
      <span className="card-anatomy__marker-tooltip">{label}</span>
    </div>
  )
}

export default function CardAnatomy({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'CardAnatomy')
  const [activeCallout, setActiveCallout] = useState(null)
  const [seenIds, setSeenIds] = useState(() => new Set())

  const allExplored = seenIds.size === CALLOUTS.length
  const activeCalloutData = CALLOUTS.find((c) => c.id === activeCallout)

  function toggleCallout(id) {
    setSeenIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setActiveCallout((prev) => (prev === id ? null : id))
  }

  return (
    <PageLayout title="Lesson 1 · Card Anatomy" className="card-anatomy">
      <div className="card-anatomy__frame">
        <p className="card-anatomy__breadcrumb">Lesson 01 · Card Anatomy</p>
        <h1 className="card-anatomy__heading">How to Read a Card</h1>
        <hr className="card-anatomy__rule" aria-hidden="true" />

        <p className="card-anatomy__hint">
          Tap each numbered marker on the card to learn what that part means.
        </p>

        <div className="card-anatomy__diagram">
          <div className="card-anatomy__card-wrap">
            <CardImage />
            {CALLOUTS.map((callout) => (
              <CardMarker
                key={callout.id}
                callout={callout}
                isActive={activeCallout === callout.id}
                isSeen={seenIds.has(callout.id)}
                onToggle={toggleCallout}
              />
            ))}
          </div>
        </div>

        {activeCalloutData ? (
          <div className="card-anatomy__info-panel" role="region" aria-labelledby="callout-heading">
            <h2 id="callout-heading" className="card-anatomy__info-panel-title">
              {activeCalloutData.label}
            </h2>
            <p className="card-anatomy__info-panel-text">{activeCalloutData.text}</p>
          </div>
        ) : (
          <p className="card-anatomy__info-placeholder">Select a marker to read its explanation.</p>
        )}

        <p className="card-anatomy__progress" aria-live="polite">
          {allExplored
            ? 'All six parts explored.'
            : `Explored ${seenIds.size} of ${CALLOUTS.length} parts`}
        </p>

        <hr className="card-anatomy__divider" aria-hidden="true" />

        <p className="card-anatomy__intro">
          Each Magic: The Gathering card contains key information about what it does on the
          battlefield.
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

        <LessonActions
          classPrefix="card-anatomy"
          backHint="Return to lesson overview"
          onBack={() => navigate('/what-is-mtg')}
          onNext={() => navigate('/lesson/2')}
          canProceed={allExplored}
          gateMessage="Explore all six numbered markers on the card before continuing."
        />

        <ProgressDots activeIndex={PROGRESS.LESSON_1} />
      </div>
    </PageLayout>
  )
}
