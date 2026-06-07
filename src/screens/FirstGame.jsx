import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlossaryText from '../components/GlossaryText.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import useScreenTime from '../hooks/useScreenTime.js'
import { cardImage } from '../assets/cards/index.js'
import './FirstGame.css'

const TURN_STEPS = [
  {
    id: 'untap',
    phase: 'Beginning phase',
    title: 'Untap your permanents',
    body: 'At the start of your turn, turn every tapped card upright. Lands, creatures, and other permanents on your side of the table untap so you can use them again.',
    image: cardImage('land-forest.jpg'),
    imageAlt: 'Forest land card',
  },
  {
    id: 'draw',
    phase: 'Beginning phase',
    title: 'Draw a card',
    body: 'Draw one card from the top of your library. On the very first turn of the game, only the player who goes second draws; the first player skips this draw step once.',
    image: cardImage('creature-llanowar-elves.jpg'),
    imageAlt: 'Llanowar Elves creature card',
  },
  {
    id: 'main-one',
    phase: 'First main phase',
    title: 'Play lands and cast spells',
    body: 'This is your first main phase. You may play one land from your hand onto the battlefield. You can also cast creatures, sorceries, artifacts, enchantments, and planeswalkers when the stack is empty. Instants can be cast any time you have priority, including here.',
    image: cardImage('sorcery-cultivate.jpg'),
    imageAlt: 'Cultivate sorcery card',
  },
  {
    id: 'combat',
    phase: 'Combat phase',
    title: 'Attack and block',
    body: 'You choose which untapped creatures attack. The defending player chooses blockers. Creatures deal damage equal to their power. Unblocked attackers deal damage to the defending player. Lesson 3 goes deeper into each combat step.',
    image: cardImage('creature-hellkite-tyrant.webp'),
    imageAlt: 'Hellkite Tyrant creature card',
  },
  {
    id: 'main-two',
    phase: 'Second main phase',
    title: 'Another main phase',
    body: 'After combat, you get a second main phase. Many players hold back creatures or sorceries until they see how combat went. If you have not played a land yet, you may play it now—you still get only one land per turn total.',
    image: cardImage('artifact-sol-ring.jpg'),
    imageAlt: 'Sol Ring artifact card',
  },
  {
    id: 'end',
    phase: 'End phase',
    title: 'Wrap up the turn',
    body: "If you have more than seven cards in hand, discard down to seven. Damage on creatures is removed and 'until end of turn' effects expire. Then it is your opponent's turn.",
    image: cardImage('instant-shock.jpg'),
    imageAlt: 'Shock instant card',
  },
]

export default function FirstGame({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'FirstGame')
  const [stepIndex, setStepIndex] = useState(0)

  const step = TURN_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === TURN_STEPS.length - 1

  return (
    <PageLayout title="First Turn Walkthrough · Learn to Play MTG" className="first-game" showKeywordDictionary>
      <div className="first-game__frame page-layout__content-frame">
        <p className="first-game__breadcrumb">Overview · First Turn Walkthrough</p>
        <h1 className="first-game__heading">Walk Through a Sample Turn</h1>
        <hr className="first-game__rule" aria-hidden="true" />

        <p className="first-game__intro">
          Before the lessons dive into details, step through one turn in order. Click Next step when
          you are ready—there is no timer.
        </p>

        <p className="first-game__progress" aria-live="polite">
          Step {stepIndex + 1} of {TURN_STEPS.length}
        </p>

        <div className="first-game__step" role="region" aria-labelledby="first-game-step-title">
          <p className="first-game__phase">{step.phase}</p>
          <h2 id="first-game-step-title" className="first-game__step-title">
            {step.title}
          </h2>
          <img className="first-game__step-image" src={step.image} alt={step.imageAlt} />
          <p className="first-game__step-body">
            <GlossaryText text={step.body} />
          </p>
        </div>

        <div className="first-game__step-nav">
          <button
            type="button"
            className="first-game__button first-game__button--back"
            disabled={isFirst}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            Previous step
          </button>
          {!isLast ? (
            <button
              type="button"
              className="first-game__button first-game__button--next"
              onClick={() => setStepIndex((i) => Math.min(TURN_STEPS.length - 1, i + 1))}
            >
              Next step
            </button>
          ) : (
            <button
              type="button"
              className="first-game__button first-game__button--next"
              onClick={() => navigate('/lesson/1')}
            >
              Continue to Lesson 1
            </button>
          )}
        </div>

        <div className="first-game__route-nav">
          <button
            type="button"
            className="first-game__button first-game__button--muted"
            onClick={() => navigate('/what-is-mtg')}
          >
            Back to What Is Magic?
          </button>
        </div>

        <ProgressDots activeIndex={PROGRESS.FIRST_GAME} />
      </div>
    </PageLayout>
  )
}
