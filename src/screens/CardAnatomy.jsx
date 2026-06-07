import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonActions from '../components/LessonActions.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import CardAnatomyMobileHint from '../components/CardAnatomyMobileHint.jsx'
import CuriosityNote from '../components/CuriosityNote.jsx'
import GlossaryText from '../components/GlossaryText.jsx'
import { getCuriosityLessonNote } from '../lib/learnerChoice.js'
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
    text: 'Mana is the energy you spend to cast spells. You usually produce it by tapping lands, then pay from your mana pool when you cast. The symbols in the top right corner are this card’s mana cost. Colored symbols like the blue and black ones here mean you need that specific color of mana. Numbers in a gray circle mean you can use mana of any color. This card costs one of any color plus one blue and one black, so three mana total.',
    position: { top: '7%', right: '-1%' },
    tipDir: 'below',
  },
  {
    id: 'typeLine',
    label: 'Type Line',
    number: 3,
    text: "The type line tells you what kind of card this is. This card is a Creature, which means it stays on the battlefield and can attack and block. Creatures you cast usually cannot attack or use tap abilities until your next turn (summoning sickness); Lesson 2 explains that in more detail. Some cards also say Legendary before Creature (for example, Legendary Creature, Dragon). That marks a unique character; Lesson 2 explains the legend rule and how that differs from a normal creature. The subtype comes next on the type line, in this case Human Wizard. Subtypes don't change the rules but some cards care about them specifically. For example, a card might say 'whenever a Wizard enters the battlefield.'",
    position: { top: '58%', left: '-0.5%' },
    tipDir: 'right',
  },
  {
    id: 'textBox',
    label: 'Text Box',
    number: 4,
    text: "This is where the card's abilities live. Magic uses keywords, which are shorthand for longer rules. On this card, Fear means the creature can only be blocked by artifact creatures or black creatures. Italicized text in parentheses like this is called reminder text. It explains what the keyword means right on the card so you don't have to memorize everything. The second ability is a triggered ability. You can tell because it starts with 'Whenever', meaning it fires automatically when the condition is met.",
    position: { top: '70%', right: '5%' },
    tipDir: 'left',
  },
  {
    id: 'power',
    label: 'Power',
    number: 5,
    text: "The first number in the bottom right corner is the creature's power. Power is how much damage this creature deals when it attacks or blocks in combat. Shadowmage Infiltrator has a power of 1, so it deals 1 damage in combat.",
    position: { bottom: '8.5%', left: '71%' },
    tipDir: 'above',
  },
  {
    id: 'toughness',
    label: 'Toughness',
    number: 6,
    text: "The second number in the bottom right corner is the creature's toughness. Toughness is how much damage a creature can take before it dies. Shadowmage Infiltrator has a toughness of 3, meaning it can survive up to 3 damage. At the end of each turn, damage on creatures is removed, so a creature that takes 2 damage out of 3 toughness survives the turn and heals back to full.",
    position: { bottom: '8.5%', left: '101%' },
    tipDir: 'above',
  },
]

const BULLETS = [
  'Every card has a name. Spells also show a mana cost in the corner that tells you how to cast them. Lands have no mana cost because you play them instead.',
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

const INFO_PANEL_ID = 'card-anatomy-info-panel'
const MOBILE_EXPLORE_QUERY = '(max-width: 640px)'

function prefersMobileExploreLayout() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_EXPLORE_QUERY).matches
}

