import { describe, expect, it } from 'vitest'
import { loadSupabaseEnv } from '../scripts/lib/supabaseEnv.mjs'
import { createSupabaseClient, verifySupabaseParticipantApi } from '../scripts/lib/verifySupabase.mjs'

const env = loadSupabaseEnv()
const hasCredentials = Boolean(env.url && env.key)

describe('Supabase connection', () => {
  it.skipIf(!process.env.CI && !hasCredentials)(
    'reaches the project and participant RPCs work with expected RLS',
    async () => {
      const client = createSupabaseClient(env.url, env.key)
      const result = await verifySupabaseParticipantApi(client)

      for (const entry of result.checks) {
        expect(entry.ok, `${entry.name}: ${entry.message}`).toBe(true)
      }
      expect(result.ok).toBe(true)
    },
    60_000
  )

  it.skipIf(!process.env.CI || hasCredentials)(
    'has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY configured in CI',
    () => {
      expect(env.url, 'Set VITE_SUPABASE_URL repository secret for Supabase tests').toBeTruthy()
      expect(env.key, 'Set VITE_SUPABASE_ANON_KEY repository secret for Supabase tests').toBeTruthy()
    }
  )
})
