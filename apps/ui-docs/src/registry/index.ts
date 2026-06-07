import { aiElementRegistry } from '@/registry/ai-elements'
import type { ComponentCategory, ComponentDemoEntry } from '@/registry/types'
import { uiRegistry } from '@/registry/ui'

export function getRegistry(category: ComponentCategory): ComponentDemoEntry[] {
  return category === 'ui' ? uiRegistry : aiElementRegistry
}

export function findComponent(
  category: ComponentCategory,
  name: string,
): ComponentDemoEntry | undefined {
  return getRegistry(category).find((entry) => entry.name === name)
}

export const allRegistries = {
  ui: uiRegistry,
  'ai-elements': aiElementRegistry,
} as const
