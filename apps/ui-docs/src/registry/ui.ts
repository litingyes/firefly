import { uiDemos } from '@/registry/load-demos'
import { UI_COMPONENT_NAMES } from '@/registry/names'
import type { ComponentDemoEntry } from '@/registry/types'
import { slugToTitle } from '@/registry/types'

export const uiRegistry: ComponentDemoEntry[] = UI_COMPONENT_NAMES.map((name) => ({
  name,
  title: slugToTitle(name),
  category: 'ui' as const,
  demo: uiDemos[name],
}))
