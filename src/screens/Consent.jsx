import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import './Consent.css'

const consentCardArt = new URL('../assets/hero.png', import.meta.url).href

const privacyNoticeUrl = `${import.meta.env.BASE_URL}privacy.md`

export default function Consent({ session }) {
  const navigate = useNavigate()
  const { markConsentGiven } = session

  return (
    <PageLayout title="Consent · Learn to Play MTG" className="consent">
      <div className="consent__frame">
        <p className="consent__breadcrumb">Magic: The Gathering · HCI 520 Research Study</p>
        <h1 className="consent__heading">Before You Begin</h1>
        <hr className="consent__rule" aria-hidden="true" />
        <img className="consent__hero-art" src={consentCardArt} alt="Magic card inspired artwork" />

        <div className="consent__body">
          <p className="consent__paragraph consent__paragraph--lead">
            This is an e-learning system built as part of a graduate course project in
            Human-Computer Interaction at DePaul University. The goal is to measure whether the
            system helps new players learn the basics of Magic: The Gathering.
          </p>

          <section className="consent__section">
            <h2 className="consent__section-heading">What this involves:</h2>
            <ul className="consent__list">
              <li>A short pre-test before any teaching (about 2 minutes)</li>
              <li>
                A brief overview and four lessons on card anatomy, card types, turn structure
                (including a sample turn walkthrough), and gameplay scenarios (about 18 minutes)
              </li>
              <li>
                The same post-test after the lessons to measure what you learned (about 2 minutes).
                It uses the same questions as the pre-test.
              </li>
            </ul>
          </section>

          <section className="consent__section">
            <h2 className="consent__section-heading">What we store (no names or contact info):</h2>
            <ul className="consent__list">
              <li>
                An anonymous <strong>save code</strong> (session ID) generated in your browser
              </li>
              <li>Pre-test and post-test answers and scores</li>
              <li>Time spent on each screen during the lesson</li>
              <li>
                Optional learner choices (for example, which topic you wanted to explore first, and
                how ready you felt before the post-test)
              </li>
              <li>Which practice scenarios you attempted in Lesson 4</li>
            </ul>
          </section>

          <section className="consent__section">
            <h2 className="consent__section-heading">Where data is stored:</h2>
            <ul className="consent__list">
              <li>
                Research responses are saved to a secure database hosted by{' '}
                <strong>Supabase</strong> (cloud PostgreSQL). The site does not use advertising or
                analytics trackers.
              </li>
              <li>
                Closing the tab does <strong>not</strong> delete data already saved to the server.
                Clearing this browser&apos;s site data or using &quot;Start over&quot; on the results
                page only removes the copy stored in your browser.
              </li>
              <li>
                Fonts are loaded from this site (not from Google&apos;s servers) so your browser
                does not send your IP address to Google for typography.
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
                They are deleted automatically after the study retention period (see our{' '}
                <a href={privacyNoticeUrl} className="consent__link" target="_blank" rel="noopener noreferrer">
                  privacy notice
                </a>
                ).
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
            className="consent__button consent__button--decline"
            onClick={() => {
              window.close()
            }}
          >
            I do not wish to participate
          </button>
          <button
            type="button"
            className="consent__button consent__button--agree"
            onClick={() => {
              markConsentGiven()
              navigate('/welcome')
            }}
          >
            I Agree and Continue →
          </button>
        </div>
        <p className="consent__decline-note">
          If the window does not close, you can leave this page — no data is collected until you
          agree.
        </p>

        <ProgressDots activeIndex={PROGRESS.CONSENT} />
      </div>
    </PageLayout>
  )
}
