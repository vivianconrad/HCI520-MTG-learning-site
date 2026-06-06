import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import useParticipantBootstrap from '../hooks/useParticipantBootstrap.js'
import { cardImage } from '../assets/cards/index.js'
import './Welcome.css'

const mtgOpeningImg = new URL('../assets/cards/Magic_ The Gathering-opening.png', import.meta.url).href

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

  const { rowReady, rowError } = useParticipantBootstrap(session)

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
          Pre-test → overview → starting a game → four lessons → post-test → your results
        </p>
        <p className="welcome__duration">
          Plan for about 18–22 minutes. You&apos;ll learn the rules vocabulary, how a turn works, and
          what to do when you sit down for your first game — with a friend at the table to fill in
          the rest.
        </p>
        <div className="welcome__hero-cards" aria-label="Sample Magic cards">
          {HERO_CARDS.map((card) => (
            <img key={card.alt} className="welcome__hero-card" src={card.src} alt={card.alt} />
          ))}
        </div>
        {rowError ? (
          <p className="welcome__error" role="alert">
            {rowError}
          </p>
        ) : null}
        {!rowReady && !rowError ? (
          <p className="welcome__status" aria-live="polite">
            Preparing your session…
          </p>
        ) : null}
        <div className="welcome__actions">
          <button
            type="button"
            className="welcome__button"
            disabled={!rowReady}
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
