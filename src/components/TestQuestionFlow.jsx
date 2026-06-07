import { useCallback, useEffect, useRef, useState } from 'react'
import ProgressDots from './ProgressDots.jsx'
import QuestionCardImage from './QuestionCardImage.jsx'
import { getQuestionImage } from '../data/questionImages.js'
import '../screens/PreTest.css'

export default function TestQuestionFlow({
  testLabel,
  progressIndex,
  selectedQuestions,
  answers = {},
  setAnswer,
  onComplete,
  introNote,
  assessmentNote,
  lastButtonLabel,
  saving = false,
  onLeave,
  leaveLabel = 'Exit test',
}) {
  const frameRef = useRef(null)
  const optionRefs = useRef([])
  const shouldFocusOptionRef = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pendingSelection, setPendingSelection] = useState(null)

  const total = selectedQuestions.length
  const question = selectedQuestions[currentIndex]
  const storedAnswer = answers[question.id]
  const selectedIndex =
    pendingSelection !== null
      ? pendingSelection
      : storedAnswer !== undefined && storedAnswer !== null
        ? storedAnswer
        : null
  const isLast = currentIndex === total - 1
  const isFirst = currentIndex === 0
  const questionHeadingId = `test-question-${question.id}`
  const progressAnnouncement = `Question ${currentIndex + 1} of ${total}`
  const focusableOptionIndex = selectedIndex ?? 0

  const handleNext = useCallback(() => {
    if (saving || selectedIndex === null) return

    setAnswer(question.id, selectedIndex)

    if (isLast) {
      onComplete({ [question.id]: selectedIndex })
      return
    }

    setPendingSelection(null)
    setCurrentIndex((prev) => prev + 1)
  }, [saving, selectedIndex, question.id, setAnswer, isLast, onComplete])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    optionRefs.current = optionRefs.current.slice(0, question.options.length)
    frameRef.current?.focus({ preventScroll: true })
  }, [question.options.length, currentIndex])

  useEffect(() => {
    if (!shouldFocusOptionRef.current) return
    shouldFocusOptionRef.current = false
    optionRefs.current[focusableOptionIndex]?.focus()
  }, [focusableOptionIndex, selectedIndex])

  function handleFrameKeyDown(event) {
    if (saving || event.target.closest('.pretest__actions')) return

    const optionCount = question.options.length
    const keyNum = parseInt(event.key, 10)
    if (keyNum >= 1 && keyNum <= optionCount) {
      shouldFocusOptionRef.current = true
      setPendingSelection(keyNum - 1)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      shouldFocusOptionRef.current = true
      const base = selectedIndex ?? 0
      setPendingSelection((base + 1) % optionCount)
      return
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      shouldFocusOptionRef.current = true
      const base = selectedIndex ?? optionCount - 1
      setPendingSelection((base - 1 + optionCount) % optionCount)
      return
    }

    if (event.key === ' ' && event.target.closest('[role="radiogroup"]')) {
      event.preventDefault()
      const focusedRadio = event.target.closest('[role="radio"]')
      const focusedIndex = focusedRadio
        ? optionRefs.current.findIndex((option) => option === focusedRadio)
        : -1
      const indexToSelect = focusedIndex >= 0 ? focusedIndex : focusableOptionIndex
      shouldFocusOptionRef.current = true
      setPendingSelection(indexToSelect)
      return
    }

    if (
      event.key === 'Enter' &&
      selectedIndex !== null &&
      event.target.closest('[role="radiogroup"]')
    ) {
      event.preventDefault()
      handleNext()
    }
  }

  function handleBack() {
    if (isFirst || saving) return
    setPendingSelection(null)
    setCurrentIndex((prev) => prev - 1)
  }

  return (
    <div ref={frameRef} className="pretest__frame" tabIndex={-1} onKeyDown={handleFrameKeyDown}>
      <h1 className="pretest__title">{testLabel}</h1>
      <p className="pretest__breadcrumb" aria-live="polite" aria-atomic="true">
        {progressAnnouncement}
      </p>
      {introNote && <p className="pretest__intro-note">{introNote}</p>}
      {assessmentNote && <p className="pretest__intro-note pretest__assessment-note">{assessmentNote}</p>}
      {/* Plain text only; no inline keyword highlights during assessment. */}
      <h2 id={questionHeadingId} className="pretest__question">
        {question.question}
      </h2>
      {question.context ? (
        <p className="pretest__question-context">{question.context}</p>
      ) : null}
      {question.hasImage && (
        <QuestionCardImage
          src={getQuestionImage(question.imageKey)}
          alt={question.imageAlt}
          layout={question.imageLayout}
        />
      )}
      <div
        className="pretest__options"
        role="radiogroup"
        aria-labelledby={questionHeadingId}
        aria-required="true"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index
          return (
            <button
              key={option}
              ref={(element) => {
                optionRefs.current[index] = element
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={index === focusableOptionIndex ? 0 : -1}
              className={`pretest__option${isSelected ? ' pretest__option--selected' : ''}`}
              disabled={saving}
              onClick={() => setPendingSelection(index)}
            >
              {isSelected && (
                <span className="pretest__option-marker" aria-hidden="true">
                  ◆
                </span>
              )}
              <span className="pretest__option-key" aria-hidden="true">
                {index + 1}.
              </span>
              {option}
            </button>
          )
        })}
      </div>
      <p className="pretest__keyboard-hint">
        Press 1–{question.options.length}, arrow keys, or Space to select, Enter to continue
      </p>
      <p className="pretest__touch-hint">
        Tap an answer, then tap Next to continue.
      </p>
      <div
        className={`pretest__actions${isFirst && !onLeave ? '' : ' pretest__actions--split'}`}
        aria-busy={saving || undefined}
      >
        {!isFirst ? (
          <button
            type="button"
            className="pretest__button pretest__button--back"
            disabled={saving}
            onClick={handleBack}
          >
            Back
          </button>
        ) : onLeave ? (
          <button
            type="button"
            className="pretest__button pretest__button--back"
            disabled={saving}
            onClick={onLeave}
          >
            {leaveLabel}
          </button>
        ) : null}
        <button
          type="button"
          className="pretest__button"
          disabled={selectedIndex === null || saving}
          aria-busy={saving || undefined}
          onClick={handleNext}
        >
          {saving ? 'Saving your answers…' : isLast ? lastButtonLabel : 'Next'}
        </button>
      </div>
      <ProgressDots activeIndex={progressIndex} />
    </div>
  )
}
