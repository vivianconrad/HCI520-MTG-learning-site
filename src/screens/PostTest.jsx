import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import QuestionCardImage from '../components/QuestionCardImage.jsx'
import { getQuestionImage } from '../data/questionImages.js'
import './PreTest.css'

export default function PostTest({ session }) {
  const navigate = useNavigate()
  const { selectedQuestions, setPosttestAnswer } = session
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return null
  }

  const question = selectedQuestions[currentIndex]
  const total = selectedQuestions.length
  const isLast = currentIndex === total - 1

  function handleNext() {
    if (selectedIndex === null) return

    setPosttestAnswer(question.id, selectedIndex)

    if (isLast) {
      navigate('/calculating')
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedIndex(null)
  }

  return (
    <div className="pretest">
      <div className="pretest__frame">
        <p className="pretest__breadcrumb">
          Post-Test · Question {currentIndex + 1} of {total}
        </p>
        <p className="pretest__question">{question.question}</p>
        {question.hasImage && (
          <QuestionCardImage
            src={getQuestionImage(question.imageKey)}
            alt={question.imageAlt}
          />
        )}
        <div className="pretest__options">
          {question.options.map((option, index) => {
            const isSelected = selectedIndex === index
            return (
              <button
                key={option}
                type="button"
                className={`pretest__option${isSelected ? ' pretest__option--selected' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                {isSelected && (
                  <span className="pretest__option-marker" aria-hidden="true">
                    ◆
                  </span>
                )}
                {option}
              </button>
            )
          })}
        </div>
        <div className="pretest__actions">
          <button
            type="button"
            className="pretest__button"
            disabled={selectedIndex === null}
            onClick={handleNext}
          >
            {isLast ? 'Submit →' : 'Next'}
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.POSTTEST} />
      </div>
    </div>
  )
}