function scrollToCalloutTarget(id) {
  const mobile = prefersMobileExploreLayout()
  const targetId = mobile ? `card-anatomy-part-${id}` : `card-anatomy-marker-${id}`
  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  if (mobile) {
    document.getElementById(`card-anatomy-detail-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  } else {
    document.getElementById(INFO_PANEL_ID)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

function CardAnatomyPartsList({
  callouts,
  activeCallout,
  seenIds,
  highlightMissing,
  onSelect,
  showInlineDetail = false,
}) {
  return (
    <nav className="card-anatomy__parts-list" aria-label="Card parts list">
      <p className="card-anatomy__parts-lede">
        {showInlineDetail
          ? 'Tap a part to read what it does. The explanation opens right here — explore all six to continue.'
          : 'On small screens, use this list if the markers are hard to tap.'}
      </p>
      <ol className="card-anatomy__parts-items">
        {callouts.map((callout) => {
          const isActive = activeCallout === callout.id
          const isSeen = seenIds.has(callout.id)
          const detailId = `card-anatomy-detail-${callout.id}`
          return (
            <li key={callout.id} className="card-anatomy__parts-item">
              <button
                type="button"
                id={`card-anatomy-part-${callout.id}`}
                className={[
                  'card-anatomy__parts-button',
                  isActive ? 'card-anatomy__parts-button--active' : '',
                  isSeen ? 'card-anatomy__parts-button--seen' : '',
                  highlightMissing && !isSeen ? 'card-anatomy__parts-button--missing' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActive ? 'true' : undefined}
                aria-expanded={showInlineDetail ? isActive : undefined}
                aria-controls={showInlineDetail ? detailId : undefined}
                aria-label={`${callout.label}, part ${callout.number} of ${callouts.length}`}
                onClick={() => onSelect(callout.id)}
              >
                <span className="card-anatomy__parts-number" aria-hidden="true">
                  {callout.number}
                </span>
                <span className="card-anatomy__parts-label">{callout.label}</span>
                {isSeen ? (
                  <span className="card-anatomy__parts-status" aria-hidden="true">
                    Viewed
                  </span>
                ) : null}
              </button>
              {showInlineDetail && isActive ? (
                <div
                  id={detailId}
                  className="card-anatomy__parts-detail"
                  role="region"
                  aria-labelledby={`card-anatomy-part-${callout.id}`}
                >
                  <p className="card-anatomy__parts-detail-text">
                    <GlossaryText text={callout.text} />
                  </p>
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function CardMarker({ callout, isActive, isSeen, highlightMissing, onToggle }) {
  const { id, label, number, position, tipDir } = callout

  return (
    <div
      className={[
        'card-anatomy__marker',
        getMarkerModifier(position),
        tipDir ? `card-anatomy__marker--tip-${tipDir}` : '',
        isSeen ? 'card-anatomy__marker--seen' : 'card-anatomy__marker--pending',
        isActive ? 'card-anatomy__marker--active' : '',
        highlightMissing && !isSeen ? 'card-anatomy__marker--missing' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={position}
    >
      <button
        type="button"
        id={`card-anatomy-marker-${id}`}
        className="card-anatomy__callout-marker"
        aria-label={`${label}, part ${number} of ${CALLOUTS.length}`}
        aria-expanded={isActive}
        aria-controls={INFO_PANEL_ID}
        aria-pressed={isActive}
        onClick={() => onToggle(id)}
      >
        {number}
      </button>
      <span className="card-anatomy__marker-tooltip" aria-hidden="true">
        {label}
      </span>
    </div>
  )
}

export default function CardAnatomy({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'CardAnatomy')
  const [activeCallout, setActiveCallout] = useState(null)
  const [seenIds, setSeenIds] = useState(() => new Set())
  const [highlightMissing, setHighlightMissing] = useState(false)

  const allExplored = seenIds.size === CALLOUTS.length
  const curiosityNote = getCuriosityLessonNote(session.curiosityFocus, 'lesson1')

  const handleGateBlocked = useCallback(() => {
    setHighlightMissing(true)
    const firstMissing = CALLOUTS.find((callout) => !seenIds.has(callout.id))
    if (firstMissing) {
      scrollToCalloutTarget(firstMissing.id)
    }
  }, [seenIds])
  const activeCalloutData = CALLOUTS.find((c) => c.id === activeCallout)

  function markCalloutSeen(id) {
    setSeenIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  function toggleCallout(id) {
    markCalloutSeen(id)
    setActiveCallout((prev) => {
      const next = prev === id ? null : id
      if (next) {
        window.requestAnimationFrame(() => scrollToCalloutTarget(next))
      }
      return next
    })
  }

  function selectCallout(id) {
    markCalloutSeen(id)
    setActiveCallout(id)
    scrollToCalloutTarget(id)
  }

  return (
    <PageLayout title="Lesson 1 · Card Anatomy" className="card-anatomy" showKeywordDictionary>
      <div className="card-anatomy__frame page-layout__content-frame">
        <p className="card-anatomy__breadcrumb">Lesson 01 · Card Anatomy</p>
        <h1 className="card-anatomy__heading">How to Read a Card</h1>
        <hr className="card-anatomy__rule" aria-hidden="true" />

        <CuriosityNote text={curiosityNote} />

        <CardAnatomyMobileHint />

        <p className="card-anatomy__intro">
          Each Magic: The Gathering card contains key information about what it does on the
          battlefield. Learning to read a card&apos;s anatomy is the first step to building and
          piloting any deck.
        </p>

        <section className="card-anatomy__explore" aria-labelledby="card-anatomy-explore-heading">
          <h2 id="card-anatomy-explore-heading" className="card-anatomy__subheading">
            Explore the sample card
          </h2>
          <p className="card-anatomy__explore-lede">
            Each numbered dot matches a part of the card. Read about every part to unlock the next
            lesson.
          </p>

          <p className="card-anatomy__progress" aria-live="polite">
            {allExplored
              ? 'All six parts explored.'
              : `Explored ${seenIds.size} of ${CALLOUTS.length} parts`}
          </p>

          <div className="card-anatomy__diagram">
            <p className="card-anatomy__diagram-caption">Sample card</p>
            <div className="card-anatomy__card-wrap">
              <CardImage />
              {CALLOUTS.map((callout) => (
                <CardMarker
                  key={callout.id}
                  callout={callout}
                  isActive={activeCallout === callout.id}
                  isSeen={seenIds.has(callout.id)}
                  highlightMissing={highlightMissing}
                  onToggle={toggleCallout}
                />
              ))}
            </div>
          </div>

          <CardAnatomyPartsList
            callouts={CALLOUTS}
            activeCallout={activeCallout}
            seenIds={seenIds}
            highlightMissing={highlightMissing}
            onSelect={selectCallout}
            showInlineDetail
          />

          <div
            id={INFO_PANEL_ID}
            className={
              activeCalloutData
                ? 'card-anatomy__info-panel'
                : 'card-anatomy__info-panel card-anatomy__info-panel--empty'
            }
            role="region"
            aria-live="polite"
            aria-labelledby={activeCalloutData ? 'callout-heading' : 'callout-placeholder'}
          >
            {activeCalloutData ? (
              <>
                <h3 id="callout-heading" className="card-anatomy__info-panel-title">
                  {activeCalloutData.label}
                </h3>
                <p className="card-anatomy__info-panel-text">
                  <GlossaryText text={activeCalloutData.text} />
                </p>
              </>
            ) : (
              <p id="callout-placeholder" className="card-anatomy__info-placeholder">
                Select a numbered marker on the card to read its explanation.
              </p>
            )}
          </div>
        </section>

        <h2 className="card-anatomy__subheading card-anatomy__subheading--summary">
          Card anatomy at a glance
        </h2>
        <ul className="card-anatomy__list">
          {BULLETS.map((text) => (
            <li key={text} className="card-anatomy__list-item">
              <span className="card-anatomy__bullet" aria-hidden="true">
                ◆
              </span>
              <GlossaryText text={text} />
            </li>
          ))}
        </ul>

        <hr className="card-anatomy__divider" aria-hidden="true" />

        <LessonActions
          classPrefix="card-anatomy"
          backLabel="Back to overview"
          onBack={() => navigate('/what-is-mtg')}
          onNext={() => navigate('/lesson/2')}
          nextLabel="Continue to card types"
          canProceed={allExplored}
          gateMessage="Explore all six card parts before continuing."
          readyMessage="You've explored everything on this card. Ready to continue."
          onGateBlocked={handleGateBlocked}
        />

        <ProgressDots activeIndex={PROGRESS.LESSON_1} />
      </div>
    </PageLayout>
  )
}
