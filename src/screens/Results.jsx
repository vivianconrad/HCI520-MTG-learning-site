import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import {
  LO_LABELS,
  LO_LESSON_PATHS,
  LO_ORDER,
  buildResultsSummary,
  calculateScores,
  getImprovementMessage,
  getLoTag,
} from '../lib/scoring.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { submitLearningSession } from '../lib/submitSession.js'
import './Results.css'

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
  const {
    sessionId,
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    resetSession,
    resultsSubmitted,
    markResultsSubmitted,
  } = session
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(
    resultsSubmitted ? 'saved' : 'pending',
  )

  const hasTestData =
    selectedQuestions &&
    selectedQuestions.length > 0 &&
    Object.keys(pretestAnswers).length > 0 &&
    Object.keys(posttestAnswers).length > 0

  const scores = useMemo(() => {
    if (!hasTestData) return null
    return calculateScores(selectedQuestions, pretestAnswers, posttestAnswers)
  }, [hasTestData, selectedQuestions, pretestAnswers, posttestAnswers])

  useEffect(() => {
    if (!hasTestData || resultsSubmitted) return

    let cancelled = false

    async function runSubmit() {
      setSubmitStatus('saving')
      const result = await submitLearningSession({
        sessionId,
        selectedQuestions,
        pretestAnswers,
        posttestAnswers,
      })

      if (cancelled) return

      if (result.skipped) {
        setSubmitStatus('skipped')
        return
      }

      if (result.ok) {
        markResultsSubmitted()
        setSubmitStatus('saved')
        return
      }

      setSubmitStatus('error')
    }

    runSubmit()

    return () => {
      cancelled = true
    }
  }, [
    hasTestData,
    resultsSubmitted,
    sessionId,
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    markResultsSubmitted,
  ])

  async function handleCopySummary() {
    if (!scores) return
    const summary = buildResultsSummary(sessionId, scores, selectedQuestions)
    try {
      await navigator.clipboard.writeText(summary)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = summary
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedSummary(true)
    window.setTimeout(() => setCopiedSummary(false), 2000)
  }

  async function handleRetrySubmit() {
    setSubmitStatus('saving')
    const result = await submitLearningSession({
      sessionId,
      selectedQuestions,
      pretestAnswers,
      posttestAnswers,
    })
    if (result.ok) {
      markResultsSubmitted()
      setSubmitStatus('saved')
    } else {
      setSubmitStatus('error')
    }
  }

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
        <CopySessionId sessionId={sessionId} className="results__session-id" />

        {isSupabaseConfigured() && (
          <div
            className={`results__submit-banner results__submit-banner--${submitStatus}`}
            role="status"
            aria-live="polite"
          >
            {submitStatus === 'pending' || submitStatus === 'saving' ? (
              <span>Saving your results for the instructor…</span>
            ) : null}
            {submitStatus === 'saved' ? (
              <span>Your results were saved. You can still copy your session ID below.</span>
            ) : null}
            {submitStatus === 'skipped' ? (
              <span>Results are stored only in this browser (Supabase not configured).</span>
            ) : null}
            {submitStatus === 'error' ? (
              <span>
                We could not save your results.{' '}
                <button type="button" className="results__submit-retry" onClick={handleRetrySubmit}>
                  Try again
                </button>
              </span>
            ) : null}
          </div>
        )}

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
              const needsReview = post < pre || (post < 2 && post <= pre)
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
                  {needsReview && (
                    <button
                      type="button"
                      className="results__review-link"
                      onClick={() => navigate(LO_LESSON_PATHS[lo])}
                    >
                      Review lesson →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <section className="results__questions-section">
          <h2 className="results__subheading">Question by Question</h2>
          <div className="results__question-table results__question-table--desktop">
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

          <div className="results__question-cards results__question-cards--mobile">
            {selectedQuestions.map((question, index) => {
              const preIndex = pretestAnswers[question.id]
              const postIndex = posttestAnswers[question.id]
              const eitherWrong =
                preIndex !== question.correctIndex || postIndex !== question.correctIndex

              return (
                <article key={question.id} className="results__question-card">
                  <p className="results__question-card-num">Question {index + 1}</p>
                  <p className="results__question-card-text">{question.question}</p>
                  <div className="results__question-card-answers">
                    <div>
                      <span className="results__question-card-label">Pre-Test</span>
                      <AnswerCell answerIndex={preIndex} question={question} />
                    </div>
                    <div>
                      <span className="results__question-card-label">Post-Test</span>
                      <AnswerCell answerIndex={postIndex} question={question} />
                    </div>
                  </div>
                  {eitherWrong && (
                    <p className="results__question-card-correct">
                      Correct: {question.options[question.correctIndex]}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <p className="results__footer">
          Thank you for completing this lesson. Copy your session ID if you need it for reference.
        </p>

        <div className="results__actions">
          <button type="button" className="results__action-button" onClick={handleCopySummary}>
            {copiedSummary ? 'Summary copied!' : 'Copy results summary'}
          </button>
          <button type="button" className="results__action-button results__action-button--muted" onClick={resetSession}>
            Start over
          </button>
        </div>

        <ProgressDots activeIndex={PROGRESS.RESULTS} />
      </div>
    </div>
  )
}
