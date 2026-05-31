import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './PuttingItTogether.css'

const SCENARIOS = [
  {
    text: "It's your main phase. You have a Shock in your hand. Shock is an instant that deals 2 damage and costs one red mana. You have one mountain on the battlefield. Can you play it right now?",
    correctAnswer: true,
    explanation:
      'Yes. Shock is an instant, and instants can be played any time, including your main phase. You also have exactly enough mana to cast it.',
  },
  {
    text: "It's your opponent's turn and they just attacked you with a creature. You have a Giant Growth in your hand. Giant Growth is an instant that gives a creature +3/+3. Can you play it right now to boost your blocker?",
    correctAnswer: true,
    explanation:
      "Yes. Giant Growth is an instant, which means you can play it at any time, including on your opponent's turn during combat. This is exactly what instants are designed for.",
  },
  {
    text: "It's your first main phase. You have a Llanowar Elves in your hand. Llanowar Elves is a creature that costs one green mana. You have one forest land on the battlefield. Can you play Llanowar Elves right now?",
    correctAnswer: true,
    explanation:
      'Yes. Creatures are played during your main phase, and you have exactly one green mana available from your forest. Llanowar Elves costs one green mana, so you can cast it.',
  },
]

export default function PuttingItTogether({ session }) {
  void session
  const navigate = useNavigate()
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [phase, setPhase] = useState('question')
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const scenario = SCENARIOS[scenarioIndex]
  const isLastScenario = scenarioIndex === SCENARIOS.length - 1
  const isCorrect = selectedAnswer === scenario.correctAnswer

  function handleAnswer(answer) {
    if (phase !== 'question') return
    setSelectedAnswer(answer)
    setPhase('prompt')
  }

  function handleAnother() {
    setScenarioIndex((prev) => prev + 1)
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

        <div className="putting-together__scenario">
          <p className="putting-together__scenario-text">{scenario.text}</p>
        </div>

        <div className="putting-together__answers">
          <button
            type="button"
            className={`putting-together__answer${selectedAnswer === true ? ' putting-together__answer--selected' : ''}`}
            disabled={phase !== 'question'}
            onClick={() => handleAnswer(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`putting-together__answer${selectedAnswer === false ? ' putting-together__answer--selected' : ''}`}
            disabled={phase !== 'question'}
            onClick={() => handleAnswer(false)}
          >
            No
          </button>
        </div>

        {phase !== 'question' && (
          <div className="putting-together__feedback">
            <span
              className={`putting-together__feedback-marker${isCorrect ? ' putting-together__feedback-marker--correct' : ' putting-together__feedback-marker--incorrect'}`}
              aria-hidden="true"
            >
              {isCorrect ? '◆' : '×'}
            </span>
            <span>{scenario.explanation}</span>
          </div>
        )}

        {phase === 'prompt' && (
          <div className="putting-together__prompt">
            {isLastScenario ? (
              <div className="putting-together__prompt-actions">
                <button
                  type="button"
                  className="putting-together__prompt-button"
                  onClick={handleComplete}
                >
                  Continue →
                </button>
              </div>
            ) : (
              <>
                <p className="putting-together__prompt-text">Want to try another scenario?</p>
                <div className="putting-together__prompt-actions">
                  <button
                    type="button"
                    className="putting-together__prompt-button"
                    onClick={handleAnother}
                  >
                    Yes, give me another
                  </button>
                  <button
                    type="button"
                    className="putting-together__prompt-button putting-together__prompt-button--muted"
                    onClick={handleComplete}
                  >
                    No, go to results
                  </button>
                </div>
              </>
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
