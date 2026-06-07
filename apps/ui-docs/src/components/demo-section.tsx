import type { ReactNode } from 'react'

import { docsType } from '@/lib/docs-type'

interface DemoSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function DemoSection({ title, description, children }: DemoSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className={docsType.sectionTitle}>{title}</h3>
        {description ? (
          <p className={`${docsType.meta} text-muted-foreground`}>{description}</p>
        ) : null}
      </div>
      <div className="rounded-lg border border-border bg-background p-6">{children}</div>
    </section>
  )
}
