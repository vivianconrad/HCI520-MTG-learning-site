import { nanoid } from 'nanoid'
import { attachAnswerKeys } from './questionKeys.js'
import { supabase } from './supabase'

/** True when PATCH succeeded at HTTP level but RLS blocked the update (wrong session secret or missing row). */
export function isParticipantUpdateBlocked(result) {
  return Boolean(result && result.ok === false && result.rowsUpdated === 0)
}

export const SESSION_CONFLICT_CODE = 'session_conflict'

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
 * Save participant fields via update_participant RPC (REST PATCH cannot work when
 * SELECT is denied by RLS — PostgreSQL requires row visibility for UPDATE).
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

  const { data, error } = await supabase.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: payload,
  })

  if (error) {
    devError(`[db] ${logLabel}: rpc failed`, error)
    return { ok: false, rowsUpdated: 0, error: error.message }
  }

  const rowsUpdated = data ? 1 : 0
  const result = { ok: rowsUpdated > 0, rowsUpdated, error: null }
  devLog(`[db] ${logLabel}: response`, result)

  if (rowsUpdated === 0) {
    devWarn(
      `[db] ${logLabel}: 0 rows updated: wrong session secret, missing row, or ` +
        'update_participant RPC not deployed. Re-run supabase/setup.sql in Supabase SQL Editor.'
    )
  }

  return result
}

function isSessionConflictError(error) {
  if (!error) return false
  return (
    error.code === '23505' ||
    /session_id already registered/i.test(error.message ?? '') ||
    /duplicate key/i.test(error.message ?? '')
  )
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

/** Persist lesson completion, scenario count, and screen times in one RPC (atomic). */
export async function saveLessonComplete(
  sessionId,
  sessionSecret,
  scenariosAttempted,
  screenTimes,
  posttestReadiness = null
) {
  const payload = {
    lessons_completed: true,
    scenarios_attempted: scenariosAttempted,
    screens_time: screenTimes,
  }
  if (posttestReadiness != null) {
    payload.posttest_readiness = posttestReadiness
  }
  return patchParticipant(sessionId, sessionSecret, payload, 'saveLessonComplete')
}

export async function saveCuriosityFocus(sessionId, sessionSecret, curiosityFocus) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    { curiosity_focus: curiosityFocus },
    'saveCuriosityFocus'
  )
}

export async function savePosttestReadiness(sessionId, sessionSecret, posttestReadiness) {
  return patchParticipant(
    sessionId,
    sessionSecret,
    { posttest_readiness: posttestReadiness },
    'savePosttestReadiness'
  )
}
