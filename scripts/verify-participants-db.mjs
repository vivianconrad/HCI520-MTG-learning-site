/**
 * Verifies production RLS + hardened participant API.
 * Run: node scripts/verify-participants-db.mjs
 * Requires supabase/setup.sql applied in Supabase (or supabase/fix-participants-rls.sql
 * for the update_participant RPC, plus setup.sql for the validation trigger).
 */
import { loadSupabaseEnv } from './lib/supabaseEnv.mjs'
import { createSupabaseClient, verifySupabaseParticipantApi } from './lib/verifySupabase.mjs'

const env = loadSupabaseEnv()

if (!env.url || !env.key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local or environment')
  process.exit(1)
}

const client = createSupabaseClient(env.url, env.key)
const result = await verifySupabaseParticipantApi(client)

for (const entry of result.checks) {
  if (entry.ok) {
    console.log(`OK: ${entry.message}`)
  } else {
    console.error(`FAIL: ${entry.message}`)
  }
}

console.log('')
if (!result.ok) {
  console.error(
    'One or more checks failed. Run supabase/setup.sql in the Supabase SQL Editor, or set SUPABASE_DB_URL and run npm run apply:db-security. For CI, add the SUPABASE_DB_URL repository secret (Database URI). Also see supabase/fix-participants-rls.sql.\n'
  )
  process.exit(1)
}

console.log('All participant security checks passed.\n')
