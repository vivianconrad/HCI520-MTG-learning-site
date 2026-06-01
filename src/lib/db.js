import { nanoid } from 'nanoid'
import { supabase } from './supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * PATCH participants by session_id and log how many rows were updated.
 * Uses Prefer: count=exact because SELECT is denied by RLS on this table.
 */
async function patchParticipant(sessionId, payload, logLabel) {
  console.log(`[db] ${logLabel}: sessionId=`, sessionId, 'payload=', payload)

  if (!sessionId) {
    console.error(`[db] ${logLabel}: aborted — sessionId is missing`)
    return { ok: false, rowsUpdated: 0, error: 'missing sessionId' }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(`[db] ${logLabel}: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY`)
    return { ok: false, rowsUpdated: 0, error: 'missing env' }
  }

  const filter = `session_id=eq.${encodeURIComponent(sessionId)}`
  const res = await fetch(`${supabaseUrl}/rest/v1/participants?${filter}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
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
    console.error(`[db] ${logLabel}: HTTP ${res.status}`, errorBody)
  }

  const result = {
    ok: res.ok && rowsUpdated > 0,
    status: res.status,
    rowsUpdated,
    error: errorBody,
  }
  console.log(`[db] ${logLabel}: response`, result)

  if (res.ok && rowsUpdated === 0) {
    console.warn(
      `[db] ${logLabel}: 0 rows updated — participant row missing or UPDATE blocked by RLS. ` +
        'Run supabase/fix-participants-rls.sql in the Supabase SQL Editor.',
    )
  }

  return result
}

export async function createParticipantRow(sessionId, selectedQuestions) {
  console.log(
    '[db] createParticipantRow: sessionId=',
    sessionId,
    'questionCount=',
    selectedQuestions?.length ?? 0,
  )

  if (!sessionId) {
    console.error('[db] createParticipantRow: missing sessionId')
    return null
  }
  if (!selectedQuestions?.length) {
    console.error('[db] createParticipantRow: selectedQuestions not ready')
    return null
  }

  const participantId = nanoid(10)
  const { data, error, status } = await supabase.from('participants').upsert(
    {
      participant_id: participantId,
      session_id: sessionId,
      selected_questions: selectedQuestions,
      created_at: new Date().toISOString(),
    },
    { onConflict: 'session_id', ignoreDuplicates: true },
  )

  console.log('[db] createParticipantRow: response', { status, error, data })

  if (error) {
    console.error('[db] createParticipantRow: upsert failed', error)
    return null
  }

  return participantId
}

export async function savePretest(sessionId, answers, score) {
  return patchParticipant(
    sessionId,
    {
      pretest_answers: answers,
      pretest_score: score,
    },
    'savePretest',
  )
}

export async function savePosttest(sessionId, answers, score) {
  return patchParticipant(
    sessionId,
    {
      posttest_answers: answers,
      posttest_score: score,
      completed_at: new Date().toISOString(),
    },
    'savePosttest',
  )
}

export async function saveScreenTime(sessionId, screenTimes) {
  return patchParticipant(sessionId, { screens_time: screenTimes }, 'saveScreenTime')
}

export async function saveLessonProgress(sessionId, lessonsCompleted, scenariosAttempted) {
  return patchParticipant(
    sessionId,
    {
      lessons_completed: lessonsCompleted,
      scenarios_attempted: scenariosAttempted,
    },
    'saveLessonProgress',
  )
}
