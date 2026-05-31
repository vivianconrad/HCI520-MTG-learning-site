import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './CardTypes.css'

const CARD_TYPES = [
  {
    id: 'creature',
    name: 'Creature',
    image: '../assets/cards/creature.jpg',
    description: 'Fights on your behalf. Stays on the battlefield until it dies.',
    tag: 'Main phase only',
    wide: false,
  },
  {
    id: 'land',
    name: 'Land',
    image: '../assets/cards/land.jpg',
    description: 'Your mana source. You can play one land per turn for free.',
    tag: 'Main phase only',
    wide: false,
  },
  {
    id: 'instant',
    name: 'Instant',
    image: '../assets/cards/instant.jpg',
    description: 'Fast spells that can surprise your opponent at any moment.',
    tag: 'Any time',
    wide: false,
  },
  {
    id: 'sorcery',
    name: 'Sorcery',
    image: '../assets/cards/sorcery.jpg',
    description: 'Powerful spells that require your full attention to cast.',
    tag: 'Main phase only, stack empty',
    wide: false,
  },
  {
    id: 'artifact',
    name: 'Artifact',
    image: '../assets/cards/artifact.jpg',
    description: 'Objects and tools. Most are colourless and fit in any deck.',
    tag: 'Main phase only',
    wide: false,
  },
  {
    id: 'enchantment',
    name: 'Enchantment',
    image: '../assets/cards/enchantment.jpg',
    description: 'Ongoing effects that linger on the battlefield.',
    tag: 'Main phase only',
    wide: false,
  },
  {
    id: 'planeswalker',
    name: 'Planeswalker',
    image: '../assets/cards/planeswalker.jpg',
    description: 'Powerful allies with loyalty abilities you activate each turn.',
    tag: 'Main phase only',
    wide: true,
  },
]

function CardThumbnail({ imagePath, className }) {
  const [hasImage, setHasImage] = useState(true)
  const src = new URL(imagePath, import.meta.url).href

  if (!hasImage) {
    return <span className="card-types__thumbnail-placeholder">img</span>
  }

  return (
    <img
      className={className}
      src={src}
      alt=""
      onError={() => setHasImage(false)}
    />
  )
}

function CardTypeItem({ type, onThumbnailEnter, onThumbnailLeave }) {
  return (
    <article className={`card-types__item${type.wide ? ' card-types__item--wide' : ''}`}>
      <h3 className="card-types__type-name">{type.name}</h3>
      <div
        className="card-types__thumbnail"
        onMouseEnter={() => onThumbnailEnter(type.id)}
        onMouseLeave={onThumbnailLeave}
      >
        <CardThumbnail imagePath={type.image} className="card-types__thumbnail-image" />
      </div>
      <p className="card-types__description">{type.description}</p>
      <span className="card-types__tag">{type.tag}</span>
    </article>
  )
}

export default function CardTypes({ session }) {
  void session
  const navigate = useNavigate()
  const [overlayId, setOverlayId] = useState(null)
  const [isClosing, setIsClosing] = useState(false)

  const activeType = CARD_TYPES.find((t) => t.id === overlayId)

  const openOverlay = useCallback((id) => {
    setIsClosing(false)
    setOverlayId(id)
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
          Every card in Magic belongs to one of seven types. The type determines what the card does
          and, more importantly, when you can play it.
        </p>

        <div className="card-types__grid">
          {CARD_TYPES.map((type) => (
            <CardTypeItem
              key={type.id}
              type={type}
              onThumbnailEnter={openOverlay}
              onThumbnailLeave={closeOverlay}
            />
          ))}
        </div>

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
            onClick={() => navigate('/lesson/3')}
          >
            Next
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_2} />
      </div>

      {activeType && (
        <div
          className={`card-types__overlay${isClosing ? ' card-types__overlay--closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeType.name} card type`}
          onClick={closeOverlay}
        >
          <div
            className="card-types__overlay-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="card-types__overlay-close"
              aria-label="Close"
              onClick={closeOverlay}
            >
              ×
            </button>
            <div className="card-types__overlay-image">
              <CardThumbnail
                imagePath={activeType.image}
                className="card-types__thumbnail-image"
              />
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
