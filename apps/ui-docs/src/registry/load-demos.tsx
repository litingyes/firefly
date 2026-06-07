import type { ComponentType, ReactNode } from 'react'

const uiModules = import.meta.glob('../demos/ui/*.tsx', { eager: true })
const aiModules = import.meta.glob('../demos/ai-elements/*.tsx', { eager: true })

function loadDemos(modules: Record<string, unknown>): Record<string, () => ReactNode> {
  const demos: Record<string, () => ReactNode> = {}

  for (const [path, mod] of Object.entries(modules)) {
    const name = path.split('/').pop()?.replace('.tsx', '') ?? ''
    if (name.startsWith('_')) continue

    const Demo = Object.values(mod as Record<string, unknown>).find(
      (value) => typeof value === 'function',
    ) as ComponentType | undefined

    if (Demo) {
      demos[name] = () => <Demo />
    }
  }

  return demos
}

export const uiDemos = loadDemos(uiModules)
export const aiDemos = loadDemos(aiModules)
