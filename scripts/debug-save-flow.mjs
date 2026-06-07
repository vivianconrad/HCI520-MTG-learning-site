import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { nanoid } from 'nanoid'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1)]
    })
)

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
const sessionId = `DBG${nanoid(8)}`
const sessionSecret = randomBytes(16).toString('hex')
const selectedQuestions = Array.from({ length: 10 }, (_, index) => ({
  id: `dbg_q${index + 1}`,
  lo: 'LO0',
  correctIndex: 0,
}))

async function rpc(label, fn) {
  const result = await fn()
  if (result.error) {
    console.log(`${label}: ERROR ${result.error.message}`)
  } else {
    console.log(`${label}: OK data=${result.data}`)
  }
  return result
}

await rpc('register', () =>
  sb.rpc('register_participant', {
    p_participant_id: nanoid(10),
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_selected_questions: selectedQuestions,
  })
)

await rpc('pretest', () =>
  sb.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: { pretest_answers: { dbg_q1: 0 }, pretest_score: 1 },
  })
)

await rpc('lesson_complete_0_scenarios', () =>
  sb.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: { lessons_completed: true, scenarios_attempted: 0 },
  })
)

await rpc('posttest_after_lessons', () =>
  sb.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: {
      posttest_answers: { dbg_q1: 0 },
      posttest_score: 1,
      completed_at: new Date().toISOString(),
    },
  })
)
