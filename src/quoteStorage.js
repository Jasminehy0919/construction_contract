const STORAGE_KEY = 'zero_construction_quotes'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAll(quotes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
}

export function saveQuote(quote) {
  if (!quote?.projectNumber?.trim()) return false
  const key = quote.projectNumber.trim()
  const all = readAll()
  all[key] = {
    ...quote,
    projectNumber: key,
    savedAt: quote.savedAt || new Date().toISOString(),
  }
  writeAll(all)
  return true
}

export function getQuote(projectNumber) {
  if (!projectNumber?.trim()) return null
  return readAll()[projectNumber.trim()] || null
}

export function listQuotes() {
  return Object.values(readAll()).sort(
    (a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0)
  )
}

export function deleteQuote(projectNumber) {
  if (!projectNumber?.trim()) return false
  const all = readAll()
  if (!all[projectNumber.trim()]) return false
  delete all[projectNumber.trim()]
  writeAll(all)
  return true
}

export function formatQuoteLabel(quote) {
  const date = quote.savedAt
    ? new Date(quote.savedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date'
  const client = quote.clientName?.trim() || 'No client name'
  return `${quote.projectNumber} — ${client} — ${date}`
}
