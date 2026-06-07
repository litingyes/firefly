export interface ChatCompletionMatch {
  completion: string
  label: string
}

const CHAT_COMPLETIONS: ChatCompletionMatch[] = [
  {
    label: 'Explain a concept',
    completion: 'Explain this concept in simple terms, with one concrete example.',
  },
  {
    label: 'Summarize text',
    completion: 'Summarize the key points from this text in three short bullets.',
  },
  {
    label: 'Debug code',
    completion: 'Help me debug this error and suggest the smallest fix.',
  },
  {
    label: 'Refactor code',
    completion: 'Refactor this code for clarity without changing behavior.',
  },
  {
    label: 'Write tests',
    completion: 'Write focused unit tests for this function, including edge cases.',
  },
  {
    label: 'Compare options',
    completion: 'Compare these options and recommend one with trade-offs.',
  },
  {
    label: 'Draft message',
    completion: 'Draft a concise message that states the ask and next step.',
  },
  {
    label: 'Translate',
    completion: 'Translate this to natural English while keeping the original tone.',
  },
]

export const CHAT_STARTER_SUGGESTIONS = [
  'Explain how async Rust works',
  'Summarize this meeting note',
  'Debug a TypeScript type error',
  'Draft a short status update',
] as const

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

export function matchChatCompletion(input: string): ChatCompletionMatch | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  const normalizedInput = normalize(trimmed)

  for (const entry of CHAT_COMPLETIONS) {
    const normalizedCompletion = normalize(entry.completion)
    if (
      normalizedCompletion.startsWith(normalizedInput) &&
      normalizedCompletion !== normalizedInput
    ) {
      return {
        label: entry.label,
        completion: entry.completion.slice(trimmed.length),
      }
    }
  }

  return null
}

export function listChatCompletionSuggestions(input: string): ChatCompletionMatch[] {
  const trimmed = input.trim()
  if (!trimmed) {
    return CHAT_COMPLETIONS.slice(0, 4)
  }

  const normalizedInput = normalize(trimmed)
  return CHAT_COMPLETIONS.filter((entry) =>
    normalize(entry.completion).includes(normalizedInput),
  ).slice(0, 4)
}
