import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    description: 'Your mana source. You can play one land per turn for free.',
    tag: 'Main phase only',
    wide: false,
    examples: [
      {
        src: new URL('../assets/land-forest.jpg', import.meta.url).href,
        label: 'Forest',
      },
      {
        src: new URL('../assets/land-swamp.jpg', import.meta.url).href,
        label: 'Swamp',
      },
      {
        src: new URL('../assets/land-woodland-cemetery.jpg', import.meta.url).href,
        label: 'Woodland Cemetery',
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
      <p className="card-types__description">{type.description}</p>
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
  void session
  const navigate = useNavigate()
  const [overlayId, setOverlayId] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [seenIds, setSeenIds] = useState(() => new Set())

  const activeType = CARD_TYPES.find((t) => t.id === overlayId)
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
    if (!overlayId) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeOverlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [overlayId, closeOverlay])

  return (
    <div className="card-types">
      <div className="card-types__frame">
        <p className="card-types__breadcrumb">Lesson 02 · Card Types</p>
        <h1 className="card-types__heading">The Seven Card Types</h1>
        <hr className="card-types__rule" aria-hidden="true" />

        <p className="card-types__intro">
          Magic has a few other card types too, but these seven are the main ones you will see in
          most games. Each type determines what the card does and, more importantly, when you can
          play it.
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
          {allViewed ? 'All card types viewed.' : `Seen ${seenIds.size} of 7 card types`}
        </p>

        <hr className="card-types__divider" aria-hidden="true" />

        <p className="card-types__closing">
          Notice that only instants can be played at any time. Every other type has restrictions.
          Keep that in mind as you learn the turn structure in the next lesson.
        </p>

        <div className="card-types__actions">
          <button
            type="button"
            className="card-types__button card-types__button--back"
            onClick={() => navigate('/lesson/1')}
          >
            Back
          </button>
          <button
            type="button"
            className="card-types__button card-types__button--next"
            disabled={!allViewed}
            onClick={() => navigate('/lesson/3')}
          >
            Next
          </button>
        </div>
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
            className={`card-types__overlay-card${
              activeType.examples.length === 1 ? ' card-types__overlay-card--single' : ''
            }`}
          >
            <button
              type="button"
              className="card-types__overlay-close"
              aria-label="Close"
              onClick={closeOverlay}
            >
              ×
            </button>
            <div className="card-types__overlay-gallery">
              {activeType.examples.map((example) => (
                <figure key={example.label} className="card-types__overlay-figure">
                  <div className="card-types__overlay-image">
                    <CardThumbnail
                      src={example.src}
                      alt={`${example.label}, ${activeType.name} card`}
                      className="card-types__thumbnail-image"
                    />
                  </div>
                  <figcaption className="card-types__overlay-caption">{example.label}</figcaption>
                </figure>
              ))}
            </div>
            <h3 className="card-types__overlay-name">{activeType.name}</h3>
            <p className="card-types__overlay-description">{activeType.description}</p>
            <span className="card-types__tag">{activeType.tag}</span>
          </div>
        </div>
      )}
    </div>
  )
}
