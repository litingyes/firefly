import { aiDemos } from '@/registry/load-demos'
import { AI_ELEMENT_NAMES } from '@/registry/names'
import type { ComponentDemoEntry } from '@/registry/types'
import { slugToTitle } from '@/registry/types'

export const aiElementRegistry: ComponentDemoEntry[] = AI_ELEMENT_NAMES.map((name) => ({
  name,
  title: slugToTitle(name),
  category: 'ai-elements' as const,
  demo: aiDemos[name],
}))
