import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import SessionRecoveryGuide from '../components/SessionRecoveryGuide.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import { cardImage } from '../assets/cards/index.js'
import './Welcome.css'

const mtgOpeningImg = new URL('../assets/cards/Magic_ The Gathering-opening.png', import.meta.url)
  .href

const HERO_CARDS = [
  {
    src: cardImage('creature-llanowar-elves.jpg'),
    alt: 'Llanowar Elves creature card',
  },
  {
    src: cardImage('instant-shock.jpg'),
    alt: 'Shock instant card',
  },
  {
    src: cardImage('sorcery-cultivate.jpg'),
    alt: 'Cultivate sorcery card',
  },
  {
    src: cardImage('artifact-sol-ring.jpg'),
    alt: 'Sol Ring artifact card',
  },
  {
    src: cardImage('enchantment-sylvan-library.webp'),
    alt: 'Sylvan Library enchantment card',
  },
  {
    src: cardImage('planeswalker-ajani.webp'),
    alt: 'Ajani planeswalker card',
  },
  {
    src: cardImage('land-forest.jpg'),
    alt: 'Forest land card',
  },
]

export default function Welcome({ session }) {
  const navigate = useNavigate()
  const { selectedQuestions, selectQuestions } = session

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
    } else if (!selectedQuestions?.length) {
      bootstrapStatus = 'Drawing your assessment questions…'
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
          A quick guide to reading cards, understanding card types, and taking your first turn.
        </p>
        <p className="welcome__flow">
          Pre-test → overview → four lessons → post-test → your results
        </p>
        <p className="welcome__duration">
          Plan for about 18–22 minutes. You&apos;ll pick up rules vocabulary, how a turn works, and
          what to do when you sit down for your first game. A friend at the table can help with the
          rest.
        </p>
        <div className="welcome__hero-cards" role="group" aria-label="Sample Magic cards">
          {HERO_CARDS.map((card) => (
            <img key={card.alt} className="welcome__hero-card" src={card.src} alt={card.alt} />
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
              onClick={() => session.resetSession()}
            >
              Reset session
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
