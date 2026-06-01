import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import shockImg from '../assets/instant-shock.jpg'
import giantGrowthImg from '../assets/instant-giant-growth.jpg'
import llanowarElvesImg from '../assets/creature-llanowar-elves.jpg'
import forestImg from '../assets/land-forest.jpg'
import woodlandCemeteryImg from '../assets/land-woodland-cemetery.jpg'
import cultivateImg from '../assets/sorcery-cultivate.jpg'
import solRingImg from '../assets/artifact-sol-ring.jpg'
import counterspellImg from '../assets/instant-counterspell.webp'
import './PuttingItTogether.css'

const CARD_IMAGES = {
  'shock.jpg': shockImg,
  'giant-growth.jpg': giantGrowthImg,
  'llanowar-elves.jpg': llanowarElvesImg,
  'forest.jpg': forestImg,
  'woodland-cemetery.jpg': woodlandCemeteryImg,
  'cultivate.jpg': cultivateImg,
  'sol-ring.jpg': solRingImg,
  'counterspell.jpg': counterspellImg,
}

const SCENARIOS = [
  {
    id: 's1',
    text: "It's your main phase. You have a Shock in your hand. Shock is an instant that deals 2 damage and costs one red mana. You have one mountain on the battlefield. Can you play it right now?",
    cardImage: 'shock.jpg',
    cardImageAlt: 'Shock — Instant',
    correctAnswer: true,
    explanation:
      'Yes. Shock is an instant, and instants can be played any time, including your main phase. You also have exactly enough mana to cast it.',
  },
  {
    id: 's2',
    text: "It's your opponent's turn and they just attacked you with a creature. You have a Giant Growth in your hand. Giant Growth is an instant that gives a creature +3/+3. Can you play it right now to boost your blocker?",
    cardImage: 'giant-growth.jpg',
    cardImageAlt: 'Giant Growth — Instant',
    correctAnswer: true,
    explanation:
      "Yes. Giant Growth is an instant, which means you can play it at any time, including on your opponent's turn during combat. This is exactly what instants are designed for.",
  },
  {
    id: 's3',
    text: "It's your first main phase. You have a Llanowar Elves in your hand. Llanowar Elves is a creature that costs one green mana. You have one forest land on the battlefield. Can you play Llanowar Elves right now?",
    cardImage: 'llanowar-elves.jpg',
    cardImageAlt: 'Llanowar Elves — Creature',
    correctAnswer: true,
    explanation:
      'Yes. Creatures are played during your main phase, and you have exactly one green mana available from your forest. Llanowar Elves costs one green mana, so you can cast it.',
  },
  {
    id: 's4',
    text: "It's your first main phase. You have two forest lands in your hand and no lands on the battlefield yet. Can you play both of them this turn?",
    cardImage: 'forest.jpg',
    cardImageAlt: 'Forest — Land',
    correctAnswer: false,
    explanation:
      "No. You can only play one land per turn. It doesn't matter how many you have in your hand. Pick one, play it, and save the other for next turn.",
  },
  {
    id: 's5',
    text: "You just played a Woodland Cemetery. The card says 'Woodland Cemetery enters the battlefield tapped.' You need one black mana right now to cast a spell. Can you tap Woodland Cemetery for mana immediately after playing it?",
    cardImage: 'woodland-cemetery.jpg',
    cardImageAlt: 'Woodland Cemetery — Land',
    correctAnswer: false,
    explanation:
      'No. Because it entered the battlefield tapped, you cannot tap it for mana this turn. It will untap during your next untap step, and then you can use it normally.',
  },
  {
    id: 's6',
    text: "It's your opponent's turn and they just finished attacking you. You have a Cultivate in your hand. Cultivate is a sorcery that searches for land cards. Can you cast it right now?",
    cardImage: 'cultivate.jpg',
    cardImageAlt: 'Cultivate — Sorcery',
    correctAnswer: false,
    explanation:
      "No. Sorceries can only be cast during your own main phase when the stack is empty. Since it's your opponent's turn, you'll have to wait.",
  },
  {
    id: 's7',
    text: "It's your first main phase and the stack is empty. You have a Sol Ring in your hand. Sol Ring is an artifact that produces mana. Can you cast it right now?",
    cardImage: 'sol-ring.jpg',
    cardImageAlt: 'Sol Ring — Artifact',
    correctAnswer: true,
    explanation:
      'Yes. Artifacts are cast during your main phase when the stack is empty, same as creatures and sorceries. Sol Ring is one of the most played artifacts in the game.',
  },
  {
    id: 's8',
    text: 'Your opponent just cast a spell and it is currently on the stack. You have a Counterspell in your hand. Counterspell is an instant that cancels another spell. Can you cast it right now to stop their spell?',
    cardImage: 'counterspell.jpg',
    cardImageAlt: 'Counterspell — Instant',
    correctAnswer: true,
    explanation:
      "Yes. Counterspell is an instant, so it can be cast at any time, including in response to your opponent's spell while it is on the stack. This is one of the most powerful things instants can do.",
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

export default function PuttingItTogether({ session: _session }) {
  const navigate = useNavigate()

  const [shuffled] = useState(() => fisherYates(SCENARIOS))
  const [queueIndex, setQueueIndex] = useState(0)
  const [seenIds, setSeenIds] = useState(new Set())
  const [phase, setPhase] = useState('question')
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const scenario = shuffled[queueIndex]
  const allSeen = seenIds.size >= SCENARIOS.length
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
    <div className="putting-together">
      <div className="putting-together__frame">
        <p className="putting-together__breadcrumb">Lesson 04 · Putting It Together</p>
        <h1 className="putting-together__heading">Let&apos;s Put It Together</h1>
        <hr className="putting-together__rule" aria-hidden="true" />

        <p className="putting-together__intro">
          Now that you know the card types and the turn structure, let&apos;s see how they connect.
          Read each scenario and decide what you would do.
        </p>

        <p className="putting-together__progress" aria-live="polite">
          {allSeen
            ? 'All scenarios completed.'
            : `Completed ${seenIds.size} of ${SCENARIOS.length} scenarios`}
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
          <div className="putting-together__prompt">
            {allSeen ? (
              <div className="putting-together__prompt-actions">
                <button
                  type="button"
                  className="putting-together__prompt-button"
                  onClick={handleComplete}
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="putting-together__prompt-actions">
                <button
                  type="button"
                  className="putting-together__prompt-button"
                  onClick={handleAnother}
                >
                  Next Scenario
                </button>
              </div>
            )}
          </div>
        )}

        <div className="putting-together__actions">
          <button
            type="button"
            className="putting-together__button putting-together__button--back"
            onClick={() => navigate('/lesson/3')}
          >
            Back
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_4} />
      </div>
    </div>
  )
}
