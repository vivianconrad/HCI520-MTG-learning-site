import { useCallback, useState } from 'react'
import TapExplainer from '../components/TapExplainer.jsx'
import PageLayout from '../components/PageLayout.jsx'
import StackExplainer from '../components/StackExplainer.jsx'
import { useNavigate } from 'react-router-dom'
import CuriosityNote from '../components/CuriosityNote.jsx'
import LessonActions from '../components/LessonActions.jsx'
import { getCuriosityLessonNote } from '../lib/learnerChoice.js'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import GlossaryText from '../components/GlossaryText.jsx'
import useScreenTime from '../hooks/useScreenTime.js'
import { cardImage } from '../assets/cards/index.js'
import './TurnStructure.css'

const PHASES = [
  {
    id: 'beginning',
    label: 'Beginning Phase',
    title: 'Beginning Phase',
    intro:
      'The beginning phase has three parts, always in this order: untap, upkeep, and draw.',
    substeps: [
      'Untap: You untap all of your permanents. Turn every tapped card upright so it can be used again. Tapping means turning a card sideways to show it has been used; untapping reverses that at the start of each of your turns.',
      "Upkeep: Triggered abilities that say 'at the beginning of your upkeep' happen here. Most turns nothing happens during upkeep.",
      'Draw: You draw one card from the top of your library. The first player to go skips this on their very first turn.',
    ],
    image: cardImage('land-island.png'),
    imageAlt: 'Island land card',
  },
  {
    id: 'first-main',
    label: 'First Main Phase',
    title: 'First Main Phase',
    body: 'This is your first window to cast spells when the stack is empty: creatures, sorceries, enchantments, artifacts, and planeswalkers. You may also play your one land for the turn here (lands are played, not cast), or save that land drop for your second main phase. Instants can be cast any time you have priority, including here. The example card, Llanowar Elves, can tap to add green mana. That is activating an ability, not casting a spell. If you cast it this turn, summoning sickness stops it from attacking or using that tap ability until your next turn begins.',
    image: cardImage('creature-llanowar-elves.jpg'),
    imageAlt: 'Llanowar Elves creature card',
  },
  {
    id: 'combat',
    label: 'Combat Phase',
    title: 'Combat Phase',
    substeps: [
      'Beginning of combat: Abilities that trigger at the start of combat happen here. Either player can cast instants before attackers are declared.',
      'Declare attackers: On your turn, you choose which of your untapped creatures attack the defending player (or one of their planeswalkers). Each attacker taps as it attacks.',
      'Declare blockers: The defending player chooses which untapped creatures block which attackers. Blockers do not tap. A creature can block only one attacker unless a card says otherwise.',
      'Combat damage: Attacking and blocking creatures deal damage equal to their power to each other at the same time. Unblocked attackers deal their power as damage to the player or planeswalker being attacked. If a creature takes damage equal to or greater than its toughness this turn, it dies and goes to the graveyard.',
      'End of combat: Triggered abilities and cleanup happen here before the second main phase.',
    ],
    image: cardImage('creature-hellkite-tyrant.webp'),
    imageAlt: 'Hellkite Tyrant creature card',
  },
  {
    id: 'second-main',
    label: 'Second Main Phase',
    title: 'Second Main Phase',
    body: 'After combat, you get a second main phase, mainly another window to cast spells when the stack is empty. Many players hold back creatures or sorceries until they see how combat went. If you have not played a land yet this turn, you may play it now; you still get only one land per turn total.',
    image: cardImage('artifact-sol-ring.jpg'),
    imageAlt: 'Sol Ring artifact card',
  },
  {
    id: 'end',
    label: 'End Phase',
    title: 'End Phase',
    body: "The turn wraps up here. If you have more than seven cards in hand you must discard down to seven. Damage on creatures is removed and 'until end of turn' effects expire.",
    image: cardImage('enchantment-sylvan-library.webp'),
    imageAlt: 'Sylvan Library enchantment card',
  },
]

