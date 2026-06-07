/**
 * Simulates Intro register + pretest save using the same paths as src/lib/db.js
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
import { randomBytes } from 'crypto'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    })
)

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
const sessionId = 'SIM' + nanoid(8)
const sessionSecret = randomBytes(16).toString('hex')
const sb = createClient(url, key)

console.log('[simulate] sessionId=', sessionId)

const selectedQuestions = Array.from({ length: 10 }, (_, index) => ({
  id: `sim_q${index + 1}`,
  lo: 'LO0',
  correctIndex: 0,
}))

const rpc = await sb.rpc('register_participant', {
  p_participant_id: sessionId,
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
  p_selected_questions: selectedQuestions,
})
console.log('[simulate] register_participant', {
  data: rpc.data,
  error: rpc.error?.message ?? null,
})

const patch = await sb.rpc('update_participant', {
  p_session_id: sessionId,
  p_session_secret: sessionSecret,
  p_patch: {
    pretest_answers: { sim_q1: 0 },
    pretest_score: 1,
  },
})
console.log('[simulate] savePretest', {
  data: patch.data,
  error: patch.error?.message ?? null,
})
