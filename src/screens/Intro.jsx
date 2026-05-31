import { useNavigate } from 'react-router-dom'
import './Intro.css'

export default function Intro({ session }) {
  const navigate = useNavigate()
  const { sessionId } = session

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
            card, the different card types, how a turn works, and how to put it all together. The
            whole thing takes about 15–20 minutes.
          </p>
          <p className="intro__paragraph">
            When you&apos;re ready, write down your session ID below. You&apos;ll need it at the
            end.
          </p>
        </div>
        <p className="intro__session">Your session ID: {sessionId}</p>
        <div className="intro__actions">
          <button type="button" className="intro__button" onClick={() => navigate('/pretest')}>
            I&apos;m Ready →
          </button>
        </div>
      </div>
    </div>
  )
}
