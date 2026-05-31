import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressDots, { PROGRESS } from '../components/ProgressDots.jsx'
import './TurnStructure.css'

const PHASES = [
  {
    id: 'beginning',
    label: 'Beginning Phase',
    title: 'Beginning Phase',
    substeps: [
      'Untap: You untap all of your permanents. Tapped cards become ready to use again.',
      'Upkeep: Triggered abilities that say \'at the beginning of your upkeep\' happen here. Most turns nothing happens during upkeep.',
      'Draw: You draw one card from the top of your library. The first player to go skips this on their very first turn.',
    ],
  },
  {
    id: 'first-main',
    label: 'First Main Phase',
    title: 'First Main Phase',
    body: 'This is your first chance to play cards. You can play a land, cast creatures, sorceries, enchantments, artifacts, and planeswalkers. You can also cast instants here, though instants can be cast at any time.',
  },
  {
    id: 'combat',
    label: 'Combat Phase',
    title: 'Combat Phase',
    body: 'This is where creatures fight. You choose which of your creatures attack, your opponent chooses which of theirs block, and damage is dealt. Creatures with toughness equal to or greater than the damage they take survive.',
  },
  {
    id: 'second-main',
    label: 'Second Main Phase',
    title: 'Second Main Phase',
    body: 'A second chance to play cards after combat. This is a good time to play cards you were holding back, or to cast spells after seeing how combat went.',
  },
  {
    id: 'end',
    label: 'End Phase',
    title: 'End Phase',
    body: 'The turn wraps up here. If you have more than seven cards in hand you must discard down to seven. Damage on creatures is removed and \'until end of turn\' effects expire.',
  },
]

export default function TurnStructure({ session }) {
  void session
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState('beginning')

  const selected = PHASES.find((p) => p.id === selectedId) ?? PHASES[0]

  return (
    <div className="turn-structure">
      <div className="turn-structure__frame">
        <p className="turn-structure__breadcrumb">Lesson 03 · Turn Structure</p>
        <h1 className="turn-structure__heading">How a Turn Works</h1>
        <hr className="turn-structure__rule" aria-hidden="true" />

        <p className="turn-structure__intro">
          Every Magic turn follows the same sequence of phases. Once you know this order, you&apos;ll
          always know what you can do and when.
        </p>

        <div className="turn-structure__timeline" role="tablist" aria-label="Turn phases">
          {PHASES.map((phase, index) => (
            <span key={phase.id} style={{ display: 'contents' }}>
              {index > 0 && <span className="turn-structure__connector" aria-hidden="true" />}
              <button
                type="button"
                role="tab"
                aria-selected={selectedId === phase.id}
                className={`turn-structure__node${selectedId === phase.id ? ' turn-structure__node--active' : ''}`}
                onClick={() => setSelectedId(phase.id)}
              >
                {phase.label}
              </button>
            </span>
          ))}
        </div>

        <div key={selectedId} className="turn-structure__detail">
          <h2 className="turn-structure__detail-title">{selected.title}</h2>
          {selected.substeps ? (
            <ul className="turn-structure__substeps">
              {selected.substeps.map((text) => (
                <li key={text} className="turn-structure__substep">
                  <span className="turn-structure__bullet" aria-hidden="true">
                    ◆
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="turn-structure__detail-body">{selected.body}</p>
          )}
        </div>

        <hr className="turn-structure__divider" aria-hidden="true" />

        <p className="turn-structure__closing">
          The two main phases are what trips most new players up. Remember: you get two chances to
          play cards each turn, one before combat and one after.
        </p>

        <div className="turn-structure__actions">
          <button
            type="button"
            className="turn-structure__button turn-structure__button--back"
            onClick={() => navigate('/lesson/2')}
          >
            Back
          </button>
          <button
            type="button"
            className="turn-structure__button turn-structure__button--next"
            onClick={() => navigate('/lesson/4')}
          >
            Next
          </button>
        </div>
        <ProgressDots activeIndex={PROGRESS.LESSON_3} />
      </div>
    </div>
  )
}
