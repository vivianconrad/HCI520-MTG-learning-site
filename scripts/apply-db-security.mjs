/**
 * Applies supabase/setup.sql via direct Postgres connection so CI and deploy
 * stay aligned with the repo (RLS, RPCs, private hash helper, retention).
 *
 * Requires SUPABASE_DB_URL (URI from Supabase → Project Settings → Database).
 */
import { readFileSync } from 'fs'
import pg from 'pg'

const connectionString = process.env.SUPABASE_DB_URL?.trim()
if (!connectionString) {
  console.error(
    'Missing SUPABASE_DB_URL. Use the PostgreSQL URI from Supabase Dashboard → Project Settings → Database.'
  )
  process.exit(1)
}

const sqlPath = new URL('../supabase/setup.sql', import.meta.url)
const sql = readFileSync(sqlPath, 'utf8')

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  await client.query(sql)
  console.log('Applied supabase/setup.sql')

  const { rows } = await client.query(
    `select to_regprocedure('public.hash_session_secret(text)') is not null as public_hash_exists`
  )
  if (rows[0]?.public_hash_exists) {
    console.error('public.hash_session_secret still exists after setup.sql')
    process.exit(1)
  }
} catch (error) {
  console.error('Failed to apply Supabase setup SQL:', error.message)
  process.exit(1)
} finally {
  await client.end()
}
