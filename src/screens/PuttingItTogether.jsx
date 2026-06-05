import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { LESSON_BACK_CONFIRM_MESSAGE, LESSON_BACK_CONFIRM_TITLE } from '../lib/lessonNav.js'
import PageLayout from '../components/PageLayout.jsx'
import { cardImage } from '../assets/cards/index.js'
import './PuttingItTogether.css'

const CARD_IMAGES = {
  'shock.jpg': cardImage('instant-shock.jpg'),
  'giant-growth.jpg': cardImage('instant-giant-growth.jpg'),
  'llanowar-elves.jpg': cardImage('creature-llanowar-elves.jpg'),
  'forest.jpg': cardImage('land-forest.jpg'),
  'woodland-cemetery.jpg': cardImage('land-woodland-cemetery.jpg'),
  'cultivate.jpg': cardImage('sorcery-cultivate.jpg'),
  'sol-ring.jpg': cardImage('artifact-sol-ring.jpg'),
  'counterspell.jpg': cardImage('instant-counterspell.webp'),
  'hellkite-tyrant.webp': cardImage('creature-hellkite-tyrant.webp'),
}

const SCENARIOS = [
  {
    id: 's1',
    text: "It's your main phase. Shock is in your hand; it costs one red mana and deals 2 damage. You have one untapped Mountain on the battlefield (tap it to add one red mana to your pool). Can you cast Shock now?",
    cardImage: 'shock.jpg',
    cardImageAlt: 'Shock: Instant',
    correctAnswer: true,
    explanation:
      'Yes. Tap your Mountain for one red mana, then cast Shock. Instants can be cast any time you have priority, including your main phase, and you have enough mana after tapping.',
  },
  {
    id: 's2',
    text: "It's your opponent's turn and they just attacked you with a creature. You have a Giant Growth in your hand. Giant Growth is an instant that gives a creature +3/+3. Can you cast it right now to boost your blocker?",
    cardImage: 'giant-growth.jpg',
    cardImageAlt: 'Giant Growth: Instant',
    correctAnswer: true,
    explanation:
      "Yes. Giant Growth is an instant, which means you can cast it at any time, including on your opponent's turn during combat. This is exactly what instants are designed for.",
  },
  {
    id: 's3',
    text: "It's your first main phase and the stack is empty. Llanowar Elves is in your hand; it costs one green mana. You have one untapped Forest on the battlefield. Can you tap the Forest for mana and cast Llanowar Elves?",
    cardImage: 'llanowar-elves.jpg',
    cardImageAlt: 'Llanowar Elves: Creature',
    correctAnswer: true,
    explanation:
      'Yes. During your main phase with an empty stack, tap your Forest for one green mana, then cast Llanowar Elves for one green. Creatures use the same timing as other non-instant spells.',
  },
  {
    id: 's4',
    text: "It's your first main phase. You have two forest lands in your hand and no lands on the battlefield yet. Can you play both of them this turn?",
    cardImage: 'forest.jpg',
    cardImageAlt: 'Forest: Land',
    correctAnswer: false,
    explanation:
      "No. You can only play one land per turn. It doesn't matter how many you have in your hand. Pick one, play it, and save the other for next turn.",
  },
  {
    id: 's5',
    text: "You just played a Woodland Cemetery. The card says 'Woodland Cemetery enters the battlefield tapped unless you control a Swamp or a Forest.' You don't have a Swamp or a Forest. You need one black mana right now to cast a spell. Can you tap Woodland Cemetery for mana immediately after playing it?",
    cardImage: 'woodland-cemetery.jpg',
    cardImageAlt: 'Woodland Cemetery: Land',
    correctAnswer: false,
    explanation:
      "No. Because you don't control a Swamp or a Forest, Woodland Cemetery entered the battlefield tapped. You cannot tap it for mana this turn. It will untap during your next untap step, and then you can use it normally.",
  },
  {
    id: 's6',
    text: "It's your opponent's turn and they just finished attacking you. You have a Cultivate in your hand. Cultivate is a sorcery that searches for land cards. Can you cast it right now?",
    cardImage: 'cultivate.jpg',
    cardImageAlt: 'Cultivate: Sorcery',
    correctAnswer: false,
    explanation:
      "No. Sorceries can only be cast during your own main phase when the stack is empty. Since it's your opponent's turn, you'll have to wait.",
  },
  {
    id: 's7',
    text: "It's your first main phase and the stack is empty. You have a Sol Ring in your hand. Sol Ring is an artifact that produces mana. Can you cast it right now?",
    cardImage: 'sol-ring.jpg',
    cardImageAlt: 'Sol Ring: Artifact',
    correctAnswer: true,
    explanation:
      'Yes. Artifacts are cast during your main phase when the stack is empty, same as creatures and sorceries. Sol Ring is one of the most commonly cast artifacts in the game.',
  },
  {
    id: 's8',
    text: 'Your opponent just cast a spell and it is currently on the stack. You have a Counterspell in your hand. Counterspell is an instant that cancels another spell. Can you cast it right now to stop their spell?',
    cardImage: 'counterspell.jpg',
    cardImageAlt: 'Counterspell: Instant',
    correctAnswer: true,
    explanation:
      "Yes. Counterspell is an instant, so you can cast it when you have priority, including in response to your opponent's spell while it is on the stack. This is one of the most powerful things instants can do.",
  },
  {
    id: 's9',
    text: "It's your combat phase. You attack with a 5/5 creature. Your opponent does not block it. Will your opponent's life total go down?",
    cardImage: 'hellkite-tyrant.webp',
    cardImageAlt: 'Creature attacking (5/5 example)',
    correctAnswer: true,
    explanation:
      'Yes. An unblocked attacker deals damage equal to its power to the defending player. Your 5/5 deals 5 damage, lowering their life total. Most games end when a player reaches 0 life.',
  },
]

