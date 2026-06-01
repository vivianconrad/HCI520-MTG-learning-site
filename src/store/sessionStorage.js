const STORAGE_KEY = 'hci520-mtg-session'

export function loadPersistedSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function persistSession(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or unavailable — session continues in memory only
  }
}

export function clearPersistedSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}
