/**
 * CI/deploy Supabase prep: apply setup.sql when SUPABASE_DB_URL is set, then run
 * integration tests. Checks env vars in-process (GitHub Actions forbids secrets in if:).
 */
import { spawnSync } from 'node:child_process'

const viteUrl = process.env.VITE_SUPABASE_URL?.trim() ?? ''
const viteKey = process.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''
const dbUrl = process.env.SUPABASE_DB_URL?.trim() ?? ''
const hasViteCreds = Boolean(viteUrl && viteKey)

if (!hasViteCreds) {
  console.log('Skipping Supabase integration tests (VITE_SUPABASE_* not configured).')
  process.exit(0)
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (dbUrl) {
  run('node', ['scripts/apply-db-security.mjs'])
} else {
  console.warn(
    'SUPABASE_DB_URL not set — skipping npm run apply:db-security.\n' +
      'Either add repository secret SUPABASE_DB_URL (Supabase → Project Settings → Database → Direct connection URI),\n' +
      'or run supabase/setup.sql once in the Supabase SQL editor so integration tests match the repo.'
  )
}

run('npm', ['run', 'test:supabase'])
