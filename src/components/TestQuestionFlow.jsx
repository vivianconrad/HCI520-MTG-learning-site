import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from '../context/useConfirm.js'
import ProgressDots from './ProgressDots.jsx'
import QuestionCardImage from './QuestionCardImage.jsx'
import { getQuestionImage } from '../data/questionImages.js'
import '../screens/PreTest.css'

export default function TestQuestionFlow({
  testLabel,
  progressIndex,
  selectedQuestions,
  setAnswer,
  onComplete,
  firstQuestionBackPath,
  leaveConfirmMessage,
  leaveConfirmTitle,
  introNote,
  lastButtonLabel,
}) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const optionRefs = useRef([])
  const shouldFocusOptionRef = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const total = selectedQuestions.length
  const question = selectedQuestions[currentIndex]
  const isLast = currentIndex === total - 1
  const isFirst = currentIndex === 0
  const questionHeadingId = `test-question-${question.id}`
  const progressAnnouncement = `${testLabel} · Question ${currentIndex + 1} of ${total}`
  const focusableOptionIndex = selectedIndex ?? 0

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return

    setAnswer(question.id, selectedIndex)

    if (isLast) {
      onComplete({ [question.id]: selectedIndex })
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedIndex(null)
  }, [selectedIndex, question.id, setAnswer, isLast, onComplete])

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, question.options.length)
  }, [question.options.length, currentIndex])

  useEffect(() => {
    if (!shouldFocusOptionRef.current) return
    shouldFocusOptionRef.current = false
    optionRefs.current[focusableOptionIndex]?.focus()
  }, [focusableOptionIndex, selectedIndex])

  function handleFrameKeyDown(event) {
    if (event.target.closest('.pretest__actions')) return

    const optionCount = question.options.length
    const keyNum = parseInt(event.key, 10)
    if (keyNum >= 1 && keyNum <= optionCount) {
      shouldFocusOptionRef.current = true
      setSelectedIndex(keyNum - 1)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      shouldFocusOptionRef.current = true
      setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % optionCount))
      return
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      shouldFocusOptionRef.current = true
      setSelectedIndex((prev) =>
        prev === null ? optionCount - 1 : (prev - 1 + optionCount) % optionCount,
      )
      return
    }

    if (event.key === 'Enter' && selectedIndex !== null && event.target.closest('[role="radiogroup"]')) {
      event.preventDefault()
      handleNext()
    }
  }

  async function handleBack() {
    if (isFirst) {
      if (
        leaveConfirmMessage &&
        !(await confirm(leaveConfirmMessage, { title: leaveConfirmTitle }))
      ) {
        return
      }
      navigate(firstQuestionBackPath)
      return
    }
    setCurrentIndex((prev) => prev - 1)
    setSelectedIndex(null)
  }

  return (
    <div className="pretest__frame" onKeyDown={handleFrameKeyDown}>
      <p className="pretest__breadcrumb" aria-live="polite" aria-atomic="true">
        {progressAnnouncement}
      </p>
      {introNote && <p className="pretest__intro-note">{introNote}</p>}
      {/* Plain text only — no inline keyword highlights during assessment. */}
      <p id={questionHeadingId} className="pretest__question">
        {question.question}
      </p>
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
              onClick={() => setSelectedIndex(index)}
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
        Press 1–{question.options.length} or arrow keys to select, Enter to continue
      </p>
      <div className="pretest__actions pretest__actions--split">
        <button
          type="button"
          className="pretest__button pretest__button--back"
          onClick={handleBack}
          title={isFirst && leaveConfirmMessage ? 'Leave the test' : undefined}
        >
          {isFirst && leaveConfirmMessage ? 'Leave test' : 'Back'}
        </button>
        <button
          type="button"
          className="pretest__button"
          disabled={selectedIndex === null}
          onClick={handleNext}
        >
          {isLast ? lastButtonLabel : 'Next'}
        </button>
      </div>
      <ProgressDots activeIndex={progressIndex} />
    </div>
  )
}
