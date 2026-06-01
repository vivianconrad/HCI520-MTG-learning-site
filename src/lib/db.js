import { supabase } from './supabase'
import { nanoid } from 'nanoid'

export async function createParticipantRow(sessionId, selectedQuestions) {
  const participantId = nanoid(10)
  const { error } = await supabase.from('participants').insert({
    participant_id: participantId,
    session_id: sessionId,
    selected_questions: selectedQuestions,
    created_at: new Date().toISOString(),
  })
  if (error) console.error('Error creating participant row:', error)
  return participantId
}

export async function savePretest(sessionId, answers, score) {
  const { error } = await supabase
    .from('participants')
    .update({
      pretest_answers: answers,
      pretest_score: score,
    })
    .eq('session_id', sessionId)
  if (error) console.error('Error saving pretest:', error)
}

export async function savePosttest(sessionId, answers, score) {
  const { error } = await supabase
    .from('participants')
    .update({
      posttest_answers: answers,
      posttest_score: score,
      completed_at: new Date().toISOString(),
    })
    .eq('session_id', sessionId)
  if (error) console.error('Error saving posttest:', error)
}

export async function saveScreenTime(sessionId, screenTimes) {
  const { error } = await supabase
    .from('participants')
    .update({ screens_time: screenTimes })
    .eq('session_id', sessionId)
  if (error) console.error('Error saving screen time:', error)
}

export async function saveLessonProgress(sessionId, lessonsCompleted, scenariosAttempted) {
  const { error } = await supabase
    .from('participants')
    .update({
      lessons_completed: lessonsCompleted,
      scenarios_attempted: scenariosAttempted,
    })
    .eq('session_id', sessionId)
  if (error) console.error('Error saving lesson progress:', error)
}
