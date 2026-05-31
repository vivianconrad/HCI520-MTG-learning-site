import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './Welcome.css'

export default function Welcome({ session }) {
  const navigate = useNavigate()
  const { sessionId, selectedQuestions, selectQuestions } = session

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  return (
    <div className="welcome">
      <div className="welcome__frame">
        <p className="welcome__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="welcome__heading">Learn to Play</h1>
        <hr className="welcome__rule" aria-hidden="true" />
        <p className="welcome__subheading">
          A quick guide to reading cards, understanding card types, and taking your first turn.
        </p>
        <p className="welcome__duration">
          This guide takes about 15–20 minutes. At the end, you&apos;ll know enough to sit down and
          play.
        </p>
        <p className="welcome__session">Your session ID: {sessionId}</p>
        <div className="welcome__actions">
          <button type="button" className="welcome__button" onClick={() => navigate('/intro')}>
            Start →
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.WELCOME} />
      </div>
    </div>
  )
}