export default function TurnStructure({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'TurnStructure')
  const [selectedId, setSelectedId] = useState('beginning')
  const [visitedIds, setVisitedIds] = useState(() => new Set(['beginning']))
  const [highlightMissing, setHighlightMissing] = useState(false)

  const selected = PHASES.find((p) => p.id === selectedId) ?? PHASES[0]
  const panelId = 'turn-phase-panel'
  const selectedIndex = PHASES.findIndex((phase) => phase.id === selectedId)
  const allPhasesExplored = visitedIds.size === PHASES.length
  const curiosityNote = getCuriosityLessonNote(session.curiosityFocus, 'lesson3')
  const isFirstPhase = selectedIndex <= 0
  const isLastPhase = selectedIndex >= PHASES.length - 1

  const selectPhase = useCallback((id) => {
    setSelectedId(id)
    setVisitedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
    window.setTimeout(() => {
      document.getElementById(`turn-tab-${id}`)?.focus()
    }, 0)
  }, [])

  const handleGateBlocked = useCallback(() => {
    setHighlightMissing(true)
    const firstMissing = PHASES.find((phase) => !visitedIds.has(phase.id))
    if (firstMissing) {
      document.getElementById(`turn-tab-${firstMissing.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [visitedIds])

  function handleTabListKeyDown(event) {
    const currentIndex = PHASES.findIndex((phase) => phase.id === selectedId)
    if (currentIndex < 0) return

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      selectPhase(PHASES[(currentIndex + 1) % PHASES.length].id)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      selectPhase(PHASES[(currentIndex - 1 + PHASES.length) % PHASES.length].id)
    } else if (event.key === 'Home') {
      event.preventDefault()
      selectPhase(PHASES[0].id)
    } else if (event.key === 'End') {
      event.preventDefault()
      selectPhase(PHASES[PHASES.length - 1].id)
    }
  }

  return (
    <PageLayout title="Lesson 3 · Turn Structure" className="turn-structure" showKeywordDictionary>
      <div className="turn-structure__frame page-layout__content-frame">
        <p className="turn-structure__breadcrumb">Lesson 03 · Turn Structure</p>
        <h1 className="turn-structure__heading">How a Turn Works</h1>
        <hr className="turn-structure__rule" aria-hidden="true" />

        <CuriosityNote text={curiosityNote} />

        <p className="turn-structure__intro">
          Every Magic turn follows the same five phases in order. Click a phase on the timeline, or
          use Next phase to walk through a sample turn at your own pace.
        </p>

        <TapExplainer variant="brief" />

        <StackExplainer variant="brief" />

        <p className="turn-structure__hint">
          Open all five phases before you continue.
        </p>

        <div
          className="turn-structure__timeline-wrap"
        >
          <div
            className="turn-structure__timeline"
            role="tablist"
            aria-label="Turn phases"
            onKeyDown={handleTabListKeyDown}
          >
          {PHASES.map((phase, index) => (
            <span key={phase.id} style={{ display: 'contents' }}>
              {index > 0 && <span className="turn-structure__connector" aria-hidden="true" />}
              <button
                type="button"
                role="tab"
                id={`turn-tab-${phase.id}`}
                aria-selected={selectedId === phase.id}
                aria-controls={panelId}
                tabIndex={selectedId === phase.id ? 0 : -1}
                className={`turn-structure__node${selectedId === phase.id ? ' turn-structure__node--active' : ''}${visitedIds.has(phase.id) ? ' turn-structure__node--visited' : ''}${highlightMissing && !visitedIds.has(phase.id) ? ' turn-structure__node--missing' : ''}`}
                onClick={() => selectPhase(phase.id)}
              >
                {phase.label}
              </button>
            </span>
          ))}
          </div>
        </div>

        <p id="turn-structure-timeline-hint" className="turn-structure__timeline-hint">
          Tap each phase—or use Next phase—to explore the full turn.
        </p>

        <p className="turn-structure__progress" aria-live="polite">
          {allPhasesExplored
            ? 'All five phases explored.'
            : `Explored ${visitedIds.size} of ${PHASES.length} phases`}
        </p>

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`turn-tab-${selectedId}`}
          className="turn-structure__detail"
        >
          <h2 className="turn-structure__detail-title">{selected.title}</h2>
          <img
            className="turn-structure__phase-image"
            src={selected.image}
            alt={selected.imageAlt}
          />
          {selected.substeps ? (
            <>
              {selected.intro ? (
                <p className="turn-structure__detail-body turn-structure__detail-body--spaced">
                  <GlossaryText text={selected.intro} />
                </p>
              ) : null}
              <ul className="turn-structure__substeps">
              {selected.substeps.map((text) => (
                <li key={text} className="turn-structure__substep">
                  <span className="turn-structure__bullet" aria-hidden="true">
                    ◆
                  </span>
                  <GlossaryText text={text} />
                </li>
              ))}
              </ul>
            </>
          ) : (
            <p className="turn-structure__detail-body">
              <GlossaryText text={selected.body} />
            </p>
          )}
        </div>

        <div className="turn-structure__phase-nav">
          <button
            type="button"
            className="turn-structure__button turn-structure__button--back"
            onClick={() => selectPhase(PHASES[selectedIndex - 1].id)}
            disabled={isFirstPhase}
          >
            Previous phase
          </button>
          {!isLastPhase ? (
            <button
              type="button"
              className="turn-structure__button turn-structure__button--next"
              onClick={() => selectPhase(PHASES[selectedIndex + 1].id)}
            >
              Next phase
            </button>
          ) : null}
        </div>

        <hr className="turn-structure__divider" aria-hidden="true" />

        <p className="turn-structure__closing">
          <GlossaryText text="The two main phases are what trips most new players up. You get two windows to cast spells (before and after combat), but only one land per turn, played in your first or second main phase, not one in each. Lands are played; spells are cast. Tapped cards untap at the start of your turn. Sorceries need an empty stack; instants can be cast any time you have priority, including in response to spells on the stack." />
        </p>

        <LessonActions
          classPrefix="turn-structure"
          backLabel="Back to card types"
          onBack={() => navigate('/lesson/2')}
          onNext={() => navigate('/lesson/4')}
          nextLabel="Continue to practice"
          canProceed={allPhasesExplored}
          gateMessage="Open all five phases on the timeline before continuing."
          readyMessage="You've explored every turn phase. Ready to continue."
          onGateBlocked={handleGateBlocked}
        />
        <ProgressDots activeIndex={PROGRESS.LESSON_3} />
      </div>
    </PageLayout>
  )
}
