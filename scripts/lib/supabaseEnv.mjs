import { existsSync, readFileSync } from 'fs'

/** Load Supabase env from process.env first, then `.env.local`. */
export function loadSupabaseEnv() {
  const fromProcess = {
    url: process.env.VITE_SUPABASE_URL?.trim() || '',
    key: process.env.VITE_SUPABASE_ANON_KEY?.trim() || '',
  }

  if (fromProcess.url && fromProcess.key) {
    return fromProcess
  }

  if (!existsSync('.env.local')) {
    return fromProcess
  }

  const fileEnv = Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=')
        return [line.slice(0, index), line.slice(index + 1)]
      })
  )

  return {
    url: fromProcess.url || fileEnv.VITE_SUPABASE_URL?.trim() || '',
    key: fromProcess.key || fileEnv.VITE_SUPABASE_ANON_KEY?.trim() || '',
  }
}
