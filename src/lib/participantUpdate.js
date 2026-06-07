/** True when PATCH succeeded at HTTP level but RLS blocked the update (wrong session secret or missing row). */
export function isParticipantUpdateBlocked(result) {
  return Boolean(result && result.ok === false && result.rowsUpdated === 0)
}
