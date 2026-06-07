import { Badge } from '@firefly/ui/components/ui/badge'
import { useParams } from 'react-router-dom'

import { findComponent } from '@/registry'
import type { ComponentCategory } from '@/registry/types'

export function ComponentPage() {
  const { category, name } = useParams<{ category: ComponentCategory; name: string }>()

  if (!category || !name || (category !== 'ui' && category !== 'ai-elements')) {
    return <p className="text-muted-foreground text-sm">Component not found.</p>
  }

  const entry = findComponent(category, name)

  if (!entry) {
    return <p className="text-muted-foreground text-sm">Component not found.</p>
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-semibold text-2xl tracking-tight">{entry.title}</h1>
          <Badge variant="secondary">{category === 'ui' ? 'UI' : 'AI Element'}</Badge>
        </div>
        <p className="font-mono text-muted-foreground text-xs">
          @firefly/ui/components/{category}/{entry.name}
        </p>
      </header>

      {entry.demo?.()}
    </div>
  )
}
