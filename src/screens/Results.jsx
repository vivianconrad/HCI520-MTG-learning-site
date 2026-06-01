import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './Results.css'

const LO_LABELS = {
  LO1: 'Card Components',
  LO2: 'Turn Order',
  LO3: 'Phase Actions',
  LO4: 'Card Timing',
}

const LO_ORDER = ['LO1', 'LO2', 'LO3', 'LO4']

function calculateScores(selectedQuestions, pretestAnswers, posttestAnswers) {
  let pretestCorrect = 0
  let posttestCorrect = 0
  const loScores = Object.fromEntries(
    LO_ORDER.map((lo) => [lo, { pre: 0, post: 0 }]),
  )

  for (const question of selectedQuestions) {
    const preIndex = pretestAnswers[question.id]
    const postIndex = posttestAnswers[question.id]

    if (preIndex === question.correctIndex) {
      pretestCorrect += 1
      loScores[question.lo].pre += 1
    }

    if (postIndex === question.correctIndex) {
      posttestCorrect += 1
      loScores[question.lo].post += 1
    }
  }

  return { pretestCorrect, posttestCorrect, loScores }
}

function getLoTag(pre, post) {
  if (post > pre) return { label: 'Improved', className: 'results__lo-tag--improved' }
  if (post < pre) return { label: 'Declined', className: 'results__lo-tag--declined' }
  return { label: 'Same', className: 'results__lo-tag--same' }
}

function getImprovementMessage(pretestCorrect, posttestCorrect) {
  if (posttestCorrect > pretestCorrect) {
    const diff = posttestCorrect - pretestCorrect
    const unit = diff === 1 ? 'point' : 'points'
    return {
      text: `You improved by ${diff} ${unit}. Great work.`,
      className: 'results__improvement results__improvement--positive',
    }
  }

  if (posttestCorrect === pretestCorrect) {
    return {
      text: 'Your score stayed the same.',
      className: 'results__improvement results__improvement--neutral',
    }
  }

  return {
    text: 'Your score changed. That happens.',
    className: 'results__improvement results__improvement--neutral',
  }
}

function AnswerCell({ answerIndex, question }) {
  if (answerIndex === undefined || answerIndex === null) {
    return <span className="results__answer results__answer--missing">—</span>
  }

  const isCorrect = answerIndex === question.correctIndex
  const text = question.options[answerIndex]

  return (
    <span
      className={`results__answer${isCorrect ? ' results__answer--correct' : ' results__answer--wrong'}`}
    >
      <span className="results__answer-marker" aria-hidden="true">
        {isCorrect ? '◆' : '×'}
      </span>
      {text}
    </span>
  )
}

export default function Results({ session }) {
  const navigate = useNavigate()
  const { sessionId, selectedQuestions, pretestAnswers, posttestAnswers } = session

  const hasTestData =
    selectedQuestions &&
    selectedQuestions.length > 0 &&
    Object.keys(pretestAnswers).length > 0 &&
    Object.keys(posttestAnswers).length > 0

  const scores = useMemo(() => {
    if (!hasTestData) return null
    return calculateScores(selectedQuestions, pretestAnswers, posttestAnswers)
  }, [hasTestData, selectedQuestions, pretestAnswers, posttestAnswers])

  if (!hasTestData || !scores) {
    return (
      <div className="results">
        <div className="results__frame">
          <p className="results__empty">
            No test data found. Please complete the pre-test and post-test first.
          </p>
          <button type="button" className="results__empty-button" onClick={() => navigate('/')}>
            Return to Welcome
          </button>
        </div>
      </div>
    )
  }

  const improvement = getImprovementMessage(scores.pretestCorrect, scores.posttestCorrect)

  return (
    <div className="results">
      <div className="results__frame">
        <p className="results__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="results__heading">Your Results</h1>
        <hr className="results__rule" aria-hidden="true" />
        <p className="results__session-id">Session ID: {sessionId}</p>

        <section className="results__overall">
          <div className="results__metrics">
            <div className="results__metric">
              <span className="results__metric-label">Pre-Test</span>
              <span className="results__metric-score">{scores.pretestCorrect} / 8</span>
            </div>
            <div className="results__metric">
              <span className="results__metric-label">Post-Test</span>
              <span className="results__metric-score">{scores.posttestCorrect} / 8</span>
            </div>
          </div>
          <p className={improvement.className}>{improvement.text}</p>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <section className="results__lo-section">
          <h2 className="results__subheading">Breakdown by Learning Objective</h2>
          <div className="results__lo-rows">
            {LO_ORDER.map((lo) => {
              const { pre, post } = scores.loScores[lo]
              const tag = getLoTag(pre, post)
              return (
                <div key={lo} className="results__lo-row">
                  <span className="results__lo-label">{LO_LABELS[lo]}</span>
                  <span className="results__lo-pre">{pre} / 2</span>
                  <div className="results__lo-bar" aria-hidden="true">
                    <div
                      className="results__lo-bar-fill"
                      style={{ width: `${(post / 2) * 100}%` }}
                    />
                  </div>
                  <span className="results__lo-post">{post} / 2</span>
                  <span className={`results__lo-tag ${tag.className}`}>{tag.label}</span>
                </div>
              )
            })}
          </div>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <section className="results__questions-section">
          <h2 className="results__subheading">Question by Question</h2>
          <div className="results__question-table">
            <div className="results__question-header">
              <span className="results__question-header-cell results__question-header-cell--num" />
              <span className="results__question-header-cell results__question-header-cell--question">
                Question
              </span>
              <span className="results__question-header-cell">Pre-Test</span>
              <span className="results__question-header-cell">Post-Test</span>
              <span className="results__question-header-cell results__question-header-cell--answer">
                Answer
              </span>
            </div>
            {selectedQuestions.map((question, index) => {
              const preIndex = pretestAnswers[question.id]
              const postIndex = posttestAnswers[question.id]
              const eitherWrong =
                preIndex !== question.correctIndex || postIndex !== question.correctIndex

              return (
                <div
                  key={question.id}
                  className={`results__question-row${index % 2 === 0 ? ' results__question-row--odd' : ' results__question-row--even'}`}
                >
                  <span className="results__question-num">Q{index + 1}</span>
                  <span className="results__question-text" title={question.question}>
                    {question.question}
                  </span>
                  <AnswerCell answerIndex={preIndex} question={question} />
                  <AnswerCell answerIndex={postIndex} question={question} />
                  {eitherWrong ? (
                    <span className="results__correct-tag">
                      Correct: {question.options[question.correctIndex]}
                    </span>
                  ) : (
                    <span className="results__correct-tag results__correct-tag--empty" />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <p className="results__footer">
          Thank you for completing this lesson. Write down your session ID above if you
          haven&apos;t already.
        </p>
      </div>
    </div>
  )
}
