import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import {
  DEFAULT_TEST_QUESTION_COUNT,
  TOPIC_LABELS,
  TOPIC_ORDER,
  aggregateCohortStats,
  sessionsToCsv,
} from '../lib/scoring.js'
import { supabase } from '../lib/supabase.js'
import './InstructorDashboard.css'

function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

function isRlsBlocked(error) {
  if (!error) return false
  const message = error.message?.toLowerCase() ?? ''
  return (
    error.code === '42501' ||
    message.includes('policy') ||
    message.includes('permission') ||
    message.includes('row-level security')
  )
}

const RLS_BLOCKED_MESSAGE =
  'Cohort data is not readable from the public browser. Row-level security blocks SELECT on the participants table. Use the Supabase Table Editor to view and export cohort data.'

function formatMean(value, digits = 1) {
  return Number(value).toFixed(digits)
}

export default function InstructorDashboard() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rlsBlocked, setRlsBlocked] = useState(false)
  const [loadAttempted, setLoadAttempted] = useState(false)

  const cohort = useMemo(() => aggregateCohortStats(sessions), [sessions])

  const loadSessions = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    setLoadAttempted(true)
    setLoading(true)
    setError(null)
    setRlsBlocked(false)

    const { data, error: fetchError } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false })

    setLoading(false)

    if (fetchError) {
      if (isRlsBlocked(fetchError)) {
        setRlsBlocked(true)
        setError(RLS_BLOCKED_MESSAGE)
      } else {
        setError(fetchError.message)
      }
      return
    }

    setSessions(data ?? [])
  }, [])

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
      <PageLayout title="Instructor Dashboard · Learn to Play MTG" className="instructor">
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
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Instructor Dashboard · Learn to Play MTG" className="instructor">
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
              {loading ? 'Loading…' : loadAttempted ? 'Refresh' : 'Try loading cohort data'}
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

        <section className="instructor__setup" aria-labelledby="instructor-setup-heading">
          <h2 id="instructor-setup-heading" className="instructor__subheading">
            Researcher workflow
          </h2>
          <p className="instructor__intro">
            Participant rows are private by design. With deny-select RLS (the default from{' '}
            <code>supabase/setup.sql</code>), this page cannot read cohort data from the browser.
            That is expected. Use Supabase for analysis, and treat the button below as an optional
            check when you have changed policies.
          </p>
          <ol className="instructor__steps">
            <li>
              Open your Supabase project → <strong>Table Editor</strong> →{' '}
              <code>participants</code>.
            </li>
            <li>
              Filter or sort by <code>completed_at</code> to find finished sessions. Rows appear
              after a participant submits the post-test.
            </li>
            <li>
              Export from Table Editor (CSV) for SPSS, R, or Excel. Column definitions and scoring
              caveats are in the project wiki (
              <code>documentation/guide/evaluation.md</code> — deployed at{' '}
              <code>/HCI520-MTG-learning-site/wiki/guide/evaluation</code>).
            </li>
            <li>
              Optional: click <strong>Try loading cohort data</strong> to see whether browser reads
              work in your environment. If RLS blocks reads, use the Table Editor instead.
            </li>
          </ol>
        </section>

        {error && (
          <p className="instructor__error" role="alert">
            {error}
          </p>
        )}

        {rlsBlocked && (
          <p className="instructor__callout" role="status">
            Browser reads are blocked. This is normal with deny-select RLS. Continue in Supabase
            Table Editor. The empty tables below are not a bug.
          </p>
        )}

        {loadAttempted && !rlsBlocked && !error && sessions.length === 0 && !loading && (
          <p className="instructor__callout" role="status">
            Load succeeded, but no completed sessions are in the database yet. Participants appear
            after they finish the post-test. Use Table Editor to confirm rows as they arrive.
          </p>
        )}

        {loadAttempted && !rlsBlocked && !error && (
          <>
            <section className="instructor__summary" aria-label="Cohort summary">
              <p className="instructor__stat">
                <span className="instructor__stat-label">Participants</span>
                <span className="instructor__stat-value">{cohort.count}</span>
              </p>
              <p className="instructor__stat">
                <span className="instructor__stat-label">
                  Mean pre-test (of {DEFAULT_TEST_QUESTION_COUNT})
                </span>
                <span className="instructor__stat-value">{formatMean(cohort.meanPretest)}</span>
              </p>
              <p className="instructor__stat">
                <span className="instructor__stat-label">
                  Mean post-test (of {DEFAULT_TEST_QUESTION_COUNT})
                </span>
                <span className="instructor__stat-value">{formatMean(cohort.meanPosttest)}</span>
              </p>
              <p className="instructor__stat">
                <span className="instructor__stat-label">Mean gain</span>
                <span className="instructor__stat-value">{formatMean(cohort.meanGain, 2)}</span>
              </p>
            </section>

            <section className="instructor__lo" aria-label="Mean score by topic">
              <h2 className="instructor__subheading">Mean score by topic (of 2 questions each)</h2>
              <table className="instructor__table">
                <caption className="visually-hidden">
                  Mean pre-test, post-test, and gain by learning topic
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Topic</th>
                    <th scope="col">Pre</th>
                    <th scope="col">Post</th>
                    <th scope="col">Gain</th>
                  </tr>
                </thead>
                <tbody>
                  {TOPIC_ORDER.map((topicKey) => (
                    <tr key={topicKey}>
                      <td>{TOPIC_LABELS[topicKey]}</td>
                      <td>{formatMean(cohort.loMeans[topicKey]?.pre ?? 0)}</td>
                      <td>{formatMean(cohort.loMeans[topicKey]?.post ?? 0)}</td>
                      <td>{formatMean(cohort.loMeans[topicKey]?.gain ?? 0, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="instructor__participants" aria-label="Participants">
              <h2 className="instructor__subheading">Participants</h2>
              {sessions.length > 0 && (
                <div className="instructor__table-wrap">
                  <table className="instructor__table instructor__table--compact">
                    <caption className="visually-hidden">
                      Participant session scores and submission times
                    </caption>
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
                      {sessions.map((row) => {
                        const pre = row.pretest_score ?? 0
                        const post = row.posttest_score ?? 0
                        const gain = post - pre
                        const questionCount =
                          row.selected_questions?.length ?? DEFAULT_TEST_QUESTION_COUNT
                        return (
                          <tr key={row.session_id}>
                            <td>
                              <code>{row.session_id}</code>
                            </td>
                            <td>
                              {pre} / {questionCount}
                            </td>
                            <td>
                              {post} / {questionCount}
                            </td>
                            <td>{gain >= 0 ? `+${gain}` : gain}</td>
                            <td>
                              {row.completed_at ? new Date(row.completed_at).toLocaleString() : '-'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <p className="instructor__note">
              Scores use each participant&apos;s randomly drawn {DEFAULT_TEST_QUESTION_COUNT}{' '}
              questions (2 per topic). See the wiki evaluation guide for reporting caveats.
            </p>
          </>
        )}

        <Link className="instructor__back" to="/">
          ← Back to lesson
        </Link>
      </div>
    </PageLayout>
  )
}
