/**
 * Verifies production RLS + hardened participant API.
 * Run: node scripts/verify-participants-db.mjs
 * Requires supabase/setup.sql applied in Supabase (or fix-update-rls-after-security.sql
 * plus the trigger/RPC sections from setup.sql if this is a partial migration).
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { randomBytes } from 'crypto'

function loadEnv() {
  return Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split('\n')
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i), l.slice(i + 1)]
      })
  )
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const sessionId = `VERIFY${Date.now().toString(36).toUpperCase().slice(-6)}`
const sessionSecret = randomBytes(16).toString('hex')

const selectedQuestions = Array.from({ length: 10 }, (_, index) => ({
  id: `verify_q${index + 1}`,
  lo: 'LO0',
  correctIndex: 0,
}))

const sb = createClient(url, key)
let failed = false

function fail(message) {
  console.error(`FAIL: ${message}`)
  failed = true
}

function pass(message) {
  console.log(`OK: ${message}`)
}

// 1) Deny SELECT — anon must not read participant rows
const selectAttempt = await sb.from('participants').select('session_id').limit(5)
if (selectAttempt.error) {
  fail(`SELECT returned error (unexpected): ${selectAttempt.error.message}`)
} else if (selectAttempt.data?.length > 0) {
  fail(
    `SELECT returned ${selectAttempt.data.length} row(s). Remove permissive SELECT policies (e.g. "Allow select for instructor dashboard").`
  )
} else {
  pass('SELECT denied (empty result set, no rows leaked)')
}

// 2) Deny direct INSERT — registration must use RPC
const directInsert = await sb.from('participants').insert({
  participant_id: 'direct1',
  session_id: `${sessionId}_DIRECT`,
  session_secret: sessionSecret,
  selected_questions: selectedQuestions,
})
if (!directInsert.error) {
  fail('Direct anon INSERT succeeded; revoke INSERT and use register_participant RPC.')
} else {
  pass(`Direct INSERT blocked (${directInsert.error.code ?? directInsert.error.message})`)
}

// 3) register_participant RPC
const rpc = await sb.rpc('register_participant', {
  p_participant_id: 'verify1',
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
  p_selected_questions: selectedQuestions,
})

if (rpc.error) {
  fail(`register_participant RPC: ${rpc.error.message}`)
  console.error('\n Re-run supabase/setup.sql in the Supabase SQL Editor.\n')
  process.exit(1)
}
pass('register_participant RPC')

// 4) UPDATE with session secret
const patch = await fetch(
  `${url}/rest/v1/participants?session_id=eq.${encodeURIComponent(sessionId)}`,
  {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'x-session-secret': sessionSecret,
      Prefer: 'return=minimal,count=exact',
    },
    body: JSON.stringify({ screens_time: { verify: 1 } }),
  }
)
const range = patch.headers.get('content-range')
const rowsUpdated = range?.includes('/') ? range.split('/')[1] : '?'
if (rowsUpdated === '0') {
  fail(
    'UPDATE affected 0 rows. Run supabase/migrations/fix-update-rls-after-security.sql or re-run supabase/setup.sql.'
  )
} else {
  pass(`UPDATE with x-session-secret (${rowsUpdated} row)`)
}

// 5) Score validation — mismatched score rejected
const badScore = await fetch(
  `${url}/rest/v1/participants?session_id=eq.${encodeURIComponent(sessionId)}`,
  {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'x-session-secret': sessionSecret,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      pretest_answers: { verify_q1: 0 },
      pretest_score: 99,
    }),
  }
)
if (badScore.ok) {
  fail('Server accepted pretest_score=99 that does not match answers (validation trigger missing?)')
} else {
  pass(`Mismatched pretest_score rejected (HTTP ${badScore.status})`)
}

// 6) get_participant_progress RPC
const progress = await sb.rpc('get_participant_progress', {
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
})
if (progress.error) {
  fail(`get_participant_progress: ${progress.error.message}`)
} else if (!progress.data || typeof progress.data !== 'object') {
  fail('get_participant_progress returned no data')
} else {
  pass('get_participant_progress RPC')
}

console.log('')
if (failed) {
  console.error('One or more checks failed. Re-run supabase/setup.sql in Supabase SQL Editor.\n')
  process.exit(1)
}
console.log('All participant security checks passed.\n')
