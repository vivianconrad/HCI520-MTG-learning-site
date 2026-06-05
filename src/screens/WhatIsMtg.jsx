import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import './WhatIsMtg.css'

const battlefieldSimpleImg = new URL('../assets/batrlefield-simple.jpg', import.meta.url).href

const ZONES = [
  {
    name: 'Library',
    description: 'Your deck. You draw cards from the top of your library during the game.',
  },
  {
    name: 'Hand',
    description:
      'Cards you are holding. You play or cast them when the rules allow — mostly on your turn, though instants can be cast on your opponent’s turn too.',
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

  return (
    <PageLayout title="What Is Magic? · Learn to Play MTG" className="what-is-mtg">
      <div className="what-is-mtg__frame">
        <p className="what-is-mtg__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="what-is-mtg__heading">What Is Magic?</h1>
        <hr className="what-is-mtg__rule" aria-hidden="true" />

        <div className="what-is-mtg__body">
          <p className="what-is-mtg__paragraph">
            <strong>Magic: The Gathering</strong> is a collectible card game. Each player brings a
            deck of cards and takes turns playing lands, casting spells, and attacking with
            creatures. Most games end when a player&apos;s life total reaches 0.
          </p>

          <h2 className="what-is-mtg__subheading">Formats</h2>
          <p className="what-is-mtg__paragraph">
            Magic has many <strong>formats</strong>, which are rule sets that define which cards you can use
            and how decks are built. <strong>Standard</strong> and <strong>Commander</strong> are
            among the most popular. Standard-style constructed decks are usually{' '}
            <strong>60 cards</strong> (minimum). Commander decks are{' '}
            <strong>100-card</strong> singleton decks with a legendary commander.
          </p>
          <p className="what-is-mtg__paragraph">
            The lessons ahead teach core rules: reading cards, turn order, and timing. Those apply no
            matter which format you play.
          </p>

          <h2 className="what-is-mtg__subheading">Playing vs casting</h2>
          <p className="what-is-mtg__paragraph">
            Magic uses two different words on purpose. <strong>Lands are played</strong> from your
            hand during a main phase (one land per turn by default). They go straight onto the
            battlefield — no stack, and your opponent cannot respond the way they can to a spell.{' '}
            <strong>Everything else with a mana cost is cast</strong>: you pay mana, put the spell on
            the stack, and let opponents respond before it resolves.
          </p>

          <h2 className="what-is-mtg__subheading">Tap</h2>
          <p className="what-is-mtg__paragraph">
            To <strong>tap</strong> a card, turn it sideways. That marks it as used for now. Lands
            tap to produce mana; creatures tap when they attack. At the start of your turn, the{' '}
            <strong>untap step</strong> turns your permanents upright again so you can use them once
            more.
          </p>

          <h2 className="what-is-mtg__subheading">Paying for a spell</h2>
          <p className="what-is-mtg__paragraph">
            When you cast a spell, you usually follow this sequence: <strong>tap lands</strong> (or
            other mana sources) to add mana to your <strong>mana pool</strong>;{' '}
            <strong>cast the spell</strong> and pay its mana cost from that pool; the spell goes on
            the <strong>stack</strong> and your opponent can respond; after it resolves, any mana
            still in your pool disappears when the step or phase ends. Lesson 2 and Lesson 3 go deeper
            on the stack and timing.
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
              A simplified table layout: play areas (battlefield) in the middle, decks (libraries) and
              discard piles (graveyards) on each side.
            </figcaption>
          </figure>
          <dl className="what-is-mtg__zones">
            {ZONES.map((zone) => (
              <div key={zone.name} className="what-is-mtg__zone">
                <dt className="what-is-mtg__zone-name">{zone.name}</dt>
                <dd className="what-is-mtg__zone-desc">{zone.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="what-is-mtg__actions what-is-mtg__actions--split">
          <button
            type="button"
            className="what-is-mtg__button what-is-mtg__button--back"
            onClick={() => navigate('/lesson/intro')}
          >
            Back
          </button>
          <button
            type="button"
            className="what-is-mtg__button"
            onClick={() => navigate('/lesson/1')}
          >
            Start Lesson 1
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.WHAT_IS_MTG} />
      </div>
    </PageLayout>
  )
}
