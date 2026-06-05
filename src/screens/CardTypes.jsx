import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap.js'
import { useNavigate } from 'react-router-dom'
import CastVsPlayExplainer from '../components/CastVsPlayExplainer.jsx'
import LessonActions from '../components/LessonActions.jsx'
import PageLayout from '../components/PageLayout.jsx'
import StackExplainer from '../components/StackExplainer.jsx'
import TapExplainer from '../components/TapExplainer.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import { cardImage } from '../assets/cards/index.js'
import './CardTypes.css'

const CARD_TYPES = [
  {
    id: 'creature',
    name: 'Creature',
    description: 'Fights on your behalf. Stays on the battlefield until it dies.',
    tag: 'Main phase · stack empty',
    wide: false,
    details: [
      'Creatures are cast during your main phase when the stack is empty. Pay the mana cost in the corner, put the creature on the stack, and let your opponent respond before it resolves. Once it resolves, it stays on the battlefield as a permanent.',
      {
        heading: 'Combat',
        list: [
          'Attack: during your combat phase, you choose untapped creatures to attack the defending player (or one of their planeswalkers). Each attacker taps as it attacks.',
          'Block: the defending player chooses untapped creatures to block attackers. A blocker must be able to block that attacker under the normal rules.',
          'Damage: creatures deal damage equal to their power. If a creature takes damage equal to or greater than its toughness in one turn, it dies and goes to the graveyard. Unblocked attackers deal their power as damage to the player or planeswalker being attacked.',
          'At end of turn, damage on creatures is cleared. A creature that survived with 1 toughness left is back at full health next turn.',
        ],
      },
      'Most creatures you cast this turn have summoning sickness: they cannot attack or use tap abilities until they have been under your control since the start of your turn.',
    ],
    examples: [
      {
        src: cardImage('creature-llanowar-elves.jpg'),
        label: 'Llanowar Elves',
      },
      {
        src: cardImage('creature-shadowmage-infiltrator.webp'),
        label: 'Shadowmage Infiltrator',
      },
      {
        src: cardImage('creature-legendary-grothama.webp'),
        label: 'Grothama, All-Devouring',
      },
    ],
  },
  {
    id: 'land',
    name: 'Land',
    description:
      'Lands give you mana (the energy you spend to cast spells). Play one land per turn in your main phase (lands are played, not cast).',
    tag: 'Main phase · one per turn',
    wide: false,
    details: [
      {
        heading: 'Playing vs. casting',
        text: 'Lands are played, not cast. Playing a land puts it directly onto the battlefield during your main phase and does not use the stack. Every other card type in this lesson (with a mana cost in the corner) is cast: you pay mana, the spell goes on the stack, and your opponent can respond before it resolves.',
      },
      {
        heading: 'What is mana?',
        text: 'Mana is the magical energy you use to cast spells and activate abilities. It is not a physical card or token on the table. You produce it during your turn, spend it when you cast something, and any left over fades away when the step or phase ends. Every non-land spell shows a mana cost in the top-right corner (you saw this in Lesson 1). Coloured symbols mean you need that specific colour of mana; a number in a grey circle means you can pay with mana of any colour. Lands are the main way to produce that mana.',
      },
      {
        heading: 'How to pay for a spell',
        list: [
          'Tap lands (or other mana sources) to add mana to your mana pool.',
          'Cast the spell and pay its mana cost from that pool.',
          'The spell goes on the stack; your opponent can respond before it resolves.',
          'Any mana left in your pool when the step or phase ends disappears — spend it or lose it.',
        ],
      },
      'Most decks need plenty of lands, often about 24 in a 60-card deck, though faster or slower decks adjust that number.',
      {
        heading: 'The five basic lands',
        list: [
          'Plains: adds white mana (W)',
          'Island: adds blue mana (U)',
          'Swamp: adds black mana (B)',
          'Mountain: adds red mana (R)',
          'Forest: adds green mana (G)',
        ],
        text: 'Each basic land’s name matches its type (a card named Forest is a basic Forest). You may put any number of the same basic land in your deck.',
      },
      'Non-basic lands are every other land card. They might produce two colors, enter the battlefield tapped, or have extra rules text. They still count as lands and follow the one-land-per-turn rule, read the card to see what they do. Woodland Cemetery is an example of a non-basic land that can produce black or green mana.',
      {
        heading: 'What does tap mean?',
        text: 'To tap a card, turn it sideways. That marks it as used for the rest of the turn. Tap a land to add mana to your pool, you cannot tap the same land again until it untaps at the start of your next turn. If a land entered the battlefield tapped, it starts sideways and cannot produce mana until then.',
      },
      'Lands stay on the battlefield unless something removes them.',
    ],
    examples: [
      {
        src: cardImage('land-forest.jpg'),
        label: 'Forest',
        role: 'Basic land',
      },
      {
        src: cardImage('land-swamp.jpg'),
        label: 'Swamp',
        role: 'Basic land',
      },
      {
        src: cardImage('land-woodland-cemetery.jpg'),
        label: 'Woodland Cemetery',
        role: 'Non-basic land',
      },
    ],
  },
  {
    id: 'instant',
    name: 'Instant',
    description:
      'Fast spells you can cast any time, including in response to spells on the stack.',
    tag: 'Any time · you have priority',
    wide: false,
    details: [
      'Priority is your window to play cards, activate abilities, or pass and let the game move on. When you have priority, you can act; when you pass, your opponent gets a chance.',
      'When you cast an instant, it goes on the stack like any other spell. The difference is when you are allowed to cast it: instants can be cast any time you have priority, even when the stack is not empty.',
      'That lets you respond to your opponent. If they cast a spell, you can cast an instant while their spell is still on the stack, before it resolves. Counterspell is a classic example: it counters another spell that is waiting on the stack.',
      'Instants also work during your main phase, combat, or on your opponent’s turn. Shock can deal damage during combat; Giant Growth can save a creature from dying after damage is assigned.',
    ],
    examples: [
      {
        src: cardImage('instant-shock.jpg'),
        label: 'Shock',
      },
      {
        src: cardImage('instant-counterspell.webp'),
        label: 'Counterspell',
      },
      {
        src: cardImage('instant-giant-growth.jpg'),
        label: 'Giant Growth',
      },
    ],
  },
  {
    id: 'sorcery',
    name: 'Sorcery',
    description:
      'Powerful one-shot spells. Cast only during your main phase when the stack is empty.',
    tag: 'Main phase · stack empty',
    wide: false,
    details: [
      'Sorceries are spells that do their job and then go to the graveyard. They do not stay on the battlefield like creatures or artifacts.',
      'You can only cast a sorcery during your own main phase when the stack is empty. That means no other spell is waiting to resolve, and it is your turn. You cannot cast sorceries during combat, on your opponent’s turn, or while responding to something on the stack.',
      'Because of that timing, sorceries tend to be bigger or slower effects, searching your library, destroying multiple permanents, or drawing several cards. Cultivate puts lands onto the battlefield; Duress makes your opponent discard a card.',
    ],
    examples: [
      {
        src: cardImage('sorcery-cultivate.jpg'),
        label: 'Cultivate',
      },
      {
        src: cardImage('sorcery-duress.jpg'),
        label: 'Duress',
      },
    ],
  },
  {
    id: 'artifact',
    name: 'Artifact',
    description:
      'Permanent objects: relics, devices, and gear. Most are colourless; many produce mana or protect your creatures.',
    tag: 'Main phase · stack empty',
    wide: false,
    details: [
      'Artifacts are magical objects you cast and keep on the battlefield, like creatures or enchantments. They are not lands. You cast them during your main phase when the stack is empty, paying their mana cost like any other spell. Once in play, their rules text tells you what they do.',
      'Most artifacts are colourless (their mana cost uses grey symbols only), so they can fit into decks of any colour. Some artifacts are coloured and need specific mana to cast, check the mana cost in the corner.',
      {
        heading: 'What artifacts can do',
        list: [
          'Produce mana: tap the artifact to add mana to your pool, similar to a land. Sol Ring adds two colourless mana; Commander’s Sphere adds one mana of any colour.',
          'Equip creatures: Equipment artifacts attach to a creature you control to give it power, toughness, or abilities (for example, +2/+2 or “can’t be blocked”). You pay an equip cost to move the Equipment onto a creature.',
          'Protect or strengthen your board: some artifacts grant hexproof, prevent damage, or make your creatures harder to block. Others affect the whole game, like drawing extra cards or searching your library.',
          'Utility effects: anything else the card says: sacrifice for a benefit, pay mana to activate an ability, or trigger when something happens. Always read the rules text.',
        ],
      },
      'Many artifact abilities use the tap symbol (turn the card sideways) and sometimes a mana cost. You can use those abilities only when you could cast a sorcery, usually during your main phase when the stack is empty, unless the card says otherwise.',
      'Commander’s Sphere also shows a second use: you can sacrifice it (send it to the graveyard) to draw a card. Not every artifact produces mana; some exist purely for protection, card advantage, or combat tricks.',
    ],
    examples: [
      {
        src: cardImage('artifact-sol-ring.jpg'),
        label: 'Sol Ring',
        role: 'Produces mana',
      },
      {
        src: cardImage('artifact-commanders-sphere.webp'),
        label: "Commander's Sphere",
        role: 'Mana and card draw',
      },
    ],
  },
  {
    id: 'enchantment',
    name: 'Enchantment',
    description: 'Ongoing effects that linger on the battlefield.',
    tag: 'Main phase · stack empty',
    wide: false,
    details: [
      'Enchantments are permanent spells you cast during your main phase when the stack is empty. They stay on the battlefield and change how the game works while they remain in play.',
      {
        heading: 'Auras vs. other enchantments',
        list: [
          'Non-aura enchantments (like Sylvan Library or Goblin Oriflamme) sit on the battlefield and affect the game broadly — your draws, your creatures, the whole table, and so on.',
          'Aura enchantments target something specific, usually a creature, land, or player, and attach to it. If the thing they are attached to leaves the battlefield, the aura goes to the graveyard.',
        ],
        text: 'Read the rules text to see exactly what each enchantment changes. They leave play if destroyed or if an effect exiles them.',
      },
    ],
    examples: [
      {
        src: cardImage('enchantment-sylvan-library.webp'),
        label: 'Sylvan Library',
      },
      {
        src: cardImage('enchantment-valakut-exploration.webp'),
        label: 'Valakut Exploration',
      },
      {
        src: cardImage('enchantment-goblin-origlamme.jpg'),
        label: 'Goblin Oriflamme',
      },
    ],
  },
  {
    id: 'planeswalker',
    name: 'Planeswalker',
    description: 'Powerful allies with loyalty abilities you activate each turn.',
    tag: 'Main phase · stack empty',
    wide: true,
    details: [
      'Planeswalkers are permanent allies you cast during your main phase when the stack is empty. They enter the battlefield with loyalty counters (shown in the bottom-right corner).',
      {
        heading: 'Loyalty abilities',
        list: [
          'Each planeswalker has two or three loyalty abilities, marked with +, −, or neutral loyalty costs in their text box.',
          'You may activate one loyalty ability per planeswalker per turn, during your main phase when the stack is empty (same timing as casting a sorcery).',
          'Abilities with a + cost add loyalty; abilities with a − cost subtract loyalty. If a planeswalker has zero loyalty, it goes to the graveyard.',
        ],
      },
      'Opponents can attack your planeswalkers with creatures, as if the planeswalker were a player. You can block those attacks with your creatures. Damage dealt to a planeswalker removes that many loyalty counters.',
    ],
    examples: [
      {
        src: cardImage('planeswalker-nahiri.webp'),
        label: 'Nahiri, the Lithomancer',
      },
    ],
  },
]

