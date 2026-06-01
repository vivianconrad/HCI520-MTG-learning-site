import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'
import { useNavigate } from 'react-router-dom'
import LessonActions from '../components/LessonActions.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import './CardTypes.css'

const CARD_TYPES = [
  {
    id: 'creature',
    name: 'Creature',
    description: 'Fights on your behalf. Stays on the battlefield until it dies.',
    tag: 'Main phase only',
    wide: false,
    examples: [
      {
        src: new URL('../assets/creature-llanowar-elves.jpg', import.meta.url).href,
        label: 'Llanowar Elves',
      },
      {
        src: new URL('../assets/creature-shadowmage-infiltrator.webp', import.meta.url).href,
        label: 'Shadowmage Infiltrator',
      },
      {
        src: new URL('../assets/creature-legendary-grothama.webp', import.meta.url).href,
        label: 'Grothama, All-Devouring',
      },
    ],
  },
  {
    id: 'land',
    name: 'Land',
    description:
      'Your mana source. Play one land per turn in your main phase—lands are played, not cast.',
    tag: 'Main phase only',
    wide: false,
    details: [
      'Mana from lands pays for your spells and abilities. Most decks need plenty of lands—often about 24 in a 60-card deck, though faster or slower decks adjust that number.',
      {
        heading: 'The five basic lands',
        list: [
          'Plains — adds white mana (W)',
          'Island — adds blue mana (U)',
          'Swamp — adds black mana (B)',
          'Mountain — adds red mana (R)',
          'Forest — adds green mana (G)',
        ],
        text: 'Each basic land’s name matches its type (a card named Forest is a basic Forest). You may put any number of the same basic land in your deck.',
      },
      'Non-basic lands are every other land card. They might produce two colors, enter the battlefield tapped, or have extra rules text. They still count as lands and follow the one-land-per-turn rule—read the card to see what they do. Woodland Cemetery is an example of a non-basic land that can produce black or green mana.',
      'To use a land’s mana, tap it (turn it sideways). That mana is available until you spend it or the step or phase ends. Lands are permanent; they stay on the battlefield unless something removes them.',
    ],
    examples: [
      {
        src: new URL('../assets/land-forest.jpg', import.meta.url).href,
        label: 'Forest',
        role: 'Basic land',
      },
      {
        src: new URL('../assets/land-swamp.jpg', import.meta.url).href,
        label: 'Swamp',
        role: 'Basic land',
      },
      {
        src: new URL('../assets/land-woodland-cemetery.jpg', import.meta.url).href,
        label: 'Woodland Cemetery',
        role: 'Non-basic land',
      },
    ],
  },
  {
    id: 'instant',
    name: 'Instant',
    description: 'Fast spells that can surprise your opponent at any moment.',
    tag: 'Any time',
    wide: false,
    examples: [
      {
        src: new URL('../assets/instant-shock.jpg', import.meta.url).href,
        label: 'Shock',
      },
      {
        src: new URL('../assets/instant-counterspell.webp', import.meta.url).href,
        label: 'Counterspell',
      },
      {
        src: new URL('../assets/instant-giant-growth.jpg', import.meta.url).href,
        label: 'Giant Growth',
      },
    ],
  },
  {
    id: 'sorcery',
    name: 'Sorcery',
    description: 'Powerful spells that require your full attention to cast.',
    tag: 'Main phase only, stack empty',
    wide: false,
    examples: [
      {
        src: new URL('../assets/sorcery-cultivate.jpg', import.meta.url).href,
        label: 'Cultivate',
      },
      {
        src: new URL('../assets/sorcery-duress.jpg', import.meta.url).href,
        label: 'Duress',
      },
    ],
  },
  {
    id: 'artifact',
    name: 'Artifact',
    description: 'Objects and tools. Most are colourless and fit in any deck.',
    tag: 'Main phase only',
    wide: false,
    examples: [
      {
        src: new URL('../assets/artifact-sol-ring.jpg', import.meta.url).href,
        label: 'Sol Ring',
      },
      {
        src: new URL('../assets/artifact-commanders-sphere.webp', import.meta.url).href,
        label: "Commander's Sphere",
      },
    ],
  },
  {
    id: 'enchantment',
    name: 'Enchantment',
    description: 'Ongoing effects that linger on the battlefield.',
    tag: 'Main phase only',
    wide: false,
    examples: [
      {
        src: new URL('../assets/enchantment-sylvan-library.webp', import.meta.url).href,
        label: 'Sylvan Library',
      },
      {
        src: new URL('../assets/enchantment-valakut-exploration.webp', import.meta.url).href,
        label: 'Valakut Exploration',
      },
      {
        src: new URL('../assets/enchantment-goblin-origlamme.jpg', import.meta.url).href,
        label: 'Goblin Oriflamme',
      },
    ],
  },
  {
    id: 'planeswalker',
    name: 'Planeswalker',
    description: 'Powerful allies with loyalty abilities you activate each turn.',
    tag: 'Main phase only',
    wide: true,
    examples: [
      {
        src: new URL('../assets/planeswalker-nahiri.webp', import.meta.url).href,
        label: 'Nahiri, the Lithomancer',
      },
    ],
  },
]

