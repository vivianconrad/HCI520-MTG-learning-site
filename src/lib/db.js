import { nanoid } from 'nanoid'
import { attachAnswerKeys } from './questionKeys.js'
import { supabase } from './supabase'

/** True when PATCH succeeded at HTTP level but RLS blocked the update (wrong session secret or missing row). */
export function isParticipantUpdateBlocked(result) {
  return Boolean(result && result.ok === false && result.rowsUpdated === 0)
}

export const SESSION_CONFLICT_CODE = 'session_conflict'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function devLog(...args) {
  if (import.meta.env.DEV) console.log(...args)
}

function devWarn(...args) {
  if (import.meta.env.DEV) console.warn(...args)
}

function devError(...args) {
  if (import.meta.env.DEV) console.error(...args)
}

/**
 * PATCH participants by session_id and log how many rows were updated.
 * Uses Prefer: count=exact because SELECT is denied by RLS on this table.
 */
async function patchParticipant(sessionId, sessionSecret, payload, logLabel) {
  devLog(`[db] ${logLabel}: sessionId=`, sessionId, 'payload=', payload)

  if (!sessionId) {
    devError(`[db] ${logLabel}: aborted: sessionId is missing`)
    return { ok: false, rowsUpdated: 0, error: 'missing sessionId' }
  }

  if (!sessionSecret) {
    devError(`[db] ${logLabel}: aborted: sessionSecret is missing`)
    return { ok: false, rowsUpdated: 0, error: 'missing sessionSecret' }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    devError(`[db] ${logLabel}: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY`)
    return { ok: false, rowsUpdated: 0, error: 'missing env' }
  }

  const filter = `session_id=eq.${encodeURIComponent(sessionId)}`
  const res = await fetch(`${supabaseUrl}/rest/v1/participants?${filter}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'x-session-secret': sessionSecret,
      Prefer: 'return=minimal,count=exact',
    },
    body: JSON.stringify(payload),
  })

  const range = res.headers.get('content-range')
  let rowsUpdated = 0
  if (range?.includes('/')) {
    const countPart = range.split('/')[1]
    rowsUpdated = countPart === '*' ? 0 : Number.parseInt(countPart, 10)
  }

  let errorBody = null
  if (!res.ok) {
    errorBody = await res.text()
    devError(`[db] ${logLabel}: HTTP ${res.status}`, errorBody)
  }

  const result = {
    ok: res.ok && rowsUpdated > 0,
    status: res.status,
    rowsUpdated,
    error: errorBody,
  }
  devLog(`[db] ${logLabel}: response`, result)

  if (res.ok && rowsUpdated === 0) {
    devWarn(
      `[db] ${logLabel}: 0 rows updated: participant row missing or UPDATE blocked by RLS. ` +
        'Run supabase/fix-participants-rls.sql in the Supabase SQL Editor.'
    )
  }

  return result
}

function isSessionConflictError(error) {
  if (!error) return false
  return error.code === '23505' || /session_id already registered/i.test(error.message ?? '')
}

/**
 * Creates a participant row via register_participant RPC (no open anon INSERT).
 * Returns participant id, or { conflict: true } if session_id is already taken.
 */
export async function createParticipantRow(sessionId, sessionSecret, selectedQuestions) {
  devLog(
    '[db] createParticipantRow: sessionId=',
    sessionId,
    'questionCount=',
    selectedQuestions?.length ?? 0
  )

  if (!sessionId) {
    devError('[db] createParticipantRow: missing sessionId')
    return null
  }
  if (!sessionSecret) {
    devError('[db] createParticipantRow: missing sessionSecret')
    return null
  }
  if (!selectedQuestions?.length) {
    devError('[db] createParticipantRow: selectedQuestions not ready')
    return null
  }

  const participantId = nanoid(10)
  const questionsForServer = await attachAnswerKeys(selectedQuestions)

  const { data, error } = await supabase.rpc('register_participant', {
    p_participant_id: participantId,
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_selected_questions: questionsForServer,
  })

  devLog('[db] createParticipantRow: rpc response', { data, error })

  if (isSessionConflictError(error)) {
    devWarn('[db] createParticipantRow: session_id conflict')
    return { conflict: true, code: SESSION_CONFLICT_CODE }
  }

  if (error) {
    devError('[db] createParticipantRow: rpc failed', error)
    return null
  }

  const verify = await patchParticipant(
    sessionId,
    sessionSecret,
    { screens_time: {} },
    'createParticipantRow:verifyAccess'
  )

  if (isParticipantUpdateBlocked(verify)) {
    devWarn(
      '[db] createParticipantRow: verify PATCH blocked: session secret likely mismatches DB row'
    )
    return null
  }

  if (!verify.ok) {
    devError('[db] createParticipantRow: verify PATCH failed', verify.error)
    return null
  }

  return participantId
}

/** Fetch server-side progress flags for the current session (requires RPC in Supabase). */
export async function fetchParticipantProgress(sessionId, sessionSecret) {
  if (!sessionId || !sessionSecret) return null

  const { data, error } = await supabase.rpc('get_participant_progress', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
  })

  if (error) {
    devWarn('[db] fetchParticipantProgress:', error.message)
    return null
  }

  return data
}

export async function savePretest(sessionId, sessionSecret, answers, score) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    {
      pretest_answers: answers,
      pretest_score: score,
    },
    'savePretest'
  )
}

export async function savePosttest(sessionId, sessionSecret, answers, score) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    {
      posttest_answers: answers,
      posttest_score: score,
      completed_at: new Date().toISOString(),
    },
    'savePosttest'
  )
}

export async function saveScreenTime(sessionId, sessionSecret, screenTimes) {
  return patchParticipant(sessionId, sessionSecret, { screens_time: screenTimes }, 'saveScreenTime')
}

export async function saveLessonProgress(
  sessionId,
  sessionSecret,
  lessonsCompleted,
  scenariosAttempted
) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    {
      lessons_completed: lessonsCompleted,
      scenarios_attempted: scenariosAttempted,
    },
    'saveLessonProgress'
  )
}
