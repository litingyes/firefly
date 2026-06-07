import type { ReactNode } from 'react'

interface DemoSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function DemoSection({ title, description, children }: DemoSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      <div className="rounded-lg border border-border bg-background p-6">{children}</div>
    </section>
  )
}
