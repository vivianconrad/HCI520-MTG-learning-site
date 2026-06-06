/**
 * Verifies anon can INSERT then UPDATE participants (RLS + grants).
 * Run: node scripts/verify-participants-db.mjs
 * If rowsUpdated stays 0 after insert, run supabase/fix-participants-rls.sql in SQL Editor.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { randomBytes } from 'crypto'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    }),
)

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
const sessionId = `VERIFY${Date.now().toString(36).toUpperCase().slice(-6)}`
const sessionSecret = randomBytes(16).toString('hex')

const sb = createClient(url, key)

const ins = await sb.from('participants').insert({
  participant_id: 'verify1',
  session_id: sessionId,
  session_secret: sessionSecret,
  selected_questions: [{ id: 'q1' }],
})
console.log('INSERT', { status: ins.status, error: ins.error?.message ?? null })

const res = await fetch(`${url}/rest/v1/participants?session_id=eq.${encodeURIComponent(sessionId)}`, {
  method: 'PATCH',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    'x-session-secret': sessionSecret,
    Prefer: 'return=minimal,count=exact',
  },
  body: JSON.stringify({ pretest_score: 1 }),
})
const range = res.headers.get('content-range')
console.log('PATCH', { status: res.status, contentRange: range })

const rowsUpdated = range?.includes('/') ? range.split('/')[1] : '?'
if (rowsUpdated === '0') {
  console.error('\nFAIL: UPDATE affected 0 rows. Run supabase/fix-participants-rls.sql in Supabase SQL Editor.\n')
  process.exit(1)
}
console.log('\nOK: anon INSERT + UPDATE works.\n')
