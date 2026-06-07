import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import GlossaryText from '../components/GlossaryText.jsx'
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

        <div className="what-is-mtg__body">
          <p className="what-is-mtg__paragraph">
            <strong>Magic: The Gathering</strong> is a collectible card game.{' '}
            <GlossaryText text="Each player brings a deck of cards and takes turns playing lands, casting spells, and attacking with creatures." />{' '}
            Most games end when a player&apos;s life total reaches 0.
          </p>

          <h2 className="what-is-mtg__subheading">Formats</h2>
          <p className="what-is-mtg__paragraph">
            Magic has many <strong>formats</strong>, which are rule sets that define which cards you
            can use. <strong>Standard</strong> decks are usually at least 60 cards;{' '}
            <strong>Commander</strong> uses 100-card singleton decks built around a legendary
            commander. The lessons teach core rules that apply in every format.
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
            onClick={() => navigate('/first-game')}
          >
            Continue to Starting a Game
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.WHAT_IS_MTG} />
      </div>
    </PageLayout>
  )
}
