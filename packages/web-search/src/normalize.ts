import type { ProviderSearchPayload, WebSearchOutput } from './types.js'

const MAX_CONTENT_LENGTH = 320

export function toWebSearchOutput(payload: ProviderSearchPayload): WebSearchOutput {
  const query = payload.query.trim()

  const results = payload.results
    .filter((result) => result.title.trim() && result.url.trim())
    .map((result) => ({
      title: result.title.trim(),
      url: result.url.trim(),
      content: capContent(result.content),
    }))

  return { query, results }
}

function capContent(content: string): string {
  const trimmed = content.trim()
  if (trimmed.length <= MAX_CONTENT_LENGTH) {
    return trimmed
  }
  return `${trimmed.slice(0, MAX_CONTENT_LENGTH).trimEnd()}…`
}
