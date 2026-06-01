import { calculateScores } from './scoring.js'
import { getSupabaseClient, isSupabaseConfigured } from './supabase.js'

export async function submitLearningSession({
  sessionId,
  selectedQuestions,
  pretestAnswers,
  posttestAnswers,
}) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'not_configured' }
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return { ok: false, skipped: true, reason: 'not_configured' }
  }

  const scores = calculateScores(selectedQuestions, pretestAnswers, posttestAnswers)
  const questionIds = selectedQuestions.map((q) => q.id)

  const payload = {
    session_id: sessionId,
    question_ids: questionIds,
    pretest_answers: pretestAnswers,
    posttest_answers: posttestAnswers,
    pretest_correct: scores.pretestCorrect,
    posttest_correct: scores.posttestCorrect,
    gain: scores.posttestCorrect - scores.pretestCorrect,
    lo_scores: scores.loScores,
    submitted_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('learning_sessions').upsert(payload, {
    onConflict: 'session_id',
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, scores }
}
