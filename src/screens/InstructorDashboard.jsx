import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LO_LABELS,
  LO_ORDER,
  aggregateCohortStats,
  sessionsToCsv,
} from '../lib/scoring.js'
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js'
import './InstructorDashboard.css'

const EXPECTED_PASSWORD = import.meta.env.VITE_INSTRUCTOR_PASSWORD ?? ''

function formatMean(value, digits = 1) {
  return Number(value).toFixed(digits)
}

export default function InstructorDashboard() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const cohort = useMemo(() => aggregateCohortStats(sessions), [sessions])

  const loadSessions = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    const supabase = getSupabaseClient()
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('learning_sessions')
      .select('*')
      .order('submitted_at', { ascending: false })

    setLoading(false)

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setSessions(data ?? [])
  }, [])

  function handleUnlock(event) {
    event.preventDefault()
    if (!EXPECTED_PASSWORD) {
      setUnlocked(true)
      loadSessions()
      return
    }
    if (password === EXPECTED_PASSWORD) {
      setUnlocked(true)
      loadSessions()
    } else {
      setError('Incorrect instructor password.')
    }
  }

  function handleExportCsv() {
    const csv = sessionsToCsv(sessions)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `hci520-mtg-sessions-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="instructor">
        <div className="instructor__frame">
          <h1 className="instructor__heading">Instructor dashboard</h1>
          <p className="instructor__error">
            Supabase environment variables are missing. Copy <code>.env.example</code> to{' '}
            <code>.env.local</code> and rebuild.
          </p>
          <Link className="instructor__back" to="/">
            ← Back to lesson
          </Link>
        </div>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="instructor">
        <div className="instructor__frame">
          <h1 className="instructor__heading">Instructor dashboard</h1>
          <p className="instructor__intro">
            View cohort pre/post scores and export data for HCI520 evaluation. Enter the
            instructor password from your deployment environment.
          </p>
          <form className="instructor__unlock" onSubmit={handleUnlock}>
            <label className="instructor__label" htmlFor="instructor-password">
              Password
            </label>
            <input
              id="instructor-password"
              type="password"
              className="instructor__input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            {error && <p className="instructor__error">{error}</p>}
            <button type="submit" className="instructor__button">
              Unlock
            </button>
          </form>
          <Link className="instructor__back" to="/">
            ← Back to lesson
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="instructor">
      <div className="instructor__frame">
        <div className="instructor__toolbar">
          <h1 className="instructor__heading">Instructor dashboard</h1>
          <div className="instructor__toolbar-actions">
            <button
              type="button"
              className="instructor__button instructor__button--muted"
              onClick={loadSessions}
              disabled={loading}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              type="button"
              className="instructor__button"
              onClick={handleExportCsv}
              disabled={!sessions.length}
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && <p className="instructor__error">{error}</p>}

        <section className="instructor__summary" aria-label="Cohort summary">
          <p className="instructor__stat">
            <span className="instructor__stat-label">Participants</span>
            <span className="instructor__stat-value">{cohort.count}</span>
          </p>
          <p className="instructor__stat">
            <span className="instructor__stat-label">Mean pre-test (of 8)</span>
            <span className="instructor__stat-value">{formatMean(cohort.meanPretest)}</span>
          </p>
          <p className="instructor__stat">
            <span className="instructor__stat-label">Mean post-test (of 8)</span>
            <span className="instructor__stat-value">{formatMean(cohort.meanPosttest)}</span>
          </p>
          <p className="instructor__stat">
            <span className="instructor__stat-label">Mean gain</span>
            <span className="instructor__stat-value">{formatMean(cohort.meanGain, 2)}</span>
          </p>
        </section>

        <section className="instructor__lo" aria-label="Per learning objective">
          <h2 className="instructor__subheading">Mean score by learning objective (of 2)</h2>
          <table className="instructor__table">
            <thead>
              <tr>
                <th scope="col">Objective</th>
                <th scope="col">Pre</th>
                <th scope="col">Post</th>
                <th scope="col">Gain</th>
              </tr>
            </thead>
            <tbody>
              {LO_ORDER.map((lo) => (
                <tr key={lo}>
                  <td>{LO_LABELS[lo]}</td>
                  <td>{formatMean(cohort.loMeans[lo]?.pre ?? 0)}</td>
                  <td>{formatMean(cohort.loMeans[lo]?.post ?? 0)}</td>
                  <td>{formatMean(cohort.loMeans[lo]?.gain ?? 0, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="instructor__participants" aria-label="Participants">
          <h2 className="instructor__subheading">Participants</h2>
          {!sessions.length && !loading && (
            <p className="instructor__empty">No sessions yet. Participants submit after the post-test.</p>
          )}
          {sessions.length > 0 && (
            <div className="instructor__table-wrap">
              <table className="instructor__table instructor__table--compact">
                <thead>
                  <tr>
                    <th scope="col">Session ID</th>
                    <th scope="col">Pre</th>
                    <th scope="col">Post</th>
                    <th scope="col">Gain</th>
                    <th scope="col">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((row) => (
                    <tr key={row.session_id}>
                      <td>
                        <code>{row.session_id}</code>
                      </td>
                      <td>
                        {row.pretest_correct} / 8
                      </td>
                      <td>
                        {row.posttest_correct} / 8
                      </td>
                      <td>{row.gain >= 0 ? `+${row.gain}` : row.gain}</td>
                      <td>
                        {row.submitted_at
                          ? new Date(row.submitted_at).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="instructor__note">
          Scores use each participant&apos;s randomly drawn 8 questions (2 per LO). See{' '}
          <code>docs/evaluation.md</code> for reporting caveats.
        </p>

        <Link className="instructor__back" to="/">
          ← Back to lesson
        </Link>
      </div>
    </div>
  )
}
