import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PreTest.css'

export default function PreTest({ session }) {
  const navigate = useNavigate()
  const { selectedQuestions, selectQuestions, setPretestAnswer } = session
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return null
  }

  const question = selectedQuestions[currentIndex]
  const total = selectedQuestions.length
  const isLast = currentIndex === total - 1

  function handleNext() {
    if (selectedIndex === null) return

    setPretestAnswer(question.id, selectedIndex)

    if (isLast) {
      navigate('/lesson/1')
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedIndex(null)
  }

  return (
    <div className="pretest">
      <div className="pretest__frame">
        <p className="pretest__breadcrumb">
          Pre-Test · Question {currentIndex + 1} of {total}
        </p>
        <p className="pretest__question">{question.question}</p>
        {question.hasImage && <div className="pretest__image-slot">Card image</div>}
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
            {isLast ? 'Begin Lessons →' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
