import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import TestQuestionFlow from '../components/TestQuestionFlow.jsx'

export default function PreTest({ session }) {
  const navigate = useNavigate()
  const { selectedQuestions, selectQuestions, setPretestAnswer } = session

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  if (!selectedQuestions || selectedQuestions.length === 0) {
    return (
      <div className="pretest">
        <div className="pretest__frame">
          <p className="pretest__empty">No questions loaded. Return to the start and try again.</p>
          <div className="pretest__actions">
            <button type="button" className="pretest__button" onClick={() => navigate('/')}>
              Return to Welcome
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TestQuestionFlow
      testLabel="Pre-Test"
      progressIndex={PROGRESS.PRETEST}
      selectedQuestions={selectedQuestions}
      setAnswer={setPretestAnswer}
      onComplete={() => navigate('/lesson/intro')}
      firstQuestionBackPath="/intro"
      lastButtonLabel="Begin Lessons →"
    />
  )
}
