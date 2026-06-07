import type { ReactNode } from 'react'

export type ComponentCategory = 'ui' | 'ai-elements'

export type ComponentDemoEntry = {
  name: string
  title: string
  category: ComponentCategory
  description?: string
  demo?: () => ReactNode
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
