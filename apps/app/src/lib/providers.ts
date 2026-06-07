import type { ConnectionStatus, ProviderConfig, ProviderConfigMap, ProviderId } from '@firefly/ai'
import { createDefaultProviderConfig, createDefaultProviderConfigMap } from '@firefly/ai'
import type { ModelSelectorLogoProps } from '@firefly/ui'

export type { ConnectionStatus, ProviderConfig, ProviderConfigMap, ProviderId }
export { createDefaultProviderConfig, createDefaultProviderConfigMap }

export const AI_SDK_PROVIDERS_URL = 'https://ai-sdk.dev/providers/ai-sdk-providers'
export const FIREFLY_ISSUES_URL = 'https://github.com/litingyes/firefly/issues/new'

export type ProviderFieldType = 'password' | 'text' | 'url'

export interface ProviderField {
  key: string
  label: string
  type: ProviderFieldType
  placeholder?: string
  required?: boolean
  description?: string
}

export interface ProviderDefinition {
  id: ProviderId
  name: string
  description: string
  logo: ModelSelectorLogoProps['provider']
  docsUrl: string
  fields: ProviderField[]
}

export const PROVIDER_DEFINITIONS: ProviderDefinition[] = [
  {
    id: 'ai-gateway',
    name: 'Vercel AI Gateway',
    description: 'One API key for models across OpenAI, Anthropic, Google, and more.',
    logo: 'vercel',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'vck_...',
        required: true,
        description: 'From the Vercel AI Gateway dashboard. Sent as the Authorization header.',
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'https://ai-gateway.vercel.sh/v3/ai',
        description: 'Leave blank to use the default AI Gateway endpoint.',
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, o-series, and embeddings through @ai-sdk/openai.',
    logo: 'openai',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/openai',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'sk-...',
        required: true,
      },
      {
        key: 'organization',
        label: 'Organization ID',
        type: 'text',
        placeholder: 'org-...',
        description: 'Optional. Use when your key belongs to multiple organizations.',
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        description: 'Optional. Override the default OpenAI API endpoint.',
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models via @ai-sdk/anthropic.',
    logo: 'anthropic',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/anthropic',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'sk-ant-...',
        required: true,
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        description: 'Optional. Override the default Anthropic API endpoint.',
      },
    ],
  },
  {
    id: 'google',
    name: 'Google Generative AI',
    description: 'Gemini models through @ai-sdk/google.',
    logo: 'google',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'AIza...',
        required: true,
        description: 'From Google AI Studio.',
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'deepseek-chat and deepseek-reasoner via @ai-sdk/deepseek.',
    logo: 'deepseek',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/deepseek',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        required: true,
        description: 'From the DeepSeek platform.',
      },
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'https://api.deepseek.com',
        description: 'Leave blank to use the default DeepSeek endpoint.',
      },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local and remote Ollama models via ai-sdk-ollama.',
    logo: 'ollama',
    docsUrl: 'https://ai-sdk.dev/providers/community-providers/ollama',
    fields: [
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'http://localhost:11434',
        description:
          'Leave blank to use http://127.0.0.1:11434. No API key is required for a typical local install.',
      },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Hundreds of hosted models through @openrouter/ai-sdk-provider.',
    logo: 'openrouter',
    docsUrl: 'https://ai-sdk.dev/providers/community-providers/openrouter',
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        placeholder: 'sk-or-...',
        required: true,
        description: 'From the OpenRouter dashboard.',
      },
    ],
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI-compatible',
    description: 'Any endpoint that follows the OpenAI chat completions schema.',
    logo: 'lmstudio',
    docsUrl: 'https://ai-sdk.dev/providers/openai-compatible-providers',
    fields: [
      {
        key: 'baseUrl',
        label: 'Base URL',
        type: 'url',
        placeholder: 'http://localhost:8080/v1',
        required: true,
      },
      {
        key: 'apiKey',
        label: 'API key',
        type: 'password',
        description: 'Optional for local servers that do not require auth.',
      },
    ],
  },
]

export function getProviderDefinition(id: ProviderId): ProviderDefinition {
  const definition = PROVIDER_DEFINITIONS.find((provider) => provider.id === id)
  if (!definition) {
    throw new Error(`Unknown provider: ${id}`)
  }
  return definition
}

export function isProviderConfigured(
  definition: ProviderDefinition,
  config: ProviderConfig,
): boolean {
  return definition.fields
    .filter((field) => field.required)
    .every((field) => config.values[field.key]?.trim())
}

export function validateProviderConfig(
  definition: ProviderDefinition,
  config: ProviderConfig,
): string | null {
  if (!config.enabled) {
    return null
  }

  for (const field of definition.fields) {
    if (field.required && !config.values[field.key]?.trim()) {
      return `${field.label} is required for ${definition.name}.`
    }
  }

  return null
}
