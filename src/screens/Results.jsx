import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import {
  TOPIC_LABELS,
  TOPIC_LESSON_PATHS,
  TOPIC_ORDER,
  buildResultsSummary,
  calculateScores,
  getImprovementMessage,
  getLoTag,
  getReviewLessonPath,
} from '../lib/scoring.js'
import { REVIEW_TOPIC_CHOICES } from '../lib/learnerChoice.js'
import { LESSON_4_PATH, PRACTICE_SCENARIO_COUNT } from '../lib/lessonConstants.js'
import answerKeys from '../data/questionAnswerKeys.js'
import { saveScreenTime } from '../lib/db.js'
import { getQuestionExplanation } from '../lib/questionExplanations.js'
import './Results.css'

function getTopicReviewPath(topicKey, selectedQuestions, pretestAnswers, posttestAnswers) {
  if (topicKey === 'LO4') return LESSON_4_PATH

  const missedQuestion = selectedQuestions.find((question) => {
    if (question.lo !== topicKey) return false
    return questionResultMeta(question, pretestAnswers, posttestAnswers).eitherWrong
  })

  if (missedQuestion) return getReviewLessonPath(missedQuestion)
  return TOPIC_LESSON_PATHS[topicKey] ?? '/what-is-mtg'
}

function questionResultMeta(question, pretestAnswers, posttestAnswers) {
  const correctIndex = answerKeys[question.id] ?? question.correctIndex
  const preIndex = pretestAnswers[question.id]
  const postIndex = posttestAnswers[question.id]
  const eitherWrong = preIndex !== correctIndex || postIndex !== correctIndex

  return {
    preIndex,
    postIndex,
    eitherWrong,
    correctIndex,
    explanation: eitherWrong ? getQuestionExplanation(question) : null,
  }
}

function AnswerCell({ answerIndex, question, correctIndex }) {
  if (answerIndex === undefined || answerIndex === null) {
    return (
      <span className="results__answer results__answer--missing">
        <span className="results__answer-status">No answer</span>
      </span>
    )
  }

  const isCorrect = answerIndex === correctIndex
  const text = question.options[answerIndex]
  const status = isCorrect ? 'Correct' : 'Incorrect'

  return (
    <span
      className={`results__answer${isCorrect ? ' results__answer--correct' : ' results__answer--wrong'}`}
    >
      <span className="results__answer-status">{status}:</span>
      <span className="results__answer-marker" aria-hidden="true">
        {isCorrect ? '◆' : '×'}
      </span>
      <span className="results__answer-text">{text}</span>
    </span>
  )
}

