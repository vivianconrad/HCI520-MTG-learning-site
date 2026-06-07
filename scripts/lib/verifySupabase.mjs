import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import ws from 'ws'

function defaultSelectedQuestions() {
  return Array.from({ length: 10 }, (_, index) => ({
    id: `verify_q${index + 1}`,
    lo: 'LO0',
    correctIndex: 0,
  }))
}

function check(name, ok, message) {
  return { name, ok, message }
}

/**
 * Verifies live Supabase connectivity plus participant RLS and RPC behavior.
 * Creates a throwaway session row via register_participant.
 */
export async function verifySupabaseParticipantApi(client, options = {}) {
  const checks = []
  const sessionId = options.sessionId ?? `VERIFY${Date.now().toString(36).toUpperCase().slice(-6)}`
  const sessionSecret = options.sessionSecret ?? randomBytes(16).toString('hex')
  const selectedQuestions = options.selectedQuestions ?? defaultSelectedQuestions()

  const selectAttempt = await client.from('participants').select('session_id').limit(5)
  if (selectAttempt.error) {
    checks.push(
      check('select_denied', false, `SELECT returned error: ${selectAttempt.error.message}`)
    )
  } else if (selectAttempt.data?.length > 0) {
    checks.push(
      check(
        'select_denied',
        false,
        `SELECT returned ${selectAttempt.data.length} row(s); remove permissive SELECT policies`
      )
    )
  } else {
    checks.push(check('select_denied', true, 'SELECT denied (empty result set)'))
  }

  const directInsert = await client.from('participants').insert({
    participant_id: 'direct1',
    session_id: `${sessionId}_DIRECT`,
    session_secret: sessionSecret,
    selected_questions: selectedQuestions,
  })
  if (!directInsert.error) {
    checks.push(
      check('insert_blocked', false, 'Direct anon INSERT succeeded; use register_participant RPC')
    )
  } else {
    checks.push(
      check(
        'insert_blocked',
        true,
        `Direct INSERT blocked (${directInsert.error.code ?? directInsert.error.message})`
      )
    )
  }

  const register = await client.rpc('register_participant', {
    p_participant_id: 'verify1',
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_selected_questions: selectedQuestions,
  })
  if (register.error) {
    checks.push(
      check(
        'register_participant',
        false,
        `${register.error.message}. Re-run supabase/setup.sql in the Supabase SQL editor.`
      )
    )
    return { ok: false, checks, sessionId, sessionSecret }
  }
  checks.push(check('register_participant', true, 'register_participant RPC succeeded'))

  const directUpdate = await client
    .from('participants')
    .update({ pretest_score: 99 })
    .eq('session_id', sessionId)
    .select('pretest_score')

  const directUpdateRows = directUpdate.data ?? []
  if (directUpdate.error) {
    checks.push(
      check(
        'direct_update_blocked',
        true,
        `Direct UPDATE blocked (${directUpdate.error.code ?? directUpdate.error.message})`
      )
    )
  } else if (directUpdateRows.length > 0) {
    checks.push(
      check(
        'direct_update_blocked',
        false,
        'Direct anon UPDATE modified participant row(s). Run supabase/revoke-anon-direct-update.sql.'
      )
    )
  } else {
    // PostgREST often returns HTTP 200 with zero rows when RLS denies UPDATE.
    const progressAfterDirectUpdate = await client.rpc('get_participant_progress', {
      p_session_id: sessionId,
      p_session_secret: sessionSecret,
    })
    if (progressAfterDirectUpdate.data?.pretest_score === 99) {
      checks.push(
        check(
          'direct_update_blocked',
          false,
          'Direct anon UPDATE changed pretest_score via REST. Run supabase/revoke-anon-direct-update.sql.'
        )
      )
    } else {
      checks.push(check('direct_update_blocked', true, 'Direct UPDATE blocked (0 rows affected)'))
    }
  }

  const update = await client.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: { screens_time: { verify: 1 } },
  })
  if (update.error) {
    checks.push(
      check(
        'update_participant',
        false,
        `${update.error.message}. Run supabase/fix-participants-rls.sql or supabase/setup.sql.`
      )
    )
  } else if (update.data !== true) {
    checks.push(
      check(
        'update_participant',
        false,
        'update_participant returned false (wrong secret, missing row, or RPC not deployed)'
      )
    )
  } else {
    checks.push(check('update_participant', true, 'update_participant RPC succeeded'))
  }

  if (update.error && /could not find the function/i.test(update.error.message)) {
    checks.push(
      check(
        'score_validation',
        false,
        'Score validation not tested: deploy update_participant first'
      )
    )
  } else {
    const badScore = await client.rpc('update_participant', {
      p_session_id: sessionId,
      p_session_secret: sessionSecret,
      p_patch: {
        pretest_answers: { verify_q1: 0 },
        pretest_score: 10,
      },
    })
    const scoreRejected =
      badScore.error &&
      (/pretest_score does not match/i.test(badScore.error.message) ||
        /pretest_score must be between/i.test(badScore.error.message))

    if (scoreRejected) {
      checks.push(
        check('score_validation', true, `Tampered pretest_score rejected (${badScore.error.message})`)
      )
    } else if (badScore.data === true) {
      checks.push(
        check(
          'score_validation',
          false,
          'Server accepted a tampered pretest_score; re-run supabase/setup.sql'
        )
      )
    } else if (badScore.error) {
      checks.push(check('score_validation', false, `Unexpected score validation error: ${badScore.error.message}`))
    } else {
      checks.push(
        check('score_validation', false, 'Mismatched pretest_score was not rejected')
      )
    }
  }

  const progress = await client.rpc('get_participant_progress', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
  })
  if (progress.error) {
    checks.push(check('get_participant_progress', false, progress.error.message))
  } else if (!progress.data || typeof progress.data !== 'object') {
    checks.push(check('get_participant_progress', false, 'RPC returned no progress object'))
  } else {
    checks.push(check('get_participant_progress', true, 'get_participant_progress RPC succeeded'))
  }

  const pretestSave = await client.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: {
      pretest_answers: { verify_q1: 0 },
      pretest_score: 1,
    },
  })
  if (pretestSave.error) {
    checks.push(check('pretest_save', false, pretestSave.error.message))
  } else if (pretestSave.data !== true) {
    checks.push(check('pretest_save', false, 'pretest save returned false'))
  } else {
    checks.push(check('pretest_save', true, 'pretest save succeeded'))
  }

  const lessonSkip = await client.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: { lessons_completed: true, scenarios_attempted: 0 },
  })
  if (lessonSkip.error) {
    checks.push(
      check(
        'lessons_completed_optional_practice',
        false,
        `${lessonSkip.error.message}. Run supabase/migrations/relax-lessons-completed-scenarios.sql.`
      )
    )
  } else if (lessonSkip.data !== true) {
    checks.push(
      check('lessons_completed_optional_practice', false, 'lessons_completed with 0 scenarios returned false')
    )
  } else {
    checks.push(
      check(
        'lessons_completed_optional_practice',
        true,
        'lessons_completed with optional practice skipped'
      )
    )
  }

  const posttestSave = await client.rpc('update_participant', {
    p_session_id: sessionId,
    p_session_secret: sessionSecret,
    p_patch: {
      posttest_answers: { verify_q1: 0 },
      posttest_score: 1,
      completed_at: new Date().toISOString(),
    },
  })
  if (posttestSave.error) {
    checks.push(check('posttest_save', false, posttestSave.error.message))
  } else if (posttestSave.data !== true) {
    checks.push(check('posttest_save', false, 'posttest save returned false'))
  } else {
    checks.push(check('posttest_save', true, 'posttest save after lessons succeeded'))
  }

  return {
    ok: checks.every((entry) => entry.ok),
    checks,
    sessionId,
    sessionSecret,
  }
}

export function createSupabaseClient(url, key) {
  const options =
    typeof globalThis.WebSocket === 'undefined' ? { realtime: { transport: ws } } : {}
  return createClient(url, key, options)
}
