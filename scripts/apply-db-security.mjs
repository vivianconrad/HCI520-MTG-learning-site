/**
 * Applies supabase/revoke-internal-rpc-execute.sql via direct Postgres connection.
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

const sqlPath = new URL('../supabase/revoke-internal-rpc-execute.sql', import.meta.url)
const sql = readFileSync(sqlPath, 'utf8')

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  await client.query(sql)
  console.log('Applied supabase/revoke-internal-rpc-execute.sql')
} catch (error) {
  console.error('Failed to apply Supabase security SQL:', error.message)
  process.exit(1)
} finally {
  await client.end()
}
