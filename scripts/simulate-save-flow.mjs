/**
 * Simulates Intro insert + pretest save using the same REST paths as src/lib/db.js
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

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
const sessionId = 'SIM' + nanoid(8)
const sb = createClient(url, key)

console.log('[simulate] sessionId=', sessionId)

const participantId = nanoid(10)
const ins = await sb.from('participants').insert({
  participant_id: participantId,
  session_id: sessionId,
  selected_questions: [{ id: 'q1', lo: 'LO1' }],
})
console.log('[simulate] createParticipantRow', { status: ins.status, error: ins.error?.message })

const patch = await fetch(
  `${url}/rest/v1/participants?session_id=eq.${encodeURIComponent(sessionId)}`,
  {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal,count=exact',
    },
    body: JSON.stringify({ pretest_answers: { q1: 0 }, pretest_score: 1 }),
  },
)
console.log('[simulate] savePretest', {
  status: patch.status,
  contentRange: patch.headers.get('content-range'),
})
