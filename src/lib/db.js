import { nanoid } from 'nanoid'
import { supabase } from './supabase'

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
        'Run supabase/fix-participants-rls.sql in the Supabase SQL Editor.',
    )
  }

  return result
}

export async function createParticipantRow(sessionId, sessionSecret, selectedQuestions) {
  devLog(
    '[db] createParticipantRow: sessionId=',
    sessionId,
    'questionCount=',
    selectedQuestions?.length ?? 0,
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
  const { data, error, status } = await supabase.from('participants').upsert(
    {
      participant_id: participantId,
      session_id: sessionId,
      session_secret: sessionSecret,
      selected_questions: selectedQuestions,
      created_at: new Date().toISOString(),
    },
    { onConflict: 'session_id', ignoreDuplicates: true },
  )

  devLog('[db] createParticipantRow: response', { status, error, data })

  if (error) {
    devError('[db] createParticipantRow: upsert failed', error)
    return null
  }

  return participantId
}

export async function savePretest(sessionId, sessionSecret, answers, score) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    {
      pretest_answers: answers,
      pretest_score: score,
    },
    'savePretest',
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
    'savePosttest',
  )
}

export async function saveScreenTime(sessionId, sessionSecret, screenTimes) {
  return patchParticipant(sessionId, sessionSecret, { screens_time: screenTimes }, 'saveScreenTime')
}

export async function saveLessonProgress(
  sessionId,
  sessionSecret,
  lessonsCompleted,
  scenariosAttempted,
) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    {
      lessons_completed: lessonsCompleted,
      scenarios_attempted: scenariosAttempted,
    },
    'saveLessonProgress',
  )
}
