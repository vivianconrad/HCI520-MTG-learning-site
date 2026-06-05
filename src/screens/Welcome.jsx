import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import { cardImage } from '../assets/cards/index.js'
import './Welcome.css'

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

  useParticipantBootstrap(session)

  return (
    <PageLayout title="Welcome · Learn to Play MTG" className="welcome">
      <div className="welcome__frame">
        <p className="welcome__breadcrumb">Magic: The Gathering · Beginner&apos;s Guide</p>
        <h1 className="welcome__heading">Learn to Play</h1>
        <hr className="welcome__rule" aria-hidden="true" />
        <p className="welcome__subheading">
          A quick guide to reading cards, understanding card types, and taking your first turn.
        </p>
        <p className="welcome__flow">
          Pre-test → overview → four short lessons → post-test → your results
        </p>
        <p className="welcome__duration">
          Plan for about 15–20 minutes. At the end, you&apos;ll know enough to sit down and play.
        </p>
        <div className="welcome__hero-cards" aria-label="Sample Magic cards">
          {HERO_CARDS.map((card) => (
            <img key={card.alt} className="welcome__hero-card" src={card.src} alt={card.alt} />
          ))}
        </div>
        <div className="welcome__actions">
          <button type="button" className="welcome__button" onClick={() => navigate('/intro')}>
            Start
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.WELCOME} />
      </div>
    </PageLayout>
  )
}
