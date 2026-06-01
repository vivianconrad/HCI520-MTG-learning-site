import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from '../context/ConfirmContext.jsx'
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
  introNote,
  lastButtonLabel,
}) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const total = selectedQuestions.length
  const question = selectedQuestions[currentIndex]
  const isLast = currentIndex === total - 1
  const isFirst = currentIndex === 0

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
    function handleKeyDown(event) {
      const keyNum = parseInt(event.key, 10)
      if (keyNum >= 1 && keyNum <= question.options.length) {
        setSelectedIndex(keyNum - 1)
        return
      }

      if (event.key === 'Enter' && selectedIndex !== null) {
        event.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question.options.length, selectedIndex, handleNext])

  async function handleBack() {
    if (isFirst) {
      if (leaveConfirmMessage && !(await confirm(leaveConfirmMessage))) return
      navigate(firstQuestionBackPath)
      return
    }
    setCurrentIndex((prev) => prev - 1)
    setSelectedIndex(null)
  }

  return (
    <div className="pretest">
      <div className="pretest__frame">
        <p className="pretest__breadcrumb">
          {testLabel} · Question {currentIndex + 1} of {total}
        </p>
        {introNote && <p className="pretest__intro-note">{introNote}</p>}
        <p className="pretest__question" aria-live="polite">
          {question.question}
        </p>
        {question.hasImage && (
          <QuestionCardImage
            src={getQuestionImage(question.imageKey)}
            alt={question.imageAlt}
          />
        )}
        <div className="pretest__options" role="listbox" aria-label="Answer choices">
          {question.options.map((option, index) => {
            const isSelected = selectedIndex === index
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
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
          Press 1–{question.options.length} to select, Enter to continue
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
    </div>
  )
}