function CardThumbnail({ src, alt, className }) {
  const [hasImage, setHasImage] = useState(true)

  if (!hasImage) {
    return <span className="card-types__thumbnail-placeholder">img</span>
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setHasImage(false)}
    />
  )
}

function CardTypeDetails({ description, details, variant = 'grid' }) {
  const copyClass =
    variant === 'overlay' ? 'card-types__overlay-copy' : 'card-types__type-copy'

  return (
    <div className={copyClass}>
      <p
        className={
          variant === 'overlay' ? 'card-types__overlay-description' : 'card-types__description'
        }
      >
        {description}
      </p>
      {details?.map((block, index) => {
        if (typeof block === 'string') {
          return (
            <p key={index} className="card-types__detail">
              {block}
            </p>
          )
        }

        return (
          <div key={index} className="card-types__detail-block">
            {block.heading && <h4 className="card-types__detail-heading">{block.heading}</h4>}
            {block.list && (
              <ul className="card-types__detail-list">
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {block.text && <p className="card-types__detail">{block.text}</p>}
          </div>
        )
      })}
    </div>
  )
}

function CardTypeItem({ type, hasBeenViewed, onSeeCard }) {
  return (
    <article className={`card-types__item${type.wide ? ' card-types__item--wide' : ''}`}>
      <h3 className="card-types__type-name">{type.name}</h3>
      <div className="card-types__examples" aria-label={`${type.name} examples`}>
        {type.examples.map((example) => (
          <div key={example.label} className="card-types__thumbnail">
            <CardThumbnail
              src={example.src}
              alt={`${example.label}, ${type.name} card`}
              className="card-types__thumbnail-image"
            />
          </div>
        ))}
      </div>
      <CardTypeDetails description={type.description} />
      <span className="card-types__tag">{type.tag}</span>
      <button
        type="button"
        className={`card-types__see-card${hasBeenViewed ? ' card-types__see-card--viewed' : ''}`}
        onClick={() => onSeeCard(type.id)}
      >
        {hasBeenViewed ? 'See Again ▸' : 'See Cards ▸'}
      </button>
    </article>
  )
}

export default function CardTypes({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'CardTypes')
  const [overlayId, setOverlayId] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [seenIds, setSeenIds] = useState(() => new Set())
  const [activeExampleIndex, setActiveExampleIndex] = useState(0)
  const overlayPanelRef = useRef(null)
  const closeButtonRef = useRef(null)

  const activeType = CARD_TYPES.find((t) => t.id === overlayId)
  const overlayOpen = Boolean(activeType && !isClosing)

  useFocusTrap(overlayPanelRef, overlayOpen)
  const allViewed = seenIds.size === CARD_TYPES.length

  const openOverlay = useCallback((id) => {
    setIsClosing(false)
    setOverlayId(id)
    setSeenIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const closeOverlay = useCallback(() => {
    if (!overlayId || isClosing) return
    setIsClosing(true)
  }, [overlayId, isClosing])

  useEffect(() => {
    if (!isClosing) return undefined

    const timer = window.setTimeout(() => {
      setOverlayId(null)
      setIsClosing(false)
    }, 200)

    return () => window.clearTimeout(timer)
  }, [isClosing])

  useEffect(() => {
    setActiveExampleIndex(0)
  }, [overlayId])

  useEffect(() => {
    if (overlayOpen) {
      closeButtonRef.current?.focus()
    }
  }, [overlayOpen])

  useEffect(() => {
    if (!overlayId) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeOverlay()
        return
      }

      if (!activeType || activeType.examples.length <= 1) return

      if (event.key === 'ArrowRight') {
        setActiveExampleIndex((prev) => (prev + 1) % activeType.examples.length)
      }

      if (event.key === 'ArrowLeft') {
        setActiveExampleIndex(
          (prev) => (prev - 1 + activeType.examples.length) % activeType.examples.length,
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [overlayId, closeOverlay, activeType])

  return (
    <PageLayout title="Lesson 2 · Card Types" className="card-types">
      <div className="card-types__frame">
        <p className="card-types__breadcrumb">Lesson 02 · Card Types</p>
        <h1 className="card-types__heading">The Seven Card Types</h1>
        <hr className="card-types__rule" aria-hidden="true" />

        <p className="card-types__intro">
          Magic has a few other card types too, but these seven are the main ones you will see in
          most games. Each type determines what the card does and, more importantly, when you can
          cast it (lands are played, not cast).
        </p>

        <div className="card-types__grid">
          {CARD_TYPES.map((type) => (
            <CardTypeItem
              key={type.id}
              type={type}
              hasBeenViewed={seenIds.has(type.id)}
              onSeeCard={openOverlay}
            />
          ))}
        </div>

        <p className="card-types__progress" aria-live="polite">
          {allViewed ? 'All card types explored.' : `Explored ${seenIds.size} of 7 card types`}
        </p>

        <hr className="card-types__divider" aria-hidden="true" />

        <p className="card-types__closing">
          Notice that only instants can be cast at any time. Every other type has restrictions.
          Keep that in mind as you learn the turn structure in the next lesson.
        </p>

        <p className="card-types__note">
          There are exceptions to every rule in Magic, and many cards use keywords that change how
          they work. What you saw here is a basic introduction—enough to get started, not every
          special case you will meet in a real game.
        </p>

        <LessonActions
          classPrefix="card-types"
          backHint="Return to Card Anatomy"
          onBack={() => navigate('/lesson/1')}
          onNext={() => navigate('/lesson/3')}
          canProceed={allViewed}
          gateMessage="Open each card type and view its examples before continuing."
        />
        <ProgressDots activeIndex={PROGRESS.LESSON_2} />
      </div>

      {activeType && (
        <div
          className={`card-types__overlay${isClosing ? ' card-types__overlay--closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeType.name} card type`}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeOverlay()
          }}
        >
          <div
            ref={overlayPanelRef}
            className={`card-types__overlay-card${
              activeType.examples.length === 1 ? ' card-types__overlay-card--single' : ''
            }${activeType.details?.length ? ' card-types__overlay-card--detailed' : ''}`}
          >
            {(() => {
              const activeExample = activeType.examples[activeExampleIndex] ?? activeType.examples[0]
              const canCycle = activeType.examples.length > 1
              const goToNext = () =>
                setActiveExampleIndex((prev) => (prev + 1) % activeType.examples.length)
              const goToPrevious = () =>
                setActiveExampleIndex(
                  (prev) => (prev - 1 + activeType.examples.length) % activeType.examples.length,
                )

              return (
                <>
            <button
              ref={closeButtonRef}
              type="button"
              className="card-types__overlay-close"
              aria-label="Close"
              onClick={closeOverlay}
            >
              ×
            </button>
            <div className="card-types__overlay-gallery">
              <figure key={activeExample.label} className="card-types__overlay-figure">
                <div className="card-types__overlay-image">
                  <CardThumbnail
                    src={activeExample.src}
                    alt={`${activeExample.label}, ${activeType.name} card`}
                    className="card-types__thumbnail-image"
                  />
                </div>
                <figcaption className="card-types__overlay-caption">
                  <span className="card-types__overlay-caption-name">{activeExample.label}</span>
                  {activeExample.role && (
                    <span className="card-types__overlay-caption-role">{activeExample.role}</span>
                  )}
                </figcaption>
              </figure>
            </div>
            {canCycle && (
              <div className="card-types__overlay-controls">
                <button
                  type="button"
                  className="card-types__overlay-nav"
                  onClick={goToPrevious}
                  aria-label={`Previous ${activeType.name} example`}
                >
                  Previous
                </button>
                <span className="card-types__overlay-count" aria-live="polite">
                  {activeExampleIndex + 1} / {activeType.examples.length}
                </span>
                <button
                  type="button"
                  className="card-types__overlay-nav"
                  onClick={goToNext}
                  aria-label={`Next ${activeType.name} example`}
                >
                  Next
                </button>
              </div>
            )}
            <h3 className="card-types__overlay-name">{activeType.name}</h3>
            <CardTypeDetails
              description={activeType.description}
              details={activeType.details}
              variant="overlay"
            />
            <span className="card-types__tag">{activeType.tag}</span>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
