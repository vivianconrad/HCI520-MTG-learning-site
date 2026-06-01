import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CopySessionId from '../components/CopySessionId.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import { createParticipantRow } from '../lib/db.js'
import './Intro.css'

export default function Intro({ session }) {
  const navigate = useNavigate()
  const { sessionId, selectedQuestions, participantId, setParticipantId } = session
  const creatingRef = useRef(false)

  useEffect(() => {
    if (participantId || !selectedQuestions?.length || creatingRef.current) return

    creatingRef.current = true
    createParticipantRow(sessionId, selectedQuestions).then((id) => {
      if (id) setParticipantId(id)
    })
  }, [participantId, selectedQuestions, sessionId, setParticipantId])

  return (
    <div className="intro">
      <div className="intro__frame">
        <p className="intro__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="intro__heading">Before We Begin</h1>
        <hr className="intro__rule" aria-hidden="true" />
        <div className="intro__body">
          <p className="intro__paragraph">
            We&apos;ll start with a few quick questions about Magic: The Gathering. Don&apos;t worry
            if you don&apos;t know the answers. That&apos;s exactly the point. These questions help
            us understand what you already know before you go through the lessons.
          </p>
          <p className="intro__paragraph">
            After the questions, you&apos;ll work through four short lessons covering how to read a
            card, the different card types, how a turn works, and how to put it all together.
          </p>
          <p className="intro__paragraph">
            When you&apos;re ready, copy your session ID below. You&apos;ll need it at the end.
          </p>
        </div>
        <CopySessionId sessionId={sessionId} className="intro__session" />
        <div className="intro__actions intro__actions--split">
          <button
            type="button"
            className="intro__button intro__button--back"
            onClick={() => navigate('/welcome')}
          >
            Back
          </button>
          <button type="button" className="intro__button" onClick={() => navigate('/pretest')}>
            I&apos;m Ready
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.INTRO} />
      </div>
    </div>
  )
}
