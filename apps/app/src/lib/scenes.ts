import type { ModelRef } from '@firefly/ai/model-types'

export type ModelSceneId = 'chat' | 'intent' | 'context-compression'

export interface ModelSceneDefinition {
  id: ModelSceneId
  name: string
  description: string
  mode: 'multi' | 'single'
}

export const MODEL_SCENE_DEFINITIONS: ModelSceneDefinition[] = [
  {
    id: 'chat',
    name: 'Chat',
    description: 'Models users can switch between during a conversation.',
    mode: 'multi',
  },
  {
    id: 'intent',
    name: 'Intent recognition',
    description: 'A smaller model that classifies user intent before routing work.',
    mode: 'single',
  },
  {
    id: 'context-compression',
    name: 'Context compression',
    description: 'A smaller model that summarizes or trims long context windows.',
    mode: 'single',
  },
]

export type ModelSceneConfig = Record<ModelSceneId, ModelRef[]>

export function createDefaultModelSceneConfig(): ModelSceneConfig {
  return {
    chat: [],
    intent: [],
    'context-compression': [],
  }
}

export function getModelSceneDefinition(id: ModelSceneId): ModelSceneDefinition {
  const definition = MODEL_SCENE_DEFINITIONS.find((scene) => scene.id === id)
  if (!definition) {
    throw new Error(`Unknown model scene: ${id}`)
  }
  return definition
}
