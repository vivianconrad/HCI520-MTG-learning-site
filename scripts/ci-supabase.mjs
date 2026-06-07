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

if (!dbUrl) {
  console.error(
    'Add SUPABASE_DB_URL (Supabase → Settings → Database → URI) so CI can run npm run apply:db-security before integration tests.'
  )
  process.exit(1)
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

run('node', ['scripts/apply-db-security.mjs'])
run('npm', ['run', 'test:supabase'])
