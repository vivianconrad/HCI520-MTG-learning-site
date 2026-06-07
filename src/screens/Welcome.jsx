import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import SessionRecoveryGuide from '../components/SessionRecoveryGuide.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import { useConfirm } from '../context/useConfirm.js'
import { RESET_SESSION_CONFIRM_MESSAGE, RESET_SESSION_CONFIRM_TITLE } from '../lib/lessonNav.js'
import { cardImage } from '../assets/cards/index.js'
import './Welcome.css'

const mtgOpeningImg = new URL('../assets/cards/Magic_ The Gathering-opening.png', import.meta.url)
  .href

const HERO_CARDS = [
  { src: cardImage('creature-llanowar-elves.jpg'), alt: 'Sample Magic card' },
  { src: cardImage('instant-shock.jpg'), alt: 'Sample Magic card' },
  { src: cardImage('sorcery-cultivate.jpg'), alt: 'Sample Magic card' },
  { src: cardImage('artifact-sol-ring.jpg'), alt: 'Sample Magic card' },
  { src: cardImage('enchantment-sylvan-library.webp'), alt: 'Sample Magic card' },
  { src: cardImage('planeswalker-ajani.webp'), alt: 'Sample Magic card' },
  { src: cardImage('land-forest.jpg'), alt: 'Sample Magic card' },
]

export default function Welcome({ session }) {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const { selectedQuestions, selectQuestions, questionsLoading, questionsError } = session

  useEffect(() => {
    if (selectedQuestions === null) {
      selectQuestions()
    }
  }, [selectedQuestions, selectQuestions])

  const { rowReady, rowError, verifying } = useParticipantBootstrap(session)

  const bootstrapStatusId = 'welcome-bootstrap-status'
  let bootstrapStatus = null
  if (!rowReady && !rowError) {
    if (verifying) {
      bootstrapStatus = 'Checking your saved session…'
    } else if (questionsLoading || (selectedQuestions === null && !questionsError)) {
      bootstrapStatus = 'Drawing your assessment questions…'
    } else if (!selectedQuestions?.length) {
      bootstrapStatus = null
    } else {
      bootstrapStatus = 'Registering your study session…'
    }
  }

  return (
    <PageLayout title="Welcome · Learn to Play MTG" className="welcome">
      <div className="welcome__frame">
        <p className="welcome__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="welcome__heading">Learn to Play</h1>
        <hr className="welcome__rule" aria-hidden="true" />
        <img src={mtgOpeningImg} alt="Magic: The Gathering" className="welcome__opening-image" />
        <p className="welcome__subheading">
          A beginner&apos;s guide to Magic: The Gathering. Lessons and teaching content start after
          a short pre-test.
        </p>
        <p className="welcome__flow">
          Pre-test first (before any lessons) → overview → four lessons → post-test → your results
        </p>
        <p className="welcome__duration">
          Plan for about 18–22 minutes. The pre-test records what you already know; everything after
          that is where the teaching begins.
        </p>
        <div className="welcome__hero-cards" role="group" aria-label="Decorative sample cards">
          {HERO_CARDS.map((card, index) => (
            <img
              key={card.src}
              className="welcome__hero-card"
              src={card.src}
              alt={card.alt}
              loading="lazy"
              decoding="async"
              aria-hidden={index > 0}
            />
          ))}
        </div>
        <SessionRecoveryGuide />
        {rowError ? (
          <div className="welcome__error-block" role="alert">
            <p className="welcome__error">
              Your saved session is out of date. Reset to start fresh.
            </p>
            <button
              type="button"
              className="welcome__button welcome__button--reset"
              onClick={async () => {
                if (
                  !(await confirm(RESET_SESSION_CONFIRM_MESSAGE, {
                    title: RESET_SESSION_CONFIRM_TITLE,
                  }))
                ) {
                  return
                }
                session.resetSession()
              }}
            >
              Reset session
            </button>
          </div>
        ) : null}
        {questionsError ? (
          <div className="welcome__error-block" role="alert">
            <p className="welcome__error">{questionsError}</p>
            <button
              type="button"
              className="welcome__button welcome__button--reset"
              disabled={questionsLoading}
              onClick={() => selectQuestions()}
            >
              Try again
            </button>
          </div>
        ) : null}
        {bootstrapStatus ? (
          <p id={bootstrapStatusId} className="welcome__status" aria-live="polite">
            {bootstrapStatus}
          </p>
        ) : null}
        <div className="welcome__actions">
          <button
            type="button"
            className="welcome__button"
            disabled={!rowReady}
            aria-describedby={bootstrapStatus ? bootstrapStatusId : undefined}
            onClick={() => navigate('/intro')}
          >
            Start
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.WELCOME} />
      </div>
    </PageLayout>
  )
}