function fisherYates(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ScenarioCardImage({ src, alt }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  if (error) {
    return <div className="putting-together__card-placeholder">{alt}</div>
  }

  return (
    <img
      className="putting-together__card-image"
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  )
}

export default function PuttingItTogether({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const { incrementScenarios } = session

  useScreenTime(session, 'PuttingItTogether')

  const [shuffled] = useState(() => fisherYates(SCENARIOS))
  const [queueIndex, setQueueIndex] = useState(0)
  const [seenIds, setSeenIds] = useState(new Set())
  const [phase, setPhase] = useState('question')
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const scenario = shuffled[queueIndex]
  const allSeen = seenIds.size >= SCENARIOS.length
  const hasCompletedRequiredScenario = seenIds.size > 0
  const isCorrect = selectedAnswer === scenario.correctAnswer

  function getAnswerClassName(answerValue) {
    const classes = ['putting-together__answer']
    if (phase === 'question' && selectedAnswer === answerValue) {
      classes.push('putting-together__answer--selected')
    }
    if (phase === 'feedback') {
      const isSelected = selectedAnswer === answerValue
      const isCorrectAnswer = scenario.correctAnswer === answerValue
      if (isCorrect && isSelected) {
        classes.push('putting-together__answer--feedback-correct')
      } else if (!isCorrect) {
        if (isSelected) classes.push('putting-together__answer--feedback-incorrect')
        else if (isCorrectAnswer) classes.push('putting-together__answer--feedback-correct-reveal')
      }
    }
    return classes.join(' ')
  }

  function handleAnswer(answer) {
    if (phase !== 'question') return
    setSelectedAnswer(answer)
    setSeenIds((prev) => new Set([...prev, scenario.id]))
    incrementScenarios()
    setPhase('feedback')
  }

  function handleAnother() {
    setQueueIndex((prev) => prev + 1)
    setPhase('question')
    setSelectedAnswer(null)
  }

  function handleComplete() {
    navigate('/lesson/complete')
  }

  return (
    <PageLayout title="Lesson 4 · Putting It Together" className="putting-together">
      <div className="putting-together__frame">
        <p className="putting-together__breadcrumb">Lesson 04 · Putting It Together</p>
        <h1 className="putting-together__heading">Let&apos;s Put It Together</h1>
        <hr className="putting-together__rule" aria-hidden="true" />

        <p className="putting-together__intro">
          Now that you know the card types and the turn structure, let&apos;s see how they connect.
          Read each scenario and decide what you would do.
        </p>

        <p className="putting-together__intro">
          When a scenario involves casting a spell, remember the usual sequence: tap lands or other
          sources to add mana to your pool, cast the spell and pay from that pool, then let it
          resolve from the stack. Leftover mana disappears when the step or phase ends.
        </p>

        <p className="putting-together__progress" aria-live="polite">
          {allSeen
            ? 'All scenarios completed.'
            : hasCompletedRequiredScenario
              ? `Completed ${seenIds.size} of ${SCENARIOS.length} scenarios (first required, rest optional)`
              : 'Complete the first scenario to unlock Finish Lesson. Remaining scenarios are optional.'}
        </p>

        <div className="putting-together__scenario">
          <ScenarioCardImage
            src={CARD_IMAGES[scenario.cardImage]}
            alt={scenario.cardImageAlt}
          />
          <div className="putting-together__scenario-text-box">
            <p className="putting-together__scenario-text">{scenario.text}</p>
          </div>
        </div>

        <div className="putting-together__answers">
          <button
            type="button"
            className={getAnswerClassName(true)}
            disabled={phase !== 'question'}
            onClick={() => handleAnswer(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={getAnswerClassName(false)}
            disabled={phase !== 'question'}
            onClick={() => handleAnswer(false)}
          >
            No
          </button>
        </div>

        {phase === 'feedback' && (
          <div
            className={`putting-together__feedback${isCorrect ? ' putting-together__feedback--correct' : ' putting-together__feedback--incorrect'}`}
            role="status"
            aria-live="polite"
          >
            <p className="putting-together__feedback-verdict">
              <span className="putting-together__feedback-icon" aria-hidden="true">
                {isCorrect ? '◆' : '×'}
              </span>
              {isCorrect ? 'Correct!' : 'Not quite.'}
            </p>
            <p className="putting-together__feedback-explanation">{scenario.explanation}</p>
          </div>
        )}

        {phase === 'feedback' && (
          <div className="putting-together__follow-up">
            <h2 className="putting-together__follow-up-heading">What would you like to do?</h2>
            <div
              className={`putting-together__follow-up-options${
                allSeen ? ' putting-together__follow-up-options--single' : ''
              }`}
            >
              {!allSeen && (
                <button
                  type="button"
                  className="putting-together__choice putting-together__choice--practice"
                  onClick={handleAnother}
                >
                  <span className="putting-together__choice-label">Next Scenario</span>
                  <span className="putting-together__choice-hint">
                    Stay on this page and try another practice question
                  </span>
                </button>
              )}
              <button
                type="button"
                className="putting-together__choice putting-together__choice--finish"
                onClick={handleComplete}
              >
                <span className="putting-together__choice-label">Finish Lesson</span>
                <span className="putting-together__choice-hint">
                  {allSeen
                    ? 'You completed all scenarios. Go to the lesson wrap-up'
                    : 'Skip any remaining scenarios and go to the lesson wrap-up'}
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="putting-together__actions">
          <button
            type="button"
            className="putting-together__button putting-together__button--back putting-together__button--stacked"
            onClick={async () => {
              if (
                !(await confirm(LESSON_BACK_CONFIRM_MESSAGE, {
                  title: LESSON_BACK_CONFIRM_TITLE,
                }))
              ) {
                return
              }
              navigate('/lesson/3')
            }}
          >
            <span className="putting-together__button-label">Back</span>
            <span className="putting-together__button-hint">Return to Turn Structure</span>
          </button>
          {phase === 'question' && hasCompletedRequiredScenario && (
            <button
              type="button"
              className="putting-together__button putting-together__button--next putting-together__button--stacked"
              onClick={handleComplete}
            >
              <span className="putting-together__button-label">Finish Lesson</span>
              <span className="putting-together__button-hint">Go to lesson wrap-up</span>
            </button>
          )}
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_4} />
      </div>
    </PageLayout>
  )
}
