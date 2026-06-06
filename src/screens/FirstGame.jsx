import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlossaryText from '../components/GlossaryText.jsx'
import LessonActions from '../components/LessonActions.jsx'
import PageLayout from '../components/PageLayout.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { PROGRESS } from '../components/progressConstants.js'
import useScreenTime from '../hooks/useScreenTime.js'
import './FirstGame.css'

const SETUP_ITEMS = [
  'Each player shuffles their deck face-down. That deck becomes their library during the game.',
  'Each player starts at 20 life. The goal is to reduce your opponent to 0 life (or win another way a card describes).',
  'Decide who goes first (flip a coin, roll dice, or just agree).',
  'Each player draws seven cards. That is your opening hand. If the hand is weak, many groups allow a mulligan: shuffle back and draw one fewer card — optional and format-dependent.',
]

const TURN_STEPS = [
  {
    id: 'untap',
    label: 'Untap',
    title: 'Untap step',
    body: 'At the start of your turn, untap all of your permanents so you can use them again. Lands and creatures turn upright. On the very first turn of the game, the player who goes first skips the draw step — they do not draw a card that turn.',
  },
  {
    id: 'draw',
    label: 'Draw',
    title: 'Draw step',
    body: 'Draw one card from the top of your library. Remember: the player who takes the first turn of the game skips this step once.',
  },
  {
    id: 'main1',
    label: 'First main',
    title: 'First main phase',
    body: 'Your first big window to develop. You may play one land from your hand onto the battlefield (lands are played, not cast). Tap lands to add mana to your mana pool, then cast spells that need sorcery-speed timing — creatures, sorceries, artifacts, enchantments, and planeswalkers when the stack is empty. Instants can be cast any time you have priority, including here.',
  },
  {
    id: 'combat',
    label: 'Combat',
    title: 'Combat phase',
    body: 'On your turn, you may attack with untapped creatures that can attack (not summoning-sick creatures you just cast). The defender chooses blockers. Unblocked attackers deal damage equal to their power to the defending player or planeswalker.',
  },
  {
    id: 'main2',
    label: 'Second main',
    title: 'Second main phase',
    body: 'After combat, you get another main phase. If you have not played a land yet this turn, you may play it now — still only one land total per turn. You can cast more sorcery-speed spells when the stack is empty.',
  },
  {
    id: 'end',
    label: 'End',
    title: 'End step',
    body: 'The turn wraps up. If you have more than seven cards in hand, discard down to seven. Damage on creatures is removed. Then it becomes your opponent’s turn.',
  },
]

export default function FirstGame({ session }) {
  const navigate = useNavigate()
  useScreenTime(session, 'FirstGame')
  const [selectedId, setSelectedId] = useState('untap')
  const [visitedIds, setVisitedIds] = useState(() => new Set(['untap']))

  const selected = TURN_STEPS.find((step) => step.id === selectedId) ?? TURN_STEPS[0]
  const panelId = `first-turn-panel-${selectedId}`
  const allStepsExplored = visitedIds.size === TURN_STEPS.length

  const selectStep = useCallback((id) => {
    setSelectedId(id)
    setVisitedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  return (
    <PageLayout title="Starting a Game · Learn to Play MTG" className="first-game" showKeywordDictionary>
      <div className="first-game__frame page-layout__content-frame">
        <p className="first-game__breadcrumb">Overview · Starting a Game</p>
        <h1 className="first-game__heading">Starting a Game</h1>
        <hr className="first-game__rule" aria-hidden="true" />

        <p className="first-game__intro">
          Before the card-by-card lessons, here is how a table game actually begins — and what a
          typical turn feels like once you are playing.
        </p>

        <h2 className="first-game__subheading">Before the first turn</h2>
        <ol className="first-game__setup-list">
          {SETUP_ITEMS.map((item) => (
            <li key={item} className="first-game__setup-item">
              <GlossaryText text={item} />
            </li>
          ))}
        </ol>

        <hr className="first-game__divider" aria-hidden="true" />

        <h2 className="first-game__subheading">Your first turn (walkthrough)</h2>
        <p className="first-game__walkthrough-intro">
          <GlossaryText text="Magic turns follow the same pattern every time. Click each step below to see what you would do on your turn. Lesson 3 goes deeper on combat and the stack." />
        </p>
        <p className="first-game__hint">
          Open all six steps before you continue to Lesson 1.
        </p>

        <div className="first-game__timeline" role="tablist" aria-label="Turn steps walkthrough">
          {TURN_STEPS.map((step, index) => (
            <span key={step.id} style={{ display: 'contents' }}>
              {index > 0 && <span className="first-game__connector" aria-hidden="true" />}
              <button
                type="button"
                role="tab"
                id={`first-turn-tab-${step.id}`}
                aria-selected={selectedId === step.id}
                aria-controls={panelId}
                className={`first-game__node${selectedId === step.id ? ' first-game__node--active' : ''}${visitedIds.has(step.id) ? ' first-game__node--visited' : ''}`}
                onClick={() => selectStep(step.id)}
              >
                {step.label}
              </button>
            </span>
          ))}
        </div>

        <p className="first-game__progress" aria-live="polite">
          Explored {visitedIds.size} of {TURN_STEPS.length} steps
        </p>

        <div
          key={selectedId}
          id={panelId}
          role="tabpanel"
          aria-labelledby={`first-turn-tab-${selectedId}`}
          className="first-game__detail"
        >
          <h3 className="first-game__detail-title">{selected.title}</h3>
          <p className="first-game__detail-body">
            <GlossaryText text={selected.body} />
          </p>
        </div>

        <p className="first-game__closing">
          <GlossaryText text="That is one full turn. On your next turn, repeat the pattern: untap, draw, play a land if you have not yet, tap for mana, cast spells, attack if you can, and pass. The next lessons cover how to read cards and when each card type can be played or cast." />
        </p>

        <LessonActions
          classPrefix="first-game"
          backHint="Return to What Is Magic?"
          onBack={() => navigate('/what-is-mtg')}
          onNext={() => navigate('/lesson/1')}
          canProceed={allStepsExplored}
          gateMessage="Open each step in the walkthrough above before continuing."
        />

        <ProgressDots activeIndex={PROGRESS.FIRST_GAME} />
      </div>
    </PageLayout>
  )
}
