import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './Consent.css'

export default function Consent() {
  const navigate = useNavigate()

  return (
    <div className="consent">
      <div className="consent__frame">
        <p className="consent__breadcrumb">Magic: The Gathering · HCI 520 Research Study</p>
        <h1 className="consent__heading">Before You Begin</h1>
        <hr className="consent__rule" aria-hidden="true" />

        <div className="consent__body">
          <p className="consent__paragraph consent__paragraph--lead">
            This is an e-learning system built as part of a graduate course project in
            Human-Computer Interaction at DePaul University. The goal is to measure
            whether the system helps new players learn the basics of Magic: The Gathering.
          </p>

          <section className="consent__section">
            <h2 className="consent__section-heading">What this involves:</h2>
            <ul className="consent__list">
              <li>A short pre-test before the lessons (about 2 minutes)</li>
              <li>
                Four interactive lessons covering card anatomy, card types, turn structure, and
                gameplay scenarios (about 15 minutes)
              </li>
              <li>
                The same pre-test again after the lessons to measure what you learned (about 2
                minutes)
              </li>
            </ul>
          </section>

          <section className="consent__section">
            <h2 className="consent__section-heading">What you should know:</h2>
            <ul className="consent__list">
              <li>
                Participation is completely voluntary. You can stop at any time by closing the tab.
              </li>
              <li>
                No personally identifiable information is collected. You are assigned an anonymous
                session ID.
              </li>
              <li>
                Your responses are stored securely and will only be used for this class project.
              </li>
              <li>
                This study has not been submitted for formal IRB review as it qualifies as exempt
                educational research.
              </li>
            </ul>
          </section>
        </div>

        <p className="consent__closing">
          By clicking &apos;I Agree and Continue&apos;, you confirm that you have read this
          information and agree to participate.
        </p>

        <div className="consent__actions">
          <button
            type="button"
            className="consent__button"
            onClick={() => navigate('/welcome')}
          >
            I Agree and Continue →
          </button>
        </div>

        <ProgressDots activeIndex={PROGRESS.CONSENT} />
      </div>
    </div>
  )
}