function CardTypeTimingTag({ timing }) {
  return (
    <span className="card-types__tag">
      <span className="card-types__tag-label">When you can play</span>
      <span className="card-types__tag-value">{timing}</span>
    </span>
  )
}

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
    <article className={[
      'card-types__item',
      type.wide ? 'card-types__item--wide' : '',
      type.id === 'instant' ? 'card-types__item--any-time' : '',
    ].filter(Boolean).join(' ')}>
      <h3 className="card-types__type-name">{type.name}</h3>
      <div className="card-types__examples" aria-label={`${type.name} examples`}>
        {type.examples.map((example) => (
          <button
            key={example.label}
            type="button"
            className="card-types__thumbnail"
            aria-label={`View ${example.label}`}
            onClick={() => onSeeCard(type.id)}
          >
            <CardThumbnail
              src={example.src}
              alt={`${example.label}, ${type.name} card`}
              className="card-types__thumbnail-image"
            />
          </button>
        ))}
      </div>
      <CardTypeDetails description={type.description} />
      <CardTypeTimingTag timing={type.tag} />
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
          play or cast it.
        </p>

        <CastVsPlayExplainer variant="brief" />

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

        <TapExplainer variant="brief" />

        <StackExplainer variant="brief" />

        <p className="card-types__closing">
          Notice that only instants can be cast at any time you have priority. Creatures, sorceries,
          enchantments, artifacts, and planeswalkers are cast during your main phase when the stack is
          empty. Lands are different: they are played (not cast) during a main phase, one per turn,
          and never use the stack.
        </p>

        <p className="card-types__timing-footnote">
          On the tags above, &ldquo;Main phase · stack empty&rdquo; means your turn, a main phase,
          and nothing waiting on the stack — the usual timing for casting creatures, sorceries,
          artifacts, enchantments, and planeswalkers. Some cards break these rules; read the card if
          you are unsure.
        </p>

        <p className="card-types__note">
          There are exceptions to every rule in Magic, and many cards use keywords that change how
          they work. What you saw here is a basic introduction: enough to get started, not every
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
            <CardTypeTimingTag timing={activeType.tag} />
                </>
              )
            })()}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
