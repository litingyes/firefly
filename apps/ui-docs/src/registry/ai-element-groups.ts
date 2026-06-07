export type AiElementGroupId = 'chat' | 'tools' | 'debug' | 'flow' | 'media'

export type AiElementGroup = {
  id: AiElementGroupId
  label: string
  description: string
  items: readonly string[]
}

export const AI_ELEMENT_GROUPS: AiElementGroup[] = [
  {
    id: 'chat',
    label: 'Chat',
    description: 'Messages, input, and conversation surfaces',
    items: [
      'message',
      'conversation',
      'prompt-input',
      'suggestion',
      'persona',
      'attachments',
      'confirmation',
      'sources',
      'inline-citation',
      'open-in-chat',
      'speech-input',
      'transcription',
      'voice-selector',
      'mic-selector',
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    description: 'Agents, tool calls, and task orchestration',
    items: [
      'agent',
      'tool',
      'toolbar',
      'task',
      'queue',
      'plan',
      'reasoning',
      'chain-of-thought',
      'controls',
      'sandbox',
      'web-preview',
      'model-selector',
      'context',
    ],
  },
  {
    id: 'flow',
    label: 'Flow',
    description: 'Graphs, panels, and structured layouts',
    items: ['node', 'edge', 'canvas', 'artifact', 'panel', 'connection'],
  },
  {
    id: 'debug',
    label: 'Debug',
    description: 'Logs, traces, and developer diagnostics',
    items: [
      'terminal',
      'stack-trace',
      'test-results',
      'schema-display',
      'environment-variables',
      'package-info',
      'commit',
      'checkpoint',
      'file-tree',
      'snippet',
      'code-block',
      'jsx-preview',
    ],
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Audio, images, and loading effects',
    items: ['image', 'audio-player', 'shimmer'],
  },
]

export function getAiGroupForName(name: string): AiElementGroup | undefined {
  return AI_ELEMENT_GROUPS.find((group) => group.items.includes(name))
}
