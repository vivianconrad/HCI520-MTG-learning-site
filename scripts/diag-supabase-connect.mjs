/**
 * One-off connectivity diagnostic — prints host/DNS/fetch status only (no secrets).
 * Usage: node scripts/diag-supabase-connect.mjs
 */
import dns from 'node:dns/promises'
import { loadSupabaseEnv } from './lib/supabaseEnv.mjs'

const env = loadSupabaseEnv()
const report = {
  hasUrl: Boolean(env.url),
  hasKey: Boolean(env.key),
  keyLength: env.key?.length ?? 0,
}

if (!env.url || !env.key) {
  console.log(JSON.stringify({ ...report, error: 'missing_credentials' }, null, 2))
  process.exit(1)
}

let parsed
try {
  parsed = new URL(env.url)
} catch (error) {
  console.log(
    JSON.stringify(
      { ...report, error: 'invalid_url', message: error.message },
      null,
      2
    )
  )
  process.exit(1)
}

report.hostname = parsed.hostname
report.protocol = parsed.protocol
report.pathname = parsed.pathname
report.urlHasTrailingSlash = env.url.endsWith('/')
report.urlHasQuotes = /^["']|["']$/.test(env.url.trim())
report.placeholderUrl = /your-project|example\.supabase/i.test(env.url)
report.keyLooksPlaceholder = /your-anon|e2e-dummy/i.test(env.key)

try {
  const addrs = await dns.lookup(parsed.hostname, { all: true })
  report.dns = addrs.map((entry) => ({ address: entry.address, family: entry.family }))
} catch (error) {
  report.dnsError = error.message
}

const healthUrl = `${env.url.replace(/\/$/, '')}/rest/v1/`
const started = Date.now()
try {
  const response = await fetch(healthUrl, {
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(15_000),
  })
  report.fetch = {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    ms: Date.now() - started,
  }
} catch (error) {
  report.fetch = {
    failed: true,
    message: error.message,
    name: error.name,
    code: error.code,
    cause: error.cause
      ? {
          message: error.cause.message,
          code: error.cause.code,
          errno: error.cause.errno,
        }
      : undefined,
    ms: Date.now() - started,
  }
}

console.log(JSON.stringify(report, null, 2))