export default function Results({ session }) {
  const navigate = useNavigate()
  const {
    sessionId,
    sessionSecret,
    selectedQuestions,
    pretestAnswers,
    posttestAnswers,
    scenariosAttempted,
    screenTimes,
    resetSession,
  } = session
  const [copiedSummary, setCopiedSummary] = useState(false)
  const screenTimeFlushed = useRef(false)

  useEffect(() => {
    if (screenTimeFlushed.current || !sessionId || !sessionSecret) return
    screenTimeFlushed.current = true
    saveScreenTime(sessionId, sessionSecret, screenTimes)
  }, [sessionId, sessionSecret, screenTimes])

  const hasTestData =
    selectedQuestions &&
    selectedQuestions.length > 0 &&
    Object.keys(pretestAnswers).length > 0 &&
    Object.keys(posttestAnswers).length > 0

  const scores = useMemo(() => {
    if (!hasTestData) return null
    return calculateScores(selectedQuestions, pretestAnswers, posttestAnswers, answerKeys)
  }, [hasTestData, selectedQuestions, pretestAnswers, posttestAnswers])

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

  if (!hasTestData || !scores) {
    return (
      <PageLayout title="Results · Learn to Play MTG" className="results">
        <div className="results__frame">
          <h1 className="results__empty">Results unavailable</h1>
          <p className="results__empty">
            No test data found. Please complete the pre-test and post-test first.
          </p>
          <button type="button" className="results__empty-button" onClick={() => navigate('/')}>
            Return to Welcome
          </button>
        </div>
      </PageLayout>
    )
  }

  const improvement = getImprovementMessage(scores.pretestCorrect, scores.posttestCorrect)
  const practiceIncomplete = scenariosAttempted < PRACTICE_SCENARIO_COUNT

  return (
    <PageLayout title="Your Results · Learn to Play MTG" className="results">
      <div className="results__frame">
        <p className="results__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="results__heading">Your Results</h1>
        <hr className="results__rule" aria-hidden="true" />
        <CopySessionId sessionId={sessionId} className="results__session-id" />

        <section className="results__overall">
          <div className="results__metrics">
            <div className="results__metric">
              <span className="results__metric-label">Pre-Test</span>
              <span className="results__metric-score">
                {scores.pretestCorrect} / {selectedQuestions.length}
              </span>
            </div>
            <div className="results__metric">
              <span className="results__metric-label">Post-Test</span>
              <span className="results__metric-score">
                {scores.posttestCorrect} / {selectedQuestions.length}
              </span>
            </div>
          </div>
          <p className={improvement.className}>{improvement.text}</p>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <section className="results__lo-section" aria-label="Score by topic">
          <h2 className="results__subheading">Breakdown by topic</h2>
          <div className="results__lo-rows">
            {TOPIC_ORDER.map((topicKey) => {
              const { pre, post } = scores.loScores[topicKey]
              const tag = getLoTag(pre, post)
              const needsReview = post < pre || (post < 2 && post <= pre)
              return (
                <div key={topicKey} className="results__lo-row">
                  <span className="results__lo-label">{TOPIC_LABELS[topicKey]}</span>
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
                      onClick={() =>
                        navigate(
                          getTopicReviewPath(
                            topicKey,
                            selectedQuestions,
                            pretestAnswers,
                            posttestAnswers
                          )
                        )
                      }
                    >
                      {topicKey === 'LO4' ? 'Review scenarios' : 'Review lesson'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {practiceIncomplete && (
          <>
            <hr className="results__divider" aria-hidden="true" />
            <section className="results__practice-section">
              <h2 className="results__subheading">Lesson 4 practice</h2>
              <p className="results__practice-note">
                You completed {scenariosAttempted} of {PRACTICE_SCENARIO_COUNT} optional scenarios
                in Putting It Together. You can revisit the rest anytime.
              </p>
              <button
                type="button"
                className="results__review-link results__review-link--standalone"
                onClick={() => navigate(LESSON_4_PATH)}
              >
                Review Putting It Together
              </button>
            </section>
          </>
        )}

        <hr className="results__divider" aria-hidden="true" />

        <section className="results__review-pick" aria-label="Choose a topic to review">
          <h2 className="results__subheading">Which topic do you want to revisit first?</h2>
          <p className="results__review-pick-note">
            Pick where to start reviewing. You can visit any lesson from the breakdown below
            afterward.
          </p>
          <div className="results__review-pick-options">
            {REVIEW_TOPIC_CHOICES.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="results__review-pick-btn"
                onClick={() => navigate(topic.path)}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </section>

        <hr className="results__divider" aria-hidden="true" />

        <section className="results__questions-section">
          <h2 className="results__subheading">Question by Question</h2>
          <table className="results__question-table results__question-table--desktop">
            <caption className="visually-hidden">
              Pre-test and post-test answers for each question
            </caption>
            <thead>
              <tr className="results__question-header">
                <th
                  scope="col"
                  className="results__question-header-cell results__question-header-cell--num"
                />
                <th
                  scope="col"
                  className="results__question-header-cell results__question-header-cell--question"
                >
                  Question
                </th>
                <th scope="col" className="results__question-header-cell">
                  Pre-Test
                </th>
                <th scope="col" className="results__question-header-cell">
                  Post-Test
                </th>
                <th
                  scope="col"
                  className="results__question-header-cell results__question-header-cell--answer"
                >
                  Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedQuestions.map((question, index) => {
                const { preIndex, postIndex, eitherWrong, explanation, correctIndex } =
                  questionResultMeta(question, pretestAnswers, posttestAnswers)

                return (
                  <tr
                    key={question.id}
                    className={`results__question-row${index % 2 === 0 ? ' results__question-row--odd' : ' results__question-row--even'}`}
                  >
                    <th scope="row" className="results__question-num">
                      Q{index + 1}
                    </th>
                    <td className="results__question-text" title={question.question}>
                      {question.question}
                      {explanation ? (
                        <p className="results__question-explanation">{explanation}</p>
                      ) : null}
                    </td>
                    <td>
                      <AnswerCell
                        answerIndex={preIndex}
                        question={question}
                        correctIndex={correctIndex}
                      />
                    </td>
                    <td>
                      <AnswerCell
                        answerIndex={postIndex}
                        question={question}
                        correctIndex={correctIndex}
                      />
                    </td>
                    <td>
                      {eitherWrong ? (
                        <span className="results__question-review-cell">
                          <span className="results__correct-tag">
                            Correct: {question.options[correctIndex]}
                          </span>
                          <button
                            type="button"
                            className="results__review-link"
                            onClick={() => navigate(getReviewLessonPath(question))}
                          >
                            Review lesson
                          </button>
                        </span>
                      ) : (
                        <span className="results__correct-tag results__correct-tag--empty">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="results__question-cards results__question-cards--mobile">
            {selectedQuestions.map((question, index) => {
              const { preIndex, postIndex, eitherWrong, explanation, correctIndex } =
                questionResultMeta(question, pretestAnswers, posttestAnswers)

              return (
                <article key={question.id} className="results__question-card">
                  <p className="results__question-card-num">Question {index + 1}</p>
                  <p className="results__question-card-text">{question.question}</p>
                  {explanation ? (
                    <p className="results__question-explanation">{explanation}</p>
                  ) : null}
                  <div className="results__question-card-answers">
                    <div>
                      <span className="results__question-card-label">Pre-Test</span>
                      <AnswerCell
                        answerIndex={preIndex}
                        question={question}
                        correctIndex={correctIndex}
                      />
                    </div>
                    <div>
                      <span className="results__question-card-label">Post-Test</span>
                      <AnswerCell
                        answerIndex={postIndex}
                        question={question}
                        correctIndex={correctIndex}
                      />
                    </div>
                  </div>
                  {eitherWrong && (
                    <>
                      <p className="results__question-card-correct">
                        Correct: {question.options[correctIndex]}
                      </p>
                      <button
                        type="button"
                        className="results__review-link results__review-link--standalone"
                        onClick={() => navigate(getReviewLessonPath(question))}
                      >
                        Review lesson
                      </button>
                    </>
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
          <button
            type="button"
            className="results__action-button results__action-button--muted"
            onClick={resetSession}
          >
            Start over
          </button>
        </div>

        <ProgressDots activeIndex={PROGRESS.RESULTS} />
      </div>
    </PageLayout>
  )
}
