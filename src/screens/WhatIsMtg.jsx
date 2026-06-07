import { useNavigate } from 'react-router-dom'
import LessonActions from '../components/LessonActions.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import GlossaryText from '../components/GlossaryText.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import { getCuriosityWhatIsMtgNote } from '../lib/learnerChoice.js'
import { cardImage } from '../assets/cards/index.js'
import './WhatIsMtg.css'

const battlefieldSimpleImg = new URL('../assets/batrlefield-simple.jpg', import.meta.url).href

const CARD_TYPE_SAMPLES = [
  { label: 'Creature', src: cardImage('creature-llanowar-elves.jpg'), alt: 'Llanowar Elves creature card' },
  { label: 'Instant', src: cardImage('instant-shock.jpg'), alt: 'Shock instant card' },
  { label: 'Sorcery', src: cardImage('sorcery-cultivate.jpg'), alt: 'Cultivate sorcery card' },
  { label: 'Artifact', src: cardImage('artifact-sol-ring.jpg'), alt: 'Sol Ring artifact card' },
  {
    label: 'Enchantment',
    src: cardImage('enchantment-sylvan-library.webp'),
    alt: 'Sylvan Library enchantment card',
  },
  { label: 'Planeswalker', src: cardImage('planeswalker-ajani.webp'), alt: 'Ajani planeswalker card' },
  { label: 'Land', src: cardImage('land-forest.jpg'), alt: 'Forest land card' },
]

const SETUP_ITEMS = [
  'Each player shuffles their deck face-down. That deck becomes their library during the game.',
  'Each player starts at a life total set by the format you are playing. The usual goal is to reduce opponents to 0 life, unless a card or format rule wins the game another way.',
  'Decide who goes first (flip a coin, roll dice, or just agree).',
  'Each player draws seven cards. That is your opening hand. If the hand is weak, many groups allow a mulligan: shuffle back and draw one fewer card (optional and format-dependent).',
]

const ZONES = [
  {
    name: 'Library',
    description: 'Your deck. You draw cards from the top of your library during the game.',
  },
  {
    name: 'Hand',
    description:
      'Cards you are holding. You play or cast them when the rules allow, mostly on your turn, though instants can be cast on your opponent’s turn too.',
  },
  {
    name: 'Battlefield',
    description:
      'The table area where permanents in play sit, including lands, creatures, artifacts, enchantments, and planeswalkers.',
  },
  {
    name: 'Graveyard',
    description:
      'A face-up pile for cards that were used up, destroyed, or discarded. Creatures and most spells end up here.',
  },
  {
    name: 'Exile',
    description:
      'A separate zone for cards removed from the game. Exiled cards are not in your graveyard and usually cannot be used again unless a card says so.',
  },
]

export default function WhatIsMtg({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'WhatIsMtg')
  const curiosityNote = getCuriosityWhatIsMtgNote(session.curiosityFocus)

  return (
    <PageLayout
      title="What Is Magic? · Learn to Play MTG"
      className="what-is-mtg"
      showKeywordDictionary
    >
      <div className="what-is-mtg__frame page-layout__content-frame">
        <p className="what-is-mtg__breadcrumb">Overview · What Is Magic?</p>
        <h1 className="what-is-mtg__heading">What Is Magic?</h1>
        <hr className="what-is-mtg__rule" aria-hidden="true" />

        {curiosityNote ? (
          <p className="what-is-mtg__curiosity-note" role="status">
            {curiosityNote}
          </p>
        ) : null}

        <div className="what-is-mtg__body">
          <p className="what-is-mtg__pitch">
            In Magic, two players use custom decks of cards to cast spells and creatures until one
            player reaches zero life.
          </p>
          <p className="what-is-mtg__paragraph">
            <strong>Magic: The Gathering</strong> is a collectible card game.{' '}
            <GlossaryText text="Each player brings a deck of cards and takes turns playing lands, casting spells, and attacking with creatures." />{' '}
            Most games end when a player&apos;s life total reaches 0.
          </p>

          <h2 className="what-is-mtg__subheading">Card types</h2>
          <p className="what-is-mtg__paragraph">
            Cards come in several types. Lesson 2 goes deeper; for now, here are examples of each:
          </p>
          <div className="what-is-mtg__card-types" role="list" aria-label="Sample Magic card types">
            {CARD_TYPE_SAMPLES.map((card) => (
              <figure key={card.label} className="what-is-mtg__card-type" role="listitem">
                <img
                  className="what-is-mtg__card-type-img"
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="what-is-mtg__card-type-label">{card.label}</figcaption>
              </figure>
            ))}
          </div>

          <h2 className="what-is-mtg__subheading">Formats</h2>
          <p className="what-is-mtg__paragraph">
            Magic has many <strong>formats</strong>, rule sets that define which cards you can use,
            deck size, starting life, and other details. Whether you play one-on-one or multiplayer,
            Standard, Commander, or something else, the lessons teach core rules that apply in every
            format.
          </p>

          <h2 className="what-is-mtg__subheading">Starting a game</h2>
          <ol className="what-is-mtg__setup-list">
            {SETUP_ITEMS.map((item) => (
              <li key={item} className="what-is-mtg__setup-item">
                <GlossaryText text={item} />
              </li>
            ))}
          </ol>
          <p className="what-is-mtg__paragraph">
            Once setup is done, players take turns. Lesson 3 walks through each phase in detail.
          </p>

          <h2 className="what-is-mtg__subheading">Zones on the table</h2>
          <p className="what-is-mtg__paragraph">
            During a game, cards move between several zones. You do not need to memorize every rule
            yet. Just know where cards usually go:
          </p>
          <figure className="what-is-mtg__figure">
            <img
              className="what-is-mtg__figure-img"
              src={battlefieldSimpleImg}
              alt="Diagram of a two-player table showing each player's play area in the center and library and graveyard piles on the sides"
            />
            <figcaption className="what-is-mtg__figure-caption">
              <GlossaryText text="A simplified table layout: play areas (battlefield) in the middle, decks (libraries) and discard piles (graveyards) on each side." />
            </figcaption>
          </figure>
          <dl className="what-is-mtg__zones">
            {ZONES.map((zone) => (
              <div key={zone.name} className="what-is-mtg__zone">
                <dt className="what-is-mtg__zone-name">{zone.name}</dt>
                <dd className="what-is-mtg__zone-desc">
                  <GlossaryText text={zone.description} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <LessonActions
          classPrefix="what-is-mtg"
          backLabel="Back to overview"
          onBack={() => navigate('/lesson/intro')}
          onNext={() => navigate('/lesson/1')}
          nextLabel="Continue to card anatomy"
        />
        <ProgressDots activeIndex={PROGRESS.WHAT_IS_MTG} stepLabel="Overview" />
      </div>
    </PageLayout>
  )
}
